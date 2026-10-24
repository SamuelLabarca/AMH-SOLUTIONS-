/* ------------------------------------------------------------------
   CONTENIDO DE LA PÁGINA

   Todo lo que algún día vendrá del backend Node.js vive aquí, no en el
   markup (CLAUDE.md §9). Cuando exista la API, estos arrays se sustituyen
   por la respuesta y los componentes no se tocan.
------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   TARJETAS FLOTANTES DEL HERO

   Las tres pastillas de cristal que van sobre la foto, a la derecha.
   Son el único sitio de la página donde aparece un gráfico, y por eso
   `visual` no es un icono: nombra una mini-ilustración distinta para
   cada una (ver `VISUALES` en Hero.jsx).

   Son datos de marketing, no medidas reales: cámbialos aquí cuando
   haya cifras de verdad y el hero se actualiza solo.
------------------------------------------------------------------ */
export const TARJETAS_HERO = [
  { id: "tiempo", visual: "aguja", titulo: "Menos tiempo,\nmejor productividad" },
  { id: "resultados", visual: "barras", titulo: "Mayores\nresultados" },
  /* Era "Usuarios activos · 50 · +5% de crecimiento": una cifra
     inventada. El 7 oct 2026 pasó por "Módulos conectados · 5" y se
     veía artificial; ahora es un AVISO como los del sistema, que cuenta
     algo que de verdad pasa: la venta descuenta stock y entra a caja. */
  {
    id: "venta",
    tipo: "aviso",
    visual: "check",
    titulo: "Venta registrada",
    pie: "Inventario y caja actualizados",
    hora: "Ahora",
  },
];

/* ------------------------------------------------------------------
   SERVICIOS  (la sección de la home, bajo el hero)

   Lo que AMH Solutions vende como empresa. OJO: no confundir con
   `MODULOS`, que son las cuatro partes de My Business Panel y viven en
   /producto. Son dos listas distintas a propósito.

   Cada servicio es una tarjeta con la foto a sangre. `imagen` es el
   nombre base dentro de `public/img/`: el componente compone a partir
   de él `-sm.webp` y `.webp`, que es lo que genera `npm run imagenes`.

   Los textos van DELIBERADAMENTE parejos en longitud (~210 caracteres).
   Si uno se dispara, su tarjeta crece y rompe la fila.
------------------------------------------------------------------ */
export const SERVICIOS = [
  {
    id: "web",
    titulo: "Desarrollo web",
    imagen: "desarrollo-web",
    alt: "Portátil sobre un escritorio mostrando un sitio web en desarrollo",
    texto:
      "Sitios modernos, rápidos y optimizados para convertir visitantes en clientes. Tu presencia digital con la velocidad, la seguridad y la elegancia que tu marca merece.",
  },
  {
    id: "automatizaciones",
    titulo: "Automatizaciones",
    imagen: "automatizaciones",
    alt: "Informes impresos con gráficos y paneles de métricas sobre la mesa",
    texto:
      "Elimina las tareas repetitivas y conecta tus herramientas en un flujo automático. Reduce errores humanos, ahorra cientos de horas y haz que tu empresa funcione 24/7.",
  },
  {
    id: "medida",
    titulo: "Software a la medida",
    imagen: "software-medida",
    alt: "Equipo de desarrolladores revisando un sistema frente al monitor",
    texto:
      "Sistemas diseñados en exclusiva para la lógica de tu negocio. Digitalizamos y centralizamos tus operaciones en una plataforma intuitiva que se adapta a ti, y no al revés.",
  },
  {
    id: "chatbots",
    titulo: "Chatbots",
    imagen: "chatbots",
    alt: "Persona escribiendo un mensaje en el móvil",
    texto:
      "Atiende a tus clientes al instante en WhatsApp o en tu web, sin importar la hora. Automatiza ventas, preguntas frecuentes y agendamiento sin perder el toque humano.",
  },
];

