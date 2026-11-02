import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProveedorSesion } from "../../sesion/Sesion.jsx";
import { reiniciarDemo } from "../../servicios/autenticacion.js";
import { crearOrden } from "../../servicios/tienda.js";
import { ErrorApi } from "../../servicios/api.js";
import PasoCuenta from "./PasoCuenta.jsx";

/* La sesión corre contra el MODO_DEMO (cuentas de data/portalDemo.js).
   La orden se simula: la crea el backend y aquí solo importa qué se pide. */
vi.mock("../../servicios/tienda.js", () => ({ crearOrden: vi.fn() }));

const ORDEN = { id: 7, total: 700, suscripcion: 31 };

function abrir() {
  const alListo = vi.fn();
  const usuario = userEvent.setup();
  render(
    <MemoryRouter>
      <ProveedorSesion>
        <PasoCuenta producto="administrativo" opcion="anual" alListo={alListo} />
      </ProveedorSesion>
    </MemoryRouter>,
  );
  return { usuario, alListo };
}

async function registrarse(usuario, { correo = "nuevo@demo.com", contrasena = "Segura123" } = {}) {
  await usuario.type(await screen.findByLabelText(/^Nombre/), "Pedro");
  await usuario.type(screen.getByLabelText(/^Apellido/), "Pérez");
  await usuario.type(screen.getByPlaceholderText("12345678"), "20111222");
  await usuario.type(screen.getByLabelText(/^Correo/), correo);
  await usuario.type(screen.getByLabelText(/^Teléfono/), "+58 412 0000000");
  await usuario.type(screen.getByLabelText(/^Contraseña/), contrasena);
  await usuario.type(screen.getByLabelText(/^Repite/), contrasena);
  await usuario.click(screen.getByRole("checkbox", { name: /Acepto/ }));
  await usuario.click(screen.getByRole("button", { name: "Crear cuenta y continuar" }));
}

beforeEach(() => {
  reiniciarDemo();
  crearOrden.mockReset().mockResolvedValue(ORDEN);
});

describe("Checkout — paso Tu cuenta", () => {
  it("registra la cuenta, crea la orden SOLO con producto y opción, y avanza", async () => {
    const { usuario, alListo } = abrir();
    await registrarse(usuario);

    await vi.waitFor(() => expect(alListo).toHaveBeenCalled());
    expect(crearOrden).toHaveBeenCalledWith({ producto: "administrativo", opcion: "anual" });
    const [orden, cliente] = alListo.mock.calls[0];
    expect(orden).toEqual(ORDEN);
    expect(cliente).toMatchObject({ nombre: "Pedro Pérez", documento: "V-20111222", correo: "nuevo@demo.com" });
  });

  it("no registra con una contraseña débil", async () => {
    const { usuario, alListo } = abrir();
    await registrarse(usuario, { contrasena: "sololetras" });
    expect(await screen.findByRole("alert")).toHaveTextContent("letras y números");
    expect(crearOrden).not.toHaveBeenCalled();
    expect(alListo).not.toHaveBeenCalled();
  });

  it("si el correo ya tiene cuenta, lo dice y deja entrar con ella", async () => {
    const { usuario } = abrir();
    await registrarse(usuario, { correo: "maria@demo.com" });
    expect(await screen.findByRole("alert")).toHaveTextContent("Entra con ella para comprar");

    await usuario.click(screen.getByRole("button", { name: "Entra con ella" }));
    await usuario.type(screen.getByLabelText(/^Correo/), "maria@demo.com");
    await usuario.type(screen.getByLabelText(/^Contraseña/), "Demo1234");
    await usuario.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Compras como María González")).toBeInTheDocument();
  });

  it("con sesión abierta pide confirmar la cuenta antes de comprar", async () => {
    const { usuario, alListo } = abrir();
    await usuario.click(await screen.findByRole("button", { name: "Entra con ella" }));
    await usuario.type(screen.getByLabelText(/^Correo/), "maria@demo.com");
    await usuario.type(screen.getByLabelText(/^Contraseña/), "Demo1234");
    await usuario.click(screen.getByRole("button", { name: "Entrar" }));

    await usuario.click(await screen.findByRole("button", { name: "Continuar al pago" }));
    await vi.waitFor(() => expect(alListo).toHaveBeenCalledWith(ORDEN, expect.objectContaining({ correo: "maria@demo.com" })));
  });

  it("'No soy yo' cierra la sesión y deja el registro listo para usar", async () => {
    const { usuario } = abrir();
    await usuario.click(await screen.findByRole("button", { name: "Entra con ella" }));
    await usuario.type(screen.getByLabelText(/^Correo/), "maria@demo.com");
    await usuario.type(screen.getByLabelText(/^Contraseña/), "Demo1234");
    await usuario.click(screen.getByRole("button", { name: "Entrar" }));

    await usuario.click(await screen.findByRole("button", { name: "No soy yo" }));
    // Vuelve a "entrar" (el último modo usado) sin quedarse trabado cargando.
    expect(await screen.findByRole("button", { name: "Entrar" })).toBeEnabled();
  });

  it("si la opción ya no se vende, lo explica", async () => {
    crearOrden.mockRejectedValue(new ErrorApi(400, "opcion-no-disponible"));
    const { usuario, alListo } = abrir();
    await registrarse(usuario);
    expect(await screen.findByRole("alert")).toHaveTextContent("ya no está disponible");
    expect(alListo).not.toHaveBeenCalled();
  });
});
