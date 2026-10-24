import { useEffect, useRef, useState } from "react";
import { Contenedor, Eyebrow } from "../components/ui.jsx";
import { IconCheck, IconFlecha } from "../components/Iconos.jsx";
import { PasoPago, dolares } from "../components/tienda.jsx";
import { WHATSAPP } from "../data/contenido.js";
import { CuentaNoEncontrada, MODO_DEMO, consultarCuenta, normalizarDocumento } from "../servicios/portalPagos.js";

/* ==================================================================
   PÁGINA: PORTAL DE PAGOS  (/portal-de-pagos)

   El puente entre el cliente y My Business Panel:
   1. Escribe su cédula o RIF en la pastilla del centro.
   2. Ve sus suscripciones y elige qué pagar.
   3. Paga con <PasoPago>, la MISMA pantalla de cobro del checkout.

   Pagar NO activa nada desde aquí: el backend confirma el pago y es él
   quien cambia el estado de la suscripción. La página solo consulta y
   reporta.
================================================================== */
const LETRAS = ["V", "E", "J", "G", "P"];

export default function PortalPagos() {
  const [consulta, setConsulta] = useState({ estado: "inicio" });
  const [pagando, setPagando] = useState(null);
  const [reportado, setReportado] = useState(false);
  const peticion = useRef(null);
  const resultado = useRef(null);

  // Cancela la consulta en vuelo si se sale de la página.
  useEffect(() => () => peticion.current?.abort(), []);

  async function alConsultar(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const documento = normalizarDocumento(datos.get("letra"), datos.get("numero"));

    // Una consulta nueva anula la anterior: si respondiera tarde,
    // pintaría la cuenta equivocada.
    peticion.current?.abort();
    const control = new AbortController();
    peticion.current = control;

    setPagando(null);
    setReportado(false);
    setConsulta({ estado: "cargando", documento });
    try {
      const cuenta = await consultarCuenta(documento, { signal: control.signal });
      setConsulta({ estado: "cuenta", documento, cuenta });
    } catch (error) {
      if (error.name === "AbortError") return;
      setConsulta({ estado: error instanceof CuentaNoEncontrada ? "no-encontrada" : "error", documento });
    }
  }

  // Al llegar la respuesta se baja hasta ella: en móvil queda fuera de vista.
  useEffect(() => {
    if (consulta.estado === "cuenta") resultado.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [consulta.estado]);

  return (
    <>
      {/* ---------------- CABECERA: la pastilla ----------------
          Oscura a propósito: la barra es transparente con texto blanco
          arriba del todo. Todo centrado: aquí solo se viene a una cosa. */}
      <section className="relative overflow-hidden bg-linear-150 from-indigo via-indigo-mid to-fondo-sky-light text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-fondo-sky-light/40 blur-[120px]"
        />
        <Contenedor className="relative flex min-h-[78vh] flex-col items-center justify-center pb-24 pt-36 text-center sm:pt-40">
          <Eyebrow claro className="text-white/70!">
            Portal de pagos
          </Eyebrow>
          <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.98] tracking-[-0.04em]">
            Paga tu suscripción
          </h1>
          <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-white/80">
            Escribe tu cédula o RIF para ver tus planes y pagar lo pendiente.
          </p>

          <PastillaDocumento alEnviar={alConsultar} cargando={consulta.estado === "cargando"} />

          <div className="mt-5 min-h-6 text-sm" aria-live="polite">
            {consulta.estado === "no-encontrada" && (
              <p className="text-white">
                No encontramos una cuenta con <strong className="font-bold">{consulta.documento}</strong>. Revisa el
                número o{" "}
                <a href={enlaceAyuda(consulta.documento)} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                  escríbenos
                </a>
                .
              </p>
            )}
            {consulta.estado === "error" && (
              <p className="text-white">No pudimos consultar tu cuenta. Inténtalo de nuevo en unos segundos.</p>
            )}
            {consulta.estado === "inicio" && MODO_DEMO && (
              <p className="text-white/60">Modo demostración: prueba con V-12345678 o J-123456789.</p>
            )}
          </div>
        </Contenedor>
      </section>

      {/* ---------------- LA CUENTA ---------------- */}
      {consulta.estado === "cuenta" && (
        <section ref={resultado} className="scroll-mt-24 bg-cloud">
          <Contenedor className="py-14 sm:py-20">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-foto)] bg-white p-7 shadow-[var(--shadow-card)] sm:p-10">
              {reportado ? (
                <Confirmacion cliente={consulta.cuenta.cliente} />
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
                    <PasoPago orden={pagando} onReportado={() => setReportado(true)} />
                  </div>
                </>
              ) : (
                <Cuenta cuenta={consulta.cuenta} alPagar={setPagando} />
              )}
            </div>
          </Contenedor>
        </section>
      )}
    </>
  );
}

