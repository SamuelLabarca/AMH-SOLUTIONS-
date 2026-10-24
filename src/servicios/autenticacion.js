import { ErrorApi, MODO_DEMO, esperar, pedir } from "./api.js";
import { USUARIOS_DEMO } from "../data/portalDemo.js";

/* ==================================================================
   AUTENTICACIÓN DEL PORTAL DE PAGOS

   Una sola identidad: el usuario con el que se entra aquí es el mismo
   de My Business Panel. Se entra con CORREO y contraseña; la cédula o
   RIF se pide al registrarse pero no sirve para entrar, porque es un
   dato público (sale en cualquier factura).

   CONTRATO que tiene que cumplir el backend:

     GET    /auth/sesion                   200 { usuario } | 401
     POST   /auth/sesion                   { correo, contrasena }
                                           200 { usuario } + cookie | 401
     DELETE /auth/sesion                   204 (borra la cookie)
     POST   /auth/registro                 { nombre, documento, correo,
                                             telefono, contrasena }
                                           201 { usuario } + cookie
                                           409 { codigo: "cuenta-existente" }
     POST   /auth/recuperacion             { correo }
                                           202 SIEMPRE, exista o no
     POST   /auth/recuperacion/confirmar   { token, contrasena }
                                           204 | 400 { codigo: "token-invalido" }

     usuario = { id, nombre, documento, correo }

   REQUISITOS que el backend NO puede saltarse:
   - Contraseñas con hash lento (argon2id o bcrypt), nunca en claro.
   - Límite de intentos por IP y por correo en /auth/sesion y
     /auth/recuperacion: sin él, la contraseña se adivina a fuerza bruta.
   - La recuperación responde IGUAL exista o no el correo. Si dijera
     "ese correo no existe", serviría para averiguar quién es cliente.
   - El token de recuperación: aleatorio, de un solo uso, vence en
     30 minutos y se guarda hasheado. Al usarlo se cierran las demás
     sesiones del usuario.
   - La recuperación es SOLO por correo: es el único canal que el
     usuario demostró controlar al registrarse.
================================================================== */

export const MINIMO_CONTRASENA = 8;

/* Devuelve el problema de la contraseña, o null si vale. La regla es
   la misma que valida el backend; esta es solo para avisar antes. */
export function validarContrasena(contrasena) {
  if (contrasena.length < MINIMO_CONTRASENA) return `Debe tener al menos ${MINIMO_CONTRASENA} caracteres.`;
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(contrasena) || !/\d/.test(contrasena)) return "Debe combinar letras y números.";
  return null;
}

export async function obtenerSesion() {
  if (MODO_DEMO) return demo.obtenerSesion();
  try {
    const { usuario } = await pedir("/auth/sesion");
    return usuario;
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 401) return null;
    throw error;
  }
}

export async function iniciarSesion({ correo, contrasena }) {
  if (MODO_DEMO) return demo.iniciarSesion(correo, contrasena);
  const { usuario } = await pedir("/auth/sesion", { metodo: "POST", cuerpo: { correo, contrasena } });
  return usuario;
}

export async function cerrarSesion() {
  if (MODO_DEMO) return demo.cerrarSesion();
  await pedir("/auth/sesion", { metodo: "DELETE" });
}

export async function registrar(datos) {
  if (MODO_DEMO) return demo.registrar(datos);
  const { usuario } = await pedir("/auth/registro", { metodo: "POST", cuerpo: datos });
  return usuario;
}

/* Con la API real devuelve null: el enlace solo llega por correo. En
   el modo demostración devuelve el enlace para poder probar el flujo
   sin servidor de correo. */
export async function solicitarRecuperacion(correo) {
  if (MODO_DEMO) return demo.solicitarRecuperacion(correo);
  await pedir("/auth/recuperacion", { metodo: "POST", cuerpo: { correo } });
  return null;
}

