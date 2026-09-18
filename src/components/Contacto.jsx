import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconCerrar, IconCorreo, IconTelefono, IconChat, IconFlecha } from "./Iconos.jsx";

/* ==================================================================
   CONTACTO

   El formulario NO ocupa una sección de la página: es un botón pequeño
   que, al pulsarlo, CRISTALIZA la pantalla y saca una tarjeta en el
   centro para hablar con soporte.

   Está montado como contexto porque hay varios sitios que lo abren (la
   barra de navegación, el hero, la llamada de la home, el footer) y
   todos tienen que compartir el mismo modal. Duplicarlo daría varios
   diálogos superpuestos.
================================================================== */

const ContextoContacto = createContext(null);

export function ProveedorContacto({ children }) {
  const [abierto, setAbierto] = useState(false);

  /* Quién disparó la apertura. Se guarda para devolverle el foco al
     cerrar: si no, el foco vuelve al <body> y quien navega con teclado
     se queda al principio de la página, perdido. */
  const disparador = useRef(null);

  const abrir = useCallback(() => {
    disparador.current = document.activeElement;
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    /* El foco se devuelve en el siguiente fotograma: en este el modal
       todavía está en el DOM y se lo quitaría de vuelta. */
    requestAnimationFrame(() => disparador.current?.focus?.());
  }, []);

  const valor = useMemo(() => ({ abierto, abrir, cerrar }), [abierto, abrir, cerrar]);

  return (
    <ContextoContacto.Provider value={valor}>
      {children}
      <ModalContacto />
    </ContextoContacto.Provider>
  );
}

export function useContacto() {
  const ctx = useContext(ContextoContacto);
  if (!ctx) {
    throw new Error("useContacto tiene que usarse dentro de <ProveedorContacto>");
  }
  return ctx;
}

