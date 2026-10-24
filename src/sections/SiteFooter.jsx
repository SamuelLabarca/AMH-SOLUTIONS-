import { Link } from "react-router-dom";
import { Contenedor } from "../components/ui.jsx";
import { WHATSAPP, ATENCION } from "../data/contenido.js";

/* ==================================================================
   FOOTER  (estructura de Airtek)

   Antes era la composición de nido: titular grande de declaración,
   correo enorme, boletín con botón redondo, curva de degradado. Se
   quitó entera. Era un footer que pedía ser leído, y un footer no se
   lee: se consulta. El de Airtek ocupa la mitad y se entiende de un
   vistazo, que es lo único que tiene que hacer.

   La estructura es exactamente la suya, en dos pisos:

     PISO 1 — tres zonas en una fila
       izquierda  logotipo, dirección y las redes en iconos sueltos
       centro     dos columnas de enlaces, sin encabezado
       derecha    icono de auricular + "Atención al cliente" + teléfono

     PISO 2 — centrado, separado por una línea
       los enlaces legales en una línea con separadores "|"
       la razón social y el copyright debajo

   DETALLES QUE SON DEL PATRÓN Y NO ADORNO:
   - Las columnas de enlaces NO llevan encabezado. Airtek las deja
     desnudas; un "Navegación" encima las convertiría en un sitemap.
   - Las redes son iconos a pelo, sin círculo de fondo.
   - Todo el piso 2 va centrado aunque el piso 1 esté alineado a la
     izquierda. Ese cambio de eje es lo que separa los dos bloques sin
     necesidad de más líneas.
================================================================== */

/* Las tres columnas del centro. El reparto no es alfabético ni casual:
   la empresa, lo que vendemos y lo que el visitante podría necesitar.
   Airtek hace lo mismo con dos; aquí van tres porque con dos la fila
   dejaba medio footer vacío entre los enlaces y el teléfono. */
const COLUMNAS = [
  [
    { etiqueta: "Nosotros", destino: "/nosotros", ruta: true },
    { etiqueta: "Trabaja con nosotros", destino: "/nosotros#sumarte", ruta: true },
    { etiqueta: "Aliados comerciales", destino: "/nosotros#sumarte", ruta: true },
  ],
  [
    { etiqueta: "Desarrollo web", destino: "/#servicios" },
    { etiqueta: "Automatizaciones", destino: "/#servicios" },
    { etiqueta: "Software a la medida", destino: "/#servicios" },
    { etiqueta: "Chatbots", destino: "/#servicios" },
  ],
  [
    { etiqueta: "Producto y planes", destino: "/producto", ruta: true },
    { etiqueta: "Preguntas frecuentes", destino: "/preguntas-frecuentes", ruta: true },
    { etiqueta: "Centro de ayuda", destino: "#" },
  ],
];

const LEGAL = ["Política de privacidad", "Términos de uso", "Política de datos"];

const REDES = [
  {
    nombre: "Instagram",
    href: "https://instagram.com",
    d: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.2a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z",
  },
  {
    nombre: "Facebook",
    href: "https://facebook.com",
    d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z",
  },
  {
    nombre: "LinkedIn",
    href: "https://linkedin.com",
    d: "M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6ZM8.3 18.3H5.6V9.7h2.7v8.6ZM7 8.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Zm11.4 9.8h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H9.9V9.7h2.6v1.2h.1a2.9 2.9 0 0 1 2.6-1.4c2.8 0 3.3 1.8 3.3 4.2v4.6Z",
  },
  {
    nombre: "WhatsApp",
    href: `https://wa.me/${WHATSAPP.numero}`,
    d: "M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 7.6 7.6 0 0 0 2.6.6 2.6 2.6 0 0 0 1.7-.8 2.1 2.1 0 0 0 .5-1.5c0-.2-.2-.3-.4-.4Z",
  },
];

/* Auricular de atención al cliente. Va suelto y no en Iconos.jsx porque
   solo existe aquí: el mapa general de iconos lo usa toda la página y
   no conviene engordarlo con piezas de un solo uso. */
