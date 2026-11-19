# AMH Solutions — Landing de "My Business Panel"

Landing de **AMH Solutions** para promocionar **My Business Panel**, un panel de
gestión empresarial todo-en-uno (recursos humanos y nómina, inventario, compras,
finanzas y punto de venta). Público: empresas que
buscan centralizar la gestión de su negocio. Todo el texto va en **español**.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # comprueba que compila
```

## Stack

**React 19 + Vite + Tailwind v4 + React Router.**

⚠️ **Tailwind v4 no usa `tailwind.config.js`.** Los tokens de marca viven en el
bloque `@theme` de `src/index.css`. Si buscas un color y no encuentras el config,
es por eso. Se usan igual en el JSX: `bg-navy`, `text-sky`, `border-mist`…

La tipografía es **Urbanist variable autohospedada** (`public/fonts/`, declarada
con `@font-face` en `src/index.css`). Es la misma que usa nido. No se carga nada
de Google Fonts: un solo archivo de 37 KB cubre los pesos 100–900, sin petición a
terceros ni parpadeo al cargar.

## Hasta dónde queremos llegar

Calidad y pulido a la altura de **Airtek Venezuela (airtek.com.ve)**. De nido
(`C:\Users\Samuel\Desktop\nido`) viene la ESTRUCTURA: lienzo gris, secciones
como tarjetas redondeadas, cristal esmerilado y sombras suaves. De Airtek viene
el CARÁCTER: titulares enormes con el tracking muy cerrado, fotos a sangre
dentro de las tarjetas y una barra de navegación sin adornos.

Sobre la tipografía de Airtek, medido en su CSS y no a ojo: usan la familia
**Heading Now** (`72Light`, `75Medium`, `85Medium`) con `letter-spacing` de
**-2px a -2.5px** (≈ `-0.05em`) en los titulares grandes. Aquí se reproduce con
Urbanist en `font-black` y `tracking-[-0.04em]`. Ese tracking negativo es el
detalle que más hace: sin él, el mismo titular se lee flojo.

⚠️ De nido copiamos la estética, no el **método**. nido posiciona todo en
absoluto sobre un `aspect-ratio` fijo porque nació de un Figma medido al píxel.
Aquí no hay ese Figma: se trabaja con flujo normal (flex/grid + contenedor
centrado), que es mantenible a mano.

## Paleta (tokens en `src/index.css`)

> ⚠️ La tabla refleja los valores **actuales en `index.css`** (actualizado
> 6 oct 2026). El acento `sky` cambió de `#1F5CE0` a `#1D70F5 a solicitud de
> Samuel: usan el "azul-vivo" de las formas de "¿Por qué elegirnos?", que es el
> mismo color. Los fondos del degradado (`fondo-sky`, `fondo-sky-light`)
> **no cambiaron**: conservan los valores anteriores.

| Token | Hex | Uso |
|---|---|---|
| **Azules** | | |
| `indigo` | `#0E0339` | arranque del degradado del hero |
| `indigo-mid` | `#172B81` | parada intermedia del degradado |
| `sky` (ACENTO) | `#1D70F5` | botones, enlaces, eyebrows, iconos |
| `sky-light` | `#4A8CF7` | hover de botones; acento sobre oscuro |
| `sky-hondo` | `#1642A8` | botón del hero de la home (más oscuro que `sky`) |
| `sky-tint` | `#EAF0FD` | fondo suave de sección, badges |
| `sky-pill` | `#D4E0FB` | pastilla del enlace activo del menú |
| `fondo-sky` | `#1A4EC4` | degradados de cabecera, tarjeta destacada de /tienda |
| `fondo-sky-light` | `#1F5CE0` | parada del degradado de fondo |
| `azul-vivo` | `#1D70F5` | formas de "¿Por qué elegirnos?", línea punteada |
| `navy` | `#243B61` | superficies oscuras (cabecera de /producto) |
| `steel-navy` | `#355080` | apoyos, hover de navbar |
| `slate-blue` | `#6E84A8` | apoyos |
| `ink` | `#16273F` | fondos oscuros que no son el hero |
| `carbon` | `#161616` | tarjeta del Business Panel (gris carbón) |
| **Neutros** | | |
| `piedra` | `#F1F1EF` | fondo de Servicios |
| `shell` | `#F0F0F0` | fondo del `body` |
| `smoke` | `#F5F7FA` | pastilla del menú, campos de formulario |
| `cloud` | `#F5F8FC` | fondos de tarjeta interiores, campos |
| `mist` | `#DCE4EF` | bordes |
| `steel` | `#707D90` | texto secundario / etiquetas |
| `body` | `#3A4658` | texto de cuerpo |
| **Acento** | | |
| `amarillo` | `#F9CF2F` | composición de /nosotros |
| `amarillo-claro` | `#FDC98C` | degradado del amarillo |
| títulos | `#000000` | **todos los H2 van en NEGRO** |

