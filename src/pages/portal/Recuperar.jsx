import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarRecuperacion } from "../../servicios/autenticacion.js";
import { Acciones, Aviso, CampoFlotante, EnlaceTexto, Pantalla } from "./piezas.jsx";
import CarruselSeguridad from "./CarruselSeguridad.jsx";
import { BASE_PORTAL, mensajeDeError } from "./rutas.js";

/* ==================================================================
   RECUPERAR LA CONTRASEÑA (pedir el enlace)

   SOLO por correo. La respuesta es la MISMA exista o no la cuenta: si
   dijera "ese correo no está registrado", cualquiera podría usar esta
   pantalla para averiguar quién es cliente.
================================================================== */
export default function Recuperar() {
  const [enviado, setEnviado] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function alEnviar(evento) {
    evento.preventDefault();
    const correo = String(new FormData(evento.currentTarget).get("correo")).trim();
    setError(null);
    setCargando(true);
    try {
      const enlaceDemo = await solicitarRecuperacion(correo);
      setEnviado({ correo, enlaceDemo });
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setCargando(false);
    }
  }

  if (enviado) {
    return (
      <Pantalla titulo="Revisa tu correo" lateral={<CarruselSeguridad />}>
        <div className="space-y-5">
          <p className="leading-[1.6] text-body">
            Si hay una cuenta con <strong className="font-semibold text-black">{enviado.correo}</strong>, te enviamos
            un enlace para crear una contraseña nueva. Vence en 30 minutos.
          </p>
          <p className="text-sm text-steel">¿No llega? Revisa la carpeta de spam o pide otro enlace.</p>

          {/* Solo en la demo: no hay servidor de correo, así que el
              enlace que llegaría al buzón se muestra aquí. */}
          {enviado.enlaceDemo && (
            <Aviso tipo="info">
              Modo demostración: este es el enlace que llegaría por correo.{" "}
              <Link to={enviado.enlaceDemo} className="font-semibold text-sky hover:text-sky-light">
                Crear contraseña nueva
              </Link>
            </Aviso>
          )}

          <div className="flex items-center justify-between pt-4">
            <EnlaceTexto a={BASE_PORTAL}>Volver a entrar</EnlaceTexto>
            <button
              type="button"
              onClick={() => setEnviado(null)}
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-sky ring-1 ring-steel/50 transition-colors hover:bg-sky-tint"
            >
              Pedir otro enlace
            </button>
          </div>
        </div>
      </Pantalla>
    );
  }

  return (
    <Pantalla
      titulo="Recupera tu contraseña"
      texto="Escribe el correo de tu cuenta y te enviamos un enlace para crear una nueva."
      lateral={<CarruselSeguridad />}
    >
      <form onSubmit={alEnviar} className="space-y-5">
        {error && <Aviso>{error}</Aviso>}
        <CampoFlotante etiqueta="Correo" name="correo" type="email" required autoComplete="email" />
        <Acciones secundaria={{ a: BASE_PORTAL, texto: "Volver" }} cargando={cargando} textoCargando="Enviando…">
          Enviarme el enlace
        </Acciones>
      </form>
    </Pantalla>
  );
}
