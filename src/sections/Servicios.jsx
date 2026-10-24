import { Seccion, Contenedor, Boton } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { SERVICIOS } from "../data/contenido.js";
import { useContacto } from "../components/Contacto.jsx";

/* ==================================================================
   SERVICIOS

   Sección blanca, cabecera centrada y cuatro tarjetas de foto —todas
   DEL MISMO TAMAÑO— colocadas en cascada diagonal.

   ─── LA CASCADA ───────────────────────────────────────────────────
   Dos columnas PEGADAS (4px de separación, no 40) y la derecha baja
   16rem, algo menos de la altura de una tarjeta. El resultado es una
   escalera que desciende de izquierda a derecha, con cada pieza
   arrancando en el canto derecho de la anterior:

        ┌───────┐
        │   1   ├───────┐
        └───────┤   2   │
        ┌───────┤       │
        │   3   ├───────┘
        └───────┤   4   │
                └───────┘

   La separación horizontal es casi cero A PROPÓSITO: es lo que hace
   que se lean como un bloque escalonado y no como cuatro tarjetas
   sueltas. Si la subes, se deshace la composición.

   ⚠️ EL ESCALÓN TIENE QUE SER CONSTANTE: las cuatro bajan 256px
   respecto a la anterior. Y ahí está la trampa, porque ese escalón se
   consigue de DOS maneras distintas según la pieza:
     · de la 1 a la 2 (y de la 3 a la 4) lo da el `mt-64`, porque
       comparten fila;
     · de la 2 a la 3 lo da el HUECO DE FILA (`gap-y-36`, 144px), que
       sumado a la altura de la tarjeta da los mismos 256.
   Con el `gap-y-8` que había antes, ese segundo escalón medía la mitad
   y la escalera cojeaba. Si cambias el alto de la tarjeta
   (`sm:min-h-[22.75rem]`, 364px), este hueco hay que recalcularlo:
   `gap-y = 2 × escalón − alto de la tarjeta`.

   Se consigue con colocación explícita (`col-start` / `row-start`) y
   un `mt-24` en las piezas de la derecha. No con `translate`: el
   desplazamiento tiene que EMPUJAR la caja, no solo mover el píxel.

   ⚠️ El `-mb-64` que acompaña a cada `mt-64` NO es un error. Sin él,
   la pieza desplazada hace crecer su fila 16rem y esa altura extra cae
   DEBAJO de la tarjeta de la izquierda: el hueco de la columna
   izquierda salía mucho mayor que el de la derecha. El margen negativo
   devuelve a la fila su altura real y las dos columnas respiran igual.

   A cambio, la última pieza sobresale 16rem por debajo de la rejilla.
   Eso lo compensa el `lg:pb-64` del <ul>. Los tres valores —`mt`, `-mb`
   y `pb`— tienen que ser EL MISMO; si cambias uno, cambia los tres.

   ⚠️ Las cuatro miden EXACTAMENTE lo mismo. Fue un mosaico de piezas
   desiguales y se descartó: con cuatro servicios que valen lo mismo,
   hacer una pieza más grande sugiere una jerarquía que no existe. La
   igualdad la da el alto MÍNIMO común (`sm:min-h-[22.75rem]`, lo que
   medía el antiguo `aspect-[16/11]` a ~530px). Es mínimo y no fijo para
   que el párrafo se lea entero; con los textos actuales (~210
   caracteres) ninguna lo supera en escritorio. Si un texto crece mucho,
   esa tarjeta crece y la escalera se descuadra: mantenlos parejos.

   ─── EL VELO ──────────────────────────────────────────────────────
   Suave, al estilo de Airtek: la foto va a plena luz y solo se oscurece
   el tercio de abajo, donde cae el texto. Un velo fuerte apagaba las
   cuatro fotos y las dejaba casi iguales.

   ─── LA CABECERA ──────────────────────────────────────────────────
   ⚠️ Centrada y en dos colores, que es la EXCEPCIÓN a la regla del
   CLAUDE.md §5 (titulares a la izquierda, en negro). La otra excepción
   es contacto. Aquí es deliberado: la composición es una cascada
   simétrica y un titular pegado a la izquierda la descompensaba.
================================================================== */

/* Dónde cae cada tarjeta. El índice es la posición en `SERVICIOS`.
   Debajo de `lg` no se aplica nada: la rejilla pasa a una o dos
   columnas normales y la cascada desaparece, que es lo correcto en una
   pantalla estrecha — ahí una escalera solo deja huecos. */