/* ------------------------------------------------------------------
   BUSINESS PANEL  (la tarjeta de la home, bajo Servicios)

   Es un ADELANTO, no la ficha del producto: cuenta qué es, nombra los
   módulos y da tres ventajas de un vistazo para que la gente pase a
   /producto, que es donde está el detalle. Si aquí crece el texto, la
   tarjeta deja de leerse como una invitación y empieza a competir con
   esa página.

   `modulos` son solo etiquetas; la descripción de cada uno vive en
   `MODULOS`, más abajo.
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   POR QUÉ ELEGIRNOS  (última sección de la home)

   Sale de un diseño en Canva. `forma` elige la silueta azul que va
   detrás de cada imagen (ver FORMAS en PorQueElegirnos.jsx) e `imagen`
   es el PNG transparente de public/img/, optimizado con
   `npm run imagenes` (perfil "objeto").

   Textos parejos (~130 caracteres): si uno se alarga, su fila crece y
   la línea punteada deja de verse uniforme.
------------------------------------------------------------------ */
export const VENTAJAS = [
  {
    id: "ahorro",
    titulo: "Ahorra tiempo y dinero",
    texto:
      "Automatizamos las tareas repetitivas para que tu equipo produzca más con los mismos recursos y reduzcas costos operativos desde el primer mes.",
    imagen: "alcancia",
    alt: "Alcancía de cristal llena de monedas",
    forma: "muesca",
  },
  {
    id: "medida",
    titulo: "Hecho a tu medida",
    texto:
      "Adaptamos cada sistema a la forma en que trabaja tu empresa, sin obligarte a cambiar tus procesos para encajar en un software genérico.",
    imagen: "puzzle",
    alt: "Piezas de rompecabezas de madera encajando",
    forma: "paralelogramo",
  },
  {
    id: "soporte",
    titulo: "Soporte cercano y real",
    texto:
      "Te acompañamos en la implementación y después de ella, con personas que conocen tu negocio y responden en tu idioma y tu horario.",
    imagen: "auriculares",
    alt: "Auriculares de diadema",
    forma: "flor",
  },
];

export const PANEL = {
  eyebrow: "Nuestro sistema",
  titulo: "My Business Panel",
  texto:
    "El sistema que centraliza la gestión de tu empresa. Clientes, inventario y números en un solo lugar, conectados entre sí y siempre al día.",
  modulos: ["Recursos Humanos", "Inventario", "Compras", "Finanzas", "Facturación"],
  ventajas: [
    "Todo tu negocio en un solo panel",
    "Acceso desde cualquier dispositivo",
    "Datos cifrados y respaldos automáticos",
  ],
};

/* ------------------------------------------------------------------
   MY BUSINESS PANEL POR DENTRO (/producto)

   El eje de la página es un contraste: la competencia vende nómina,
   facturación e inventario como sistemas SEPARADOS, y My Business Panel
   lo trae todo en uno. Todo lo de abajo está al servicio de esa idea.
------------------------------------------------------------------ */

/* La foto del hero de /producto. `imagen` es el nombre del WebP en
   public/img, sin extensión; en null se ve el degradado azul. El nombre
   tiene que empezar por "hero" para que `npm run imagenes` la saque a
   1920px (perfil hero) y no a 900 (perfil tarjeta). */
export const HERO_PRODUCTO = {
  /* Entre comillas y SIN extensión: la página compone ella misma
     `hero-producto.webp` y `hero-producto-sm.webp`. */
  imagen: "hero-producto",
  alt: "Persona trabajando en un portátil sobre una mesa",
};

/* "¿Qué ganas con My Business Panel?" — los beneficios, en /producto.

   ⚠️ Cada beneficio sale de una función REAL del sistema (la lista que
   dio Samuel). No hay cifras inventadas: si un día hay datos de clientes
   ("cierran el mes en X horas"), es aquí donde entran.

   `destacado` es la tarjeta grande y blanca; `lista`, las de cristal. La
   ÚLTIMA de la lista se pinta ancha, a lo largo de toda la fila. */
export const BENEFICIOS = {
  eyebrow: "Beneficios",
  titulo: "Menos sistemas, menos errores, más control",
  texto:
    "Lo que cambia en tu día a día cuando ventas, almacén, compras, nómina y finanzas dejan de vivir en programas distintos.",
  destacado: {
    cifra: "5 en 1",
    titulo: "Cinco módulos. Un solo acceso.",
    texto:
      "Una contraseña, una suscripción y los mismos datos para todo el equipo. Se acabó preguntar cuál es la cifra buena.",
  },
  lista: [
    {
      icono: "rayo",
      titulo: "Sin cargar dos veces",
      texto:
        "Una venta descuenta el inventario y entra al flujo de caja en el mismo momento. Nadie la vuelve a teclear.",
    },
    {
      icono: "ley",
      titulo: "Nómina al día con la ley",
      texto:
        "Los parámetros de la LOTTT con su vigencia y su fuente. Cuando cambian, la siguiente nómina ya sale bien.",
    },
    {
      icono: "cambio",
      /* Antes: "Tasas siempre a mano", con tasa activa y pasiva
         actualizadas. Se quitó: no hay API del BCV y se decidió cargar
         la tasa A MANO (menos errores). Aquí se cuenta como lo que es:
         tú la fijas y el sistema la usa en todo. */
      titulo: "Tú fijas la tasa del día",
      texto:
        "Cargas la tasa BCV una vez y el sistema la usa en cada cálculo. Sin depender de una página externa que falle o se retrase.",
    },
    {
      icono: "campana",
      titulo: "Te avisa antes",
      texto:
        "Pagos a proveedores por vencer y contratos que terminan: lo ves venir, no te enteras tarde.",
    },
    {
      icono: "grafica",
      titulo: "Decide con números reales",
      texto:
        "Flujo de caja, rentabilidad, lo que te deben y lo que debes, alimentados por la operación de cada día. Sin hojas de cálculo paralelas.",
    },
  ],
};