function IconAuricular(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="2" y="13" width="4.5" height="7" rx="2.25" />
      <rect x="17.5" y="13" width="4.5" height="7" rx="2.25" />
      <path d="M20 20v.5a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
    </svg>
  );
}

/* Un enlace del footer. `ruta` distingue los que cambian de página de
   los que son un ancla dentro de la home: usar <a> para una ruta de
   React Router recargaría la aplicación entera. */
function Enlace({ etiqueta, destino, ruta }) {
  const clases =
    "block text-[0.9375rem] text-white/70 transition-colors hover:text-white";
  return (
    <li>
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
}

export default function SiteFooter({ telefono = ATENCION.telefono }) {
  return (
    <footer
      /* El footer va FUERA de <main>, así que el `gap` de allí no le
         llega: se pone aquí su propio margen superior con el mismo
         valor, para que el hueco gris sea idéntico al de las secciones.

         Negro y no `ink`, igual que la banda de Servicios: el navy
         teñía toda la zona y competía con el azul de marca. */
      className="mx-[var(--margen-lienzo)] mb-[var(--margen-lienzo)]
                 overflow-hidden rounded-[var(--radius-seccion)] bg-black"
    >
      <Contenedor className="py-14 sm:py-16">
        {/* ---------------- PISO 1 ---------------- */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_auto_auto_auto_1fr] lg:gap-10">
          {/* --- Izquierda: marca, dirección y redes --- */}
          <div>
            <Link
              to="/"
              className="text-xl font-black uppercase tracking-[0.14em] text-white transition-colors hover:text-sky-light"
            >
              AMH Solutions
            </Link>

            {/* La dirección en dos líneas, como Airtek. Un <p> con <br>
                y no dos párrafos: es un solo dato. */}
            <p className="mt-5 text-[0.9375rem] leading-[1.5] text-white/70">
              Maracaibo, Edo. Zulia.
              <br />
              Venezuela.
            </p>

            {/* Iconos a pelo, sin círculo de fondo: así los deja Airtek.
                El área de pulsación la da el padding, no el fondo. */}
            <ul className="mt-6 flex items-center gap-5">
              {REDES.map(({ nombre, href, d }) => (
                <li key={nombre}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={nombre}
                    className="block text-white/75 transition-colors hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d={d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Centro: las dos columnas de enlaces, sin encabezado --- */}
          {COLUMNAS.map((columna, i) => (
            <ul key={i} className="space-y-4 lg:min-w-[10rem]">
              {columna.map((enlace) => (
                <Enlace key={enlace.etiqueta} {...enlace} />
              ))}
            </ul>
          ))}

          {/* --- Derecha: atención al cliente --- */}
          <div className="flex items-start gap-3 lg:justify-end">
            <IconAuricular className="mt-0.5 h-7 w-7 shrink-0 text-white/75" />
            <div>
              <p className="text-[0.9375rem] font-semibold text-white">Atención al cliente</p>
              {/* Enlace `tel:` y no texto plano: en el móvil, que es
                  donde más se usa, llama con un toque. */}
              <a
                href={`tel:${telefono.replace(/\s/g, "")}`}
                className="mt-1 block text-[0.9375rem] text-white/70 transition-colors hover:text-white"
              >
                {telefono}
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- PISO 2 ----------------
            Centrado, aunque el piso de arriba vaya a la izquierda. El
            cambio de eje es lo que separa los dos bloques; la línea solo
            lo confirma. */}
        <div className="mt-14 border-t border-white/10 pt-10 text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {LEGAL.map((etiqueta, i) => (
              <li key={etiqueta} className="flex items-center gap-3">
                {/* El separador va DENTRO del <li>, antes del enlace y
                    nunca en el primero. Como pseudo-elemento del <a> se
                    colaría en el texto que lee un lector de pantalla. */}
                {i > 0 && (
                  <span aria-hidden="true" className="text-white/25">
                    |
                  </span>
                )}
                <a
                  href="#"
                  className="text-[0.875rem] text-white/60 transition-colors hover:text-white"
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[0.875rem] leading-[1.6] text-white/45">
            AMH Solutions, C.A.
            <br />
            Todos los derechos reservados © {new Date().getFullYear()}
          </p>
        </div>
      </Contenedor>
    </footer>
  );
}
