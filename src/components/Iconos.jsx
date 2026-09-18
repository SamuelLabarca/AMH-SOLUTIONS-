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

export function IconManos(props) {
  return (
    <Base {...props}>
      <path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 12c0 4.65-7 9-7 9z" />
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

export function IconEscudo(props) {
  return (
    <Base {...props}>
      <path d="M12 2.5l7.5 3v6c0 4.7-3.2 8.6-7.5 10-4.3-1.4-7.5-5.3-7.5-10v-6z" />
      <path d="M9 12l2 2 4-4" />
    </Base>
  );
}

export function IconEmbudo(props) {
  return (
    <Base {...props}>
      <path d="M3 4h18l-7 8v7l-4 2v-9z" />
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

export function IconSoporte(props) {
  return (
    <Base {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2" y="13" width="4" height="6" rx="1.5" />
      <rect x="18" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19v.5a3 3 0 0 1-3 3h-3" />
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

export function IconCorreo(props) {
  return (
    <Base {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
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

export function IconChat(props) {
  return (
    <Base {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6.5A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8z" />
    </Base>
  );
}

/* Mapa nombre -> componente, para que los datos de `contenido.js` puedan
   pedir un icono con una cadena sin importar JSX. */
export const ICONOS = {
  manos: IconManos,
  circuito: IconCircuito,
  escudo: IconEscudo,
  embudo: IconEmbudo,
  cajas: IconCajas,
  grafica: IconGrafica,
  soporte: IconSoporte,
};
