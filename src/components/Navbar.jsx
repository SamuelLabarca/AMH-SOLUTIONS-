import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAVEGACION } from "../data/contenido.js";
import { useContacto } from "./Contacto.jsx";
import { IconMenu, IconCerrar } from "./Iconos.jsx";

/* ------------------------------------------------------------------
   BARRA DE NAVEGACIÓN

   Fija arriba. Arranca transparente sobre el hero (que es oscuro) y al
   desplazarse se vuelve una pastilla blanca esmerilada.

   Ese cambio no es decorativo: sobre el video del hero una barra blanca
   taparía la imagen, y más abajo, sobre el lienzo gris, una barra
   transparente dejaría el texto ilegible. Cada fondo pide una cosa.
------------------------------------------------------------------ */
export default function Navbar() {
  const [desplazada, setDesplazada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { abrir } = useContacto();
  const { pathname } = useLocation();

  /* En cualquier página que NO sea la home no hay hero oscuro detrás, así
     que la barra tiene que ir sólida desde el primer píxel. */
  const enHome = pathname === "/";
  const solida = desplazada || !enHome || menuAbierto;

  useEffect(() => {
    function alDesplazar() {
      setDesplazada(window.scrollY > 24);
    }
    alDesplazar(); // por si se entra con la página ya desplazada
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  /* El menú móvil se cierra al cambiar de página: si no, queda abierto
     sobre el destino. */
  useEffect(() => setMenuAbierto(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={`
          mx-auto flex max-w-[1240px] items-center gap-4 rounded-full
          px-4 py-2.5 transition-all duration-300 sm:px-5
          ${
            solida
              ? "border border-white/70 bg-white/85 shadow-[var(--shadow-card)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }
        `}
      >
        <Link
          to="/"
          className={`flex shrink-0 items-center gap-2.5 text-base font-extrabold tracking-tight transition-colors ${
            solida ? "text-navy" : "text-white"
          }`}
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black transition-colors ${
              solida ? "bg-navy text-white" : "bg-white/15 text-white backdrop-blur-sm"
            }`}
          >
            A
          </span>
          AMH Solutions
        </Link>

        {/* --- Enlaces (escritorio) --- */}
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAVEGACION.map(({ etiqueta, destino, ruta }) => {
            const activo = ruta && pathname === destino;
            const clases = `
              rounded-full px-4 py-2 text-sm font-medium transition-colors
              ${
                solida
                  ? activo
                    ? "bg-sky-tint text-navy"
                    : "text-body hover:bg-cloud hover:text-navy"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }
            `;
            return (
              <li key={etiqueta}>
                {ruta ? (
                  <Link to={destino} className={clases}>
                    {etiqueta}
                  </Link>
                ) : (
                  <a href={destino} className={clases}>
                    {etiqueta}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={abrir}
          className={`
            ml-auto hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold
            transition-all duration-200 hover:-translate-y-0.5 lg:ml-0 lg:inline-flex
            ${
              solida
                ? "bg-navy text-white hover:bg-steel-navy"
                : "bg-white text-navy hover:bg-cloud"
            }
          `}
        >
          Contáctanos
        </button>

        {/* --- Botón del menú (móvil) --- */}
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className={`ml-auto grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden ${
            solida ? "text-navy hover:bg-cloud" : "text-white hover:bg-white/10"
          }`}
        >
          {menuAbierto ? <IconCerrar className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* --- Panel del menú (móvil) --- */}
      {menuAbierto && (
        <div className="mx-auto mt-2 max-w-[1240px] rounded-3xl border border-mist bg-white p-3 shadow-[var(--shadow-lift)] lg:hidden">
          <ul className="space-y-1">
            {NAVEGACION.map(({ etiqueta, destino, ruta }) => (
              <li key={etiqueta}>
                {ruta ? (
                  <Link
                    to={destino}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-body hover:bg-cloud hover:text-navy"
                  >
                    {etiqueta}
                  </Link>
                ) : (
                  <a
                    href={destino}
                    onClick={() => setMenuAbierto(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-body hover:bg-cloud hover:text-navy"
                  >
                    {etiqueta}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMenuAbierto(false);
              abrir();
            }}
            className="mt-2 w-full rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white"
          >
            Contáctanos
          </button>
        </div>
      )}
    </header>
  );
}
