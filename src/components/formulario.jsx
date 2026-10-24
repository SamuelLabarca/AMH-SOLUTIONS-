/* ------------------------------------------------------------------
   PIEZAS DE FORMULARIO

   Las comparten la demo (/demo) y el checkout de la tienda, para que
   los campos se vean y se comporten igual en toda la web.
------------------------------------------------------------------ */
export const CAMPO =
  "w-full rounded-xl border border-mist bg-cloud px-4 py-3 text-[0.9375rem] text-black transition-[border-color,box-shadow,background-color] " +
  "placeholder:text-steel/60 focus:border-sky focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky/15";

/* Una opción de las de pastilla: radio real escondido con `sr-only` y la
   pastilla pintada con `peer-checked`, así funciona con teclado y
   lector de pantalla. La elegida va en el azul `sky` de los botones
   (lo pidió Samuel: antes iba en ink). */
export function Pastilla({ nombre, valor, requerido = false, onChange, children, ...resto }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={nombre} value={valor} required={requerido} onChange={onChange} className="peer sr-only" {...resto} />
      <span
        className="block rounded-xl border border-mist bg-cloud px-2 py-3 text-center text-sm font-semibold text-body transition-colors
                   peer-checked:border-sky peer-checked:bg-sky peer-checked:text-white
                   peer-focus-visible:ring-4 peer-focus-visible:ring-sky/25 hover:border-sky/40"
      >
        {children}
      </span>
    </label>
  );
}

export function Etiqueta({ texto, requerido = false, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-black">
        {texto} {requerido && <span className="text-sky">*</span>}
      </span>
      {children}
    </label>
  );
}

export function Casilla({ nombre, requerido = false, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-body">
      <input
        type="checkbox"
        name={nombre}
        required={requerido}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-sky"
      />
      <span>{children}</span>
    </label>
  );
}