const PIEZAS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1 lg:mt-64 lg:-mb-64",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2 lg:mt-64 lg:-mb-64",
];

function TarjetaServicio({ titulo, texto, imagen, alt, indice }) {
  return (
    /* El `?? ""` es el seguro para un quinto servicio: la cascada está
       dibujada para cuatro piezas. Sin colocación explícita, la rejilla
       lo coloca solo en la siguiente celda libre; feo, pero no roto. Si
       llega a pasar, lo que toca es rediseñar PIEZAS. */
    <Reveal as="li" retraso={indice * 0.08} className={PIEZAS[indice] ?? ""}>
      <article
        /* ⚠️ SIN elevación ni sombra creciente al pasar el ratón, a
           diferencia del resto de tarjetas de la página. Aquí las
           piezas se tocan: una que se levanta y agranda su sombra se
           la echa encima a la vecina y el borde de las dos se
           emborrona. El único gesto es el zoom de la foto, que ocurre
           dentro de la tarjeta y no invade nada. */
        className="group relative isolate flex min-h-[16rem] flex-col justify-end
                   overflow-hidden rounded-[var(--radius-foto)] bg-black px-6 pb-6 pt-20
                   sm:min-h-[22.75rem] sm:px-10 sm:pb-9"
      >
        {/* La foto, a plena luz. El zoom lento al pasar el ratón es el
            mismo gesto que el resto de la página, aplicado a la imagen
            y no a la tarjeta: la tarjeta ya se eleva, y si crecieran
            las dos se notaría el tirón.

            `sizes`: en escritorio cada tarjeta ocupa media rejilla de
            1100px, o sea unos 530px; 45vw es la estimación honesta para
            que el navegador no se baje la imagen grande de más. */}
        <img
          src={`/img/${imagen}.webp`}
          srcSet={`/img/${imagen}-sm.webp 560w, /img/${imagen}.webp 900w`}
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover
                     transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {/* Velo: opaco abajo y nada en el 20% de arriba. Sube hasta el 80%
            porque título y párrafo ocupan casi la mitad inferior, y con
            fotos claras (automatizaciones) el texto se perdía. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10
                     bg-gradient-to-t from-black/90 via-black/60 via-45% to-transparent to-80%"
        />

        {/* Las cuatro tarjetas llevan el MISMO cuerpo de letra: ninguna
            manda sobre las otras. En Poppins va en `font-bold` con
            tracking suave: en 900 y -0.04em las letras se pegaban y
            "Desarrollo web" se leía como una sola palabra. */}
        <h3 className="text-balance break-words font-bold leading-[1.1] tracking-[-0.02em] text-white text-[clamp(1.25rem,2vw,1.875rem)]">
          {titulo}
        </h3>
        {/* El párrafo se lee ENTERO: antes llevaba `line-clamp-3` y la
            tarjeta tenía un alto fijo (`aspect-[16/11]`), así que los
            textos largos se cortaban con "…". Ahora la tarjeta tiene un
            alto MÍNIMO (el mismo que daba la proporción a ~530px de
            ancho) y crece si el texto lo pide; el `pt-24` reserva aire
            arriba para que la foto siga viéndose. */}
        <p className="mt-2.5 text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-[1.55] text-white/90">{texto}</p>
      </article>
    </Reveal>
  );
}

