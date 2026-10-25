import { useEffect, useState } from "react";
import { ICONOS, IconPausa, IconPlay } from "../../components/Iconos.jsx";
import { SEGURIDAD_PORTAL } from "../../data/contenido.js";

/* ==================================================================
   CARRUSEL DE SEGURIDAD

   La mitad derecha de la pantalla de entrar, como la de Zoho: una
   ilustración, un título, un texto y los puntos abajo. Cuenta qué
   hacemos para proteger la cuenta mientras el cliente escribe.

   - Pasa SOLO cada 6 s, deslizándose de derecha a izquierda.
   - Se para un momento al pasar el ratón o al enfocar algo dentro
     (nadie quiere que el texto cambie mientras lo lee), y del todo con
     el botón de pausa: WCAG 2.2.2 lo exige en lo que se mueve solo.
   - Tocar un punto reinicia la cuenta de 6 s.

   ⚠️ `prefers-reduced-motion` NO lo detiene. Esa preferencia pide
   quitar el MOVIMIENTO, no que el contenido no cambie nunca (Windows
   la activa con "Efectos de animación" apagado, y con eso el carrusel
   se quedaba quieto en la primera). Con ella se quita el deslizamiento
   (`motion-safe:`) y queda solo el fundido.

   Las diapositivas están todas montadas, apiladas en la misma celda de
   la rejilla: la caja mide lo que la más alta y no salta al cambiar.
   Las ocultas llevan `inert` para que el teclado y el lector de
   pantalla no entren en ellas.
================================================================== */
const INTERVALO_CARRUSEL = 6000;

export default function CarruselSeguridad() {
  const [actual, setActual] = useState(0);
  const [encima, setEncima] = useState(false);
  const [detenido, setDetenido] = useState(false);
  const total = SEGURIDAD_PORTAL.length;

  // Un temporizador por diapositiva: al cambiar `actual` (sola o con un
  // punto) se arma uno nuevo, y por eso un clic reinicia la cuenta.
  useEffect(() => {
    if (encima || detenido) return;
    const id = setTimeout(() => setActual((i) => (i + 1) % total), INTERVALO_CARRUSEL);
    return () => clearTimeout(id);
  }, [actual, encima, detenido, total]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Cómo protegemos tu cuenta"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={() => setEncima(false)}
      className="flex h-full flex-col items-center justify-center overflow-hidden text-center"
    >
      <div className="grid">
        {SEGURIDAD_PORTAL.map(({ icono, titulo, texto }, i) => {
          const Icono = ICONOS[icono];
          // La que entra viene de la derecha; la que sale se va a la
          // izquierda. Se mide en círculo para que el salto de la última
          // a la primera también vaya hacia la izquierda.
          const distancia = (i - actual + total) % total;
          const posicion =
            distancia === 0
              ? "opacity-100"
              : distancia === total - 1
                ? "opacity-0 motion-safe:-translate-x-16"
                : "opacity-0 motion-safe:translate-x-16";
          return (
            <div
              key={titulo}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== actual}
              inert={i !== actual}
              className={`flex flex-col items-center transition-[opacity,translate] duration-700 ease-out [grid-area:1/1] ${posicion}`}
            >
              <Ilustracion Icono={Icono} />
              <h2 className="mt-9 text-xl font-semibold tracking-[-0.01em] text-black">{titulo}</h2>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-body">{texto}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-9 flex items-center gap-4">
        {/* Los puntos: el activo se estira en pastilla, como en Zoho. */}
        <div className="flex items-center gap-2">
          {SEGURIDAD_PORTAL.map(({ titulo }, i) => (
            <button
              key={titulo}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver: ${titulo}`}
              aria-current={i === actual ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === actual ? "w-7 bg-sky" : "w-2 bg-mist hover:bg-steel/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDetenido((d) => !d)}
          aria-label={detenido ? "Reanudar el carrusel" : "Pausar el carrusel"}
          className="grid h-7 w-7 place-items-center rounded-full text-steel transition-colors hover:bg-cloud hover:text-black"
        >
          {detenido ? <IconPlay className="h-3.5 w-3.5" /> : <IconPausa className="h-3.5 w-3.5" />}
        </button>
      </div>
    </section>
  );
}

/* La ilustración: el icono dentro de dos círculos concéntricos en el
   tinte de la marca, con un par de puntos sueltos alrededor. Ligera y
   sin imágenes: una por diapositiva saldría cara de mantener. */
function Ilustracion({ Icono }) {
  return (
    <div aria-hidden="true" className="relative grid h-48 w-48 place-items-center">
      <span className="absolute inset-0 rounded-full bg-sky-tint" />
      <span className="absolute inset-7 rounded-full bg-white shadow-[var(--shadow-card)]" />
      <span className="absolute right-3 top-6 h-3 w-3 rounded-full bg-azul-vivo" />
      <span className="absolute bottom-8 left-1 h-2 w-2 rounded-full bg-amarillo" />
      <span className="absolute -left-2 top-12 h-1.5 w-1.5 rounded-full bg-sky-light" />
      <Icono className="relative h-14 w-14 text-sky" />
    </div>
  );
}
