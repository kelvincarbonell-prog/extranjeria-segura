import { TRAMITES } from "@/content/tramites";
import { Glyph } from "@/components/brand/Glyph";

/**
 * The strip under the hero.
 *
 * Deliberately NOT a wall of client logos or a "+5.000 clientes" counter:
 * we have no verified figures, so we show what we actually do — the breadth
 * of the catalogue — which is verifiable by clicking any of them.
 */
export function TrustStrip() {
  const names = TRAMITES.map((t) => t.shortName ?? t.name);
  const loop = [...names, ...names];

  return (
    <section
      aria-label="Trámites que gestionamos"
      className="border-ink-100 relative overflow-hidden border-y py-5"
    >
      <div className="container-page mb-4">
        <p className="text-ink-400 text-center text-[11px] font-bold tracking-[0.14em] uppercase">
          Gestionamos el expediente completo en
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="from-canvas pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent md:w-40"
        />
        <div
          aria-hidden
          className="from-canvas pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent md:w-40"
        />
        <div className="flex w-max animate-[marquee_46s_linear_infinite] items-center gap-8 motion-reduce:animate-none">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-ink-400 flex shrink-0 items-center gap-2.5 text-[14px] font-medium whitespace-nowrap"
            >
              <Glyph name="path" className="text-ink-200 size-3.5" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
