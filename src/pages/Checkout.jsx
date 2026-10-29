import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Contenedor } from "../components/ui.jsx";
import { WHATSAPP } from "../data/contenido.js";
import { useProductoTienda } from "../hooks/useTienda.js";
import { IconCheck, IconWhatsApp } from "../components/Iconos.jsx";
import { Pasos, PasoPago, ahorro, desglose, dolares } from "../components/tienda.jsx";
import { MODO_DEMO } from "../servicios/api.js";
import { reportarFormulario } from "../servicios/portalPagos.js";
import { ProveedorSesion } from "./portal/Sesion.jsx";
import FormularioDatos from "./checkout/FormularioDatos.jsx";
import PasoCuenta from "./checkout/PasoCuenta.jsx";

/* ==================================================================
   PÁGINA: CHECKOUT  (/tienda/checkout?pago=anual)

   El reparto del checkout de QuickBooks: el formulario a la izquierda y
   "Tu cesta" a la derecha, fija al hacer scroll. Dos pasos dentro de la
   misma página (2 Tu cuenta → 3 Pago) y una confirmación al final.

   CON BACKEND: el paso 2 entra o crea la cuenta y la API crea la ORDEN
   con su precio; el pago se reporta a la API contra esa orden. Al
   aprobarlo el equipo, la suscripción se activa sola.

   EN MODO DEMOSTRACIÓN (sin VITE_API_URL): no se crea nada; los datos
   viajan en el reporte de pago por WhatsApp, como antes.
================================================================== */
export default function Checkout() {
  // La sesión solo hace falta con backend; es la misma cookie del portal.
  return MODO_DEMO ? (
    <PaginaCheckout />
  ) : (
    <ProveedorSesion>
      <PaginaCheckout enLinea />
    </ProveedorSesion>
  );
}

