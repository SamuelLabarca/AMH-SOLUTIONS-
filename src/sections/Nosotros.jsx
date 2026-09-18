import { Seccion, Contenedor, Eyebrow, Titulo, Entradilla } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { PILARES } from "../data/contenido.js";
import { ICONOS } from "../components/Iconos.jsx";

/* ==================================================================
   NOSOTROS

   Va justo debajo del hero. Antes de contar QUÉ vendemos hay que contar
   QUIÉNES somos: es lo que hace creíble todo lo que viene después.

   Rejilla asimétrica 5/7 (CLAUDE.md §8, "asimetría fina"): el texto
   ocupa menos que las tarjetas, para que no parezcan dos columnas
   iguales enfrentadas.
================================================================== */
export default function Nosotros() {
  return (
    <Seccion id="nosotros" tono="blanco" className="mt-3 sm:mt-4">
      <Contenedor className="py-20 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---------------- COLUMNA DE TEXTO ---------------- */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Quiénes somos</Eyebrow>
              <Titulo className="mt-4">
                Tecnología con nombre y apellido detrás
              </Titulo>
              <Entradilla className="mt-6">
                AMH Solutions nace de una idea simple: la mayoría de las empresas no
                necesitan más software, necesitan que alguien entienda su operación y
                se la ordene. Llevamos años construyendo herramientas para negocios
                reales, y esa experiencia es la que dio forma a My Business Panel.
              </Entradilla>
              <Entradilla className="mt-4">
                No revendemos producto de terceros. Diseñamos, programamos y
                sostenemos lo nuestro, y respondemos por ello.
              </Entradilla>
            </Reveal>
          </div>

          {/* ---------------- PILARES ----------------
              Se escalonan con `retraso` para que entren en cascada y no
              los tres a la vez, que se lee como un parpadeo. */}
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {PILARES.map(({ id, icono, titulo, texto }, i) => {
                const Icono = ICONOS[icono];
                return (
                  <Reveal as="li" key={id} retraso={i * 0.1}>
                    <div
                      className="group flex gap-5 rounded-3xl border border-mist/70 bg-cloud p-6 sm:p-7
                                 transition-[transform,box-shadow,background-color] duration-200
                                 hover:-translate-y-1 hover:bg-white hover:shadow-[var(--shadow-lift)]"
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl
                                   bg-navy text-sky-light transition-colors
                                   group-hover:bg-sky group-hover:text-white"
                      >
                        <Icono className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-black">
                          {titulo}
                        </h3>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">
                          {texto}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </Contenedor>
    </Seccion>
  );
}
