import Link from "next/link";
import { cn } from "@/lib/utils";
import { Isotipo } from "./Isotipo";

/**
 * Wordmark lockups.
 *
 * The wordmark is set in Manrope with a deliberate weight break —
 * "Extranjería" at 800 / "Segura" at 500 — so the name reads as a single
 * object with an internal rhythm instead of two shouted words. Tracking is
 * pulled to -0.035em; at small sizes the isotipo carries recognition.
 */

type Tone = "ink" | "inverse";

export function Wordmark({ className, tone = "ink" }: { className?: string; tone?: Tone }) {
  return (
    <span
      className={cn(
        "font-display leading-none tracking-[-0.035em] whitespace-nowrap",
        tone === "inverse" ? "text-white" : "text-ink-900",
        className,
      )}
    >
      <span className="font-extrabold">Extranjería</span>
      <span className={cn("font-medium", tone === "inverse" ? "text-white/70" : "text-ink-500")}>
        {" "}
        Segura
      </span>
    </span>
  );
}

/** Horizontal lockup. The default across header, footer, emails, documents. */
export function Logo({
  className,
  tone = "ink",
  size = "md",
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  href?: string | null;
  showWordmark?: boolean;
}) {
  const dims = {
    sm: { mark: "size-7", text: "text-[15px]", gap: "gap-2" },
    md: { mark: "size-9", text: "text-[17px]", gap: "gap-2.5" },
    lg: { mark: "size-12", text: "text-[22px]", gap: "gap-3" },
  }[size];

  const inner = (
    <span className={cn("inline-flex items-center", dims.gap, className)}>
      <Isotipo
        className={dims.mark}
        variant={tone === "inverse" ? "inverse" : "gradient"}
        title="Extranjería Segura"
        id={`logo-${size}-${tone}`}
      />
      {showWordmark && <Wordmark className={dims.text} tone={tone} />}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link
      href={href}
      className="inline-flex rounded-md outline-offset-4 transition-opacity hover:opacity-80"
      aria-label="Extranjería Segura — inicio"
    >
      {inner}
    </Link>
  );
}

/** Stacked / compact lockup for narrow chrome and splash screens. */
export function LogoStacked({ className, tone = "ink" }: { className?: string; tone?: Tone }) {
  return (
    <span className={cn("inline-flex flex-col items-center gap-3", className)}>
      <Isotipo className="size-14" variant={tone === "inverse" ? "inverse" : "gradient"} id="logo-stack" />
      <Wordmark className="text-[19px]" tone={tone} />
    </span>
  );
}
