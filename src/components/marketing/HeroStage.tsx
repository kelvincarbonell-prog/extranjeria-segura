"use client";

import * as React from "react";
import { motion, useReducedMotion, useSpring, useTransform, useScroll } from "motion/react";
import { usePointer, CheckDraw } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Isotipo } from "@/components/brand/Isotipo";
import { Avatar, DemoTag } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * HERO STAGE — the product's signature 3D object.
 *
 * Implemented as a real CSS 3D scene rather than WebGL. Every element is a
 * live DOM node on its own Z plane inside one `perspective`, so:
 *   · it is selectable, translatable and screen-readable;
 *   · it ships zero KB of 3D library and never blocks the main thread;
 *   · the reduced-motion and coarse-pointer fallbacks are the same markup
 *     with the transforms neutralised — not a different, poorer component.
 *
 * The composition is the case file itself: the timeline, the document count
 * and the next step. That is the promise of the product, shown rather than
 * described.
 */

const TIMELINE = [
  { label: "Viabilidad analizada", state: "done" },
  { label: "Documentación recibida", state: "done" },
  { label: "Documentos revisados", state: "done" },
  { label: "Presentación", state: "active" },
  { label: "Resolución", state: "todo" },
] as const;

export function HeroStage() {
  const reduce = useReducedMotion();
  const { mx, my } = usePointer();
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const scrollLift = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 6]);

  // Pointer → rotation. Deliberately shallow: this is an instrument panel,
  // not a toy. 7° maximum on either axis.
  const rotY = useSpring(useTransform(mx, [-1, 1], [7, -7]), { stiffness: 60, damping: 20 });
  const rotX = useSpring(useTransform(my, [-1, 1], [-5.5, 5.5]), { stiffness: 60, damping: 20 });
  const rotateX = useTransform([rotX, scrollTilt], ([a, b]: number[]) => a + b);

  // Hooks are unconditional; only the applied style is gated on reduced motion.
  const style = reduce ? undefined : { rotateX, rotateY: rotY, y: scrollLift };

  return (
    <div ref={wrapRef} className="stage-3d relative w-full select-none" aria-hidden="false">
      {/* Ambient light behind the object */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -top-20 bottom-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(520px 420px at 62% 34%, rgba(65,89,250,.20), transparent 68%), radial-gradient(420px 320px at 22% 78%, rgba(11,138,95,.12), transparent 66%)",
        }}
      />

      <motion.div style={style} className="layer-3d relative mx-auto w-full max-w-[520px]">
        {/* ============== Depth plane −80: back card ============== */}
        <div
          aria-hidden
          className="absolute inset-x-8 -top-5 h-40 rounded-xl bg-white/60 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.05)]"
          style={{ transform: "translateZ(-80px)" }}
        />

        {/* ============== Depth plane 0: the case file ============== */}
        <div
          className="bg-surface relative overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08),0_40px_90px_-30px_rgb(10_13_22_/_0.38),0_10px_28px_-12px_rgb(10_13_22_/_0.16)]"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Window chrome */}
          <div className="border-ink-100 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Isotipo className="size-[22px]" id="hero-chrome" />
              <span className="text-ink-900 font-display text-[13px] font-bold tracking-[-0.02em]">
                Extranjería Segura
              </span>
            </div>
            <DemoTag />
          </div>

          {/* Case header */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="data text-ink-400 text-[11px] font-medium">Expediente #ES-2048</p>
                <h3 className="text-ink-900 font-display mt-1 text-[19px] leading-tight font-extrabold tracking-[-0.03em]">
                  Arraigo sociolaboral
                </h3>
              </div>
              <span className="bg-signal-ok-soft text-signal-ok ring-signal-ok/15 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 ring-inset">
                <span className="relative flex size-1.5">
                  <span className="bg-signal-ok absolute inline-flex size-full animate-[pulse-ring_2.6s_cubic-bezier(0.25,1,0.5,1)_infinite] rounded-full" />
                  <span className="bg-signal-ok relative inline-flex size-1.5 rounded-full" />
                </span>
                Expediente preparado
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 pb-5">
            <ol className="relative flex flex-col gap-0">
              {TIMELINE.map((step, i) => (
                <li key={step.label} className="relative flex items-start gap-3 pb-3.5 last:pb-0">
                  {i < TIMELINE.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-[18px] left-[8.5px] w-px",
                        step.state === "done" ? "bg-signal-ok/40" : "bg-ink-100",
                      )}
                      style={{ height: "calc(100% - 8px)" }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full",
                      step.state === "done" && "bg-signal-ok-soft text-signal-ok",
                      step.state === "active" && "bg-brand-600 text-white",
                      step.state === "todo" && "bg-ink-100 text-ink-300",
                    )}
                  >
                    {step.state === "done" ? (
                      <CheckDraw size={11} strokeWidth={3} delay={0.5 + i * 0.14} />
                    ) : step.state === "active" ? (
                      <motion.span
                        className="size-1.5 rounded-full bg-white"
                        animate={reduce ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : (
                      <span className="bg-ink-300 size-1.5 rounded-full" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] leading-[18px]",
                      step.state === "todo" ? "text-ink-300" : "text-ink-700 font-medium",
                      step.state === "active" && "text-ink-900 font-semibold",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Footer strip */}
          <div className="bg-canvas-deep border-ink-100 grid grid-cols-2 gap-px border-t">
            <div className="bg-surface px-5 py-4">
              <p className="text-ink-400 text-[11px] font-medium">Documentación</p>
              <p className="text-ink-900 data mt-1 flex items-baseline gap-1.5 text-[15px] font-semibold">
                7/7
                <span className="text-signal-ok text-[11.5px] font-medium">correctos</span>
              </p>
            </div>
            <div className="bg-surface px-5 py-4">
              <p className="text-ink-400 text-[11px] font-medium">Próximo paso</p>
              <p className="text-ink-900 mt-1 text-[13px] font-semibold">Presentación telemática</p>
            </div>
          </div>

          {/* Advisor row */}
          <div className="border-ink-100 flex items-center gap-3 border-t px-5 py-3.5">
            <Avatar name="Especialista asignado" size={30} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-900 truncate text-[12.5px] font-semibold">
                Tu especialista asignado
              </p>
              <p className="text-ink-400 truncate text-[11.5px]">Responde en horario laboral</p>
            </div>
            <span className="bg-brand-50 text-brand-600 flex size-8 shrink-0 items-center justify-center rounded-[10px]">
              <Glyph name="doc" className="size-4" />
            </span>
          </div>
        </div>

        {/* ============== Depth plane +90: validated notification ============== */}
        <Floating
          className="absolute -top-7 right-0 sm:-right-8 lg:-right-12"
          z={90}
          delay={0.9}
          drift={-8}
          reduce={reduce}
        >
          <NotificationChip
            tone="ok"
            icon={<CheckDraw size={13} strokeWidth={3} delay={1.25} />}
            title="Tu NIE ha sido validado"
          />
        </Floating>

        {/* ============== Depth plane +130: reviewed notification ============== */}
        <Floating
          className="absolute -bottom-8 left-0 sm:-left-8 lg:-left-12"
          z={130}
          delay={1.35}
          drift={8}
          reduce={reduce}
        >
          <NotificationChip
            tone="brand"
            icon={<Glyph name="doc" className="size-[13px]" />}
            title="Documento revisado"
            subtitle="por tu especialista"
          />
        </Floating>

        {/* ============== Depth plane +60: passport tile ============== */}
        <Floating
          className="absolute top-28 hidden xl:block xl:-left-32"
          z={60}
          delay={1.1}
          drift={10}
          reduce={reduce}
        >
          <SquareTile glyph="passport" label="Pasaporte" state="ok" />
        </Floating>

        {/* ============== Depth plane +70: calendar tile ============== */}
        <Floating
          className="absolute bottom-28 hidden xl:block xl:-right-24"
          z={70}
          delay={1.55}
          drift={-10}
          reduce={reduce}
        >
          <SquareTile glyph="clock" label="Cita: 12 oct" state="pending" />
        </Floating>

        {/* ============== Depth plane +40: digital seal ============== */}
        <Floating
          className="absolute -top-11 left-8 hidden lg:block"
          z={40}
          delay={1.7}
          drift={6}
          reduce={reduce}
        >
          <div className="bg-ink-950 flex size-12 items-center justify-center rounded-[14px] text-white shadow-[0_16px_36px_-12px_rgba(10,13,22,.55)]">
            <Glyph name="stamp" className="size-5" />
          </div>
        </Floating>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Floating({
  children,
  className,
  z,
  delay,
  drift,
  reduce,
}: {
  children: React.ReactNode;
  className?: string;
  z: number;
  delay: number;
  drift: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className={className}
      style={{ transform: `translateZ(${z}px)` }}
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, drift, 0] }}
        transition={{ duration: 7 + Math.abs(drift) * 0.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function NotificationChip({
  tone,
  icon,
  title,
  subtitle,
}: {
  tone: "ok" | "brand";
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-surface/92 flex items-center gap-2.5 rounded-[14px] py-2.5 pr-4 pl-2.5 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_18px_40px_-14px_rgb(10_13_22_/_0.3)]">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-[9px]",
          tone === "ok" ? "bg-signal-ok-soft text-signal-ok" : "bg-brand-50 text-brand-600",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="text-ink-900 block text-[12.5px] leading-tight font-semibold whitespace-nowrap">
          {title}
        </span>
        {subtitle && (
          <span className="text-ink-400 block text-[11px] leading-tight whitespace-nowrap">
            {subtitle}
          </span>
        )}
      </span>
    </div>
  );
}

function SquareTile({
  glyph,
  label,
  state,
}: {
  glyph: string;
  label: string;
  state: "ok" | "pending";
}) {
  return (
    <div className="bg-surface/92 flex w-[124px] flex-col gap-2 rounded-[16px] p-3 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_18px_40px_-14px_rgb(10_13_22_/_0.28)]">
      <div className="flex items-center justify-between">
        <span className="bg-ink-50 text-ink-600 flex size-8 items-center justify-center rounded-[10px]">
          <Glyph name={glyph} className="size-[17px]" />
        </span>
        <span
          className={cn(
            "size-2 rounded-full",
            state === "ok" ? "bg-signal-ok" : "bg-signal-warn",
          )}
        />
      </div>
      <span className="text-ink-700 text-[11.5px] leading-tight font-semibold">{label}</span>
    </div>
  );
}
