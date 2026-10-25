import { Navigate, Route, Routes } from "react-router-dom";
import { ProveedorSesion, useSesion } from "./Sesion.jsx";
import IniciarSesion from "./IniciarSesion.jsx";
import MiCuenta from "./MiCuenta.jsx";
import Recuperar from "./Recuperar.jsx";
import Registro from "./Registro.jsx";
import Restablecer from "./Restablecer.jsx";
import { BASE_PORTAL } from "./rutas.js";
import { Fondo } from "./piezas.jsx";

/* ==================================================================
   PORTAL DE PAGOS  (/portal-de-pagos/*)

   Privado: cada cliente ve SOLO sus suscripciones, después de entrar
   con su cuenta. Las rutas:

     /portal-de-pagos               entrar, o la cuenta si hay sesión
     /portal-de-pagos/registro      crear cuenta
     /portal-de-pagos/recuperar     pedir el enlace por correo
     /portal-de-pagos/restablecer   contraseña nueva (desde el correo)

   Todo el portal es un solo archivo lazy en App.jsx, así que la sesión
   solo se consulta cuando alguien entra aquí.
================================================================== */
export default function PortalPagos() {
  return (
    <ProveedorSesion>
      <Routes>
        <Route index element={<Inicio />} />
        <Route
          path="registro"
          element={
            <SinSesion>
              <Registro />
            </SinSesion>
          }
        />
        <Route path="recuperar" element={<Recuperar />} />
        <Route path="restablecer" element={<Restablecer />} />
        <Route path="*" element={<Navigate to={BASE_PORTAL} replace />} />
      </Routes>
    </ProveedorSesion>
  );
}

function Inicio() {
  const { usuario } = useSesion();
  if (usuario === undefined) return <Comprobando />;
  return usuario ? <MiCuenta /> : <IniciarSesion />;
}

/* Quien ya tiene sesión no necesita registrarse: va a su cuenta. Es
   también lo que lleva a la cuenta justo después de registrarse. */
function SinSesion({ children }) {
  const { usuario } = useSesion();
  if (usuario === undefined) return <Comprobando />;
  return usuario ? <Navigate to={BASE_PORTAL} replace /> : children;
}

/* Mientras se comprueba la sesión: el fondo solo, del alto de la
   pantalla, para que no parpadee la pantalla de entrar si ya había
   sesión. */
function Comprobando() {
  return <Fondo className="min-h-screen" aria-busy="true" />;
}
