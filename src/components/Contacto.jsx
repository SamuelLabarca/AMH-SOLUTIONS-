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
import { IconCerrar, IconCheck, IconWhatsApp } from "./Iconos.jsx";
import { SERVICIOS, WHATSAPP } from "../data/contenido.js";

/* ==================================================================
   CONTACTO

   El formulario NO ocupa una sección de la página: es un botón pequeño
   que, al pulsarlo, CRISTALIZA la pantalla y saca una tarjeta en el
   centro para hablar con soporte.

   Está montado como contexto porque hay varios sitios que lo abren (la
   barra de navegación, el hero, la llamada de la home, el footer) y
   todos tienen que compartir el mismo modal. Duplicarlo daría varios
   diálogos superpuestos.

   Solo hay UN formulario: pedir una reunión con el equipo
   (`abrirReunion`). Sin fecha ni hora a propósito (Samuel: elegir día y
   hora en la web podía chocar con la agenda real); el momento se
   coordina después por WhatsApp.

   ⚠️ Había un segundo modo, "contacto" (`abrir`): un formulario de
   mensaje que NO enviaba nada (simulaba el envío) y mostraba datos de
   contacto de relleno. Se quitó el 7 oct 2026. Para un contacto rápido
   están el WhatsApp y el teléfono (`ATENCION` en contenido.js).
================================================================== */

const ContextoContacto = createContext(null);