export async function restablecerContrasena({ token, contrasena }) {
  if (MODO_DEMO) return demo.restablecer(token, contrasena);
  await pedir("/auth/recuperacion/confirmar", { metodo: "POST", cuerpo: { token, contrasena } });
}

/* ------------------------------------------------------------------
   SIMULACIÓN (solo MODO_DEMO)

   Usuarios en memoria y la sesión en sessionStorage, para que una
   recarga no te saque. Nada de esto existe con la API real.
------------------------------------------------------------------ */
const CLAVE_SESION = "amh-demo-sesion";
const CLAVE_USUARIOS = "amh-demo-usuarios";

const almacen = {
  leer(clave) {
    try {
      return JSON.parse(sessionStorage.getItem(clave));
    } catch {
      return null;
    }
  },
  guardar(clave, valor) {
    try {
      if (valor === null) sessionStorage.removeItem(clave);
      else sessionStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Navegación privada o almacenamiento bloqueado: la demo sigue en memoria.
    }
  },
};

let usuarios = almacen.leer(CLAVE_USUARIOS) ?? [...USUARIOS_DEMO];
const tokens = new Map();

const publico = ({ id, nombre, documento, correo }) => ({ id, nombre, documento, correo });
const mismoCorreo = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function usuarioDemoActual() {
  const id = almacen.leer(CLAVE_SESION);
  return usuarios.find((u) => u.id === id) ?? null;
}

/* Para los tests: vuelve al estado inicial. */
export function reiniciarDemo() {
  usuarios = [...USUARIOS_DEMO];
  tokens.clear();
  almacen.guardar(CLAVE_SESION, null);
  almacen.guardar(CLAVE_USUARIOS, null);
}

const demo = {
  async obtenerSesion() {
    await esperar(150);
    const usuario = usuarioDemoActual();
    return usuario ? publico(usuario) : null;
  },

  async iniciarSesion(correo, contrasena) {
    await esperar();
    const usuario = usuarios.find((u) => mismoCorreo(u.correo, correo));
    // Mismo error si falla el correo o la contraseña: no se revela cuál.
    if (!usuario || usuario.contrasena !== contrasena) throw new ErrorApi(401, "credenciales-invalidas");
    almacen.guardar(CLAVE_SESION, usuario.id);
    return publico(usuario);
  },

  async cerrarSesion() {
    await esperar(150);
    almacen.guardar(CLAVE_SESION, null);
  },

  async registrar({ nombre, documento, correo, telefono, contrasena }) {
    await esperar();
    if (usuarios.some((u) => mismoCorreo(u.correo, correo) || u.documento === documento)) {
      throw new ErrorApi(409, "cuenta-existente");
    }
    const usuario = { id: `usr-${Date.now()}`, nombre, documento, correo: correo.trim().toLowerCase(), telefono, contrasena };
    usuarios = [...usuarios, usuario];
    almacen.guardar(CLAVE_USUARIOS, usuarios);
    almacen.guardar(CLAVE_SESION, usuario.id);
    return publico(usuario);
  },

  async solicitarRecuperacion(correo) {
    await esperar();
    const usuario = usuarios.find((u) => mismoCorreo(u.correo, correo));
    if (!usuario) return null;
    const token = crypto.randomUUID();
    tokens.set(token, { usuarioId: usuario.id, vence: Date.now() + 30 * 60 * 1000 });
    return `/portal-de-pagos/restablecer?token=${token}`;
  },

  async restablecer(token, contrasena) {
    await esperar();
    const registro = tokens.get(token);
    if (!registro || registro.vence < Date.now()) throw new ErrorApi(400, "token-invalido");
    tokens.delete(token); // un solo uso
    usuarios = usuarios.map((u) => (u.id === registro.usuarioId ? { ...u, contrasena } : u));
    almacen.guardar(CLAVE_USUARIOS, usuarios);
    almacen.guardar(CLAVE_SESION, null); // cierra la sesión abierta
  },
};
