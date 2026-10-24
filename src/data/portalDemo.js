/* ==================================================================
   CUENTAS DE DEMOSTRACIÓN DEL PORTAL DE PAGOS

   Solo se usan mientras no exista la API (ver servicios/portalPagos.js).
   Tienen la MISMA forma que la respuesta del backend, con los datos ya
   enmascarados como los devolverá él. Son ficticias.
================================================================== */
export const CUENTAS_DEMO = {
  "V-12345678": {
    cliente: { nombre: "María G•••", documento: "V-12345678", correo: "m•••@gmail.com" },
    suscripciones: [
      {
        id: "sus-001",
        producto: "My Business Panel",
        plan: "Plan Empresa",
        ciclo: "Mensual",
        monto: 45,
        estado: "vencida",
        vence: "2026-10-15",
      },
      {
        id: "sus-002",
        producto: "My Business Panel",
        plan: "Sucursal adicional",
        ciclo: "Mensual",
        monto: 15,
        estado: "por-vencer",
        vence: "2026-10-30",
      },
    ],
  },
  "J-123456789": {
    cliente: { nombre: "Distribuidora E•••, C.A.", documento: "J-123456789", correo: "a•••@distribuidora.com" },
    suscripciones: [
      {
        id: "sus-003",
        producto: "My Business Panel",
        plan: "Plan Empresa",
        ciclo: "Anual",
        monto: 450,
        estado: "activa",
        vence: "2027-03-01",
      },
    ],
  },
};
