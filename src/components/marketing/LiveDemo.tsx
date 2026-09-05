"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeading, Badge, DemoTag, Progress, Avatar } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Isotipo } from "@/components/brand/Isotipo";
import {
  DEMO_CASE,
  DEMO_DOCUMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_MESSAGES,
  DOC_STATE_META,
} from "@/content/demo";
import { relativeES, cn } from "@/lib/utils";

/**
 * "Ver cómo sería mi expediente."
 *
 * A real, clickable slice of the client area rendered on the landing page,
 * before any sign-up. Every panel here is the same component family used in
 * /app, so what a visitor touches is what they get. Permanently labelled DEMO.
 */

const TABS = [
  { id: "expediente", label: "Expediente", glyph: "path" },
  { id: "documentos", label: "Documentos", glyph: "doc" },
  { id: "mensajes", label: "Mensajes", glyph: "family" },
  { id: "notificaciones", label: "Notificaciones", glyph: "alert" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function LiveDemo() {
  const [tab, setTab] = React.useState<TabId>("expediente");
  const reduce = useReducedMotion();

  return (
    <section id="demo" className="bg-canvas-deep relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Área privada"
            title="Mira cómo sería tu expediente antes de registrarte."
            lede="Esta es la pantalla real que ve un cliente. Puedes tocarla. Los datos son de demostración: no corresponden a ninguna persona ni a ningún expediente real."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-2xl bg-ink-950 p-2 shadow-[0_40px_100px_-40px_rgb(10_13_22_/_0.5)] md:p-3">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Isotipo className="size-5" variant="inverse" id="demo-chrome" />
                <span className="font-display text-[12.5px] font-bold tracking-[-0.02em] text-white/90">
                  Extranjería Segura
                </span>
                <span className="data hidden text-[11px] text-white/35 sm:inline">
                  /app · #{DEMO_CASE.reference}
                </span>
              </div>
              <DemoTag className="bg-white/10 text-white/70 ring-white/10" label="Demo interactiva" />
            </div>

            <div className="bg-canvas overflow-hidden rounded-xl">
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Secciones del expediente"
                className="border-ink-100 no-scrollbar flex gap-1 overflow-x-auto border-b px-3 py-2.5"
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium transition-colors",
                      tab === t.id ? "text-ink-900" : "text-ink-400 hover:text-ink-700",
                    )}
                  >
                    {tab === t.id && (
                      <motion.span
                        layoutId="demo-tab"
                        className="bg-surface absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_1px_2px_rgb(10_13_22_/_.05)]"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <Glyph name={t.glyph} className="relative size-4" />
                    <span className="relative">{t.label}</span>
                    {t.id === "notificaciones" && (
                      <span className="bg-brand-600 relative flex size-4 items-center justify-center rounded-full text-[9.5px] font-bold text-white">
                        2
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Panels */}
              <div className="min-h-[420px] p-4 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    role="tabpanel"
                  >
                    {tab === "expediente" && <ExpedientePanel />}
                    {tab === "documentos" && <DocumentosPanel />}
                    {tab === "mensajes" && <MensajesPanel />}
                    {tab === "notificaciones" && <NotificacionesPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/diagnostico" size="lg" arrow magnetic>
              Abrir mi expediente real
            </Button>
            <Button href="/entrar" size="lg" variant="secondary">
              Ya tengo cuenta
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ExpedientePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="bg-surface rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-ink-400 text-[13px]">Hola, {DEMO_CASE.clientFirstName} 👋</p>
            <h3 className="text-ink-900 font-display mt-1 text-[22px] font-extrabold tracking-[-0.03em]">
              {DEMO_CASE.tramite}
            </h3>
          </div>
          <Badge tone="brand" dot>
            {DEMO_CASE.status}
          </Badge>
        </div>

        <Progress
          value={DEMO_CASE.progress}
          label="Progreso del expediente"
          showValue
          className="mt-5"
        />

        <ol className="mt-7 flex flex-col">
          {DEMO_CASE.timeline.map((s, i) => (
            <li key={s.key} className="relative flex items-start gap-3.5 pb-4 last:pb-0">
              {i < DEMO_CASE.timeline.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[20px] left-[10px] w-px",
                    s.state === "done" ? "bg-signal-ok/30" : "bg-ink-100",
                  )}
                  style={{ height: "calc(100% - 6px)" }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-[21px] shrink-0 items-center justify-center rounded-full",
                  s.state === "done" && "bg-signal-ok-soft text-signal-ok",
                  s.state === "active" && "bg-brand-600 text-white",
                  s.state === "todo" && "bg-ink-100 text-ink-300",
                )}
              >
                {s.state === "done" ? (
                  <CheckDraw size={12} strokeWidth={3} delay={0.1 + i * 0.08} />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      s.state === "active" ? "bg-white" : "bg-ink-300",
                    )}
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                <span
                  className={cn(
                    "text-[14px]",
                    s.state === "todo" ? "text-ink-300" : "text-ink-800 font-medium",
                    s.state === "active" && "text-ink-900 font-semibold",
                  )}
                >
                  {s.label}
                </span>
                {s.date && <span className="data text-ink-300 shrink-0 text-[11.5px]">{s.date}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-ink-950 rounded-lg p-5 text-white">
          <p className="text-[11px] font-bold tracking-[0.12em] text-white/45 uppercase">
            Próximo paso
          </p>
          <p className="font-display mt-2 text-[15.5px] leading-snug font-bold">
            {DEMO_CASE.nextStep.title}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/55">
            {DEMO_CASE.nextStep.detail}
          </p>
          <Button href="/diagnostico" variant="inverse" size="sm" block className="mt-4" arrow>
            Subir documento
          </Button>
        </div>

        <div className="bg-surface rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
          <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.12em] uppercase">
            Tu especialista
          </p>
          <div className="flex items-center gap-3">
            <Avatar name={DEMO_CASE.advisor.name} size={38} />
            <div className="min-w-0">
              <p className="text-ink-900 truncate text-[13.5px] font-semibold">
                {DEMO_CASE.advisor.name}
              </p>
              <p className="text-ink-400 truncate text-[12px]">{DEMO_CASE.advisor.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentosPanel() {
  const ok = DEMO_DOCUMENTS.filter((d) => d.state === "correcto").length;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-500 text-[13.5px]">
          <span className="text-ink-900 data font-semibold">
            {ok}/{DEMO_DOCUMENTS.length}
          </span>{" "}
          documentos validados
        </p>
        <Badge tone="warn" dot>
          1 requiere corrección
        </Badge>
      </div>

      <ul className="bg-surface divide-ink-100 divide-y overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
        {DEMO_DOCUMENTS.map((d) => {
          const meta = DOC_STATE_META[d.state];
          return (
            <li key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
                  meta.tone === "ok" && "bg-signal-ok-soft text-signal-ok",
                  meta.tone === "warn" && "bg-signal-warn-soft text-signal-warn",
                  meta.tone === "risk" && "bg-signal-risk-soft text-signal-risk",
                  meta.tone === "brand" && "bg-brand-50 text-brand-600",
                  meta.tone === "neutral" && "bg-ink-50 text-ink-400",
                )}
              >
                <Glyph name={meta.glyph} className="size-[17px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink-900 block text-[14px] font-medium">{d.name}</span>
                <span className="text-ink-400 mt-0.5 block text-[12.5px]">
                  {d.issue ? d.issue.title : (d.hint ?? `Actualizado ${relativeES(d.updatedAt)}`)}
                </span>
              </span>
              <Badge tone={meta.tone} className="shrink-0">
                {meta.label}
              </Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MensajesPanel() {
  return (
    <div className="bg-surface flex flex-col overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
      <div className="border-ink-100 flex items-center gap-3 border-b p-4">
        <Avatar name="Tu especialista" size={34} />
        <div className="min-w-0 flex-1">
          <p className="text-ink-900 text-[13.5px] font-semibold">Tu especialista</p>
          <p className="text-signal-ok flex items-center gap-1.5 text-[12px]">
            <span className="bg-signal-ok size-1.5 rounded-full" />
            Responde en horario laboral
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {DEMO_MESSAGES.map((m) => {
          const mine = m.from === "cliente";
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[86%] rounded-lg px-4 py-3 sm:max-w-[70%]",
                  mine
                    ? "bg-brand-600 text-white"
                    : m.from === "asistente"
                      ? "bg-ink-50 text-ink-700 ring-ink-900/[.05] ring-1 ring-inset"
                      : "bg-canvas-deep text-ink-800 ring-ink-900/[.05] ring-1 ring-inset",
                )}
              >
                {!mine && (
                  <p
                    className={cn(
                      "mb-1 text-[11px] font-semibold",
                      m.from === "asistente" ? "text-ink-400" : "text-brand-700",
                    )}
                  >
                    {m.authorName}
                  </p>
                )}
                <p className="text-[13.5px] leading-relaxed">{m.body}</p>
                {m.attachment && (
                  <p className="mt-2.5 flex items-center gap-2 rounded-sm bg-white/70 px-2.5 py-2 text-[12px] font-medium text-ink-700">
                    <Glyph name="doc" className="text-ink-400 size-4" />
                    {m.attachment.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-ink-100 bg-canvas-deep border-t p-3">
        <div className="bg-surface text-ink-300 ring-ink-900/[.06] flex items-center gap-3 rounded-sm px-4 py-3 text-[13.5px] ring-1 ring-inset">
          Escribe un mensaje…
        </div>
      </div>
    </div>
  );
}

function NotificacionesPanel() {
  const glyphs: Record<string, string> = {
    documento: "doc",
    cita: "clock",
    expediente: "path",
    mensaje: "family",
    pago: "stamp",
  };
  return (
    <ul className="bg-surface divide-ink-100 divide-y overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
      {DEMO_NOTIFICATIONS.map((n) => (
        <li
          key={n.id}
          className={cn("flex items-start gap-3.5 p-4", !n.read && "bg-brand-50/40")}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
              n.read ? "bg-ink-50 text-ink-400" : "bg-brand-600 text-white",
            )}
          >
            <Glyph name={glyphs[n.kind]} className="size-[17px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-ink-900 block text-[14px] font-medium">{n.title}</span>
            {n.body && (
              <span className="text-ink-500 mt-0.5 block text-[12.5px] leading-snug">{n.body}</span>
            )}
          </span>
          <span className="data text-ink-300 shrink-0 text-[11.5px]">{relativeES(n.at)}</span>
        </li>
      ))}
    </ul>
  );
}
