import { Seccion, Contenedor, Boton, Eyebrow, Titulo } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { useState } from "react";
import { IconCheck, IconFlecha, IconMano } from "../components/Iconos.jsx";
import { PANEL } from "../data/contenido.js";

/* ==================================================================
   BUSINESS PANEL — presentación del producto

   Una tarjeta ancha de gris carbón: la captura del panel a la
   izquierda y, a la derecha, una presentación CORTA del sistema que
   empuja hacia /producto (ver `PANEL` en contenido.js).

   ─── LAS PROPORCIONES ─────────────────────────────────────────────
   Salen del Figma de referencia, no son a ojo. Allí la tarjeta mide
   1806x766 y la imagen 845x661, colocada a 48px del borde izquierdo y
   51px del superior. Traducido a proporciones, que es lo que permite
   que la pieza escale:

     tarjeta   aspect 1806/766  ·  radio 103/1806 = 5,7% del ancho
     relleno   48/1806 = 2,66% del ancho, por los cuatro lados
     imagen    845 de los 1710 de ancho útil = 49,4%  ·  radio 50

   El relleno va en PORCENTAJE y no en rem a propósito: en CSS el
   padding porcentual se calcula siempre contra el ANCHO, también el de
   arriba y abajo. Eso es justo lo que hace falta aquí, porque la
   tarjeta tiene proporción fija: así el marco se mantiene uniforme a
   cualquier tamaño sin una sola media query.

   Los radios sí van en rem: un radio porcentual deforma la curva en
   cuanto la caja no es cuadrada, y aquí es casi 2,4:1.

   ⚠️ La tarjeta YA NO lleva la proporción fija 1806/766 del Figma.
   Con el texto de la derecha dentro, ese alto no le alcanzaba: el
   texto tocaba el canto de arriba y el de abajo incluso a 1600px. Ahora
   el alto lo marca el texto (con `lg:py-6` de aire) y la imagen se
   estira hasta él. Va a 1280px, más ancha que el contenedor estándar
   (de ahí el `max-w-[1440px]!` del <Contenedor>), para que el panel
   se lea como la pieza horizontal y protagonista de la sección. En móvil la imagen va arriba con la proporción de
   la captura (845x661) y el texto debajo.

   LA IMAGEN es `captura-login`: la captura del login del sistema
   (3072x1800, tomada con DPR 3). `npm run imagenes` la pasa por el
   perfil de captura (1600/900px, calidad alta). Para cambiarla,
   reemplaza `public/img/captura-login.png` y vuelve a correr el script.
================================================================== */
export default function BusinessPanel({ imagen, alt = "", imagenAntes, altAntes = "" }) {
  /* Antes/después: `true` deja ver la foto de procesos manuales (antes)
     con la captura del login fuera, a la derecha; `false` la trae de
     vuelta. ARRANCA en el antes (lo pidió Samuel): primero el desorden
     y, al pulsar la mano, entra el login. `tocado` apaga el pulso del botón tras el primer clic: ya
     no hace falta llamar la atención. */
  const [antes, setAntes] = useState(true);
  const [tocado, setTocado] = useState(false);

  return (
    /* El `-mt-10 pt-10` mete esta sección por debajo de Servicios, que
       va redondeada y con `z-10`: es lo que hace que sus esquinas
       inferiores recorten sobre este blanco y no sobre el gris del
       <body>. Va en pareja con el `-mt-10` de allí; si quitas una,
       quita la otra. */
    <Seccion id="panel" tono="blanco" className="-mt-10 pt-10">
      <Contenedor className="max-w-[1440px]! py-12 max-sm:px-2! sm:py-24">
        <Reveal>
          <div
            className="mx-auto flex max-w-[1280px] flex-col gap-8 rounded-[2rem] bg-carbon p-2.5 sm:rounded-[2.5rem] sm:p-5
                       lg:flex-row lg:items-center lg:gap-[3.5%] lg:rounded-[3rem] lg:p-[2.66%]"
          >
            {/* LA CAPTURA DEL LOGIN, sin marco ni monitor. Se probó
                dentro de un mockup de monitor y se descartó: a este tamaño
                el login quedaba diminuto y se perdía el detalle. Sola,
                la captura ocupa toda la columna y el texto se lee.

                La proporción la da la imagen (3072x1800, 16:9,4), no la
                tarjeta: así no se recorta el formulario de la derecha. La
                tarjeta centra en vertical (`lg:items-center`) y la
                captura queda a media altura del texto. El filo blanco al
                10% la separa del carbón, que es casi del mismo tono que
                el panel izquierdo del login. */}
            {/* ANTES / DESPUÉS. La captura del login va EN FLUJO (marca
                el alto de la caja) y la foto del "antes" va debajo, en
                absoluto. Al pulsar la mano, el login se desliza entero a
                la derecha y sale por el `overflow-hidden`; al volver a
                pulsar, regresa. Se desliza en vez de fundirse porque así
                se lee como "quitar lo viejo de en medio".

                El botón va a caballo del canto izquierdo de la imagen,
                dentro del relleno de la tarjeta. */}
            <div className="relative w-full shrink-0 lg:w-[56%]">
              <div
                className="relative overflow-hidden rounded-[1.25rem] ring-1 ring-white/10
                           shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
              >
                {/* Debajo: el antes. Mientras no haya foto, un hueco claro
                    con el texto, para que la interacción ya se entienda. */}
                {imagenAntes ? (
                  <img
                    src={`/img/${imagenAntes}.webp`}
                    srcSet={`/img/${imagenAntes}-sm.webp 900w, /img/${imagenAntes}.webp 1600w`}
                    sizes="(min-width: 1024px) 680px, 90vw"
                    alt={altAntes}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-shell p-8 text-center">
                    <p className="max-w-[24ch] text-lg font-bold leading-snug text-body">
                      Antes: papeles, hojas de cálculo y procesos manuales
                    </p>
                  </div>
                )}

                {/* Encima: el después (el login). */}
                {imagen && (
                  <img
                    src={`/img/${imagen}.webp`}
                    srcSet={`/img/${imagen}-sm.webp 900w, /img/${imagen}.webp 1600w`}
                    sizes="(min-width: 1024px) 680px, 90vw"
                    alt={alt}
                    width={1600}
                    height={938}
                    loading="lazy"
                    decoding="async"
                    className={`relative block h-auto w-full
                                transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]
                                motion-reduce:transition-none
                                ${antes ? "translate-x-full" : "translate-x-0"}`}
                  />
                )}

                {/* Etiqueta de qué se está viendo. */}
                <span
                  className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold
                             uppercase tracking-[0.12em] text-white backdrop-blur-sm"
                >
                  {antes ? "Antes" : "Con My Business Panel"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAntes((v) => !v);
                  setTocado(true);
                }}
                aria-pressed={antes}
                aria-label={antes ? "Ver la pantalla de My Business Panel" : "Ver cómo era antes: procesos manuales"}
                className="group absolute left-0 top-1/2 z-10 grid h-9 w-9 -translate-x-1/4 -translate-y-1/2
                           place-items-center rounded-full bg-white text-black
                           shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]
                           transition-transform duration-200 hover:scale-110 sm:h-12 sm:w-12 lg:-translate-x-1/2"
              >
                {/* Pulso hasta el primer clic: invita a pulsar. */}
                {!tocado && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping"
                  />
                )}
                <IconMano className="relative h-4.5 w-4.5 -rotate-12 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* ---------------- EL TEXTO ----------------
                Centrado en vertical respecto a la imagen. El relleno
                derecho compensa el margen de la imagen a la izquierda
                para que el bloque no quede pegado al canto. */}
            <div className="flex flex-col justify-center px-3 pb-5 sm:px-5 lg:px-0 lg:py-6 lg:pr-[3%]">
              <Eyebrow claro>{PANEL.eyebrow}</Eyebrow>
              <Titulo claro className="mt-3">
                {PANEL.titulo}
              </Titulo>
              <p className="mt-3 max-w-[54ch] text-[clamp(0.9rem,1.25vw,1.125rem)] leading-[1.6] text-white/75">
                {PANEL.texto}
              </p>

              {/* Los módulos, como pastillas: es lo primero que alguien
                  quiere saber de un sistema de gestión, y en pastillas se
                  leen de un golpe sin necesidad de explicarlos aquí. */}
              <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                Módulos integrados
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {PANEL.modulos.map((modulo) => (
                  <li
                    key={modulo}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white sm:px-3.5 sm:py-1.5 sm:text-sm"
                  >
                    {modulo}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-2">
                {PANEL.ventajas.map((ventaja) => (
                  <li key={ventaja} className="flex items-center gap-3 text-sm text-white/90 sm:text-[0.9375rem]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky">
                      <IconCheck className="h-3 w-3 text-white" />
                    </span>
                    {ventaja}
                  </li>
                ))}
              </ul>

              {/* La azul es la principal (igual que en el hero) y lleva a
                  /producto. "Solicitar demo" lleva a /demo (antes decía
                  "Descargar demo", pero no hay ningún archivo que bajar). */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Boton variante="acento" to="/producto">
                  Conocer más
                  <IconFlecha className="h-4 w-4" />
                </Boton>
                <Boton variante="blanco" to="/demo">
                  Solicitar demo
                </Boton>
              </div>
            </div>
          </div>
        </Reveal>
      </Contenedor>
    </Seccion>
  );
}
