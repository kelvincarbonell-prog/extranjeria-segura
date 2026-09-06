"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  schengenSummary,
  nationalityEligibility,
  NATIONALITY_TRACKS,
  economicMeans,
  renewalWindow,
  IPREM,
  type Stay,
  type NationalityTrack,
  type MeansRoute,
} from "@/content/calculators";
import { Card, Badge, LegalNote, Progress } from "@/components/ui/primitives";
import { Button, IconButton } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { eur, formatDateES, cn } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

/* ==================================================================== *
 * SCHENGEN 90/180
 * ==================================================================== */

export function SchengenCalculator() {
  const [stays, setStays] = React.useState<Stay[]>([{ from: "", to: "" }]);
  const [reference, setReference] = React.useState(today());

  const valid = stays.filter((s) => s.from && s.to && s.to >= s.from);
  const result = schengenSummary(valid, reference);
  const pct = Math.min(100, Math.round((result.used / 90) * 100));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card padding="lg">
        <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
          Tus entradas y salidas del espacio Schengen
        </h2>
        <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">
          Añade cada estancia. El día de entrada y el de salida cuentan los dos.
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {stays.map((stay, i) => (
            <li key={i} className="flex flex-wrap items-end gap-3">
              <DateField
                label={i === 0 ? "Entrada" : undefined}
                value={stay.from}
                max={stay.to || undefined}
                onChange={(v) =>
                  setStays((s) => s.map((x, j) => (i === j ? { ...x, from: v } : x)))
                }
              />
              <DateField
                label={i === 0 ? "Salida" : undefined}
                value={stay.to}
                min={stay.from || undefined}
                onChange={(v) => setStays((s) => s.map((x, j) => (i === j ? { ...x, to: v } : x)))}
              />
              {stays.length > 1 && (
                <IconButton
                  label={`Eliminar estancia ${i + 1}`}
                  onClick={() => setStays((s) => s.filter((_, j) => j !== i))}
                  size={44}
                >
                  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden>
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </IconButton>
              )}
            </li>
          ))}
        </ul>

        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => setStays((s) => [...s, { from: "", to: "" }])}
        >
          Añadir otra estancia
        </Button>

        <div className="border-ink-100 mt-6 border-t pt-5">
          <DateField
            label="Fecha en la que quieres saberlo"
            value={reference}
            onChange={setReference}
          />
          <p className="text-ink-400 mt-2 text-[12.5px]">
            La ventana de 180 días que se aplica va del{" "}
            <span className="data">{formatDateES(result.windowStart, "short")}</span> al{" "}
            <span className="data">{formatDateES(result.reference, "short")}</span>.
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card padding="lg">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Días utilizados
          </p>
          <p className="text-ink-900 font-display data mt-2 text-[42px] leading-none font-extrabold tracking-[-0.045em]">
            {result.used}
            <span className="text-ink-300 text-[22px]">/90</span>
          </p>
          <Progress
            value={pct}
            className="mt-4"
            tone={result.overstay ? "ink" : result.remaining <= 15 ? "ink" : "ok"}
          />

          <div className="mt-5">
            {result.overstay ? (
              <Badge tone="risk" dot>
                Has superado el límite de 90 días
              </Badge>
            ) : result.remaining === 0 ? (
              <Badge tone="warn" dot>
                Sin días disponibles
              </Badge>
            ) : result.remaining <= 15 ? (
              <Badge tone="warn" dot>
                Te quedan {result.remaining} días
              </Badge>
            ) : (
              <Badge tone="ok" dot>
                Te quedan {result.remaining} días
              </Badge>
            )}
          </div>

          {result.nextFreeDay && (
            <p className="text-ink-500 mt-4 text-[13px] leading-relaxed">
              Volverás a tener días disponibles a partir del{" "}
              <strong className="text-ink-900">{formatDateES(result.nextFreeDay)}</strong>.
            </p>
          )}
        </Card>

        {(result.overstay || result.remaining <= 15) && (
          <Card padding="md" className="bg-ink-950 text-white shadow-none">
            <p className="font-display text-[15px] leading-snug font-bold">
              {result.overstay
                ? "Una estancia superior a 90 días tiene consecuencias."
                : "Vas justo de días."}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55">
              {result.overstay
                ? "Puede afectar a futuras entradas y a la tramitación de una autorización. Conviene revisarlo antes de que se convierta en un problema."
                : "Si tu intención es quedarte, quizá te interese una vía de residencia en lugar de encadenar estancias."}
            </p>
            <Button href="/diagnostico" variant="inverse" size="sm" block className="mt-4" arrow>
              Ver mis opciones
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ==================================================================== *
 * NATIONALITY
 * ==================================================================== */

export function NationalityCalculator() {
  const [start, setStart] = React.useState("");
  const [track, setTrack] = React.useState<NationalityTrack>("reducido2");

  const result = start ? nationalityEligibility(start, track) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card padding="lg">
        <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
          Tu residencia legal
        </h2>
        <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">
          Cuenta desde el inicio de tu residencia legal, no desde tu llegada a España. Los periodos
          en situación irregular no computan.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <DateField
            label="Inicio de tu residencia legal"
            value={start}
            max={today()}
            onChange={setStart}
          />

          <fieldset>
            <legend className="text-ink-600 mb-2.5 text-[12.5px] font-medium">
              Plazo que te corresponde
            </legend>
            <div className="flex flex-col gap-2">
              {(Object.keys(NATIONALITY_TRACKS) as NationalityTrack[]).map((k) => {
                const t = NATIONALITY_TRACKS[k];
                const selected = track === k;
                return (
                  <label
                    key={k}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-sm p-3.5 transition-all",
                      selected
                        ? "bg-brand-50/60 shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.4)]"
                        : "bg-canvas-deep hover:bg-ink-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="track"
                      checked={selected}
                      onChange={() => setTrack(k)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-brand-600 bg-brand-600" : "border-ink-200",
                      )}
                    >
                      {selected && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-[14px] font-semibold",
                          selected ? "text-brand-800" : "text-ink-900",
                        )}
                      >
                        {t.label}
                      </span>
                      <span className="text-ink-500 mt-0.5 block text-[12.5px] leading-snug">
                        {t.detail}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card padding="lg">
                <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                  {result.alreadyEligible ? "Ya cumples el plazo" : "Podrás solicitarla desde"}
                </p>
                <p className="text-ink-900 font-display mt-2 text-[26px] leading-tight font-extrabold tracking-[-0.038em]">
                  {formatDateES(result.eligibleFrom)}
                </p>
                <Progress value={result.progress} className="mt-4" tone="ok" showValue />
                {!result.alreadyEligible && (
                  <p className="text-ink-500 mt-4 text-[13.5px] leading-relaxed">
                    Te faltan <strong className="text-ink-900 data">{result.daysLeft}</strong> días.
                    Es buen momento para ir preparando los exámenes CCSE y DELE y las legalizaciones,
                    que son lo que más tarda.
                  </p>
                )}
              </Card>
            </motion.div>
          ) : (
            <Card key="empty" padding="lg">
              <p className="text-ink-400 text-[13.5px]">
                Introduce la fecha de inicio de tu residencia legal para ver el cálculo.
              </p>
            </Card>
          )}
        </AnimatePresence>

        {result && (
          <Card padding="md" className="bg-ink-950 text-white shadow-none">
            <p className="font-display text-[15px] leading-snug font-bold">
              El cómputo es lo que más denegaciones provoca.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55">
              Las lagunas entre autorizaciones y las ausencias del territorio pueden romper la
              continuidad. Antes de presentar, auditamos tu historial completo.
            </p>
            <Button
              href="/tramites/nacionalidad-por-residencia"
              variant="inverse"
              size="sm"
              block
              className="mt-4"
              arrow
            >
              Ver el trámite
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ==================================================================== *
 * ECONOMIC MEANS
 * ==================================================================== */

export function MeansCalculator() {
  const [route, setRoute] = React.useState<MeansRoute>("no-lucrativa");
  const [dependants, setDependants] = React.useState(0);
  const result = economicMeans(route, dependants);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card padding="lg">
        <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
          Tu situación
        </h2>

        <div className="mt-6 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-ink-600 text-[12.5px] font-medium">Vía</span>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value as MeansRoute)}
              className="bg-surface text-ink-900 h-11 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
            >
              {(Object.keys(IPREM.routes) as MeansRoute[]).map((k) => (
                <option key={k} value={k}>
                  {IPREM.routes[k].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-ink-600 text-[12.5px] font-medium">
              Personas a tu cargo que se trasladan contigo
            </span>
            <input
              type="number"
              min={0}
              max={10}
              value={dependants}
              onChange={(e) => setDependants(Math.max(0, Number(e.target.value)))}
              className="bg-surface text-ink-900 data h-11 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
            />
          </label>
        </div>

        <LegalNote className="mt-6">
          El IPREM lo fija anualmente la Ley de Presupuestos. Este cálculo usa el valor de{" "}
          {IPREM.year} configurado en la plataforma. Los multiplicadores exactos y su forma de
          acreditación dependen de la vía y del criterio de la oficina competente.
        </LegalNote>
      </Card>

      <div className="flex flex-col gap-4">
        <Card padding="lg">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Importe orientativo
          </p>
          <p className="text-ink-900 font-display data mt-2 text-[34px] leading-none font-extrabold tracking-[-0.045em]">
            {eur(result.monthlyCents)}
            <span className="text-ink-300 text-[16px] font-medium"> /mes</span>
          </p>
          <p className="text-ink-500 mt-3 text-[13.5px]">
            Equivalente anual:{" "}
            <strong className="text-ink-900 data">{eur(result.annualCents)}</strong>
          </p>
          <div className="border-ink-100 mt-5 border-t pt-4">
            <p className="text-ink-400 text-[12.5px] leading-relaxed">
              Calculado sobre el IPREM mensual de {IPREM.year} ({eur(IPREM.monthlyCents)}) para{" "}
              {result.label.toLowerCase()} con {dependants}{" "}
              {dependants === 1 ? "persona" : "personas"} a cargo.
            </p>
          </div>
        </Card>

        <Card padding="md" className="bg-ink-950 text-white shadow-none">
          <p className="font-display text-[15px] leading-snug font-bold">
            Acreditarlo importa tanto como tenerlo.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/55">
            La forma de justificar los medios (origen, estabilidad y disponibilidad) es donde suelen
            fallar los expedientes, no en el importe.
          </p>
          <Button href="/citas" variant="inverse" size="sm" block className="mt-4" arrow>
            Revisarlo con un especialista
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ==================================================================== *
 * RENEWAL WINDOW
 * ==================================================================== */

export function RenewalCalculator() {
  const [expiry, setExpiry] = React.useState("");
  const result = expiry ? renewalWindow(expiry) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card padding="lg">
        <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
          Tu tarjeta actual
        </h2>
        <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">
          Introduce la fecha de caducidad que figura en tu TIE.
        </p>
        <div className="mt-6">
          <DateField label="Fecha de caducidad" value={expiry} onChange={setExpiry} />
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {result ? (
          <>
            <Card padding="lg">
              <div className="mb-4">
                {result.inWindow ? (
                  <Badge tone="ok" dot>
                    Estás dentro del plazo para presentar
                  </Badge>
                ) : result.expired ? (
                  <Badge tone="risk" dot>
                    Plazo de presentación agotado
                  </Badge>
                ) : (
                  <Badge tone="neutral" dot>
                    Todavía no se ha abierto el plazo
                  </Badge>
                )}
              </div>

              <dl className="divide-ink-100 divide-y">
                <div className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-ink-400 text-[13px]">Se abre el</dt>
                  <dd className="text-ink-900 data text-[13.5px] font-medium">
                    {formatDateES(result.opens, "short")}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-ink-400 text-[13px]">Caduca el</dt>
                  <dd className="text-ink-900 data text-[13.5px] font-medium">
                    {formatDateES(result.expiry, "short")}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-ink-400 text-[13px]">Último día admitido</dt>
                  <dd className="text-ink-900 data text-[13.5px] font-medium">
                    {formatDateES(result.closes, "short")}
                  </dd>
                </div>
              </dl>

              <p className="text-ink-500 mt-4 text-[13px] leading-relaxed">
                {result.expired
                  ? result.stillInGrace
                    ? "Tu tarjeta ha caducado, pero aún queda margen para presentar. Cuanto antes, mejor."
                    : "Ha pasado el margen habitual de presentación. Hay que estudiar tu caso antes de hacer nada."
                  : result.inWindow
                    ? "Puedes presentar ya. Presentar en plazo mantiene la vigencia de tu situación mientras se resuelve."
                    : `Faltan ${result.daysToExpiry - 60} días para que se abra el plazo. Te avisaremos si abres tu expediente.`}
              </p>
            </Card>

            <Card padding="md" className="bg-ink-950 text-white shadow-none">
              <p className="font-display text-[15px] leading-snug font-bold">
                Las fechas son orientativas.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                El margen exacto depende del tipo de autorización y de la normativa vigente en tu
                caso. Lo confirmamos con tu documentación antes de presentar nada.
              </p>
              <Button href="/diagnostico" variant="inverse" size="sm" block className="mt-4" arrow>
                Comprobar mi caso
              </Button>
            </Card>
          </>
        ) : (
          <Card padding="lg">
            <p className="text-ink-400 text-[13.5px]">
              Introduce la fecha de caducidad para ver tu ventana de presentación.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DateField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) {
  const id = React.useId();
  return (
    <div className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-ink-600 text-[12.5px] font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface text-ink-900 data h-11 w-full rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
      />
    </div>
  );
}

export function CalculatorRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case "schengen-90-180":
      return <SchengenCalculator />;
    case "tiempo-nacionalidad":
      return <NationalityCalculator />;
    case "medios-economicos":
      return <MeansCalculator />;
    case "fechas-renovacion":
      return <RenewalCalculator />;
    default:
      return (
        <Card padding="lg">
          <p className="text-ink-500 flex items-center gap-2 text-[14px]">
            <Glyph name="clock" className="size-4" />
            Esta herramienta todavía no está disponible.
          </p>
        </Card>
      );
  }
}