function PaginaCheckout({ enLinea = false }) {
  const [params] = useSearchParams();
  // Los textos salen de contenido.js; los precios y el IVA, de la API.
  const { producto, iva } = useProductoTienda();
  const { pagos } = producto;
  const pago = pagos.find((p) => p.id === params.get("pago")) ?? pagos.find((p) => p.destacado) ?? pagos[0];

  const [paso, setPaso] = useState(2);
  const [cliente, setCliente] = useState(null);
  const [orden, setOrden] = useState(null); // la del servidor (con backend)
  const [reportado, setReportado] = useState(null);

  function avanzar() {
    setPaso(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Modo demostración: los datos solo se guardan para el mensaje de WhatsApp.
  function alEnviarDatos(evento) {
    evento.preventDefault();
    const d = new FormData(evento.currentTarget);
    setCliente({
      nombre: `${d.get("nombre")} ${d.get("apellido")}`.trim(),
      empresa: d.get("empresa") || null,
      documento: `${d.get("tipoDocumento")}-${String(d.get("documento")).replace(/[^\dA-Za-z-]/g, "")}`,
      correo: d.get("correo"),
      telefono: d.get("telefono"),
    });
    avanzar();
  }

  // Con backend: la orden ya existe y su total es el que se cobra.
  function alTenerOrden(nueva, usuario) {
    setOrden(nueva);
    setCliente({ nombre: usuario.nombre, documento: usuario.documento, correo: usuario.correo });
    avanzar();
  }

  const cuentas = desglose(pago.precio, iva);
  // Lo que se cobra: con orden, lo que dijo el servidor; si no, el cálculo local.
  const total = orden ? orden.total : (cuentas?.total ?? null);

  return (
    <section className="bg-cloud">
      {/* Franja oscura arriba para que la barra (transparente con texto
          blanco) se lea, igual que en el resto de páginas. */}
      <div className="bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light">
        <Contenedor className="pb-10 pt-32 sm:pt-36">
          <Pasos actual={reportado ? 4 : paso} claro />
        </Contenedor>
      </div>

      <Contenedor className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
        {/* ---------------- IZQUIERDA: el paso ---------------- */}
        <div className="lg:col-span-7">
          <div className="rounded-[var(--radius-foto)] bg-white p-7 shadow-[var(--shadow-card)] sm:p-10">
            {reportado ? (
              <Confirmacion enlace={reportado.enlace} cliente={cliente} enLinea={enLinea} />
            ) : paso === 2 ? (
              enLinea ? (
                <PasoCuenta producto={producto.id} opcion={pago.id} alListo={alTenerOrden} />
              ) : (
                <FormularioDatos alEnviar={alEnviarDatos} inicial={cliente} />
              )
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black">Paga tu plan</h1>
                    <p className="mt-1.5 text-[0.9375rem] text-steel">
                      Paga desde tu banco y reporta el pago. Lo verificamos y activamos tu cuenta.
                    </p>
                  </div>
                  {/* Con backend la cuenta y la orden ya existen: no se
                      vuelve a editar desde aquí. */}
                  {!enLinea && (
                    <button
                      type="button"
                      onClick={() => setPaso(2)}
                      className="shrink-0 text-sm font-medium text-sky hover:text-sky-light"
                    >
                      Editar mis datos
                    </button>
                  )}
                </div>
                <div className="mt-7">
                  <PasoPago
                    orden={{
                      concepto: `${producto.marca} · ${producto.plan.nombre} · pago ${pago.nombre.toLowerCase()}`,
                      monto: total,
                      cliente,
                    }}
                    onReportado={(enlace) => setReportado({ enlace })}
                    reportar={
                      enLinea ? (metodo, datos) => reportarFormulario(metodo, datos, [orden.suscripcion]) : undefined
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---------------- DERECHA: la cesta ---------------- */}
        <aside className="lg:col-span-5">
          <div className="rounded-[var(--radius-foto)] bg-white p-7 shadow-[var(--shadow-card)] ring-1 ring-mist sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">Tu cesta</h2>

            {/* El plan elegido en la tienda, FIJO: aquí ya no se cambia la
                forma de pago (lo pidió Samuel). Para cambiarla se vuelve a
                la tienda con "Editar", como en el checkout de QuickBooks. */}
            <div className="mt-6 flex items-center justify-between font-sans text-sm">
              <span className="text-steel">Plan de {producto.marca}</span>
              {!reportado && (
                <Link to="/tienda" className="font-medium text-sky underline-offset-2 hover:underline">
                  Editar
                </Link>
              )}
            </div>
            <div className="mt-2 flex items-start justify-between gap-4 font-sans">
              <div>
                <span className="block font-semibold text-black">{producto.plan.nombre}</span>
                <span className="block text-sm text-steel">Pago {pago.nombre.toLowerCase()}</span>
              </div>
              <div className="shrink-0 whitespace-nowrap text-right">
                {pago.precio ? (
                  <>
                    <span className="font-medium text-black">{dolares(orden?.precio ?? pago.precio)}</span>
                    <span className="text-sm text-steel"> / {pago.cada}</span>
                    {ahorro(pago, pagos) && (
                      <span className="mt-0.5 block text-xs text-steel">Ahorras {ahorro(pago, pagos)}% frente al mensual</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-steel">A consultar</span>
                )}
              </div>
            </div>

            <dl className="mt-6 space-y-2 border-t border-mist pt-5 text-[0.9375rem]">
              {(orden?.iva ?? iva) && total ? (
                <>
                  <Linea etiqueta="Subtotal" valor={dolares(orden?.precio ?? cuentas.subtotal)} />
                  <Linea etiqueta={`IVA (${orden?.iva ?? iva}%)`} valor={dolares(orden?.impuesto ?? cuentas.impuesto)} />
                </>
              ) : null}
              <div className="flex items-baseline justify-between pt-2">
                <dt className="font-sans text-body">Total a pagar hoy</dt>
                <dd className="font-sans text-3xl font-medium tracking-[-0.02em] text-black">
                  {total ? dolares(total) : <span className="text-xl">A consultar</span>}
                </dd>
              </div>
            </dl>

            {!total && (
              <p className="mt-4 rounded-xl bg-sky-tint px-4 py-3 text-sm leading-snug text-body">
                Te confirmamos el monto exacto antes de que pagues.{" "}
                <a
                  href={`https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(
                    `Hola, quiero saber el precio de My Business Panel con pago ${pago.nombre.toLowerCase()}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sky hover:text-sky-light"
                >
                  Pregúntanos por WhatsApp
                </a>
              </p>
            )}

            <Link to="/tienda" className="mt-6 block text-center text-sm font-semibold text-steel hover:text-black">
              ← Volver a la tienda
            </Link>
          </div>
        </aside>
      </Contenedor>
    </section>
  );
}

function Linea({ etiqueta, valor }) {
  return (
    <div className="flex justify-between">
      <dt className="text-steel">{etiqueta}</dt>
      <dd className="font-medium text-black">{valor}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------
   CONFIRMACIÓN. Sin backend, el enlace de WhatsApp se ofrece otra vez
   por si el navegador bloqueó la pestaña. Con backend el reporte ya
   llegó a la API: se manda al cliente a su cuenta del portal.
------------------------------------------------------------------ */
function Confirmacion({ enlace, cliente, enLinea }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-tint text-sky">
        <IconCheck className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-black">¡Recibimos tu reporte!</h1>
      <p className="mx-auto mt-3 max-w-[40ch] leading-[1.65] text-body">
        {enLinea
          ? `Verificamos el pago y tu plan se activa en cuanto se confirme. Te avisamos a ${cliente?.correo}.`
          : `Verificamos el pago y te escribimos a ${cliente?.correo} y por WhatsApp para activar tu cuenta.`}
      </p>
      <p className="mx-auto mt-2 max-w-[40ch] text-sm text-steel">
        Con tu correo y contraseña entras al portal de pagos para ver tu plan y renovarlo.
      </p>
      {enLinea ? (
        <Link
          to="/portal-de-pagos"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky px-7 py-3 font-bold text-white transition-colors hover:bg-sky-light"
        >
          Ir a mi cuenta
        </Link>
      ) : (
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky px-7 py-3 font-bold text-white transition-colors hover:bg-sky-light"
        >
          <IconWhatsApp className="h-5 w-5" />
          Abrir WhatsApp otra vez
        </a>
      )}
    </div>
  );
}
