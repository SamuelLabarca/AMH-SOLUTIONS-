import { CUENTAS_DEMO } from "../data/portalDemo.js";

/* ==================================================================
   PORTAL DE PAGOS — acceso a la API

   Es el ÚNICO sitio que sabe de dónde salen los datos. La página
   llama a `consultarCuenta` y no sabe si responde el backend o la
   demostración, así que el día que exista la API no se toca nada más.

   - Con `VITE_API_URL` definida (archivo .env): pide a la API.
   - Sin ella: responde con las cuentas de `data/portalDemo.js`.

   CONTRATO que tiene que cumplir el backend:

     GET {VITE_API_URL}/portal/cuentas/{documento}     (ej. V-12345678)

     200 → {
       cliente: { nombre, documento, correo },
       suscripciones: [{
         id, producto, plan, ciclo,
         monto,                    // USD, número
         estado,                   // "activa" | "por-vencer" | "vencida" | "suspendida"
         vence,                    // "AAAA-MM-DD"
       }]
     }
     404 → no hay cliente con ese documento

   ⚠️ SEGURIDAD: cualquiera puede escribir una cédula ajena. Por eso el
   backend devuelve el nombre y el correo ENMASCARADOS ("Distribuidora
   E•••", "c•••@gmail.com"), limita las consultas por IP y nunca expone
   datos que sirvan para suplantar al cliente. Pagar la cuenta de otro
   no es un riesgo; leer sus datos sí.
================================================================== */
const API_URL = import.meta.env.VITE_API_URL;

export const MODO_DEMO = !API_URL;

export class CuentaNoEncontrada extends Error {
  constructor(documento) {
    super(`No hay una cuenta con el documento ${documento}`);
    this.name = "CuentaNoEncontrada";
  }
}

/* "v", " 12.345.678 " → "V-12345678". Así se escribe en la base de
   datos y así se compara: sin puntos, espacios ni guiones sueltos. */
export function normalizarDocumento(letra, numero) {
  const digitos = String(numero).replace(/\D/g, "");
  return `${String(letra).toUpperCase()}-${digitos}`;
}

export async function consultarCuenta(documento, { signal } = {}) {
  if (MODO_DEMO) return consultarDemo(documento, signal);

  const respuesta = await fetch(`${API_URL}/portal/cuentas/${encodeURIComponent(documento)}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (respuesta.status === 404) throw new CuentaNoEncontrada(documento);
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`);
  return respuesta.json();
}

/* Simula la latencia de la red para que el estado "consultando" se vea
   igual que con la API real. */
function consultarDemo(documento, signal) {
  return new Promise((resolver, rechazar) => {
    const id = setTimeout(() => {
      const cuenta = CUENTAS_DEMO[documento];
      if (cuenta) resolver(structuredClone(cuenta));
      else rechazar(new CuentaNoEncontrada(documento));
    }, 450);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      rechazar(new DOMException("Consulta cancelada", "AbortError"));
    });
  });
}
