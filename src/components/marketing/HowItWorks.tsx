"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    glyph: "path",
    title: "Diagnóstico",
    body: "Respondes unas preguntas y te decimos qué vías pueden encajar contigo y qué hay que verificar. Gratis y sin registro.",
    detail: "3 minutos",
  },
  {
    n: "02",
    glyph: "clock",
    title: "Consulta con tu especialista",
    body: "Un profesional revisa tu caso de verdad, confirma la estrategia y te entrega el plan documental por escrito.",
    detail: "45 minutos",
  },
  {
    n: "03",
    glyph: "doc",
    title: "Documentación y revisión",
    body: "Subes cada documento a tu expediente. Te avisamos de lo que falta, de lo que caduca y de lo que hay que corregir.",
    detail: "A tu ritmo",
  },
  {
    n: "04",
    glyph: "stamp",
    title: "Presentación y seguimiento",
    body: "Presentamos telemáticamente, te damos el justificante y seguimos el expediente hasta la resolución.",
    detail: "Hasta el final",
  },
];

export function HowItWorks() {
  const [active, setActive] = React.useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="como-funciona" className="bg-canvas-deep relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Cuatro pasos. Siempre sabes en cuál estás."
            lede="Ninguna sorpresa, ningún «lo estamos mirando». En cada momento ves el estado real de tu expediente, qué falta y quién lo está tocando."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---- Step rail ---- */}
          <ol className="flex flex-col">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.n}>
                  <Reveal delay={i * 0.06}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive}
                      className={cn(
                        "group relative flex w-full gap-4 py-5 text-left transition-colors",
                        i > 0 && "border-ink-200/70 border-t",
                      )}
                    >
                      <span
                        className={cn(
                          "data mt-0.5 text-[12px] font-semibold tabular-nums transition-colors",
                          isActive ? "text-brand-600" : "text-ink-300",
                        )}
                      >
                        {s.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "font-display text-[18px] font-extrabold tracking-[-0.028em] transition-colors",
                              isActive ? "text-ink-900" : "text-ink-400 group-hover:text-ink-700",
                            )}
                          >
                            {s.title}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10.5px] font-semibold tracking-wide transition-colors",
                              isActive ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-400",
                            )}
                          >
                            {s.detail}
                          </span>
                        </span>
                        <motion.span
                          initial={false}
                          animate={{
                            height: isActive ? "auto" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="text-ink-500 block max-w-md pt-2 text-[14.5px] leading-relaxed">
                            {s.body}
                          </span>
                        </motion.span>
                      </span>
                    </button>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* ---- Illustration panel ---- */}
          <Reveal delay={0.1}>
            <div className="bg-surface relative overflow-hidden rounded-xl p-6 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_20px_50px_-24px_rgb(10_13_22_/_0.18)] md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(420px 260px at 82% 6%, rgba(65,89,250,.10), transparent 66%)",
                }}
              />
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <span className="bg-ink-950 flex size-11 items-center justify-center rounded-[14px] text-white">
                    <Glyph name={STEPS[active].glyph} className="size-5" />
                  </span>
                  <div>
                    <p className="text-ink-400 text-[11px] font-bold tracking-[0.12em] uppercase">
                      Paso {STEPS[active].n}
                    </p>
                    <p className="text-ink-900 font-display text-[16px] font-extrabold tracking-[-0.025em]">
                      {STEPS[active].title}
                    </p>
                  </div>
                </div>

                <StepVisual index={active} reduce={reduce} />

                <div className="border-ink-100 mt-6 border-t pt-5">
                  <Button href="/diagnostico" size="md" arrow block>
                    Empezar por el diagnóstico
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function StepVisual({ index, reduce }: { index: number; reduce: boolean | null }) {
  const common = "rounded-md bg-canvas-deep p-4 ring-1 ring-inset ring-ink-900/[.05]";

  if (index === 0) {
    return (
      <motion.div key="s0" {...fade(reduce)} className="flex flex-col gap-2.5">
        {["¿Dónde te encuentras ahora?", "¿Cuánto tiempo llevas en España?", "¿Cuál es tu situación laboral?"].map(
          (q, i) => (
            <div key={q} className={cn(common, "flex items-center gap-3")}>
              <span className="data text-ink-300 text-[11px]">0{i + 1}</span>
              <span className="text-ink-700 flex-1 text-[13.5px] font-medium">{q}</span>
              {i === 0 && (
                <span className="bg-brand-600 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                  En España
                </span>
              )}
            </div>
          ),
        )}
      </motion.div>
    );
  }

  if (index === 1) {
    return (
      <motion.div key="s1" {...fade(reduce)} className="flex flex-col gap-2.5">
        <div className={cn(common, "flex items-center justify-between")}>
          <span className="text-ink-700 text-[13.5px] font-medium">Videollamada · 45 min</span>
          <span className="data text-ink-900 text-[13px] font-semibold">12 oct · 17:00</span>
        </div>
        <div className={cn(common)}>
          <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.1em] uppercase">
            Plan documental
          </p>
          <ul className="flex flex-col gap-1.5">
            {["Estrategia confirmada", "8 documentos identificados", "Puntos a verificar listados"].map(
              (t, i) => (
                <li key={t} className="text-ink-700 flex items-center gap-2 text-[13px]">
                  <span className="bg-signal-ok-soft text-signal-ok flex size-4 items-center justify-center rounded-full">
                    <CheckDraw size={9} strokeWidth={3.4} delay={0.2 + i * 0.12} />
                  </span>
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
      </motion.div>
    );
  }

  if (index === 2) {
    const docs = [
      { name: "Pasaporte", state: "ok" },
      { name: "Empadronamiento", state: "ok" },
      { name: "Contrato de trabajo", state: "warn" },
      { name: "Antecedentes penales", state: "idle" },
    ];
    return (
      <motion.div key="s2" {...fade(reduce)} className="flex flex-col gap-2">
        {docs.map((d, i) => (
          <motion.div
            key={d.name}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(common, "flex items-center gap-3 py-3")}
          >
            <Glyph name="doc" className="text-ink-300 size-4 shrink-0" />
            <span className="text-ink-700 flex-1 text-[13px] font-medium">{d.name}</span>
            <StateDot state={d.state as "ok" | "warn" | "idle"} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div key="s3" {...fade(reduce)} className="flex flex-col gap-2.5">
      <div className={cn(common, "flex items-center justify-between")}>
        <span className="text-ink-700 text-[13.5px] font-medium">Presentado telemáticamente</span>
        <span className="bg-signal-ok-soft text-signal-ok rounded-full px-2.5 py-1 text-[11px] font-semibold">
          Justificante
        </span>
      </div>
      <div className={cn(common)}>
        <p className="text-ink-400 text-[11px] font-medium">Número de expediente</p>
        <p className="data text-ink-900 mt-1 text-[15px] font-semibold">ES-2048 / 2026</p>
      </div>
      <div className={cn(common, "flex items-center gap-3")}>
        <span className="bg-brand-600 relative flex size-2 shrink-0 rounded-full">
          <span className="bg-brand-600 absolute inline-flex size-full animate-[pulse-ring_2.6s_linear_infinite] rounded-full" />
        </span>
        <span className="text-ink-700 text-[13px] font-medium">En seguimiento activo</span>
      </div>
    </motion.div>
  );
}

function StateDot({ state }: { state: "ok" | "warn" | "idle" }) {
  const map = {
    ok: { c: "bg-signal-ok-soft text-signal-ok", l: "Validado" },
    warn: { c: "bg-signal-warn-soft text-signal-warn", l: "Revisar" },
    idle: { c: "bg-ink-100 text-ink-400", l: "Pendiente" },
  }[state];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", map.c)}>{map.l}</span>
  );
}

function fade(reduce: boolean | null) {
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };
}