/* "Nos adaptamos al tamaño de tu negocio" — los tres tamaños de
   cliente, en /producto, debajo de Beneficios.

   Formato de la sección de Gálac: cada perfil es un ICONO con su nombre
   y, al pasar el ratón (o tocar), se convierte en una tarjeta azul con
   `texto` y un botón.

   ⚠️ Todavía NO hay paquetes definidos. Los textos hablan de lo que más
   usa cada tamaño (funciones REALES de los módulos), sin límites ni
   precios. Cuando el equipo decida los límites (sucursales, usuarios,
   empleados, soporte…), van aquí y en el cuadro comparativo. */
export const CLIENTES = {
  /* El título va en dos partes: `resaltado` se pinta en azul. */
  titulo: "Nos adaptamos al",
  resaltado: "tamaño de tu negocio",
  texto: "El sistema es el mismo para todos. Te ayudamos a elegir cuánto de él necesitas.",
  perfiles: [
    {
      id: "emprendedor",
      nombre: "Emprendedor",
      icono: "tienda",
      texto:
        "Para empezar con orden: factura con el IVA calculado, controla tu inventario y sabe cuánto ganas desde el primer día.",
    },
    {
      id: "pyme",
      nombre: "Pyme",
      icono: "edificio",
      texto:
        "Para crecer sin perder el control: varias sucursales con sus almacenes, nómina con la LOTTT y alertas de pago a proveedores.",
    },
    {
      id: "grandes",
      nombre: "Grandes empresas",
      icono: "corporativo",
      texto:
        "Para operar a escala: varias filiales, contratos y liquidaciones auditables y cada movimiento de inventario con su historial.",
    },
  ],
};

/* Los cinco módulos de My Business Panel. Solo los usa /producto, en la
   sección "Conoce nuestros módulos" (pestañas con foto a la izquierda).

   ⚠️ NO confundir con SERVICIOS (los servicios de AMH, en la home).

   EL ORDEN es el de las pestañas, de izquierda a derecha, y sigue el
   recorrido del dinero: se vende (POS), se controla lo que hay
   (Inventario), se repone (Compras), se paga a la gente (RRHH) y se
   mira el resultado (Finanzas).

   Cada módulo lleva:
     · `general`   — qué es, en una frase larga. Para quien no sabe nada.
     · `detalle`   — cómo funciona por dentro. Para quien ya se lo imagina.
     · `destacados`— tres o cuatro cosas concretas, en lista.
     · `enCorto`   — qué te resuelve, en cinco palabras y hablándote a
                     ti. Lo usa la banda "En cualquier forma de pago"
                     de /tienda.
     · `imagen`    — nombre del WebP en public/img (sin extensión). Si es
                     null, la sección pinta un hueco con lo que va ahí.
     · `forma`     — la silueta BLANCA que recorta la imagen (FORMAS, en
                     Producto.jsx). Cada una va elegida para su recorte:
                     donde la foto viene cortada, la forma tiene un borde
                     recto que la recibe. */
