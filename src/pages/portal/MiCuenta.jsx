import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconCheck } from "../../components/Iconos.jsx";
import { PasoPago } from "../../components/tienda.jsx";
import { dolares } from "../../utils/dinero.js";
import { ErrorApi, MODO_DEMO } from "../../servicios/api.js";
import { obtenerCuenta, reportarFormulario } from "../../servicios/portalPagos.js";
import { useSesion } from "../../sesion/Sesion.jsx";
import { Aviso, Pantalla } from "./piezas.jsx";

/* ==================================================================
   MI CUENTA: el desglose y el pago

   Solo con sesión. La cuenta se pide sin ningún dato en la URL: el
   backend sabe quién eres por la cookie, así que nadie puede ver las
   suscripciones de otro.

   Pagar NO activa nada desde aquí: el backend confirma el pago y es él
   quien cambia el estado de la suscripción.
================================================================== */
export default function MiCuenta() {
  const { usuario, cerrarSesion, sesionVencida } = useSesion();
  const [cuenta, setCuenta] = useState({ estado: "cargando" });
  const [pagando, setPagando] = useState(null);
  const [reportado, setReportado] = useState(false);

  useEffect(() => {
    const control = new AbortController();
    obtenerCuenta({ signal: control.signal })
      .then((datos) => setCuenta({ estado: "lista", suscripciones: datos.suscripciones }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        if (error instanceof ErrorApi && error.estado === 401) sesionVencida();
        else setCuenta({ estado: "error" });
      });
    return () => control.abort();
  }, [sesionVencida]);

  return (
    <Pantalla eyebrow={usuario.documento} titulo={`Hola, ${primerNombre(usuario.nombre)}`} ancho="max-w-2xl">
      <div className="mb-7 flex items-center justify-between gap-4 border-b border-mist pb-5 text-sm">
        <span className="min-w-0 truncate text-steel">{usuario.correo}</span>
        <button type="button" onClick={cerrarSesion} className="shrink-0 font-semibold text-sky hover:text-sky-light">
          Cerrar sesión
        </button>
      </div>

      {cuenta.estado === "cargando" && <p className="py-8 text-center text-steel">Cargando tus suscripciones…</p>}
      {cuenta.estado === "error" && <Aviso>No pudimos cargar tus suscripciones. Recarga la página en unos segundos.</Aviso>}

      {cuenta.estado === "lista" &&
        (reportado ? (
          <Confirmacion correo={usuario.correo} />
        ) : pagando ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">Paga {dolares(pagando.monto)}</h2>
                <p className="mt-1.5 text-[0.9375rem] text-steel">{pagando.concepto}</p>
              </div>
              <button
                type="button"
                onClick={() => setPagando(null)}
                className="shrink-0 text-sm font-medium text-sky hover:text-sky-light"
              >
                Cambiar
              </button>
            </div>
            <div className="mt-7">
              <PasoPago
                orden={pagando}
                onReportado={() => setReportado(true)}
                reportar={MODO_DEMO ? undefined : (metodo, datos) => enviarReporte(metodo, datos, pagando, sesionVencida)}
              />
            </div>
          </>
        ) : (
          <Desglose
            suscripciones={cuenta.suscripciones}
            alPagar={(seleccion) =>
              setPagando({
                concepto: seleccion.map((s) => `${s.plan} (${s.ciclo.toLowerCase()})`).join(" + "),
                monto: seleccion.reduce((suma, s) => suma + s.monto, 0),
                cliente: { nombre: usuario.nombre, documento: usuario.documento, correo: usuario.correo },
                suscripciones: seleccion.map((s) => s.id),
              })
            }
          />
        ))}
    </Pantalla>
  );
}

/* Envía el reporte a la API (PasoPago muestra el mensaje si falla). */
async function enviarReporte(metodo, datos, orden, sesionVencida) {
  try {
    await reportarFormulario(metodo, datos, orden.suscripciones);
  } catch (e) {
    if (e.sinSesion) sesionVencida();
    throw e;
  }
}

