"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  calcular,
  validarEntrada,
  type TipoResolucion,
  type ResultadoCalculo,
} from "@/lib/calculo-regularizacion";
import { fechaLarga, parseDia } from "@/lib/plazos";
import { FUENTES } from "@/content/fuentes";
import { Fuente } from "@/components/contenido/Fuente";
import { Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * CALCULADORA DE PLAZOS DE LA REGULARIZACIÓN (A2).
 *
 * No existe nada equivalente en el mercado, y el motivo es que resolverlo bien
 * exige tres cosas que rara vez van juntas: aritmética de plazos correcta
 * (art. 30.4, el caso del 31 de enero), saber distinguir acto expreso de acto
 * presunto, y no pedir ningún dato personal para dar la respuesta.
 *
 * Todo ocurre en el navegador. Quien escribe aquí la fecha de presentación de
 * su expediente está diciendo, sin decirlo, que es extranjero y que tiene un
 * procedimiento abierto. Ese dato no tiene por qué existir en ningún servidor
 * nuestro, así que no existe.
 */

const OPCIONES: { valor: TipoResolucion; etiqueta: string; detalle: string }[] = [
  {
    valor: "sin-resolucion",
    etiqueta: "Todavía no me han contestado",
    detalle: "No he recibido ninguna resolución",
  },
  {
    valor: "denegada",
    etiqueta: "Me la han denegado",
    detalle: "He recibido una resolución denegatoria",
  },
  {
    valor: "inadmitida",
    etiqueta: "No me la han admitido a trámite",
    detalle: "La resolución dice «se inadmite»",
  },
  {
    valor: "concedida",
    etiqueta: "Me la han concedido",
    detalle: "He recibido una resolución favorable",
  },
];

export function PlazosRegularizacion() {
  const [fechaPresentacion, setFechaPresentacion] = React.useState("");
  const [tipoResolucion, setTipoResolucion] = React.useState<TipoResolucion>("sin-resolucion");
  const [fechaNotificacion, setFechaNotificacion] = React.useState("");

  const necesitaNotificacion = tipoResolucion !== "sin-resolucion";

  const entrada = {
    fechaPresentacion,
    tipoResolucion,
    fechaNotificacion: necesitaNotificacion ? fechaNotificacion : undefined,
  };

  // Solo se valida cuando el usuario ya ha escrito algo: enseñar un error
  // antes de que haya tenido oportunidad de equivocarse es hostil.
  const error = fechaPresentacion ? validarEntrada(entrada) : null;
  const resultado: ResultadoCalculo | null =
    !error && fechaPresentacion && (!necesitaNotificacion || fechaNotificacion)
      ? calcular(entrada)
      : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card padding="lg">
        <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
          Tu expediente
        </h2>
        <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">
          Dos datos bastan. Nada de esto sale de tu dispositivo.
        </p>

        <fieldset className="mt-6">
          <legend className="text-ink-600 mb-2 text-[12.5px] font-medium">
            ¿Cuándo presentaste la solicitud?
          </legend>
          <input
            type="date"
            value={fechaPresentacion}
            min="2026-04-16"
            max="2026-06-30"
            onChange={(e) => setFechaPresentacion(e.target.value)}
            aria-describedby={error ? "error-fecha" : undefined}
            aria-invalid={Boolean(error)}
            className={cn(
              "bg-surface text-ink-900 data h-11 w-full max-w-[220px] rounded-sm px-3.5 text-[14px] outline-none",
              error
                ? "shadow-[inset_0_0_0_1.5px_rgb(179_38_30_/_0.55)]"
                : "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]",
            )}
          />
          <p className="text-ink-400 mt-1.5 text-[12.5px]">
            La fecha del justificante de presentación, no la de la cita.
          </p>
        </fieldset>

        {error && (
          <p
            id="error-fecha"
            role="alert"
            className="text-signal-risk bg-signal-risk-soft mt-3 rounded-md px-3.5 py-2.5 text-[13.5px] leading-relaxed"
          >
            {error}
          </p>
        )}

        <fieldset className="mt-7">
          <legend className="text-ink-600 mb-2.5 text-[12.5px] font-medium">
            ¿En qué punto está?
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {OPCIONES.map((o) => {
              const activo = tipoResolucion === o.valor;
              return (
                <label
                  key={o.valor}
                  className={cn(
                    "tap cursor-pointer rounded-md px-3.5 py-3 transition-colors",
                    activo
                      ? "bg-brand-50 shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.45)]"
                      : "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] hover:bg-ink-50",
                  )}
                >
                  <input
                    type="radio"
                    name="tipo-resolucion"
                    value={o.valor}
                    checked={activo}
                    onChange={() => setTipoResolucion(o.valor)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "block text-[14px] font-medium",
                      activo ? "text-brand-700" : "text-ink-800",
                    )}
                  >
                    {o.etiqueta}
                  </span>
                  <span className="text-ink-500 mt-0.5 block text-[12.5px]">{o.detalle}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <AnimatePresence initial={false}>
          {necesitaNotificacion && (
            <motion.fieldset
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-7">
                <legend className="text-ink-600 mb-2 text-[12.5px] font-medium">
                  ¿Qué día te la notificaron?
                </legend>
                <input
                  type="date"
                  value={fechaNotificacion}
                  min={fechaPresentacion || undefined}
                  onChange={(e) => setFechaNotificacion(e.target.value)}
                  className="bg-surface text-ink-900 data h-11 w-full max-w-[220px] rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
                />
                <p className="text-ink-400 mt-1.5 text-[12.5px]">
                  El día en que la recibiste o accediste a ella, no la fecha firmada en el
                  documento. Los plazos se cuentan desde el día siguiente a este.
                </p>
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Resultado ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {!resultado && (
          <Card padding="lg" className="flex min-h-[220px] items-center justify-center">
            <p className="text-ink-400 max-w-[240px] text-center text-[14px] leading-relaxed">
              Introduce la fecha de presentación y te mostramos el mapa completo de plazos, con la
              norma de cada uno.
            </p>
          </Card>
        )}

        {resultado && <Resultado r={resultado} />}
      </div>
    </div>
  );
}

function Resultado({ r }: { r: ResultadoCalculo }) {
  return (
    <>
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-ink-900 font-display text-[17px] font-extrabold tracking-[-0.028em]">
            {r.estado === "concedida"
              ? "Resolución favorable"
              : r.estado === "en-plazo-de-resolucion"
                ? "Dentro del plazo de resolución"
                : r.estado === "silencio-producido"
                  ? "El silencio ya se ha producido"
                  : "Resolución notificada"}
          </h2>
          {r.estado === "silencio-producido" && (
            <Badge tone="warn" className="shrink-0">
              Vía abierta
            </Badge>
          )}
        </div>

        {r.estado !== "concedida" && (
          <div className="border-ink-900/[.07] mt-4 border-t pt-4">
            <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
              Silencio administrativo
            </p>
            <p className="text-ink-900 mt-1.5 text-[16px] font-semibold">
              <time dateTime={r.silencio}>{fechaLarga(parseDia(r.silencio))}</time>
            </p>
            <p className="text-ink-500 mt-1 text-[13px] leading-relaxed">
              {r.silencioProducido
                ? `Se produjo hace ${Math.abs(r.cuentaSilencio.dias)} días. A partir de esa fecha la solicitud se entiende desestimada.`
                : `Faltan ${r.cuentaSilencio.dias} días. Hasta entonces, la Administración está en plazo.`}
            </p>
            <Fuente
              fuente={FUENTES["ley-39-2015"]}
              articulo="a24"
              verificado
              className="mt-2.5"
            />
          </div>
        )}
      </Card>

      {r.vias.map((v) => (
        <Card key={v.id} padding="lg">
          <h3 className="text-ink-900 text-[15px] font-semibold tracking-[-0.015em]">{v.nombre}</h3>

          {v.vence && v.cuenta ? (
            <div className="mt-3 flex items-baseline gap-2.5">
              <span
                className={cn(
                  "font-display text-[30px] leading-none font-extrabold tabular-nums",
                  v.cuenta.estado === "vencido"
                    ? "text-ink-400"
                    : v.cuenta.critico
                      ? "text-signal-risk"
                      : "text-ink-900",
                )}
              >
                {v.cuenta.estado === "vencido" ? "—" : v.cuenta.dias}
              </span>
              <span className="text-ink-600 text-[14px]">
                {v.cuenta.estado === "vencido"
                  ? "plazo agotado"
                  : v.cuenta.dias === 1
                    ? "día restante"
                    : "días restantes"}
              </span>
            </div>
          ) : (
            <p className="text-ink-900 mt-3 text-[15px] font-semibold">Sin plazo de cierre</p>
          )}

          {v.vence && (
            <p className="text-ink-500 mt-1.5 text-[13px]">
              Vence el <time dateTime={v.vence}>{fechaLarga(parseDia(v.vence))}</time>
            </p>
          )}

          <p className="text-ink-600 mt-3 text-[13.5px] leading-relaxed">{v.explicacion}</p>
          <Fuente
            fuente={FUENTES[v.fuenteId]}
            articulo={v.articulo}
            verificado
            className="mt-2.5"
          />
        </Card>
      ))}

      {r.avisos.map((a) => (
        <LegalNote key={a} variant="framed">
          {a}
        </LegalNote>
      ))}

      {r.vias.length > 0 && (
        <Card padding="lg">
          <p className="text-ink-700 text-[14.5px] leading-relaxed">
            Estas fechas son aritmética sobre las tuyas, no una estrategia. Qué recurso conviene
            —y si conviene alguno, frente a abrir una vía paralela— depende de lo que diga tu
            resolución.
          </p>
          <Button href="/precios#recursos" className="mt-4" arrow>
            Revisar mi caso con un especialista
          </Button>
        </Card>
      )}
    </>
  );
}
