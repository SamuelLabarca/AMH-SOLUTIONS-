import { useState } from "react";
import { CAMPO, Casilla, Etiqueta, Pastilla } from "../../components/formulario.jsx";

/* ------------------------------------------------------------------
   PASO 2 DEL CHECKOUT: TUS DATOS

   Persona o empresa decide si se pide la razón social. El documento va
   partido en letra (V, E, J, G, P) + número, como lo escribe cualquiera
   aquí. `inicial` rellena el formulario al volver con "Editar".

   Con `conContrasena` (el checkout con backend) además pide contraseña:
   es el registro de la cuenta con la que luego se entra al portal.
   `arriba` es lo que va entre el título y los campos (errores, el
   enlace "ya tengo cuenta").
------------------------------------------------------------------ */
const DOCUMENTOS = ["V", "E", "J", "G", "P"];

export default function FormularioDatos({ alEnviar, inicial, conContrasena = false, cargando = false, arriba = null }) {
  const [tipo, setTipo] = useState(inicial?.empresa ? "empresa" : "persona");
  const [verContrasena, setVerContrasena] = useState(false);
  const [nombre = "", apellido = ""] = inicial ? [inicial.nombre.split(" ")[0], inicial.nombre.split(" ").slice(1).join(" ")] : [];
  const [letra = "V", numero = ""] = inicial ? inicial.documento.split(/-(.*)/) : [];
  // La letra guardada solo vale si no ha cambiado persona/empresa.
  const mismoTipo = Boolean(inicial) && Boolean(inicial.empresa) === (tipo === "empresa");

  return (
    <form onSubmit={alEnviar}>
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">{conContrasena ? "Crea tu cuenta" : "Tus datos"}</h1>
      <p className="mt-1.5 text-[0.9375rem] text-steel">
        {conContrasena
          ? "Con tu correo y contraseña entrarás al portal de pagos para ver tu plan y renovarlo."
          : "Con ellos creamos tu cuenta y te contactamos sobre tu compra."}
      </p>

      {arriba && <div className="mt-6">{arriba}</div>}

      <fieldset className="mt-7">
        <legend className="mb-2.5 text-sm font-semibold text-black">
          Compras como… <span className="text-sky">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <Pastilla nombre="tipo" valor="persona" checked={tipo === "persona"} onChange={() => setTipo("persona")}>
            Persona natural
          </Pastilla>
          <Pastilla nombre="tipo" valor="empresa" checked={tipo === "empresa"} onChange={() => setTipo("empresa")}>
            Empresa
          </Pastilla>
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Etiqueta texto="Nombre" requerido>
          <input name="nombre" required autoComplete="given-name" defaultValue={nombre} className={CAMPO} />
        </Etiqueta>
        <Etiqueta texto="Apellido" requerido>
          <input name="apellido" required autoComplete="family-name" defaultValue={apellido} className={CAMPO} />
        </Etiqueta>

        {tipo === "empresa" && (
          <div className="sm:col-span-2">
            <Etiqueta texto="Razón social" requerido>
              <input
                name="empresa"
                required
                autoComplete="organization"
                placeholder="Ej. Distribuidora Ejemplo, C.A."
                defaultValue={inicial?.empresa ?? ""}
                className={CAMPO}
              />
            </Etiqueta>
          </div>
        )}

        <div className="sm:col-span-2">
          <Etiqueta texto={tipo === "empresa" ? "RIF de la empresa" : "Cédula o RIF"} requerido>
            <div className="flex">
              {/* `key`: al cambiar persona/empresa se vuelve a montar y
                  toma la letra que toca (J para empresa). */}
              <select
                key={tipo}
                name="tipoDocumento"
                defaultValue={mismoTipo ? letra : tipo === "empresa" ? "J" : "V"}
                aria-label="Tipo de documento"
                className="rounded-l-xl border border-r-0 border-mist bg-mist/50 px-3 text-[0.9375rem] font-semibold text-body focus:outline-none focus:ring-4 focus:ring-sky/15"
              >
                {DOCUMENTOS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <input
                name="documento"
                required
                inputMode="numeric"
                placeholder={tipo === "empresa" ? "12345678-9" : "12345678"}
                pattern="[0-9]{5,9}(-?[0-9])?"
                title="Solo números. Para RIF, con el dígito final: 12345678-9"
                defaultValue={numero}
                className={`${CAMPO} rounded-l-none`}
              />
            </div>
          </Etiqueta>
        </div>

        <Etiqueta texto="Correo" requerido>
          <input
            name="correo"
            required
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            defaultValue={inicial?.correo ?? ""}
            className={CAMPO}
          />
        </Etiqueta>
        <Etiqueta texto="Teléfono (WhatsApp)" requerido>
          <input
            name="telefono"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+58 412 1234567"
            defaultValue={inicial?.telefono ?? ""}
            className={CAMPO}
          />
        </Etiqueta>

        {conContrasena && (
          <>
            <Etiqueta texto="Contraseña" requerido>
              <input
                name="contrasena"
                required
                minLength={8}
                type={verContrasena ? "text" : "password"}
                autoComplete="new-password"
                className={CAMPO}
              />
            </Etiqueta>
            <Etiqueta texto="Repite la contraseña" requerido>
              <input
                name="confirmacion"
                required
                type={verContrasena ? "text" : "password"}
                autoComplete="new-password"
                className={CAMPO}
              />
            </Etiqueta>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
              <p className="text-xs text-steel">Mínimo 8 caracteres, con letras y números.</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                <input
                  type="checkbox"
                  checked={verContrasena}
                  onChange={(e) => setVerContrasena(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-sky"
                />
                Mostrar contraseña
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <Casilla nombre="terminos" requerido>
          Acepto los términos del servicio y que AMH Solutions me contacte sobre esta compra.{" "}
          <span className="text-sky">*</span>
        </Casilla>
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-wait disabled:opacity-80"
      >
        {cargando ? "Creando tu cuenta…" : conContrasena ? "Crear cuenta y continuar" : "Continuar al pago"}
      </button>
    </form>
  );
}
