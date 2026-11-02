/* ------------------------------------------------------------------
   DINERO: formato y cálculos de precios

   Funciones puras, sin React: se pueden usar en cualquier pantalla y
   probar sin montar componentes. Solo MUESTRAN o ESTIMAN; el importe que
   se cobra lo fija siempre el backend al crear la orden.
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

/* Bolívares con el formato de aquí, siempre con dos decimales:
   "Bs 28.017,50". `conSimbolo` en false da solo el número (para la tasa). */
export function bolivares(n, conSimbolo = true) {
  const numero = n.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return conSimbolo ? `Bs ${numero}` : numero;
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
