import { useRef, useState } from "react";
import { Contenedor, Eyebrow, Boton } from "../components/ui.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  MODULOS,
  HERO_PRODUCTO,
  BENEFICIOS,
  CLIENTES,
} from "../data/contenido.js";
import { ICONOS, IconFlecha } from "../components/Iconos.jsx";

/* ==================================================================
   PÁGINA: PRODUCTO  (/producto)

   EL ÁNGULO: la competencia vende nómina, facturación e inventario como
   sistemas SEPARADOS; My Business Panel lo trae todo en uno. Orden:

     1. Hero      — foto, título y una línea. Corto: solo lo necesario.
                    Termina en ARCO sobre la sección de módulos.
     2. Módulos   — "Conoce nuestros módulos": pestañas con foto a la
                    izquierda y la explicación a la derecha (patrón de
                    "Conoce nuestros espacios" de dohmi.com).
     3. Beneficios — "Menos sistemas, menos errores, más control": bento
                    sobre el degradado azul (estilo Airtek).
     4. Clientes  — "Nos adaptamos al tamaño de tu negocio": tres iconos
                    (emprendedor, pyme, grandes) que se abren en tarjeta
                    azul al pasar el ratón (patrón de Gálac).

   Los planes, el flujo entre módulos y la llamada final se quitaron
   (Samuel, 5 oct 2026). Los precios viven ahora en /tienda (TIENDA en
   contenido.js).

   Ritmo de fondos: foto → negro → degradado azul → blanco.
================================================================== */
export default function Producto() {
  return (
    <>
      <HeroProducto />
      <Modulos />
      <Beneficios />
      <Clientes />
    </>
  );
}

