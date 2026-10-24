import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { restablecerContrasena, validarContrasena } from "../../servicios/autenticacion.js";
import { Acciones, Aviso, CampoFlotante, MostrarContrasena, Pantalla } from "./piezas.jsx";
import { BASE_PORTAL, mensajeDeError } from "./rutas.js";
import CarruselSeguridad from "./CarruselSeguridad.jsx";

/* ==================================================================
   CREAR CONTRASEÑA NUEVA  (/portal-de-pagos/restablecer?token=…)

   Se llega desde el enlace del correo. El token es de un solo uso y
   vence: si falla, se ofrece pedir otro en vez de un error sin salida.
   Al cambiarla se cierran las sesiones abiertas y se vuelve a entrar.
================================================================== */
export default function Restablecer() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navegar = useNavigate();
  const [error, setError] = useState(null);
  const [tokenInvalido, setTokenInvalido] = useState(!token);
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false);

  async function alEnviar(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const contrasena = datos.get("contrasena");

    const problema = validarContrasena(contrasena);
    if (problema) return setError(`La contraseña no es válida. ${problema}`);
    if (contrasena !== datos.get("confirmacion")) return setError("Las contraseñas no coinciden.");

    setError(null);
    setCargando(true);
    try {
      await restablecerContrasena({ token, contrasena });
      navegar(BASE_PORTAL, { replace: true, state: { aviso: "Tu contraseña se cambió. Entra con la nueva." } });
    } catch (e) {
      if (e.codigo === "token-invalido") setTokenInvalido(true);
      else
        setError(
          mensajeDeError(e, {
            "contrasena-invalida": "La contraseña no es válida. Prueba con otra que no sea de las más usadas.",
          }),
        );
      setCargando(false);
    }
  }

  if (tokenInvalido) {
    return (
      <Pantalla
        titulo="El enlace ya no sirve"
        texto="Los enlaces para cambiar la contraseña vencen a los 30 minutos y solo se pueden usar una vez."
        lateral={<CarruselSeguridad />}
      >
        <div className="flex justify-end">
          <Link
            to={`${BASE_PORTAL}/recuperar`}
            className="rounded-full bg-sky px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-light"
          >
            Pedir un enlace nuevo
          </Link>
        </div>
      </Pantalla>
    );
  }

  const tipo = visible ? "text" : "password";

  return (
    <Pantalla
      titulo="Crea tu contraseña nueva"
      texto="Usa 8 caracteres como mínimo, con letras y números."
      lateral={<CarruselSeguridad />}
    >
      <form onSubmit={alEnviar} className="space-y-5">
        {error && <Aviso>{error}</Aviso>}
        <CampoFlotante
          etiqueta="Contraseña nueva"
          name="contrasena"
          type={tipo}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <div className="space-y-3">
          <CampoFlotante etiqueta="Repite la contraseña" name="confirmacion" type={tipo} required autoComplete="new-password" />
          <MostrarContrasena visible={visible} onChange={setVisible} />
        </div>
        <Acciones cargando={cargando} textoCargando="Guardando…">
          Guardar contraseña
        </Acciones>
      </form>
    </Pantalla>
  );
}
