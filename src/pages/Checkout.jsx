import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Contenedor } from "../components/ui.jsx";
import { TIENDA, WHATSAPP } from "../data/contenido.js";
import { CAMPO, Etiqueta, Pastilla, Casilla } from "../components/formulario.jsx";
import { IconCheck, IconWhatsApp } from "../components/Iconos.jsx";
import { Pasos, PasoPago, ahorro, desglose, dolares } from "../components/tienda.jsx";

/* ==================================================================
   PÁGINA: CHECKOUT  (/tienda/checkout?pago=anual)

   El reparto del checkout de QuickBooks: el formulario a la izquierda y
   "Tu cesta" a la derecha, fija al hacer scroll. Dos pasos dentro de la
   misma página (2 Tus datos → 3 Pago) y una confirmación al final.

   La CÉDULA o RIF es obligatoria: es la llave con la que el cliente
   entrará luego al portal de pagos a ver y pagar lo que debe.

   ⚠️ Sin backend todavía: no se crea cuenta ni se guarda la orden. Los
   datos viajan en el reporte de pago por WhatsApp (ver <PasoPago>).
   Cuando haya API, aquí irá el POST que registra al cliente.
================================================================== */
const DOCUMENTOS = ["V", "E", "J", "G", "P"];

export default function Checkout() {
  const [params] = useSearchParams();
  const producto = TIENDA.productos[0];
  const { pagos } = producto;
  const pago = pagos.find((p) => p.id === params.get("pago")) ?? pagos.find((p) => p.destacado) ?? pagos[0];

  const [paso, setPaso] = useState(2);
  const [cliente, setCliente] = useState(null);
  const [reportado, setReportado] = useState(null);

  function alEnviarDatos(evento) {
    evento.preventDefault();
    const d = new FormData(evento.currentTarget);
    setCliente({
      nombre: `${d.get("nombre")} ${d.get("apellido")}`.trim(),
      empresa: d.get("empresa") || null,
      documento: `${d.get("tipoDocumento")}-${String(d.get("documento")).replace(/[^\dA-Za-z-]/g, "")}`,
      correo: d.get("correo"),
      telefono: d.get("telefono"),
    });
    setPaso(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const cuentas = desglose(pago.precio, TIENDA.iva);

  return (
    <section className="bg-cloud">
      {/* Franja oscura arriba para que la barra (transparente con texto
          blanco) se lea, igual que en el resto de páginas. */}
      <div className="bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light">
        <Contenedor className="pb-10 pt-32 sm:pt-36">
          <Pasos actual={reportado ? 4 : paso} claro />
        </Contenedor>
      </div>

      <Contenedor className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
        {/* ---------------- IZQUIERDA: el paso ---------------- */}
        <div className="lg:col-span-7">
          <div className="rounded-[var(--radius-foto)] bg-white p-7 shadow-[var(--shadow-card)] sm:p-10">
            {reportado ? (
              <Confirmacion enlace={reportado} cliente={cliente} />
            ) : paso === 2 ? (
              <FormularioDatos alEnviar={alEnviarDatos} inicial={cliente} />
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">Paga tu plan</h1>
                    <p className="mt-1.5 text-[0.9375rem] text-steel">
                      Paga desde tu banco y reporta el pago. Lo verificamos y activamos tu cuenta.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaso(2)}
                    className="shrink-0 text-sm font-medium text-sky hover:text-sky-light"
                  >
                    Editar mis datos
                  </button>
                </div>
                <div className="mt-7">
                  <PasoPago
                    orden={{
                      concepto: `${producto.marca} · ${producto.plan.nombre} · pago ${pago.nombre.toLowerCase()}`,
                      monto: cuentas?.total ?? null,
                      cliente,
                    }}
                    onReportado={setReportado}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------------- DERECHA: la cesta ---------------- */}
        <aside className="lg:col-span-5">
          <div className="rounded-[var(--radius-foto)] bg-white p-7 shadow-[var(--shadow-card)] ring-1 ring-mist sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">Tu cesta</h2>

            {/* El plan elegido en la tienda, FIJO: aquí ya no se cambia la
                forma de pago (lo pidió Samuel). Para cambiarla se vuelve a
                la tienda con "Editar", como en el checkout de QuickBooks. */}
            <div className="mt-6 flex items-center justify-between font-sans text-sm">
              <span className="text-steel">Plan de {producto.marca}</span>
              {!reportado && (
                <Link to="/tienda" className="font-medium text-sky underline-offset-2 hover:underline">
                  Editar
                </Link>
              )}
            </div>
            <div className="mt-2 flex items-start justify-between gap-4 font-sans">
              <div>
                <span className="block font-semibold text-black">{producto.plan.nombre}</span>
                <span className="block text-sm text-steel">Pago {pago.nombre.toLowerCase()}</span>
              </div>
              <div className="shrink-0 whitespace-nowrap text-right">
                {pago.precio ? (
                  <>
                    <span className="font-medium text-black">{dolares(pago.precio)}</span>
                    <span className="text-sm text-steel"> / {pago.cada}</span>
                    {ahorro(pago, pagos) && (
                      <span className="mt-0.5 block text-xs text-steel">Ahorras {ahorro(pago, pagos)}% frente al mensual</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-steel">A consultar</span>
                )}
              </div>
            </div>

            <dl className="mt-6 space-y-2 border-t border-mist pt-5 text-[0.9375rem]">
              {cuentas && TIENDA.iva ? (
                <>
                  <Linea etiqueta="Subtotal" valor={dolares(cuentas.subtotal)} />
                  <Linea etiqueta={`IVA (${TIENDA.iva}%)`} valor={dolares(cuentas.impuesto)} />
                </>
              ) : null}
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-sans text-body">Total a pagar hoy</dt>
                <dd className="font-sans text-3xl font-medium tracking-[-0.02em] text-black">
                  {cuentas ? dolares(cuentas.total) : <span className="text-xl">A consultar</span>}
                </dd>
              </div>
            </dl>

            {!cuentas && (
              <p className="mt-4 rounded-xl bg-sky-tint px-4 py-3 text-sm leading-snug text-body">
                Te confirmamos el monto exacto antes de que pagues.{" "}
                <a
                  href={`https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(
                    `Hola, quiero saber el precio de My Business Panel con pago ${pago.nombre.toLowerCase()}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sky hover:text-sky-light"
                >
                  Pregúntanos por WhatsApp
                </a>
              </p>
            )}

            <Link to="/tienda" className="mt-6 block text-center text-sm font-semibold text-steel hover:text-black">
              ← Volver a la tienda
            </Link>
          </div>
        </aside>
      </Contenedor>
    </section>
  );
}

function Linea({ etiqueta, valor }) {
  return (
    <div className="flex justify-between">
      <dt className="text-steel">{etiqueta}</dt>
      <dd className="font-medium text-black">{valor}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------
   PASO 2: TUS DATOS

   Persona o empresa decide si se pide la razón social. El documento va
   partido en letra (V, E, J, G, P) + número, como lo escribe cualquiera
   aquí. `inicial` rellena el formulario al volver con "Editar".
------------------------------------------------------------------ */
function FormularioDatos({ alEnviar, inicial }) {
  const [tipo, setTipo] = useState(inicial?.empresa ? "empresa" : "persona");
  const [nombre = "", apellido = ""] = inicial ? [inicial.nombre.split(" ")[0], inicial.nombre.split(" ").slice(1).join(" ")] : [];
  const [letra = "V", numero = ""] = inicial ? inicial.documento.split(/-(.*)/) : [];
  // La letra guardada solo vale si no ha cambiado persona/empresa.
  const mismoTipo = Boolean(inicial) && Boolean(inicial.empresa) === (tipo === "empresa");

  return (
    <form onSubmit={alEnviar}>
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">Tus datos</h1>
      <p className="mt-1.5 text-[0.9375rem] text-steel">
        Con ellos creamos tu cuenta. Tu cédula o RIF es lo que usarás luego en el portal de pagos.
      </p>

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
      </div>

      <div className="mt-6">
        <Casilla nombre="terminos" requerido>
          Acepto los términos del servicio y que AMH Solutions me contacte sobre esta compra.{" "}
          <span className="text-sky">*</span>
        </Casilla>
      </div>

      <button
        type="submit"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light"
      >
        Continuar al pago
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------
   CONFIRMACIÓN. El enlace se ofrece otra vez por si el navegador
   bloqueó la pestaña de WhatsApp.
------------------------------------------------------------------ */
function Confirmacion({ enlace, cliente }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-tint text-sky">
        <IconCheck className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-black">¡Recibimos tu reporte!</h1>
      <p className="mx-auto mt-3 max-w-[40ch] leading-[1.65] text-body">
        Verificamos el pago y te escribimos a {cliente?.correo} y por WhatsApp para activar tu cuenta.
      </p>
      <p className="mx-auto mt-2 max-w-[40ch] text-sm text-steel">
        Guarda tu {cliente?.documento?.startsWith("J") || cliente?.documento?.startsWith("G") ? "RIF" : "cédula"} (
        {cliente?.documento}): con ella consultas y pagas tus renovaciones en el portal de pagos.
      </p>
      <a
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky px-7 py-3 font-bold text-white transition-colors hover:bg-sky-light"
      >
        <IconWhatsApp className="h-5 w-5" />
        Abrir WhatsApp otra vez
      </a>
    </div>
  );
}
