"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import type { FaqItem } from "@/content/taxonomy";
import { cn } from "@/lib/utils";

export function TramiteFaq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <ul className="bg-surface divide-ink-100 divide-y overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-start justify-between gap-5 p-5 text-left"
              >
                <span
                  className={cn(
                    "text-[15px] leading-snug font-semibold tracking-[-0.015em] transition-colors",
                    isOpen ? "text-ink-900" : "text-ink-700 group-hover:text-ink-900",
                  )}
                >
                  {f.q}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isOpen ? "bg-ink-950 rotate-45 text-white" : "bg-ink-50 text-ink-400",
                  )}
                >
                  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden>
                    <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-ink-500 px-5 pb-5 text-[14.5px] leading-[1.65]">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