**El azul de acento sale de QuickBooks**, muestreado de
`quickbooks.intuit.com/global/es` y no inventado: su hero va de `#0E0339` arriba
a `#1F5CE0` abajo pasando por `#172B81`, y ese degradado diagonal es el del
nuestro. El acento anterior (`#1F5CE0`) —el propio QuickBooks— era un azul más
claro; Samuel lo pidió en `#1D70F5` (6 oct 2026) para que botones y letras usen
el mismo azul de las formas de "¿Por qué elegirnos?". Cumple contraste de sobra
sobre blanco (~7:1).

## ⚠️ Secciones CUADRADAS y a sangre

`--radius-seccion` y `--margen-lienzo` valen **0**. La página era la de nido
—secciones como tarjetas de 32px flotando sobre un lienzo gris— y se cambió a
bandas apiladas a sangre, como Airtek y QuickBooks: se lee como un recorrido
continuo en vez de como una pila de fichas.

Las variables siguen existiendo (no se borraron) porque todos los componentes
las usan: ponerlas de nuevo en `2rem`/`0.75rem` devuelve el look de tarjeta
desde un solo sitio, sin tocar JSX.

Lo único que lleva curva es `--radius-tarjeta` (**12px**): tarjetas de servicio,
pastillas del hero y tarjetas interiores, al estilo de las blancas de
QuickBooks. Los botones siguen siendo pastillas completas, como en las dos
referencias.

## Reglas de tipografía (estrictas, dan el look)

- **El cuerpo va en peso 500**, no 400. Está puesto en `body` (`src/index.css`) y
  lo hereda todo. Es la tipografía de nido: allí los párrafos van en
  `font-medium` casi sin excepción. Urbanist en regular es muy ligera y a
  tamaños pequeños el texto se lee gris aunque el color sea oscuro.
- **Tracking negativo fuerte en los titulares grandes**: `-0.04em` en el hero y
  en los títulos de las tarjetas de servicio. Es lo que replica a Airtek.
- **Titular del hero**: blanco, peso black, ~64px, `line-height` 0.98, a la izquierda.
- **Todos los H2 de sección**: **NEGRO**, extrabold, ~40px, **alineados a la
  IZQUIERDA**. Nunca centrados, nunca en gris, nunca en el azul de acento.
  La única excepción deliberada es la sección de contacto, que va centrada
  precisamente por ser la excepción.
- Encima de cada H2, una **eyebrow**: MAYÚSCULAS pequeñas, azul, con letter-spacing.
- El azul de acento NO se usa en títulos, solo en eyebrows, enlaces e iconos.
- Estas reglas están encapsuladas en `<Titulo>` y `<Eyebrow>` (`src/components/ui.jsx`).
  Úsalos en vez de escribir el `<h2>` a mano y no hay forma de romperlas.

## Estructura

**Home (`/`)** — el orden vive en `src/pages/Home.jsx`:

1. **Hero** — tarjeta redondeada con la foto del edificio, velo navy, titular a
   la izquierda, dos botones y tres pastillas de cristal flotando a la derecha
   (`TARJETAS_HERO`). El badge y la banda de métricas se quitaron a propósito;
   `METRICAS` sigue en `contenido.js` por si vuelve en otra sección.
2. **Servicios** — los cuatro servicios de la empresa, en tarjetas con foto a
   sangre. Va justo después del hero: quien acaba de leer la promesa quiere
   saber qué le vendes, no quién eres.
3. **Nosotros** — quiénes somos. Rejilla asimétrica 5/7.
4. **Contacto** — solo la invitación. El formulario está en el modal.
5. **Footer** — común a todas las páginas, lo pone `App.jsx`.

⚠️ `SERVICIOS` y `MODULOS` son listas DISTINTAS. `SERVICIOS` son los cuatro
servicios que vende AMH (desarrollo web, automatizaciones, software a la medida,
chatbots) y viven en la home. `MODULOS` son los cinco módulos de My Business
Panel (Recursos Humanos, Inventario, Compras, Finanzas y Punto de venta) y viven
en /producto. Antes `MODULOS`
se llamaba `SERVICIOS`, de ahí el riesgo de confundirlas.

**Producto y planes (`/producto`)** — `src/pages/Producto.jsx`. El producto y los
**precios NO están en la home**: viven aquí, enlazados desde el navbar y el footer.

