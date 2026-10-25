import { ErrorApi } from "../../servicios/api.js";

export const BASE_PORTAL = "/portal-de-pagos";

/* Traduce un error de la API al mensaje que ve el cliente. `propios`
   cubre los códigos de cada pantalla; el resto tiene un mensaje común.
   Nunca se muestra el texto crudo del servidor: puede filtrar detalles
   internos. */
export function mensajeDeError(error, propios = {}) {
  if (error instanceof ErrorApi) {
    if (error.codigo && propios[error.codigo]) return propios[error.codigo];
    if (error.estado === 429) return "Demasiados intentos. Espera unos minutos y vuelve a probar.";
  }
  return "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";
}
