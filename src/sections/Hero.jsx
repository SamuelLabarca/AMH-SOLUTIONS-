import { Boton, Contenedor } from "../components/ui.jsx";
import { IconFlecha } from "../components/Iconos.jsx";
import { TARJETAS_HERO } from "../data/contenido.js";

/* ==================================================================
   HERO

   Foto del edificio a sangre, velo navy encima, el titular a la
   izquierda y tres pastillas de cristal flotando a la derecha.

   Sobre la FOTO (public/img/):
   - El JPG de origen es `hero.jpg`; lo que se sirve son los WebP que
     genera `npm run imagenes`. No referencies el JPG.
   - `hero-sm.webp` (1080px) para móvil y `hero.webp` (1170px) para
     escritorio. El original no da más resolución: a pantalla completa
     en un monitor grande se nota algo blando. Si consiguen la foto
     original más grande, se sustituye `hero.jpg` y se vuelve a correr
     el script; no hay que tocar este archivo.
   - `fetchpriority="high"` y nada de lazy: es la imagen que decide el
     LCP, y retrasarla es retrasar la primera impresión.

   El video aéreo anterior se quitó de `public/video/` (6 oct 2026); está
   en la carpeta de respaldo del escritorio por si se vuelve a él.
================================================================== */

/* ---------------- LAS MINI-ILUSTRACIONES ----------------
   Van aquí y no en Iconos.jsx porque no son iconos: son gráficos de
   una sola pieza que solo existen en el hero. Meterlos en el mapa
   general de iconos ensuciaría un archivo que usa toda la página.

   Todos comparten lienzo de 48x28 para que las tres pastillas midan
   igual aunque el dibujo de dentro no se parezca. */
