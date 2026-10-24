import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MODO_DEMO } from "../../servicios/api.js";
import { useSesion } from "./Sesion.jsx";
import CarruselSeguridad from "./CarruselSeguridad.jsx";
import { Acciones, Aviso, CampoFlotante, EnlaceTexto, MostrarContrasena, Pantalla } from "./piezas.jsx";
import { BASE_PORTAL, mensajeDeError } from "./rutas.js";

/* ==================================================================
   ENTRAR AL PORTAL

   Correo y contraseña, la misma cuenta de My Business Panel. Si la
   suscripción está vencida se entra igual: este portal existe para
   que el cliente atrasado pueda pagar.
================================================================== */
export default function IniciarSesion() {
  const { iniciarSesion } = useSesion();
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false);

  async function alEnviar(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion({ correo: String(datos.get("correo")).trim(), contrasena: datos.get("contrasena") });
    } catch (e) {
      setError(mensajeDeError(e, { "credenciales-invalidas": "El correo o la contraseña no son correctos." }));
      setCargando(false);
    }
  }

  return (
    <Pantalla
      titulo="Paga tu suscripción"
      texto="Entra con tu cuenta para ver tus planes y pagar lo pendiente."
      lateral={<CarruselSeguridad />}
    >
      <form onSubmit={alEnviar} className="space-y-5">
        {state?.aviso && <Aviso tipo="info">{state.aviso}</Aviso>}
        {error && <Aviso>{error}</Aviso>}

        <CampoFlotante etiqueta="Correo" name="correo" type="email" required autoComplete="email" />

        <div className="space-y-3">
          <CampoFlotante
            etiqueta="Contraseña"
            name="contrasena"
            type={visible ? "text" : "password"}
            required
            autoComplete="current-password"
          />
          <MostrarContrasena visible={visible} onChange={setVisible} />
        </div>

        <EnlaceTexto a={`${BASE_PORTAL}/recuperar`}>¿Olvidaste tu contraseña?</EnlaceTexto>

        <Acciones
          secundaria={{ a: `${BASE_PORTAL}/registro`, texto: "Crear cuenta" }}
          cargando={cargando}
          textoCargando="Entrando…"
        >
          Entrar
        </Acciones>
      </form>

      {MODO_DEMO && (
        <p className="mt-8 text-center text-xs text-steel">
          Modo demostración: maria@demo.com o admin@distribuidora.com, contraseña Demo1234.
        </p>
      )}
    </Pantalla>
  );
}
