# AMH Solutions — Landing de "My Business Panel"

Brief de proyecto para retomar el desarrollo. La fase de diseño (en Stitch) ya está hecha;
esto es la guía para construir el sitio en código con acabado profesional.

---

## 1. Qué estamos construyendo

Landing page de **AMH Solutions** para promocionar **My Business Panel**, un panel de
gestión empresarial todo-en-uno (CRM, inventario y finanzas). Público: empresas que buscan
centralizar la gestión de su negocio.

## 2. Hasta dónde queremos llegar (objetivo)

Calidad y pulido a la altura de **Airtek Venezuela (airtek.com.ve)**: moderno, confiable,
limpio, con jerarquía visual fuerte y **movimiento real**. El diseño base de Stitch nos
deja en ~80%; el objetivo es el 20% premium que solo se logra en código (animaciones,
asimetría fina, sombras en capas, interactividad). NO copiar el código exportado de Stitch:
usar el diseño solo como referencia visual y reconstruir limpio.

## 3. Stack

- **React + Tailwind CSS**.
- Paleta **tokenizada** en `tailwind.config` (ver abajo), no hex sueltos en el JSX.
- Componentes limpios y reutilizables. Código mantenible (luego se conectará un backend Node.js).
- Mobile-first, responsive. Todo el texto en **español**.

## 4. Paleta (tokenizar tal cual)

| Token | Hex | Uso |
|---|---|---|
| `ink` (navy-900) | `#16273F` | secciones oscuras profundas, footer |
| `navy` (navy-700, PRIMARIO) | `#243B61` | botones, fondos oscuros, headers |
| `steel-navy` (navy-500) | `#355080` | apoyos, degradados |
| `slate-blue` (navy-300) | `#6E84A8` | apoyos |
| `sky` (sky-500, ACENTO) | `#4F93D1` | enlaces, eyebrows, íconos, énfasis |
| `sky-light` (sky-400) | `#6BA9DD` | hover/variantes |
| `sky-tint` (sky-100) | `#E8F1FA` | fondos suaves de sección, badges |
| `cloud` | `#F5F8FC` | fondo de sección claro |
| `mist` | `#DCE4EF` | bordes |
| `steel` | `#707D90` | texto secundario / etiquetas |
| `body` | `#3A4658` | texto de cuerpo |
| `white` | `#FFFFFF` | base |
| títulos | `#000000` | **todos los H2/titulares van en NEGRO** |

El azul cielo de acento luce mejor sobre navy; sobre blanco usarlo en bold o ≥16px.

## 5. Reglas de tipografía (estrictas, dan el look profesional)

- Sans-serif moderna y geométrica (Inter / Poppins).
- **Titular del hero**: blanco `#FFFFFF`, peso black, ~64px desktop, line-height 1.05, alineado a la izquierda.
- **Todos los H2 de sección**: color **NEGRO `#000000`**, extrabold, grandes (~40px),
  **alineados a la IZQUIERDA**, nunca centrados ni en gris. Estilo "Internet para ganar" de Airtek.
- Encima de cada H2, una **eyebrow**: etiqueta pequeña en MAYÚSCULAS, azul `#4F93D1`, con letter-spacing.
- Cuerpo en `#3A4658`; secundarios/etiquetas en `#707D90`.
- El azul de acento NO se usa en títulos, solo en eyebrows, enlaces e íconos.

## 6. Estructura de la página (de arriba a abajo)

1. **Header** fijo, fondo blanco: logo AMH Solutions (izq) · menú (Inicio, Producto, Planes, Contacto) · "Iniciar sesión" + botón navy "Solicitar demo" (der).
2. **Hero**: fondo navy degradado `#243B61 → #16273F`. Badge "NUEVO: Panel de Negocios v3.0", titular grande blanco "Soluciones construidas para durar", subtítulo, botón primario azul "Empezar ahora" + secundario outline "Ver demo interactiva". Mockup del dashboard a la derecha, que **se salga ligeramente del borde (overflow) y un poco rotado**.
3. **Banda de prueba social** (debajo del hero): 3–4 métricas en fila ("+500 empresas", "99.9% disponibilidad", "Soporte 24/7", "Datos cifrados") con el dato en bold negro y descripción en gris; debajo, fila de logos de clientes en gris.
4. **"Conoce nuestro sistema"** — carrusel (ver §7). Fondo blanco.
5. **"Descarga tu demo"** — fondo tinte `#E8F1FA`, H2 a la izquierda, botón navy "Descargar ahora".
6. **"Planes flexibles para cada etapa"** — 3 tarjetas (Emprendedor $29, Profesional $79 "MÁS POPULAR" destacada con borde azul, Corporativo $189). Fondo blanco.
7. **"¿Tienes preguntas?"** — formulario de contacto (Nombre, Empresa, Correo, Mensaje) + botón "Enviar mensaje".
8. **Footer** navy `#16273F`: logo, columnas (Empresa, Soporte), newsletter, redes, línea legal.

