import { ErrorApi, MODO_DEMO, esperar, pedir } from "./api.js";
import { usuarioDemoActual } from "./autenticacion.js";
import { SUSCRIPCIONES_DEMO } from "../data/portalDemo.js";

/* ==================================================================
   PORTAL DE PAGOS — la cuenta del usuario con sesión

   La cuenta se pide SIN documento en la URL: el backend sabe quién es
   por la cookie de sesión. Así nadie puede ver las suscripciones de
   otro cambiando un número.

   CONTRATO:

     GET /portal/cuenta     (requiere sesión)
     200 → { suscripciones: [{
               id, producto, plan, ciclo,
               monto,          // USD, número
               estado,         // "activa" | "por-vencer" | "vencida" | "suspendida"
               vence,          // "AAAA-MM-DD"
             }] }
     401 → sin sesión o sesión vencida

   ⚠️ Una suscripción vencida bloquea el Panel, NUNCA este portal: el
   cliente atrasado tiene que poder entrar a pagar.
================================================================== */
export async function obtenerCuenta({ signal } = {}) {
  if (MODO_DEMO) {
    await esperar();
    if (signal?.aborted) throw new DOMException("Consulta cancelada", "AbortError");
    const usuario = usuarioDemoActual();
    if (!usuario) throw new ErrorApi(401, "sin-sesion");
    return { suscripciones: structuredClone(SUSCRIPCIONES_DEMO[usuario.id] ?? []) };
  }
  return pedir("/portal/cuenta", { signal });
}

/* POST /portal/pagos — reporta un pago. Queda PENDIENTE hasta que el
   equipo lo verifica en el banco y lo aprueba; aprobarlo es lo que
   renueva las suscripciones.
     201 → { id, estado: "pendiente" }
     409 → { codigo: "referencia-usada" }
     400 → { codigo: "suscripcion-invalida" | "datos-invalidos" }
   En el modo demostración no existe: el reporte sale por WhatsApp. */
export async function reportarPago({ metodo, referencia, fecha, monto, banco, suscripciones }) {
  return pedir("/portal/pagos", {
    metodo: "POST",
    cuerpo: { metodo, referencia, fecha, monto: String(monto).replace(",", "."), banco, suscripciones },
  });
}

/* "v", " 12.345.678 " → "V-12345678". Así se guarda en la base de
   datos: sin puntos, espacios ni guiones sueltos. */
export function normalizarDocumento(letra, numero) {
  const digitos = String(numero).replace(/\D/g, "");
  return `${String(letra).toUpperCase()}-${digitos}`;
}
