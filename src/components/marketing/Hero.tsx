"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { CheckDraw, TextReveal } from "@/components/motion/primitives";
import { HeroStage } from "./HeroStage";

const PROMISES = [
  "Primera orientación gratuita",
  "Gestión 100% online",
  "Seguimiento en tiempo real",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40">
      {/* Engineering grid — texture, not decoration. Faded to nothing at the edges. */}
      <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[520px]"
        style={{
          background:
            "radial-gradient(900px 420px at 28% 30%, rgba(65,89,250,.10), transparent 66%)",
        }}
      />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-10 xl:gap-16">
          {/* ---------------- Copy ---------------- */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-ink-500 ring-ink-900/[.07] bg-surface/70 mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-2 text-[11.5px] font-semibold tracking-[0.1em] uppercase ring-1 ring-inset backdrop-blur-sm"
            >
              <span className="bg-brand-600 relative flex size-1.5 rounded-full">
                <span className="bg-brand-600 absolute inline-flex size-full animate-[pulse-ring_2.6s_cubic-bezier(0.25,1,0.5,1)_infinite] rounded-full" />
              </span>
              Extranjería · 100% online
            </motion.p>

            <TextReveal
              as="h1"
              text="Tu vida en España."
              className="text-display-lg sm:text-display-xl lg:text-display-2xl text-ink-900"
              delay={0.08}
            />
            <TextReveal
              as="h2"
              text="Nosotros resolvemos los papeles."
              className="text-display-lg sm:text-display-xl lg:text-display-2xl text-ink-400 mt-1"
              delay={0.26}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-ink-500 mt-7 max-w-xl text-[17px] leading-[1.6] md:text-[18.5px]"
            >
              Descubre en menos de 3 minutos qué permiso necesitas, qué documentación debes
              presentar y cómo podemos gestionarlo por ti de principio a fin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.74, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href="/diagnostico" size="xl" arrow magnetic>
                Comprobar mi situación
              </Button>
              <Button href="/tramites" size="xl" variant="secondary">
                Ya sé qué trámite necesito
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-9 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
            >
              {PROMISES.map((p, i) => (
                <li key={p} className="text-ink-600 flex items-center gap-2 text-[14px]">
                  <span className="bg-signal-ok-soft text-signal-ok flex size-[18px] shrink-0 items-center justify-center rounded-full">
                    <CheckDraw size={11} strokeWidth={3} delay={1.05 + i * 0.14} />
                  </span>
                  {p}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ---------------- 3D stage ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:pl-4"
          >
            <HeroStage />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
