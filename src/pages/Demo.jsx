import { useState } from "react";
import { Contenedor, Eyebrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { DEMO, WHATSAPP } from "../data/contenido.js";
import { CAMPO, Pastilla, Etiqueta, Casilla } from "../components/formulario.jsx";
import { ICONOS, IconCheck, IconPlay, IconWhatsApp } from "../components/Iconos.jsx";

/* ==================================================================
   PÁGINA: SOLICITAR DEMO  (/demo)

   Patrón de la página de demo de Zoho Commerce: a la IZQUIERDA se vende
   la demo (titular, vídeo y "qué vas a ver") y a la DERECHA va el
   formulario en una tarjeta blanca.

   EL FORMULARIO ES CORTO A PROPÓSITO. Quien pide una demo todavía no ha
   decidido nada: cada campo de más (RIF, apellido, estado…) hace que
   menos gente lo envíe. Esos datos se piden al COMPRAR, en la Tienda.

   ⚠️ EL ENVÍO, DE MOMENTO, ES POR WHATSAPP: al enviar se abre WhatsApp
   con la solicitud ya escrita. No hay backend todavía. Cuando lo haya
   (correo, Google Sheets…), solo cambia `enviarSolicitud()`.

   Fondo oscuro arriba: la barra es transparente con el texto en blanco
   y se monta encima.
================================================================== */
export default function Demo() {
  const { eyebrow, titulo, texto, puntos } = DEMO;

  return (
    <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-azul-vivo/40 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-fondo-sky-light/40 blur-[120px]"
      />

      <Contenedor className="relative grid gap-12 pb-24 pt-32 sm:pt-36 lg:grid-cols-12 lg:gap-14">
        {/* ---------------- IZQUIERDA: vender la demo ---------------- */}
        <div className="lg:col-span-6 lg:pt-6">
          <Reveal>
            <Eyebrow claro className="text-white/70!">{eyebrow}</Eyebrow>
            <h1 className="mt-4 max-w-[14ch] text-balance text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em]">
              {titulo}
            </h1>
            <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-white/80">{texto}</p>
          </Reveal>

          <Reveal retraso={0.08} className="mt-10">
            <VideoDemo />
          </Reveal>

          <ul className="mt-10 space-y-5">
            {puntos.map(({ icono, titulo: t, texto: d }, i) => {
              const Icono = ICONOS[icono];
              return (
                <Reveal as="li" key={t} retraso={0.12 + i * 0.06} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Icono className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold leading-tight">{t}</h2>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-white/70">{d}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* ---------------- DERECHA: el formulario ---------------- */}
        {/* `lg:pt-20` lo baja respecto al titular (lo pidió Samuel).
            `sticky`: en escritorio el formulario se queda a la vista
            mientras se lee la columna de la izquierda. */}
        <div className="lg:col-span-6 lg:pt-20">
          <Reveal retraso={0.1} className="lg:sticky lg:top-24">
            <FormularioDemo />
          </Reveal>
        </div>
      </Contenedor>
    </section>
  );
}

/* ------------------------------------------------------------------
   EL VÍDEO

   Marco de navegador con la captura del sistema y un botón de play.
   Sin `DEMO.video` el botón no hace nada: se ve la etiqueta "Video
   próximamente" para no prometer algo que todavía no existe.
------------------------------------------------------------------ */
function VideoDemo() {
  const { video, poster } = DEMO;
  const [reproduciendo, setReproduciendo] = useState(false);
  const esYoutube = video && /youtu\.?be/.test(video);
  const idYoutube = esYoutube ? video.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] : null;

  return (
    <figure className="overflow-hidden rounded-2xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur-sm">
      {/* La barra del "navegador": tres puntos y la dirección. */}
      <div className="flex items-center gap-2 px-3 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="ml-3 truncate rounded-full bg-white/10 px-3 py-0.5 text-[0.6875rem] text-white/60">
          mybusinesspanel · demo
        </span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
        {reproduciendo && idYoutube ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${idYoutube}?autoplay=1&rel=0`}
            title="Demostración de My Business Panel"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : reproduciendo && video ? (
          <video className="absolute inset-0 h-full w-full" src={video} controls autoPlay playsInline />
        ) : (
          <>
            <img
              src={`/img/${poster}.webp`}
              srcSet={`/img/${poster}-sm.webp 900w, /img/${poster}.webp 1600w`}
              sizes="(min-width: 1024px) 560px, 90vw"
              alt="Pantalla de inicio de My Business Panel"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Velo para que el botón se lea sobre la captura. */}
            <div className="absolute inset-0 bg-linear-to-t from-indigo/70 via-indigo/20 to-transparent" />

            {video ? (
              <button
                type="button"
                onClick={() => setReproduciendo(true)}
                aria-label="Reproducir la demostración en vídeo"
                className="absolute left-1/2 top-1/2 grid h-18 w-18 -translate-x-1/2 -translate-y-1/2 place-items-center
                           rounded-full bg-white text-indigo-mid shadow-[var(--shadow-destacado)]
                           transition-transform duration-200 hover:scale-105"
              >
                <IconPlay className="ml-1 h-7 w-7" />
              </button>
            ) : (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 grid h-18 w-18 -translate-x-1/2 -translate-y-1/2 place-items-center
                           rounded-full bg-white/90 text-indigo-mid/60"
              >
                <IconPlay className="ml-1 h-7 w-7" />
              </span>
            )}

            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {video ? "Recorrido en vídeo" : "Video próximamente"}
            </figcaption>
          </>
        )}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------
   EL FORMULARIO

   Primero "¿persona natural o empresa?": según la respuesta se pide
   la empresa y su tamaño (obligatorios) o solo un "¿tienes un negocio o
   idea?" opcional. Luego nombre, WhatsApp, correo y consentimiento.
   (Los módulos se quitaron: Samuel los vio de más.) Tipo y tamaño son
   PASTILLAS (inputs reales
   escondidos con `sr-only` + `peer-checked`): se eligen de un toque y
   siguen funcionando con teclado y lector de pantalla.

   El consentimiento va en DOS casillas: una obligatoria ("que me
   contacten por esta solicitud") y otra opcional para las novedades. No
   se obliga a aceptar publicidad para pedir una demo.

   `sitio_web` es una TRAMPA para robots: invisible para las personas;
   si llega rellena, se finge el envío y no se manda nada. Evita el
   captcha, que frena a la gente de verdad.
------------------------------------------------------------------ */
/* Persona natural o empresa: decide qué campos se piden (ver arriba). */
const TIPOS = [
  { valor: "persona", texto: "Persona natural" },
  { valor: "empresa", texto: "Empresa" },
];

function FormularioDemo() {
  const [enviado, setEnviado] = useState(null);
  const [tipo, setTipo] = useState(null);

  function alEnviar(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    if (datos.get("sitio_web")) {
      setEnviado("robot");
      return;
    }
    setEnviado(enviarSolicitud(datos));
  }

  if (enviado) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center text-black shadow-[var(--shadow-destacado)] sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-tint text-sky">
          <IconCheck className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold tracking-[-0.02em]">¡Ya casi está!</h2>
        <p className="mx-auto mt-3 max-w-[34ch] leading-[1.65] text-body">
          Se abrió WhatsApp con tu solicitud. Envía el mensaje y te escribimos para agendar tu demo.
        </p>
        {enviado !== "robot" && (
          <a
            href={enviado}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky px-7 py-3 font-bold text-white transition-colors hover:bg-sky-light"
          >
            <IconWhatsApp className="h-5 w-5" />
            No se abrió, abrir WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={alEnviar}
      className="rounded-[1.75rem] bg-white p-7 text-black shadow-[var(--shadow-destacado)] sm:p-9"
    >
      <h2 className="text-2xl font-bold tracking-[-0.02em]">Solicita tu demo</h2>
      <p className="mt-1.5 text-[0.9375rem] text-steel">Gratis y sin compromiso.</p>

      {/* TIPO: la primera pregunta. Quien parte de una idea no tiene
          empresa todavía, y pedírsela le echa del formulario. Lo que se
          elige aquí decide qué campos salen debajo. */}
      <fieldset className="mt-7">
        <legend className="mb-2.5 text-sm font-semibold text-black">
          ¿Solicitas como…? <span className="text-sky">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS.map(({ valor, texto }, i) => (
            <Pastilla
              key={valor}
              nombre="tipo"
              valor={valor}
              requerido={i === 0}
              onChange={() => setTipo(valor)}
            >
              {texto}
            </Pastilla>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Etiqueta texto="Nombre" requerido>
          <input name="nombre" required autoComplete="name" placeholder="Tu nombre" className={CAMPO} />
        </Etiqueta>

        {/* Empresa: obligatoria. Persona natural: opcional y con otra
            pregunta, por si ya tiene un negocio o una idea que contar. */}
        {tipo === "persona" ? (
          <Etiqueta texto="¿Tienes un negocio o idea?">
            <input name="empresa" placeholder="Opcional" className={CAMPO} />
          </Etiqueta>
        ) : (
          <Etiqueta texto="Empresa" requerido>
            <input
              name="empresa"
              required
              autoComplete="organization"
              placeholder="Nombre o razón social"
              className={CAMPO}
            />
          </Etiqueta>
        )}

        <Etiqueta texto="WhatsApp" requerido>
          {/* El +58 va fijo delante, como en el formulario de Gálac: es
              lo que espera cualquiera en Venezuela. */}
          <div className="flex">
            <span className="grid place-items-center rounded-l-xl border border-r-0 border-mist bg-mist/50 px-3.5 text-[0.9375rem] font-semibold text-body">
              +58
            </span>
            <input
              name="whatsapp"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="412 1234567"
              pattern="0?[0-9\s]{10,12}"
              title="Número venezolano, por ejemplo 412 1234567"
              className={`${CAMPO} rounded-l-none`}
            />
          </div>
        </Etiqueta>
        <Etiqueta texto="Correo" requerido>
          <input name="correo" required type="email" autoComplete="email" placeholder="tu@correo.com" className={CAMPO} />
        </Etiqueta>
      </div>

      {/* TAMAÑO: solo para empresas. Una persona natural no tiene
          tamaño que elegir. */}
      {tipo === "empresa" && (
        <fieldset className="mt-6">
          <legend className="mb-2.5 text-sm font-semibold text-black">
            Tamaño de tu negocio <span className="text-sky">*</span>
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {DEMO.tamanos.map((tamano, i) => (
              <Pastilla key={tamano} nombre="tamano" valor={tamano} requerido={i === 0}>
                {tamano}
              </Pastilla>
            ))}
          </div>
        </fieldset>
      )}

      {/* Trampa para robots: fuera de la vista y del tabulador. */}
      <input
        type="text"
        name="sitio_web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-6 space-y-2.5">
        <Casilla nombre="consentimiento" requerido>
          Acepto que AMH Solutions me contacte sobre esta solicitud. <span className="text-sky">*</span>
        </Casilla>
        <Casilla nombre="novedades">Quiero recibir novedades de My Business Panel.</Casilla>
      </div>

      <button
        type="submit"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white
                   shadow-[var(--shadow-card)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-sky-light"
      >
        Solicitar demo
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-steel">
        <IconWhatsApp className="h-3.5 w-3.5" />
        Al enviar se abrirá WhatsApp con tu solicitud lista.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------
   ENVÍO

   Arma el mensaje y abre WhatsApp. Devuelve el enlace para ofrecerlo
   otra vez si el navegador bloqueó la pestaña nueva.

   ⚠️ Es el ÚNICO sitio que cambia el día que haya backend: aquí irá el
   POST (o Web3Forms, o Google Sheets) en lugar del wa.me.
------------------------------------------------------------------ */
function enviarSolicitud(datos) {
  const telefono = String(datos.get("whatsapp")).replace(/\D/g, "").replace(/^0/, "");
  const lineas = [
    "Hola, quiero solicitar una demo de My Business Panel.",
    "",
    `Nombre: ${datos.get("nombre")}`,
    `Tipo: ${datos.get("tipo") === "empresa" ? "Empresa" : "Persona natural"}`,
    datos.get("empresa") ? `${datos.get("tipo") === "empresa" ? "Empresa" : "Negocio o idea"}: ${datos.get("empresa")}` : null,
    `WhatsApp: +58 ${telefono}`,
    `Correo: ${datos.get("correo")}`,
    datos.get("tamano") ? `Tamaño: ${datos.get("tamano")}` : null,
    `Novedades: ${datos.get("novedades") ? "sí" : "no"}`,
  ];
  const url = `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(lineas.filter((l) => l !== null).join("\n"))}`;
  window.open(url, "_blank", "noopener");
  return url;
}