const VISUALES = {
  /* Aguja de velocímetro: arco gris de fondo, arco azul de progreso y
     la aguja. El `pathLength` normaliza el arco a 100 unidades, así el
     `strokeDasharray` se lee como un porcentaje sin calcular la
     longitud real de la curva. */
  aguja: (
    <svg viewBox="0 0 48 28" fill="none" className="h-9 w-16" aria-hidden="true">
      <path
        d="M4 26a20 20 0 0 1 40 0"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="100"
      />
      <path
        d="M4 26a20 20 0 0 1 40 0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="72 100"
      />
      <path d="M24 26 36 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="26" r="3" fill="currentColor" />
    </svg>
  ),

  /* Cuatro barras ascendentes. La última va más clara para que se lea
     como "lo que viene", no como un dato más. */
  barras: (
    <svg viewBox="0 0 48 28" fill="none" className="h-9 w-16" aria-hidden="true">
      <rect x="2" y="18" width="8" height="10" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="14" y="12" width="8" height="16" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="26" y="6" width="8" height="22" rx="2" fill="currentColor" fillOpacity="0.75" />
      <rect x="38" y="0" width="8" height="28" rx="2" fill="currentColor" />
    </svg>
  ),

  /* Visto bueno, para el aviso de venta registrada. */
  check: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ---------------- PASTILLA DE CRISTAL ----------------
   Blanco translúcido con desenfoque detrás. El borde blanco al 60% no
   es decorativo: sobre las zonas claras de la foto el cristal se
   confunde con el fondo y sin borde la pastilla desaparece. */
function TarjetaCristal({ tipo, visual, titulo, dato, pie, hora, className = "" }) {
  /* Variante aviso: imita una notificación del sistema (icono en
     círculo, título, detalle y la hora). Se lee como una pieza real de
     la app y no como una cifra de marketing. */
  if (tipo === "aviso") {
    return (
      <div
        className={`flex items-start gap-3.5 rounded-[var(--radius-tarjeta)] bg-white p-4 text-navy
                    shadow-[var(--shadow-lift)] ${className}`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-tint text-sky">
          {VISUALES[visual]}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="whitespace-nowrap text-[0.9375rem] font-bold leading-tight">{titulo}</p>
            <span className="text-[0.75rem] font-medium leading-none text-steel">{hora}</span>
          </div>
          <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-steel">{pie}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      /* BLANCO SÓLIDO, no cristal translúcido. Era `bg-white/85` con
         desenfoque: sobre el degradado azul se teñía y las tarjetas
         quedaban a medio camino entre el fondo y ellas mismas. Son las
         tarjetas de QuickBooks: blancas, opacas y con sombra, para que
         resalten y se lean como piezas reales de la interfaz. */
      className={`rounded-[var(--radius-tarjeta)] bg-white p-5 text-navy
                  shadow-[var(--shadow-lift)] ${className}`}
    >
      {dato ? (
        /* Variante con cifra: el rótulo y el icono comparten línea
           arriba, y el número manda debajo. */
        <>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[0.8125rem] font-semibold leading-none text-steel">{titulo}</span>
            <span className="text-sky">{VISUALES[visual]}</span>
          </div>
          <p className="mt-3 text-[2rem] font-extrabold leading-none tracking-tight">{dato}</p>
          <p className="mt-2 text-[0.8125rem] font-medium leading-none text-sky">{pie}</p>
        </>
      ) : (
        /* Variante con gráfico: el dibujo arriba y el rótulo debajo.
           `whitespace-pre-line` respeta el \n del contenido, que es lo
           que parte el rótulo en dos líneas cortas. */
        <>
          <span className="block text-sky">{VISUALES[visual]}</span>
          <p className="mt-3 whitespace-pre-line text-[0.8125rem] font-semibold leading-tight">
            {titulo}
          </p>
        </>
      )}
    </div>
  );
}

/* Dónde cae cada pastilla dentro de la columna derecha. Van en absoluto
   y escalonadas: alineadas en columna se leerían como una lista, y lo
   que tienen que parecer es piezas sueltas de la interfaz flotando.

   El orden del array es el de `TARJETAS_HERO`.

   ⚠️ Los `top` tienen que crecer a la par que los anchos: las tres van
   en absoluto, así que no se empujan entre sí y, si una crece sin que
   la siguiente baje, se solapan. El último (`22rem`) más el alto de su
   pastilla es lo que fija la altura del contenedor en Hero(). */
const POSICIONES = [
  "right-[16%] top-0 w-[15rem]",
  "right-0 top-[9.5rem] w-[13rem]",
  "right-[12%] top-[21rem] w-[19rem]",
];

export default function Hero() {
  return (
    /* ---------------- LA BANDA ----------------
       A sangre y cuadrado, como Airtek y QuickBooks. Fue una tarjeta
       redondeada sobre lienzo gris (el patrón de nido) hasta que se
       pasó a bandas apiladas; los márgenes y el radio siguen puestos
       como variables, pero ahora valen 0 (ver index.css).

       La barra de navegación es transparente y se monta ENCIMA, así que
       el hero ocupa la ventana entera: nada de descontarle su altura.
       El hueco para que el titular no quede debajo de la barra lo da el
       `pt` del contenedor.

       ⚠️ LA ALTURA: una ventana completa MÁS 2,5rem. Al cargar la
       página solo se tiene que ver el hero, sin un filo de la sección
       siguiente asomando por abajo. Esos 2,5rem de más son exactamente
       lo que Servicios le pisa con su margen negativo (ver
       Servicios.jsx), así que lo que queda a la vista mide una ventana
       justa.

       `svh` y no `vh`: en el móvil, `100vh` cuenta la ventana SIN la
       barra de direcciones del navegador, así que el hero sobresale y
       obliga a desplazar para ver el botón. `svh` usa la ventana
       pequeña, la que de verdad hay.

       En MÓVIL mide menos (80svh): Samuel lo vio demasiado alto, y así
       asoma el arranque de Servicios e invita a seguir bajando. La
       ventana completa es solo desde `lg`. */
    <section
      /* `items-center` y no `items-end`: el contenido va centrado en
         vertical, no apoyado en el suelo. Con el bloque abajo, el
         tercio superior del hero quedaba vacío y el titular competía
         con los botones por el mismo renglón. */
      className="relative isolate mx-[var(--margen-lienzo)] flex items-center overflow-hidden
                 rounded-[var(--radius-seccion)] bg-indigo
                 min-h-[calc(80svh+2.5rem)] lg:min-h-[calc(100svh+2.5rem)]"
    >
      {/* ---------------- FOTO ---------------- */}
      <img
        src="/img/hero.webp"
        srcSet="/img/hero-sm.webp 1080w, /img/hero.webp 1170w"
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* ---------------- FILTRO ----------------
          Oscuro y neutro, el MISMO de las cabeceras de /tienda y
          /producto (6 oct 2026), para que se vea la foto con su color.

          Antes era el degradado de QuickBooks (#0E0339 → #172B81 →
          #1F5CE0 en diagonal) a 80-95% de opacidad, más una capa
          indigo a la izquierda. Para volver a él:
            bg-gradient-to-br from-indigo/95 via-indigo-mid/90 to-fondo-sky/80
            bg-gradient-to-r from-indigo/70 via-indigo/20 to-transparent

          La segunda capa oscurece algo más la izquierda: por ahí el
          cielo de la foto es más claro y el titular perdería contraste. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/30 via-black/10 to-transparent"
      />

      {/* El `pt` esquiva la barra, que es transparente y se monta
          encima del hero: sin él, el titular quedaría por debajo de los
          enlaces. El `pb` es MAYOR que el `pt` a propósito — así el
          bloque no cae en el centro exacto sino un punto por encima,
          que es donde el ojo lo espera. Centrado matemáticamente se ve
          caído. */}
      <Contenedor className="relative pb-20 pt-24 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-28">
        {/* Rejilla de 12 para poder dar 7 al texto y 5 a las pastillas.
            Nunca 50/50: el CLAUDE.md pide asimetría y, además, el
            titular necesita más sitio que los gráficos. */}
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            {/* --- Titular ---
                Blanco, black y con el tracking MUY cerrado (-0.04em).
                Ese tracking es lo que da el aire de Airtek: a 64px el
                espaciado por defecto deja el bloque flojo y disperso.

                "procesos manuales" va en blanco al 50%: es el problema
                que la frase promete quitar, y apagarlo hace que la
                lectura caiga sola sobre "Evoluciona".

                Los saltos van a mano con <br> a partir de `sm`: en móvil
                estorban y es mejor dejar que el texto fluya.

                En POPPINS (como todos los titulares) va en `font-bold` y
                algo más pequeño que en Urbanist: Poppins es más ancha y en
                900 el titular pasaba a cuatro líneas y se veía pesado. */}
            <h1 className="max-w-[17ch] text-balance font-bold leading-[1.05] tracking-[-0.03em] text-white text-[clamp(2.125rem,5.6vw,3.75rem)]">
              Evoluciona a una
              <br className="hidden sm:block" /> administración{" "}
              <span className="text-white/75">sin procesos manuales</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[clamp(0.9375rem,1.4vw,1.1875rem)] leading-[1.65] text-white/75">
              Somos AMH Solutions. Desarrollamos software, automatizamos tu operación y
              construimos{" "}
              <span className="font-semibold text-white">My Business Panel</span>, el sistema
              que centraliza la gestión de tu empresa.
            </p>

            {/* Un solo botón: "Habla con nosotros" se quitó (lo pidió
                Samuel); el contacto sigue en la barra, el pie y WhatsApp.
                En móvil va CENTRADO y con más aire encima; desde `lg`
                vuelve a la izquierda, bajo el párrafo. */}
            <div className="mt-12 flex justify-center lg:mt-9 lg:justify-start">
              <Boton variante="acento" to="/producto">
                Conoce nuestro software
                <IconFlecha className="h-4 w-4" />
              </Boton>
            </div>
          </div>

          {/* ---------------- PASTILLAS ----------------
              Solo a partir de `lg`. En móvil competirían con el titular
              por un sitio que no hay, y apiladas debajo se leerían como
              una sección más en vez de como adorno de la interfaz.

              La altura fija del contenedor es necesaria: los hijos van
              en absoluto y sin ella la columna mediría cero. */}
          <div className="relative hidden h-[32rem] lg:col-span-5 lg:block">
            {TARJETAS_HERO.map((tarjeta, i) => (
              <TarjetaCristal key={tarjeta.id} {...tarjeta} className={`absolute ${POSICIONES[i]}`} />
            ))}
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
