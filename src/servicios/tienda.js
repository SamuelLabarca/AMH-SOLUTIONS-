import { MODO_DEMO, pedir } from "./api.js";

/* ==================================================================
   TIENDA — catálogo, métodos de cobro y tasa BCV

   Lo que decide CUÁNTO y DÓNDE se paga viene de la API, que es lo que
   el equipo edita en el admin. Los textos de marketing (titulares,
   "incluye", fotos) siguen en data/contenido.js: no tienen riesgo y
   cambiarlos no debería requerir tocar la base de datos.

   CONTRATO (amh-api, todo público):
     GET /tienda/catalogo → { productos: [{ codigo, nombre, marca, iva,
                              opciones: [{ codigo, nombre, meses, precio, destacado }] }] }
     GET /pagos/metodos   → { metodos: [{ id, nombre, moneda, datos: [{ etiqueta, valor }] }] }
     GET /pagos/tasa      → { fecha, bs_por_usd } | 404 { codigo: "sin-tasa" }

   Cada consulta se hace UNA vez por visita (se guarda la promesa): la
   tienda, el checkout y el paso de pago comparten la misma respuesta.
================================================================== */
const cache = new Map();

function unaVez(ruta) {
  if (!cache.has(ruta)) {
    // Si falla, se olvida para que la próxima pantalla lo reintente.
    cache.set(ruta, pedir(ruta).catch((error) => (cache.delete(ruta), Promise.reject(error))));
  }
  return cache.get(ruta);
}

/* POST /tienda/ordenes — la compra (requiere sesión).
   Solo se manda QUÉ se compra: el precio lo pone el servidor.
     201/200 → { orden: { id, total, impuesto, iva, suscripcion, … } }
     400 → { codigo: "opcion-no-disponible" } */
export async function crearOrden({ producto, opcion }) {
  const { orden } = await pedir("/tienda/ordenes", { metodo: "POST", cuerpo: { producto, opcion } });
  return orden;
}

export const obtenerCatalogo = () => unaVez("/tienda/catalogo");
export const obtenerMetodos = () => unaVez("/pagos/metodos");
export const obtenerTasa = () => unaVez("/pagos/tasa");

/* Para los tests: vacía lo guardado. */
export function olvidarTienda() {
  cache.clear();
}

/* El producto de contenido.js con los precios de la API encima.

   - Las opciones salen en el orden y con el precio de la API.
   - Una opción que la API ya no trae (desactivada en el admin) se quita.
   - Una opción de la API sin textos locales no se muestra: no hay con qué
     pintarla bien. Se avisa por consola para que alguien añada sus textos.
   - El sello "destacado" lo decide la API (vacío = sin sello). */
export function aplicarPrecios(local, api) {
  const textos = new Map(local.pagos.map((p) => [p.id, p]));
  const pagos = api.opciones.flatMap((opcion) => {
    const base = textos.get(opcion.codigo);
    if (!base) {
      console.warn(`La opción "${opcion.codigo}" no tiene textos en contenido.js y no se muestra.`);
      return [];
    }
    return [{ ...base, meses: opcion.meses, precio: opcion.precio, destacado: opcion.destacado || undefined }];
  });
  return { ...local, pagos };
}

export { MODO_DEMO };