Alternar fondos para dar ritmo (navy → blanco → tinte → blanco → navy) y variar el padding vertical entre secciones.

## 7. Carrusel "Conoce nuestro sistema" (requisito funcional)

Tarjeta grande blanca, esquinas 24px, sombra suave. Dos columnas:
- **Izquierda (~45%)**: mockup de pantalla del sistema en marco de navegador, sobre fondo navy degradado redondeado.
- **Derecha (~55%)**: eyebrow azul · titular **negro bold** · párrafo · 2 viñetas con ícono azul.

**Interacción clave**: flechas circulares a cada lado; al hacer clic **cambian foto Y texto a la vez** (slide completo). Debajo, 3 puntos de paginación (activo = pastilla azul). Animar la transición entre slides (fade/slide suave).

Contenido de los 3 slides:

**Slide 1 — eyebrow "CRECIMIENTO ACELERADO"**
- Titular: "CRM: Domina tu Embudo de Ventas"
- Párrafo: "No pierdas ni una sola oportunidad. Nuestro CRM inteligente centraliza cada interacción, permitiéndote cerrar tratos más rápido y fidelizar clientes con un servicio personalizado de clase mundial."
- Viñetas: "Visión 360° de cada cliente y prospecto." · "Automatización de tareas para tu equipo comercial."
- Imagen: dashboard CRM (tabla de clientes + panel de actividad).

**Slide 2 — eyebrow "EFICIENCIA OPERATIVA"**
- Titular: "Inventario: Control Total en Tiempo Real"
- Párrafo: "Elimina el caos de tus almacenes. Gestiona miles de SKUs en múltiples ubicaciones con precisión quirúrgica, asegurando que nunca te quedes sin stock ni pierdas dinero en exceso de mercancía."
- Viñetas: "Trazabilidad completa desde la compra hasta la venta." · "Predicción de demanda basada en inteligencia de datos."
- Imagen: gestión de inventario (gráfica de líneas + dona).

**Slide 3 — eyebrow "CLARIDAD FINANCIERA"**
- Titular: "Finanzas: Decisiones Basadas en Rentabilidad"
- Párrafo: "Transforma tus números en estrategia. Obtén una radiografía instantánea de la salud financiera de tu negocio con reportes automáticos que te dicen exactamente dónde estás ganando y dónde puedes optimizar."
- Viñetas: "Dashboards interactivos de ingresos y egresos." · "Cierre de mes en minutos, no en días."
- Imagen: dashboard financiero (gráfica de área + tarjetas de métricas).

## 8. El "20% premium" — qué meter en código (esto es lo que iguala a Airtek)

- **Scroll reveal**: secciones aparecen con fade-up al entrar en viewport.
- **Hover**: tarjetas se levantan ligeramente (translateY + sombra), botones con transición.
- **Carrusel funcional** con transición suave entre slides.
- **Asimetría fina**: mockup del hero con overflow/rotación; columnas de ancho desigual (60/40).
- **Sombras en capas** y direccionales (sutiles, con tinte navy); sombra fuerte solo en el elemento destacado (tarjeta "Más popular", mockup del hero).
- **Ritmo de fondos** alternados y espaciado vertical variable.
- **Assets reales**: capturas/mockups propios de My Business Panel con la paleta navy/azul (no genéricos).

## 9. Notas

- Accesibilidad básica: contraste suficiente, foco visible, alt en imágenes, navegación por teclado en el carrusel.
- Performance: lazy-load de imágenes pesadas.
- Preparar para conectar luego un backend (Node.js): mantener datos de planes/slides en estructuras/arrays, no hardcodeados en el markup.