El eje de la página es un CONTRASTE: la competencia vende nómina, facturación e
inventario como sistemas separados y My Business Panel lo trae todo en uno. Orden:
hero corto con foto y ARCO abajo → "Conoce nuestros módulos" (pestañas con foto a
la izquierda, patrón de dohmi.com; orden POS, Inventario, Compras, RRHH, Finanzas)
→ beneficios (bento sobre el degradado azul, `BENEFICIOS`) → flujo entre módulos
→ planes → cierre. Las fotos se ponen en `HERO_PRODUCTO`
y en el campo `imagen` de cada módulo. Las de los módulos son PNG recortados
(fondo transparente, nombre `modulo-*`) dentro de una FORMA BLANCA distinta por
módulo (`forma` en contenido.js, `FORMAS` en Producto.jsx). Todos los planes
incluyen los cinco módulos; cambian usuarios, sucursales y soporte.

Ritmo de fondos: foto → negro → degradado azul → tinte → tinte → navy.

## La barra y el pie

Los dos siguen el patrón de **Airtek**, no el de nido. Si vuelves a tocarlos,
conserva esto:

- **Barra** (`src/components/Navbar.jsx`): dos estados. Arriba del todo va
  **transparente con el texto en blanco**, montada sobre la cabecera oscura; al
  desplazar pasa a **blanca con el texto en negro**. Los enlaces NO se agrupan a
  la derecha: el `<ul>` se queda todo el hueco libre (`flex-1`) y los reparte
  con `justify-evenly`, así la barra se ocupa de punta a punta. Enlaces sueltos
  sin pastilla (ni el activo) y UN solo botón relleno al final.
  Como es transparente, `<main>` NO lleva padding superior: el hueco lo pone
  cada cabecera con su propio `pt` (Hero.jsx, Producto.jsx).
- **Pie** (`src/sections/SiteFooter.jsx`): dos pisos. Arriba, logotipo +
  dirección + redes a la izquierda, TRES columnas de enlaces SIN encabezado en
  el centro y "Atención al cliente" + teléfono a la derecha. Abajo, centrado y
  tras una línea, los enlaces legales y el copyright. Nada más: un pie se
  consulta, no se lee.

Antes el pie era la composición de nido (titular enorme, correo gigante,
boletín, curva). Se quitó entera por larga.

## El contacto es un modal, no una sección

Es el requisito que más define la página: hay un **botón pequeño** y al pulsarlo la
pantalla se **cristaliza** (`backdrop-blur` + velo ink) y aparece una tarjeta
centrada para hablar con soporte.

Está montado como **contexto** (`ProveedorContacto` en `src/components/Contacto.jsx`)
porque lo abren varios sitios a la vez — navbar, hero, la llamada de la home, el
footer y cada tarjeta de plan — y todos tienen que compartir el mismo modal.
Duplicarlo daría varios diálogos superpuestos.

Para abrirlo desde cualquier componente: `const { abrirReunion } = useContacto()`.

Solo queda el formulario de **reunión** (sale por WhatsApp ya escrito). El de
"mensaje" (`abrir`) se quitó el 7 oct 2026: no enviaba nada y mostraba datos de
contacto de relleno. Para contacto rápido se usan WhatsApp y el teléfono
(`ATENCION` en `contenido.js`); "Portal de pagos" lleva a `/portal-de-pagos`
("muy pronto") hasta que exista el portal.

El modal ya trae Escape, bloqueo del desplazamiento del fondo, trampa de foco y
devolución del foco al cerrar. **Si lo tocas, no quites nada de eso.**

## Las imágenes

Los JPG de origen viven en `public/img/`. **Lo que sirve la página son los WebP**,
que se generan con:

```bash
npm run imagenes      # scripts/optimizar-imagenes.mjs (usa sharp)
```

El script saca dos anchos por imagen: `nombre.webp` y `nombre-sm.webp`. El hero
va a 1920/1080 y las tarjetas a 900/560. Los componentes componen la ruta a
partir del campo `imagen` del contenido, así que **no referencies nunca el JPG**.

⚠️ `hero.jpg` solo mide 1170x780. El script no amplía (`withoutEnlargement`), así
que en monitores grandes el hero se ve algo blando. Si consiguen la foto original
en mayor resolución, se sustituye el JPG, se vuelve a correr el script y ya está:
no hay que tocar ningún componente.

⚠️ Nombres sin espacios ni acentos. Un espacio en `/img/mi foto.jpg` rompe la URL
en algunos navegadores.

## Dónde está cada cosa

