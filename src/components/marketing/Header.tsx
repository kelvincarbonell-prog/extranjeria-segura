"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Button, IconButton } from "@/components/ui/Button";
import { CATEGORIES } from "@/content/taxonomy";
import { TRAMITES } from "@/content/tramites";
import { primaryNav } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = React.useState(false);
  const [mega, setMega] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 24));

  React.useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 140);
  };

  return (
    <>
      <header className="no-print fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
        <div className="container-page">
          <motion.div
            animate={{
              backgroundColor: condensed ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.55)",
              boxShadow: condensed
                ? "inset 0 0 0 1px rgba(10,13,22,.08), 0 10px 34px -14px rgba(10,13,22,.28)"
                : "inset 0 0 0 1px rgba(10,13,22,.05), 0 2px 10px -6px rgba(10,13,22,.12)",
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass relative flex h-16 items-center justify-between gap-4 rounded-[18px] pr-2 pl-4 md:h-[68px] md:pr-2.5 md:pl-5"
          >
            <Logo size="sm" className="md:hidden" />
            <Logo size="md" className="hidden md:inline-flex" />

            {/* ---------- Desktop nav ---------- */}
            <nav aria-label="Principal" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
              <ul className="flex items-center gap-1">
                {primaryNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  if ("mega" in item && item.mega) {
                    return (
                      <li key={item.href} onMouseEnter={openMega} onMouseLeave={closeMega}>
                        <Link
                          href={item.href}
                          aria-expanded={mega}
                          aria-haspopup="true"
                          onFocus={openMega}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors",
                            active || mega ? "text-ink-900 bg-ink-900/[.05]" : "text-ink-600 hover:text-ink-900",
                          )}
                        >
                          {item.label}
                          <motion.span animate={{ rotate: mega ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <Chevron />
                          </motion.span>
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-block rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors",
                          active ? "text-ink-900 bg-ink-900/[.05]" : "text-ink-600 hover:text-ink-900",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---------- Right cluster ---------- */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <Link
                href="/entrar"
                className="text-ink-600 hover:text-ink-900 hover:bg-ink-900/[.05] hidden rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors sm:inline-block"
              >
                Acceder
              </Link>
              <Button href="/diagnostico" size="sm" className="hidden sm:inline-flex" arrow>
                Comprobar mi situación
              </Button>
              <Button href="/diagnostico" size="sm" className="sm:hidden">
                Empezar
              </Button>
              <IconButton
                label={mobile ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setMobile((v) => !v)}
                className="lg:hidden"
                size={40}
              >
                <Burger open={mobile} />
              </IconButton>
            </div>

            {/* ---------- Mega menu ---------- */}
            <AnimatePresence>
              {mega && (
                <motion.div
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  initial={{ opacity: 0, y: -8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-[calc(100%+10px)] left-1/2 hidden w-[min(1080px,calc(100vw-4rem))] -translate-x-1/2 lg:block"
                >
                  <MegaMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>

      {/* ---------- Mobile sheet ---------- */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-canvas fixed inset-0 z-40 overflow-y-auto pt-24 pb-10 lg:hidden"
          >
            <nav aria-label="Menú móvil" className="container-page">
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="text-ink-900 border-ink-100 flex items-center justify-between border-b py-4 text-[22px] font-semibold tracking-[-0.02em]"
                    >
                      {item.label}
                      <span className="text-ink-300">
                        <Chevron className="-rotate-90" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-7 grid grid-cols-2 gap-2"
              >
                {CATEGORIES.slice(0, 8).map((c) => (
                  <Link
                    key={c.id}
                    href={`/tramites/categoria/${c.id}`}
                    className="panel-flat text-ink-700 flex items-center gap-2.5 p-3 text-[13.5px] font-medium"
                  >
                    <Glyph name={c.glyph} className="text-brand-600 size-[18px]" />
                    {c.short}
                  </Link>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="mt-8 flex flex-col gap-2.5"
              >
                <Button href="/diagnostico" size="lg" block arrow>
                  Comprobar mi situación
                </Button>
                <Button href="/entrar" variant="secondary" size="lg" block>
                  Acceder a mi expediente
                </Button>
                <div className="pt-3">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

function MegaMenu() {
  const popular = [
    "arraigo-sociolaboral",
    "nacionalidad-por-residencia",
    "teletrabajo-internacional",
    "reagrupacion-familiar",
    "renovacion-residencia-trabajo",
  ]
    .map((s) => TRAMITES.find((t) => t.slug === s))
    .filter(Boolean);

  return (
    <div className="bg-surface overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08),0_28px_70px_-20px_rgb(10_13_22_/_0.3)]">
      <div className="grid grid-cols-[1fr_300px]">
        <div className="p-6">
          <p className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.12em] uppercase">
            Por categoría
          </p>
          <ul className="grid grid-cols-3 gap-1">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/tramites/categoria/${c.id}`}
                  className="group hover:bg-ink-50 flex items-start gap-3 rounded-sm p-2.5 transition-colors"
                >
                  <span className="bg-brand-50 text-brand-600 group-hover:bg-brand-600 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[9px] transition-colors group-hover:text-white">
                    <Glyph name={c.glyph} className="size-[17px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink-900 block text-[13.5px] leading-tight font-semibold">
                      {c.label}
                    </span>
                    <span className="text-ink-400 mt-0.5 block text-[11.5px] leading-snug">
                      {c.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-canvas-deep border-ink-100 border-l p-6">
          <p className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.12em] uppercase">
            Más solicitados
          </p>
          <ul className="flex flex-col gap-0.5">
            {popular.map((t) => (
              <li key={t!.slug}>
                <Link
                  href={`/tramites/${t!.slug}`}
                  className="text-ink-700 hover:text-brand-700 hover:bg-brand-50/70 flex items-center justify-between gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] font-medium transition-colors"
                >
                  {t!.shortName ?? t!.name}
                  <Chevron className="text-ink-300 -rotate-90" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-ink-200 mt-5 border-t pt-5">
            <p className="text-ink-500 text-[13px] leading-snug">
              ¿No sabes cuál es el tuyo?
            </p>
            <Button href="/diagnostico" size="sm" variant="subtle" className="mt-3 w-full" arrow>
              Hacer el diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className={className} aria-hidden>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden>
      <motion.path
        d="M3.5 7h13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        animate={open ? { d: "M5 5l10 10" } : { d: "M3.5 7h13" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M3.5 13h13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        animate={open ? { d: "M5 15l10-10" } : { d: "M3.5 13h13" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