export function ProveedorContacto({ children }) {
  const [abierto, setAbierto] = useState(false);

  /* Quién disparó la apertura. Se guarda para devolverle el foco al
     cerrar: si no, el foco vuelve al <body> y quien navega con teclado
     se queda al principio de la página, perdido. */
  const disparador = useRef(null);

  const abrirReunion = useCallback(() => {
    disparador.current = document.activeElement;
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    /* El foco se devuelve en el siguiente fotograma: en este el modal
       todavía está en el DOM y se lo quitaría de vuelta. */
    requestAnimationFrame(() => disparador.current?.focus?.());
  }, []);

  const valor = useMemo(
    () => ({ abierto, abrirReunion, cerrar }),
    [abierto, abrirReunion, cerrar],
  );

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
   EL MODAL
------------------------------------------------------------------ */
function ModalContacto() {
  const { abierto, cerrar } = useContacto();
  const panel = useRef(null);
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
        className={`relative z-10 w-full overflow-hidden max-w-[760px]
                   rounded-t-[2rem] bg-white shadow-[var(--shadow-destacado)]
                   sm:rounded-[2rem]
                   max-h-[92vh] overflow-y-auto
                   motion-safe:animate-[subir_.3s_cubic-bezier(.22,1,.36,1)_both]`}
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

        <Reunion enviado={enviado} setEnviado={setEnviado} cerrar={cerrar} />
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------
   MODO REUNIÓN: pedir una llamada con el equipo

   Una sola columna blanca con titular grande y campos en PÍLDORA de
   filo negro (referencia que pasó Samuel). Se quitó la columna navy de
   "Hablemos de tu negocio": ocupaba media tarjeta y no aportaba.

   Sin fecha ni hora (ver arriba). Se pide cómo prefiere la llamada
   (videollamada o teléfono) y de qué quiere hablar; el resto se
   coordina por WhatsApp.

   ⚠️ Sin backend todavía: la solicitud sale por WhatsApp ya escrita,
   como la de /demo. Cuando haya API, `pedirLlamada` es lo único que
   cambia.
------------------------------------------------------------------ */
const TEMAS = ["My Business Panel", ...SERVICIOS.map((s) => s.titulo), "Aún no lo sé"];

function Reunion({ enviado, setEnviado, cerrar }) {
  const [enlace, setEnlace] = useState(null);

  function alEnviar(evento) {
    evento.preventDefault();
    const url = pedirLlamada(new FormData(evento.currentTarget));
    window.open(url, "_blank", "noopener,noreferrer");
    setEnlace(url);
    setEnviado(true);
  }

  return (
    <div className="px-6 pb-8 pt-14 sm:px-12 sm:pb-12 sm:pt-14">
      {enviado ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-tint text-sky">
            <IconCheck className="h-7 w-7" />
          </span>
          <h2 id="titulo-contacto" className="mt-5 text-2xl font-extrabold text-black">
            ¡Solicitud lista!
          </h2>
          <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-body">
            Se abrió WhatsApp con tu solicitud. Envía el mensaje y te escribimos para coordinar la llamada.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {enlace && (
              <a
                href={enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-bold text-white transition-colors hover:bg-ink"
              >
                <IconWhatsApp className="h-5 w-5" />
                Abrir WhatsApp otra vez
              </a>
            )}
            <button
              type="button"
              onClick={cerrar}
              className="rounded-full px-6 py-3 font-bold text-black ring-[1.5px] ring-black transition-colors hover:bg-cloud"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={alEnviar}>
          {/* Titular grande y centrado, en Poppins extrabold: es lo que
              manda en la tarjeta. */}
          <h2
            id="titulo-contacto"
            className="mx-auto max-w-[20ch] text-balance text-center font-medium leading-[1.1] tracking-[-0.02em] text-sky text-[clamp(1.625rem,3.6vw,2.5rem)]"
          >
            Agenda una reunión con nuestro equipo
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-center text-sm leading-relaxed text-body">
            Déjanos tus datos y te escribimos por WhatsApp para coordinar el día y la hora.
          </p>

          <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
            <input name="nombre" required autoComplete="name" placeholder="Nombre y apellido *" aria-label="Nombre y apellido" className={`${CAMPO_PILDORA} sm:col-span-2`} />
            <input name="empresa" autoComplete="organization" placeholder="Nombre de la empresa" aria-label="Nombre de la empresa" className={`${CAMPO_PILDORA} sm:col-span-2`} />
            <input name="telefono" required type="tel" inputMode="tel" autoComplete="tel" placeholder="WhatsApp *" aria-label="WhatsApp" className={CAMPO_PILDORA} />
            <input name="correo" required type="email" autoComplete="email" placeholder="Correo electrónico *" aria-label="Correo electrónico" className={CAMPO_PILDORA} />
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-bold text-black">¿Cómo prefieres la llamada?</legend>
            <div className="grid grid-cols-2 gap-2">
              <OpcionPildora nombre="medio" valor="Videollamada" defaultChecked>Videollamada</OpcionPildora>
              <OpcionPildora nombre="medio" valor="Llamada telefónica">Teléfono</OpcionPildora>
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold text-black">¿De qué quieres hablar?</legend>
            <div className="flex flex-wrap gap-2">
              {TEMAS.map((tema) => (
                <OpcionPildora key={tema} nombre="tema" valor={tema} ajustada>
                  {tema}
                </OpcionPildora>
              ))}
            </div>
          </fieldset>

          <textarea
            name="mensaje"
            rows={2}
            placeholder="Algo que debamos saber (opcional)"
            aria-label="Algo que debamos saber"
            className={`${CAMPO_PILDORA} mt-5 resize-none rounded-[1.5rem]`}
          />

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-sky px-8 py-3.5 text-base font-extrabold text-white transition-colors hover:bg-sky-light"
          >
            Solicitar reunión
          </button>
        </form>
      )}
    </div>
  );
}

/* Campo de la reunión: PÍLDORA con filo negro y el nombre del campo
   dentro (placeholder en negrita), como la referencia que pasó Samuel.
   Sin etiqueta encima para que el formulario quepa sin scroll; el
   nombre accesible va en `aria-label`. */
const CAMPO_PILDORA =
  "w-full rounded-full border-[1.5px] border-black bg-white px-5 py-3 text-[0.9375rem] font-semibold text-black " +
  "placeholder:font-bold placeholder:text-black/80 focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/15";

/* Opción de radio con la misma estética: píldora con filo negro que se
   rellena del azul `sky` al elegirla (como el botón de enviar; antes
   iba en negro y Samuel lo pidió en azul). Radio real con `sr-only` (teclado y
   lector de pantalla). `ajustada` la deja del ancho de su texto. */
function OpcionPildora({ nombre, valor, ajustada = false, children, ...resto }) {
  return (
    <label className={`cursor-pointer ${ajustada ? "" : "block"}`}>
      <input type="radio" name={nombre} value={valor} required className="peer sr-only" {...resto} />
      <span
        className={`block rounded-full border-[1.5px] border-black px-4 py-2 text-center text-sm font-bold text-black transition-colors
                    hover:bg-cloud peer-checked:border-sky peer-checked:bg-sky peer-checked:text-white peer-checked:hover:bg-sky
                    peer-focus-visible:ring-4 peer-focus-visible:ring-sky/25`}
      >
        {children}
      </span>
    </label>
  );
}

/* Arma la solicitud y devuelve el enlace de WhatsApp. ⚠️ Aquí irá el
   POST a la API cuando exista. */
function pedirLlamada(datos) {
  const lineas = [
    "Hola, quiero agendar una llamada con AMH Solutions.",
    "",
    `Nombre: ${datos.get("nombre")}`,
    datos.get("empresa") ? `Empresa: ${datos.get("empresa")}` : null,
    `WhatsApp: ${datos.get("telefono")}`,
    `Correo: ${datos.get("correo")}`,
    `Prefiero: ${datos.get("medio")}`,
    `Tema: ${datos.get("tema")}`,
    datos.get("mensaje") ? `Comentario: ${datos.get("mensaje")}` : null,
  ].filter((l) => l !== null);
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(lineas.join("\n"))}`;
}
