/* ------------------------------------------------------------------
   OPTIMIZADOR DE IMÁGENES

   Toma los JPG/PNG sueltos de `public/img/` y genera, al lado, las
   versiones WebP que realmente sirve la página.

   Por qué dos anchos y no uno: la tarjeta de servicio nunca se ve más
   ancha de ~640 px, pero el hero ocupa la ventana entera. Servir el
   mismo archivo a los dos sitios obliga al móvil a bajarse píxeles que
   no va a pintar.

   El original NO se borra: queda como fuente por si hay que regenerar
   con otro recorte o calidad. Lo que entra al repo es el WebP.

   Uso:  npm run imagenes
------------------------------------------------------------------ */
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const CARPETA = "public/img";

/* `ancho` es el lado largo al que se reduce. `calidad` va más alta en el
   hero porque es la única imagen que se ve a pantalla completa, donde
   los artefactos del cielo liso se notarían. */
const PERFILES = {
  hero: [
    { sufijo: "", ancho: 1920, calidad: 80 },
    { sufijo: "-sm", ancho: 1080, calidad: 78 },
  ],
  tarjeta: [
    { sufijo: "", ancho: 900, calidad: 76 },
    { sufijo: "-sm", ancho: 560, calidad: 74 },
  ],
  /* Capturas de pantalla (el monitor con el login): llevan TEXTO, y a
     calidad 76 el WebP le pone manchas alrededor de las letras. Van más
     anchas porque en retina el hueco del Business Panel pide ~1400px. */
  captura: [
    { sufijo: "", ancho: 1600, calidad: 92 },
    { sufijo: "-sm", ancho: 900, calidad: 90 },
  ],
};

/* Objetos sueltos con fondo transparente (los de "¿Por qué elegirnos?").
   Se ven a ~280px: 640 cubre retina. Se recortan los bordes vacíos para
   que el tamaño en pantalla dependa del objeto, no del lienzo de Canva. */
PERFILES.objeto = [
  { sufijo: "", ancho: 640, calidad: 82 },
  { sufijo: "-sm", ancho: 360, calidad: 80 },
];
const OBJETOS = ["alcancia", "puzzle", "auriculares"];

/* Recortes de los módulos de /producto (modulo-pos, modulo-rrhh…): PNG
   con fondo transparente que van dentro de una forma blanca de ~460px.
   Más anchos que los objetos porque llenan la forma, y la que va en
   `object-cover` (RRHH, en círculo) se pinta a ~660px: en retina pide
   ~1300px. Si el original es más pequeño, se queda en su tamaño. También se recortan los bordes vacíos. */
PERFILES.modulo = [
  { sufijo: "", ancho: 1400, calidad: 85 },
  { sufijo: "-sm", ancho: 560, calidad: 80 },
];

/* Qué archivos usan el perfil de captura (también la foto del "antes"
   del Business Panel: comparte hueco y `srcset` con la captura del login). Se recortan además los
   bordes transparentes: el PNG que sale de Figma trae aire alrededor
   del monitor y, sin recortar, el monitor se vería pequeño en el hueco. */
const CAPTURAS = ["captura-login", "paper_works"];

/* Ilustraciones con fondo transparente de /nosotros: la chica del
   portátil (Canva) y el equipo en la oficina (`about_final`, de upklyak).
   Mismo perfil que los módulos: se ven a ~520px y se recortan los
   bordes vacíos. */
const ILUSTRACIONES = ["vector_chica", "about_final"];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

const fuentes = (await readdir(CARPETA)).filter((f) => /\.(jpe?g|png)$/i.test(f));

if (fuentes.length === 0) {
  console.log(`No hay JPG ni PNG que convertir en ${CARPETA}/.`);
  process.exit(0);
}

for (const archivo of fuentes) {
  const { name } = parse(archivo);
  const origen = join(CARPETA, archivo);
  const esObjeto = OBJETOS.includes(name);
  const esModulo = name.startsWith("modulo-") || ILUSTRACIONES.includes(name);
  const esCaptura = CAPTURAS.includes(name) || esObjeto;
  const perfil =
    /* Todo lo que empiece por "hero" (hero, hero-producto…) va a
       pantalla completa. */
    name.startsWith("hero") ? PERFILES.hero
    : esModulo ? PERFILES.modulo
    : esObjeto ? PERFILES.objeto
    : esCaptura ? PERFILES.captura
    : PERFILES.tarjeta;
  const antes = (await stat(origen)).size;

  for (const { sufijo, ancho, calidad } of perfil) {
    const destino = join(CARPETA, `${name}${sufijo}.webp`);
    /* `withoutEnlargement` evita reescalar hacia arriba una foto que ya
       venga pequeña: ampliarla solo añade peso y la deja blanda. */
    /* Solo se recorta si el PNG trae transparencia: en una captura
       opaca, `trim` usa el color de la esquina y podría comerse el
       borde de la propia pantalla. */
    const { hasAlpha } = await sharp(origen).metadata();
    /* Los módulos se recortan SIEMPRE: si vienen opacos es con fondo
       blanco liso (van sobre una forma blanca), y `trim` se come ese
       blanco. La foto de RRHH venía en un lienzo de 3175x4490 con el
       grupo pequeñito en medio. */
    const base = ((esCaptura && hasAlpha) || esModulo)
      ? sharp(await sharp(origen).trim({ threshold: 1 }).toBuffer())
      : sharp(origen);
    await base
      .resize({ width: ancho, withoutEnlargement: true })
      .webp({ quality: calidad, alphaQuality: 100 })
      .toFile(destino);

    const despues = (await stat(destino)).size;
    console.log(`${archivo} -> ${name}${sufijo}.webp  ${kb(antes)} → ${kb(despues)}`);
  }
}
