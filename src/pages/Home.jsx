import Hero from "../sections/Hero.jsx";
import Servicios from "../sections/Servicios.jsx";
import BusinessPanel from "../sections/BusinessPanel.jsx";
import PorQueElegirnos from "../sections/PorQueElegirnos.jsx";
import Nosotros from "../sections/Nosotros.jsx";

/* ==================================================================
   PÁGINA: HOME  (/)

   EL ORDEN DE LA HOME vive aquí y solo aquí:

     1. Hero           — la foto del edificio y la promesa
     2. Servicios      — los cuatro servicios, en tarjetas con foto
     3. BusinessPanel  — presentación del producto
     4. PorQueElegirnos — tres ventajas
     5. Nosotros       — franja corta que invita a /nosotros (la página
                         completa)
     (el footer lo pone el layout, es común a todas las páginas)

   ⚠️ Servicios va INMEDIATAMENTE después del hero. El visitante que
   acaba de leer "evoluciona a una administración sin procesos
   manuales" quiere saber qué le vendes: el "nosotros" convence cuando
   ya hay interés, no antes.

   ⚠️ `LlamadaContacto` y la sección Nosotros completa se quitaron (6 oct
   2026); están en Desktop\mbp2026-respaldo-limpieza. El ancla
   `/#contacto` no apunta a nada.

   El producto y los precios tienen además su propia página en
   /producto.

   Ritmo de fondos: oscuro → gris claro → blanco → blanco. Panel y
   "¿Por qué elegirnos?" comparten el blanco: los separa la tarjeta
   carbón del panel, que corta la banda.
================================================================== */
export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <BusinessPanel
        imagen="captura-login"
        alt="Pantalla de inicio de sesión de My Business Panel"
        imagenAntes="paper_works"
        altAntes="Persona revisando papeles a mano junto al portátil, con hojas arrugadas sobre la mesa"
      />
      <PorQueElegirnos />
      <Nosotros />
    </>
  );
}
