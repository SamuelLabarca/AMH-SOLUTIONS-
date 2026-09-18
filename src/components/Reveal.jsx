import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   SCROLL REVEAL (CLAUDE.md §8)

   Envuelve contenido y lo hace aparecer con fade-up al entrar en la
   ventana. El estado de partida (opacidad 0, desplazado) vive en el CSS,
   en `.reveal`; aquí solo se añade `.es-visible`.

   ⚠️ El observador se DESCONECTA en cuanto dispara. Sin eso, el bloque
   volvería a desvanecerse al salir por arriba y reaparecería al subir,
   que es un efecto de baratillo y además molesta al leer.

   `rootMargin` negativo por abajo: la animación arranca cuando el bloque
   ya ha entrado ~12% en pantalla, no cuando asoma su primer píxel.
------------------------------------------------------------------ */
export default function Reveal({
  children,
  /* Retraso en segundos. Sirve para escalonar los hijos de una rejilla y
     que no aparezcan todos de golpe. */
  retraso = 0,
  as: Etiqueta = "div",
  className = "",
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    /* Navegadores sin IntersectionObserver: se muestra sin animar. Es
       preferible a dejar el contenido invisible para siempre. */
    if (typeof IntersectionObserver === "undefined") {
      nodo.classList.add("es-visible");
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        nodo.classList.add("es-visible");
        observador.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={`reveal ${className}`}
      style={retraso ? { transitionDelay: `${retraso}s` } : undefined}
      {...props}
    >
      {children}
    </Etiqueta>
  );
}
