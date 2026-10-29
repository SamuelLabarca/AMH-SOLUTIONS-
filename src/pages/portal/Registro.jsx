import { useState } from "react";
import { IconCheck } from "../../components/Iconos.jsx";
import { validarContrasena } from "../../servicios/autenticacion.js";
import { normalizarDocumento } from "../../servicios/portalPagos.js";
import { useSesion } from "../../sesion/Sesion.jsx";
import CarruselSeguridad from "./CarruselSeguridad.jsx";
import { Acciones, Aviso, CampoFlotante, MostrarContrasena, Pantalla, SelectorFlotante } from "./piezas.jsx";
import { BASE_PORTAL } from "./rutas.js";
import { mensajeDeError } from "../../sesion/errores.js";

/* ==================================================================
   REGISTRO

   Crea la cuenta con la que el cliente entra al portal y, una vez
   pagada la suscripción, a My Business Panel. La cuenta nace SIN
   acceso al Panel: el pago confirmado es lo que la activa.

   El CORREO es obligatorio y único: es el único canal de recuperación
   de la contraseña, así que tiene que ser uno que el cliente revise.
================================================================== */
const LETRAS = ["V", "E", "J", "G", "P"];

export default function Registro() {
  const { registrar } = useSesion();
  const [tipo, setTipo] = useState("persona");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

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
      await registrar({
        nombre: String(datos.get("nombre")).trim(),
        documento: normalizarDocumento(datos.get("letra"), datos.get("numero")),
        correo: String(datos.get("correo")).trim().toLowerCase(),
        telefono: String(datos.get("telefono")).trim(),
        contrasena,
      });
      // Con la sesión ya abierta, el portal muestra la cuenta solo.
    } catch (e) {
      setError(
        mensajeDeError(e, {
          "cuenta-existente": "Ya hay una cuenta con ese correo o documento. Si es tuya, recupera tu contraseña.",
          // La API además rechaza las contraseñas más comunes ("password1").
          "datos-invalidos": "Revisa los datos. La contraseña no puede ser una de las más usadas.",
        }),
      );
      setCargando(false);
    }
  }

  const empresa = tipo === "empresa";
  const tipoContrasena = visible ? "text" : "password";

  return (
    <Pantalla
      titulo="Crea tu cuenta"
      texto="Con ella pagas tus suscripciones y entras a My Business Panel."
      lateral={<CarruselSeguridad />}
    >
      <form onSubmit={alEnviar} className="space-y-5">
        {error && <Aviso>{error}</Aviso>}

        <Segmentado
          etiqueta="Te registras como"
          valor={tipo}
          onChange={setTipo}
          opciones={[
            { valor: "persona", texto: "Persona" },
            { valor: "empresa", texto: "Empresa" },
          ]}
        />

        <CampoFlotante
          etiqueta={empresa ? "Razón social" : "Nombre y apellido"}
          name="nombre"
          required
          autoComplete={empresa ? "organization" : "name"}
        />

        <div className="flex gap-3">
          {/* `key`: al cambiar a empresa se vuelve a montar con la J. */}
          <SelectorFlotante
            key={tipo}
            etiqueta="Tipo"
            name="letra"
            defaultValue={empresa ? "J" : "V"}
            opciones={LETRAS}
            className="w-24 shrink-0"
          />
          <CampoFlotante
            etiqueta={empresa ? "RIF" : "Cédula o RIF"}
            name="numero"
            required
            inputMode="numeric"
            pattern="[0-9]{5,9}(-?[0-9])?"
            title="Solo números. Para RIF, con el dígito final: 12345678-9"
            className="min-w-0 flex-1"
          />
        </div>

        <CampoFlotante
          etiqueta="Correo"
          name="correo"
          type="email"
          required
          autoComplete="email"
          ayuda="Lo usaremos para recuperar tu contraseña."
        />

        <CampoFlotante etiqueta="Teléfono (WhatsApp)" name="telefono" type="tel" required inputMode="tel" autoComplete="tel" />

        <div className="space-y-3">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
            <CampoFlotante
              etiqueta="Contraseña"
              name="contrasena"
              type={tipoContrasena}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <CampoFlotante
              etiqueta="Repite la contraseña"
              name="confirmacion"
              type={tipoContrasena}
              required
              autoComplete="new-password"
            />
          </div>
          <p className="px-4 text-xs text-steel">Usa 8 caracteres como mínimo, con letras y números.</p>
          <MostrarContrasena visible={visible} onChange={setVisible} />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-body">
          <input type="checkbox" name="terminos" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sky" />
          Acepto los términos del servicio y la política de privacidad de AMH Solutions.
        </label>

        <Acciones secundaria={{ a: BASE_PORTAL, texto: "Ya tengo cuenta" }} cargando={cargando} textoCargando="Creando…">
          Crear mi cuenta
        </Acciones>
      </form>
    </Pantalla>
  );
}

/* Botón segmentado de Material: dos opciones en una cápsula con borde
   fino, la elegida rellena en tinte con su palomita. Son radios de
   verdad (sr-only), así que funciona con teclado y lector de pantalla. */
function Segmentado({ etiqueta, valor, onChange, opciones }) {
  return (
    <fieldset>
      <legend className="sr-only">{etiqueta}</legend>
      <div className="grid grid-cols-2 overflow-hidden rounded-full border border-steel/50">
        {opciones.map((o, i) => {
          const activa = o.valor === valor;
          return (
            <label
              key={o.valor}
              className={`flex cursor-pointer items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-inset has-focus-visible:ring-sky ${
                i > 0 ? "border-l border-steel/50" : ""
              } ${activa ? "bg-sky-tint text-ink" : "text-body hover:bg-cloud"}`}
            >
              <input
                type="radio"
                name="tipo"
                value={o.valor}
                checked={activa}
                onChange={() => onChange(o.valor)}
                className="sr-only"
              />
              {activa && <IconCheck className="h-4 w-4" />}
              {o.texto}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
