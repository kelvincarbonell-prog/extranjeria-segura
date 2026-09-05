"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Avatar, Progress, LegalNote } from "@/components/ui/primitives";
import { CheckDraw } from "@/components/motion/primitives";
import { Confetti } from "@/components/check/Confetti";
import { cn } from "@/lib/utils";

/**
 * Post-contract onboarding.
 *
 * Four steps, in the order the case actually needs them. The celebration is
 * one beat at the start and then gets out of the way — the person has just
 * paid for something stressful and wants to know what to do, not to watch an
 * animation.
 */

const STEPS = [
  {
    glyph: "shield",
    title: "Verifica tu identidad",
    body: "Sube tu pasaporte o documento de identidad. Es lo primero que necesitamos para poder actuar en tu nombre.",
    action: "Subir mi documento",
    href: "/app/documentos",
    minutes: 2,
  },
  {
    glyph: "doc",
    title: "Completa tu información",
    body: "Datos de contacto, domicilio en España y situación actual. Nos permite preparar tu plan documental exacto.",
    action: "Completar mis datos",
    href: "/app/perfil",
    minutes: 4,
  },
  {
    glyph: "path",
    title: "Sube tu documentación",
    body: "Te damos la lista concreta de tu caso, con instrucciones documento por documento y quién obtiene cada uno.",
    action: "Ver mi lista",
    href: "/app/documentos",
    minutes: 10,
  },
  {
    glyph: "family",
    title: "Conoce a tu especialista",
    body: "Te presentamos a la persona que lleva tu expediente y puedes escribirle desde el primer minuto.",
    action: "Abrir el chat",
    href: "/app/mensajes",
    minutes: 1,
  },
];

export function Onboarding() {
  const reduce = useReducedMotion();
  const [celebrating, setCelebrating] = React.useState(true);
  const [done, setDone] = React.useState<number[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => setCelebrating(false), reduce ? 700 : 2600);
    return () => clearTimeout(t);
  }, [reduce]);

  const progress = Math.round((done.length / STEPS.length) * 100);

  return (
    <div className="bg-canvas-deep min-h-dvh">
      <AnimatePresence>
        {celebrating && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-ink-950 fixed inset-0 z-[80] flex items-center justify-center px-6"
          >
            {!reduce && <Confetti />}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(760px 500px at 50% 42%, rgba(65,89,250,.32), transparent 62%)",
              }}
            />
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center"
            >
              <motion.div
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-signal-ok/15 ring-signal-ok/25 mx-auto mb-8 flex size-16 items-center justify-center rounded-[22px] ring-1"
              >
                <span className="text-signal-ok">
                  <CheckDraw size={30} strokeWidth={2.6} delay={0.4} />
                </span>
              </motion.div>
              <h1 className="font-display text-[32px] leading-[1.06] font-extrabold tracking-[-0.04em] text-white sm:text-[46px]">
                Bienvenido a Extranjería Segura.
              </h1>
              <p className="mt-4 text-[16px] text-white/55">Tu expediente ya está en marcha.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-ink-100 bg-surface border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo size="sm" />
          <Link href="/app" className="text-ink-500 hover:text-ink-900 text-[13.5px] transition-colors">
            Ir a mi expediente →
          </Link>
        </div>
      </header>

      <main id="contenido" className="container-tight py-12 md:py-16">
        <h2 className="text-ink-900 font-display text-[28px] leading-tight font-extrabold tracking-[-0.038em] md:text-[34px]">
          Cuatro pasos y estamos en marcha.
        </h2>
        <p className="text-ink-500 mt-3 text-[16px] leading-relaxed">
          Unos 17 minutos en total. Puedes hacerlos en el orden que quieras y dejarlo a medias: se
          guarda solo.
        </p>

        <div className="mt-8">
          <Progress value={progress} label="Configuración inicial" showValue tone="ok" />
        </div>

        <ol className="mt-8 flex flex-col gap-3">
          {STEPS.map((s, i) => {
            const isDone = done.includes(i);
            return (
              <motion.li
                key={s.title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (reduce ? 0 : 2.5) + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={cn(
                    "bg-surface flex flex-col gap-4 rounded-lg p-5 transition-all duration-300 sm:flex-row sm:items-center md:p-6",
                    isDone
                      ? "shadow-[inset_0_0_0_1px_rgb(11_138_95_/_0.25)]"
                      : "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-[15px] transition-colors",
                      isDone ? "bg-signal-ok-soft text-signal-ok" : "bg-ink-950 text-white",
                    )}
                  >
                    {isDone ? (
                      <CheckDraw size={22} strokeWidth={2.6} />
                    ) : (
                      <Glyph name={s.glyph} className="size-5" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3
                        className={cn(
                          "font-display text-[17px] font-extrabold tracking-[-0.028em]",
                          isDone ? "text-ink-400 line-through" : "text-ink-900",
                        )}
                      >
                        Paso {i + 1}: {s.title}
                      </h3>
                      <span className="text-ink-400 data text-[11.5px]">{s.minutes} min</span>
                    </div>
                    <p className="text-ink-500 mt-1.5 text-[14px] leading-relaxed">{s.body}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {!isDone && (
                      <Button
                        href={s.href}
                        size="md"
                        variant={i === done.length ? "primary" : "secondary"}
                        onClick={() => setDone((d) => [...d, i])}
                      >
                        {s.action}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className="bg-surface mt-6 flex items-center gap-4 rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
          <Avatar name="Especialista asignado" size={44} />
          <div className="min-w-0 flex-1">
            <p className="text-ink-900 text-[14.5px] font-semibold">Tu especialista ya está asignado</p>
            <p className="text-ink-500 text-[13px]">
              Puedes escribirle ahora mismo, aunque no hayas subido nada todavía.
            </p>
          </div>
          <Button href="/app/mensajes" variant="secondary" size="sm" className="shrink-0">
            Saludar
          </Button>
        </div>

        <LegalNote variant="framed" className="mt-6">
          Todo lo que subas queda en almacenamiento privado, accesible solo para ti y para las
          personas del equipo asignadas a tu expediente. Cada acceso queda registrado y puedes
          consultarlo cuando quieras.
        </LegalNote>
      </main>
    </div>
  );
}
