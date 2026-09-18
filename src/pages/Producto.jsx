import { Seccion, Contenedor, Eyebrow, Titulo, Entradilla, Boton } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { BotonContacto, useContacto } from "../components/Contacto.jsx";
import { PLANES, SERVICIOS } from "../data/contenido.js";
import { ICONOS, IconCheck } from "../components/Iconos.jsx";

/* ==================================================================
   PÁGINA: PRODUCTO Y PLANES  (/producto)

   Aquí es donde viven el producto y los precios, fuera de la home. La
   home cuenta quiénes somos y qué hacemos; quien llega hasta aquí ya
   está decidiendo, así que esta página va al grano: qué incluye y
   cuánto cuesta.
================================================================== */
export default function Producto() {
  return (
    <>
      {/* ---------------- CABECERA ----------------
          Navy en lugar del video del hero: esta página no compite con la
          home, la continúa.

          Se comporta como el hero: tarjeta redondeada con su margen de
          lienzo, y en móvil solo redondeada por abajo, porque arriba va
          pegada al borde de la ventana detrás de la barra. */}
      <Seccion
        tono="navy"
        bleed
        className="rounded-b-[var(--radius-seccion)] pt-32 sm:mx-[var(--margen-lienzo)]
                   sm:mt-[var(--margen-lienzo)] sm:rounded-[var(--radius-seccion)] sm:pt-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[520px] w-[720px] translate-x-1/3 -translate-y-1/3 rounded-full bg-sky/20 blur-[130px]"
        />
        <Contenedor className="relative pb-20 pt-6 sm:pb-24">
          <Eyebrow claro>El producto</Eyebrow>
          <Titulo claro as="h1" className="mt-4 max-w-[20ch]">
            My Business Panel, por dentro
          </Titulo>
          <Entradilla claro className="mt-6">
            Un único panel donde tu equipo comercial, tu almacén y tu contabilidad
            trabajan sobre los mismos datos. Sin exportaciones, sin hojas de cálculo
            paralelas y sin discusiones sobre cuál es la cifra buena.
          </Entradilla>
        </Contenedor>
      </Seccion>

      {/* ---------------- MÓDULOS ----------------
          Los mismos datos que en la home, pero en formato lista compacta:
          quien está en esta página ya vio las tarjetas grandes y lo que
          busca ahora es el detalle. */}
      <Seccion tono="blanco">
        <Contenedor className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>Módulos incluidos</Eyebrow>
            <Titulo className="mt-4 max-w-[20ch]">Cuatro módulos, un solo sistema</Titulo>
          </Reveal>

          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {SERVICIOS.map(({ id, icono, titulo, texto }, i) => {
              const Icono = ICONOS[icono];
              return (
                <Reveal as="li" key={id} retraso={(i % 2) * 0.08} className="flex gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-tint text-sky">
                    <Icono className="h-5.5 w-5.5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-black">{titulo}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{texto}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Contenedor>
      </Seccion>

      {/* ---------------- PLANES ---------------- */}
      <Seccion id="planes" tono="tinte">
        <Contenedor className="py-20 sm:py-24 lg:py-28">
          <Reveal>
            <Eyebrow>Precios</Eyebrow>
            <Titulo className="mt-4 max-w-[20ch]">Planes flexibles para cada etapa</Titulo>
            <Entradilla className="mt-6">
              Precios por empresa y mes, no por cada persona que entra. Puedes cambiar
              de plan cuando quieras y todos incluyen la migración de tus datos.
            </Entradilla>
          </Reveal>

          {/* `items-start` es lo que permite que la tarjeta destacada sea
              más alta que las otras dos sin estirarlas. Con el `stretch`
              por defecto, las tres crecerían y el destaque se perdería. */}
          <ul className="mt-14 grid items-start gap-5 lg:grid-cols-3">
            {PLANES.map((plan, i) => (
              <Reveal as="li" key={plan.id} retraso={i * 0.08}>
                <TarjetaPlan plan={plan} />
              </Reveal>
            ))}
          </ul>

          <p className="mt-10 text-center text-sm text-steel">
            ¿Necesitas algo que no está aquí?{" "}
            <span className="font-semibold text-navy">Lo hablamos.</span>
          </p>
        </Contenedor>
      </Seccion>

      {/* ---------------- CIERRE ---------------- */}
      <Seccion tono="navy">
        <Contenedor className="py-16 text-center sm:py-20">
          <Reveal className="mx-auto flex max-w-[46ch] flex-col items-center">
            <Titulo claro className="text-center">
              ¿Te ayudamos a elegir?
            </Titulo>
            <Entradilla claro className="mt-4 text-center">
              Cuéntanos cómo trabajas hoy y te decimos qué plan te encaja, sin
              venderte de más.
            </Entradilla>
            <div className="mt-8">
              <BotonContacto />
            </div>
          </Reveal>
        </Contenedor>
      </Seccion>
    </>
  );
}

/* ------------------------------------------------------------------
   TARJETA DE PLAN

   El destacado se marca con TRES cosas a la vez: borde azul, sombra
   fuerte y una pastilla encima. Con una sola no se nota lo suficiente, y
   la sombra fuerte es el único sitio de la página donde se usa
   (CLAUDE.md §8: solo en el elemento destacado).
------------------------------------------------------------------ */
function TarjetaPlan({ plan }) {
  const { nombre, precio, resumen, incluye, destacado } = plan;
  /* El botón abre el modal en lugar de saltar a un ancla: en esta página
     no hay sección de contacto a la que saltar, y mandar al usuario de
     vuelta a la home para escribirnos sería perder la venta. */
  const { abrir } = useContacto();

  return (
    <article
      className={`
        relative flex h-full flex-col rounded-3xl p-8
        transition-[transform,box-shadow] duration-200 hover:-translate-y-1.5
        ${
          destacado
            ? "border-2 border-sky bg-white shadow-[var(--shadow-destacado)] lg:-mt-4 lg:pb-10 lg:pt-12"
            : "border border-mist bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]"
        }
      `}
    >
      {destacado && (
        <span className="absolute -top-3 left-8 rounded-full bg-sky px-3.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white">
          Más popular
        </span>
      )}

      <h3 className="text-lg font-bold tracking-tight text-black">{nombre}</h3>
      <p className="mt-2 text-sm leading-relaxed text-steel">{resumen}</p>

      <p className="mt-7 flex items-baseline gap-1.5">
        <span className="text-[2.75rem] font-extrabold leading-none tracking-tight text-black">
          ${precio}
        </span>
        <span className="text-sm text-steel">/mes</span>
      </p>

      <ul className="mt-8 space-y-3">
        {incluye.map((linea) => (
          <li key={linea} className="flex items-start gap-2.5">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
            <span className="text-sm leading-snug text-body">{linea}</span>
          </li>
        ))}
      </ul>

      {/* `mt-auto` mantiene los tres botones a la misma altura pese a que
          las listas tengan distinto número de líneas. */}
      <div className="mt-auto pt-9">
        <Boton
          variante={destacado ? "acento" : "primario"}
          className="w-full"
          onClick={abrir}
        >
          Empezar con {nombre}
        </Boton>
      </div>
    </article>
  );
}
