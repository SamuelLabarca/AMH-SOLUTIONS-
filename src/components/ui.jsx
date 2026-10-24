
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------
   PRIMITIVAS DE UI

   Las piezas que se repiten por toda la página. Existen para que el
   estilo viva en un solo sitio: si el botón primario cambia, cambia
   aquí y no en quince archivos.
------------------------------------------------------------------ */

/* ---------------- SECCIÓN ----------------
   Cada sección es una TARJETA redondeada sobre el lienzo gris, con el
   mismo margen lateral y el mismo radio que todas las demás. Es la pieza
   que define la estética de nido: el gris que rodea la tarjeta es lo que
   hace visible la curva de la esquina.

   ⚠️ La SEPARACIÓN entre secciones NO se pone aquí ni en cada sección:
   la da el `gap` del <main> en App.jsx, para que margen lateral y hueco
   vertical sean el mismo valor y los bordes de todas las tarjetas queden
   alineados. Si una sección se pone su propio `mt`, se descuadra.

   `tono` decide el fondo. `bleed` la deja a sangre, sin margen ni radio. */
const TONOS = {
  blanco: "bg-white",
  tinte: "bg-sky-tint",
  /* Gris claro neutro. Lo usa Servicios. */
  piedra: "bg-piedra",
  navy: "bg-navy text-white",
  ink: "bg-ink text-white",
  /* Negro puro. Es el telón de las fotos: cualquier azul de fondo
     compite con el color de las imágenes y las apaga. Lo usa Servicios. */
  negro: "bg-black text-white",
};

export function Seccion({
  id,
  tono = "blanco",
  bleed = false,
  className = "",
  children,
  ...props
}) {
  return (
    <section
      id={id}
      className={`
        relative overflow-hidden ${TONOS[tono]}
        ${
          bleed
            ? ""
            : "mx-[var(--margen-lienzo)] rounded-[var(--radius-seccion)]"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </section>
  );
}

/* ---------------- CONTENEDOR ----------------
   El ancho de lectura y el relleno interior de las secciones. El padding
   vertical se pasa aparte a propósito: el CLAUDE.md pide variar el
   espaciado entre secciones para dar ritmo, así que no puede estar fijo
   aquí. */
export function Contenedor({ className = "", children, ...props }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------- EYEBROW ----------------
   La etiqueta pequeña en mayúsculas que va ENCIMA de cada H2
   (CLAUDE.md §5). Es uno de los dos únicos sitios donde el azul de
   acento aparece sobre blanco, y por eso va en semibold con
   letter-spacing: en regular y pequeño no tendría contraste suficiente. */
export function Eyebrow({ children, claro = false, className = "" }) {
  return (
    <p
      className={`font-sans text-xs font-semibold uppercase tracking-[0.18em] ${
        claro ? "text-sky-light" : "text-sky"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/* ---------------- TITULAR DE SECCIÓN ----------------
   ⚠️ NEGRO, BOLD (700), GRANDE y a la IZQUIERDA. Era extrabold; Samuel
   pidió todos los títulos en Poppins Bold, como el hero de la home. Nunca
   centrado, nunca en gris y nunca en el azul de acento: es la regla que
   más define el look y la más fácil de romper sin darse cuenta.

   `claro` solo cambia el negro por blanco para las secciones oscuras,
   donde el negro sería ilegible. */
export function Titulo({ children, claro = false, className = "", as: Etiqueta = "h2" }) {
  return (
    <Etiqueta
      className={`
        text-balance font-bold leading-[1.1] tracking-[-0.02em]
        text-[clamp(1.5rem,4vw,2.5rem)]
        ${claro ? "text-white" : "text-black"}
        ${className}
      `}
    >
      {children}
    </Etiqueta>
  );
}

/* ---------------- BOTÓN ----------------
   Un solo componente para las tres variantes. Se renderiza como <button>,
   <a> o <Link> según lo que reciba, para no perder la semántica: un
   enlace que navega tiene que ser un enlace, no un botón con un onClick.

   `escalar` es el hover: el elemento se levanta un poco y la sombra
   crece. Es el mismo gesto que usan las tarjetas, así que la página se
   siente coherente al pasar el ratón. */
const VARIANTES = {
  primario:
    "bg-navy text-white hover:bg-steel-navy shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]",
  acento:
    "bg-sky text-white hover:bg-sky-light shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]",
  /* El filo va como sombra interior y no como `border`: un borde suma
     2px al alto y, al lado de la pastilla `acento`, se veía desigual. */
  contorno:
    "text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)]",
  suave: "bg-white text-navy hover:bg-cloud shadow-[var(--shadow-card)]",
  /* Pastilla NEGRA con el texto blanco. Para fondos claros, donde el
     negro es lo que más contrasta: ni el navy ni el azul de acento
     paran el ojo igual sobre blanco.

     El hover va a `ink` (navy muy oscuro) y no a un gris: aclarar un
     negro lo ensucia, y desplazarlo hacia el azul de la marca se lee
     como una respuesta y no como un desgaste. */
  negro: "bg-black text-white hover:bg-ink shadow-[var(--shadow-card)]",
  /* Pastilla BLANCA con el texto negro. La pareja de `acento` sobre
     fondos oscuros: a diferencia de `suave`, la letra va en negro y no
     en navy, para que las dos pastillas se lean igual de rotundas. */
  blanco: "bg-white text-black hover:bg-cloud shadow-[var(--shadow-card)]",
};

export function Boton({
  variante = "primario",
  to,
  href,
  className = "",
  children,
  ...props
}) {
  const clases = `
    inline-flex items-center justify-center gap-2 rounded-full
    px-8 py-3.5 text-center text-base font-bold leading-tight
    transition-[background-color,box-shadow,transform,border-color] duration-200
    hover:-translate-y-0.5 active:translate-y-0
    ${VARIANTES[variante]} ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={clases} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={clases} {...props}>
      {children}
    </button>
  );
}
