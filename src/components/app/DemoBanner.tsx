import Link from "next/link";
import { Glyph } from "@/components/brand/Glyph";

/**
 * Standing notice across the whole client area.
 *
 * The area renders fabricated data so the interface can be evaluated before
 * Supabase auth is connected. That fact is stated on every screen, not hidden
 * in a footnote — a case file that looks real but is not is exactly the kind
 * of thing that erodes trust in a product like this.
 */
export function DemoBanner() {
  return (
    <div className="bg-ink-950 mb-5 flex flex-col gap-3 rounded-lg px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2.5 text-[13px] leading-snug text-white/70">
        <Glyph name="alert" className="mt-px size-4 shrink-0 text-white/45" />
        <span>
          <strong className="font-semibold text-white">Modo demostración.</strong> Los datos de este
          expediente son ficticios y no corresponden a ninguna persona real. La autenticación con
          Supabase está implementada pero no activada en este entorno.
        </span>
      </p>
      <Link
        href="/crear-cuenta"
        className="text-ink-950 inline-flex shrink-0 items-center justify-center rounded-xs bg-white px-4 py-2 text-[13px] font-semibold"
      >
        Crear mi cuenta real
      </Link>
    </div>
  );
}