export const MODULOS = [
  {
    id: "pos",
    nombre: "Punto de venta",
    icono: "recibo",
    enCorto: "Cobras y facturas en segundos",
    imagen: "modulo-pos",
    forma: "ticket",
    alt: "Cliente pagando con tarjeta en el punto de venta de una tienda",
    general:
      "El punto de venta es donde se cobra. Emite la factura con todos los datos fiscales y el IVA calculado, en segundos y sin plantillas aparte.",
    detalle:
      "Cada venta descuenta al momento el stock del piso de venta de su sucursal y entra sola al flujo de caja. Si es a crédito, pasa a cuentas por cobrar. Nadie tiene que volver a cargarla en otro sistema.",
    destacados: [
      "Facturas con todos los datos que exige la normativa",
      "IVA calculado en cada línea",
      "Descuenta inventario en el mismo momento de la venta",
      "Ventas a crédito directo a cuentas por cobrar",
    ],
  },
  {
    id: "inventario",
    nombre: "Inventario",
    icono: "cajas",
    enCorto: "Sabes qué tienes y dónde",
    imagen: "modulo-inventario",
    forma: "hexagono",
    alt: "Estanterías de un almacén con cajas de mercancía",
    general:
      "Sabe en todo momento qué tienes, cuánto y dónde. Cada producto con su precio, variantes, lote y stock total, en todos tus almacenes.",
    detalle:
      "Al crear una sucursal se generan solos su bodega auxiliar y su piso de venta. Las transferencias entre ellos quedan registradas con origen, destino, líneas, unidades y fecha, y si el conteo físico no cuadra, reportas la discrepancia y queda en el historial.",
    destacados: [
      "Búsqueda por SKU o ID y filtros por stock",
      "Almacenes y pisos de venta por sucursal",
      "Transferencias con trazabilidad completa",
      "Historial de discrepancias de conteo",
    ],
  },
  {
    id: "compras",
    nombre: "Compras",
    icono: "carrito",
    enCorto: "Tus proveedores, al día",
    imagen: "modulo-compras",
    forma: "mancha",
    alt: "Recepción de un pedido de proveedor en un almacén",
    general:
      "Todo lo que le compras a tus proveedores, desde la orden hasta el último pago, en un solo lugar.",
    detalle:
      "Creas la orden con su proveedor, total y fecha de entrega, y la compra pasa sola a cuentas por pagar. Ahí la filtras por abiertas, vencidas o saldo pendiente, y el sistema te avisa antes de que un pago venza.",
    destacados: [
      "Órdenes de compra con entrega pendiente a la vista",
      "Cuentas por pagar con filtros por estado",
      "Ficha de cada proveedor con su ID",
      "Alertas antes de cada vencimiento",
    ],
  },
  {
    id: "rrhh",
    nombre: "Recursos Humanos",
    icono: "personas",
    enCorto: "Tu equipo y su nómina",
    imagen: "modulo-rrhh",
    forma: "circulo",
    alt: "Tres compañeros de trabajo conversando en una mesa de reuniones",
    general:
      "La nómina venezolana calculada sola, con la ley al día. Empleados, contratos, turnos y liquidaciones en el mismo módulo.",
    detalle:
      "Todos los parámetros de la LOTTT (utilidades, bono vacacional, recargos, garantía de prestaciones, topes de horas extra) se guardan con su valor, desde cuándo rigen y su fuente, junto al salario mínimo y la tasa BCV. Cuando cambian, se actualizan y la siguiente nómina ya sale bien. Los turnos y las incapacidades pasan directo al cálculo.",
    destacados: [
      "Parámetros de ley actualizables, con vigencia y fuente",
      "Vacaciones, utilidades y prestaciones por empleado",
      "Contratos con aviso de los que están por vencer",
      "Liquidación final con desglose auditable",
    ],
  },
  {
    id: "finanzas",
    nombre: "Finanzas",
    icono: "grafica",
    enCorto: "Cómo va tu dinero, de verdad",
    imagen: "modulo-finanzas",
    forma: "hoja",
    alt: "Persona revisando gráficas financieras en un portátil",
    general:
      "Lo que entra, lo que sale y lo que queda. La salud de tu negocio en cifras, sin cargar nada a mano.",
    detalle:
      "El flujo de caja y la rentabilidad se alimentan de las ventas del punto de venta y de las compras. Ves lo que te deben por ventas a crédito y lo que debes a proveedores, tus gastos y el IVA del período, y gestionas promociones y puntos de fidelidad para tus clientes.",
    destacados: [
      "Flujo de caja y rentabilidad al día",
      "Cuentas por cobrar y por pagar",
      "Gastos e IVA del período",
      "Promociones y puntos de fidelidad",
    ],
  },
];

