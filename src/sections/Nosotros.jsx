import { Seccion, Contenedor, Eyebrow, Boton } from "../components/ui.jsx";

/* ==================================================================
   NOSOTROS (franja de la home)

   Franja CORTA que invita a /nosotros, la página completa
   (NosotrosPagina.jsx). Conserva el id `nosotros` por si queda algún
   enlace viejo a `/#nosotros`.

   La sección anterior (pilares, foto del equipo) está en
   Desktop\mbp2026-respaldo-limpieza. ⚠️ No se recupera la foto del
   equipo: por seguridad no se muestran personas en la web.
================================================================== */
export default function Nosotros() {
  return (
    <Seccion id="nosotros" tono="tinte" className="scroll-mt-20">
      <Contenedor className="flex flex-col gap-6 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Eyebrow>Nosotros</Eyebrow>
          <h2 className="mt-3 text-balance text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-black">
            Conoce quiénes somos
          </h2>
          <p className="mt-2 max-w-[52ch] leading-[1.6] text-body">
            Por qué nació My Business Panel, cómo trabajamos y lo que estamos construyendo.
          </p>
        </div>
        <Boton variante="acento" to="/nosotros" className="shrink-0">
          Conocer AMH
        </Boton>
      </Contenedor>
    </Seccion>
  );
}