export default function Servicios() {
  const { abrirReunion } = useContacto();

  return (
    /* ---------------- LA SECCIÓN, REDONDEADA POR ARRIBA Y POR ABAJO ---
       Es la ÚNICA sección con esquinas de la página (el resto van a
       sangre y cuadradas, ver --radius-seccion). Es el recurso de
       Airtek: una banda clara con las esquinas muy curvas montada
       sobre la oscura, de modo que la curva recorta el fondo de atrás.

       Para que se vea hay que montar tres cosas, y las tres hacen falta:
         · `bleed` para que <Seccion> no le ponga su radio de 0;
         · `-mt-10` para solaparse 2,5rem sobre el hero — si no, no hay
           nada oscuro detrás de las esquinas de arriba y la curva no
           se ve;
         · `z-10` para quedar POR ENCIMA de Nosotros, que viene después
           en el DOM y, con su propio `-mt-10`, se mete por debajo de
           las esquinas de abajo.
       Quitar cualquiera de las tres deja las curvas recortando contra
       el gris del <body> en vez de contra la sección vecina. */
    <Seccion
      id="servicios"
      tono="piedra"
      bleed
      className="relative z-10 -mt-10 rounded-[2.5rem]"
    >
      {/* Relleno vertical CORTO comparado con el resto de secciones
          (py-28 es el estándar de la página). Esta sección lo necesita
          menos: la cascada ya trae 16rem de aire propio por el desnivel
          de la columna derecha, así que con el relleno normal el inicio
          y el final se veían como dos huecos vacíos. */}
      <Contenedor className="py-12 sm:py-14 lg:py-16">
        {/* ---------------- CABECERA (centrada) ---------------- */}
        <Reveal className="text-center">
          <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,5vw,3.5rem)]">
            <span className="text-black">Nuestros </span>
            <span className="text-sky">Servicios</span>
          </h2>
          {/* Sin subtítulo: se quitó ("Cuatro frentes para sacarte de
              los procesos manuales") para que la escalera arranque justo
              bajo el titular. */}
        </Reveal>

        {/* ---------------- LA CASCADA ----------------
            Ancho propio y más estrecho que el contenedor: a 1340px las
            tarjetas salían enormes y la escalera dejaba de leerse como
            una composición. */}
        <ul
          className="mx-auto mt-6 grid max-w-[1100px] gap-4 sm:mt-8 sm:gap-6
                     sm:grid-cols-2 lg:gap-x-1 lg:gap-y-36 lg:pb-64"
        >
          {SERVICIOS.map((servicio, i) => (
            <TarjetaServicio key={servicio.id} {...servicio} indice={i} />
          ))}
        </ul>

        {/* ---------------- CIERRE ----------------
            A la IZQUIERDA y metido en el hueco que deja la escalera:
            bajo la tercera tarjeta, al lado de la parte de la cuarta que
            sobresale. Es la composición de Airtek (frase en negrita y
            pastilla negra ancha debajo, alineadas a la izquierda) y
            aprovecha un espacio que antes quedaba vacío.

            ⚠️ En escritorio sube con `lg:-mt-52` (208px) sobre el
            `lg:pb-64` (256px) de la rejilla: queda a 48px de la tercera
            tarjeta. Si cambias el escalón de la cascada, recalcula esto.
            `max-w-[50%]` lo mantiene en la columna izquierda para que no
            se meta debajo de la cuarta tarjeta. */}
        <div className="mx-auto mt-12 max-w-[1100px] lg:-mt-52 lg:pb-12">
          {/* En móvil va CENTRADO (frase y botón); desde `lg` vuelve a la
              izquierda, metido en el hueco de la escalera. */}
          <div className="text-center lg:max-w-[50%] lg:pr-10 lg:text-left">
            {/* LA FRASE, con voz propia y no la de Airtek (negrita plana
                en un solo bloque). Dos registros: la pregunta en Poppins,
                seca, y la respuesta en Garet con "la primera conversación"
                en Instrument Serif cursiva y azul, subrayada a mano. El
                contraste palo seco / serif cursiva es lo que le da
                carácter; la cursiva solo va en esas tres palabras. */}
            <p className="mx-auto max-w-[24ch] text-balance font-[family-name:var(--font-poppins)] font-semibold leading-[1.2] tracking-[-0.01em] text-black text-[clamp(1.125rem,1.9vw,1.5rem)] lg:mx-0">
              ¿No sabes cuál de los cuatro necesitas?
            </p>
            <p className="mx-auto mt-2 max-w-[30ch] text-balance leading-[1.4] text-body text-[clamp(1rem,1.5vw,1.25rem)] lg:mx-0">
              Esa es justo{" "}
              <span className="relative inline-block whitespace-nowrap font-[family-name:var(--font-serif)] text-[1.3em] italic leading-none text-sky">
                la primera conversación
                {/* Trazo a mano: una curva irregular, no un subrayado CSS. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2 w-full text-sky/45"
                >
                  <path
                    d="M2 8 C 40 3, 80 10, 120 5 S 180 4, 198 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              que tenemos contigo.
            </p>
            {/* Pastilla NEGRA, ancha como la de Airtek: el relleno
                lateral generoso es lo que la hace leer como pastilla y
                no como botón corriente.

                ⚠️ El `!` de `text-lg!` hace falta: el `text-base` base
                de <Boton> sale después en el CSS y, sin él, gana y deja
                la letra en 16px. */}
            <Boton
              variante="negro"
              onClick={abrirReunion}
              className="mt-6 px-10 py-3 text-base! sm:px-16 sm:py-3.5 sm:text-lg!"
            >
              Agendar una reunión
            </Boton>
          </div>
        </div>
      </Contenedor>
    </Seccion>
  );
}