/* Página /tienda: el catálogo.

   Cada entrada de `productos` es un producto. El filtro de arriba de la
   página se arma SOLO a partir de esta lista y solo aparece cuando hay
   más de un producto.

   UN SOLO PLAN (decisión del jefe, 6 oct 2026): el sistema se vende
   completo, sin recortar funciones por tamaño de empresa. Lo único que
   cambia es CÓMO se paga: `pagos` (mensual, trimestral, anual). Las
   funciones de la segunda etapa (IA, etiquetas, reportes, integraciones)
   se cobrarán aparte cuando lleguen: van en `proximamente`.

   ⚠️ PRECIOS FICTICIOS (6 oct 2026), solo para ver la página con
   números. Se calculan por lo que cuesta UN AÑO según cómo se pague:
   $1.200 en mensual ($100/mes), $900 en trimestral ($225 cada
   trimestre) y $700 en anual. Hay que cambiarlos por los reales. Con `precio` en null se
   pinta "A consultar".
   Cuando se decidan, se pone el TOTAL de cada período en USD (lo que se
   cobra cada mes, cada trimestre o cada año). La página calcula sola el
   equivalente mensual y el ahorro frente al pago mensual.

   `iva`: porcentaje que se suma en la cesta (16). En null no se pinta la
   línea del IVA: queda por decidir si los precios lo incluyen.

   `destacado` marca la tarjeta que va en oscuro con la cinta de arriba
   (como "Impulsa la eficiencia" en QuickBooks). */
export const TIENDA = {
  eyebrow: "Tienda",
  titulo: "Elige cómo pagar tu plan",
  texto:
    "Un solo plan con el sistema completo, para negocios de cualquier tamaño. Solo cambia cada cuánto lo pagas.",
  /* Foto de fondo de la cabecera, SIN extensión (como HERO_PRODUCTO).
     En null se ve el degradado azul. */
  imagen: "hero_tienda",
  alt: "Cliente pagando con tarjeta en el punto de venta de un comercio",
  ventajas: ["Los 5 módulos, sin recortes", "Úsalo desde cualquier parte del mundo", "Soporte de personas reales"],
  iva: null,
  productos: [
    {
      id: "administrativo",
      nombre: "Administrativo",
      marca: "My Business Panel",
      descripcion:
        "El sistema que centraliza la gestión de tu empresa: ventas, inventario, compras, nómina y finanzas.",
      plan: {
        nombre: "Plan completo",
        para: "Todo el sistema, sin funciones recortadas",
        /* El titular de la banda de /tienda: dice lo mismo que `para`
           pero hablándote a ti. */
        titular: "Pagues como pagues, te llevas todo",
        incluye: [
          /* El primero era "Los 5 módulos, sin recortes", pero el sello
             "5 de 5" de la banda ya lo dice. */
          "Soporte de personas reales",
          "Úsalo desde cualquier parte del mundo",
          "Robusto para todo el volumen de datos de tu negocio",
          "El mismo sistema para una tienda o para varias sucursales",
        ],
      },
      pagos: [
        /* Orden INVERTIDO (lo pidió Samuel): el anual, que es el
           destacado, va primero; luego trimestral y mensual. */
        {
          id: "anual",
          nombre: "Anual",
          resumen: "Un solo pago y te olvidas por un año",
          cada: "año",
          meses: 12,
          precio: 700,
          destacado: "El plan más solicitado",
          puntos: ["Un pago al año", "Sin renovaciones durante 12 meses"],
        },
        {
          id: "trimestral",
          nombre: "Trimestral",
          resumen: "Un pago cada tres meses",
          cada: "trimestre",
          meses: 3,
          precio: 225,
          puntos: ["Cuatro pagos al año", "Menos renovaciones que el mensual"],
        },
        {
          id: "mensual",
          nombre: "Mensual",
          resumen: "Empieza sin atarte a un período largo",
          cada: "mes",
          meses: 1,
          precio: 100,
          puntos: ["Pagas mes a mes", "Ideal para arrancar"],
        },
      ],
      proximamente: {
        titulo: "Lo que viene en la segunda etapa",
        texto: "Funciones nuevas que podrás sumar a tu plan como extras cuando estén listas.",
        items: [
          { icono: "circuito", nombre: "Inteligencia artificial" },
          { icono: "recibo", nombre: "Generación de etiquetas" },
          { icono: "grafica", nombre: "Módulos de reportes" },
          { icono: "cambio", nombre: "Conexión con otras plataformas" },
        ],
      },
    },
  ],
};

/* Métodos de pago. Los usan el último paso del checkout y, más
   adelante, el portal de pagos: es la MISMA pantalla en los dos sitios.

   Hoy el pago es REPORTADO (como en el portal de Airtek): el cliente
   paga por su banco, reporta la referencia y alguien del equipo lo
   verifica. Cuando haya pasarela (tarjeta), se añade aquí como un
   método más.

   ⚠️ DATOS DE COBRO SIN DEFINIR: los `valor` en null pintan "Por
   confirmar". Hay que pedir a la empresa sus cuentas reales.
   `moneda` decide si el monto se muestra en $ o se pide en Bs. */
