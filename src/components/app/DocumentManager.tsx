"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DEMO_DOCUMENTS, DOC_STATE_META, type DemoDocument, type DocState } from "@/content/demo";
import { Glyph } from "@/components/brand/Glyph";
import { Button, IconButton } from "@/components/ui/Button";
import { Badge, Card, LegalNote, Progress } from "@/components/ui/primitives";
import { CheckDraw } from "@/components/motion/primitives";
import { site } from "@/content/site";
import { relativeES, cn } from "@/lib/utils";

/**
 * Document manager.
 *
 * The states are the ones that actually occur in an immigration file —
 * including `caducado`, which is the single most common reason a file gets a
 * subsanación request. When a document has a problem the UI says exactly what
 * the problem is and exactly what to do, in one sentence each. "Documento
 * rechazado" with no explanation is how people lose expedientes.
 *
 * The reading step is presented as assistance, never as validation: the
 * professional's review is a separate, visible state that only a human moves.
 */

type Filter = "todos" | "pendientes" | "revision" | "validados";

export function DocumentManager() {
  const [docs, setDocs] = React.useState<DemoDocument[]>(DEMO_DOCUMENTS);
  const [filter, setFilter] = React.useState<Filter>("todos");
  const [open, setOpen] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [analysing, setAnalysing] = React.useState<string | null>(null);
  const reduce = useReducedMotion();

  const validated = docs.filter((d) => d.state === "correcto").length;
  const needsYou = docs.filter(
    (d) => (d.state === "pendiente" || d.state === "cambios" || d.state === "caducado") && d.owner === "cliente",
  ).length;

  const visible = docs.filter((d) => {
    if (filter === "todos") return true;
    if (filter === "pendientes") return ["pendiente", "cambios", "caducado"].includes(d.state);
    if (filter === "revision") return ["subido", "revision"].includes(d.state);
    return d.state === "correcto";
  });

  /**
   * Simulated upload → reading → awaiting professional review.
   * Wired to Supabase Storage + a signed-URL upload when auth is enabled;
   * the state machine below is the real one.
   */
  const simulateUpload = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, state: "subido" as DocState } : d)));
    setAnalysing(id);
    window.setTimeout(
      () => {
        setDocs((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  state: "revision" as DocState,
                  issue: undefined,
                  updatedAt: new Date().toISOString(),
                  extracted: d.extracted ?? {
                    "Tipo documental": "Detectado automáticamente",
                    Páginas: "—",
                    Legibilidad: "Correcta",
                  },
                }
              : d,
          ),
        );
        setAnalysing(null);
      },
      reduce ? 300 : 2200,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
            Documentos
          </h1>
          <p className="text-ink-500 mt-1.5 text-[15px]">
            {needsYou > 0
              ? `Necesitamos ${needsYou} ${needsYou === 1 ? "documento" : "documentos"} de tu parte para seguir.`
              : "Está todo en nuestras manos. Te avisamos en cuanto haya novedades."}
          </p>
        </div>
        <div className="w-full max-w-[220px]">
          <Progress
            value={Math.round((validated / docs.length) * 100)}
            label={`${validated}/${docs.length} validados`}
            tone="ok"
            size="sm"
          />
        </div>
      </div>

      {/* ---------------- Drop zone ---------------- */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const target = docs.find((d) => d.state === "pendiente" && d.owner === "cliente");
          if (target) simulateUpload(target.id);
        }}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300",
          dragging
            ? "border-brand-600 bg-brand-50/60 scale-[1.005]"
            : "border-ink-200 bg-surface hover:border-ink-300",
        )}
      >
        <span
          className={cn(
            "mx-auto flex size-12 items-center justify-center rounded-[15px] transition-colors",
            dragging ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-400",
          )}
        >
          <Glyph name="doc" className="size-6" />
        </span>
        <p className="text-ink-900 mt-4 text-[15.5px] font-semibold">
          {dragging ? "Suelta aquí tu documento" : "Arrastra tus documentos aquí"}
        </p>
        <p className="text-ink-400 mt-1.5 text-[13px]">
          PDF, JPG o PNG · hasta 20 MB por archivo · también puedes hacer una foto
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Button
            size="md"
            onClick={() => {
              const target = docs.find((d) => d.state === "pendiente" && d.owner === "cliente");
              if (target) simulateUpload(target.id);
            }}
          >
            Seleccionar archivo
          </Button>
          <Button size="md" variant="secondary">
            Hacer una foto
          </Button>
        </div>
        <p className="text-ink-400 mt-4 text-[11.5px]">
          Almacenamiento privado. Cada archivo se sirve con un enlace firmado que caduca.
        </p>
      </div>

      {/* ---------------- Filters ---------------- */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {(
          [
            ["todos", "Todos", docs.length],
            ["pendientes", "Pendientes", docs.filter((d) => ["pendiente", "cambios", "caducado"].includes(d.state)).length],
            ["revision", "En revisión", docs.filter((d) => ["subido", "revision"].includes(d.state)).length],
            ["validados", "Validados", validated],
          ] as [Filter, string, number][]
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all",
              filter === id
                ? "bg-ink-950 text-white"
                : "bg-surface text-ink-600 hover:text-ink-900 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
            )}
          >
            {label}
            <span className="data opacity-50">{count}</span>
          </button>
        ))}
      </div>

      {/* ---------------- List ---------------- */}
      <Card padding="none" className="overflow-hidden">
        <ul className="divide-ink-100 divide-y">
          <AnimatePresence initial={false}>
            {visible.map((d) => {
              const meta = DOC_STATE_META[d.state];
              const isOpen = open === d.id;
              const isAnalysing = analysing === d.id;

              return (
                <motion.li key={d.id} layout>
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-[12px]",
                        meta.tone === "ok" && "bg-signal-ok-soft text-signal-ok",
                        meta.tone === "warn" && "bg-signal-warn-soft text-signal-warn",
                        meta.tone === "risk" && "bg-signal-risk-soft text-signal-risk",
                        meta.tone === "brand" && "bg-brand-50 text-brand-600",
                        meta.tone === "neutral" && "bg-ink-50 text-ink-400",
                      )}
                    >
                      {d.state === "correcto" ? (
                        <CheckDraw size={18} strokeWidth={2.6} />
                      ) : (
                        <Glyph name={meta.glyph} className="size-[18px]" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-ink-900 text-[14.5px] font-medium">{d.name}</p>
                      <p className="text-ink-400 mt-0.5 text-[12.5px]">
                        {isAnalysing
                          ? "Analizando documento…"
                          : d.issue
                            ? d.issue.title
                            : d.hint
                              ? d.hint
                              : `${d.pages ? `${d.pages} páginas · ` : ""}Actualizado ${relativeES(d.updatedAt)}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isAnalysing ? (
                        <span className="text-brand-600 flex items-center gap-2 text-[12.5px] font-medium">
                          <motion.span
                            className="border-brand-600/25 border-t-brand-600 inline-block size-3.5 rounded-full border-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                          Leyendo
                        </span>
                      ) : (
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      )}

                      {(d.extracted || d.issue) && !isAnalysing && (
                        <IconButton
                          label={isOpen ? "Ocultar detalle" : "Ver detalle"}
                          onClick={() => setOpen(isOpen ? null : d.id)}
                          size={34}
                        >
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
                              <path
                                d="m4 6 4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.span>
                        </IconButton>
                      )}
                    </div>
                  </div>

                  {/* ---- Problem panel: what is wrong and what to do ---- */}
                  {d.issue && (
                    <div className="bg-signal-warn-soft border-signal-warn/15 border-t px-4 py-4 sm:px-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-3">
                          <Glyph name="alert" className="text-signal-warn mt-0.5 size-4 shrink-0" />
                          <div>
                            <p className="text-signal-warn text-[13.5px] font-semibold">
                              {d.issue.title}
                            </p>
                            <p className="text-ink-600 mt-1 text-[13px] leading-relaxed">
                              {d.issue.detail}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="shrink-0"
                          onClick={() => simulateUpload(d.id)}
                        >
                          {d.issue.action}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ---- Extracted-data panel ---- */}
                  <AnimatePresence initial={false}>
                    {isOpen && d.extracted && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-canvas-deep border-ink-100 border-t px-4 py-5 sm:px-5">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="bg-brand-50 text-brand-600 flex size-6 items-center justify-center rounded-[8px]">
                              <Glyph name="shield" className="size-3.5" />
                            </span>
                            <p className="text-ink-900 text-[13px] font-bold">
                              Revisión inteligente · documento leído correctamente
                            </p>
                          </div>

                          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                            {Object.entries(d.extracted).map(([k, v]) => (
                              <div
                                key={k}
                                className="border-ink-100 flex items-baseline justify-between gap-4 border-b py-1.5"
                              >
                                <dt className="text-ink-400 text-[12.5px]">{k}</dt>
                                <dd className="text-ink-800 data text-[12.5px] font-medium">{v}</dd>
                              </div>
                            ))}
                          </dl>

                          <LegalNote className="mt-4">
                            La revisión automática comprueba legibilidad, tipo documental y fechas.
                            <strong className="text-ink-600">
                              {" "}
                              No sustituye la validación del profesional responsable
                            </strong>
                            , que es quien decide si el documento sirve para tu expediente.
                          </LegalNote>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </Card>

      {/* ---------------- States legend ---------------- */}
      <Card padding="md">
        <p className="text-ink-400 mb-3.5 text-[11px] font-bold tracking-[0.11em] uppercase">
          Qué significa cada estado
        </p>
        <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {(
            [
              ["pendiente", "Todavía no lo has subido."],
              ["subido", "Lo hemos recibido correctamente."],
              ["revision", "Tu especialista lo está revisando."],
              ["correcto", "Validado por un profesional. No hay que tocarlo."],
              ["cambios", "Hay algo que corregir. Te decimos exactamente qué."],
              ["caducado", "Ha perdido vigencia y hay que renovarlo."],
            ] as [DocState, string][]
          ).map(([state, desc]) => {
            const meta = DOC_STATE_META[state];
            return (
              <li key={state} className="flex items-start gap-2.5">
                <Badge tone={meta.tone} className="mt-px shrink-0">
                  {meta.label}
                </Badge>
                <span className="text-ink-500 text-[13px] leading-snug">{desc}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {!site.features.aiDocumentReview && (
        <LegalNote variant="framed">
          La lectura automática de documentos está implementada en la interfaz pero no conectada a
          un proveedor de OCR en este entorno. Cuando se active, el encargado de tratamiento
          correspondiente se identificará en la política de privacidad y el proceso seguirá
          requiriendo la validación de un profesional.
        </LegalNote>
      )}
    </div>
  );
}
