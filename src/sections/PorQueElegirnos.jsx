import { useEffect, useRef } from "react";
import { Seccion, Contenedor } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { VENTAJAS } from "../data/contenido.js";

/* ==================================================================
   POR QUÉ ELEGIRNOS — última sección de la home

   Adaptación de un diseño hecho en Canva: tres filas, el texto a la
   izquierda, una LÍNEA PUNTEADA vertical que separa columnas (gris que
   se va volviendo azul al bajar, ver LineaProgreso), y a
   la derecha la imagen de cada ventaja montada sobre una silueta azul.

   Es una sección a sangre (fondo blanco de punta a punta), NO una
   tarjeta en el centro: se probó así y se veía como un recuadro suelto.

   ─── LAS SILUETAS ─────────────────────────────────────────────────
   Calcadas del diseño, como SVG en línea (ver FORMAS). Cada una tiene
   su propio viewBox con la proporción del original:

     muesca         dos bloques apilados que se cruzan: el de arriba
                    plano a la izquierda y redondo a la derecha, el de
                    abajo al revés. Donde se tocan quedan dos muescas.
     paralelogramo  inclinado hacia la derecha, ~3:2, esquinas suaves.
     flor           cuadrado de lóbulos EN LAS ESQUINAS, con una muesca
                    cóncava en el centro de cada lado.

   ⚠️ LA IMAGEN NO ES MÁS GRANDE QUE SU FORMA. En el diseño el objeto
   mide casi lo mismo que la silueta (alcancía y auriculares un poco
   menos; el rompecabezas sobresale arriba y abajo porque es más alto
   que el paralelogramo, pero no más ancho). `ancho` en FORMAS es el
   ancho del objeto respecto a la silueta.

   ─── TIPOGRAFÍA ───────────────────────────────────────────────────
   Poppins en titulares y Garet en párrafos, como en el diseño. Ver
   --font-poppins / --font-garet en index.css (Garet cae en Urbanist
   si faltan sus archivos).

   En móvil la línea desaparece y cada fila se apila: imagen arriba,
   texto debajo.
================================================================== */

const FORMAS = {
  muesca: {
    viewBox: "0 0 112 100",
    ancho: "86%",
    caja: "w-[min(100%,270px)] aspect-[112/100]",
    dibujo: (
      <>
        {/* Bloque de arriba: esquinas izquierdas casi rectas, derechas
            redondas (radio = media altura). */}
        <path d="M3 0H86A26 26 0 0 1 86 52H3A3 3 0 0 1 0 49V3A3 3 0 0 1 3 0Z" />
        {/* Bloque de abajo: lo contrario. Se solapa 4 unidades con el
            de arriba para que no quede una rendija entre los dos. */}
        <path d="M26 48H109A3 3 0 0 1 112 51V97A3 3 0 0 1 109 100H26A26 26 0 0 1 26 48Z" />
      </>
    ),
  },
  paralelogramo: {
    viewBox: "0 0 145 100",
    ancho: "74%", /* el puzzle; antes 66% (Samuel lo quiso un poco más grande) */
    caja: "w-[min(100%,320px)] aspect-[145/100]",
    dibujo: (
      <path d="M51 0H139Q145 0 143 6L104 94Q101 100 95 100H6Q0 100 2 94L41 6Q44 0 51 0Z" />
    ),
  },
  flor: {
    viewBox: "0 0 100 100",
    ancho: "78%",
    caja: "w-[min(100%,250px)] aspect-square",
    dibujo: (
      <>
        {/* Lóbulos grandes y muy solapados: la muesca de cada lado
            queda en ~8% del ancho, como en el diseño. Con círculos más
            pequeños la forma se leía como un trébol. */}
        <circle cx="30" cy="30" r="30" />
        <circle cx="70" cy="30" r="30" />
        <circle cx="30" cy="70" r="30" />
        <circle cx="70" cy="70" r="30" />
        <rect x="30" y="30" width="40" height="40" />
      </>
    ),
  },
};

/* Ancho y alto reales de los WebP (tras recortar el lienzo vacío), para
   que el navegador reserve el hueco y la página no salte al cargar. */
const MEDIDAS = {
  alcancia: [640, 549],
  puzzle: [640, 632],
  auriculares: [640, 658],
};

