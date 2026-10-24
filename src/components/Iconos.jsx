/* ------------------------------------------------------------------
   ICONOS

   SVG en línea y no una tipografía de iconos (el HTML de Stitch cargaba
   Material Symbols de Google): son ~300 bytes cada uno, heredan el color
   con `currentColor` y no añaden una petición de red que bloquea el
   render.

   Todos comparten lienzo 24x24 y trazo, así que se pueden intercambiar
   sin que cambie el peso visual.
------------------------------------------------------------------ */

function Base({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Mano señalando (el "pulsa aquí" del antes/después del Business
   Panel). Trazo de Lucide, licencia ISC. */
export function IconMano(props) {
  return (
    <Base {...props}>
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-4 0" />
      <path d="M14 10V9a2 2 0 0 0-4 0v1" />
      <path d="M10 9.5V4a2 2 0 0 0-4 0v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </Base>
  );
}

export function IconCircuito(props) {
  return (
    <Base {...props}>
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
    </Base>
  );
}

export function IconCajas(props) {
  return (
    <Base {...props}>
      <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M3 7.5l9 4.5 9-4.5M12 12v9" />
    </Base>
  );
}

export function IconGrafica(props) {
  return (
    <Base {...props}>
      <path d="M3 20h18" />
      <path d="M6 20v-6M11 20V8M16 20v-9M21 20V5" />
    </Base>
  );
}

/* Los tres de abajo son para los módulos de /producto (Recursos
   Humanos, Compras y Punto de venta). Trazos de Lucide, licencia ISC. */
export function IconPersonas(props) {
  return (
    <Base {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Base>
  );
}

export function IconCarrito(props) {
  return (
    <Base {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </Base>
  );
}

export function IconRecibo(props) {
  return (
    <Base {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11" />
    </Base>
  );
}

export function IconCheck(props) {
  return (
    <Base strokeWidth="2.5" {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Base>
  );
}

export function IconFlecha(props) {
  return (
    <Base {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

/* Los de abajo son de la sección de beneficios de /producto. Trazos de
   Lucide, licencia ISC. */

/* Documento con sello: "al día con la ley". */
export function IconLey(props) {
  return (
    <Base {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" />
      <path d="M14 2v6h6M20 8v4" />
      <path d="M8 13h5M8 17h3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M16.5 19.6 16 22l2-1 2 1-.5-2.4" />
    </Base>
  );
}

/* Dos flechas que se cruzan: cambio de moneda. */
export function IconCambio(props) {
  return (
    <Base {...props}>
      <path d="M8 3 4 7l4 4M4 7h16" />
      <path d="m16 21 4-4-4-4M20 17H4" />
    </Base>
  );
}

/* Rayo: "sin doble carga", todo pasa solo. */
export function IconRayo(props) {
  return (
    <Base {...props}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </Base>
  );
}

export function IconCampana(props) {
  return (
    <Base {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Base>
  );
}

/* Los tres tamaños de cliente (sección "Nos adaptamos…" de /producto).
   Van a ~64px, así que el trazo es más fino que el del resto. */

/* Tienda con toldo: el emprendedor. */
export function IconTienda(props) {
  return (
    <Base strokeWidth="1.4" {...props}>
      <path d="M4.5 4h15L21 9H3z" />
      <path d="M3 9a2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0" />
      <path d="M4.5 11.5V20h15v-8.5" />
      <path d="M8 20v-5h3.5v5" />
      <path d="M14 14h3.5v3H14z" />
    </Base>
  );
}

/* Edificio mediano con un anexo: la pyme. Trazo de Lucide (ISC). */
export function IconEdificio(props) {
  return (
    <Base strokeWidth="1.4" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </Base>
  );
}

/* Tres torres: la gran empresa (varias filiales). */
export function IconCorporativo(props) {
  return (
    <Base strokeWidth="1.4" {...props}>
      <path d="M2 22h20" />
      <path d="M3.5 22V10h4.5v12" />
      <path d="M8 22V2.5h8V22" />
      <path d="M16 22V7h4.5v15" />
      <path d="M11 6h2M11 10h2M11 14h2M11 18h2" />
      <path d="M5.5 13.5h.5M5.5 17.5h.5M18 10.5h.5M18 14.5h.5M18 18.5h.5" />
    </Base>
  );
}

/* Triángulo de "reproducir" del vídeo de /demo. Relleno. */
export function IconPlay(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/* Logotipo de WhatsApp, RELLENO y no de trazo como el resto (así es la
   marca). Mismo trazado que el del pie. */
export function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 7.6 7.6 0 0 0 2.6.6 2.6 2.6 0 0 0 1.7-.8 2.1 2.1 0 0 0 .5-1.5c0-.2-.2-.3-.4-.4Z" />
    </svg>
  );
}

/* Flecha hacia abajo de los desplegables de la barra. */
export function IconChevron(props) {
  return (
    <Base strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  );
}

export function IconCerrar(props) {
  return (
    <Base strokeWidth="2" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function IconMenu(props) {
  return (
    <Base strokeWidth="2" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </Base>
  );
}

export function IconTelefono(props) {
  return (
    <Base {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.5 19.5 4.5 13.5 4 5.7A2.5 2.5 0 0 1 6.5 3z" />
    </Base>
  );
}

/* Mapa nombre -> componente, para que los datos de `contenido.js` puedan
   pedir un icono con una cadena sin importar JSX. */
export const ICONOS = {
  circuito: IconCircuito,
  cajas: IconCajas,
  grafica: IconGrafica,
  personas: IconPersonas,
  carrito: IconCarrito,
  recibo: IconRecibo,
  ley: IconLey,
  cambio: IconCambio,
  rayo: IconRayo,
  campana: IconCampana,
  tienda: IconTienda,
  edificio: IconEdificio,
  corporativo: IconCorporativo,
};
