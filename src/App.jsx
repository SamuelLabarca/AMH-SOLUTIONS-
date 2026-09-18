import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SiteFooter from "./sections/SiteFooter.jsx";
import { ProveedorContacto } from "./components/Contacto.jsx";
import Home from "./pages/Home.jsx";
import Producto from "./pages/Producto.jsx";

/* ==================================================================
   APP

   Barra de navegación y footer son comunes a todas las páginas; lo que
   cambia en medio son las rutas.

   El modal de contacto lo monta <ProveedorContacto>, que envuelve todo
   para que cualquier página pueda abrirlo.
================================================================== */
export default function App() {
  return (
    <ProveedorContacto>
      <AlCambiarDeRuta />
      <Navbar />
      {/* EL RITMO DE LA PÁGINA VIVE AQUÍ.

          Las secciones son tarjetas sobre el lienzo gris y la separación
          entre ellas la da este `gap`, con el MISMO valor que el margen
          lateral de cada tarjeta (`--margen-lienzo`). Así el gris que se
          ve entre dos secciones mide lo mismo que el de los costados y
          la rejilla se lee como una sola pieza.

          ⚠️ Si una sección se pone su propio margen superior, rompe esto.
          No lo hagas: cámbialo aquí. */}
      <main className="flex flex-col gap-[var(--margen-lienzo)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto" element={<Producto />} />
          {/* Cualquier ruta desconocida cae en la home, para no dejar una
              pantalla en blanco ante un enlace roto. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <SiteFooter />
    </ProveedorContacto>
  );
}

/* ------------------------------------------------------------------
   DESPLAZAMIENTO AL CAMBIAR DE RUTA

   React Router NO mueve el scroll al navegar: sin esto, al pulsar
   "Producto y planes" desde el pie de la home se aterriza a mitad de la
   página nueva, que parece un fallo de carga.

   Si la URL trae ancla (/#servicios) se salta al elemento en lugar de
   subir arriba, que es lo que espera quien pulsa ese enlace.
------------------------------------------------------------------ */
function AlCambiarDeRuta() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      /* Un fotograma de margen: en este la página de destino aún no ha
         pintado y el elemento del ancla todavía no existe. */
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
