import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Badge / Pill
 * ------------------------------------------------------------------ */
type Tone = "neutral" | "brand" | "ok" | "warn" | "risk" | "ink";

const TONES: Record<Tone, string> = {
  neutral: "text-ink-600 bg-ink-50 ring-ink-900/[.06]",
  brand: "text-brand-700 bg-brand-50 ring-brand-600/15",
  ok: "text-signal-ok bg-signal-ok-soft ring-signal-ok/15",
  warn: "text-signal-warn bg-signal-warn-soft ring-signal-warn/15",
  risk: "text-signal-risk bg-signal-risk-soft ring-signal-risk/15",
  ink: "text-white bg-ink-900 ring-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-inset",
        "text-[12px] leading-none font-medium tracking-[-0.006em] whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 shrink-0 rounded-full bg-current opacity-70" />}
      {icon && <span className="[&>svg]:size-3.5 shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Eyebrow + section heading — the typographic spine of every section.
 * ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow mb-5">
          <span aria-hidden className="bg-brand-600 h-px w-5 rounded-full" />
          {eyebrow}
        </span>
      )}
      <Tag
        id={id}
        className={cn(
          "text-display-md md:text-display-lg text-ink-900",
          align === "center" ? "max-w-3xl" : "max-w-2xl",
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p
          className={cn(
            "text-ink-500 mt-5 text-[17px] leading-[1.6] md:text-lg",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Card — one card geometry across marketing, app and admin. Cards never
 * differ by section; they differ by content density only.
 * ------------------------------------------------------------------ */
export function Card({
  children,
  className,
  interactive = false,
  padding = "md",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: React.ElementType;
}) {
  const pad = { none: "", sm: "p-4", md: "p-5 md:p-6", lg: "p-6 md:p-8" }[padding];
  return (
    <Tag
      className={cn(
        "bg-surface relative rounded-lg",
        "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07),0_1px_2px_rgb(10_13_22_/_0.04)]",
        interactive &&
          "group transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] " +
            "hover:-translate-y-[3px] hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.16),0_18px_44px_-14px_rgb(10_13_22_/_0.16)]",
        pad,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Progress — accessible, animated, tabular label.
 * ------------------------------------------------------------------ */
export function Progress({
  value,
  label,
  className,
  tone = "brand",
  size = "md",
  showValue = false,
}: {
  value: number;
  label?: string;
  className?: string;
  tone?: "brand" | "ok" | "ink";
  size?: "xs" | "sm" | "md";
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const h = { xs: "h-1", sm: "h-1.5", md: "h-2" }[size];
  const bg = { brand: "bg-brand-600", ok: "bg-signal-ok", ink: "bg-ink-900" }[tone];

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && <span className="text-ink-500 text-[13px] font-medium">{label}</span>}
          {showValue && <span className="text-ink-900 data text-[13px] font-semibold">{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso"}
        className={cn("bg-ink-100 w-full overflow-hidden rounded-full", h)}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]", bg)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Avatar — initials fallback, no stock photography anywhere in the system.
 * ------------------------------------------------------------------ */
export function Avatar({
  name,
  src,
  size = 36,
  className,
  ring = false,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  const label = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  // Deterministic hue from the name so an advisor keeps the same identity colour.
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "font-display font-bold text-white select-none",
        ring && "ring-2 ring-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: src
          ? undefined
          : `linear-gradient(140deg, hsl(${hue} 62% 52%), hsl(${(hue + 34) % 360} 58% 36%))`,
      }}
      aria-hidden
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
      ) : (
        label
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * DemoTag — every fabricated screen in the product carries this.
 * Non-negotiable: nothing simulated is ever shown without it.
 * ------------------------------------------------------------------ */
export function DemoTag({ className, label = "Demo" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-[3px]",
        "bg-ink-900/[.055] text-ink-500 ring-ink-900/[.07] ring-1 ring-inset",
        "text-[10px] leading-none font-bold tracking-[0.09em] uppercase",
        className,
      )}
    >
      <span aria-hidden className="bg-ink-400 size-1 rounded-full" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * LegalNote — the boundary between orientation and professional advice.
 * Used after every automated output in the product.
 * ------------------------------------------------------------------ */
export function LegalNote({
  children,
  className,
  variant = "quiet",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "quiet" | "framed";
}) {
  if (variant === "framed") {
    return (
      <div
        className={cn(
          "bg-ink-50/70 ring-ink-900/[.06] flex gap-3 rounded-sm p-4 ring-1 ring-inset",
          className,
        )}
      >
        <InfoGlyph className="text-ink-400 mt-px size-4 shrink-0" />
        <p className="text-ink-500 text-[13px] leading-[1.55]">{children}</p>
      </div>
    );
  }
  return (
    <p className={cn("text-ink-400 flex gap-2 text-[12.5px] leading-[1.55]", className)}>
      <InfoGlyph className="mt-[3px] size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function InfoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.9" r="0.85" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Divider with optional centred label
 * ------------------------------------------------------------------ */
export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn("border-ink-100 border-t", className)} />;
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="bg-ink-100 h-px flex-1" />
      <span className="text-ink-400 text-[11px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </span>
      <span className="bg-ink-100 h-px flex-1" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * KeyValue — the dense data row used in case files and admin.
 * ------------------------------------------------------------------ */
export function KeyValue({
  k,
  v,
  mono = false,
  className,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2.5", className)}>
      <dt className="text-ink-400 shrink-0 text-[13px]">{k}</dt>
      <dd className={cn("text-ink-900 text-right text-[13.5px] font-medium", mono && "data")}>{v}</dd>
    </div>
  );
}
