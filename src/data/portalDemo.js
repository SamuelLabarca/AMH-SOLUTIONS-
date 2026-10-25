/* ==================================================================
   DATOS DE DEMOSTRACIÓN DEL PORTAL DE PAGOS

   Solo se usan mientras no exista la API (MODO_DEMO en servicios/api.js).
   Son FICTICIOS. Las contraseñas van en claro porque esto no es una
   base de datos: el backend real guarda solo el hash (argon2 o bcrypt)
   y jamás devuelve la contraseña ni el hash.
================================================================== */
export const USUARIOS_DEMO = [
  {
    id: "usr-001",
    nombre: "María González",
    documento: "V-12345678",
    correo: "maria@demo.com",
    telefono: "+58 412 1234567",
    contrasena: "Demo1234",
  },
  {
    id: "usr-002",
    nombre: "Distribuidora Ejemplo, C.A.",
    documento: "J-123456789",
    correo: "admin@distribuidora.com",
    telefono: "+58 414 7654321",
    contrasena: "Demo1234",
  },
];

/* Suscripciones de cada usuario, con la misma forma que devuelve
   GET /portal/cuenta. Un usuario recién registrado no tiene ninguna. */
export const SUSCRIPCIONES_DEMO = {
  "usr-001": [
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
  "usr-002": [
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
};
