"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PIPELINE_STAGES, DEMO_PIPELINE, type DemoCaseCard, type StageId } from "@/content/demo";
import { Badge, DemoTag } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { eur, cn } from "@/lib/utils";

/**
 * CRM pipeline.
 *
 * Drag and drop with a keyboard equivalent, because a board you can only
 * operate with a mouse excludes part of the team. Every card is focusable and
 * can be moved with the arrow keys while focused.
 *
 * SLA is surfaced on the card itself: in immigration the deadline is the
 * business, and a case that is one day from a subsanación deadline must not
 * require opening it to find that out.
 */

export function Pipeline() {
  const [cases, setCases] = React.useState<DemoCaseCard[]>(DEMO_PIPELINE);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<StageId | null>(null);
  const [query, setQuery] = React.useState("");
  const [owner, setOwner] = React.useState<string | null>(null);
  const reduce = useReducedMotion();

  const owners = React.useMemo(
    () => [...new Set(DEMO_PIPELINE.map((c) => c.owner))].sort(),
    [],
  );

  const visible = cases.filter((c) => {
    if (owner && c.owner !== owner) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.client.toLowerCase().includes(q) ||
      c.reference.toLowerCase().includes(q) ||
      c.tramite.toLowerCase().includes(q)
    );
  });

  const move = (id: string, stage: StageId) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
  };

  const shift = (c: DemoCaseCard, delta: number) => {
    const i = PIPELINE_STAGES.findIndex((s) => s.id === c.stage);
    const next = PIPELINE_STAGES[Math.max(0, Math.min(PIPELINE_STAGES.length - 1, i + delta))];
    if (next) move(c.id, next.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- Controls ---------------- */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <span className="text-ink-300 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
              <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13.6 13.6 3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, referencia o trámite…"
            aria-label="Buscar expedientes"
            className="bg-surface text-ink-900 placeholder:text-ink-300 h-10 w-full rounded-sm pr-3.5 pl-10 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={owner === null} onClick={() => setOwner(null)}>
            Todos
          </FilterPill>
          {owners.map((o) => (
            <FilterPill key={o} active={owner === o} onClick={() => setOwner(owner === o ? null : o)}>
              {o}
            </FilterPill>
          ))}
        </div>

        <DemoTag label="Datos de demostración" />
      </div>

      <p className="text-ink-400 text-[12.5px]">
        Arrastra una tarjeta entre columnas, o enfócala y usa ← → para moverla.
      </p>

      {/* ---------------- Board ---------------- */}
      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const items = visible.filter((c) => c.stage === stage.id);
            const value = items.reduce((a, c) => a + c.valueCents, 0);
            const isOver = over === stage.id;

            return (
              <section
                key={stage.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage.id);
                }}
                onDragLeave={() => setOver((s) => (s === stage.id ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging) move(dragging, stage.id);
                  setDragging(null);
                  setOver(null);
                }}
                className={cn(
                  "flex w-[264px] shrink-0 flex-col rounded-lg p-2.5 transition-colors duration-200",
                  isOver ? "bg-brand-50 ring-brand-600/25 ring-2 ring-inset" : "bg-canvas-deep",
                )}
              >
                <header className="mb-2.5 flex items-center justify-between px-1.5 pt-1">
                  <h2 className="text-ink-700 text-[12.5px] font-bold tracking-[-0.01em]">
                    {stage.label}
                  </h2>
                  <span className="bg-surface text-ink-400 data ring-ink-900/[.06] rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset">
                    {items.length}
                  </span>
                </header>
                {value > 0 && (
                  <p className="text-ink-300 data mb-2 px-1.5 text-[11px]">{eur(value)}</p>
                )}

                <ul className="flex flex-1 flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {items.map((c) => (
                      <motion.li
                        key={c.id}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <article
                          draggable
                          tabIndex={0}
                          role="button"
                          aria-label={`${c.reference} · ${c.client} · ${c.tramite}. Fase ${stage.label}. Flechas izquierda y derecha para cambiar de fase.`}
                          onDragStart={() => setDragging(c.id)}
                          onDragEnd={() => {
                            setDragging(null);
                            setOver(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowRight") {
                              e.preventDefault();
                              shift(c, 1);
                            }
                            if (e.key === "ArrowLeft") {
                              e.preventDefault();
                              shift(c, -1);
                            }
                          }}
                          className={cn(
                            "bg-surface cursor-grab rounded-sm p-3 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_1px_2px_rgb(10_13_22_/_.04)]",
                            "transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_8px_20px_-8px_rgb(10_13_22_/_.2)]",
                            "active:cursor-grabbing",
                            dragging === c.id && "opacity-45",
                          )}
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="data text-ink-400 text-[10.5px] font-semibold">
                              {c.reference}
                            </span>
                            {c.slaDays !== null && (
                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                                  c.slaDays < 0
                                    ? "bg-signal-risk-soft text-signal-risk"
                                    : c.slaDays <= 2
                                      ? "bg-signal-warn-soft text-signal-warn"
                                      : "bg-ink-50 text-ink-400",
                                )}
                              >
                                {c.slaDays < 0
                                  ? `${Math.abs(c.slaDays)}d vencido`
                                  : `${c.slaDays}d`}
                              </span>
                            )}
                          </div>

                          <p className="text-ink-900 text-[13.5px] leading-tight font-semibold">
                            {c.client}
                          </p>
                          <p className="text-ink-500 mt-0.5 text-[12px] leading-snug">{c.tramite}</p>

                          {c.flags?.map((f) => (
                            <Badge key={f} tone="risk" className="mt-2">
                              {f}
                            </Badge>
                          ))}

                          <div className="border-ink-100 mt-2.5 flex items-center justify-between border-t pt-2.5">
                            <span
                              className={cn(
                                "flex items-center gap-1.5 text-[11px]",
                                c.owner === "Sin asignar" ? "text-signal-warn" : "text-ink-400",
                              )}
                            >
                              <Glyph name="family" className="size-3" />
                              {c.owner}
                            </span>
                            {c.valueCents > 0 && (
                              <span className="data text-ink-600 text-[11px] font-semibold">
                                {eur(c.valueCents)}
                              </span>
                            )}
                          </div>
                        </article>
                      </motion.li>
                    ))}
                  </AnimatePresence>

                  {items.length === 0 && (
                    <li className="text-ink-300 border-ink-200 rounded-sm border border-dashed px-3 py-6 text-center text-[12px]">
                      Sin expedientes
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-ink-950 text-white"
          : "bg-surface text-ink-600 hover:text-ink-900 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
      )}
    >
      {children}
    </button>
  );
}