export const METODOS_PAGO = [
  {
    id: "pago-movil",
    nombre: "Pago Móvil",
    moneda: "Bs",
    datos: [
      { etiqueta: "Banco", valor: null },
      { etiqueta: "Teléfono", valor: null },
      { etiqueta: "RIF", valor: null },
    ],
  },
  {
    id: "transferencia",
    nombre: "Transferencia",
    moneda: "Bs",
    datos: [
      { etiqueta: "Banco", valor: null },
      { etiqueta: "Cuenta", valor: null },
      { etiqueta: "Titular", valor: null },
      { etiqueta: "RIF", valor: null },
    ],
  },
  {
    id: "zelle",
    nombre: "Zelle",
    moneda: "USD",
    datos: [
      { etiqueta: "Correo", valor: null },
      { etiqueta: "Titular", valor: null },
    ],
  },
];

/* Página /demo: solicitud de demostración de My Business Panel.

   Patrón de la página de demo de Zoho Commerce: a la izquierda se vende
   la demo (titular, vídeo, qué vas a ver) y a la derecha va el
   formulario, CORTO a propósito (ver Demo.jsx).

   `video`: dirección del vídeo de demostración. Con null se ve la
   captura del sistema con la etiqueta "Video próximamente". Admite un
   enlace de YouTube (se incrusta) o un .mp4 de public/video. */
export const DEMO = {
  eyebrow: "Demo gratuita",
  titulo: "Mira My Business Panel funcionando",
  texto:
    "Una demostración en vivo, a la medida de tu negocio, con alguien del equipo que conoce el sistema por dentro.",
  video: null,
  poster: "captura-login",
  puntos: [
    {
      icono: "personas",
      titulo: "Una sesión uno a uno",
      texto: "Por videollamada, con alguien del equipo y sin compromiso.",
    },
    {
      icono: "cajas",
      titulo: "Tus módulos, en vivo",
      texto: "Te enseñamos los que más le sirven a tu caso, no una presentación genérica.",
    },
    {
      icono: "rayo",
      titulo: "Cómo encaja en tu día a día",
      texto: "Con ejemplos de un negocio de tu tamaño y tus dudas resueltas en el momento.",
    },
  ],
  /* Opciones del formulario. Los tamaños son los de la sección
     "Nos adaptamos…" de /producto. */
  tamanos: ["Emprendedor", "Pyme", "Grandes empresas"],
};

/* WhatsApp del botón flotante. `numero` va en formato internacional sin
   "+" ni espacios (es lo que pide wa.me); es el mismo del pie.
   `mensaje` es el texto que aparece ya escrito al abrir el chat. */
/* Teléfono de atención al cliente: lo usan el pie y la página de
   preguntas frecuentes. */
export const ATENCION = { telefono: "+58 424 6706389" };

export const WHATSAPP = {
  numero: "50671046276",
  mensaje: "Hola, vengo de la web de AMH Solutions y quiero información sobre My Business Panel.",
};

/* Enlaces de la barra de navegación. `ruta` distingue los que van a otra
   página de los que son un salto dentro de la home.

   Se quitó "Inicio": el logotipo ya lleva a la home y es la convención
   que espera todo el mundo. Un enlace más que no aporta solo roba sitio
   al reparto a lo ancho de la barra.

   También se quitó "Suscríbete" (7 oct 2026): desde que existe la
   Tienda, se contrata ahí y el enlace repetía su trabajo. */
export const NAVEGACION = [
  /* "Productos" no es un enlace sino un DESPLEGABLE: hoy solo hay un
     producto, pero cuando haya más se añaden aquí, en `hijos`, sin tocar
     la barra. */
  {
    etiqueta: "Productos",
    hijos: [
      {
        etiqueta: "Administrativo",
        destino: "/producto",
      },
    ],
  },
  { etiqueta: "Tienda", destino: "/tienda", ruta: true },
  { etiqueta: "Preguntas frecuentes", destino: "/preguntas-frecuentes", ruta: true },
  { etiqueta: "Nosotros", destino: "/nosotros", ruta: true },
];

