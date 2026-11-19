import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasoPago } from "./tienda.jsx";

describe("PasoPago", () => {
  const orden = {
    concepto: "My Business Panel · Plan Anual",
    monto: 700,
    cliente: {
      nombre: "Juan Pérez",
      documento: "V-12345678",
      correo: "juan@example.com",
    },
  };

  it("muestra la lista desplegable de bancos de Venezuela en pagos en bolívares", () => {
    render(<PasoPago orden={orden} />);

    const selectBanco = screen.getByRole("combobox");
    expect(selectBanco).toBeInTheDocument();
    expect(selectBanco).toHaveAttribute("name", "banco");
    expect(screen.getByRole("option", { name: "Selecciona tu banco" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "0134 - Banesco" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "0102 - Banco de Venezuela" })).toBeInTheDocument();
  });

  it("pre-rellena el monto convertido en bolívares según la tasa BCV con separadores y en modo solo lectura", () => {
    render(<PasoPago orden={orden} />);

    const inputMonto = screen.getByLabelText(/Monto pagado/);
    expect(inputMonto).toBeInTheDocument();
    // 700 USD * 917.7751 Bs/USD = 642.442,57 Bs
    expect(inputMonto).toHaveValue("642.442,57");
    expect(inputMonto).toHaveAttribute("readonly");
  });

  it("cambia a USD y muestra el monto en dólares al seleccionar Zelle en modo solo lectura", async () => {
    const usuario = userEvent.setup();
    render(<PasoPago orden={orden} />);

    const pastillaZelle = screen.getByRole("radio", { name: /Zelle/i });
    await usuario.click(pastillaZelle);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Monto pagado ($) *")).toHaveValue("700,00");
    expect(screen.getByLabelText("Monto pagado ($) *")).toHaveAttribute("readonly");
  });
});