/* ------------------------------------------------------------------
   EL DESGLOSE. Vienen marcadas las que hay que pagar (vencidas, por
   vencer o suspendidas); las activas se pueden marcar para adelantar
   la renovación.
------------------------------------------------------------------ */
const ESTADOS = {
  pendiente: { texto: "Pendiente de pago", clase: "bg-amarillo/35 text-ink" },
  activa: { texto: "Activa", clase: "bg-sky-tint text-sky" },
  "por-vencer": { texto: "Por vencer", clase: "bg-amarillo/35 text-ink" },
  vencida: { texto: "Vencida", clase: "bg-ink text-white" },
  suspendida: { texto: "Suspendida", clase: "bg-mist text-steel" },
};

function Desglose({ suscripciones, alPagar }) {
  const [elegidas, setElegidas] = useState(
    () => new Set(suscripciones.filter((s) => s.estado !== "activa").map((s) => s.id)),
  );

  if (suscripciones.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="leading-[1.65] text-body">Todavía no tienes suscripciones.</p>
        <Link
          to="/tienda"
          className="mt-6 inline-flex rounded-full bg-sky px-7 py-3 font-bold text-white transition-colors hover:bg-sky-light"
        >
          Ver planes en la tienda
        </Link>
      </div>
    );
  }

  const seleccion = suscripciones.filter((s) => elegidas.has(s.id));
  const total = seleccion.reduce((suma, s) => suma + s.monto, 0);

  function alternar(id) {
    setElegidas((antes) => {
      const despues = new Set(antes);
      if (despues.has(id)) despues.delete(id);
      else despues.add(id);
      return despues;
    });
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-black">Elige qué quieres pagar</h2>
      <ul className="mt-4 space-y-3">
        {suscripciones.map((s) => {
          const estado = ESTADOS[s.estado] ?? ESTADOS.activa;
          return (
            <li key={s.id}>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl bg-cloud p-4 ring-1 ring-mist transition-colors has-checked:bg-sky-tint/60 has-checked:ring-sky sm:p-5">
                <input
                  type="checkbox"
                  checked={elegidas.has(s.id)}
                  onChange={() => alternar(s.id)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-sky"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-black">{s.plan}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${estado.clase}`}>{estado.texto}</span>
                  </span>
                  <span className="mt-1 block text-sm text-steel">
                    {s.producto} · {s.ciclo} · {s.estado === "vencida" ? "venció" : "vence"} el {fecha(s.vence)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-black">{dolares(s.monto)}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex items-baseline justify-between border-t border-mist pt-5">
        <span className="text-body">Total a pagar</span>
        <span className="text-3xl font-medium tracking-[-0.02em] text-black">{dolares(total)}</span>
      </div>

      <button
        type="button"
        disabled={seleccion.length === 0}
        onClick={() => alPagar(seleccion)}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-not-allowed disabled:bg-mist disabled:text-steel"
      >
        Continuar al pago
      </button>
    </>
  );
}

function Confirmacion({ correo }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-tint text-sky">
        <IconCheck className="h-7 w-7" />
      </span>
      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-black">¡Recibimos tu reporte!</h2>
      <p className="mx-auto mt-3 max-w-[40ch] leading-[1.65] text-body">
        Verificamos el pago y tu suscripción se activa en cuanto se confirme. Te avisamos a {correo}.
      </p>
    </div>
  );
}

/* "María González" → "María". Para una empresa se deja entera. */
function primerNombre(nombre) {
  return /,|C\.A\.|S\.A\./i.test(nombre) ? nombre : nombre.split(" ")[0];
}

/* "2026-10-15" → "15 de octubre de 2026". A mediodía para que la zona
   horaria no la mueva al día anterior. */
function fecha(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" });
}