```
src/index.css                      Tokens (@theme), fuente, reveal, keyframes
src/App.jsx                        Rutas, layout común, scroll al navegar
src/data/contenido.js              TODO el contenido: métricas, pilares,
                                   servicios, planes, navegación
src/components/ui.jsx              Seccion, Contenedor, Eyebrow, Titulo,
                                   Entradilla, Boton, Tarjeta
src/components/Contacto.jsx        El contexto, el botón y el modal
src/components/Navbar.jsx          Barra fija al estilo Airtek: logotipo a la
                                   izquierda, enlaces sueltos y UN botón a la
                                   derecha. Transparente sobre el hero
scripts/optimizar-imagenes.mjs     Genera los WebP de public/img/
src/components/Reveal.jsx          Scroll reveal (fade-up al entrar en pantalla)
src/components/Iconos.jsx          SVG en línea (no hay tipografía de iconos)
src/pages/Home.jsx                 El ORDEN de las secciones de la home
src/pages/Producto.jsx             Producto + planes
src/pages/NosotrosPagina.jsx       /nosotros (sin personas, por seguridad)
src/pages/PreguntasFrecuentes.jsx  /preguntas-frecuentes
src/pages/Tienda.jsx, Checkout.jsx /tienda y /tienda/checkout
src/pages/checkout/                Piezas del checkout (datos, paso "Tu cuenta")
src/pages/portal/                  /portal-de-pagos: entrar, registro,
                                   recuperación, cuenta y pago
src/sections/                      Hero, Nosotros, Servicios,
                                   LlamadaContacto, SiteFooter
src/sesion/                        Sesión del usuario y traducción de errores
                                   de la API (portal y checkout)
src/servicios/                     ÚNICA puerta a la API (api.js hace el fetch)
src/hooks/useTienda.js             Catálogo, métodos de cobro y tasa (de la API)
src/utils/dinero.js                Formato y cálculo de precios (sin React)
```

### Las capas y sus reglas

El backend vive en otro repositorio (`AMH-Backend-WEB`, Django). Este solo
le habla por HTTP, a través de `src/servicios/`.

| Capa | Carpeta | Regla |
|---|---|---|
| Pantallas | `src/pages/` | Una pantalla **no importa de otra**. Lo que comparten dos pantallas sale a su propia carpeta (`src/sesion/`, `src/components/`) |
| Piezas visuales | `src/components/` | Solo componentes. Nada de cálculos ni de `fetch` |
| Estado | `src/hooks/`, `src/sesion/` | Piden los datos a `servicios/`, nunca con `fetch` directo |
| Acceso a la API | `src/servicios/` | El ÚNICO sitio que sabe que existe una API. Si cambia el backend, solo se toca aquí |
| Utilidades | `src/utils/` | Funciones puras: sin React, sin API |
| Textos | `src/data/contenido.js` | Contenido de marketing, sin lógica. Los precios y los datos de cobro NO: vienen de la API |

## Rendimiento

- **Carga por página**: `App.jsx` importa la home directamente y el resto de
  páginas con `React.lazy`. Cada página es su propio archivo JS y solo se
  descarga al visitarla. Una página nueva se añade igual (lazy), salvo que sea
  la de entrada.
- **React y el router** van en un archivo `vendor` aparte (`vite.config.js`):
  cambian poco y quedan en caché entre publicaciones.
- **Fuentes**: Urbanist y Garet Book se precargan en `index.html`. De Google
  Fonts solo se piden Poppins e Instrument Serif (Inter se quitó: no se usaba).
- **Anclas entre páginas** (`/nosotros#sumarte`): `AlCambiarDeRuta` reintenta
  con `setTimeout` hasta 5 s porque la página llega tarde (lazy).

## El "20% premium" — lo que iguala a Airtek

- **Scroll reveal**: envuelve en `<Reveal>`, y `retraso` escalona los hijos de una
  rejilla para que no aparezcan todos de golpe.
- **Hover**: tarjetas y botones se levantan (`-translate-y`) y su sombra crece.
- **Sombras en capas** con tinte navy: `--shadow-card`, `--shadow-lift`,
  `--shadow-destacado`. La fuerte se usa **solo** en el elemento destacado
  (la tarjeta "Más popular"), o deja de destacar.
- **Asimetría fina**: columnas desiguales (5/7 en Nosotros), nunca 50/50.
- **Ritmo**: alternar fondos y variar el padding vertical entre secciones.

## Convenciones

- **Comentarios en español**, explicando el *por qué*, no el *qué*.
- Los colores salen siempre del `@theme`. **No metas hexadecimales sueltos** en los
  componentes.
- El contenido va en `src/data/contenido.js`, no en el markup: el día que exista el
  backend Node.js se sustituye por la respuesta de la API sin tocar los componentes.
- Mobile-first: las clases sin prefijo son móvil, `lg:` aplica desde 1024px.
- Accesibilidad: contraste suficiente, foco visible (ya está en `index.css`), `alt`
  en imágenes, y `prefers-reduced-motion` respetado.
