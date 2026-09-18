# AMH Solutions — Landing de "My Business Panel"

Landing de **AMH Solutions** para promocionar **My Business Panel**, un panel de
gestión empresarial todo-en-uno (CRM, inventario y finanzas). Público: empresas que
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

La tipografía es **Inter variable autohospedada**, del paquete
`@fontsource-variable/inter`. No se carga nada de Google Fonts: un solo archivo
cubre los pesos 100–900, sin petición a terceros ni parpadeo al cargar.

## Hasta dónde queremos llegar

Calidad y pulido a la altura de **Airtek Venezuela (airtek.com.ve)**, con la
estética del proyecto hermano **nido** (`C:\Users\Samuel\Desktop\nido`): lienzo
gris, secciones como tarjetas redondeadas, cristal esmerilado y sombras suaves.

⚠️ De nido copiamos la **estética**, no el **método**. nido posiciona todo en
absoluto sobre un `aspect-ratio` fijo porque nació de un Figma medido al píxel.
Aquí no hay ese Figma: se trabaja con flujo normal (flex/grid + contenedor
centrado), que es mantenible a mano.

## Paleta (tokens en `src/index.css`)

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#16273F` | footer, fondos más oscuros |
| `navy` (PRIMARIO) | `#243B61` | botones, fondos oscuros |
| `steel-navy` | `#355080` | apoyos, hover del primario |
| `slate-blue` | `#6E84A8` | apoyos |
| `sky` (ACENTO) | `#4F93D1` | enlaces, eyebrows, iconos |
| `sky-light` | `#6BA9DD` | hover y acento sobre oscuro |
| `sky-tint` | `#E8F1FA` | fondo suave de sección, badges |
| `shell` | `#F0F0F0` | **el lienzo**: fondo del `body` |
| `cloud` | `#F5F8FC` | fondos de tarjeta interiores, campos |
| `mist` | `#DCE4EF` | bordes |
| `steel` | `#707D90` | texto secundario / etiquetas |
| `body` | `#3A4658` | texto de cuerpo |
| títulos | `#000000` | **todos los H2 van en NEGRO** |

El lienzo es **gris, no blanco**: es lo que hace que las secciones blancas se lean
como tarjetas y que sus esquinas redondeadas se vean.

## Reglas de tipografía (estrictas, dan el look)

- **Titular del hero**: blanco, peso black, ~64px, `line-height` 1.03, a la izquierda.
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

1. **Hero** — video aéreo a sangre, velo navy, titular a la izquierda y la banda de
   métricas dentro del propio hero.
2. **Nosotros** — quiénes somos, antes de decir qué vendemos. Rejilla asimétrica 5/7.
3. **Servicios** — los cuatro módulos en rejilla 2x2, sobre fondo tinte.
4. **Contacto** — solo la invitación. El formulario está en el modal.
5. **Footer** — común a todas las páginas, lo pone `App.jsx`.

**Producto y planes (`/producto`)** — `src/pages/Producto.jsx`. El producto y los
**precios NO están en la home**: viven aquí, enlazados desde el navbar y el footer.

Ritmo de fondos: oscuro → blanco → tinte → navy → ink. La página se va oscureciendo
hacia el final, que es lo que cierra el recorrido.

## El contacto es un modal, no una sección

Es el requisito que más define la página: hay un **botón pequeño** y al pulsarlo la
pantalla se **cristaliza** (`backdrop-blur` + velo ink) y aparece una tarjeta
centrada para hablar con soporte.

Está montado como **contexto** (`ProveedorContacto` en `src/components/Contacto.jsx`)
porque lo abren varios sitios a la vez — navbar, hero, la llamada de la home, el
footer y cada tarjeta de plan — y todos tienen que compartir el mismo modal.
Duplicarlo daría varios diálogos superpuestos.

Para abrirlo desde cualquier componente: `const { abrir } = useContacto()`.

El modal ya trae Escape, bloqueo del desplazamiento del fondo, trampa de foco y
devolución del foco al cerrar. **Si lo tocas, no quites nada de eso.**

## El video del hero

Está en `public/video/`. El original de 48,9 MB **no está en el repo**: quedó en
`Desktop\mbp2026\_originales\`.

| Archivo | Peso | Para |
|---|---|---|
| `hero-1920.mp4` | 4,6 MB | escritorio (`min-width: 768px`) |
| `hero-1280.mp4` | 1,75 MB | móvil |
| `hero-poster.webp` | 0,15 MB | primer fotograma mientras carga |

- Va **mudo y sin pista de audio**: es requisito del navegador para autorreproducir.
- `playsInline` es **obligatorio** en iOS; sin él Safari se lo lleva a pantalla completa.
- El clip lleva un **fundido cruzado de 1 s codificado dentro**, así que el `loop`
  no da salto. Si lo vuelves a codificar desde el original, mantenlo.
- Probado VP9/WebM: sale **más grande** que H.264 con este material (mucho
  movimiento de dron). No lo reintentes.

## Dónde está cada cosa

```
src/index.css                      Tokens (@theme), fuente, reveal, keyframes
src/App.jsx                        Rutas, layout común, scroll al navegar
src/data/contenido.js              TODO el contenido: métricas, pilares,
                                   servicios, planes, navegación
src/components/ui.jsx              Seccion, Contenedor, Eyebrow, Titulo,
                                   Entradilla, Boton, Tarjeta
src/components/Contacto.jsx        El contexto, el botón y el modal
src/components/Navbar.jsx          Barra fija; transparente sobre el hero
src/components/Reveal.jsx          Scroll reveal (fade-up al entrar en pantalla)
src/components/Iconos.jsx          SVG en línea (no hay tipografía de iconos)
src/pages/Home.jsx                 El ORDEN de las secciones de la home
src/pages/Producto.jsx             Producto + planes
src/sections/                      Hero, Nosotros, Servicios,
                                   LlamadaContacto, SiteFooter
_referencia/index-stitch.html      El HTML original de Stitch, solo de consulta
```

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
