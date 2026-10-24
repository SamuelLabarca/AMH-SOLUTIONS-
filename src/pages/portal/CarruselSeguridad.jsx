import { useEffect, useState } from "react";
import { ICONOS } from "../../components/Iconos.jsx";
import { SEGURIDAD_PORTAL } from "../../data/contenido.js";

/* ==================================================================
   CARRUSEL DE SEGURIDAD

   La mitad derecha de la pantalla de entrar, como la de Zoho: una
   ilustración, un título, un texto y los puntos abajo. Cuenta qué
   hacemos para proteger la cuenta mientras el cliente escribe.

   - Pasa solo cada 6 s, y se PARA al pasar el ratón o al enfocar un
     punto: nadie quiere que el texto se le cambie mientras lo lee.
   - Con `prefers-reduced-motion` no pasa solo; se cambia con los puntos.
   - Las diapositivas están todas montadas, apiladas en la misma celda
     de la rejilla: así la caja mide lo que la más alta y no salta al
     cambiar. Las ocultas llevan `inert` para que el teclado y el lector
     de pantalla no entren en ellas.
================================================================== */
const INTERVALO = 6000;

export default function CarruselSeguridad() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = SEGURIDAD_PORTAL.length;

  useEffect(() => {
    if (pausado || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActual((i) => (i + 1) % total), INTERVALO);
    return () => clearInterval(id);
  }, [pausado, total]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Cómo protegemos tu cuenta"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <div className="grid">
        {SEGURIDAD_PORTAL.map(({ icono, titulo, texto }, i) => {
          const Icono = ICONOS[icono];
          const visible = i === actual;
          return (
            <div
              key={titulo}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={!visible}
              inert={!visible}
              className={`flex flex-col items-center transition-opacity duration-500 [grid-area:1/1] ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              <Ilustracion Icono={Icono} />
              <h2 className="mt-9 text-xl font-semibold tracking-[-0.01em] text-black">{titulo}</h2>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-body">{texto}</p>
            </div>
          );
        })}
      </div>

      {/* Los puntos: el activo se estira en pastilla, como en Zoho. */}
      <div className="mt-9 flex items-center gap-2">
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