/* ------------------------------------------------------------------
   PREGUNTAS FRECUENTES  (/preguntas-frecuentes)

   Formato de la página de FAQ de Zoho One: categorías a la izquierda y,
   a la derecha, cada categoría con sus preguntas en acordeón.

   ⚠️ Las respuestas salen SOLO de lo que ya está decidido en esta web
   (un plan, tres formas de pago, pago reportado, tasa BCV a mano…). No
   se inventaron políticas: reembolsos, permanencia, migración de datos
   o prueba gratis NO están porque nadie las ha definido. Cuando lo
   estén, se añaden aquí.

   Las de "Módulos" reutilizan el `general` de cada módulo (MODULOS),
   así no hay dos textos que mantener. Los precios salen de TIENDA por
   la misma razón.

   `enlace` (opcional) pinta un enlace bajo la respuesta.
------------------------------------------------------------------ */
const precioPagos = TIENDA.productos[0].pagos
  .map((p) => `${p.nombre.toLowerCase()} $${p.precio}`)
  .join(", ");

export const PREGUNTAS = [
  {
    id: "general",
    titulo: "General",
    preguntas: [
      {
        p: "¿Qué es My Business Panel?",
        r: "Es el sistema de AMH Solutions que centraliza la gestión de tu empresa: punto de venta, inventario, compras, recursos humanos y finanzas en un solo lugar, conectados entre sí. Lo que pasa en un módulo se refleja solo en los demás.",
      },
      {
        p: "¿Para qué tamaño de negocio sirve?",
        r: "Para cualquiera. El sistema es el mismo para un emprendedor, una pyme o una empresa grande con varias filiales: lo que cambia es cuánto de él usas.",
      },
      {
        p: "¿Desde dónde puedo usarlo?",
        r: "Desde cualquier dispositivo con internet, estés donde estés. No depende de un equipo en la oficina.",
      },
      {
        p: "¿Puedo verlo antes de contratarlo?",
        r: "Sí. Pide una demo gratuita: es una videollamada uno a uno con alguien del equipo que te enseña los módulos que más le sirven a tu negocio.",
        enlace: { texto: "Pedir una demo", destino: "/demo" },
      },
    ],
  },
  {
    id: "planes",
    titulo: "Planes y precios",
    preguntas: [
      {
        p: "¿Qué incluye el plan?",
        r: "Todo el sistema. Hay un solo plan y trae los cinco módulos completos, sin funciones recortadas. Sirve igual para una tienda que para varias sucursales.",
      },
      {
        p: "¿Cuánto cuesta?",
        r: `El plan es uno solo; cambia cada cuánto lo pagas: ${precioPagos}. Mientras más largo el período, menos pagas al mes.`,
        enlace: { texto: "Ver la tienda", destino: "/tienda" },
      },
      {
        p: "¿Hay funciones que se paguen aparte?",
        r: "Hoy no. Más adelante llegarán funciones nuevas (inteligencia artificial, generación de etiquetas, módulos de reportes y conexión con otras plataformas) que podrás sumar a tu plan como extras cuando estén listas.",
      },
    ],
  },
  {
    id: "pagos",
    titulo: "Pagos",
    preguntas: [
      {
        p: "¿Qué métodos de pago aceptan?",
        r: `${METODOS_PAGO.map((m) => m.nombre).join(", ").replace(/, ([^,]*)$/, " y $1")}.`,
      },
      {
        p: "¿Cómo se hace el pago?",
        r: "Eliges tu forma de pago en la tienda, pagas desde tu banco o tu app y reportas la referencia en el último paso. Alguien del equipo lo verifica y te confirma.",
      },
      {
        p: "¿Puedo pagar en bolívares?",
        r: "Sí, con Pago Móvil o transferencia. El monto en bolívares se calcula a la tasa BCV del día.",
      },
    ],
  },
  {
    id: "modulos",
    titulo: "Módulos",
    preguntas: [
      ...MODULOS.map((m) => ({ p: `¿Qué hace el módulo de ${m.nombre}?`, r: m.general })),
      {
        p: "¿Cómo maneja el sistema la tasa BCV?",
        r: "La tasa la cargas tú, una vez al día, y el sistema la usa en cada cálculo. Así no dependes de una página externa que falle o se retrase.",
      },
    ],
  },
  {
    id: "soporte",
    titulo: "Soporte",
    preguntas: [
      {
        p: "¿Quién me ayuda si tengo un problema?",
        r: "Personas reales del equipo de AMH, que conocen el sistema por dentro. Te acompañamos en la implementación y después de ella.",
      },
      {
        p: "¿Cómo me comunico con ustedes?",
        r: "Por WhatsApp, por teléfono o agendando una reunión con el equipo. Tienes las tres al final de esta página.",
      },
    ],
  },
];

