import { Contenedor, Eyebrow, Boton } from "../components/ui.jsx";
import { IconWhatsApp } from "../components/Iconos.jsx";
import { WHATSAPP } from "../data/contenido.js";
import { useContacto } from "../components/Contacto.jsx";

/* ==================================================================
   PÁGINA PROVISIONAL ("muy pronto")

   La usa /portal-de-pagos mientras el portal no existe.
   Existe para que los enlaces nuevos de la barra no caigan en la home
   (que es lo que hace la ruta comodín de App.jsx) y parezcan rotos.

   Cabecera OSCURA a propósito: la barra es transparente con el texto en
   blanco arriba del todo, y sobre un fondo claro no se leería.

   Cuando una de las dos páginas tenga contenido, se le hace su propio
   archivo en src/pages y se cambia su <Route> en App.jsx.
================================================================== */
export default function Proximamente({ eyebrow, titulo, texto, mensaje = WHATSAPP.mensaje }) {
  const { abrirReunion } = useContacto();

  return (
    <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-fondo-sky-light/40 blur-[120px]"
      />
      <Contenedor className="relative flex min-h-[70vh] flex-col justify-center pb-24 pt-36 sm:pt-40">
        <Eyebrow claro className="text-white/70!">{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          {titulo}
        </h1>
        <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.65] text-white/80">{texto}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Boton
            variante="blanco"
            href={`https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(mensaje)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp className="h-5 w-5" />
            Escríbenos por WhatsApp
          </Boton>
          <Boton variante="contorno" onClick={abrirReunion}>
            Agendar una reunión
          </Boton>
        </div>
      </Contenedor>
    </section>
  );
}
