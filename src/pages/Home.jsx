import Hero from "../sections/Hero.jsx";
import Nosotros from "../sections/Nosotros.jsx";
import Servicios from "../sections/Servicios.jsx";
import LlamadaContacto from "../sections/LlamadaContacto.jsx";

/* ==================================================================
   PÁGINA: HOME  (/)

   EL ORDEN DE LA HOME vive aquí y solo aquí:

     1. Hero          — video aéreo + las métricas de respaldo
     2. Nosotros      — quiénes somos antes que qué vendemos
     3. Servicios     — los cuatro módulos
     4. Contacto      — la invitación; el formulario está en el modal
     (el footer lo pone el layout, es común a todas las páginas)

   El producto y los precios NO están aquí: tienen su propia página en
   /producto.

   Ritmo de fondos: oscuro → blanco → tinte → navy → ink. La página se va
   oscureciendo hacia el final, que es lo que cierra el recorrido.
================================================================== */
export default function Home() {
  return (
    <>
      <Hero />
      <Nosotros />
      <Servicios />
      <LlamadaContacto />
    </>
  );
}