/* ------------------------------------------------------------------
   NOSOTROS  (/nosotros)

   Estructura de la página "Conócenos" de Slack: propósito grande y
   centrado y bloques de texto con ilustración al lado.

   ⚠️ SIN PERSONAS, a propósito (decisión de Samuel, 7 oct 2026): por
   seguridad en Venezuela no se muestran nombres, caras, roles ni el
   tamaño del equipo. Las grandes empresas de aquí tampoco lo hacen. Si
   alguien propone una sección de equipo, la respuesta ya está dada.

   Se quitaron las cifras, "Cómo trabajamos" y "Lo que viene" (Samuel,
   7 oct). Cierra con una banda que lleva a /demo.
------------------------------------------------------------------ */
export const NOSOTROS = {
  eyebrow: "Nosotros",
  proposito: "Que gestionar tu negocio sea tan simple como venderle a tu cliente.",
  intro:
    "Somos AMH Solutions, una empresa venezolana de tecnología. Hacemos software, automatizaciones y sistemas a la medida para que los negocios dejen atrás el papel y las hojas de cálculo.",
  /* "Creamos My Business Panel": el bloque de contexto, como el de
     "Creamos el ecosistema…" de Slack. Junto a la ilustración de la
     chica del portátil (`vector_chica`). */
  producto: {
    eyebrow: "Lo que hacemos",
    titulo: "Creamos My Business Panel",
    parrafos: [
      "My Business Panel es un software de gestión que reúne en un solo sistema lo que un negocio necesita para operar cada día: punto de venta, inventario, compras, recursos humanos y finanzas.",
      "Nuestra misión es que empresarios y clientes no dependan de varios servicios para resolver lo mismo. Todo lo que necesitan, al alcance de una pantalla.",
      "Nació de ver negocios con la nómina en una hoja de cálculo, el inventario en otra y la facturación en un programa aparte. Hoy, una venta descuenta el inventario, entra a la caja y cuadra con las finanzas sin que nadie la vuelva a teclear.",
    ],
    enlace: { texto: "Conoce los cinco módulos", destino: "/producto" },
    imagen: "vector_chica",
    alt: "Ilustración de una mujer trabajando con su portátil",
    /* Las etiquetas que flotan alrededor de la ilustración (como los
       iconos conectados de Slack). Son `id` de MODULOS. */
    flotantes: ["pos", "inventario", "finanzas"],
  },
  /* "Quiénes somos y cómo sumarte": la EMPRESA y cómo opera, como la
     sección "Quiénes somos y cómo unirse" de Slack (cultura + empleos
     + programa). Sin personas. Va con la ilustración a la IZQUIERDA.

     Trabaja con nosotros y Aliados comerciales todavía no tienen página
     propia: abren WhatsApp con el mensaje ya escrito. El pie apunta
     aquí (/nosotros#sumarte). `imagen`: el equipo en la oficina, de
     upklyak (con su crédito debajo). */
  empresa: {
    eyebrow: "Quiénes somos",
    titulo: "Quiénes somos y cómo sumarte",
    texto:
      "AMH Solutions es una empresa venezolana de tecnología. Diseñamos, programamos y damos soporte a nuestro propio software: lo que usas lo construimos nosotros, y por eso sabemos responderte. Creemos en hacer las cosas bien antes que rápido, en hablar claro y en tratar el negocio de cada cliente como si fuera el nuestro.",
    vias: [
      {
        enlace: "Trabaja con nosotros",
        texto: "Buscamos personas curiosas a las que les guste resolver problemas reales de negocios reales.",
        mensaje: "Hola, me interesa trabajar con AMH Solutions.",
      },
      {
        enlace: "Aliados comerciales",
        texto:
          "Si asesoras empresas o vendes servicios a negocios, súmate como aliado y lleva My Business Panel a tus clientes.",
        mensaje: "Hola, me interesa ser aliado comercial de AMH Solutions.",
      },
    ],
    imagen: "about_final",
    alt: "Ilustración de un equipo trabajando junto en una oficina",
    /* Atribución que pide la licencia gratuita de Magnific (Freepik).
       Se pinta en pequeño bajo la ilustración, solo cuando hay imagen.
       La chica del bloque de arriba es un elemento de Canva: no pide
       crédito. */
    credito: { autor: "upklyak", url: "https://www.magnific.com/es/autor/upklyak", plataforma: "Magnific" },
  },
  /* Banda final (como la de Slack): una frase y un botón a /demo. */
  cierre: {
    titulo: "Mira My Business Panel funcionando en tu negocio",
    boton: "Solicitar demo",
  },
};
