/* ==================================================================
   CLIENTE DE LA API

   Todas las llamadas al backend pasan por `pedir`. Así el formato de
   errores, las cabeceras y la cookie de sesión se deciden en un solo
   sitio.

   - Con `VITE_API_URL` definida (archivo .env): habla con la API.
   - Sin ella: MODO_DEMO, y cada servicio responde con su simulación.

   ⚠️ SESIÓN EN COOKIE, NO EN localStorage. El backend devuelve la sesión
   en una cookie `HttpOnly; Secure; SameSite=Lax`. JavaScript no puede
   leerla, así que un script inyectado (XSS) no puede robarla. Por eso
   `credentials: "include"` y por eso aquí no se guarda ningún token.
================================================================== */
const API_URL = import.meta.env.VITE_API_URL;

export const MODO_DEMO = !API_URL;

/* Un error de la API con su código HTTP y, si lo trae, un `codigo`
   de negocio ("correo-registrado", "token-invalido"…) para que la
   pantalla elija el mensaje sin depender del texto. */
export class ErrorApi extends Error {
  constructor(estado, codigo, mensaje) {
    super(mensaje ?? `La API respondió ${estado}`);
    this.name = "ErrorApi";
    this.estado = estado;
    this.codigo = codigo ?? null;
  }
}

export async function pedir(ruta, { metodo = "GET", cuerpo, signal } = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    signal,
  });

  if (respuesta.status === 204) return null;
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, datos?.codigo, datos?.mensaje);
  return datos;
}

/* Simula la latencia de la red en el modo demostración, para que los
   estados "cargando" se vean igual que con la API real. */
export function esperar(ms = 400) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}
