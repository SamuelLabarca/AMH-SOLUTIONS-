import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SiteFooter from "./sections/SiteFooter.jsx";
import BotonWhatsApp from "./components/BotonWhatsApp.jsx";
import { ProveedorContacto } from "./components/Contacto.jsx";
import Home from "./pages/Home.jsx";

/* CARGA POR PÁGINA. La home va en el paquete principal (es donde entra
   casi todo el mundo); el resto se descarga solo cuando se visita. Así
   la primera carga no arrastra la tienda, el checkout ni la FAQ. */
const Producto = lazy(() => import("./pages/Producto.jsx"));
const PreguntasFrecuentes = lazy(() => import("./pages/PreguntasFrecuentes.jsx"));
const PortalPagos = lazy(() => import("./pages/portal/PortalPagos.jsx"));
const NosotrosPagina = lazy(() => import("./pages/NosotrosPagina.jsx"));
const Demo = lazy(() => import("./pages/Demo.jsx"));
const Tienda = lazy(() => import("./pages/Tienda.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));

/* ==================================================================
   APP

   Barra de navegación y footer son comunes a todas las páginas; lo que
   cambia en medio son las rutas.

   El modal de contacto lo monta <ProveedorContacto>, que envuelve todo
   para que cualquier página pueda abrirlo.
================================================================== */
export default function App() {
  const { pathname } = useLocation();

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
      {/* Sin `pt`: la barra vuelve a ser transparente sobre la cabecera
          oscura de cada página y se monta encima. El hueco para que el
          contenido no quede debajo lo pone cada cabecera con su propio
          `pt` (Hero.jsx, Producto.jsx). */}
      <main className="flex flex-col gap-[var(--margen-lienzo)]">
        {/* Mientras llega una página, un hueco oscuro del alto de la
            pantalla: la barra va en blanco y transparente arriba, y sobre
            blanco desaparecería durante ese instante. */}
        <Suspense fallback={<div className="min-h-screen bg-indigo" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto" element={<Producto />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/checkout" element={<Checkout />} />
            <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/nosotros" element={<NosotrosPagina />} />
            {/* Con `/*`: el portal tiene sus propias subrutas (registro,
                recuperar…) y las resuelve dentro de PortalPagos.jsx. */}
            <Route path="/portal-de-pagos/*" element={<PortalPagos />} />
            {/* Cualquier ruta desconocida cae en la home, para no dejar una
                pantalla en blanco ante un enlace roto. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {/* El portal de pagos no lleva el pie: es un trámite, como el
          inicio de sesión de Zoho, y solo deja el copyright bajo la
          tarjeta (lo pone su propio marco, portal/piezas.jsx). */}
      {!pathname.startsWith("/portal-de-pagos") && <SiteFooter />}
      {/* Flotante: acompaña al usuario en todas las páginas. */}
      <BotonWhatsApp />
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
      /* El elemento del ancla puede no existir todavía: la página se
         carga aparte (lazy) y, con una conexión lenta, puede tardar
         segundos. Se reintenta cada 50 ms hasta 5 s y se salta en
         cuanto aparece. Con setTimeout y no requestAnimationFrame: el
         navegador pausa los fotogramas en pestañas en segundo plano y el
         salto se perdía. */
      const limite = Date.now() + 5000;
      let id;
      const buscar = () => {
        const destino = document.querySelector(hash);
        if (destino) destino.scrollIntoView({ behavior: "smooth" });
        else if (Date.now() < limite) id = setTimeout(buscar, 50);
      };
      id = setTimeout(buscar, 0);
      return () => clearTimeout(id);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
