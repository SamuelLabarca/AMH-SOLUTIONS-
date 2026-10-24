import { Link } from "react-router-dom";
import { Contenedor, Eyebrow } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { TIENDA, MODULOS } from "../data/contenido.js";
import { ICONOS, IconCheck, IconFlecha } from "../components/Iconos.jsx";
import { Pasos, ahorro, dolares } from "../components/tienda.jsx";

/* ==================================================================
   PÁGINA: TIENDA  (/tienda)

   El reparto de la página de precios de QuickBooks: titular, ventajas
   con palomita, los pasos de la compra y TRES TARJETAS en fila con la
   destacada en oscuro y una cinta encima.

   La diferencia: QuickBooks tiene cuatro planes y nosotros UNO (decisión
   del 6 oct 2026). Así que las tres tarjetas son las tres FORMAS DE
   PAGO del mismo plan (mensual, trimestral, anual). Lo que incluye es
   idéntico en las tres y va una sola vez, debajo, en vez de repetirse.

   "Elegir" lleva al checkout (/tienda/checkout?pago=…).

   Mientras haya un solo producto la página va directa a sus precios.
   Con más de uno, aquí irá antes el catálogo.
================================================================== */
export default function Tienda() {
  const { eyebrow, titulo, texto, ventajas, productos, imagen, alt } = TIENDA;
  const producto = productos[0];

  return (
    <>
      {/* ---------------- CABECERA ----------------
          Compacta. Lleva FOTO de fondo (`TIENDA.imagen`) con el mismo
          velo que la de /producto; sin foto se ve el degradado. El `pb`
          deja sitio a las tarjetas, que suben y se montan sobre el
          borde (`-mt` en la rejilla). */}
      <section className="relative overflow-hidden bg-indigo-mid text-white">
        {imagen ? (
          <img
            src={`/img/${imagen}.webp`}
            srcSet={`/img/${imagen}-sm.webp 1080w, /img/${imagen}.webp 1920w`}
            sizes="100vw"
            alt={alt}
            fetchPriority="high"
            /* En escritorio la foto se pinta MÁS ANCHA que la cabecera
               (150%) y pegada a la izquierda: así su centro (el pago con
               la tarjeta) cae a la derecha, fuera del texto. Con la foto
               actual, centrada, la tarjeta quedaba detrás del subtítulo.
               Si se cambia la foto, revisar esto. */
            className="absolute inset-y-0 left-0 h-full w-full object-cover lg:w-[150%] lg:max-w-none"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light" />
        )}
        {/* FILTRO: oscuro y neutro, sin el velo azul de /producto (Samuel
            quiso ver la foto con su color). Solo está para que el texto
            blanco se lea. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
        <Contenedor className="relative pb-28 pt-28 sm:pt-32">
          <Eyebrow claro className="text-white/70!">
            {eyebrow} · {producto.marca}
          </Eyebrow>
          <h1 className="mt-3 max-w-[20ch] text-balance text-[clamp(2rem,4.2vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            {titulo}
          </h1>
          <p className="mt-3 max-w-[52ch] leading-[1.6] text-white/80">{texto}</p>

          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
            {ventajas.map((v) => (
              <li key={v} className="flex items-center gap-2 text-[0.9375rem] font-semibold">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sky">
                  <IconCheck className="h-3 w-3" />
                </span>
                {v}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Pasos actual={1} claro />
          </div>
        </Contenedor>
      </section>

      <section className="bg-white">
        <Contenedor className="pb-20">
          {/* LAS TRES TARJETAS. La destacada lleva la cinta ENCIMA (h-9);
              las otras bajan ese mismo alto (`lg:pt-9`) para que título,
              precio y botón queden a la misma altura en las tres. */}
          <ul className="relative -mt-16 grid gap-5 lg:grid-cols-3">
            {producto.pagos.map((pago, i) => (
              <Reveal as="li" key={pago.id} retraso={i * 0.08} className={`flex flex-col ${pago.destacado ? "" : "lg:pt-9"}`}>
                <TarjetaPago pago={pago} pagos={producto.pagos} />
              </Reveal>
            ))}
          </ul>

          <Reveal retraso={0.1} className="mt-6">
            <Incluido producto={producto} />
          </Reveal>

          {producto.proximamente && (
            <Reveal retraso={0.12} className="mt-6">
              <SegundaEtapa {...producto.proximamente} />
            </Reveal>
          )}

          <p className="mt-10 text-center text-sm text-steel">
            ¿Prefieres verlo antes de decidir?{" "}
            <Link to="/demo" className="font-bold text-sky hover:text-sky-light">
              Pide una demo gratuita
            </Link>{" "}
            o{" "}
            <Link to="/producto" className="font-bold text-sky hover:text-sky-light">
              mira el producto por dentro
            </Link>
            .
          </p>
        </Contenedor>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------
   UNA FORMA DE PAGO

   Nombre, frase, precio grande con su período, el ahorro, el botón y
   los puntos propios de esa forma de pago. La destacada va en el
   degradado azul de la marca (antes ink: Samuel lo vio muy pesado) con
   la cinta encima, como "Impulsa la eficiencia" en QuickBooks.

   El precio va en Urbanist semibold y no en bold: dentro de un <p>
   heredaba Garet Heavy y se veía demasiado negro.
------------------------------------------------------------------ */
function TarjetaPago({ pago, pagos }) {
  const { id, nombre, resumen, cada, meses, precio, destacado, puntos } = pago;
  const pct = ahorro(pago, pagos);
  const alMes = precio ? Math.round((precio / meses) * 100) / 100 : null;
  const o = Boolean(destacado);

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden rounded-[var(--radius-foto)] transition-transform duration-300 hover:-translate-y-1.5 ${
        o
          ? "bg-linear-160 from-azul-vivo to-fondo-sky text-white shadow-[var(--shadow-destacado)]"
          : "border border-mist bg-white text-black shadow-[var(--shadow-card)]"
      }`}
    >
      {o && (
        <p className="grid h-9 place-items-center bg-white/15 px-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-white">
          {destacado}
        </p>
      )}

      <div className="flex flex-1 flex-col p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">{nombre}</h2>
        {/* `min-h` de dos líneas: si una frase salta de línea y otra
            no, los precios dejarían de alinearse. */}
        <p className={`mt-1 lg:min-h-[3.25rem] ${o ? "text-white/80" : "text-steel"}`}>{resumen}</p>

        {/* PRECIO. `min-h` para que las tres tarjetas alineen el botón
            aunque una lleve la línea del ahorro y otra no. */}
        <div className="mt-5 min-h-[5.5rem]">
          {precio ? (
            <>
              {/* Lo grande es lo que sale AL MES (lo que se compara entre
                  tarjetas); debajo, lo que se cobra en cada período. */}
              <div className="flex items-baseline gap-1.5 font-sans">
                <PrecioGrande valor={alMes} />
                <span className={`text-sm ${o ? "text-white/80" : "text-steel"}`}>/ mes</span>
                {pct && (
                  <span
                    className={`ml-auto self-center rounded-full px-2 py-0.5 text-xs font-bold ${o ? "bg-white text-sky" : "bg-sky-tint text-sky"}`}
                  >
                    Ahorras {pct}%
                  </span>
                )}
              </div>
              <div className={`mt-3 flex flex-wrap items-center gap-2 font-sans text-sm ${o ? "text-white/85" : "text-body"}`}>
                {/* Lo que cuesta el año: es como se comparan los precios. */}
                <span>
                  {meses === 12
                    ? `Pagas ${dolares(precio)} al año`
                    : `Pagas ${dolares(precio)} cada ${cada} · ${dolares((precio * 12) / meses)} al año`}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="font-sans text-3xl font-semibold tracking-[-0.02em]">A consultar</div>
              <p className={`mt-2 text-sm ${o ? "text-white/70" : "text-steel"}`}>Pago cada {cada}</p>
            </>
          )}
        </div>

        <Link
          to={`/tienda/checkout?pago=${id}`}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition-colors ${
            o ? "bg-white text-sky hover:bg-cloud" : "bg-sky text-white hover:bg-sky-light"
          }`}
        >
          Elegir {nombre.toLowerCase()}
          <IconFlecha className="h-4 w-4" />
        </Link>

        <ul className={`mt-7 space-y-2.5 border-t pt-6 ${o ? "border-white/25" : "border-mist"}`}>
          <li className="flex items-start gap-2.5">
            <IconCheck className={`mt-0.5 h-4 w-4 shrink-0 ${o ? "text-white" : "text-sky"}`} />
            <span className={`text-[0.9375rem] font-semibold ${o ? "text-white" : "text-black"}`}>
              El sistema completo
            </span>
          </li>
          {puntos.map((linea) => (
            <li key={linea} className="flex items-start gap-2.5">
              <IconCheck className={`mt-0.5 h-4 w-4 shrink-0 ${o ? "text-white" : "text-sky"}`} />
              <span className={`text-[0.9375rem] leading-snug ${o ? "text-white/90" : "text-body"}`}>{linea}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* El precio grande con los CÉNTIMOS pequeños y abajo, en la línea base ($58,33 → los
   ",33" pequeños), como QuickBooks: lo que se lee es el entero. */
function PrecioGrande({ valor }) {
  const [entero, decimales] = dolares(valor).split(",");
  return (
    <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em]">
      {entero}
      {decimales && <span className="text-xl leading-none tracking-normal">,{decimales}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------
   LO QUE INCLUYE (igual en las tres)

   Una sola vez y no repetido en cada tarjeta: es el argumento frente a
   Gálac y QuickBooks, que reparten funciones según el plan.

   ─── POR QUÉ NO VA EN TARJETAS ────────────────────────────────────
   Antes eran seis fichas blancas con sombra e icono en cuadradito: se
   leía como una plantilla de SaaS (Samuel: "muy artificial"). Ahora va
   como la sección de contacto de Alfonzo Rivas que pasó de referencia:
   una banda de color de la marca, iconos de LÍNEA sueltos (sin caja),
   separados por filetes finos, y un sello redondo en el centro. Cada
   módulo dice qué te resuelve (`enCorto`) en vez de solo su nombre:
   eso es lo que la hace sonar a persona y no a catálogo.
------------------------------------------------------------------ */
function Incluido({ producto }) {
  const { plan } = producto;
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-foto)] bg-linear-160 from-fondo-sky to-indigo-mid px-6 py-12 text-center text-white sm:px-10 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">{plan.nombre}</p>
      <h2 className="mx-auto mt-3 max-w-[24ch] text-balance text-[clamp(1.5rem,2.6vw,2.125rem)] font-bold leading-[1.15] tracking-[-0.02em]">
        {plan.titular}
      </h2>
      {/* El filete corto bajo el título, como "Contáctanos" en la referencia. */}
      <span aria-hidden="true" className="mx-auto mt-4 block h-[3px] w-14 rounded-full bg-white" />

      {/* LOS CINCO MÓDULOS. Iconos grandes de trazo fino y sin caja,
          separados por filetes verticales en escritorio. */}
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-white/25">
        {MODULOS.map(({ id, icono, nombre, enCorto }) => {
          const Icono = ICONOS[icono];
          return (
            <li key={id} className="flex flex-col items-center px-3 last:max-lg:col-span-full lg:px-5">
              <Icono className="h-12 w-12 [stroke-width:1.25]" />
              <span className="mt-4 text-base font-bold leading-tight">{nombre}</span>
              <span className="mt-1 max-w-[18ch] text-sm leading-snug text-white/75">{enCorto}</span>
            </li>
          );
        })}
      </ul>

      {/* EL SELLO: una línea de lado a lado con un círculo blanco en
          medio, como el 0800 de la referencia. Dice lo que el mosaico
          viejo decía con "Todo incluido", pero se ve hecho a mano. */}
      <div className="relative mt-12 flex items-center justify-center">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-white/40" />
        <span className="relative grid h-24 w-24 place-items-center rounded-full bg-white text-sky ring-[6px] ring-white/20">
          <span className="leading-none">
            <span className="block text-3xl font-black tracking-[-0.04em]">5 de 5</span>
            <span className="mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.14em]">módulos</span>
          </span>
        </span>
      </div>

      {/* LAS PROMESAS, en fila y sin palomitas en cajita. */}
      <ul className="mx-auto mt-10 grid max-w-5xl gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {plan.incluye.map((linea) => (
          <li key={linea} className="flex items-start justify-center gap-2.5 text-left sm:justify-start lg:justify-center">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-white" />
            <span className="text-[0.9375rem] font-semibold leading-snug">{linea}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------
   SEGUNDA ETAPA: lo que viene como extra. Discreta a propósito: no se
   compra todavía, solo adelanta que el sistema va a crecer.
------------------------------------------------------------------ */
function SegundaEtapa({ titulo, texto, items }) {
  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-foto)] border border-dashed border-mist bg-cloud p-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="flex flex-wrap items-center gap-2 font-bold text-black">
          <span className="rounded-full bg-sky-tint px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-sky">
            Próximamente
          </span>
          {titulo}
        </p>
        <p className="mt-1 text-sm text-steel">{texto}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ icono, nombre }) => {
          const Icono = ICONOS[icono];
          return (
            <li
              key={nombre}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-body ring-1 ring-mist"
            >
              <Icono className="h-3.5 w-3.5 text-sky" />
              {nombre}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
