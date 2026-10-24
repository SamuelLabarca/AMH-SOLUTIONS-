import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Seccion, Contenedor, Eyebrow, Titulo, Boton } from "./ui";

/* ------------------------------------------------------------------
   PRUEBAS DE UI — los componentes que se repiten por toda la página.

   Si un día el layout de una sección, un botón o un título cambia,
   estos tests deben seguir pasando: son el contrato de la UI.
------------------------------------------------------------------- */

describe("Seccion", () => {
  it("aplica el tono de fondo correcto", () => {
    const { container } = render(<Seccion tono="navy" />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-navy");
    expect(section).toHaveClass("text-white");
  });

  it("sin bleed lleva margen y radio de sección", () => {
    const { container } = render(<Seccion tono="blanco" />);
    const section = container.querySelector("section");
    expect(section.className).toMatch(/mx-\[var\(--margen-lienzo\)\]/);
    expect(section.className).toMatch(/rounded-\[var\(--radius-seccion\)\]/);
  });

  it("con bleed quita margen y radio", () => {
    const { container } = render(<Seccion tono="blanco" bleed />);
    const section = container.querySelector("section");
    expect(section.className).not.toMatch(/mx-\[var\(--margen-lienzo\)\]/);
    expect(section.className).not.toMatch(/rounded-\[var\(--radius-seccion\)\]/);
  });

  it("pasa el id al section", () => {
    const { container } = render(<Seccion id="hero" tono="blanco" />);
    expect(container.querySelector("section#hero")).toBeInTheDocument();
  });

  it("tono desconocido no aplica un fondo de tono", () => {
    /* TONOS no valida: un tono desconocido produce `undefined` en el
       className, que no corresponde a ningún color real. */
    const { container } = render(<Seccion tono="rojo" />);
    const section = container.querySelector("section");
    /* No contiene bg-rojo ni bg- undefined que mapee a un color. */
    expect(section.className).not.toMatch(/bg-(rojo|undefined)/);
  });
});

describe("Contenedor", () => {
  it("centra y limita el ancho de lectura", () => {
    const { container } = render(<Contenedor>Contenido</Contenedor>);
    const div = container.querySelector("div");
    expect(div).toHaveClass("mx-auto", "w-full", "max-w-[1200px]");
    expect(div.className).toMatch(/px-5/);
  });
});

describe("Eyebrow", () => {
  it("pone la etiqueta en mayúsculas y azul por defecto", () => {
    render(<Eyebrow>Innovación</Eyebrow>);
    const etiqueta = screen.getByText("Innovación");
    expect(etiqueta.tagName).toBe("P");
    expect(etiqueta).toHaveClass("text-sky", "uppercase", "font-semibold");
  });

  it("claro pone sky-light", () => {
    render(<Eyebrow claro>Demo</Eyebrow>);
    expect(screen.getByText("Demo")).toHaveClass("text-sky-light");
  });
});

describe("Titulo", () => {
  it("negro por defecto, blanco en claro", () => {
    const { rerender } = render(<Titulo>Producto</Titulo>);
    let h2 = screen.getByRole("heading", { name: "Producto" });
    expect(h2).toHaveClass("text-black");
    expect(h2.tagName).toBe("H2");

    rerender(<Titulo claro>Producto</Titulo>);
    h2 = screen.getByRole("heading", { name: "Producto" });
    expect(h2).toHaveClass("text-white");
  });

  it("renderiza como h3 con prop `as`", () => {
    render(<Titulo as="h3">Subtítulo</Titulo>);
    expect(screen.getByRole("heading", { name: "Subtítulo", level: 3 })).toBeInTheDocument();
  });
});

describe("Boton", () => {
  it("sin to ni href: <button>", () => {
    render(<Boton>Click</Boton>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("con to: <Link> de React Router", () => {
    render(
      <MemoryRouter>
        <Boton to="/tienda">Ir</Boton>
      </MemoryRouter>,
    );
    const enlace = screen.getByRole("link", { name: "Ir" });
    expect(enlace).toHaveAttribute("href", "/tienda");
  });

  it("con href: <a> externo", () => {
    render(<Boton href="https://wa.me/58">WhatsApp</Boton>);
    const enlace = screen.getByRole("link", { name: "WhatsApp" });
    expect(enlace).toHaveAttribute("href", "https://wa.me/58");
  });

  it("aplica la variante primaria por defecto", () => {
    render(<Boton>Enviar</Boton>);
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveClass("bg-navy");
  });
});
