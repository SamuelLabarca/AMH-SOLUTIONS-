import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

/* Mock de IntersectionObserver: los tests corren en jsdom que no
   implementa el observador. Reveal.jsx depende de él. */
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

/* El modal de contacto monta un portal en document.body; hay que
   proveer el contexto. */
function renderApp(ruta = "/") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App — layout y rutas", () => {
  it("monta la barra de navegación y el footer en la home", () => {
    renderApp("/");
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("la home carga de inmediato (no es lazy)", async () => {
    renderApp("/");
    expect(await screen.findByRole("heading", { name: /Evoluciona a una/i })).toBeInTheDocument();
  });

  it("cualquier ruta desconocida cae en la home", async () => {
    renderApp("/ruta-que-no-existe");
    expect(await screen.findByRole("heading", { name: /Evoluciona a una/i })).toBeInTheDocument();
  });

  it("la ruta /producto carga de forma lazy", async () => {
    renderApp("/producto");
    /* El hero de producto tiene un <h1> con "My Business Panel".
       La página es lazy, así que esperamos a que el Suspense se
       resuelva (usa waitFor con timeout amplio). */
    await waitFor(
      () => expect(screen.getByRole("heading", { name: /My Business Panel/ })).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });

  it("el botón flotante de WhatsApp está en todas las páginas", () => {
    renderApp("/");
    /* El botón flotante usa aria-label "Escríbenos por WhatsApp…";
       el footer también tiene iconos de red social, así que el
       matcher tiene que ser específico. */
    expect(screen.getByLabelText(/Escríbenos por WhatsApp/i)).toBeInTheDocument();
  });
});
