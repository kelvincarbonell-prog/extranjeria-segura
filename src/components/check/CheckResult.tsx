"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { motion, useReducedMotion } from "motion/react";
import { type CheckResult, FIT_LABEL, FIT_TONE } from "@/content/check-engine";
import type { Answers } from "@/content/check-questions";
import { TRAMITE_MAP } from "@/content/tramites";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Badge, LegalNote, Card } from "@/components/ui/primitives";
import { CheckDraw, Reveal } from "@/components/motion/primitives";
import { Confetti } from "./Confetti";
import { eur, cn } from "@/lib/utils";

export function CheckResultView({
  result,
  answers,
  onRestart,
}: {
  result: CheckResult;
  answers: Answers;
  onRestart: () => void;
}) {
  const reduce = useReducedMotion();
  const [primary, ...alternatives] = result.pathways;

  return (
    <div className="min-h-dvh pb-24">
      {!reduce && result.pathways.length > 0 && <Confetti />}

      <header className="glass border-ink-100 sticky top-0 z-30 border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onRestart}>
              Repetir diagnóstico
            </Button>
            <Button href="/citas" size="sm" arrow>
              Hablar con un especialista
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page pt-12 md:pt-16">
        {/* ---------------- Headline ---------------- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="eyebrow mb-5 justify-center">
            <span aria-hidden className="bg-brand-600 h-px w-5 rounded-full" />
            Resultado de tu diagnóstico
          </span>
          <h1 className="text-display-md md:text-display-lg text-ink-900">{result.summary}</h1>
          {result.fallbackMessage && (
            <p className="text-ink-500 mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed">
              {result.fallbackMessage}
            </p>
          )}
        </motion.div>

        {result.urgent && (
          <Reveal delay={0.1}>
            <div className="bg-signal-warn-soft ring-signal-warn/20 mx-auto mt-8 flex max-w-3xl items-start gap-3.5 rounded-lg p-5 ring-1 ring-inset">
              <span className="bg-signal-warn/12 text-signal-warn mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[11px]">
                <Glyph name="alert" className="size-[18px]" />
              </span>
              <div>
                <p className="text-signal-warn text-[14.5px] font-semibold">
                  Tu caso tiene plazos que corren ahora mismo
                </p>
                <p className="text-ink-600 mt-1 text-[13.5px] leading-relaxed">
                  Los requerimientos y las denegaciones tienen plazos cortos que empiezan el día de
                  la notificación. Sube el documento cuanto antes y lo miramos el mismo día.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* ---------------- Primary pathway ---------------- */}
        {primary && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <PathwayCard pathway={primary} featured />
          </motion.div>
        )}

        {/* ---------------- Alternatives ---------------- */}
        {alternatives.length > 0 && (
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.12em] uppercase">
              {alternatives.length === 1 ? "Alternativa" : "Alternativas"}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {alternatives.map((p, i) => (
                <Reveal key={p.slug} delay={0.3 + i * 0.08}>
                  <PathwayCard pathway={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Next steps ---------------- */}
        <Reveal delay={0.4}>
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="bg-ink-950 relative isolate overflow-hidden rounded-xl p-6 md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(560px 280px at 15% 0%, rgba(65,89,250,.38), transparent 62%)",
                }}
              />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <h2 className="font-display text-[21px] leading-tight font-extrabold tracking-[-0.03em] text-white">
                    El siguiente paso es que alguien lo mire de verdad.
                  </h2>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-white/55">
                    45 minutos con un especialista que revisa tu documentación, confirma la
                    estrategia y te entrega el plan documental por escrito. Si contratas la gestión,
                    se te descuenta.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2.5">
                  <Button href="/citas" size="lg" variant="inverse" arrow>
                    Revisar mi caso con un especialista
                  </Button>
                  <Button
                    href="/crear-cuenta"
                    size="lg"
                    variant="ghost"
                    className="border border-white/15 bg-white/[.06] text-white hover:bg-white/[.12]"
                  >
                    Guardar mi resultado
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Boundary ---------------- */}
        <Reveal delay={0.46}>
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="grid gap-3 md:grid-cols-2">
              <Card padding="md" className="bg-canvas-deep shadow-none ring-1 ring-ink-900/[.06] ring-inset">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="bg-brand-50 text-brand-600 flex size-7 items-center justify-center rounded-[9px]">
                    <Glyph name="path" className="size-4" />
                  </span>
                  <h3 className="text-ink-900 text-[13.5px] font-bold">
                    Lo que acabas de recibir
                  </h3>
                </div>
                <p className="text-ink-500 text-[13px] leading-relaxed">
                  Una <strong className="text-ink-700">orientación preliminar</strong> generada a
                  partir de tus respuestas. Te dice por dónde mirar y qué hace falta comprobar.
                </p>
              </Card>
              <Card padding="md" className="bg-canvas-deep shadow-none ring-1 ring-ink-900/[.06] ring-inset">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="bg-signal-ok-soft text-signal-ok flex size-7 items-center justify-center rounded-[9px]">
                    <Glyph name="shield" className="size-4" />
                  </span>
                  <h3 className="text-ink-900 text-[13.5px] font-bold">
                    Lo que todavía no es
                  </h3>
                </div>
                <p className="text-ink-500 text-[13px] leading-relaxed">
                  Una <strong className="text-ink-700">validación profesional</strong>. Nadie ha
                  visto aún tus documentos reales, y ahí es donde se decide un expediente.
                </p>
              </Card>
            </div>

            <LegalNote variant="framed" className="mt-4">
              Este resultado no constituye asesoramiento jurídico, no crea relación profesional y no
              garantiza la concesión de ninguna autorización. Las condiciones exactas dependen de la
              normativa vigente en el momento de la solicitud y del criterio de la oficina
              competente. Tus respuestas se han procesado en tu navegador y no se han enviado a
              ningún servidor.
            </LegalNote>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" size="md" onClick={() => window.print()}>
                Descargar en PDF
              </Button>
              <Button variant="ghost" size="md" onClick={onRestart}>
                Cambiar mis respuestas
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Screen-reader / print summary of the answers that produced this. */}
        <details className="mx-auto mt-10 max-w-3xl">
          <summary className="text-ink-400 hover:text-ink-700 cursor-pointer text-[13px]">
            Ver las respuestas con las que se ha calculado este resultado
          </summary>
          <dl className="text-ink-500 mt-3 grid gap-x-6 gap-y-1 text-[12.5px] sm:grid-cols-2">
            {Object.entries(answers).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-ink-400">{k}</dt>
                <dd className="data">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </details>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PathwayCard({
  pathway,
  featured = false,
}: {
  pathway: CheckResult["pathways"][number];
  featured?: boolean;
}) {
  const t = TRAMITE_MAP[pathway.slug];
  if (!t) return null;

  return (
    <article
      className={cn(
        "bg-surface relative flex h-full flex-col overflow-hidden rounded-xl",
        featured
          ? "shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.22),0_30px_70px_-28px_rgb(10_13_22_/_0.28)]"
          : "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
      )}
    >
      {featured && (
        <span
          aria-hidden
          className="from-brand-500 via-brand-600 to-brand-400 absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r"
        />
      )}

      <div className={cn("flex-1", featured ? "p-6 md:p-8" : "p-5")}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={FIT_TONE[pathway.fit]} dot>
            {FIT_LABEL[pathway.fit]}
          </Badge>
          {featured && <Badge tone="neutral">Vía principal</Badge>}
        </div>

        <h2
          className={cn(
            "text-ink-900 font-display font-extrabold tracking-[-0.032em]",
            featured ? "text-[26px] md:text-[30px]" : "text-[19px]",
          )}
        >
          {t.shortName ?? t.name}
        </h2>
        <p className={cn("text-ink-500 mt-2 leading-relaxed", featured ? "text-[15px]" : "text-[13.5px]")}>
          {t.tagline}
        </p>

        {pathway.reasons.length > 0 && (
          <div className="mt-6">
            <h3 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
              Por qué podría encajar contigo
            </h3>
            <ul className="flex flex-col gap-2">
              {pathway.reasons.map((r, i) => (
                <li key={r} className="text-ink-700 flex gap-2.5 text-[13.5px] leading-snug">
                  <span className="bg-signal-ok-soft text-signal-ok mt-px flex size-[17px] shrink-0 items-center justify-center rounded-full">
                    <CheckDraw size={10} strokeWidth={3.4} delay={0.5 + i * 0.12} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pathway.verify.length > 0 && (
          <div className="mt-6">
            <h3 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
              Necesitamos verificar
            </h3>
            <ul className="flex flex-col gap-2">
              {pathway.verify.map((v) => (
                <li key={v} className="text-ink-600 flex gap-2.5 text-[13.5px] leading-snug">
                  <span className="bg-signal-warn-soft text-signal-warn mt-px flex size-[17px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                    !
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-canvas-deep border-ink-100 border-t">
        <dl className="divide-ink-100 grid grid-cols-2 divide-x">
          <div className="px-5 py-4">
            <dt className="text-ink-400 text-[11px] font-medium">Documentación</dt>
            <dd className="text-ink-900 data mt-1 text-[15px] font-semibold">
              {t.documents.length} documentos
            </dd>
          </div>
          <div className="px-5 py-4">
            <dt className="text-ink-400 text-[11px] font-medium">Honorarios</dt>
            <dd className="text-ink-900 data mt-1 text-[15px] font-semibold">
              {t.feeFromCents !== null ? `desde ${eur(t.feeFromCents)}` : "A medida"}
            </dd>
          </div>
        </dl>

        <div className="border-ink-100 border-t px-5 py-4">
          <p className="text-ink-500 text-[12.5px] leading-relaxed">
            <span className="text-ink-700 font-medium">Plazos:</span> {t.timeframe}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 p-5 sm:flex-row">
          <Button href="/citas" size="md" className="flex-1" arrow>
            Revisar mi caso con un especialista
          </Button>
          <Link
            href={`/tramites/${t.slug}`}
            className="text-ink-600 hover:text-ink-900 bg-surface hover:bg-ink-50 inline-flex h-11 shrink-0 items-center justify-center rounded-xs px-5 text-[14.5px] font-medium shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] transition-colors"
          >
            Ver requisitos
          </Link>
        </div>
      </div>
    </article>
  );
}
