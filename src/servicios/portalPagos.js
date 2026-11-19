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

/* Lo que usan <PasoPago> desde el portal y desde el checkout: arma el
   reporte con los datos del formulario y traduce los errores de la API
   al mensaje que ve el cliente. Lanza un Error con ese mensaje; si la
   sesión venció, el error lleva `sinSesion: true`. */
export async function reportarFormulario(metodo, datos, suscripciones) {
  try {
    await reportarPago({
      metodo,
      referencia: String(datos.get("referencia")).trim(),
      fecha: datos.get("fecha"),
      monto: datos.get("monto"),
      banco: datos.get("banco") ?? "",
      suscripciones,
    });
  } catch (e) {
    const mensajes = {
      "referencia-usada": "Esa referencia ya fue reportada. Si crees que es un error, escríbenos.",
      "datos-invalidos": "Revisa la referencia, la fecha y el monto.",
      "suscripcion-invalida": "No pudimos asociar el pago a tu plan. Recarga la página.",
      "metodo-no-disponible": "Ese método de pago ya no está disponible. Elige otro.",
    };
    const error = new Error(mensajes[e.codigo] ?? "No pudimos enviar tu reporte. Inténtalo de nuevo.");
    error.sinSesion = e.estado === 401;
    throw error;
  }
}

/* "v", " 12.345.678 " → "V-12345678". Así se guarda en la base de
   datos: sin puntos, espacios ni guiones sueltos. */
export function normalizarDocumento(letra, numero) {
  const digitos = String(numero).replace(/\D/g, "");
  return `${String(letra).toUpperCase()}-${digitos}`;
}
