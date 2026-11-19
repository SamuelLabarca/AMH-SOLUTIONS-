import { render, screen, waitFor } from "@testing-library/react";
import { PasoPago } from "./tienda.jsx";

/* With a real backend (not demo mode) and no BCV rate available, the
   amount in bolívares cannot be computed: it must never fall back to a
   made-up rate or to the dollar figure, and the client must be able to
   type the amount they actually paid. */
const { obtenerTasa } = vi.hoisted(() => ({ obtenerTasa: vi.fn() }));
vi.mock("../servicios/tienda.js", () => ({
  MODO_DEMO: false,
  obtenerTasa,
  obtenerMetodos: () => new Promise(() => {}),
  obtenerCatalogo: () => new Promise(() => {}),
  aplicarPrecios: (local) => local,
}));

const orden = {
  concepto: "My Business Panel · Plan Anual",
  monto: 700,
  cliente: { nombre: "Juan Pérez", documento: "V-12345678" },
};

describe("PasoPago sin tasa BCV", () => {
  it("si la API de la tasa falla, el monto en Bs queda vacío y editable", async () => {
    obtenerTasa.mockRejectedValue(new Error("sin-tasa"));
    render(<PasoPago orden={orden} />);

    await waitFor(() => expect(obtenerTasa).toHaveBeenCalled());
    const monto = screen.getByLabelText(/Monto pagado \(Bs\.\)/);
    expect(monto).toHaveValue("");
    expect(monto).not.toHaveAttribute("readonly");
    expect(screen.queryByText(/917,78/)).not.toBeInTheDocument();
  });

  it("mientras la tasa carga, no muestra los dólares como si fueran bolívares", () => {
    obtenerTasa.mockReturnValue(new Promise(() => {}));
    render(<PasoPago orden={orden} />);

    const monto = screen.getByLabelText(/Monto pagado \(Bs\.\)/);
    expect(monto).not.toHaveValue("700,00");
    expect(monto).toHaveValue("");
  });
});
