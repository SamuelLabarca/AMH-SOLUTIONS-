import { Link } from "react-router-dom";
import { Contenedor, Eyebrow, Titulo, Boton } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { ICONOS, IconFlecha } from "../components/Iconos.jsx";
import { NOSOTROS, WHATSAPP, MODULOS } from "../data/contenido.js";

/* ==================================================================
   PÁGINA: NOSOTROS  (/nosotros)

   El reparto de "Conócenos" de Slack (referencia de Samuel): propósito
   grande y centrado y, debajo, el bloque de contexto con ilustración.

   ⚠️ SIN SECCIÓN DE EQUIPO, a propósito: por seguridad no se muestran
   personas (ver NOSOTROS en contenido.js). La página habla de lo que
   hacemos y de cómo, no de quién.

   Orden: propósito (oscuro) → creamos My Business Panel → quiénes somos
   y cómo sumarte → banda "Solicitar demo" con arco → pie. Las cifras,
   "Cómo trabajamos", "Lo que viene" y el cierre se quitaron (Samuel,
   7 oct). Se archiva como NosotrosPagina para no chocar con la franja
   `sections/Nosotros.jsx` de la home, que ahora invita a esta página.
================================================================== */
export default function NosotrosPagina() {
  const { eyebrow, proposito, intro, producto, empresa, cierre } = NOSOTROS;

  return (
    <>
      {/* ---------------- PROPÓSITO ----------------
          Oscura (la barra va transparente y en blanco arriba). Las dos
          manchas de los bordes son el recurso de Slack: color de marca
          asomando para que la cabecera no sea un bloque plano. */}
      <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-sky-light/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-sky-light/30"
        />
        <Contenedor className="relative pb-24 pt-36 text-center sm:pb-28 sm:pt-44">
          <Eyebrow claro className="text-white/70!">
            {eyebrow}
          </Eyebrow>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-balance text-[clamp(2.25rem,5.4vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.035em]">
            {proposito}
          </h1>
          <p className="mx-auto mt-6 max-w-[56ch] text-[1.0625rem] leading-[1.65] text-white/80">{intro}</p>
        </Contenedor>
      </section>

      {/* ---------------- CREAMOS MY BUSINESS PANEL ----------------
          El bloque de contexto de Slack ("Creamos el ecosistema…"):
          texto a la izquierda e ilustración a la derecha. */}
      <section className="overflow-hidden bg-white">
        <Contenedor className="grid items-center gap-6 py-20 sm:gap-10 sm:py-28 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{producto.eyebrow}</Eyebrow>
            <Titulo className="mt-3">{producto.titulo}</Titulo>
            {producto.parrafos.map((p, i) => (
              <p
                key={p.slice(0, 20)}
                className={`mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] ${
                  /* El segundo párrafo es la misión: filo azul a la
                     izquierda y un peso INTERMEDIO. Va en Urbanist
                     (`font-sans`) y no en Garet, que solo tiene Book y
                     Heavy: cualquier peso medio saltaba a Heavy y se veía
                     demasiado gordo. El resto en negro, como Slack. */
                  i === 1 ? "border-l-[3px] border-sky pl-4 font-sans text-[1.125rem] font-semibold text-black" : "text-black/85"
                }`}
              >
                {p}
              </p>
            ))}
            <Link
              to={producto.enlace.destino}
              className="mt-5 inline-flex items-center gap-1.5 font-bold text-sky transition-colors hover:text-sky-light"
            >
              {producto.enlace.texto}
              <IconFlecha className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal retraso={0.1} className="lg:col-span-6">
            <Composicion producto={producto} />
          </Reveal>
        </Contenedor>
      </section>

      {/* ---------------- QUIÉNES SOMOS Y CÓMO SUMARTE ----------------
          La empresa y cómo opera (Slack: "Quiénes somos y cómo unirse").
          Alterna con el bloque de arriba: ilustración a la IZQUIERDA y
          texto a la derecha. Los enlaces en línea, subrayados, como los
          de Slack. */}
      <section id="sumarte" className="scroll-mt-24 overflow-hidden bg-white">
        <Contenedor className="grid items-center gap-14 pb-24 sm:pb-32 lg:grid-cols-12 lg:gap-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <IlustracionEmpresa imagen={empresa.imagen} alt={empresa.alt} credito={empresa.credito} />
          </Reveal>
          <Reveal retraso={0.08} className="order-1 lg:order-2 lg:col-span-6">
            <Eyebrow>{empresa.eyebrow}</Eyebrow>
            <Titulo className="mt-3">{empresa.titulo}</Titulo>
            <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-black/85">{empresa.texto}</p>
            {empresa.vias.map(({ enlace, texto, mensaje }) => (
              <p key={enlace} className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-black/85">
                <a
                  href={`https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(mensaje)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-bold text-sky underline decoration-2 underline-offset-4 transition-colors hover:text-sky-light"
                >
                  {enlace}
                </a>
                {": "}
                {texto}
              </p>
            ))}
          </Reveal>
        </Contenedor>
      </section>

      {/* ---------------- SOLICITAR DEMO ----------------
          La banda final de Slack ("Prueba Slack con tu equipo gratis"):
          color de marca, una frase y UN botón blanco, con el canto de
          abajo en ARCO. El arco sale del radio elíptico (50% de ancho por
          5rem de alto en cada esquina inferior): sin SVG. El `pb` del
          envoltorio blanco es CORTO a propósito: solo lo justo para que
          se vea la curva antes del pie negro (Samuel: sobraba blanco). */}
      <section className="bg-white pb-6 sm:pb-8">
        <div className="rounded-b-[50%_3rem] bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white sm:rounded-b-[50%_5rem]">
          <Contenedor className="py-20 text-center sm:py-28">
            <Reveal>
              <h2 className="mx-auto max-w-[22ch] text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                {cierre.titulo}
              </h2>
              <div className="mt-8">
                <Boton variante="blanco" to="/demo">
                  {cierre.boton}
                </Boton>
              </div>
            </Reveal>
          </Contenedor>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------
   LA COMPOSICIÓN DE LA CHICA DEL PORTÁTIL

   Sale del diseño de Canva que pasó Samuel: un fondo azul con dos
   formas amarillas de esquinas redondeadas (una franja en diagonal
   arriba a la derecha y un triángulo abajo a la izquierda) y la chica
   delante.

   Dos capas a propósito:
     · el MARCO (azul + formas) va recortado con `overflow-hidden`;
     · la CHICA va fuera de ese recorte, así su cabeza asoma por encima
       del canto superior. Es lo que la saca del "cuadro" y la hace
       llamativa.

   Las esquinas redondas de las formas salen del TRAZO: cada polígono se
   pinta además con un `stroke` grueso del mismo degradado y
   `stroke-linejoin="round"`, que redondea los vértices sin calcular
   arcos. El viewBox (100x100) tiene la misma proporción que la caja
   (cuadrada), así las curvas no se deforman. La caja es cuadrada y no
   más alta para que la chica (más alta que ancha) la desborde por
   arriba.

   Alrededor flotan tres etiquetas de módulos, el guiño a los iconos
   conectados de la página de Slack.
------------------------------------------------------------------ */
function Composicion({ producto }) {
  const { imagen, alt, flotantes } = producto;
  const modulos = flotantes.map((id) => MODULOS.find((m) => m.id === id)).filter(Boolean);
  /* Dónde va cada etiqueta (en % de la caja). Repartidas para que no
     tapen la cara ni el portátil. */
  const POSICIONES = ["left-[-6%] top-[16%]", "right-[-6%] top-[18%]", "right-[-5%] bottom-[7%]"];

  return (
    <div className="relative mx-auto w-full max-w-[520px] pt-[14%]">
      <div className="relative aspect-square">
        {/* EL MARCO */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-linear-160 from-azul-vivo to-indigo-mid">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="amarillo-nosotros" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="var(--color-amarillo)" />
                <stop offset="1" stopColor="var(--color-amarillo-claro)" />
              </linearGradient>
            </defs>
            <g fill="url(#amarillo-nosotros)" stroke="url(#amarillo-nosotros)" strokeWidth="12" strokeLinejoin="round">
              <polygon points="34,8 112,8 112,87 80,87" />
              <polygon points="34,72 64,112 4,112" />
            </g>
          </svg>
        </div>

        {/* LA CHICA, fuera del recorte: sube por encima del marco. */}
        <img
          src={`/img/${imagen}.webp`}
          srcSet={`/img/${imagen}-sm.webp 560w, /img/${imagen}.webp 1400w`}
          sizes="(min-width: 1024px) 480px, 85vw"
          alt={alt}
          width={1400}
          height={1665}
          loading="lazy"
          decoding="async"
          className="absolute bottom-0 left-1/2 w-[92%] -translate-x-1/2"
        />

        {/* LAS ETIQUETAS FLOTANTES */}
        {modulos.map(({ id, icono, nombre }, i) => {
          const Icono = ICONOS[icono];
          return (
            <span
              key={id}
              className={`absolute ${POSICIONES[i]} flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4
                          text-sm font-bold text-black shadow-[var(--shadow-lift)]
                          motion-safe:animate-[flotar_6s_ease-in-out_infinite]`}
              style={{ animationDelay: `${i * -2}s` }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-tint text-sky">
                <Icono className="h-4 w-4" />
              </span>
              {nombre}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   ILUSTRACIÓN DE "QUIÉNES SOMOS"

   La ilustración es apaisada (al revés que la chica), así que no va en
   un marco: va sobre una MANCHA AZUL redondeada que la asienta. Era
   amarilla, pero las camisas amarillas se perdían contra ella (Samuel
   pidió más contraste); sobre el azul vivo de la marca destacan el
   amarillo y el negro, y conversa con el marco azul del bloque de
   arriba. Mientras no
   llegue el archivo (`imagen` en null), se ve la mancha con un aviso.
------------------------------------------------------------------ */
function IlustracionEmpresa({ imagen, alt, credito }) {
  return (
    <figure className="mx-auto w-full max-w-[560px]">
      <div className="relative aspect-[3/2] w-full">
        <div
          aria-hidden="true"
          className="absolute inset-[6%] rounded-[46%_54%_42%_58%/55%_45%_55%_45%] bg-linear-60 from-azul-vivo to-sky-light"
        />
        {imagen ? (
          <img
            src={`/img/${imagen}.webp`}
            srcSet={`/img/${imagen}-sm.webp 560w, /img/${imagen}.webp 1400w`}
            sizes="(min-width: 1024px) 560px, 90vw"
            alt={alt}
            loading="lazy"
            decoding="async"
            className="relative h-full w-full object-contain"
          />
        ) : (
          <div className="relative grid h-full place-items-center">
            <p className="rounded-full bg-white/80 px-4 py-2 font-sans text-sm font-semibold text-body">Ilustración próximamente</p>
          </div>
        )}
      </div>
      {imagen && credito && (
        <figcaption className="mt-2 text-center text-xs text-steel">
          Imagen de{" "}
          <a href={credito.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-sky">
            {credito.autor}
          </a>{" "}
          en {credito.plataforma}
        </figcaption>
      )}
    </figure>
  );
}
