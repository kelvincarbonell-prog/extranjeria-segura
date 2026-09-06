import { cn } from "@/lib/utils";

/**
 * The product's own icon set for immigration concepts.
 *
 * Every glyph is drawn on the same 24×24 grid with a 1.5 stroke, rounded
 * caps and a shared 3-unit corner radius, so a row of them reads as one
 * family. No emoji, no gavels, no scales-of-justice, no flags.
 */

export type GlyphKey =
  | "door" | "briefcase" | "roots" | "cap" | "family" | "passport"
  | "signal" | "cycle" | "scales" | "alert" | "shelter" | "stars"
  | "help" | "shield" | "clock" | "doc" | "stamp" | "path" | "globe" | "lock";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const PATHS: Record<GlyphKey, React.ReactNode> = {
  /* Puerta / umbral — the brand's own primitive */
  door: (
    <>
      <path d="M5 21V10.5a7 7 0 0 1 14 0V21" {...S} />
      <path d="M3.5 21h17" {...S} />
      <path d="M15 14.6v1.2" {...S} />
    </>
  ),
  /* Trabajo */
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="3" {...S} />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" {...S} />
      <path d="M3 12.5h18" {...S} />
    </>
  ),
  /* Arraigo — raíces */
  roots: (
    <>
      <path d="M12 3v10" {...S} />
      <path d="M12 13c0 3-2.5 4-4 5s-2 2-2 3" {...S} />
      <path d="M12 13c0 3 2.5 4 4 5s2 2 2 3" {...S} />
      <path d="M12 16.5c0 2.5 0 3.5 0 4.5" {...S} />
    </>
  ),
  /* Estudios */
  cap: (
    <>
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" {...S} />
      <path d="M6.5 11.6V16c0 1.5 2.6 3 5.5 3s5.5-1.5 5.5-3v-4.4" {...S} />
      <path d="M21.5 9.5v5" {...S} />
    </>
  ),
  /* Familia */
  family: (
    <>
      <circle cx="8" cy="7.5" r="3" {...S} />
      <circle cx="16.5" cy="9" r="2.3" {...S} />
      <path d="M3 20v-1.2A4.3 4.3 0 0 1 7.3 14.5h1.4A4.3 4.3 0 0 1 13 18.8V20" {...S} />
      <path d="M14.5 20v-1a3.6 3.6 0 0 1 3.6-3.6h.4A3.5 3.5 0 0 1 22 18.9V20" {...S} />
    </>
  ),
  /* Nacionalidad — pasaporte */
  passport: (
    <>
      <rect x="4.5" y="2.8" width="15" height="18.4" rx="3" {...S} />
      <circle cx="12" cy="9.8" r="3" {...S} />
      <path d="M9 15.8h6" {...S} />
      <path d="M10.5 18.3h3" {...S} />
    </>
  ),
  /* Nómadas — señal remota */
  signal: (
    <>
      <circle cx="12" cy="12" r="2.1" {...S} />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4" {...S} />
      <path d="M16.2 16.2a6 6 0 0 0 0-8.4" {...S} />
      <path d="M4.8 4.8a10.2 10.2 0 0 0 0 14.4" {...S} />
      <path d="M19.2 19.2a10.2 10.2 0 0 0 0-14.4" {...S} />
    </>
  ),
  /* Renovación */
  cycle: (
    <>
      <path d="M20.2 12a8.2 8.2 0 0 1-13.9 5.9" {...S} />
      <path d="M3.8 12A8.2 8.2 0 0 1 17.7 6.1" {...S} />
      <path d="M17.4 2.6v3.7h-3.7" {...S} />
      <path d="M6.6 21.4v-3.7h3.7" {...S} />
    </>
  ),
  /* Recursos — balance abstracta, sin martillo */
  scales: (
    <>
      <path d="M12 4v16" {...S} />
      <path d="M6 8h12" {...S} />
      <path d="M3 15.2a3 3 0 0 0 6 0L6 8.6 3 15.2Z" {...S} />
      <path d="M15 15.2a3 3 0 0 0 6 0L18 8.6l-3 6.6Z" {...S} />
      <path d="M9 20.5h6" {...S} />
    </>
  ),
  /* Requerimiento — aviso con plazo */
  alert: (
    <>
      <path d="M12 3.6 21 19.4a1.6 1.6 0 0 1-1.4 2.4H4.4A1.6 1.6 0 0 1 3 19.4L12 3.6Z" {...S} />
      <path d="M12 10v4.2" {...S} />
      <circle cx="12" cy="17.6" r="0.9" fill="currentColor" />
    </>
  ),
  /* Protección internacional — refugio */
  shelter: (
    <>
      <path d="M3.5 11 12 4l8.5 7" {...S} />
      <path d="M5.6 12.6V19a1.6 1.6 0 0 0 1.6 1.6h9.6A1.6 1.6 0 0 0 18.4 19v-6.4" {...S} />
      <path d="M9.6 20.6v-4a2.4 2.4 0 0 1 4.8 0v4" {...S} />
    </>
  ),
  /* Comunitarios — círculo de estrellas abstracto */
  stars: (
    <>
      <circle cx="12" cy="12" r="8.4" {...S} />
      <circle cx="12" cy="4.6" r="0.95" fill="currentColor" />
      <circle cx="17.2" cy="6.8" r="0.95" fill="currentColor" />
      <circle cx="19.4" cy="12" r="0.95" fill="currentColor" />
      <circle cx="17.2" cy="17.2" r="0.95" fill="currentColor" />
      <circle cx="12" cy="19.4" r="0.95" fill="currentColor" />
      <circle cx="6.8" cy="17.2" r="0.95" fill="currentColor" />
      <circle cx="4.6" cy="12" r="0.95" fill="currentColor" />
      <circle cx="6.8" cy="6.8" r="0.95" fill="currentColor" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.4" {...S} />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.8 5.6v6c0 4.4 3 8.2 7.2 9.6 4.2-1.4 7.2-5.2 7.2-9.6v-6L12 2.8Z" {...S} />
      <path d="M8.9 12.1 11 14.3l4.2-4.4" {...S} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <path d="M12 7.2V12l3.2 1.9" {...S} />
    </>
  ),
  doc: (
    <>
      <path d="M13.6 2.8H7a2.2 2.2 0 0 0-2.2 2.2v14a2.2 2.2 0 0 0 2.2 2.2h10a2.2 2.2 0 0 0 2.2-2.2V8.4l-5.6-5.6Z" {...S} />
      <path d="M13.4 3v4.2a1.4 1.4 0 0 0 1.4 1.4h4.2" {...S} />
      <path d="M8.6 13.4h6.8M8.6 16.8h4.4" {...S} />
    </>
  ),
  stamp: (
    <>
      <path d="M8 3.4h8a1.6 1.6 0 0 1 1.6 1.6v5.4a1.6 1.6 0 0 1-1.6 1.6H8a1.6 1.6 0 0 1-1.6-1.6V5A1.6 1.6 0 0 1 8 3.4Z" {...S} />
      <path d="M4.4 15.6h15.2v3.2a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.6-1.6v-3.2Z" {...S} />
      <path d="M9.8 7.6 11.4 9l3-3" {...S} />
    </>
  ),
  path: (
    <>
      <path d="M4 20c0-5 3-6.5 5-8s3-3 3-6" {...S} />
      <path d="M12 4h8" {...S} />
      <path d="M17 20h3" {...S} />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" {...S} />
      <path d="M3.4 12h17.2" {...S} />
      <path d="M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6s-1.2 6.2-3.4 8.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4Z" {...S} />
    </>
  ),
  lock: (
    <>
      <rect x="4.6" y="10.4" width="14.8" height="10.2" rx="3" {...S} />
      <path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8" {...S} />
      <circle cx="12" cy="15.4" r="1.1" fill="currentColor" />
    </>
  ),
};

export function Glyph({
  name,
  className,
  size,
}: {
  name: GlyphKey | string;
  className?: string;
  size?: number;
}) {
  const node = PATHS[name as GlyphKey] ?? PATHS.doc;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("block", !size && "size-6", className)}
      aria-hidden="true"
    >
      {node}
    </svg>
  );
}
