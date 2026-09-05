"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge, LegalNote } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";

/**
 * Immigration Check™ — the section that sells the wizard.
 *
 * It runs a real, abbreviated loop of the product's own question UI on a
 * timer so the visitor sees the mechanic before committing to it. The copy
 * draws the line the whole product depends on: orientation ≠ advice.
 */

const PREVIEW = [
  {
    n: 2,
    q: "¿Dónde te encuentras ahora?",
    options: ["En España", "Fuera de España"],
    picked: 0,
  },
  {
    n: 3,
    q: "¿Cuánto tiempo llevas viviendo en España?",
    options: ["Menos de 1 año", "Entre 1 y 2 años", "Más de 2 años"],
    picked: 2,
  },
  {
    n: 5,
    q: "¿Cuál es tu situación laboral?",
    options: ["Tengo un contrato en España", "Tengo una oferta firmada", "Ninguna de las dos"],
    picked: 0,
  },
];

export function CheckTeaser() {
  const reduce = useReducedMotion();
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState(false);

  React.useEffect(() => {
    if (reduce) return;
    const a = setTimeout(() => setPicked(true), 1600);
    const b = setTimeout(() => {
      setPicked(false);
      setI((v) => (v + 1) % PREVIEW.length);
    }, 3000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [i, reduce]);

  const step = PREVIEW[i];
  const progress = ((step.n - 1) / 8) * 100;

  return (
    <section id="immigration-check" className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---- Copy ---- */}
          <div>
            <Reveal>
              <span className="eyebrow mb-5">
                <span aria-hidden className="bg-brand-600 h-px w-5 rounded-full" />
                La joya de la plataforma
              </span>
              <h2 className="text-display-md md:text-display-lg text-ink-900">
                Immigration Check
                <span className="text-brand-600 align-super text-[0.4em]">™</span>
              </h2>
              <p className="text-ink-500 mt-5 max-w-lg text-[17px] leading-[1.6] md:text-lg">
                Responde unas preguntas y descubre qué opciones pueden encajar con tu situación.
                Ocho preguntas condicionales: solo te preguntamos lo que hace falta para tu caso.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-8 flex flex-col gap-4">
                {[
                  {
                    glyph: "path",
                    t: "Vías que pueden encajar contigo",
                    d: "Ordenadas por encaje preliminar, con las alternativas.",
                  },
                  {
                    glyph: "doc",
                    t: "Qué documentación te van a pedir",
                    d: "La lista real, con quién obtiene cada documento.",
                  },
                  {
                    glyph: "alert",
                    t: "Qué habría que verificar en tu caso",
                    d: "Lo que un profesional tiene que mirar antes de nada.",
                  },
                ].map((f) => (
                  <li key={f.t} className="flex gap-3.5">
                    <span className="bg-brand-50 text-brand-600 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[11px]">
                      <Glyph name={f.glyph} className="size-[18px]" />
                    </span>
                    <span>
                      <span className="text-ink-900 block text-[14.5px] font-semibold">{f.t}</span>
                      <span className="text-ink-500 mt-0.5 block text-[13.5px] leading-relaxed">
                        {f.d}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/diagnostico" size="lg" arrow magnetic>
                  Empezar el diagnóstico
                </Button>
                <Button href="/como-funciona" size="lg" variant="ghost">
                  Ver cómo lo analizamos
                </Button>
              </div>

              <LegalNote className="mt-6 max-w-lg">
                El diagnóstico es una <strong className="text-ink-600">orientación preliminar</strong>{" "}
                automatizada. No es asesoramiento jurídico ni confirma que cumplas los requisitos:
                eso solo puede hacerlo un profesional revisando tu documentación real.
              </LegalNote>
            </Reveal>
          </div>

          {/* ---- Live wizard preview ---- */}
          <Reveal delay={0.08}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 opacity-70"
                style={{
                  background:
                    "radial-gradient(420px 300px at 50% 30%, rgba(65,89,250,.14), transparent 68%)",
                }}
              />
              <div className="bg-surface overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08),0_30px_70px_-26px_rgb(10_13_22_/_0.28)]">
                {/* Progress rail */}
                <div className="border-ink-100 border-b px-6 py-4">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-ink-400 data text-[11.5px] font-medium">
                      Pregunta {step.n} de 8
                    </span>
                    <Badge tone="neutral">Vista previa</Badge>
                  </div>
                  <div className="bg-ink-100 h-1 w-full overflow-hidden rounded-full">
                    <motion.div
                      className="bg-brand-600 h-full rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <div className="px-6 py-7 sm:px-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={i}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -14 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h3 className="text-ink-900 font-display text-[21px] leading-tight font-extrabold tracking-[-0.03em] sm:text-[24px]">
                        {step.q}
                      </h3>

                      <div className="mt-6 flex flex-col gap-2.5">
                        {step.options.map((opt, oi) => {
                          const isPicked = picked && oi === step.picked;
                          return (
                            <motion.div
                              key={opt}
                              animate={{
                                borderColor: isPicked
                                  ? "rgba(36,56,232,.45)"
                                  : "rgba(10,13,22,.08)",
                                backgroundColor: isPicked ? "rgba(238,241,255,.7)" : "#fff",
                              }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-3 rounded-md border px-4 py-3.5"
                            >
                              <span
                                className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  isPicked
                                    ? "border-brand-600 bg-brand-600 text-white"
                                    : "border-ink-200"
                                }`}
                              >
                                {isPicked && <CheckDraw size={10} strokeWidth={3.6} />}
                              </span>
                              <span
                                className={`text-[14.5px] font-medium transition-colors ${
                                  isPicked ? "text-brand-800" : "text-ink-700"
                                }`}
                              >
                                {opt}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="bg-canvas-deep border-ink-100 flex items-center justify-between border-t px-6 py-4">
                  <span className="text-ink-400 text-[12.5px]">Puedes volver atrás en cualquier momento</span>
                  <span className="bg-ink-950 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
                    Continuar
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
                      <path
                        d="M3 8h9M8.6 4.6 12 8l-3.4 3.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
