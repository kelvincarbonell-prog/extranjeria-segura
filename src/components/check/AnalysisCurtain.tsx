"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { IsotipoAnimado } from "@/components/brand/IsotipoAnimado";
import { CheckDraw } from "@/components/motion/primitives";

/**
 * THE MOMENT.
 *
 * A full-screen curtain between the last question and the result. It has a
 * job beyond theatre: the analysis genuinely resolves in milliseconds, and
 * dumping the result instantly reads as unserious for a decision this heavy.
 * The curtain narrates what is actually being checked, then hands over.
 *
 * Under prefers-reduced-motion the whole sequence collapses to a single
 * static frame and a short delay — no particles, no drift, no flashing.
 */

const STAGES = [
  "Leyendo tus respuestas",
  "Comparando con las vías disponibles",
  "Revisando qué habría que verificar",
  "Preparando tu resultado",
];

export function AnalysisCurtain({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState(0);
  const [revealing, setRevealing] = React.useState(false);

  React.useEffect(() => {
    if (reduce) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStage(1), 620),
      setTimeout(() => setStage(2), 1240),
      setTimeout(() => setStage(3), 1860),
      setTimeout(() => setRevealing(true), 2480),
      setTimeout(onDone, 3900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduce, onDone]);

  return (
    <div className="bg-ink-950 fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
      {/* Ambient field */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background:
            "radial-gradient(900px 600px at 50% 42%, rgba(65,89,250,.30), transparent 62%), radial-gradient(600px 500px at 18% 88%, rgba(11,138,95,.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 45%, #000 5%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 45%, #000 5%, transparent 72%)",
        }}
      />

      {!reduce && <ParticleField />}

      <div className="relative flex flex-col items-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!revealing ? (
            <motion.div
              key="analysing"
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Pulsing mark */}
              <div className="relative mb-9 flex size-20 items-center justify-center">
                {!reduce &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-[26px] ring-1 ring-white/25"
                      animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                {/* El gesto de la marca —el camino abriéndose paso y
                    rompiendo el arco— es literalmente lo que está pasando en
                    esta pantalla. Aquí el logo no decora: narra. */}
                <IsotipoAnimado size={56} variante="inverse" id="curtain" />
              </div>

              <h1 className="font-display text-[28px] font-extrabold tracking-[-0.035em] text-white sm:text-[34px]">
                Analizando tu situación
                <AnimatedDots reduce={reduce} />
              </h1>

              <ul className="mt-8 flex flex-col gap-2.5" aria-live="polite">
                {STAGES.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0.18 }}
                    animate={{ opacity: i <= stage ? 1 : 0.18 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2.5 text-[14px] text-white/75"
                  >
                    <span
                      className={`flex size-[18px] shrink-0 items-center justify-center rounded-full transition-colors ${
                        i < stage ? "bg-signal-ok/20 text-signal-ok" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {i < stage ? (
                        <CheckDraw size={10} strokeWidth={3.4} />
                      ) : i === stage ? (
                        <motion.span
                          className="size-1.5 rounded-full bg-white"
                          animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      ) : (
                        <span className="size-1.5 rounded-full bg-white/30" />
                      )}
                    </span>
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-signal-ok/15 ring-signal-ok/25 mb-8 flex size-16 items-center justify-center rounded-[22px] ring-1"
              >
                <span className="text-signal-ok">
                  <CheckDraw size={30} strokeWidth={2.6} delay={0.25} />
                </span>
              </motion.div>

              <h1 className="font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-[52px]">
                Tenemos un camino para ti.
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/50"
              >
                Vamos a enseñártelo con lo que encaja y con lo que todavía habría que comprobar.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Particles as document glyphs drifting upward — restrained, 18 of them,
 * pure CSS transforms, removed entirely under reduced motion.
 */
function ParticleField() {
  const seeds = React.useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (i * 37) % 100,
        delay: (i % 7) * 0.55,
        duration: 8 + (i % 5) * 1.6,
        size: 3 + (i % 3),
        opacity: 0.16 + (i % 4) * 0.07,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
          initial={{ y: "110vh" }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedDots({ reduce }: { reduce: boolean | null }) {
  if (reduce) return <span>…</span>;
  return (
    <span aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
