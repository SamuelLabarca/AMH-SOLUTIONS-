import { useState } from "react";
import { METODOS_PAGO, WHATSAPP } from "../data/contenido.js";
import { CAMPO, Etiqueta, Pastilla } from "./formulario.jsx";
import { IconCheck, IconWhatsApp } from "./Iconos.jsx";

/* ------------------------------------------------------------------
   PIEZAS DE LA TIENDA

   Las comparten la tienda (/tienda), el checkout (/tienda/checkout) y,
   más adelante, el portal de pagos. Sobre todo <PasoPago>: el cobro es
   la MISMA pantalla compre alguien por primera vez o renueve.
------------------------------------------------------------------ */

/* Dólares con el formato de aquí: punto de miles y coma decimal
   ($1.234,50). Sin decimales si el número es redondo. */
export function dolares(n) {
  const redondo = Number.isInteger(n);
  return `$${n.toLocaleString("es-VE", {
    minimumFractionDigits: redondo ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/* Lo que se ahorra un pago largo frente a pagar mes a mes, en %. Null
   si falta algún precio o si es el propio mensual. */
export function ahorro(pago, pagos) {
  const mensual = pagos.find((p) => p.meses === 1);
  if (!pago.precio || !mensual?.precio || pago.meses === 1) return null;
  const pct = Math.round((1 - pago.precio / (mensual.precio * pago.meses)) * 100);
  return pct > 0 ? pct : null;
}

/* El total con el IVA, si está definido. Null si no hay precio. */
export function desglose(precio, iva) {
  if (!precio) return null;
  const impuesto = iva ? Math.round(precio * iva) / 100 : 0;
  return { subtotal: precio, impuesto, total: precio + impuesto };
}

/* ---------------- LOS PASOS ----------------
   El "1 Elegir plan — 2 Tus datos — 3 Pago" de QuickBooks. Los pasos
   hechos llevan la palomita; el actual va relleno. `claro` es para
   pintarlo sobre la cabecera oscura.

   ⚠️ SIEMPRE EN UNA LÍNEA (`flex-nowrap`): en móvil el "3 Pago" caía
   solo al renglón de abajo (lo vio Samuel). Por eso en móvil se
   encogen la línea entre pasos, los círculos y la letra. */
const PASOS = ["Elegir plan", "Tus datos", "Pago"];

export function Pasos({ actual, claro = false }) {
  return (
    <ol className="flex flex-nowrap items-center gap-x-1.5 sm:gap-x-3" aria-label="Pasos de la compra">
      {PASOS.map((nombre, i) => {
        const n = i + 1;
        const hecho = n < actual;
        const activo = n === actual;
        return (
          <li key={nombre} className="flex shrink-0 items-center gap-1.5 sm:gap-3" aria-current={activo ? "step" : undefined}>
            {i > 0 && (
              <span aria-hidden="true" className={`h-px w-4 sm:w-12 ${claro ? "bg-white/30" : "bg-mist"}`} />
            )}
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                activo
                  ? claro
                    ? "bg-white text-ink"
                    : "bg-ink text-white"
                  : hecho
                    ? "bg-azul-vivo text-white"
                    : claro
                      ? "bg-white/10 text-white/70 ring-1 ring-white/25"
                      : "bg-cloud text-steel ring-1 ring-mist"
              }`}
            >
              {hecho ? <IconCheck className="h-4 w-4" /> : n}
            </span>
            <span
              className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${
                activo ? (claro ? "text-white" : "text-black") : claro ? "text-white/70" : "text-steel"
              }`}
            >
              {nombre}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------
   EL PAGO (pago reportado)

   1. El cliente elige el método (Pago Móvil, transferencia, Zelle…).
   2. Ve a dónde pagar y paga desde su banco.
   3. Reporta la referencia. Alguien del equipo lo verifica y activa.

   `orden`: { concepto, monto (número o null), cliente: { nombre,
   documento, correo } }. Lo arma quien lo usa (checkout o portal).

   ⚠️ Sin backend todavía: el reporte sale por WhatsApp ya escrito
   (`reportarPago`). El día que haya API, ese es el único sitio que
   cambia; la pantalla se queda igual.
------------------------------------------------------------------ */
export function PasoPago({ orden, onReportado }) {
  const [metodoId, setMetodoId] = useState(METODOS_PAGO[0].id);
  const metodo = METODOS_PAGO.find((m) => m.id === metodoId);
  const enBolivares = metodo.moneda === "Bs";

  function alEnviar(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const enlace = reportarPago(orden, metodo, datos);
    window.open(enlace, "_blank", "noopener,noreferrer");
    onReportado?.(enlace);
  }

  return (
    <form onSubmit={alEnviar}>
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-black">
          ¿Cómo vas a pagar? <span className="text-sky">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {METODOS_PAGO.map((m) => (
            <Pastilla
              key={m.id}
              nombre="metodo"
              valor={m.id}
              checked={m.id === metodoId}
              onChange={() => setMetodoId(m.id)}
            >
              {m.nombre}
            </Pastilla>
          ))}
        </div>
      </fieldset>

      {/* A DÓNDE PAGAR. Cada dato con su botón de copiar: en el móvil,
          copiar un número de cuenta a mano es donde la gente se equivoca. */}
      <div className="mt-6 rounded-2xl bg-cloud p-5 ring-1 ring-mist">
        <p className="font-sans text-sm font-medium text-black">
          Paga por {metodo.nombre}
          {orden.monto ? (
            <>
              {" "}
              el monto de <span className="font-semibold text-sky">{dolares(orden.monto)}</span>
              {enBolivares && " en bolívares a la tasa BCV del día"}
            </>
          ) : (
            " el monto que te indicamos"
          )}
          :
        </p>
        <dl className="mt-4 divide-y divide-mist">
          {metodo.datos.map(({ etiqueta, valor }) => (
            <div key={etiqueta} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-steel">{etiqueta}</dt>
              <dd className="flex items-center gap-2 text-right text-[0.9375rem] font-medium text-black">
                {valor ?? <span className="font-medium italic text-steel">Por confirmar</span>}
                {valor && <BotonCopiar texto={valor} />}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* EL REPORTE. */}
      <p className="mt-7 font-sans text-sm font-medium text-black">Cuando hayas pagado, repórtalo aquí:</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Etiqueta texto="Número de referencia" requerido>
          <input name="referencia" required inputMode="numeric" placeholder="Ej. 00123456" className={CAMPO} />
        </Etiqueta>
        <Etiqueta texto="Fecha del pago" requerido>
          <input name="fecha" required type="date" defaultValue={hoy()} max={hoy()} className={CAMPO} />
        </Etiqueta>
        {enBolivares && (
          <Etiqueta texto="Banco desde el que pagaste" requerido>
            <input name="banco" required placeholder="Ej. Banesco" className={CAMPO} />
          </Etiqueta>
        )}
        <Etiqueta texto={`Monto pagado (${enBolivares ? "Bs." : "$"})`} requerido>
          <input name="monto" required inputMode="decimal" placeholder="0,00" className={CAMPO} />
        </Etiqueta>
      </div>

      <button
        type="submit"
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light"
      >
        Reportar mi pago
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-steel">
        <IconWhatsApp className="h-3.5 w-3.5" />
        Se abre WhatsApp con tu reporte escrito. Adjunta ahí el capture del pago.
      </p>
    </form>
  );
}

function BotonCopiar({ texto }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(texto).then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 1500);
        });
      }}
      className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sky ring-1 ring-mist transition-colors hover:bg-sky-tint"
    >
      {copiado ? "Copiado" : "Copiar"}
    </button>
  );
}

/* La fecha de hoy en AAAA-MM-DD, la que entiende <input type="date">. */
function hoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* Arma el reporte y devuelve el enlace de WhatsApp. ⚠️ Aquí irá el POST
   a la API cuando exista. */
function reportarPago(orden, metodo, datos) {
  const { cliente } = orden;
  const lineas = [
    "Hola, quiero reportar un pago.",
    "",
    `Concepto: ${orden.concepto}`,
    orden.monto ? `Monto del plan: ${dolares(orden.monto)}` : null,
    "",
    `Cliente: ${cliente.nombre}`,
    cliente.empresa ? `Empresa: ${cliente.empresa}` : null,
    `Cédula/RIF: ${cliente.documento}`,
    cliente.correo ? `Correo: ${cliente.correo}` : null,
    cliente.telefono ? `Teléfono: ${cliente.telefono}` : null,
    "",
    `Método: ${metodo.nombre}`,
    datos.get("banco") ? `Banco de origen: ${datos.get("banco")}` : null,
    `Referencia: ${datos.get("referencia")}`,
    `Fecha: ${datos.get("fecha")}`,
    `Monto pagado: ${metodo.moneda === "Bs" ? "Bs." : "$"} ${datos.get("monto")}`,
  ].filter((l) => l !== null);
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(lineas.join("\n"))}`;
}
