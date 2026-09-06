"use client";

import * as React from "react";
// Deliberadamente `next/link` y no el envoltorio de `@/components/ui/Link`:
// este es el único sitio del producto donde un enlace debe salir del idioma
// actual. El envoltorio prefijaría con el idioma vigente y el selector no
// dejaría cambiar nunca de lengua.
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  LOCALE_META,
  LOCALE_ORDER,
  hasReviewedContent,
  href,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma.
 *
 * Son enlaces, no botones. El idioma es una URL —`/ar/tramites` existe y se
 * puede compartir, marcar y rastrear—, así que cambiar de idioma es navegar.
 * Con `<a>` reales el usuario puede abrir otra lengua en una pestaña nueva y
 * un rastreador puede seguir el enlace; con un `onClick` que escribiera en
 * `localStorage`, ninguna de las dos cosas funcionaría.
 *
 * Se conserva la ruta actual al cambiar: quien está leyendo la ficha de
 * arraigo social y pasa a francés sigue en esa ficha, no vuelve a la portada.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const { locale, t } = useLocale();
  const pathname = usePathname() ?? "/";

  // La ruta sin prefijo de idioma es la que se reconstruye en cada idioma.
  const { path } = stripLocale(pathname);

  React.useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const active = LOCALE_META[locale];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${t.common.languageLabel}: ${active.native}. ${t.common.changeLanguage}`}
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
        <span className="uppercase">{locale}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface absolute end-0 z-50 mt-2 w-72 origin-top overflow-hidden rounded-md p-1.5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08),0_18px_44px_-14px_rgb(10_13_22_/_0.28)]"
          >
            <ul>
              {LOCALE_ORDER.map((code: Locale) => {
                const meta = LOCALE_META[code];
                const isActive = code === locale;
                return (
                  <li key={code}>
                    <NextLink
                      href={href(path, code)}
                      hrefLang={meta.bcp47}
                      lang={meta.bcp47}
                      dir={meta.dir}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-[9px] px-2.5 py-2 text-start text-[13.5px] transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-700 font-semibold"
                          : "text-ink-700 hover:bg-ink-50",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{meta.native}</span>
                        {/* El aviso es honesto y específico: la interfaz está
                            traducida, el contenido jurídico todavía no. */}
                        {!hasReviewedContent(code) && (
                          <span className="text-ink-400 mt-0.5 block text-[11px] leading-snug">
                            Interfaz traducida · contenido jurídico en español
                          </span>
                        )}
                      </span>
                      {isActive && <span aria-hidden>✓</span>}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
