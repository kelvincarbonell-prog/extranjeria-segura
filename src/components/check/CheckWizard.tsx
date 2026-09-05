"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { QUESTIONS, activeQuestions, type Answers, type Question } from "@/content/check-questions";
import { evaluate, type CheckResult } from "@/content/check-engine";
import { Glyph } from "@/components/brand/Glyph";
import { Logo } from "@/components/brand/Logo";
import { Button, IconButton } from "@/components/ui/Button";
import { LegalNote } from "@/components/ui/primitives";
import { CheckDraw } from "@/components/motion/primitives";
import { CheckResultView } from "./CheckResult";
import { AnalysisCurtain } from "./AnalysisCurtain";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "es.check.answers";

type Phase = "asking" | "analysing" | "result";

export function CheckWizard() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [answers, setAnswers] = React.useState<Answers>({});
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [phase, setPhase] = React.useState<Phase>("asking");
  const [result, setResult] = React.useState<CheckResult | null>(null);
  const [restored, setRestored] = React.useState(false);
  const liveRef = React.useRef<HTMLDivElement>(null);

  /* ---- Restore a session in progress, and honour ?objetivo= deep links ---- */
  React.useEffect(() => {
    let initial: Answers = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) initial = JSON.parse(raw) as Answers;
    } catch {
      /* storage unavailable */
    }
    const objetivo = params.get("objetivo");
    if (objetivo && QUESTIONS[0].options.some((o) => o.value === objetivo)) {
      initial = { ...initial, objetivo };
    }
    setAnswers(initial);
    // Resume at the first unanswered active question.
    const active = activeQuestions(initial);
    const firstGap = active.findIndex((q) => initial[q.id] === undefined);
    setIndex(firstGap === -1 ? Math.max(0, active.length - 1) : firstGap);
    setRestored(true);
  }, [params]);

  React.useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers, restored]);

  const active = React.useMemo(() => activeQuestions(answers), [answers]);
  const question: Question | undefined = active[Math.min(index, active.length - 1)];
  const total = active.length;
  const step = Math.min(index + 1, total);
  const progress = (index / total) * 100;

  const answered = question ? answers[question.id] !== undefined : false;

  const goNext = React.useCallback(
    (nextAnswers: Answers) => {
      const nextActive = activeQuestions(nextAnswers);
      const nextIndex = index + 1;
      if (nextIndex >= nextActive.length) {
        setPhase("analysing");
        return;
      }
      setDirection(1);
      setIndex(nextIndex);
    },
    [index],
  );

  const choose = (q: Question, value: string) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    // Small pause so the selected state is legible before the screen turns.
    window.setTimeout(() => goNext(next), reduce ? 0 : 260);
  };

  const goBack = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase("asking");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ---- Keyboard: 1–9 to pick, ← to go back, Enter to advance ---- */
  React.useEffect(() => {
    if (phase !== "asking" || !question) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goBack();
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) {
        e.preventDefault();
        choose(question, question.options[n - 1].value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question, index, answers]);

  if (!restored) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="skeleton h-2 w-40" />
      </div>
    );
  }

  /* ------------------------------------------------------------------ */

  if (phase === "analysing") {
    return (
      <AnalysisCurtain
        onDone={() => {
          setResult(evaluate(answers));
          setPhase("result");
        }}
      />
    );
  }

  if (phase === "result" && result) {
    return <CheckResultView result={result} answers={answers} onRestart={restart} />;
  }

  if (!question) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ---------------- Chrome ---------------- */}
      <header className="sticky top-0 z-30">
        <div className="glass border-ink-100 border-b">
          <div className="container-page flex h-16 items-center justify-between gap-4">
            <Logo size="sm" showWordmark={false} className="sm:hidden" />
            <Logo size="sm" className="hidden sm:inline-flex" />

            <div className="flex flex-1 items-center justify-center gap-3 px-2 sm:px-8">
              <span className="data text-ink-400 hidden shrink-0 text-[12px] font-medium sm:inline">
                {step} / {total}
              </span>
              <div className="bg-ink-100 h-1.5 w-full max-w-md overflow-hidden rounded-full">
                <motion.div
                  className="bg-brand-600 h-full rounded-full"
                  animate={{ width: `${Math.max(progress, 4)}%` }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <IconButton label="Salir del diagnóstico" onClick={() => history.back()}>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </header>

      {/* ---------------- Question ---------------- */}
      <main className="relative flex flex-1 items-center overflow-hidden py-10">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60"
        />

        <div className="container-page w-full">
          <div ref={liveRef} aria-live="polite" className="sr-only">
            Pregunta {step} de {total}: {question.title}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              initial={reduce ? false : { opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-2xl"
            >
              <p className="text-ink-400 data mb-4 text-[12.5px] font-medium sm:hidden">
                Pregunta {step} de {total}
              </p>

              <h1 className="text-ink-900 font-display text-[30px] leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[38px] md:text-[44px]">
                {question.title}
              </h1>
              {question.help && (
                <p className="text-ink-500 mt-4 max-w-lg text-[15.5px] leading-relaxed">
                  {question.help}
                </p>
              )}
              {question.sensitive && (
                <p className="text-ink-400 mt-3 inline-flex items-center gap-1.5 text-[12.5px]">
                  <Glyph name="lock" className="size-3.5" />
                  Esta respuesta es confidencial y solo se usa para orientarte
                </p>
              )}

              <div
                role="radiogroup"
                aria-label={question.title}
                className={cn(
                  "mt-8 grid gap-2.5",
                  question.options.length > 6 ? "sm:grid-cols-2" : "grid-cols-1",
                )}
              >
                {question.options.map((opt, i) => {
                  const selected = answers[question.id] === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(question, opt.value)}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "group relative flex items-center gap-3.5 rounded-lg px-4 py-4 text-left transition-all duration-250",
                        "bg-surface shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)]",
                        "hover:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.35),0_8px_24px_-10px_rgb(36_56_232_/_0.3)]",
                        "active:scale-[0.99]",
                        selected &&
                          "bg-brand-50/60 shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.55),0_10px_28px_-12px_rgb(36_56_232_/_0.35)]",
                      )}
                    >
                      {opt.glyph ? (
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-colors",
                            selected
                              ? "bg-brand-600 text-white"
                              : "bg-ink-50 text-ink-500 group-hover:bg-brand-50 group-hover:text-brand-600",
                          )}
                        >
                          <Glyph name={opt.glyph} className="size-[19px]" />
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "flex size-[20px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            selected ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200",
                          )}
                        >
                          {selected && <CheckDraw size={11} strokeWidth={3.4} />}
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-[15px] leading-snug font-semibold tracking-[-0.012em]",
                            selected ? "text-brand-800" : "text-ink-900",
                          )}
                        >
                          {opt.label}
                        </span>
                        {opt.hint && (
                          <span className="text-ink-400 mt-0.5 block text-[12.5px] leading-snug">
                            {opt.hint}
                          </span>
                        )}
                      </span>

                      <kbd className="text-ink-300 bg-ink-50 hidden size-5 shrink-0 items-center justify-center rounded-[5px] text-[10.5px] font-semibold sm:flex">
                        {i + 1}
                      </kbd>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  disabled={index === 0}
                  icon={
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                      <path
                        d="M13 8H3M6.4 4.6 3 8l3.4 3.4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                >
                  Atrás
                </Button>

                {answered && (
                  <Button size="md" onClick={() => goNext(answers)} arrow>
                    Continuar
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-ink-100 border-t py-5">
        <div className="container-page">
          <LegalNote className="mx-auto max-w-2xl">
            El resultado es una <strong className="text-ink-600">orientación preliminar</strong>{" "}
            generada automáticamente a partir de tus respuestas. No es asesoramiento jurídico ni
            confirma que cumplas los requisitos de ninguna vía. La{" "}
            <strong className="text-ink-600">validación profesional</strong> requiere que un
            especialista revise tu documentación real.
          </LegalNote>
        </div>
      </footer>
    </div>
  );
}