function Fila({ titulo, texto, imagen, alt, forma, indice }) {
  const [anchoImg, altoImg] = MEDIDAS[imagen];
  const { viewBox, ancho, caja, dibujo } = FORMAS[forma];

  return (
    <li className="grid items-center gap-10 md:grid-cols-2 md:gap-0">
      {/* ---------------- TEXTO ----------------
          Centrado, con un filete azul claro bajo el titular como en el
          diseño. En móvil va DEBAJO de la imagen (`order`). */}
      <Reveal retraso={indice * 0.08} className="order-2 text-center md:order-1 md:px-12 lg:px-20">
        <h3 className="mx-auto max-w-[14ch] font-[family-name:var(--font-poppins)] text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-tight text-black">
          {titulo}
        </h3>
        <span aria-hidden="true" className="mx-auto mt-3 block h-px w-28 bg-azul-vivo/40" />
        <p className="mx-auto mt-4 max-w-[38ch] font-[family-name:var(--font-garet)] text-[clamp(0.875rem,1.1vw,1.0625rem)] font-normal leading-[1.65] text-body">
          {texto}
        </p>
      </Reveal>

      {/* ---------------- IMAGEN ----------------
          La caja tiene la proporción de la silueta; la silueta la llena
          entera y el objeto va centrado encima, a su `ancho`. */}
      <Reveal retraso={indice * 0.08 + 0.05} className="order-1 md:order-2 md:px-12 lg:px-20">
        <div className={`relative mx-auto grid place-items-center ${caja}`}>
          <svg
            viewBox={viewBox}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full fill-azul-vivo"
          >
            {dibujo}
          </svg>
          <img
            src={`/img/${imagen}.webp`}
            srcSet={`/img/${imagen}-sm.webp 360w, /img/${imagen}.webp 640w`}
            sizes="260px"
            alt={alt}
            width={anchoImg}
            height={altoImg}
            loading="lazy"
            decoding="async"
            style={{ width: ancho }}
            className="relative h-auto drop-shadow-[0_14px_16px_rgba(15,23,42,0.22)]"
          />
        </div>
      </Reveal>
    </li>
  );
}

/* LA LÍNEA PUNTEADA QUE SE LLENA AL BAJAR.
   Dos capas del mismo trazo punteado: una gris fija y otra azul cuya
   altura sigue el avance del scroll por la lista. El avance se mide con
   el CENTRO de la ventana: la línea va azul hasta la fila que se está
   leyendo. La punta de la capa azul se funde con el gris para que el
   avance no termine en un corte seco.

   Se escribe en una variable CSS (`--avance`) desde un ref, sin estado
   de React: así el scroll no provoca renders. Con
   `prefers-reduced-motion` la línea queda azul entera y quieta.

   Los puntos salen de una máscara (`mask-image` con un degradado que
   se repite), no de `border-dotted`: un borde no admite degradado. */
function LineaProgreso({ lista }) {
  const linea = useRef(null);

  useEffect(() => {
    const el = linea.current;
    const ul = lista.current;
    if (!el || !ul) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--avance", "100%");
      return;
    }

    let pendiente = false;
    const medir = () => {
      pendiente = false;
      const { top, height } = ul.getBoundingClientRect();
      const avance = (window.innerHeight / 2 - top) / height;
      el.style.setProperty("--avance", `${Math.min(Math.max(avance, 0), 1) * 100}%`);
    };
    const alMover = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(medir);
      }
    };

    medir();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
    };
  }, [lista]);

  const puntos = {
    maskImage: "repeating-linear-gradient(to bottom, #000 0 2px, transparent 2px 6px)",
    WebkitMaskImage: "repeating-linear-gradient(to bottom, #000 0 2px, transparent 2px 6px)",
  };

  return (
    <div
      ref={linea}
      aria-hidden="true"
      style={{ "--avance": "0%" }}
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 md:block"
    >
      <div style={puntos} className="absolute inset-0 bg-steel/45" />
      <div
        style={{
          ...puntos,
          height: "var(--avance)",
          backgroundImage:
            "linear-gradient(to bottom, var(--color-azul-vivo) calc(100% - 60px), var(--color-mist))",
        }}
        className="absolute inset-x-0 top-0"
      />
    </div>
  );
}

export default function PorQueElegirnos() {
  const lista = useRef(null);

  return (
    <Seccion id="por-que-elegirnos" tono="blanco">
      <Contenedor className="py-20 sm:py-28">
        <Reveal className="text-center">
          <h2 className="font-[family-name:var(--font-poppins)] text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-black">
            ¿Por qué <span className="text-azul-vivo">elegirnos</span>?
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-[1100px] md:mt-20">
          <LineaProgreso lista={lista} />
          <ul ref={lista} className="relative space-y-20 md:space-y-24">
            {VENTAJAS.map((ventaja, i) => (
              <Fila key={ventaja.id} {...ventaja} indice={i} />
            ))}
          </ul>
        </div>
      </Contenedor>
    </Seccion>
  );
}
