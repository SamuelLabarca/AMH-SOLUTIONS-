# AMH Solutions — Landing de My Business Panel

Landing institucional de **AMH Solutions** para promocionar **My Business Panel**, un
sistema de gestión empresarial todo-en-uno (punto de venta, inventario, compras,
recursos humanos y finanzas). Público objetivo: empresas que buscan centralizar la
gestión de su negocio. Todo el contenido va en **español**.

## Stack

| Tecnología | Uso |
|---|---|
| **React 19** | UI declarativa |
| **Vite 8** | Bundler y dev server |
| **Tailwind CSS v4** | Estilos utilitarios + tokens en `@theme` |
| **React Router 7** | Enrutamiento cliente |
| **Sharp** | Optimización de imágenes (WebP) |
| **Oxlint** | Linter |

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # comprueba que compila
npm run lint     # oxlint
```

### Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Build de producción. |
| `npm run preview` | Sirve el build localmente. |
| `npm run lint` | Corre Oxlint. |
| `npm run imagenes` | Genera los WebP de `public/img/` con Sharp. |

## Estructura de carpetas

```
AMH-frontend/
├── index.html             # Preload de fuentes; Google Fonts (Poppins, Instrument Serif)
├── vite.config.js         # Code splitting, Cloudflare tunnel
├── .oxlintrc.json         # Reglas: hooks, only-export-components
├── CLAUDE.md              # Documentación de diseño (268 líneas)
├── package.json
├── scripts/
│   └── optimizar-imagenes.mjs   # Genera WebP (hero, tarjeta, captura, objeto, modulo)
├── public/
│   ├── favicon.svg
│   ├── fonts/             # Urbanist Variable (autohospedada), Garet Book/Heavy (autohospedada)
│   └── img/               # JPG/PNG originales + WebP generados
└── src/
    ├── main.jsx           # createRoot, StrictMode, BrowserRouter
    ├── App.jsx            # Rutas, layout común, scroll restoration, lazy loading
    ├── index.css          # Tokens @theme, fuentes, scroll-reveal, keyframes
    ├── data/
    │   └── contenido.js   # TODO el contenido: servicios, planes, navegación, FAQs
    ├── components/        # Primitivas reusables
    │   ├── ui.jsx         # Seccion, Contenedor, Eyebrow, Titulo, Boton
    │   ├── Navbar.jsx     # Barra fija, dos estados (transparente/blanca)
    │   ├── Contacto.jsx   # Contexto + modal de contacto (reunión por WhatsApp)
    │   ├── Reveal.jsx     # Scroll reveal (IntersectionObserver)
    │   ├── Iconos.jsx     # SVGs en línea + mapa ICONOS
    │   ├── tienda.jsx     # Pasos y PasoPago (solo componentes)
    │   ├── formulario.jsx # Primitivas de formulario (CAMPO, Pastilla, Etiqueta, Casilla)
    │   └── BotonWhatsApp.jsx  # Botón flotante de WhatsApp
    ├── sections/          # Bloques de página
    │   ├── Hero.jsx
    │   ├── Servicios.jsx
    │   ├── BusinessPanel.jsx
    │   ├── PorQueElegirnos.jsx
    │   ├── Nosotras.jsx
    │   └── SiteFooter.jsx
    ├── sesion/            # Sesión del usuario + traducción de errores (portal y checkout)
    ├── servicios/         # ÚNICA puerta a la API del backend (api.js hace el fetch)
    ├── hooks/             # useTienda: catálogo, métodos de cobro y tasa
    ├── utils/
    │   └── dinero.js      # Formato y cálculo de precios (funciones puras)
    └── pages/             # Rutas (lazy-loaded, excepto Home)
        ├── Home.jsx
        ├── Producto.jsx
        ├── Tienda.jsx
        ├── Checkout.jsx
        ├── checkout/      # Piezas del checkout
        ├── portal/        # /portal-de-pagos
        ├── Demo.jsx
        ├── PreguntasFrecuentes.jsx
        ├── NosotrosPagina.jsx
        └── Proximamente.jsx
```

### Reglas de capas

- **Una pantalla no importa de otra.** Lo compartido sale a `sesion/`, `components/` o `utils/`.
- **Solo `servicios/` habla con la API.** Componentes, hooks y pantallas le piden los datos a él.
- **`components/` solo tiene componentes**; los cálculos van en `utils/`.

El backend (Django) vive en el repositorio `AMH-Backend-WEB`. En local:
`npm run dev:api` usa la API en `http://localhost:8000`; sin ella, el portal
y la tienda funcionan en modo demostración.

## Arquitectura de rendimiento

- **Code splitting por página**: `App.jsx` importa la home directamente y el resto
  con `React.lazy`. Cada página es su propio chunk y solo se descarga al visitarla.
- **Vendor chunk**: React y React Router van en un archivo separado
  (`vite.config.js` → `manualChunks`), cacheable entre publicaciones.
- **Fuentes precargadas**: Urbanist y Garet Book se `preload` en `index.html`.
  Poppins e Instrument Serif se cargan de Google Fonts.
- **Imágenes responsive**: `srcSet` + `sizes` en todos los `<img>`, WebP optimizados
  con Sharp (`npm run imagenes`).

## Accesibilidad

- Foco visible en todo lo enfocable (`:focus-visible`).
- `prefers-reduced-motion` respetado: se desactivan animaciones y el scroll-reveal
  muestra contenido sin transición.
- Modal de contacto con trampa de foco, Escape, `aria-modal`, `aria-labelledby`.
- Tabs de pestañas ARIA completos en Navbar y Producto.
- Texto alternativo en todas las imágenes; `aria-label` en iconos.
