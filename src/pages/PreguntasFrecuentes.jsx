import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Contenedor, Eyebrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useContacto } from "../components/Contacto.jsx";
import { IconChevron, IconFlecha, IconWhatsApp, IconTelefono, IconPersonas } from "../components/Iconos.jsx";
import { PREGUNTAS, WHATSAPP, ATENCION } from "../data/contenido.js";

/* ==================================================================
   PÁGINA: PREGUNTAS FRECUENTES  (/preguntas-frecuentes)

   El reparto de la FAQ de Zoho One (referencia de Samuel): a la
   izquierda, la lista de categorías con un punto en la activa y filetes
   finos entre ellas; a la derecha, cada categoría con su título y sus
   preguntas en acordeón, separadas por filetes, con la flecha al final.
   Sin tarjetas ni sombras: se lee como un documento, no como un panel.

   La lista de la izquierda es pegajosa y sigue el scroll (marca la
   categoría que está en pantalla). En móvil se convierte en una fila de
   pastillas que se desliza en horizontal, pegada bajo la barra.

   El contenido vive en `PREGUNTAS` (contenido.js).
================================================================== */
export default function PreguntasFrecuentes() {
  const { abrirReunion } = useContacto();
  const [activa, setActiva] = useState(PREGUNTAS[0].id);

  /* Scroll-spy: la categoría activa es la que cruza la franja de arriba
     de la pantalla (el `rootMargin` deja fuera lo que tapa la barra y la
     mitad de abajo). */
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    PREGUNTAS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, []);

  return (
    <>
      {/* ---------------- CABECERA ----------------
          Oscura y compacta: la barra va transparente con el texto en
          blanco arriba del todo y necesita fondo oscuro debajo. */}
      <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
        <Contenedor className="relative pb-16 pt-32 sm:pb-20 sm:pt-36">
          <Eyebrow claro className="text-white/70!">
            Ayuda
          </Eyebrow>
          <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1] tracking-[-0.03em]">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 max-w-[52ch] leading-[1.6] text-white/80">
            Lo que más nos preguntan sobre My Business Panel, sus planes y cómo se paga. Si no encuentras tu
            respuesta, escríbenos.
          </p>
        </Contenedor>
      </section>

      <section className="bg-white">
        <Contenedor className="py-10 lg:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* ---------------- CATEGORÍAS ---------------- */}
            <nav aria-label="Categorías" className="lg:col-span-3">
              {/* Móvil: pastillas deslizables, pegadas bajo la barra. */}
              <ul
                className="sticky top-[72px] z-10 -mx-5 flex gap-2 overflow-x-auto bg-white px-5 py-3 sm:-mx-8 sm:px-8
                           lg:hidden [scrollbar-width:none]"
              >
                {PREGUNTAS.map(({ id, titulo }) => (
                  <li key={id} className="shrink-0">
                    <a
                      href={`#${id}`}
                      onClick={(e) => irA(e, id)}
                      className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        activa === id ? "bg-sky text-white" : "bg-cloud text-body"
                      }`}
                    >
                      {titulo}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Escritorio: lista vertical con punto y filetes, como Zoho. */}
              <ul className="sticky top-28 hidden lg:block">
                {PREGUNTAS.map(({ id, titulo }) => (
                  <li key={id} className="border-b border-mist last:border-b-0">
                    <a
                      href={`#${id}`}
                      onClick={(e) => irA(e, id)}
                      aria-current={activa === id ? "true" : undefined}
                      className={`flex items-center gap-3 py-3.5 text-[1.0625rem] transition-colors ${
                        activa === id ? "font-semibold text-sky" : "text-body hover:text-black"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${activa === id ? "bg-sky" : "bg-mist"}`}
                      />
                      {titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------------- PREGUNTAS ---------------- */}
            <div className="mt-6 space-y-14 lg:col-span-9 lg:mt-0">
              {PREGUNTAS.map(({ id, titulo, preguntas }) => (
                /* `scroll-mt` para que el título no quede bajo la barra
                   al saltar desde la lista. */
                <section key={id} id={id} aria-labelledby={`t-${id}`} className="scroll-mt-32">
                  <h2 id={`t-${id}`} className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-black">
                    {titulo}
                  </h2>
                  <ul className="mt-3">
                    {preguntas.map((item, i) => (
                      <Pregunta key={item.p} {...item} idBase={`${id}-${i}`} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </Contenedor>
      </section>

      {/* ---------------- CIERRE: TRES VÍAS, SIN FORMULARIO ----------------
          Un formulario aquí sería un paso de más: quien no encontró su
          respuesta quiere preguntar YA. Así que se ofrecen las tres vías
          que de verdad llegan a alguien, de la más rápida a la más
          formal, con la estética de la banda de /tienda (iconos de línea
          sueltos y filetes finos, sin tarjetas). */}
      <section className="bg-sky-tint">
        <Contenedor className="py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-black">
              ¿No encuentras tu respuesta?
            </h2>
            <p className="mx-auto mt-2 max-w-[48ch] text-body">
              Pregúntanos directamente. Del otro lado te responde una persona del equipo.
            </p>
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-4xl gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-sky/20">
            <Via
              icono={IconWhatsApp}
              titulo="WhatsApp"
              texto="La vía más rápida. Escríbenos tu duda tal cual."
              accion="Abrir el chat"
              href={`https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(
                "Hola, tengo una pregunta sobre My Business Panel que no está en la web: ",
              )}`}
            />
            <Via
              icono={IconTelefono}
              titulo="Llámanos"
              texto="Si prefieres explicarlo de viva voz."
              accion={ATENCION.telefono}
              href={`tel:${ATENCION.telefono.replace(/\s/g, "")}`}
            />
            <Via
              icono={IconPersonas}
              titulo="Una reunión"
              texto="Si tu duda es larga, lo vemos juntos por videollamada."
              accion="Agendar"
              onClick={abrirReunion}
            />
          </ul>
        </Contenedor>
      </section>
    </>
  );
}

/* Salto suave a la categoría sin dejar el ancla en la URL: el <a> sigue
   teniendo su href para quien abre en otra pestaña o sin JavaScript. */
function irA(evento, id) {
  evento.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------
   UNA PREGUNTA

   Botón con `aria-expanded` y la respuesta en una región. Se abre con
   el truco de `grid-rows` 0fr → 1fr, que anima la altura sin medirla.
------------------------------------------------------------------ */
function Pregunta({ p, r, enlace, idBase }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <li className="border-b border-mist">
      <h3>
        <button
          type="button"
          id={`b-${idBase}`}
          aria-expanded={abierta}
          aria-controls={`r-${idBase}`}
          onClick={() => setAbierta((v) => !v)}
          className="flex w-full items-center justify-between gap-6 py-6 text-left text-[1.0625rem] font-semibold leading-snug
                     text-black transition-colors hover:text-sky sm:text-xl"
        >
          {p}
          <IconChevron
            className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
              abierta ? "rotate-180 text-sky" : ""
            }`}
          />
        </button>
      </h3>
      <div
        id={`r-${idBase}`}
        role="region"
        aria-labelledby={`b-${idBase}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          abierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        {/* `inert` cerrada: si no, el enlace escondido seguiría
            recibiendo el foco con el tabulador. */}
        <div className="overflow-hidden" inert={!abierta}>
          <p className="max-w-[68ch] pb-6 leading-[1.7] text-body">{r}</p>
          {enlace && (
            <Link
              to={enlace.destino}
              className="-mt-3 mb-6 inline-flex items-center gap-1.5 font-bold text-sky hover:text-sky-light"
            >
              {enlace.texto}
              <IconFlecha className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

/* Una vía de contacto del cierre. Enlace si lleva a otro sitio (chat,
   teléfono) y botón si abre el modal: cada cosa con su semántica. */
function Via({ icono: Icono, titulo, texto, accion, href, onClick }) {
  const clases = "mt-4 inline-flex items-center gap-1.5 font-bold text-sky transition-colors hover:text-sky-light";
  return (
    <li className="flex flex-col items-center px-6">
      <Icono className="h-10 w-10 text-sky [stroke-width:1.4]" />
      <span className="mt-4 text-lg font-bold text-black">{titulo}</span>
      <span className="mt-1 max-w-[26ch] text-sm leading-snug text-body">{texto}</span>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={clases}>
          {accion}
          <IconFlecha className="h-4 w-4" />
        </a>
      ) : (
        <button type="button" onClick={onClick} className={clases}>
          {accion}
          <IconFlecha className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}
