import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAVEGACION } from "../data/contenido.js";
import { IconMenu, IconCerrar, IconChevron } from "./Iconos.jsx";

/* ==================================================================
   BARRA DE NAVEGACIÓN  (patrón de Airtek)

   Logotipo a la izquierda, los enlaces REPARTIDOS a lo ancho de toda la
   barra y el botón de acción al final.

   DOS ESTADOS, y el cambio entre ellos es la pieza principal:
     · Arriba del todo: TRANSPARENTE, con el texto en blanco. Se monta
       sobre la cabecera oscura de la página y deja que el degradado
       llegue hasta el borde superior de la ventana.
     · Al desplazar: BLANCA, con el texto en negro. Es lo que hace
       Airtek, y evita el problema de una barra clara tapando el hero.

   EL REPARTO. Los enlaces no van agrupados a la derecha: el <ul> ocupa
   todo el espacio libre entre el logotipo y el botón (`flex-1`) y los
   distribuye con `justify-evenly`. Agrupados dejaban media barra vacía;
   repartidos, la barra se lee de punta a punta.

   ⚠️ `justify-evenly` reparte el hueco, no centra cada enlace en una
   columna: si un día entra un enlace mucho más largo que los demás, el
   reparto se ve desigual. Con cuatro etiquetas de longitud parecida
   funciona; con una de veinte caracteres habría que pasar a `grid`.

   Más claves del patrón, fáciles de perder al tocarlo:
   - Los enlaces NO llevan fondo, ni el activo. Se distingue por el peso
     y una barrita debajo.
   - Un solo botón relleno. Dos compiten entre sí y no gana ninguno.

   ⚠️ Se quitó el botón "Entrar": llevaba a una aplicación que todavía
   no existe y era un <button> sin acción. Cuando el panel esté en
   línea, vuelve aquí como <a> al subdominio.
================================================================== */
export default function Navbar() {
  const [desplazada, setDesplazada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname, hash } = useLocation();

  /* Con el menú móvil abierto la barra va sólida siempre: el panel que
     cuelga es blanco y una cabecera transparente encima dejaría los
     enlaces del panel pegados al hero. */
  const solida = desplazada || menuAbierto;

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
  const enHome = pathname === "/";
  const esActivo = ({ destino, ruta, hijos }) => {
    /* Un desplegable está activo si estamos en la página de alguno de
       sus hijos. */
    if (hijos) return hijos.some((hijo) => pathname === hijo.destino);
    /* Si el destino lleva ancla (/producto#planes), cuenta también el
       ancla: si no, un enlace a /producto#algo y "Productos" se
       marcarían a la vez en /producto. */
    const [base, ancla] = destino.split("#");
    if (ruta) return pathname === base && (!ancla || hash === `#${ancla}`);
    return enHome && `/${hash}` === destino;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solida ? "bg-white shadow-[0_1px_16px_rgba(22,39,63,0.08)]" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-[var(--alto-navbar)] max-w-[1560px] items-center
                   gap-6 px-5 sm:px-8 lg:gap-10 lg:px-12"
      >
        {/* ---------------- LOGOTIPO ----------------
            Solo la palabra, sin distintivo al lado: Airtek apoya toda la
            izquierda en el logotipo y nada más.

            Mayúsculas con el tracking muy abierto: a este tamaño es lo
            que lo hace leer como marca y no como un título cualquiera. */}
        <Link
          to="/"
          className={`shrink-0 text-base font-black uppercase tracking-[0.14em] transition-colors sm:text-lg ${
            solida ? "text-ink hover:text-sky" : "text-white hover:text-white/75"
          }`}
        >
          AMH Solutions
        </Link>

        {/* ---------------- ENLACES, REPARTIDOS ----------------
            `flex-1` se queda todo el hueco libre y `justify-evenly` lo
            reparte. Es lo que hace que la barra se ocupe entera en vez
            de amontonarse a la derecha. */}
        <ul className="hidden flex-1 items-center justify-evenly lg:flex">
          {NAVEGACION.map((enlace) => {
            const { etiqueta, destino, ruta } = enlace;
            const activo = esActivo(enlace);

            /* `relative` + la barrita en `after` y no un `border-b`: el
               borde empuja el texto medio píxel al activarse y la fila
               entera tiembla al navegar. */
            const clases = `
              relative block whitespace-nowrap py-1 text-[0.9375rem] transition-colors
              after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5
              after:rounded-full after:transition-opacity
              ${activo ? "font-semibold after:opacity-100" : "font-medium after:opacity-0"}
              ${
                solida
                  ? `after:bg-sky ${activo ? "text-sky" : "text-ink hover:text-sky"}`
                  : `after:bg-white ${activo ? "text-white" : "text-white/85 hover:text-white"}`
              }
            `;

            if (enlace.hijos) {
              return (
                <li key={etiqueta}>
                  <Desplegable enlace={enlace} clases={clases} pathname={pathname} />
                </li>
              );
            }

            return (
              <li key={etiqueta}>
                {ruta ? (
                  <Link to={destino} aria-current={activo ? "page" : undefined} className={clases}>
                    {etiqueta}
                  </Link>
                ) : (
                  <a href={destino} aria-current={activo ? "page" : undefined} className={clases}>
                    {etiqueta}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---------------- ACCIÓN ----------------
            El único botón relleno de la barra. Sobre el hero va blanco
            (sobre oscuro destaca lo claro) y, con la barra ya blanca,
            pasa al azul de acento: es el "Portal de Pagos" de Airtek.
            Hasta que el portal exista lleva a su página "muy pronto"
            (antes abría el formulario de mensaje, que ya no existe). */}
        <Link
          to="/portal-de-pagos"
          className={`
            hidden shrink-0 rounded-full px-7 py-3 text-center text-[0.9375rem] font-bold leading-tight
            transition-all duration-200 hover:-translate-y-0.5 lg:block
            ${
              solida
                ? "bg-sky text-white shadow-[var(--shadow-card)] hover:bg-sky-light"
                : "bg-white text-indigo hover:bg-cloud"
            }
          `}
        >
          Portal de pagos
        </Link>

        {/* ---------------- HAMBURGUESA (móvil) ----------------
            `ml-auto` la empuja al borde derecho: en móvil el <ul> está
            oculto y sin esto quedaría pegada al logotipo. */}
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className={`ml-auto grid h-10 w-10 place-items-center rounded-[var(--radius-tarjeta)]
                      transition-colors lg:hidden ${
                        solida ? "text-ink hover:bg-smoke" : "text-white hover:bg-white/10"
                      }`}
        >
          {menuAbierto ? <IconCerrar className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ---------------- PANEL DESPLEGABLE (móvil) ---------------- */}
      {menuAbierto && (
        <div id="menu-movil" className="border-t border-mist bg-white px-5 pb-5 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {NAVEGACION.map((enlace) => {
              const { etiqueta, destino, ruta } = enlace;
              const activo = esActivo(enlace);
              const clases = `block rounded-[var(--radius-tarjeta)] px-4 py-3 text-base transition-colors ${
                activo ? "font-semibold text-sky" : "font-medium text-ink hover:bg-smoke"
              }`;

              /* En móvil no hay hover que valga: el desplegable se
                 aplana en un grupo con su rótulo y los hijos debajo. */
              if (enlace.hijos) {
                return (
                  <li key={etiqueta} className="py-1">
                    <p className="px-4 pb-1 pt-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-steel">
                      {etiqueta}
                    </p>
                    <ul>
                      {enlace.hijos.map((hijo) => (
                        <li key={hijo.destino}>
                          <Link
                            to={hijo.destino}
                            aria-current={pathname === hijo.destino ? "page" : undefined}
                            className={`block rounded-[var(--radius-tarjeta)] px-4 py-3 text-base transition-colors ${
                              pathname === hijo.destino
                                ? "font-semibold text-sky"
                                : "font-medium text-ink hover:bg-smoke"
                            }`}
                          >
                            {hijo.etiqueta}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

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

          <Link
            to="/portal-de-pagos"
            onClick={() => setMenuAbierto(false)}
            className="mt-3 block w-full rounded-full bg-sky px-5 py-3.5 text-center text-base font-bold text-white"
          >
            Portal de pagos
          </Link>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------
   DESPLEGABLE DE LA BARRA ("Productos")

   Se abre al pasar el ratón Y al pulsar: el hover es lo que espera quien
   usa ratón, pero en pantallas táctiles y con teclado no existe, así que
   el botón tiene que funcionar solo.

   El hover se cierra con un pequeño retraso: sin él, el panel se cierra
   en el hueco entre el botón y la tarjeta al bajar el ratón. El `pt-3`
   del panel cubre ese hueco con una zona invisible que sigue contando
   como "dentro".

   Si lo abrió el hover, el clic que viene después NO lo cierra: quien
   pasa el ratón y pulsa quiere entrar, no que el menú desaparezca.

   Es un "disclosure" (botón + lista de enlaces) y no un role="menu":
   para unos pocos enlaces de navegación, es lo que mejor anuncian los
   lectores de pantalla.
------------------------------------------------------------------ */
function Desplegable({ enlace, clases, pathname }) {
  const { etiqueta, hijos } = enlace;
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef(null);
  const boton = useRef(null);
  const temporizador = useRef(null);
  const porHover = useRef(false);
  const id = `desplegable-${etiqueta.toLowerCase()}`;

  /* Clic fuera o Escape: se cierra. Con Escape el foco vuelve al botón,
     para que quien navega con teclado no se quede en el limbo. */
  useEffect(() => {
    if (!abierto) return;
    const alPulsarFuera = (e) => {
      if (!raiz.current?.contains(e.target)) setAbierto(false);
    };
    const alPulsarTecla = (e) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("pointerdown", alPulsarFuera);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("pointerdown", alPulsarFuera);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [abierto]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const entrar = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(temporizador.current);
    if (!abierto) porHover.current = true;
    setAbierto(true);
  };
  const salir = (e) => {
    if (e.pointerType !== "mouse") return;
    temporizador.current = setTimeout(() => {
      porHover.current = false;
      setAbierto(false);
    }, 150);
  };

  return (
    <div
      ref={raiz}
      className="relative"
      onPointerEnter={entrar}
      onPointerLeave={salir}
      /* Al salir con el tabulador del último enlace, se cierra. */
      onBlur={(e) => {
        if (!raiz.current?.contains(e.relatedTarget)) setAbierto(false);
      }}
    >
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => {
          if (porHover.current) {
            porHover.current = false;
            setAbierto(true);
          } else {
            setAbierto((v) => !v);
          }
        }}
        className={clases.replace("block", "inline-flex items-center gap-1")}
      >
        {etiqueta}
        <IconChevron
          className={`h-4 w-4 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={id}
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-[opacity,translate,visibility] duration-200
                    ${abierto ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"}`}
      >
        {/* Caja pequeña, solo con el nombre de cada producto, y con los
            bordes REDONDEADOS (Samuel la quiso primero cuadrada y luego
            redondeada, al estilo del submenú de innovasoftlatam.com).

            Cada producto es una PASTILLA: la de la página en la que estás
            va rellena en NEGRO con el texto blanco (el "Software" de esa
            referencia), y las demás se ponen negras al pasar el ratón o el
            foco, en cualquier página.
            Todo en blanco y negro: lo pidió Samuel. */}
        <ul className="space-y-1 whitespace-nowrap rounded-2xl border border-mist bg-white p-1.5 shadow-[var(--shadow-card)]">
          {hijos.map(({ etiqueta: nombre, destino }) => {
            const actual = pathname === destino;
            return (
              <li key={destino}>
                <Link
                  to={destino}
                  aria-current={actual ? "page" : undefined}
                  onClick={() => setAbierto(false)}
                  className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    actual ? "bg-black text-white" : "text-black hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white"
                  }`}
                >
                  {nombre}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
