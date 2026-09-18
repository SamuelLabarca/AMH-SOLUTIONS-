import { Seccion, Contenedor, Eyebrow, Titulo, Entradilla } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import { BotonContacto } from "../components/Contacto.jsx";

/* ==================================================================
   LLAMADA DE CONTACTO

   Aquí NO hay formulario. El formulario vive en el modal: esta sección
   es solo la invitación, y por eso es corta y va centrada — es la única
   de la página que lo está, y precisamente por ser la excepción funciona
   como punto final.

   El fondo navy la separa del tinte de "Servicios" y la enlaza con el
   footer, que es el oscuro más profundo. La página cierra oscureciendo.
================================================================== */
export default function LlamadaContacto() {
  return (
    <Seccion id="contacto" tono="navy">
      {/* Resplandor azul detrás del contenido. Un navy plano a este tamaño
          se ve muerto; el foco radial le da profundidad sin añadir
          ningún elemento que distraiga. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-sky/20 blur-[120px]"
      />

      <Contenedor className="relative py-20 text-center sm:py-24">
        <Reveal className="mx-auto flex max-w-[52ch] flex-col items-center">
          <Eyebrow claro>¿Hablamos?</Eyebrow>
          <Titulo claro className="mt-4 text-center">
            Cuéntanos qué necesita tu negocio
          </Titulo>
          <Entradilla claro className="mt-5 text-center">
            Un mensaje corto basta. Te responde alguien del equipo de soporte, te
            escucha y te dice con honestidad si podemos ayudarte.
          </Entradilla>

          <div className="mt-9">
            <BotonContacto />
          </div>

          <p className="mt-5 text-sm text-white/45">
            Respuesta en menos de 24 horas hábiles.
          </p>
        </Reveal>
      </Contenedor>
    </Seccion>
  );
}
