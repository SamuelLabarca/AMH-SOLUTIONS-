/* ------------------------------------------------------------------
   CONTENIDO DE LA PÁGINA

   Todo lo que algún día vendrá del backend Node.js vive aquí, no en el
   markup (CLAUDE.md §9). Cuando exista la API, estos arrays se sustituyen
   por la respuesta y los componentes no se tocan.
------------------------------------------------------------------ */

/* Banda de prueba social bajo el hero. El dato va en negro y bold, la
   descripción en gris: el contraste es lo que hace que se lean como
   métricas y no como texto corrido. */
export const METRICAS = [
  { dato: "+500", etiqueta: "empresas confían en nosotros" },
  { dato: "99.9%", etiqueta: "de disponibilidad garantizada" },
  { dato: "24/7", etiqueta: "soporte técnico en español" },
  { dato: "100%", etiqueta: "de tus datos cifrados" },
];

/* Sección "Nosotros". Los tres pilares que sostienen el discurso. */
export const PILARES = [
  {
    id: "cercania",
    icono: "manos",
    titulo: "Cercanía real",
    texto:
      "No somos un proveedor al otro lado de un formulario. Acompañamos la implementación desde dentro, con gente que conoce tu operación y responde en tu idioma y tu horario.",
  },
  {
    id: "ingenieria",
    icono: "circuito",
    titulo: "Ingeniería propia",
    texto:
      "Construimos nuestro propio producto de punta a punta. Eso nos permite adaptarlo a lo que tu negocio necesita de verdad, en lugar de pedirte que te adaptes tú al software.",
  },
  {
    id: "duradero",
    icono: "escudo",
    titulo: "Hecho para durar",
    texto:
      "Cada decisión técnica se toma pensando en los próximos diez años: datos cifrados, respaldos automáticos y una arquitectura que crece contigo sin rehacerse.",
  },
];

/* Sección "Servicios". El orden importa: es el recorrido natural de un
   negocio que se digitaliza, de vender a controlar a decidir. */
export const SERVICIOS = [
  {
    id: "crm",
    eyebrow: "CRECIMIENTO ACELERADO",
    icono: "embudo",
    titulo: "CRM: domina tu embudo de ventas",
    texto:
      "No pierdas ni una sola oportunidad. Centralizamos cada interacción con tus clientes para que cierres tratos más rápido y atiendas con un nivel de detalle que se nota.",
    puntos: [
      "Visión 360° de cada cliente y prospecto.",
      "Automatización de tareas para tu equipo comercial.",
    ],
  },
  {
    id: "inventario",
    eyebrow: "EFICIENCIA OPERATIVA",
    icono: "cajas",
    titulo: "Inventario: control total en tiempo real",
    texto:
      "Elimina el caos de tus almacenes. Gestiona miles de SKUs en múltiples ubicaciones con precisión, sin quedarte sin stock ni inmovilizar dinero en mercancía parada.",
    puntos: [
      "Trazabilidad completa desde la compra hasta la venta.",
      "Predicción de demanda basada en tus propios datos.",
    ],
  },
  {
    id: "finanzas",
    eyebrow: "CLARIDAD FINANCIERA",
    icono: "grafica",
    titulo: "Finanzas: decisiones basadas en rentabilidad",
    texto:
      "Transforma tus números en estrategia. Una radiografía instantánea de la salud de tu negocio, con reportes que te dicen dónde estás ganando y dónde puedes optimizar.",
    puntos: [
      "Dashboards interactivos de ingresos y egresos.",
      "Cierre de mes en minutos, no en días.",
    ],
  },
  {
    id: "soporte",
    eyebrow: "ACOMPAÑAMIENTO",
    icono: "soporte",
    titulo: "Implementación y soporte continuo",
    texto:
      "Migramos tus datos, formamos a tu equipo y seguimos ahí después del lanzamiento. La herramienta solo sirve si la gente la usa, y de eso nos ocupamos nosotros.",
    puntos: [
      "Migración de tus datos actuales sin cortar la operación.",
      "Un técnico asignado que conoce tu cuenta.",
    ],
  },
];

/* Planes. Viven en la página /producto, no en la home. */
export const PLANES = [
  {
    id: "emprendedor",
    nombre: "Emprendedor",
    precio: 29,
    resumen: "Para negocios que están ordenando su operación por primera vez.",
    destacado: false,
    incluye: [
      "Hasta 3 usuarios",
      "CRM y facturación",
      "1.000 productos en inventario",
      "Soporte por correo",
    ],
  },
  {
    id: "profesional",
    nombre: "Profesional",
    precio: 79,
    resumen: "Para equipos que ya venden y necesitan control y visibilidad.",
    destacado: true,
    incluye: [
      "Hasta 15 usuarios",
      "Todo lo de Emprendedor",
      "Inventario multi-almacén ilimitado",
      "Reportes financieros avanzados",
      "Soporte prioritario 24/7",
    ],
  },
  {
    id: "corporativo",
    nombre: "Corporativo",
    precio: 189,
    resumen: "Para operaciones grandes con requisitos propios.",
    destacado: false,
    incluye: [
      "Usuarios ilimitados",
      "Todo lo de Profesional",
      "Integraciones a medida y API",
      "Servidor dedicado",
      "Técnico asignado a tu cuenta",
    ],
  },
];

/* Enlaces de la barra de navegación. `ruta` distingue los que van a otra
   página de los que son un salto dentro de la home. */
export const NAVEGACION = [
  { etiqueta: "Inicio", destino: "/", ruta: true },
  { etiqueta: "Nosotros", destino: "/#nosotros", ruta: false },
  { etiqueta: "Servicios", destino: "/#servicios", ruta: false },
  { etiqueta: "Producto y planes", destino: "/producto", ruta: true },
];
