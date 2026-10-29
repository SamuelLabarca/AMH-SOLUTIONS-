import { useState } from "react";
import { Link } from "react-router-dom";
import { CAMPO, Etiqueta } from "../../components/formulario.jsx";
import { validarContrasena } from "../../servicios/autenticacion.js";
import { normalizarDocumento } from "../../servicios/portalPagos.js";
import { crearOrden } from "../../servicios/tienda.js";
import { useSesion } from "../portal/Sesion.jsx";
import { mensajeDeError } from "../portal/rutas.js";
import FormularioDatos from "./FormularioDatos.jsx";

/* ==================================================================
   PASO 2 DEL CHECKOUT CON BACKEND: TU CUENTA

   La compra necesita una cuenta: es con la que luego se entra al portal
   a renovar. Tres casos, y los tres acaban creando la ORDEN:

   - Ya hay sesión → "Compras como María" y continuar.
   - No hay cuenta → el formulario de datos con contraseña (registro).
   - Ya tiene cuenta → correo y contraseña (entrar).

   La orden la crea el backend con su precio: aquí solo se dice QUÉ se
   compra (`producto` y `opcion`). `alListo(orden, usuario)` avanza al pago.
================================================================== */
const ERRORES_ORDEN = {
  "opcion-no-disponible": "Esta forma de pago ya no está disponible. Vuelve a la tienda y elige otra.",
};

export default function PasoCuenta({ producto, opcion, alListo }) {
  const { usuario, iniciarSesion, registrar, cerrarSesion } = useSesion();
  const [modo, setModo] = useState("registro");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // El último paso de los tres casos: crear la orden y avanzar.
  async function comprar(quien) {
    const orden = await crearOrden({ producto, opcion });
    alListo(orden, quien);
  }

  async function intentar(accion, propios = {}) {
    setError(null);
    setCargando(true);
    try {
      await accion();
    } catch (e) {
      setError(mensajeDeError(e, { ...ERRORES_ORDEN, ...propios }));
      setCargando(false);
    }
  }

  if (usuario === undefined) return <p className="py-10 text-center text-steel">Comprobando tu sesión…</p>;

  const aviso = error && (
    <p role="alert" className="rounded-xl bg-ink/[0.04] px-4 py-3 text-sm text-ink ring-1 ring-ink/15">
      {error}
    </p>
  );

  /* ---------------- YA HAY SESIÓN ---------------- */
  if (usuario) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">Tu cuenta</h1>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-cloud p-5 ring-1 ring-mist">
          <div className="min-w-0">
            <p className="font-semibold text-black">Compras como {usuario.nombre}</p>
            <p className="truncate text-sm text-steel">
              {usuario.correo} · {usuario.documento}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              intentar(async () => {
                await cerrarSesion();
                // `intentar` deja `cargando` encendido al terminar bien
                // (lo normal es avanzar de paso); aquí no se avanza.
                setCargando(false);
              })
            }
            className="shrink-0 text-sm font-medium text-sky hover:text-sky-light"
          >
            No soy yo
          </button>
        </div>
        {aviso && <div className="mt-5">{aviso}</div>}
        <button
          type="button"
          disabled={cargando}
          onClick={() => intentar(() => comprar(usuario))}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-wait disabled:opacity-80"
        >
          {cargando ? "Preparando tu orden…" : "Continuar al pago"}
        </button>
      </div>
    );
  }

  /* ---------------- YA TIENE CUENTA: ENTRAR ---------------- */
  if (modo === "entrar") {
    function alEntrar(evento) {
      evento.preventDefault();
      const d = new FormData(evento.currentTarget);
      intentar(
        async () => {
          await iniciarSesion({ correo: String(d.get("correo")).trim(), contrasena: d.get("contrasena") });
          // Sin `comprar` aquí: con la sesión abierta se pinta "Compras
          // como…" y el cliente confirma con qué cuenta compra.
          setCargando(false);
        },
        { "credenciales-invalidas": "El correo o la contraseña no son correctos." },
      );
    }

    return (
      <form onSubmit={alEntrar}>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">Entra a tu cuenta</h1>
        <p className="mt-1.5 text-[0.9375rem] text-steel">La misma con la que entras al portal de pagos.</p>
        {aviso && <div className="mt-6">{aviso}</div>}
        <div className="mt-6 space-y-4">
          <Etiqueta texto="Correo" requerido>
            <input name="correo" type="email" required autoComplete="email" className={CAMPO} />
          </Etiqueta>
          <Etiqueta texto="Contraseña" requerido>
            <input name="contrasena" type="password" required autoComplete="current-password" className={CAMPO} />
          </Etiqueta>
        </div>
        <Link to="/portal-de-pagos/recuperar" className="mt-3 inline-block text-sm font-medium text-sky hover:text-sky-light">
          ¿Olvidaste tu contraseña?
        </Link>
        <button
          type="submit"
          disabled={cargando}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-wait disabled:opacity-80"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
        <CambiarModo texto="¿Todavía no tienes cuenta?" accion="Créala aquí" alPulsar={() => (setError(null), setModo("registro"))} />
      </form>
    );
  }

  /* ---------------- NO TIENE CUENTA: REGISTRO ---------------- */
  function alRegistrar(evento) {
    evento.preventDefault();
    const d = new FormData(evento.currentTarget);
    const contrasena = d.get("contrasena");
    const problema = validarContrasena(contrasena);
    if (problema) return setError(`La contraseña no es válida. ${problema}`);
    if (contrasena !== d.get("confirmacion")) return setError("Las contraseñas no coinciden.");

    // Una empresa se registra con su razón social; una persona, con su nombre.
    const nombre = d.get("empresa") || `${d.get("nombre")} ${d.get("apellido")}`.trim();
    intentar(
      async () => {
        const nuevo = await registrar({
          nombre: String(nombre).trim(),
          documento: normalizarDocumento(d.get("tipoDocumento"), d.get("documento")),
          correo: String(d.get("correo")).trim().toLowerCase(),
          telefono: String(d.get("telefono")).trim(),
          contrasena,
        });
        await comprar(nuevo);
      },
      {
        "cuenta-existente": "Ya hay una cuenta con ese correo o documento. Entra con ella para comprar.",
        "datos-invalidos": "Revisa los datos. La contraseña no puede ser una de las más usadas.",
      },
    );
  }

  return (
    <FormularioDatos
      conContrasena
      cargando={cargando}
      alEnviar={alRegistrar}
      arriba={
        <div className="space-y-4">
          {aviso}
          <CambiarModo texto="¿Ya tienes cuenta?" accion="Entra con ella" alPulsar={() => (setError(null), setModo("entrar"))} />
        </div>
      }
    />
  );
}

function CambiarModo({ texto, accion, alPulsar }) {
  return (
    <p className="mt-5 text-center text-sm text-body first:mt-0">
      {texto}{" "}
      <button type="button" onClick={alPulsar} className="font-semibold text-sky hover:text-sky-light">
        {accion}
      </button>
    </p>
  );
}