/* ------------------------------------------------------------------
   EL BOTÓN

   Deliberadamente pequeño: es una invitación, no una sección. Va donde
   haga falta.
------------------------------------------------------------------ */
export function BotonContacto({ className = "", children = "Contacta nuestros servicios" }) {
  const { abrir } = useContacto();

  return (
    <button
      type="button"
      onClick={abrir}
      className={`
        group inline-flex items-center gap-3 rounded-full
        border border-mist bg-white py-2 pl-5 pr-2
        text-sm font-semibold text-navy
        shadow-[var(--shadow-card)]
        transition-[box-shadow,transform,border-color] duration-200
        hover:-translate-y-0.5 hover:border-sky/40 hover:shadow-[var(--shadow-lift)]
        ${className}
      `}
    >
      {children}
      {/* El círculo de acento se ensancha al pasar el ratón. Es el mismo
          gesto de "seguir adelante" que la flecha, pero sin moverla de
          sitio, que descolocaría el texto. */}
      <span
        className="grid h-8 w-8 place-items-center rounded-full bg-sky text-white
                   transition-transform duration-200 group-hover:scale-110"
      >
        <IconFlecha className="h-4 w-4" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------
   VÍAS DE CONTACTO

   Se ofrecen junto al formulario porque no todo el mundo quiere
   rellenar campos: hay quien prefiere llamar y ya está.
------------------------------------------------------------------ */
const VIAS = [
  { icono: IconCorreo, etiqueta: "Escríbenos", valor: "soporte@amhsolutions.com" },
  { icono: IconTelefono, etiqueta: "Llámanos", valor: "+58 424 000 0000" },
  { icono: IconChat, etiqueta: "Chat en vivo", valor: "Lunes a viernes, 8:00–18:00" },
];

const ASUNTOS = [
  "Quiero una demostración",
  "Tengo dudas sobre los planes",
  "Soporte técnico",
  "Otro asunto",
];

/* ------------------------------------------------------------------
   EL MODAL
------------------------------------------------------------------ */
function ModalContacto() {
  const { abierto, cerrar } = useContacto();
  const panel = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  /* --- Escape, bloqueo del desplazamiento y trampa de foco ---
     Los tres van juntos porque los tres duran exactamente lo que dura
     el modal abierto, y separarlos multiplicaría los efectos. */
  useEffect(() => {
    if (!abierto) return;

    /* El fondo NO se desplaza mientras el diálogo está abierto. Se
       compensa el ancho de la barra de desplazamiento con padding: sin
       eso, al ocultarla la página entera da un salto lateral. */
    const anchoBarra = window.innerWidth - document.documentElement.clientWidth;
    const overflowPrevio = document.body.style.overflow;
    const paddingPrevio = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (anchoBarra > 0) document.body.style.paddingRight = `${anchoBarra}px`;

    function alPulsarTecla(evento) {
      if (evento.key === "Escape") {
        cerrar();
        return;
      }

      /* Trampa de foco: el tabulador tiene que dar vueltas DENTRO del
         diálogo. Si se sale, el usuario de teclado acaba navegando por
         una página que visualmente está tapada y no puede ver. */
      if (evento.key !== "Tab") return;

      const enfocables = panel.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!enfocables?.length) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPulsarTecla);

    /* El foco entra en el diálogo al abrirlo, en el primer campo. */
    requestAnimationFrame(() => {
      panel.current?.querySelector("input, button")?.focus();
    });

    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = overflowPrevio;
      document.body.style.paddingRight = paddingPrevio;
    };
  }, [abierto, cerrar]);

  /* El estado del formulario se reinicia al cerrar, no al abrir: así el
     usuario ve el mensaje de "enviado" hasta que él mismo cierra. */
  useEffect(() => {
    if (abierto) return;
    const t = setTimeout(() => setEnviado(false), 250);
    return () => clearTimeout(t);
  }, [abierto]);

  if (!abierto) return null;

  async function alEnviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    /* TODO: aquí irá el POST al backend Node.js. De momento solo se
       simula la espera para que la interfaz esté terminada y el día que
       exista el endpoint solo haya que cambiar estas dos líneas. */
    await new Promise((r) => setTimeout(r, 700));
    setEnviando(false);
    setEnviado(true);
  }

  /* Va en un portal, al final del <body>: dentro del árbol de la página
     cualquier `overflow: hidden` o `transform` de una sección padre lo
     recortaría o rompería su posición fija. */
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      {/* ---------- LA PANTALLA CRISTALIZADA ----------
          El desenfoque es lo que pediste: el fondo no se tapa, se
          cristaliza. El velo navy encima es lo que da el contraste para
          que la tarjeta blanca despegue; solo con desenfoque, sobre una
          sección clara, la tarjeta se perdería. */}
      <div
        onClick={cerrar}
        aria-hidden="true"
        className="absolute inset-0 bg-ink/35 backdrop-blur-xl
                   motion-safe:animate-[aparecer_.25s_ease-out_both]"
      />

      {/* ---------- LA TARJETA ---------- */}
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-contacto"
        className="relative z-10 w-full max-w-[860px] overflow-hidden
                   rounded-t-[2rem] bg-white shadow-[var(--shadow-destacado)]
                   sm:rounded-[2rem]
                   max-h-[92vh] overflow-y-auto
                   motion-safe:animate-[subir_.3s_cubic-bezier(.22,1,.36,1)_both]"
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center
                     rounded-full text-steel transition-colors
                     hover:bg-cloud hover:text-navy"
        >
          <IconCerrar className="h-5 w-5" />
        </button>

        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* --- Columna izquierda: las vías directas, sobre navy --- */}
          <div className="bg-navy p-8 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-light">
              Estamos aquí
            </p>
            <h2 id="titulo-contacto" className="mt-3 text-2xl font-extrabold leading-[1.15]">
              Hablemos de tu negocio
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Cuéntanos qué necesitas y te responde una persona del equipo, no un
              robot. Normalmente en menos de un día hábil.
            </p>

            <ul className="mt-8 space-y-5">
              {VIAS.map(({ icono: Icono, etiqueta, valor }) => (
                <li key={etiqueta} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sky-light">
                    <Icono className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-white/50">
                      {etiqueta}
                    </span>
                    <span className="block text-sm font-medium">{valor}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Columna derecha: el formulario --- */}
          <div className="p-8 sm:p-10">
            {enviado ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-tint text-sky">
                  <IconCorreo className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-black">Mensaje enviado</h3>
                <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-body">
                  Gracias por escribirnos. Un miembro del equipo de soporte se pondrá
                  en contacto contigo muy pronto.
                </p>
                <button
                  type="button"
                  onClick={cerrar}
                  className="mt-7 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-steel-navy"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={alEnviar} className="space-y-4">
                <Campo etiqueta="Nombre" nombre="nombre" autoComplete="name" required />
                <Campo
                  etiqueta="Empresa"
                  nombre="empresa"
                  autoComplete="organization"
                />
                <Campo
                  etiqueta="Correo"
                  nombre="correo"
                  tipo="email"
                  autoComplete="email"
                  required
                />

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                    ¿En qué te ayudamos?
                  </span>
                  <select
                    name="asunto"
                    className="w-full rounded-xl border border-mist bg-cloud px-4 py-3 text-sm
                               text-body transition-colors
                               focus:border-sky focus:bg-white focus:outline-none"
                  >
                    {ASUNTOS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                    Mensaje
                  </span>
                  <textarea
                    name="mensaje"
                    rows={4}
                    required
                    placeholder="Cuéntanos brevemente qué necesitas…"
                    className="w-full resize-none rounded-xl border border-mist bg-cloud px-4 py-3 text-sm
                               text-body transition-colors placeholder:text-steel/60
                               focus:border-sky focus:bg-white focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white
                             shadow-[var(--shadow-card)] transition-all duration-200
                             hover:bg-steel-navy hover:shadow-[var(--shadow-lift)]
                             disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando ? "Enviando…" : "Enviar mensaje"}
                </button>

                <p className="text-center text-xs text-steel">
                  Tus datos solo se usan para responderte. No los compartimos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Campo({ etiqueta, nombre, tipo = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
        {etiqueta}
      </span>
      <input
        type={tipo}
        name={nombre}
        className="w-full rounded-xl border border-mist bg-cloud px-4 py-3 text-sm
                   text-body transition-colors placeholder:text-steel/60
                   focus:border-sky focus:bg-white focus:outline-none"
        {...props}
      />
    </label>
  );
}
