import { useId } from "react";
import { Link } from "react-router-dom";
import { Contenedor } from "../../components/ui.jsx";

/* ------------------------------------------------------------------
   PIEZAS COMUNES DEL PORTAL  (estética de Google)

   El portal NO sigue el carácter de Airtek del resto de la web
   (titulares enormes en black). Aquí se viene a hacer un trámite, así
   que copia el inicio de sesión de Google: título en peso normal
   dentro de la tarjeta, campos con etiqueta flotante y los botones
   abajo, la acción secundaria como texto a la izquierda y la principal
   a la derecha.
------------------------------------------------------------------ */

/* EL FONDO: el mismo degradado de la sección de beneficios de
   /producto (la del "5 en 1"), con sus dos halos. La tarjeta blanca
   encima es lo único claro de la pantalla, así que el ojo va directo
   al formulario. Al ser oscuro, la barra va transparente con texto
   blanco, como en el resto de páginas. */
export function Fondo({ children, ...props }) {
  return (
    <section
      className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light"
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-azul-vivo/40 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-fondo-sky-light/40 blur-[120px]"
      />
      {children}
    </section>
  );
}

/* El marco de cada pantalla.

   Con `lateral` (las pantallas de entrar, registro y recuperación) es
   la tarjeta partida de Zoho: el formulario a la izquierda, con el
   título alineado a la izquierda, y `lateral` (el carrusel de
   seguridad) a la derecha tras una línea fina. En móvil la mitad
   derecha se oculta, como en Zoho: ahí solo cabe el formulario.

   Sin `lateral` (la cuenta) es una sola columna centrada; `ancho`
   decide cuánto mide.

   Debajo de la tarjeta, solo el copyright: el portal no lleva el pie
   del sitio (App.jsx lo quita en estas rutas). */
export function Pantalla({ eyebrow = "Portal de pagos", titulo, texto, ancho = "max-w-md", lateral, children }) {
  const cabecera = (
    <div className={lateral ? "" : "text-center"}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">{eyebrow}</p>
      <h1 className="mt-3 text-balance text-[2rem] font-normal leading-tight tracking-[-0.02em] text-black sm:text-[2.25rem]">
        {titulo}
      </h1>
      {texto && (
        <p className={`mt-2 max-w-[40ch] text-[0.9375rem] leading-[1.55] text-body ${lateral ? "" : "mx-auto"}`}>{texto}</p>
      )}
    </div>
  );

  return (
    <Fondo>
      <Contenedor className="relative flex min-h-screen flex-col items-center justify-between gap-10 pb-8 pt-32 sm:pt-36">
        {lateral ? (
          <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-destacado)] lg:grid-cols-2">
            <div className="px-6 py-9 sm:px-12 sm:py-12">
              {cabecera}
              <div className="mt-8">{children}</div>
            </div>
            <div className="hidden border-l border-mist px-12 py-12 lg:block">{lateral}</div>
          </div>
        ) : (
          <div
            className={`w-full ${ancho} rounded-[28px] bg-white px-6 py-9 shadow-[var(--shadow-destacado)] sm:px-10 sm:py-11`}
          >
            {cabecera}
            <div className="mt-8">{children}</div>
          </div>
        )}

        <p className="text-center text-sm text-white/60">
          © {new Date().getFullYear()} AMH Solutions, C.A. Todos los derechos reservados.
        </p>
      </Contenedor>
    </Fondo>
  );
}

/* Mensaje de error o de aviso. `role="alert"` para que el lector de
   pantalla lo lea en cuanto aparece. Discreto, como los de Google:
   sin bloques de color fuerte. */
export function Aviso({ tipo = "error", children }) {
  const estilo = tipo === "error" ? "bg-ink/[0.04] text-ink ring-ink/15" : "bg-sky-tint text-body ring-sky/20";
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm leading-snug ring-1 ${estilo}`}
    >
      {children}
    </div>
  );
}

/* ---------------- CAMPO CON ETIQUETA FLOTANTE ----------------
   La etiqueta va DENTRO del campo y, al enfocarlo o escribir, sube al
   borde. El truco es `placeholder=" "` + `peer-placeholder-shown`: el
   campo vacío "muestra" un placeholder en blanco, y en cuanto hay texto
   deja de mostrarlo y la etiqueta se queda arriba.

   ⚠️ La etiqueta lleva `bg-white` para tapar el borde por donde pasa:
   la tarjeta tiene que ser blanca o se verá un parche.

   El foco es un borde de 2px hecho con `ring-1` + `border`, no con
   `border-2`: cambiar el grosor del borde movería el texto un píxel. */
const BORDE =
  "border border-steel/50 bg-white text-base text-black transition-[border-color,box-shadow] " +
  "hover:border-black focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky";

const ETIQUETA_FLOTANTE =
  "pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-steel transition-all " +
  "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base " +
  "peer-focus:top-0 peer-focus:text-xs peer-focus:text-sky";

export function CampoFlotante({ etiqueta, ayuda, className = "", ...input }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <input id={id} placeholder=" " className={`peer h-14 w-full rounded-md px-4 ${BORDE}`} {...input} />
        <label htmlFor={id} className={ETIQUETA_FLOTANTE}>
          {etiqueta}
        </label>
      </div>
      {ayuda && <p className="mt-1.5 px-4 text-xs text-steel">{ayuda}</p>}
    </div>
  );
}

/* Un <select> con la misma pinta. Siempre tiene valor, así que su
   etiqueta va siempre arriba. */
export function SelectorFlotante({ etiqueta, opciones, className = "", ...select }) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <select id={id} className={`h-14 w-full cursor-pointer rounded-md pl-4 pr-8 ${BORDE}`} {...select}>
        {opciones.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <label htmlFor={id} className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-steel">
        {etiqueta}
      </label>
    </div>
  );
}

/* La casilla de Google: "Mostrar contraseña", debajo del campo. Una
   sola casilla para los dos campos del registro. */
export function MostrarContrasena({ visible, onChange }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-body">
      <input
        type="checkbox"
        checked={visible}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-sky"
      />
      Mostrar contraseña
    </label>
  );
}

/* La fila de abajo: acción secundaria como texto a la izquierda,
   principal como pastilla a la derecha. */
export function Acciones({ secundaria, cargando, textoCargando, children }) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      {secundaria ? (
        <Link
          to={secundaria.a}
          className="-ml-3 rounded-full px-3 py-2 text-sm font-semibold text-sky transition-colors hover:bg-sky-tint"
        >
          {secundaria.texto}
        </Link>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={cargando}
        className="rounded-full bg-sky px-6 py-2.5 text-sm font-semibold text-white transition-[background-color,box-shadow] hover:bg-sky-light hover:shadow-[var(--shadow-card)] disabled:cursor-wait disabled:opacity-80"
      >
        {cargando ? textoCargando : children}
      </button>
    </div>
  );
}

/* Enlace de texto suelto ("¿Olvidaste tu contraseña?"), el mismo azul
   y el mismo halo al pasar el ratón que la acción secundaria. */
export function EnlaceTexto({ a, children }) {
  return (
    <Link to={a} className="-ml-3 inline-block rounded-full px-3 py-2 text-sm font-semibold text-sky transition-colors hover:bg-sky-tint">
      {children}
    </Link>
  );
}
