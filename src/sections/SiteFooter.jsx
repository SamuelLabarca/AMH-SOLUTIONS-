import { Link } from "react-router-dom";
import { Contenedor } from "../components/ui.jsx";
import { useContacto } from "../components/Contacto.jsx";
import { IconFlecha } from "../components/Iconos.jsx";

/* ==================================================================
   FOOTER

   El ink (#16273F), el más oscuro de la escala. Va a sangre y sin radio:
   es el suelo de la página, y una tarjeta redondeada flotando al final
   dejaría una franja de lienzo gris debajo que parece un error.
================================================================== */

const COLUMNAS = [
  {
    titulo: "Empresa",
    enlaces: [
      { etiqueta: "Nosotros", destino: "/#nosotros" },
      { etiqueta: "Servicios", destino: "/#servicios" },
      { etiqueta: "Producto y planes", destino: "/producto", ruta: true },
    ],
  },
  {
    titulo: "Soporte",
    enlaces: [
      { etiqueta: "Centro de ayuda", destino: "#" },
      { etiqueta: "Estado del servicio", destino: "#" },
      { etiqueta: "Documentación", destino: "#" },
    ],
  },
  {
    titulo: "Legal",
    enlaces: [
      { etiqueta: "Privacidad", destino: "#" },
      { etiqueta: "Términos de servicio", destino: "#" },
      { etiqueta: "Tratamiento de datos", destino: "#" },
    ],
  },
];

export default function SiteFooter() {
  const { abrir } = useContacto();

  return (
    <footer className="mt-3 bg-ink text-white sm:mt-4">
      <Contenedor className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- MARCA ----------------
              4+2+2+2+2 = 12. La de "Escríbenos" necesita DOS columnas: el
              correo es una sola palabra que no se puede partir, y en una
              sola columna desbordaba la página a lo ancho. */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sm font-black">
                A
              </span>
              AMH Solutions
            </Link>
            <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/55">
              Construimos My Business Panel: CRM, inventario y finanzas en una sola
              herramienta, pensada para negocios que quieren dejar de improvisar.
            </p>

            <button
              type="button"
              onClick={abrir}
              className="group mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 py-2.5 pl-5 pr-4 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              Contacta nuestros servicios
              <IconFlecha className="h-4 w-4 text-sky-light transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* ---------------- COLUMNAS ---------------- */}
          {COLUMNAS.map(({ titulo, enlaces }) => (
            <nav key={titulo} className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                {titulo}
              </h3>
              <ul className="mt-5 space-y-3">
                {enlaces.map(({ etiqueta, destino, ruta }) => (
                  <li key={etiqueta}>
                    {ruta ? (
                      <Link
                        to={destino}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {etiqueta}
                      </Link>
                    ) : (
                      <a
                        href={destino}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {etiqueta}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ---------------- CONTACTO DIRECTO ---------------- */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Escríbenos
            </h3>
            <a
              href="mailto:soporte@amhsolutions.com"
              className="mt-5 block break-all text-sm text-white/70 transition-colors hover:text-white"
            >
              soporte@amhsolutions.com
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AMH Solutions. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">Hecho en Venezuela.</p>
        </div>
      </Contenedor>
    </footer>
  );
}
