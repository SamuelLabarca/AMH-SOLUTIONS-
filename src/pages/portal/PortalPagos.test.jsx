import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PortalPagos from "./PortalPagos.jsx";
import { reiniciarDemo, validarContrasena } from "../../servicios/autenticacion.js";
import { normalizarDocumento } from "../../servicios/portalPagos.js";

/* Todo corre contra el MODO_DEMO: sin VITE_API_URL en los tests. */

function abrir(ruta = "/portal-de-pagos") {
  const usuario = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/portal-de-pagos/*" element={<PortalPagos />} />
        <Route path="/tienda" element={<p>Tienda</p>} />
      </Routes>
    </MemoryRouter>,
  );
  return usuario;
}

async function entrar(usuario, correo = "maria@demo.com", contrasena = "Demo1234") {
  await usuario.type(await screen.findByLabelText(/^Correo/), correo);
  await usuario.type(screen.getByLabelText(/^Contraseña/), contrasena);
  await usuario.click(screen.getByRole("button", { name: "Entrar" }));
}

beforeEach(() => reiniciarDemo());

describe("reglas", () => {
  it("normaliza el documento", () => {
    expect(normalizarDocumento("v", " 12.345.678 ")).toBe("V-12345678");
  });

  it("exige 8 caracteres con letras y números", () => {
    expect(validarContrasena("corta1")).toMatch(/8 caracteres/);
    expect(validarContrasena("sololetras")).toMatch(/letras y números/);
    expect(validarContrasena("Segura123")).toBeNull();
  });
});

describe("Portal de pagos — sesión", () => {
  it("sin sesión pide entrar y no muestra suscripciones", async () => {
    abrir();
    expect(await screen.findByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.queryByText("Plan Empresa")).not.toBeInTheDocument();
  });

  it("el carrusel de seguridad cambia de diapositiva con los puntos", async () => {
    const usuario = abrir();
    const primero = await screen.findByRole("button", { name: "Ver: Tus datos, solo tuyos" });
    expect(primero).toHaveAttribute("aria-current", "true");

    const tercero = screen.getByRole("button", { name: "Ver: Recuperación solo por tu correo" });
    await usuario.click(tercero);
    expect(tercero).toHaveAttribute("aria-current", "true");
    expect(primero).not.toHaveAttribute("aria-current");
  });

  it("con credenciales incorrectas da un error que no dice cuál falló", async () => {
    const usuario = abrir();
    await entrar(usuario, "maria@demo.com", "Incorrecta1");
    expect(await screen.findByRole("alert")).toHaveTextContent("El correo o la contraseña no son correctos.");
  });

  it("al entrar muestra solo sus suscripciones y lleva al pago", async () => {
    const usuario = abrir();
    await entrar(usuario);

    expect(await screen.findByRole("heading", { name: "Hola, María" })).toBeInTheDocument();
    expect(await screen.findByText("Vencida")).toBeInTheDocument();
    expect(screen.getByText("$60")).toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Continuar al pago" }));
    expect(screen.getByRole("heading", { name: "Paga $60" })).toBeInTheDocument();
  });

  it("cerrar sesión vuelve a la pantalla de entrar", async () => {
    const usuario = abrir();
    await entrar(usuario);
    await usuario.click(await screen.findByRole("button", { name: "Cerrar sesión" }));
    expect(await screen.findByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });
});

describe("Portal de pagos — registro", () => {
  async function registrarse(usuario, { correo = "nuevo@demo.com", contrasena = "Segura123", confirmacion = contrasena } = {}) {
    await usuario.type(await screen.findByLabelText(/^Nombre y apellido/), "Pedro Pérez");
    await usuario.type(screen.getByLabelText("Cédula o RIF"), "20111222");
    await usuario.type(screen.getByLabelText(/^Correo/), correo);
    await usuario.type(screen.getByLabelText(/^Teléfono/), "+58 412 0000000");
    await usuario.type(screen.getByLabelText(/^Contraseña/), contrasena);
    await usuario.type(screen.getByLabelText(/^Repite/), confirmacion);
    await usuario.click(screen.getByRole("checkbox", { name: /Acepto/ }));
    await usuario.click(screen.getByRole("button", { name: "Crear mi cuenta" }));
  }

  it("crea la cuenta, abre la sesión y la muestra sin suscripciones", async () => {
    const usuario = abrir("/portal-de-pagos/registro");
    await registrarse(usuario);
    expect(await screen.findByRole("heading", { name: "Hola, Pedro" })).toBeInTheDocument();
    expect(await screen.findByText("Todavía no tienes suscripciones.")).toBeInTheDocument();
  });

  it("rechaza una contraseña débil antes de llamar a la API", async () => {
    const usuario = abrir("/portal-de-pagos/registro");
    await registrarse(usuario, { contrasena: "sololetras" });
    expect(await screen.findByRole("alert")).toHaveTextContent("letras y números");
  });

  it("avisa si las contraseñas no coinciden", async () => {
    const usuario = abrir("/portal-de-pagos/registro");
    await registrarse(usuario, { confirmacion: "Distinta123" });
    expect(await screen.findByRole("alert")).toHaveTextContent("no coinciden");
  });

  it("no deja registrar un correo que ya tiene cuenta", async () => {
    const usuario = abrir("/portal-de-pagos/registro");
    await registrarse(usuario, { correo: "maria@demo.com" });
    expect(await screen.findByRole("alert")).toHaveTextContent("Ya hay una cuenta");
  });
});

describe("Portal de pagos — recuperación por correo", () => {
  async function pedirEnlace(usuario, correo) {
    await usuario.type(await screen.findByLabelText(/^Correo/), correo);
    await usuario.click(screen.getByRole("button", { name: "Enviarme el enlace" }));
    await screen.findByRole("heading", { name: "Revisa tu correo" });
  }

  it("responde igual aunque el correo no exista", async () => {
    const usuario = abrir("/portal-de-pagos/recuperar");
    await pedirEnlace(usuario, "nadie@demo.com");
    expect(screen.getByText(/Si hay una cuenta con/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Crear contraseña nueva" })).not.toBeInTheDocument();
  });

  it("cambia la contraseña con el enlace y deja entrar con la nueva", async () => {
    const usuario = abrir("/portal-de-pagos/recuperar");
    await pedirEnlace(usuario, "maria@demo.com");

    await usuario.click(screen.getByRole("link", { name: "Crear contraseña nueva" }));
    await usuario.type(await screen.findByLabelText(/^Contraseña nueva/), "Nueva1234");
    await usuario.type(screen.getByLabelText(/^Repite/), "Nueva1234");
    await usuario.click(screen.getByRole("button", { name: "Guardar contraseña" }));

    expect(await screen.findByText("Tu contraseña se cambió. Entra con la nueva.")).toBeInTheDocument();
    await entrar(usuario, "maria@demo.com", "Nueva1234");
    expect(await screen.findByRole("heading", { name: "Hola, María" })).toBeInTheDocument();
  });

  it("sin token ofrece pedir un enlace nuevo", async () => {
    abrir("/portal-de-pagos/restablecer");
    expect(await screen.findByRole("heading", { name: "El enlace ya no sirve" })).toBeInTheDocument();
  });

  it("un token inventado no sirve", async () => {
    const usuario = abrir("/portal-de-pagos/restablecer?token=inventado");
    await usuario.type(await screen.findByLabelText(/^Contraseña nueva/), "Nueva1234");
    await usuario.type(screen.getByLabelText(/^Repite/), "Nueva1234");
    await usuario.click(screen.getByRole("button", { name: "Guardar contraseña" }));
    expect(await screen.findByRole("heading", { name: "El enlace ya no sirve" })).toBeInTheDocument();
  });
});
