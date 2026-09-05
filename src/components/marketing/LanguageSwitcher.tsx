"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { locales, type LocaleCode } from "@/content/site";
import {
  subscribeLocale,
  getLocaleSnapshot,
  getLocaleServerSnapshot,
  setLocale,
} from "@/lib/locale-store";
import { cn } from "@/lib/utils";

/**
 * Locale control.
 *
 * The platform is architected for eight locales. Locales whose legal content
 * has not been reviewed are shown as "próximamente" rather than served as
 * machine translation — mistranslated immigration requirements are a real
 * harm, not a cosmetic one.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Locale is external state (localStorage + <html lang>), so it is read
  // through a store rather than restored inside an effect: the first client
  // render already has the right value and there is no flash of Spanish.
  const current = React.useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getLocaleServerSnapshot,
  );

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (code: LocaleCode) => {
    setOpen(false);
    setLocale(code);
  };

  const active = locales.find((l) => l.code === current) ?? locales[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Idioma: ${active.native}. Cambiar idioma`}
        className="text-ink-600 hover:text-ink-900 hover:bg-ink-900/[.05] inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-[13.5px] font-medium transition-colors"
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.8 10h14.4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10 2.8c1.9 2 2.9 4.5 2.9 7.2S11.9 15.2 10 17.2C8.1 15.2 7.1 12.7 7.1 10S8.1 4.8 10 2.8Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <span className="uppercase">{active.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-md p-1.5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08),0_18px_44px_-14px_rgb(10_13_22_/_0.28)]"
          >
            {locales.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === current}
                  disabled={!l.ready}
                  onClick={() => pick(l.code)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[9px] px-2.5 py-2 text-left text-[13.5px] transition-colors",
                    l.code === current
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : l.ready
                        ? "text-ink-700 hover:bg-ink-50"
                        : "text-ink-300 cursor-not-allowed",
                  )}
                >
                  <span>{l.native}</span>
                  {!l.ready && (
                    <span className="text-ink-300 text-[10px] font-semibold tracking-wide uppercase">
                      Próximamente
                    </span>
                  )}
                  {l.code === current && <span aria-hidden>✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
