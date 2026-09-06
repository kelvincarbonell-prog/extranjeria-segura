import { Link } from "@/components/ui/Link";
import { ENTRY_PLANS, MANAGED_PLANS } from "@/content/pricing";
import { Glyph } from "@/components/brand/Glyph";
import { SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { Button } from "@/components/ui/Button";
import { eur, cn } from "@/lib/utils";

export function PricingPreview() {
  return (
    <section id="precios" className="bg-canvas-deep relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Precios"
            title="Sabes lo que pagas desde el principio."
            lede="Presupuesto cerrado por escrito antes de empezar, y la lista de lo que no está incluido junto al precio. Sin costes que aparecen a mitad del expediente."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        {/* ---- Entry points ---- */}
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {ENTRY_PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-xl p-6",
                  p.featured
                    ? "bg-ink-950 text-white shadow-[0_30px_70px_-26px_rgb(10_13_22_/_0.45)]"
                    : "bg-surface shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
                )}
              >
                {p.featured && (
                  <span className="absolute -top-2.5 left-6 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold tracking-[0.08em] text-ink-950 uppercase shadow-sm">
                    Recomendado
                  </span>
                )}
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-[12px]",
                    p.featured ? "bg-white/10 text-white" : "bg-ink-50 text-ink-600",
                  )}
                >
                  <Glyph name={p.glyph} className="size-[19px]" />
                </span>

                <h3
                  className={cn(
                    "font-display mt-4 text-[18px] font-extrabold tracking-[-0.028em]",
                    p.featured ? "text-white" : "text-ink-900",
                  )}
                >
                  {p.name}
                </h3>
                <p
                  className={cn(
                    "mt-1.5 text-[13.5px] leading-relaxed",
                    p.featured ? "text-white/55" : "text-ink-500",
                  )}
                >
                  {p.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-[34px] leading-none font-extrabold tracking-[-0.04em] tabular-nums",
                      p.featured ? "text-white" : "text-ink-900",
                    )}
                  >
                    {p.priceCents === 0 ? "Gratis" : eur(p.priceCents!)}
                  </span>
                </div>
                {p.priceNote && (
                  <p
                    className={cn(
                      "mt-1.5 text-[12.5px]",
                      p.featured ? "text-white/45" : "text-ink-400",
                    )}
                  >
                    {p.priceNote}
                  </p>
                )}

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {p.includes.slice(0, 4).map((inc, ii) => (
                    <li
                      key={inc}
                      className={cn(
                        "flex gap-2.5 text-[13.5px] leading-snug",
                        p.featured ? "text-white/70" : "text-ink-600",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-px flex size-4 shrink-0 items-center justify-center rounded-full",
                          p.featured
                            ? "bg-white/12 text-white"
                            : "bg-signal-ok-soft text-signal-ok",
                        )}
                      >
                        <CheckDraw size={9} strokeWidth={3.4} delay={0.2 + ii * 0.08} />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>

                <Button
                  href={p.cta.href}
                  size="md"
                  block
                  className="mt-6"
                  variant={p.featured ? "inverse" : "secondary"}
                  arrow
                >
                  {p.cta.label}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---- Managed services ---- */}
        <Reveal delay={0.08}>
          <div className="mt-16">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-ink-900 font-display text-[22px] font-extrabold tracking-[-0.03em]">
                Gestión integral del expediente
              </h3>
              <p className="text-ink-400 text-[13px]">
                Honorarios profesionales. Las tasas administrativas van aparte y siempre se indican.
              </p>
            </div>

            <div className="bg-surface overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
              <ul className="divide-ink-100 divide-y">
                {MANAGED_PLANS.map((p) => (
                  <li key={p.id}>
                    <Link
                      href="/precios"
                      className="group hover:bg-canvas-deep flex flex-col gap-3 px-5 py-5 transition-colors sm:flex-row sm:items-center sm:gap-5 sm:px-6"
                    >
                      <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-colors group-hover:text-white">
                        <Glyph name={p.glyph} className="size-[19px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-ink-900 block text-[15px] font-semibold tracking-[-0.015em]">
                          {p.name}
                        </span>
                        <span className="text-ink-500 mt-0.5 block text-[13px] leading-snug">
                          {p.tagline}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-baseline gap-1.5">
                        {p.priceNote && (
                          <span className="text-ink-400 text-[12.5px]">{p.priceNote}</span>
                        )}
                        <span className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em] tabular-nums">
                          {p.priceCents !== null ? eur(p.priceCents) : "A medida"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Badge tone="neutral">Pago fraccionado sin coste</Badge>
              <Badge tone="neutral">La consulta se descuenta de la gestión</Badge>
              <Badge tone="neutral">Factura de cada pago</Badge>
              <Button href="/precios" variant="ghost" size="sm" arrow>
                Ver el desglose completo
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
