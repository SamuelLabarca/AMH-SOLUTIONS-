import { act, fireEvent, render, screen } from "@testing-library/react";
import CarruselSeguridad from "./CarruselSeguridad.jsx";

const punto = (nombre) => screen.getByRole("button", { name: `Ver: ${nombre}` });

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Carrusel de seguridad", () => {
  it("pasa solo a la siguiente cada 6 segundos", () => {
    render(<CarruselSeguridad />);
    expect(punto("Tus datos, solo tuyos")).toHaveAttribute("aria-current", "true");

    act(() => vi.advanceTimersByTime(6000));
    expect(punto("Contraseñas que nadie puede leer")).toHaveAttribute("aria-current", "true");
  });

  it("vuelve a la primera después de la última", () => {
    render(<CarruselSeguridad />);
    // De a un paso: cada temporizador se arma al pintar la diapositiva.
    for (let i = 0; i < 5; i++) act(() => vi.advanceTimersByTime(6000));
    expect(punto("Tus datos, solo tuyos")).toHaveAttribute("aria-current", "true");
  });

  it("el botón de pausa lo detiene y el de reanudar lo vuelve a mover", () => {
    render(<CarruselSeguridad />);
    fireEvent.click(screen.getByRole("button", { name: "Pausar el carrusel" }));
    // El clic deja el foco dentro; al salir, solo cuenta la pausa.
    fireEvent.blur(screen.getByRole("button", { name: "Reanudar el carrusel" }));

    act(() => vi.advanceTimersByTime(20000));
    expect(punto("Tus datos, solo tuyos")).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByRole("button", { name: "Reanudar el carrusel" }));
    fireEvent.blur(screen.getByRole("button", { name: "Pausar el carrusel" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(punto("Contraseñas que nadie puede leer")).toHaveAttribute("aria-current", "true");
  });

  it("no cambia mientras el ratón está encima", () => {
    render(<CarruselSeguridad />);
    fireEvent.mouseEnter(screen.getByRole("region", { name: "Cómo protegemos tu cuenta" }));
    act(() => vi.advanceTimersByTime(20000));
    expect(punto("Tus datos, solo tuyos")).toHaveAttribute("aria-current", "true");
  });
});
