import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAVEGACION } from "../data/contenido.js";
import { useContacto } from "./Contacto.jsx";
import { IconMenu, IconCerrar } from "./Iconos.jsx";

/* ==================================================================
   BARRA DE NAVEGACIÓN  (patrón de nido)

   Tres zonas en escritorio: logo a la izquierda, el menú dentro de una
   PASTILLA centrada, y los botones a la derecha.

   La pastilla es la clave del look: no es una barra de ancho completo
   con enlaces sueltos, es una cápsula gris clara con sombra suave que
   flota sobre el fondo, y el enlace activo lleva su PROPIA pastilla
   dentro. Eso es lo que hace que se lea como nido y no como un navbar
   corporativo cualquiera.

   Se resuelve con `grid-cols-[1fr_auto_1fr]` y no con flex: así la
   cápsula queda centrada respecto a la VENTANA, no respecto al espacio
   que dejan logo y botones. Con flex se descentraría en cuanto el logo y
   los botones midan distinto, que es siempre.

   Sobre el hero la barra va transparente (el hero es oscuro); al
   desplazarse se vuelve sólida y esmerilada. Cada fondo pide una cosa:
   una barra clara taparía el hero, y una transparente sería ilegible
   sobre el lienzo gris.
================================================================== */
export default function Navbar() {
  const [desplazada, setDesplazada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { abrir } = useContacto();
  const { pathname, hash } = useLocation();

  /* Fuera de la home no hay hero oscuro detrás, así que la barra va
     sólida desde el primer píxel. */
  const enHome = pathname === "/";
  const solida = desplazada || !enHome || menuAbierto;

  useEffect(() => {
    const mirar = () => setDesplazada(window.scrollY > 24);
    mirar(); // por si se entra con la página ya desplazada
    /* `passive`: no se llama a preventDefault, así que el navegador no
       tiene que esperar a este manejador para desplazar. */
    window.addEventListener("scroll", mirar, { passive: true });
    return () => window.removeEventListener("scroll", mirar);
  }, []);

  useEffect(() => setMenuAbierto(false), [pathname, hash]);

  /* Un enlace está activo si es su ruta, o si es el ancla en la que
     estamos ahora mismo dentro de la home. */
  const esActivo = ({ destino, ruta }) =>
    ruta ? pathname === destino : enHome && `/${hash}` === destino;

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${
          solida
            /* `blur-md` y no `xl`: es una capa esmerilada del ancho de la
               ventana y fija, así que se recompone en cada fotograma del
               desplazamiento. Con `xl` el coste se nota en equipos
               modestos y no se gana nada visible. */
            ? "bg-shell/85 py-3 shadow-[0_1px_24px_rgba(22,39,63,0.08)] backdrop-blur-md"
            : "py-6"
        }
      `}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-5 sm:px-7
                   lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
      >
        {/* ---------------- LOGO ---------------- */}
        <Link
          to="/"
          className={`flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight transition-colors ${
            solida ? "text-ink" : "text-white"
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

        {/* ---------------- LA PASTILLA DEL MENÚ ----------------
            Sin borde: la separación del fondo la da la sombra, como en
            nido. Sobre el hero se vuelve cristal oscuro para no tapar el
            video. */}
        <ul
          className={`
            hidden items-center gap-1 rounded-full p-1 transition-colors duration-300
            lg:flex lg:justify-self-center
            ${
              solida
                ? "bg-smoke shadow-[0_4px_10px_rgba(22,39,63,0.06)]"
                : "bg-white/10 backdrop-blur-md"
            }
          `}
        >
          {NAVEGACION.map((enlace) => {
            const { etiqueta, destino, ruta } = enlace;
            const activo = esActivo(enlace);

            const clases = `
              block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors
              ${
                activo
                  ? solida
                    ? "bg-sky-pill text-ink"
                    : "bg-white text-navy"
                  : solida
                    ? "text-ink hover:opacity-60"
                    : "text-white/80 hover:text-white"
              }
            `;

            return (
              <li key={etiqueta}>
                {ruta ? (
                  <Link
                    to={destino}
                    aria-current={activo ? "page" : undefined}
                    className={clases}
                  >
                    {etiqueta}
                  </Link>
                ) : (
                  <a
                    href={destino}
                    aria-current={activo ? "page" : undefined}
                    className={clases}
                  >
                    {etiqueta}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---------------- BOTONES ---------------- */}
        <div className="hidden items-center gap-2.5 lg:flex lg:justify-self-end">
          {/* "Entrar" es un <button> y no un <a>: lleva a la aplicación,
              que todavía no existe. Un href a un ancla inexistente no
              hace nada y ensucia la URL; así al menos no miente. */}
          <button
            type="button"
            className={`
              rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200
              hover:-translate-y-0.5
              ${
                solida
                  ? "bg-white text-ink shadow-[0_4px_10px_rgba(22,39,63,0.06)] hover:bg-smoke"
                  : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              }
            `}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={abrir}
            className={`
              rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200
              hover:-translate-y-0.5
              ${
                solida
                  ? "bg-navy text-white hover:bg-steel-navy"
                  : "bg-white text-navy hover:bg-cloud"
              }
            `}
          >
            Contáctanos
          </button>
        </div>

        {/* ---------------- HAMBURGUESA (móvil) ---------------- */}
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className={`grid h-10 w-10 place-items-center rounded-xl transition-colors lg:hidden ${
            solida ? "text-ink hover:bg-white/60" : "text-white hover:bg-white/10"
          }`}
        >
          {menuAbierto ? <IconCerrar className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ---------------- PANEL DESPLEGABLE (móvil) ---------------- */}
      {menuAbierto && (
        <div
          id="menu-movil"
          className="mx-[var(--margen-lienzo)] mt-3 rounded-[var(--radius-seccion)] border border-white/60
                     bg-white/90 p-3 shadow-[var(--shadow-lift)] backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col">
            {NAVEGACION.map((enlace) => {
              const { etiqueta, destino, ruta } = enlace;
              const activo = esActivo(enlace);
              const clases = `block rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                activo ? "bg-sky-pill text-ink" : "text-ink hover:bg-smoke"
              }`;

              return (
                <li key={etiqueta}>
                  {ruta ? (
                    <Link to={destino} className={clases}>
                      {etiqueta}
                    </Link>
                  ) : (
                    <a href={destino} onClick={() => setMenuAbierto(false)} className={clases}>
                      {etiqueta}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex gap-2 px-1 pb-1">
            <button
              type="button"
              className="flex-1 rounded-full bg-smoke px-5 py-3 text-sm font-medium text-ink"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuAbierto(false);
                abrir();
              }}
              className="flex-1 rounded-full bg-navy px-5 py-3 text-sm font-medium text-white"
            >
              Contáctanos
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
