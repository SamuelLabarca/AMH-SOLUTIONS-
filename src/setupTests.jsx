/* Punto de entrada de los tests: carga los matchers de jest-dom y
   provee mocks de APIs que jsdom no implementa. */
import "@testing-library/jest-dom";

/* jsdom no implementa matchMedia, que usa LineaProgreso en
   PorQueElegirnos.jsx. Devolvemos `false` por defecto (animaciones
   activas) para que el componente se comporte como en un navegador
   real que respeta las preferencias del usuario. */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/* jsdom no implementa scrollTo. App.jsx y varias páginas lo llaman al
   navegar: evitamos que el test falle con "scrollTo is not a function". */
window.scrollTo = window.scrollTo || (() => {});
