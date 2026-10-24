import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortalPagos from "./PortalPagos.jsx";
import { normalizarDocumento } from "../servicios/portalPagos.js";

beforeAll(() => {
  // jsdom no implementa scrollIntoView.
  Element.prototype.scrollIntoView = () => {};
});

async function consultar(numero, letra = "V") {
  const usuario = userEvent.setup();
  render(<PortalPagos />);
  await usuario.selectOptions(screen.getByLabelText("Tipo de documento"), letra);
  await usuario.type(screen.getByLabelText("Número de cédula o RIF"), numero);
  await usuario.click(screen.getByRole("button", { name: "Consultar" }));
  return usuario;
}

describe("normalizarDocumento", () => {
  it("quita puntos y espacios y pone la letra en mayúscula", () => {
    expect(normalizarDocumento("v", " 12.345.678 ")).toBe("V-12345678");
  });
});

describe("Portal de pagos", () => {
  it("muestra las suscripciones de la cuenta y marca las pendientes", async () => {
    await consultar("12345678");

    expect(await screen.findByRole("heading", { name: /Hola, María/ })).toBeInTheDocument();
    expect(screen.getByText("Vencida")).toBeInTheDocument();
    expect(screen.getByText("Por vencer")).toBeInTheDocument();
    // Vencida ($45) + por vencer ($15) vienen marcadas.
    expect(screen.getByText("$60")).toBeInTheDocument();
  });

  it("recalcula el total al desmarcar una suscripción", async () => {
    const usuario = await consultar("12345678");
    await screen.findByRole("heading", { name: /Hola, María/ });

    await usuario.click(screen.getAllByRole("checkbox")[1]);
    expect(screen.getAllByText("$45").length).toBeGreaterThan(1);
  });

  it("lleva al paso de pago con el total elegido", async () => {
    const usuario = await consultar("12345678");
    await screen.findByRole("heading", { name: /Hola, María/ });

    await usuario.click(screen.getByRole("button", { name: "Continuar al pago" }));
    expect(screen.getByRole("heading", { name: "Paga $60" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reportar mi pago" })).toBeInTheDocument();
  });

  it("no deja continuar si una cuenta activa no tiene nada marcado", async () => {
    await consultar("123456789", "J");
    await screen.findByRole("heading", { name: /Hola, Distribuidora/ });

    expect(screen.getByRole("button", { name: "Continuar al pago" })).toBeDisabled();
  });

  it("avisa cuando no hay cuenta con ese documento", async () => {
    await consultar("99999999");
    expect(await screen.findByText(/No encontramos una cuenta/)).toBeInTheDocument();
  });
});
