"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckDraw } from "@/components/motion/primitives";
import { formatDateES, cn } from "@/lib/utils";

interface Step {
  readonly key: string;
  readonly label: string;
  readonly state: "done" | "active" | "todo";
  readonly date: string | null;
}

/**
 * The case timeline.
 *
 * Vertical on narrow screens (a phone reads a list far better than a squeezed
 * horizontal rail), horizontal from `lg` where the whole path fits at once.
 * Completed steps draw their check on first paint; the active step breathes.
 */
export function CaseTimeline({ steps }: { steps: readonly Step[] }) {
  const reduce = useReducedMotion();

  return (
    <>
      {/* -------- Vertical (mobile / tablet) -------- */}
      <ol className="flex flex-col lg:hidden">
        {steps.map((s, i) => (
          <li key={s.key} className="relative flex items-start gap-3.5 pb-5 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-[22px] left-[10px] w-px",
                  s.state === "done" ? "bg-signal-ok/30" : "bg-ink-100",
                )}
                style={{ height: "calc(100% - 8px)" }}
              />
            )}
            <Node state={s.state} index={i} reduce={reduce} />
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 pt-px">
              <span
                className={cn(
                  "text-[14.5px]",
                  s.state === "todo" ? "text-ink-300" : "text-ink-800 font-medium",
                  s.state === "active" && "text-ink-900 font-semibold",
                )}
              >
                {s.label}
              </span>
              {s.date && (
                <span className="data text-ink-300 shrink-0 text-[11.5px]">
                  {formatDateES(s.date, "short")}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* -------- Horizontal (desktop) -------- */}
      <ol className="hidden lg:flex lg:items-start">
        {steps.map((s, i) => (
          <li key={s.key} className="relative flex flex-1 flex-col items-center text-center last:flex-none">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-[10px] left-1/2 h-px w-full",
                  s.state === "done" ? "bg-signal-ok/30" : "bg-ink-100",
                )}
              />
            )}
            <Node state={s.state} index={i} reduce={reduce} compact />
            <span
              className={cn(
                "mt-2.5 max-w-[92px] text-[11.5px] leading-tight",
                s.state === "todo" ? "text-ink-300" : "text-ink-700 font-medium",
                s.state === "active" && "text-ink-900 font-semibold",
              )}
            >
              {s.label}
            </span>
            {s.date && (
              <span className="data text-ink-300 mt-1 text-[10.5px]">
                {formatDateES(s.date, "short")}
              </span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}

function Node({
  state,
  index,
  reduce,
  compact = false,
}: {
  state: Step["state"];
  index: number;
  reduce: boolean | null;
  compact?: boolean;
}) {
  const size = compact ? "size-[21px]" : "size-[21px]";
  return (
    <span
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full",
        size,
        state === "done" && "bg-signal-ok-soft text-signal-ok",
        state === "active" && "bg-brand-600 text-white",
        state === "todo" && "bg-ink-100 text-ink-300",
        compact && "bg-canvas ring-canvas ring-4",
        compact && state === "done" && "bg-signal-ok-soft",
        compact && state === "active" && "bg-brand-600",
        compact && state === "todo" && "bg-ink-100",
      )}
    >
      {state === "done" ? (
        <CheckDraw size={12} strokeWidth={3} delay={0.15 + index * 0.09} />
      ) : state === "active" ? (
        <motion.span
          className="size-1.5 rounded-full bg-white"
          animate={reduce ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.55, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <span className="bg-ink-300 size-1.5 rounded-full" />
      )}
    </span>
  );
}