/* ------------------------------------------------------------------
   HERO DE /producto

   Corto a propósito: el alto lo marca el contenido (título, una línea y
   un botón), no la ventana. Quien llega aquí ya sabe a qué viene.

   LA FOTO va a sangre detrás, con un velo AZUL (`indigo-mid`) que entra desde la
   izquierda y se desvanece hacia la derecha: el texto se lee sobre la
   parte oscura y la foto respira en la otra mitad (patrón del hero de
   dohmi.com). Mientras no haya foto (`HERO_PRODUCTO.imagen` en null),
   queda el degradado de QuickBooks del hero de la home.

   EL ARCO de abajo no es un recorte del hero: es un SVG relleno del
   color de la sección siguiente (negro) que se monta encima del borde
   inferior. Así la curva sirve igual sobre foto que sobre degradado.
   Si cambia el fondo de "Módulos", cambia también el `fill` del arco.
------------------------------------------------------------------ */
function HeroProducto() {
  const { imagen, alt } = HERO_PRODUCTO;
  return (
    <section className="relative overflow-hidden bg-indigo-mid text-white">
      {imagen ? (
        <img
          src={`/img/${imagen}.webp`}
          srcSet={`/img/${imagen}-sm.webp 1080w, /img/${imagen}.webp 1920w`}
          sizes="100vw"
          alt={alt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-150 from-indigo-mid via-fondo-sky to-fondo-sky-light"
        />
      )}
      {/* FILTRO: oscuro y neutro, el MISMO de la cabecera de /tienda
          (6 oct 2026). Antes era un velo azul indigo-mid de izquierda a
          derecha; Samuel prefirió la foto con su color. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      {/* Sombra arriba, solo detrás de la barra: la barra es transparente
          con el texto blanco, y sobre la parte clara de la foto (la
          derecha) "Ayuda" y "Nosotros" se perdían. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/40 to-transparent"
      />

      <Contenedor className="relative pb-28 pt-36 sm:pb-32 sm:pt-40">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          My Business Panel
        </h1>
        {/* El subrayado de "un solo entorno" es el detalle del hero de
            dohmi ("abierta"): marca la promesa sin otro color de texto. */}
        <p className="mt-5 max-w-[30ch] font-[family-name:var(--font-poppins)] text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-snug text-white/90">
          Todo lo que necesitas para administrar, en{" "}
          <span className="underline decoration-azul-vivo decoration-[3px] underline-offset-[6px]">
            un solo entorno
          </span>
          .
        </p>
        <div className="mt-9">
          <Boton variante="blanco" href="#modulos">
            Conoce los módulos
          </Boton>
        </div>
      </Contenedor>

      {/* EL ARCO. `preserveAspectRatio="none"` estira la curva a todo el
          ancho sin perder la altura: a 1440px y a 375px es la misma
          bóveda suave. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-10 w-full fill-black sm:h-16"
      >
        <path d="M0 80V48Q720 -16 1440 48V80Z" />
      </svg>
    </section>
  );
}

/* ------------------------------------------------------------------
   BENEFICIOS (bento)

   La idea de la sección de beneficios de Gálac, contada con el carácter
   de Airtek: titular enorme con el tracking muy cerrado, cabecera
   partida (titular a la izquierda, entradilla abajo a la derecha) y una
   rejilla "bento" en vez de seis iconos iguales en fila.

     · La tarjeta BLANCA es la protagonista: el "5 en 1", que es el
       argumento de toda la página. Ocupa dos filas.
     · Las demás son de CRISTAL sobre el degradado: se leen, pero no le
       quitan el sitio a la blanca.
     · La última va ANCHA, a lo largo de la fila, para cerrar la rejilla
       sin un hueco suelto.

   Fondo: el degradado de QuickBooks (indigo → indigo-mid → sky-light),
   el mismo del hero de la home. Después del negro de los módulos, es el
   cambio de ritmo que hace que la sección se note.
------------------------------------------------------------------ */
function Beneficios() {
  const { eyebrow, titulo, texto, destacado, lista } = BENEFICIOS;
  const ancha = lista[lista.length - 1];
  const normales = lista.slice(0, -1);

  return (
    <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
      {/* Dos halos difuminados: dan profundidad al degradado y hacen que
          el cristal de las tarjetas tenga algo detrás que desenfocar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-azul-vivo/40 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-fondo-sky-light/40 blur-[120px]"
      />

      <Contenedor className="relative py-20 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow claro className="text-white/70!">{eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              {titulo}
            </h2>
          </Reveal>
          <Reveal retraso={0.08} className="lg:col-span-5">
            <p className="max-w-[44ch] text-[1.0625rem] leading-[1.65] text-white/75">{texto}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* LA PROTAGONISTA */}
          <Reveal
            as="li"
            className="flex flex-col rounded-[var(--radius-foto)] bg-white p-8 text-black shadow-[var(--shadow-destacado)] sm:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <p className="font-[family-name:var(--font-poppins)] text-[clamp(4rem,7vw,5.5rem)] font-black leading-none tracking-[-0.05em]">
              {destacado.cifra}
            </p>
            <h3 className="mt-6 text-2xl font-bold leading-tight tracking-[-0.02em]">{destacado.titulo}</h3>
            <p className="mt-3 leading-[1.65] text-body">{destacado.texto}</p>

            {/* Los cinco módulos, dentro de la misma tarjeta: el "todo en
                uno" se ve, no solo se dice. `mt-auto` los manda al pie. */}
            <ul className="mt-auto flex flex-wrap gap-2 pt-8">
              {MODULOS.map(({ id, icono, nombre }) => {
                const Icono = ICONOS[icono];
                return (
                  <li
                    key={id}
                    className="flex items-center gap-1.5 rounded-full bg-sky-tint px-3 py-1.5 text-xs font-bold text-sky"
                  >
                    <Icono className="h-3.5 w-3.5" />
                    {nombre}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {normales.map((beneficio, i) => (
            <Reveal as="li" key={beneficio.titulo} retraso={0.06 + (i % 2) * 0.08}>
              <TarjetaBeneficio {...beneficio} />
            </Reveal>
          ))}

          {/* LA ANCHA: icono y título a un lado, texto al otro. */}
          <Reveal as="li" retraso={0.1} className="sm:col-span-2 lg:col-span-3">
            <TarjetaBeneficio {...ancha} ancha />
          </Reveal>
        </ul>
      </Contenedor>
    </section>
  );
}

function TarjetaBeneficio({ icono, titulo, texto, ancha = false }) {
  const Icono = ICONOS[icono];
  return (
    <article
      className={`group h-full rounded-[var(--radius-foto)] bg-white/[0.07] p-7 ring-1 ring-white/15 backdrop-blur-md
                  transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/[0.12]
                  ${ancha ? "md:flex md:items-center md:gap-10" : ""}`}
    >
      <div className={ancha ? "flex shrink-0 items-center gap-4 md:w-[40%]" : ""}>
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-indigo-mid
                     transition-transform duration-300 group-hover:rotate-[-6deg]"
        >
          <Icono className="h-6 w-6" />
        </span>
        <h3 className={`text-xl font-bold leading-tight tracking-[-0.01em] ${ancha ? "" : "mt-6"}`}>{titulo}</h3>
      </div>
      <p className={`leading-[1.65] text-white/75 ${ancha ? "mt-4 md:mt-0" : "mt-3"}`}>{texto}</p>
    </article>
  );
}

/* ------------------------------------------------------------------
   CLIENTES: "NOS ADAPTAMOS AL TAMAÑO DE TU NEGOCIO"

   Patrón de la sección de perfiles de Gálac: título centrado a dos
   tonos y tres ICONOS grandes con su nombre. Al pasar el ratón por uno,
   se convierte en una tarjeta azul con la descripción y un botón.

   Hover no existe en el móvil ni con teclado, así que el icono es un
   <button> que también lo abre (tocar / Enter), y el foco lo abre
   igual. Solo hay una tarjeta abierta a la vez: `abierto` guarda su id.

   El cuadro comparativo de Gálac ("Descarga el cuadro comparativo") se
   añadirá debajo cuando estén definidos los paquetes.
------------------------------------------------------------------ */
function Clientes() {
  const { titulo, resaltado, texto, perfiles } = CLIENTES;
  const [abierto, setAbierto] = useState(null);

  return (
    <section className="relative bg-white">
      <Contenedor className="py-20 text-center sm:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-[24ch] text-balance text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-black">
            {titulo} <span className="text-azul-vivo">{resaltado}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-body">{texto}</p>
        </Reveal>

        {/* ---------- MÓVIL: tres casillas lado a lado + detalle ----------
            En móvil las tarjetas de giro no se entendían: un icono suelto
            sobre blanco no dice "tócame" (lo vio Samuel). Aquí van las
            TRES EN FILA, cada una en su recuadro, y el texto del perfil
            elegido se abre DEBAJO, en la tarjeta azul. Arranca con el
            primero abierto para que se vea qué pasa al tocar. */}
        <PerfilesMovil perfiles={perfiles} />

        <ul className="mx-auto mt-14 hidden max-w-[1000px] gap-5 sm:grid sm:grid-cols-3">
          {perfiles.map((perfil, i) => {
            const Icono = ICONOS[perfil.icono];
            const visible = abierto === perfil.id;
            return (
              <Reveal
                as="li"
                key={perfil.id}
                retraso={i * 0.1}
                className="relative h-[340px]"
                onMouseEnter={() => setAbierto(perfil.id)}
                onMouseLeave={() => setAbierto(null)}
                onFocus={() => setAbierto(perfil.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setAbierto(null);
                }}
              >
                {/* FRENTE: el icono y el nombre. */}
                <button
                  type="button"
                  aria-expanded={visible}
                  aria-controls={`perfil-${perfil.id}`}
                  onClick={() => setAbierto(visible ? null : perfil.id)}
                  className="flex h-full w-full flex-col items-center justify-center rounded-[var(--radius-foto)] text-indigo-mid"
                >
                  <Icono className="h-24 w-24" />
                  <span className="mt-6 font-[family-name:var(--font-poppins)] text-xl font-semibold text-black">
                    {perfil.nombre}
                  </span>
                </button>

                {/* DORSO: la tarjeta azul. Encima del frente, oculta
                    hasta que se abre. `invisible` además de la opacidad
                    para que su botón no se pueda enfocar estando oculto. */}
                <div
                  id={`perfil-${perfil.id}`}
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-[var(--radius-foto)]
                              bg-indigo-mid p-8 text-white shadow-[var(--shadow-destacado)]
                              transition-[opacity,transform,visibility] duration-300
                              ${visible ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
                >
                  <Icono className="h-10 w-10 text-white/60" />
                  <h3 className="mt-4 text-xl font-bold">{perfil.nombre}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.6] text-white/85">{perfil.texto}</p>
                  {/* A la tienda: hay un solo plan para todos los
                      tamaños, así que todos los perfiles llevan al mismo
                      sitio (antes abría el modal de contacto). */}
                  <Boton variante="blanco" className="mt-7 px-7! py-2.5! text-sm!" to="/tienda">
                    Me interesa
                  </Boton>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Contenedor>
    </section>
  );
}

function PerfilesMovil({ perfiles }) {
  const [elegido, setElegido] = useState(perfiles[0].id);
  const perfil = perfiles.find((p) => p.id === elegido);
  const IconoElegido = ICONOS[perfil.icono];

  return (
    <div className="mt-10 sm:hidden">
      <div role="tablist" aria-label="Tamaños de negocio" className="grid grid-cols-3 gap-2.5">
        {perfiles.map(({ id, nombre, icono }) => {
          const Icono = ICONOS[icono];
          const activo = id === elegido;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`perfil-movil-tab-${id}`}
              aria-selected={activo}
              aria-controls="perfil-movil"
              onClick={() => setElegido(id)}
              className={`flex flex-col items-center justify-center rounded-2xl px-1.5 py-4 transition-colors
                          ${activo ? "bg-indigo-mid text-white shadow-[var(--shadow-lift)]" : "bg-sky-tint text-indigo-mid ring-1 ring-mist"}`}
            >
              <Icono className="h-10 w-10" />
              <span
                className={`mt-2.5 font-[family-name:var(--font-poppins)] text-[0.8125rem] font-semibold leading-tight ${
                  activo ? "text-white" : "text-black"
                }`}
              >
                {nombre}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={perfil.id}
        id="perfil-movil"
        role="tabpanel"
        aria-labelledby={`perfil-movil-tab-${perfil.id}`}
        className="mt-3 animate-[subir_0.4s_cubic-bezier(0.22,1,0.36,1)] rounded-2xl bg-indigo-mid px-6 py-7 text-white"
      >
        <IconoElegido className="mx-auto h-8 w-8 text-white/60" />
        <h3 className="mt-3 text-lg font-bold">{perfil.nombre}</h3>
        <p className="mt-2 text-sm leading-[1.6] text-white/85">{perfil.texto}</p>
        <Boton variante="blanco" className="mt-5 px-7! py-2.5! text-sm!" to="/tienda">
          Me interesa
        </Boton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   CONOCE NUESTROS MÓDULOS

   Patrón de "Conoce nuestros espacios" de dohmi.com: título centrado,
   una fila de pestañas subrayadas y, debajo, la foto a la izquierda y
   la explicación a la derecha. Fondo NEGRO, como la maqueta de
   Samuel: las formas blancas resaltan más que sobre carbón. El arco del
   hero va del mismo negro.

   Las pestañas van en el orden de MODULOS (POS → Inventario → Compras →
   RRHH → Finanzas). Al cambiar, la foto y el texto entran de nuevo con
   la animación `subir`: el `key` del panel fuerza a remontarlo.

   Es un tablist de ARIA completo: flechas, Inicio y Fin mueven entre
   pestañas, y solo la activa entra en el orden del tabulador.
------------------------------------------------------------------ */
function Modulos() {
  const [activo, setActivo] = useState(0);
  const pestanas = useRef([]);
  const modulo = MODULOS[activo];

  function alPulsarTecla(e) {
    const ultimo = MODULOS.length - 1;
    const destinos = {
      ArrowRight: activo === ultimo ? 0 : activo + 1,
      ArrowLeft: activo === 0 ? ultimo : activo - 1,
      Home: 0,
      End: ultimo,
    };
    if (!(e.key in destinos)) return;
    e.preventDefault();
    setActivo(destinos[e.key]);
    pestanas.current[destinos[e.key]]?.focus();
  }

  return (
    <section id="modulos" className="relative bg-black text-white">
      <DefinicionesFormas />
      <Contenedor className="pb-20 pt-10 sm:pb-28 sm:pt-14">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            Conoce nuestros <span className="text-azul-vivo">módulos</span>
          </h2>
        </Reveal>

        {/* En escritorio las cinco pestañas se reparten a lo ancho, como
            en dohmi, subrayadas. En MÓVIL eran una fila con desplazamiento
            horizontal y no se notaba que había más módulos fuera de la
            pantalla (lo vio Samuel): ahora son PASTILLAS que saltan de
            línea, así se ven las cinco de un vistazo. */}
        <p className="mt-6 text-center text-sm text-white/60 lg:hidden">
          {MODULOS.length} módulos · toca uno para verlo
        </p>
        <div
          role="tablist"
          aria-label="Módulos de My Business Panel"
          onKeyDown={alPulsarTecla}
          className="mt-4 flex flex-wrap justify-center gap-2 lg:mt-10 lg:flex-nowrap lg:justify-between lg:gap-4 lg:pb-3"
        >
          {MODULOS.map(({ id, nombre }, i) => {
            const seleccionada = i === activo;
            return (
              <button
                key={id}
                ref={(el) => (pestanas.current[i] = el)}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={seleccionada}
                aria-controls={`panel-${id}`}
                tabIndex={seleccionada ? 0 : -1}
                onClick={() => setActivo(i)}
                /* Como en la maqueta de Samuel: TODAS en blanco y
                   subrayadas en blanco; la activa cambia el subrayado a
                   azul y lo engorda. No se apaga el texto de las demás. */
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-poppins)] text-xs font-bold
                            uppercase tracking-[0.02em] text-white ring-1 transition-[background-color,text-decoration-color]
                            sm:text-[0.8125rem]
                            lg:rounded-none lg:px-0 lg:py-1 lg:text-[0.9375rem] lg:underline lg:underline-offset-[10px] lg:ring-0
                            ${
                              seleccionada
                                ? "bg-azul-vivo ring-azul-vivo lg:bg-transparent lg:decoration-azul-vivo lg:decoration-[3px]"
                                : "ring-white/30 hover:ring-white/60 lg:decoration-white lg:decoration-2 lg:hover:decoration-azul-vivo/60"
                            }`}
              >
                {nombre}
              </button>
            );
          })}
        </div>

        <div
          key={modulo.id}
          role="tabpanel"
          id={`panel-${modulo.id}`}
          aria-labelledby={`tab-${modulo.id}`}
          tabIndex={0}
          className="mt-8 grid animate-[subir_0.5s_cubic-bezier(0.22,1,0.36,1)] items-center gap-8
                     lg:mt-16 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-6">
            <FotoModulo modulo={modulo} />
          </div>

          <div className="lg:col-span-6">
            <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold uppercase leading-tight tracking-[0.01em]">
              {modulo.nombre}
            </h3>
            <p className="mt-4 leading-[1.7] text-white/90">{modulo.general}</p>
            <p className="mt-4 leading-[1.7] text-white/75">{modulo.detalle}</p>

            <ul className="mt-7 space-y-3.5">
              {modulo.destacados.map((punto) => (
                <li key={punto} className="flex items-start gap-3.5">
                  {/* La flecha va en una PASTILLA alargada y no en un
                      círculo: es la de la maqueta. */}
                  <span className="grid h-6 w-10 shrink-0 place-items-center rounded-full text-azul-vivo ring-[1.5px] ring-azul-vivo">
                    <IconFlecha className="h-3.5 w-3.5" />
                  </span>
                  <span className="pt-0.5 leading-snug">{punto}</span>
                </li>
              ))}
            </ul>

            {/* Solo en móvil: al terminar de leer uno, el siguiente está
                a un toque y sin volver a subir hasta las pastillas. */}
            <button
              type="button"
              onClick={() => {
                setActivo((activo + 1) % MODULOS.length);
                document.getElementById("modulos")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black lg:hidden"
            >
              Siguiente: {MODULOS[(activo + 1) % MODULOS.length].nombre}
              <IconFlecha className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}

/* ------------------------------------------------------------------
   LAS FORMAS BLANCAS DE LOS MÓDULOS

   Las imágenes son RECORTES con fondo transparente, y varios vienen
   cortados por un borde (la mano del POS, la pareja de Compras, la mano
   de Finanzas). Cada forma está elegida para su recorte: la forma
   RECORTA la imagen (`overflow-hidden`) y, donde la foto viene cortada,
   tiene un borde recto que la recibe. Así el corte parece intencionado.

   `caja` es la silueta blanca y `img` cómo se coloca la imagen dentro.

     ticket      POS: una factura impresa, con el borde de abajo en olas.
                 La mano entra por el lado recto de la izquierda.
     hexagono    Inventario: la silueta de una caja vista en isométrico,
                 con las tres cajas enteras dentro.
     mancha      Compras: forma orgánica con la base PLANA, donde se
                 apoya la caja de la pareja (como la mancha detrás de la
                 alcancía de la referencia de Samuel).
     circulo     RRHH: el grupo entero dentro del círculo, con aire
                 alrededor. La mesa viene cortada en recto y ese corte
                 queda sobre el blanco, como el suelo de la escena.
     hoja        Finanzas: dos esquinas muy curvas y dos rectas; la mano
                 entra por la recta de abajo a la izquierda.

   Todas viven en un hueco CUADRADO del mismo tamaño, así la columna no
   salta de alto al cambiar de pestaña.

   ⚠️ El ticket y la mancha llevan curvas y no caben en un `polygon()`:
   son <clipPath> SVG en `objectBoundingBox` (coordenadas de 0 a 1,
   escalan con la caja) que pinta <DefinicionesFormas>. Si lo quitas,
   salen cuadradas.
------------------------------------------------------------------ */
const FORMAS = {
  ticket: {
    caja: "aspect-square w-full [clip-path:url(#forma-ticket)]",
    img: "object-contain object-left -translate-y-[3%]",
  },
  hexagono: {
    /* Al 88% del hueco y no a todo el ancho: a tamaño completo el
       rombo se veía enorme al lado de las otras formas, y al 72% se
       quedaba corto (Samuel). */
    caja: "aspect-square w-[88%] p-[10%] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]",
    img: "object-contain",
  },
  mancha: {
    caja: "aspect-square w-full px-[8%] pt-[12%] [clip-path:url(#forma-mancha)]",
    img: "object-contain object-bottom",
  },
  /* El grupo es apaisado (16:9): en `cover` el círculo se comería a
     las personas de los lados. Va casi a todo el ancho y BAJADO, para
     que el corte recto de la mesa quede fuera por abajo y el círculo
     se lea como una mirilla sobre la escena. */
  circulo: {
    caja: "relative aspect-square w-full rounded-full",
    img: "absolute! bottom-[-9%] left-1/2 h-auto! w-[122%]! max-w-none -translate-x-1/2",
  },
  hoja: {
    caja: "aspect-square w-full rounded-tl-[45%] rounded-br-[45%]",
    img: "object-contain object-left-bottom",
  },
};

/* Las siluetas que no se pueden escribir en CSS. Se pinta una vez, sin
   tamaño, y las formas las usan con `clip-path: url(#…)`. */
function DefinicionesFormas() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {/* El borde de abajo del ticket, en olas (4 crestas). */}
        <clipPath id="forma-ticket" clipPathUnits="objectBoundingBox">
          <path d="M0,0 H1 V0.93 Q0.9375,0.98 0.8750,0.93 T0.7500,0.93 T0.6250,0.93 T0.5000,0.93 T0.3750,0.93 T0.2500,0.93 T0.1250,0.93 T0.0000,0.93 Z" />
        </clipPath>
        <clipPath id="forma-mancha" clipPathUnits="objectBoundingBox">
          <path d="M0.04,1 C0,0.88 0.03,0.74 0.1,0.64 C0.19,0.52 0.06,0.36 0.16,0.2 C0.28,0.02 0.56,-0.03 0.76,0.08 C0.95,0.19 1.02,0.4 0.93,0.56 C0.86,0.69 0.99,0.86 0.96,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* Sin foto todavía, un hueco punteado que dice qué va ahí (el `alt`). */
function FotoModulo({ modulo }) {
  const { imagen, alt, nombre, icono, forma = "hoja" } = modulo;
  const Icono = ICONOS[icono];
  const { caja, img, sizes = "(min-width: 1024px) 440px, 90vw" } = FORMAS[forma];

  return (
    <div className="mx-auto grid aspect-square w-full max-w-[280px] place-items-center sm:max-w-[440px]">
      {imagen ? (
        <div className={`overflow-hidden bg-white ${caja}`}>
          <img
            src={`/img/${imagen}.webp`}
            srcSet={`/img/${imagen}-sm.webp 560w, /img/${imagen}.webp 1400w`}
            sizes={sizes}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${img}`}
          />
        </div>
      ) : (
        <div className="grid h-full w-full place-items-center border border-dashed border-white/20 bg-white/[0.03] p-8 text-center">
          <div>
            <Icono className="mx-auto h-10 w-10 text-white/30" />
            <p className="mt-4 text-sm text-white/50">
              Foto de {nombre.toLowerCase()}: {alt.charAt(0).toLowerCase() + alt.slice(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
