import { useState } from "react";
import { Link } from "react-router-dom";
import { Contenedor } from "../components/ui.jsx";
import { useContacto } from "../components/Contacto.jsx";
import { IconFlecha } from "../components/Iconos.jsx";

/* ==================================================================
   FOOTER  (composición de nido)

   Es la única pieza verdaderamente oscura de la página y la que la
   cierra, así que se comporta como una sección más: tarjeta redondeada
   sobre el lienzo gris, no una franja a sangre.

   La composición es la de nido, no la de un footer de columnas al uso:

     · Un TITULAR grande de declaración, en gris con algunas palabras en
       blanco. No es decorativo: el contraste es lo que hace que la frase
       se lea en dos tiempos.
     · El CORREO como elemento destacado y grande a la izquierda, no como
       una línea de 12px perdida entre enlaces.
     · Tres columnas de enlaces con el mismo paso vertical.
     · El BOLETÍN: campo en pastilla translúcida y botón redondo aparte.
     · Redes en círculos y la línea legal al fondo.

   La curva tenue de la esquina superior izquierda es un degradado radial
   muy suave. Sin ella, un rectángulo de ink de este tamaño se ve muerto.
================================================================== */

const COLUMNAS = [
  {
    titulo: "Navegación",
    enlaces: [
      { etiqueta: "Inicio", destino: "/", ruta: true },
      { etiqueta: "Nosotros", destino: "/#nosotros" },
      { etiqueta: "Servicios", destino: "/#servicios" },
      { etiqueta: "Producto y planes", destino: "/producto", ruta: true },
    ],
  },
  {
    titulo: "Soporte",
    enlaces: [
      { etiqueta: "Centro de ayuda", destino: "#" },
      { etiqueta: "Estado del servicio", destino: "#" },
      { etiqueta: "Documentación", destino: "#" },
      { etiqueta: "Privacidad", destino: "#" },
    ],
  },
  {
    titulo: "Dónde estamos",
    /* Sin enlaces: son datos, no navegación. Por eso van como texto y no
       como <a>, que prometería un destino que no existe. */
    texto: ["Caracas, Venezuela", "Valencia, Venezuela", "Bogotá, Colombia"],
  },
];

const REDES = [
  {
    nombre: "Instagram",
    href: "https://instagram.com",
    d: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.2a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z",
  },
  {
    nombre: "LinkedIn",
    href: "https://linkedin.com",
    d: "M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6ZM8.3 18.3H5.6V9.7h2.7v8.6ZM7 8.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Zm11.4 9.8h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H9.9V9.7h2.6v1.2h.1a2.9 2.9 0 0 1 2.6-1.4c2.8 0 3.3 1.8 3.3 4.2v4.6Z",
  },
  {
    nombre: "Facebook",
    href: "https://facebook.com",
    d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z",
  },
];

/* La curva tenue de la esquina superior izquierda. */
const CURVA = {
  backgroundImage:
    "radial-gradient(120% 90% at 6% 0%, rgba(79,147,209,0.16), rgba(79,147,209,0) 60%)",
};

export default function SiteFooter({ correo = "soporte@amhsolutions.com" }) {
  const { abrir } = useContacto();
  const [valor, setValor] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  function alSuscribir(e) {
    e.preventDefault();
    /* TODO: aquí irá el POST al backend Node.js. */
    setSuscrito(true);
    setValor("");
  }

  return (
    <footer
      /* El footer va FUERA de <main>, así que el `gap` de allí no le
         llega: se pone aquí su propio margen superior, con el mismo
         valor, para que el hueco sea idéntico al de entre secciones. */
      className="relative isolate overflow-hidden rounded-[var(--radius-seccion)] bg-ink text-white
                 mx-[var(--margen-lienzo)] mb-[var(--margen-lienzo)] mt-[var(--margen-lienzo)]"
    >
      <div aria-hidden="true" style={CURVA} className="pointer-events-none absolute inset-0 z-0" />

      <Contenedor className="relative z-10 py-16 sm:py-20 lg:py-24">
        {/* ---------------- TITULAR + LOGO ---------------- */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
          <Link to="/" className="flex items-center gap-3 self-start text-xl font-bold tracking-tight">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-base font-black">
              A
            </span>
            AMH Solutions
          </Link>

          <p className="text-balance font-medium leading-[1.25] tracking-tight text-white/35 text-[clamp(1.5rem,3.2vw,2.75rem)]">
            La <span className="text-white">columna vertebral</span> que tu negocio
            necesita para <span className="text-white">dejar de improvisar</span>
          </p>
        </div>

        {/* ---------------- CORREO DESTACADO + COLUMNAS ---------------- */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16">
          <div>
            <a
              href={`mailto:${correo}`}
              className="block font-medium leading-none tracking-tight text-white transition-colors
                         hover:text-sky-light text-[clamp(1.125rem,2vw,1.75rem)]"
            >
              {correo}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              ¿Prefieres que te escribamos nosotros?
            </p>
            <button
              type="button"
              onClick={abrir}
              className="group mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/20
                         py-2.5 pl-5 pr-4 text-sm font-medium text-white transition-colors
                         hover:border-white/50 hover:bg-white/5"
            >
              Contacta nuestros servicios
              <IconFlecha className="h-4 w-4 text-sky-light transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNAS.map(({ titulo, enlaces, texto }) => (
              <div key={titulo}>
                <p className="text-sm font-semibold leading-none text-white">{titulo}</p>
                <ul className="mt-6 space-y-4">
                  {texto?.map((linea) => (
                    <li key={linea} className="text-sm leading-none text-white/45">
                      {linea}
                    </li>
                  ))}
                  {enlaces?.map(({ etiqueta, destino, ruta }) => (
                    <li key={etiqueta}>
                      {ruta ? (
                        <Link
                          to={destino}
                          className="block text-sm leading-none text-white/45 transition-colors hover:text-white"
                        >
                          {etiqueta}
                        </Link>
                      ) : (
                        <a
                          href={destino}
                          className="block text-sm leading-none text-white/45 transition-colors hover:text-white"
                        >
                          {etiqueta}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- BOLETÍN ---------------- */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-white/10 pt-10">
          <div className="w-full max-w-md">
            <p className="text-sm font-semibold text-white">Novedades del producto</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Una vez al mes, lo que hemos construido. Nada más.
            </p>

            {suscrito ? (
              <p className="mt-5 text-sm font-medium text-sky-light">
                Listo. Te hemos apuntado, gracias.
              </p>
            ) : (
              <form onSubmit={alSuscribir} className="mt-5 flex items-center gap-2.5">
                <label htmlFor="correo-boletin" className="sr-only">
                  Tu correo
                </label>
                <input
                  id="correo-boletin"
                  type="email"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3
                             text-sm text-white transition-colors placeholder:text-white/30
                             focus:border-sky focus:outline-none"
                />
                {/* Botón redondo aparte, como en nido: es un gesto, no una
                    etiqueta. El texto accesible va en aria-label. */}
                <button
                  type="submit"
                  aria-label="Suscribirme"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky text-white
                             transition-[background-color,transform] duration-200
                             hover:scale-105 hover:bg-sky-light"
                >
                  <IconFlecha className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>

          {/* ---------------- REDES ---------------- */}
          <ul className="flex items-center gap-3">
            {REDES.map(({ nombre, href, d }) => (
              <li key={nombre}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={nombre}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15
                             text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d={d} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- LÍNEA LEGAL ---------------- */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} AMH Solutions. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/30">Hecho en Venezuela.</p>
        </div>
      </Contenedor>
    </footer>
  );
}
