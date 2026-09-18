import { Boton, Contenedor } from "../components/ui.jsx";
import { useContacto } from "../components/Contacto.jsx";
import { METRICAS } from "../data/contenido.js";
import { IconFlecha } from "../components/Iconos.jsx";

/* ==================================================================
   HERO

   Video aéreo a sangre, velo navy encima y el texto a la izquierda.

   Sobre el VIDEO (public/video/):
   - Va MUDO y sin pista de audio: es requisito del navegador para poder
     autorreproducirse, y además un fondo que suena es una trampa.
   - `playsInline` es obligatorio en iOS; sin él, Safari se lo lleva a
     pantalla completa en cuanto empieza.
   - Dos resoluciones con <source media>: el móvil se descarga 1,75 MB en
     lugar de 4,6 MB. El navegador elige la PRIMERA que encaje, así que
     la grande va primero y su `media` es la condición de escritorio.
   - `poster` pinta el primer fotograma mientras el video carga, para que
     no haya un rectángulo negro bajo el texto.
   - El clip lleva un fundido cruzado de 1 s codificado dentro, así que
     el `loop` no tiene salto visible.
================================================================== */
export default function Hero() {
  const { abrir } = useContacto();

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-ink">
      {/* ---------------- VIDEO ---------------- */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/hero-poster.webp"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/hero-1920.mp4" type="video/mp4" media="(min-width: 768px)" />
        <source src="/video/hero-1280.mp4" type="video/mp4" />
      </video>

      {/* ---------------- VELO ----------------
          Dos capas, y hacen falta las dos. La vertical asienta el texto
          sobre la parte baja (que es donde va) y la lateral oscurece la
          izquierda, que es por donde el video es más claro. Con una sola
          o el texto no se lee o el video se apaga entero. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent"
      />

      <Contenedor className="relative pb-14 pt-36 sm:pb-20 lg:pb-24 lg:pt-44">
        {/* --- Badge --- */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-light" />
          Nuevo: Panel de Negocios v3.0
        </span>

        {/* --- Titular ---
            Blanco, black, ~64px en escritorio y line-height muy cerrado
            (CLAUDE.md §5). A esos tamaños el interlineado por defecto
            abre demasiado y el bloque pierde fuerza.

            Los saltos van a mano con <br> a partir de `sm`: en móvil
            estorban y es mejor dejar que el texto fluya. */}
        <h1 className="mt-6 max-w-[16ch] text-balance font-black leading-[1.03] tracking-[-0.03em] text-white text-[clamp(2.5rem,6.2vw,4rem)]">
          Soluciones construidas
          <br className="hidden sm:block" /> para durar
        </h1>

        <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-[1.65] text-white/75">
          Somos AMH Solutions. Diseñamos y construimos{" "}
          <span className="font-semibold text-white">My Business Panel</span>, el panel que
          reúne tu CRM, tu inventario y tus finanzas en un solo lugar.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Boton variante="acento" href="#servicios">
            Conoce nuestros servicios
            <IconFlecha className="h-4 w-4" />
          </Boton>
          <Boton variante="contorno" onClick={abrir}>
            Habla con nosotros
          </Boton>
        </div>

        {/* ---------------- BANDA DE PRUEBA SOCIAL ----------------
            Dentro del hero y no en una sección aparte: así el dato de
            respaldo se ve sin desplazarse, que es cuando sirve de algo.
            El separador superior es blanco al 15% porque una línea sólida
            cortaría el video. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/15 pt-8 sm:gap-x-10 lg:grid-cols-4">
          {METRICAS.map(({ dato, etiqueta }) => (
            <div key={etiqueta}>
              <dt className="sr-only">{etiqueta}</dt>
              <dd>
                <span className="block text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-none tracking-tight text-white">
                  {dato}
                </span>
                <span className="mt-2 block text-sm leading-snug text-white/55">
                  {etiqueta}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Contenedor>
    </section>
  );
}
