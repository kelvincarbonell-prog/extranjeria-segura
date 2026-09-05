"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
  animate,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Reveal — the single scroll-entrance primitive used product-wide.
 * One vocabulary, one easing. Respects prefers-reduced-motion natively.
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  blur = true,
  once = true,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  className?: string;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -8% 0px" });
  const M = motion[Tag] as typeof motion.div;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <M
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "none" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ------------------------------------------------------------------ *
 * Stagger — reveals a list with a shared rhythm.
 * ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
  step = 0.07,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  delay?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <Reveal delay={delay + i * step}>{child}</Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * TextReveal — headline words rise into place. Used once per viewport,
 * never on body copy: motion on paragraphs hurts readability.
 * ------------------------------------------------------------------ */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  wordClassName?: (word: string, i: number) => string | undefined;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={cn("inline-block", wordClassName?.(word, i))}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: delay + i * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — pointer-attracted chrome. Pointer-fine only; disabled for
 * touch, reduced motion and keyboard users (focus never moves the target).
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.28,
  radius = 90,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.4 });

  React.useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, strength, radius, x, y]);

  return (
    <motion.span ref={ref} style={{ x, y }} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ *
 * Tilt — depth on hover for cards and the hero object.
 * ------------------------------------------------------------------ */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.012,
  glare = false,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 20 });
  const sy = useSpring(py, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("stage-3d", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <motion.div style={{ rotateX, rotateY }} className="layer-3d relative">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,.5), transparent 55%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * CountUp — animated numerals. Always tabular so layout never jitters.
 * ------------------------------------------------------------------ */
export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [val, setVal] = React.useState(reduce ? to : from);

  React.useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration, reduce]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {val.toLocaleString("es-ES", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * ParallaxY — element drifts against scroll. Kept under 60px of travel
 * so it never fights the reading position.
 * ------------------------------------------------------------------ */
export function ParallaxY({
  children,
  distance = 40,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      {reduce ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * usePointer — normalised, spring-damped pointer position for the hero.
 * ------------------------------------------------------------------ */
export function usePointer(): { mx: MotionValue<number>; my: MotionValue<number> } {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 26, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 90, damping: 26, mass: 0.6 });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return { mx: smx, my: smy };
}

/* ------------------------------------------------------------------ *
 * CheckDraw — the validation stroke. Draws once when it enters view.
 * The single most-repeated micro-moment in the product.
 * ------------------------------------------------------------------ */
export function CheckDraw({
  className,
  size = 16,
  strokeWidth = 2.4,
  delay = 0,
  play = true,
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M4.5 12.6 L9.6 17.5 L19.5 6.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: play ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
