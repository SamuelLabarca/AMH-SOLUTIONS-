import { IconWhatsApp } from "./Iconos.jsx";
import { WHATSAPP } from "../data/contenido.js";

/* ==================================================================
   BOTÓN FLOTANTE DE WHATSAPP

   Fijo abajo a la derecha en TODAS las páginas (lo monta App.jsx), así
   acompaña al usuario mientras baja. Patrón del de innovasoftlatam.com:
   una pastilla con el logo y la palabra "WhatsApp".

   AZUL (el `sky` de los botones) y no verde: lo pidió Samuel, para que
   case con la marca de AMH y no con la de WhatsApp.

   En móvil queda solo el círculo con el logo: la pastilla entera tapa
   demasiado contenido en una pantalla estrecha.

   Va en z-40: por debajo de la barra (z-50) y del modal de contacto
   (z-100), que tienen que quedar por encima cuando se abren.
================================================================== */
export default function BotonWhatsApp() {
  const { numero, mensaje } = WHATSAPP;
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-sky p-3.5 text-white
                 shadow-[var(--shadow-lift)] transition-[background-color,transform] duration-200
                 hover:-translate-y-0.5 hover:bg-sky-light sm:bottom-7 sm:right-7 sm:py-3.5 sm:pl-4 sm:pr-6"
    >
      <IconWhatsApp className="h-6 w-6" />
      <span className="hidden text-base font-bold sm:inline">WhatsApp</span>
    </a>
  );
}
