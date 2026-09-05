import { cn } from "@/lib/utils";

/**
 * EXTRANJERÍA SEGURA — isotipo "El Umbral".
 *
 * Geometry, on a 40×40 grid:
 *   · An arch (puerta / escudo) spanning x6–34, y4–36 — protection and threshold.
 *   · A path knocked out of the solid: it steps up like a check (✓ validación)
 *     and its long arm continues at a true 45° until it BREAKS THROUGH the
 *     top-right of the arch — the camino that crosses the threshold, forward
 *     movement, the case that gets resolved and leaves.
 *
 * The mark is a single closed silhouette with one subtractive channel, so it
 * survives at 16px, in one colour, engraved, embroidered or as an app icon.
 */

type Variant = "gradient" | "solid" | "inverse" | "mono";

/**
 * Arch: 24 units wide by 28 tall (a door is taller than it is wide — at 24×32
 * the silhouette read as a generic squircle, which is the one thing the mark
 * must not do). Semicircular head, lightly rounded feet.
 */
const ARCH =
  "M8 32.5 V20 A12 12 0 0 1 32 20 V32.5 A3.5 3.5 0 0 1 28.5 36 H11.5 A3.5 3.5 0 0 1 8 32.5 Z";

/** The path: a check whose long arm continues at 45° and exits the arch. */
const PATH_CUT = "M13.6 22.4 L18.4 27.2 L34.5 11.1";

export function Isotipo({
  className,
  variant = "gradient",
  title,
  id = "iso",
}: {
  className?: string;
  variant?: Variant;
  title?: string;
  id?: string;
}) {
  const maskId = `${id}-mask`;
  const gradId = `${id}-grad`;
  const shineId = `${id}-shine`;

  const fill =
    variant === "gradient"
      ? `url(#${gradId})`
      : variant === "inverse"
        ? "#FFFFFF"
        : variant === "mono"
          ? "currentColor"
          : "var(--color-brand-600)";

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("block", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4159FA" />
          <stop offset="0.55" stopColor="#2438E8" />
          <stop offset="1" stopColor="#18259B" />
        </linearGradient>
        <linearGradient id={shineId} x1="10" y1="4" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* The subtractive channel: white keeps, black removes. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
          <rect width="40" height="40" fill="#000" />
          <path d={ARCH} fill="#fff" />
          <path
            d={PATH_CUT}
            stroke="#000"
            strokeWidth="5.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <rect width="40" height="40" fill={fill} />
        {variant === "gradient" && <rect width="40" height="40" fill={`url(#${shineId})`} />}
      </g>
    </svg>
  );
}

/** Isotipo inside its own container — for app icons, avatars, favicons. */
export function IsotipoTile({ className, radius = 22 }: { className?: string; radius?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("block", className)} aria-hidden="true">
      <defs>
        <linearGradient id="tile-g" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101528" />
          <stop offset="1" stopColor="#05070D" />
        </linearGradient>
        <mask id="tile-m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#000" />
          <g transform="translate(20 20) scale(1.5)">
            <path d={ARCH} fill="#fff" />
            <path d={PATH_CUT} stroke="#000" strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </mask>
      </defs>
      <rect width="100" height="100" rx={radius} fill="url(#tile-g)" />
      <g mask="url(#tile-m)">
        <rect width="100" height="100" fill="#4159FA" />
        <rect width="100" height="100" fill="url(#tile-shine)" />
      </g>
      <defs>
        <linearGradient id="tile-shine" x1="20" y1="10" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8FA0FF" />
          <stop offset="1" stopColor="#2438E8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
