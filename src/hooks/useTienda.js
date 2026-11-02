import { useEffect, useState } from "react";
import { METODOS_PAGO, TIENDA } from "../data/contenido.js";
import { MODO_DEMO, aplicarPrecios, obtenerCatalogo, obtenerMetodos, obtenerTasa } from "../servicios/tienda.js";

/* ------------------------------------------------------------------
   HOOKS DE LA TIENDA

   Los tres arrancan con lo que hay en contenido.js (así la página se
   pinta al instante, sin huecos mientras carga) y lo reemplazan en
   cuanto responde la API. En el modo demostración no piden nada.

   Si la API falla se quedan con lo local. Es aceptable para MOSTRAR;
   el precio que se cobra lo fija siempre el backend al crear la orden.
------------------------------------------------------------------ */

/* El producto de la tienda con sus opciones de pago y precios. */
export function useProductoTienda() {
  const local = TIENDA.productos[0];
  const [estado, setEstado] = useState({ producto: local, iva: TIENDA.iva });

  useEffect(() => {
    if (MODO_DEMO) return;
    let vigente = true;
    obtenerCatalogo()
      .then(({ productos }) => {
        const api = productos.find((p) => p.codigo === local.id);
        if (vigente && api) setEstado({ producto: aplicarPrecios(local, api), iva: api.iva });
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, [local]);

  return estado;
}

/* Los métodos de cobro activos con sus datos (banco, teléfono…). */
export function useMetodosPago() {
  const [metodos, setMetodos] = useState(METODOS_PAGO);

  useEffect(() => {
    if (MODO_DEMO) return;
    let vigente = true;
    obtenerMetodos()
      .then((r) => vigente && r.metodos.length > 0 && setMetodos(r.metodos))
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  return metodos;
}

/* La tasa BCV vigente: { fecha, bs_por_usd } o null si no hay. */
export function useTasaBcv() {
  const [tasa, setTasa] = useState(null);

  useEffect(() => {
    if (MODO_DEMO) return;
    let vigente = true;
    obtenerTasa()
      .then((t) => vigente && setTasa(t))
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  return tasa;
}