/* ------------------------------------------------------------------
   LA PASTILLA. Letra + número + botón dentro de una sola cápsula blanca,
   como el buscador de un banco. La letra va aparte porque así se
   escribe aquí (V-12345678) y el número solo admite dígitos.
------------------------------------------------------------------ */
function PastillaDocumento({ alEnviar, cargando }) {
  return (
    <form
      onSubmit={alEnviar}
      role="search"
      aria-label="Consultar cuenta por cédula o RIF"
      className="mt-9 flex w-full max-w-xl items-center rounded-full bg-white p-1.5 shadow-[var(--shadow-lift)] ring-1 ring-white/20 focus-within:ring-4 focus-within:ring-sky-light/50"
    >
      <select
        name="letra"
        defaultValue="V"
        aria-label="Tipo de documento"
        className="h-12 shrink-0 cursor-pointer rounded-full bg-smoke pl-4 pr-2 text-[0.9375rem] font-bold text-ink focus:outline-none"
      >
        {LETRAS.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <input
        name="numero"
        required
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9.\s]{5,12}"
        title="Solo números, entre 5 y 9 dígitos"
        placeholder="Cédula o RIF"
        aria-label="Número de cédula o RIF"
        className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base font-semibold text-black placeholder:font-medium placeholder:text-steel/70 focus:outline-none sm:px-4"
      />
      <button
        type="submit"
        disabled={cargando}
        className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-sky px-5 text-[0.9375rem] font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-wait disabled:opacity-80 sm:px-7"
      >
        {cargando ? "Consultando…" : "Consultar"}
        {!cargando && <IconFlecha className="hidden h-4 w-4 sm:block" />}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------
   LA CUENTA: el desglose de suscripciones. Vienen marcadas las que hay
   que pagar (vencidas, por vencer o suspendidas); las activas se
   pueden marcar para adelantar la renovación.
------------------------------------------------------------------ */
const ESTADOS = {
  activa: { texto: "Activa", clase: "bg-sky-tint text-sky" },
  "por-vencer": { texto: "Por vencer", clase: "bg-amarillo/35 text-ink" },
  vencida: { texto: "Vencida", clase: "bg-ink text-white" },
  suspendida: { texto: "Suspendida", clase: "bg-mist text-steel" },
};

function Cuenta({ cuenta, alPagar }) {
  const { cliente, suscripciones } = cuenta;
  const [elegidas, setElegidas] = useState(
    () => new Set(suscripciones.filter((s) => s.estado !== "activa").map((s) => s.id)),
  );

  const aPagar = suscripciones.filter((s) => elegidas.has(s.id));
  const total = aPagar.reduce((suma, s) => suma + s.monto, 0);

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
      <p className="text-sm font-semibold text-steel">{cliente.documento}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-black">Hola, {cliente.nombre}</h2>
      <p className="mt-1.5 text-[0.9375rem] text-steel">Elige qué quieres pagar.</p>

      {suscripciones.length === 0 ? (
        <p className="mt-7 rounded-xl bg-sky-tint px-4 py-3 text-sm text-body">No tienes suscripciones registradas.</p>
      ) : (
        <ul className="mt-7 space-y-3">
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
      )}

      <div className="mt-7 flex items-baseline justify-between border-t border-mist pt-5">
        <span className="text-body">Total a pagar</span>
        <span className="text-3xl font-medium tracking-[-0.02em] text-black">{dolares(total)}</span>
      </div>

      <button
        type="button"
        disabled={aPagar.length === 0}
        onClick={() =>
          alPagar({
            concepto: aPagar.map((s) => `${s.plan} (${s.ciclo.toLowerCase()})`).join(" + "),
            monto: total,
            cliente: { nombre: cliente.nombre, documento: cliente.documento, correo: null },
            suscripciones: aPagar.map((s) => s.id),
          })
        }
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-sky px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sky-light disabled:cursor-not-allowed disabled:bg-mist disabled:text-steel"
      >
        Continuar al pago
      </button>
    </>
  );
}

function Confirmacion({ cliente }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-tint text-sky">
        <IconCheck className="h-7 w-7" />
      </span>
      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-black">¡Recibimos tu reporte!</h2>
      <p className="mx-auto mt-3 max-w-[40ch] leading-[1.65] text-body">
        Verificamos el pago y tu suscripción se activa en cuanto se confirme. Te avisamos a {cliente.correo}.
      </p>
    </div>
  );
}

/* "2026-10-15" → "15 de octubre de 2026". Con hora local a mediodía para
   que la zona horaria no la mueva al día anterior. */
function fecha(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" });
}

function enlaceAyuda(documento) {
  const texto = `Hola, no encuentro mi cuenta en el portal de pagos con el documento ${documento}.`;
  return `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(texto)}`;
}
