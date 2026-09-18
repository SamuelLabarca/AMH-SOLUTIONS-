import { Seccion, Contenedor, Eyebrow, Titulo, Entradilla, Boton } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { SERVICIOS } from "../data/contenido.js";
import { ICONOS, IconCheck, IconFlecha } from "../components/Iconos.jsx";

/* ==================================================================
   SERVICIOS

   Fondo en tinte (#E8F1FA) para romper el blanco de "Nosotros": el
   CLAUDE.md pide alternar fondos y variar el espaciado vertical para que
   la página tenga ritmo y no se lea como un rollo continuo.

   Cuatro tarjetas en rejilla 2x2. La cuarta ("Implementación y soporte")
   es la que enlaza con el modal de contacto, así que el recorrido acaba
   justo donde queremos.
================================================================== */
export default function Servicios() {
  return (
    <Seccion id="servicios" tono="tinte" className="mt-3 sm:mt-4">
      <Contenedor className="py-20 sm:py-24 lg:py-28">
        {/* ---------------- CABECERA ----------------
            Titular a la izquierda y el enlace al producto a la derecha,
            alineados por la base. Nunca centrado (CLAUDE.md §5). */}
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Qué hacemos</Eyebrow>
            <Titulo className="mt-4 max-w-[18ch]">
              Todo tu negocio, bajo un mismo techo
            </Titulo>
          </div>
          <Boton variante="suave" to="/producto">
            Ver el producto y sus planes
            <IconFlecha className="h-4 w-4" />
          </Boton>
        </Reveal>

        <Reveal retraso={0.08}>
          <Entradilla className="mt-6">
            My Business Panel no es un módulo suelto: son cuatro frentes que se
            alimentan entre sí. Lo que vendes actualiza tu inventario, y lo que sale
            del inventario aparece en tus finanzas, sin que nadie copie un dato de un
            sitio a otro.
          </Entradilla>
        </Reveal>

        {/* ---------------- REJILLA ---------------- */}
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {SERVICIOS.map(({ id, eyebrow, icono, titulo, texto, puntos }, i) => {
            const Icono = ICONOS[icono];
            return (
              <Reveal as="li" key={id} retraso={(i % 2) * 0.08}>
                <article
                  className="group flex h-full flex-col rounded-3xl border border-white bg-white p-7 sm:p-8
                             shadow-[var(--shadow-card)]
                             transition-[transform,box-shadow] duration-200
                             hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-tint text-sky
                               transition-colors group-hover:bg-sky group-hover:text-white"
                  >
                    <Icono className="h-6 w-6" />
                  </span>

                  <p className="mt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-sky">
                    {eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-black">
                    {titulo}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{texto}</p>

                  {/* `mt-auto` empuja las viñetas al fondo: así las cuatro
                      tarjetas alinean su lista aunque los párrafos midan
                      distinto. Sin esto la rejilla se ve descuadrada. */}
                  <ul className="mt-auto space-y-2.5 pt-7">
                    {puntos.map((punto) => (
                      <li key={punto} className="flex items-start gap-2.5">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                        <span className="text-sm leading-snug text-body">{punto}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Contenedor>
    </Seccion>
  );
}
