"use client";

import * as React from "react";

/**
 * Minimal 3D globe, drawn on a 2D canvas with our own spherical projection.
 *
 * Why not three.js: this needs one sphere, a graticule and six great-circle
 * arcs. That is ~150 lines of trigonometry versus ~600 KB of WebGL runtime on
 * a marketing page that must stay above 90 Lighthouse. It also degrades to a
 * still frame under prefers-reduced-motion with no separate code path.
 *
 * The arcs are a CONCEPTUAL illustration of where people move from, not a
 * representation of clients. No counts, no dots-per-customer.
 */

const SPAIN = { lat: 40.4, lon: -3.7 };

const ORIGINS = [
  { label: "Latinoamérica", lat: 4.7, lon: -74.1 },
  { label: "Brasil", lat: -15.8, lon: -47.9 },
  { label: "Estados Unidos", lat: 38.9, lon: -77.0 },
  { label: "Reino Unido", lat: 51.5, lon: -0.13 },
  { label: "Europa del Este", lat: 55.75, lon: 37.6 },
  { label: "Asia", lat: 39.9, lon: 116.4 },
  { label: "Norte de África", lat: 33.97, lon: -6.85 },
];

type Vec3 = [number, number, number];

function toVec(lat: number, lon: number): Vec3 {
  const p = (lat * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  return [Math.cos(p) * Math.cos(l), Math.sin(p), Math.cos(p) * Math.sin(l)];
}

function rotateY([x, y, z]: Vec3, a: number): Vec3 {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

/** Spherical linear interpolation — gives true great-circle arcs. */
function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

export function Globe({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let spin = -0.5;
    let running = true;

    const spainVec = toVec(SPAIN.lat, SPAIN.lon);
    const arcs = ORIGINS.map((o, i) => ({
      from: toVec(o.lat, o.lon),
      phase: i / ORIGINS.length,
    }));

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.38;
      const tilt = -0.36;

      if (!reduce) spin += 0.0016;

      const project = (v: Vec3) => {
        const r1 = rotateY(v, spin);
        const r2 = rotateX(r1, tilt);
        return { x: cx + r2[0] * R, y: cy - r2[1] * R, z: r2[2] };
      };

      /* ---- Sphere body ---- */
      const grad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R * 1.05);
      grad.addColorStop(0, "rgba(36,56,232,.055)");
      grad.addColorStop(1, "rgba(10,13,22,.02)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(10,13,22,.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      /* ---- Graticule ---- */
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = project(toVec(lat, lon));
          if (p.z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(10,13,22,.075)";
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(toVec(lat, lon));
          if (p.z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(10,13,22,.055)";
        ctx.stroke();
      }

      /* ---- Arcs: origin → Spain ---- */
      const t = reduce ? 0.55 : (time / 4200) % 1;
      arcs.forEach((arc) => {
        const head = reduce ? 1 : (t + arc.phase) % 1;
        const STEPS = 60;

        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= STEPS; s++) {
          const k = s / STEPS;
          if (k > head) break;
          const base = slerp(arc.from, spainVec, k);
          // Lift the arc off the surface — a flight path, not a scribble.
          const lift = 1 + Math.sin(k * Math.PI) * 0.24;
          const p = project([base[0] * lift, base[1] * lift, base[2] * lift]);
          if (p.z < -0.12) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(36,56,232,.42)";
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Travelling head
        if (!reduce && head > 0.02 && head < 0.995) {
          const base = slerp(arc.from, spainVec, head);
          const lift = 1 + Math.sin(head * Math.PI) * 0.24;
          const p = project([base[0] * lift, base[1] * lift, base[2] * lift]);
          if (p.z > -0.12) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(36,56,232,.95)";
            ctx.fill();
          }
        }

        // Origin marker
        const op = project(arc.from);
        if (op.z > 0) {
          ctx.beginPath();
          ctx.arc(op.x, op.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10,13,22,.30)";
          ctx.fill();
        }
      });

      /* ---- Destination: Spain ---- */
      const sp = project(spainVec);
      if (sp.z > 0) {
        const pulse = reduce ? 0.5 : (Math.sin(time / 700) + 1) / 2;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 5 + pulse * 7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(36,56,232,${0.16 - pulse * 0.11})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#2438E8";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    // Stop painting when off-screen — the globe never costs a frame it is not
    // being looked at for.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Ilustración conceptual: rutas desde distintas regiones del mundo hacia España"
    />
  );
}
