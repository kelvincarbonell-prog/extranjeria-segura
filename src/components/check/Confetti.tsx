"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

/**
 * Confetti — brand-restrained.
 *
 * Not the rainbow burst. 32 thin shards in the brand ramp plus the positive
 * signal green, falling once, then the canvas removes itself from the DOM.
 * Nothing loops, nothing flashes, and it never renders under reduced motion:
 * a celebratory strobe is an accessibility hazard, and this is a screen people
 * reach while anxious about their immigration status.
 */

const COLOURS = ["#4159FA", "#2438E8", "#9CAEFF", "#0B8A5F", "#141824"];

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  colour: string;
}

export function Confetti() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [alive, setAlive] = React.useState(true);

  React.useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const shards: Shard[] = Array.from({ length: 32 }, (_, i) => ({
      // Biased to the margins so the shards frame the headline rather than
      // sitting on top of it while someone is trying to read their result.
      x: W * (i % 2 === 0 ? 0.04 + Math.random() * 0.28 : 0.68 + Math.random() * 0.28),
      y: -20 - Math.random() * H * 0.4,
      vx: (Math.random() - 0.5) * 1.6,
      vy: 1.6 + Math.random() * 2.4,
      w: 3 + Math.random() * 3,
      h: 7 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.14,
      colour: COLOURS[i % COLOURS.length],
    }));

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);

      let visible = 0;
      for (const s of shards) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.028;
        s.rot += s.vr;

        if (s.y < H + 40) visible++;

        // Fade out over the final second so it does not just stop.
        const alpha = elapsed > 2600 ? Math.max(0, 1 - (elapsed - 2600) / 900) : 1;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.colour;
        ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
      }

      if (visible > 0 && elapsed < 3600) {
        raf = requestAnimationFrame(tick);
      } else {
        setAlive(false);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Reduced motion never gets a canvas at all: a celebratory strobe is an
  // accessibility hazard, and this screen is reached while people are anxious.
  if (reduce || !alive) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
