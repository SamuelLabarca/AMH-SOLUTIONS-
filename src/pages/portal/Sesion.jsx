import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../../servicios/autenticacion.js";

/* ==================================================================
   SESIÓN DEL PORTAL

   Un contexto con el usuario actual, compartido por todas las
   pantallas del portal. Vive SOLO dentro de /portal-de-pagos: el resto
   de la web no necesita saber quién eres, y así no se consulta la
   sesión en cada visita a la home.

   `usuario`: undefined mientras se comprueba, null sin sesión, o el
   objeto del usuario. Distinguir undefined de null evita que la
   pantalla de entrar parpadee antes de saber que ya había sesión.
================================================================== */
const ContextoSesion = createContext(null);

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {
    let vigente = true;
    auth
      .obtenerSesion()
      .then((u) => vigente && setUsuario(u))
      .catch(() => vigente && setUsuario(null));
    return () => {
      vigente = false;
    };
  }, []);

  // Devuelven el usuario: el checkout lo necesita para seguir con la compra.
  const iniciarSesion = useCallback(async (datos) => {
    const u = await auth.iniciarSesion(datos);
    setUsuario(u);
    return u;
  }, []);
  const registrar = useCallback(async (datos) => {
    const u = await auth.registrar(datos);
    setUsuario(u);
    return u;
  }, []);
  const cerrarSesion = useCallback(async () => {
    await auth.cerrarSesion();
    setUsuario(null);
  }, []);
  // La API respondió 401 a mitad de algo: la sesión venció.
  const sesionVencida = useCallback(() => setUsuario(null), []);

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, registrar, cerrarSesion, sesionVencida }),
    [usuario, iniciarSesion, registrar, cerrarSesion, sesionVencida],
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion() {
  const contexto = useContext(ContextoSesion);
  if (!contexto) throw new Error("useSesion tiene que usarse dentro de <ProveedorSesion>");
  return contexto;
}
