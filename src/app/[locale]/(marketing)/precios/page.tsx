import type { Metadata } from "next";
import { ENTRY_PLANS, MANAGED_PLANS, THIRD_PARTY_COSTS, PAYMENT_TERMS } from "@/content/pricing";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { SectionHeading, Card, Badge, LegalNote, Divider } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { eur, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Precios de Extranjería Segura: diagnóstico gratuito, consulta desde 39 €, revisión documental 79 € y gestión integral desde 299 €. Con lo que no está incluido, junto al precio.",
  alternates: { canonical: "/precios" },
};

export default function PreciosPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Precios"
            title="Sabes lo que pagas desde el principio."
            lede="Presupuesto cerrado por escrito antes de empezar. Y al lado de cada precio, la lista de lo que no incluye, para que no haya sorpresas a mitad del expediente."
            align="center"
            className="mx-auto"
          />
        </div>
      </section>

      {/* ---------------- Entry points ---------------- */}
      <section id="consulta" className="pb-16">
        <div className="container-page">
          <div className="grid gap-3 md:grid-cols-3">
            {ENTRY_PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <div
                  id={p.id}
                  className={cn(
                    "relative flex h-full scroll-mt-28 flex-col rounded-xl p-6 md:p-7",
                    p.featured
                      ? "bg-ink-950 text-white shadow-[0_34px_80px_-30px_rgb(10_13_22_/_0.5)]"
                      : "bg-surface shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
                  )}
                >
                  {p.featured && (
                    <span className="text-ink-950 absolute -top-2.5 left-6 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold tracking-[0.08em] uppercase shadow-sm">
                      El más elegido
                    </span>
                  )}

                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-[13px]",
                      p.featured ? "bg-white/10 text-white" : "bg-ink-50 text-ink-600",
                    )}
                  >
                    <Glyph name={p.glyph} className="size-5" />
                  </span>

                  <h2
                    className={cn(
                      "font-display mt-4 text-[19px] font-extrabold tracking-[-0.03em]",
                      p.featured ? "text-white" : "text-ink-900",
                    )}
                  >
                    {p.name}
                  </h2>
                  <p
                    className={cn(
                      "mt-1.5 text-[13.5px] leading-relaxed",
                      p.featured ? "text-white/55" : "text-ink-500",
                    )}
                  >
                    {p.tagline}
                  </p>

                  <p
                    className={cn(
                      "font-display mt-6 text-[38px] leading-none font-extrabold tracking-[-0.045em] tabular-nums",
                      p.featured ? "text-white" : "text-ink-900",
                    )}
                  >
                    {p.priceCents === 0 ? "Gratis" : eur(p.priceCents!)}
                  </p>
                  {p.priceNote && (
                    <p className={cn("mt-1.5 text-[12.5px]", p.featured ? "text-white/45" : "text-ink-400")}>
                      {p.priceNote}
                    </p>
                  )}

                  <Divider className={cn("my-5", p.featured && "opacity-20")} />

                  <p
                    className={cn(
                      "mb-3 text-[11px] font-bold tracking-[0.11em] uppercase",
                      p.featured ? "text-white/40" : "text-ink-400",
                    )}
                  >
                    Incluye
                  </p>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {p.includes.map((inc, ii) => (
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
                            p.featured ? "bg-white/12 text-white" : "bg-signal-ok-soft text-signal-ok",
                          )}
                        >
                          <CheckDraw size={9} strokeWidth={3.4} delay={0.2 + ii * 0.07} />
                        </span>
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <p
                    className={cn(
                      "mt-5 mb-2.5 text-[11px] font-bold tracking-[0.11em] uppercase",
                      p.featured ? "text-white/40" : "text-ink-400",
                    )}
                  >
                    No incluye
                  </p>
                  <ul className="flex flex-col gap-2">
                    {p.excludes.map((ex) => (
                      <li
                        key={ex}
                        className={cn(
                          "flex gap-2.5 text-[12.5px] leading-snug",
                          p.featured ? "text-white/40" : "text-ink-400",
                        )}
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-current opacity-60" />
                        {ex}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={p.cta.href}
                    size="lg"
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
        </div>
      </section>

      {/* ---------------- Managed ---------------- */}
      <section id="gestion" className="bg-canvas-deep scroll-mt-28 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Gestión integral"
            title="Nos ocupamos del expediente completo."
            lede="Desde el diagnóstico hasta la resolución, con tu especialista revisando cada documento y respondiendo a la Administración."
          />

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {MANAGED_PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <Card padding="lg" className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="bg-ink-50 text-ink-600 flex size-11 items-center justify-center rounded-[13px]">
                      <Glyph name={p.glyph} className="size-5" />
                    </span>
                    {p.featured && <Badge tone="brand">Más solicitado</Badge>}
                  </div>

                  <h3 className="text-ink-900 font-display mt-4 text-[18px] font-extrabold tracking-[-0.028em]">
                    {p.name}
                  </h3>
                  <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">{p.tagline}</p>

                  <p className="text-ink-900 font-display mt-5 text-[28px] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                    {p.priceNote && (
                      <span className="text-ink-400 text-[14px] font-medium">{p.priceNote} </span>
                    )}
                    {p.priceCents !== null ? eur(p.priceCents) : "A medida"}
                  </p>

                  <Divider className="my-5" />

                  <ul className="flex flex-1 flex-col gap-2">
                    {p.includes.map((inc) => (
                      <li key={inc} className="text-ink-600 flex gap-2.5 text-[13px] leading-snug">
                        <span className="bg-signal-ok mt-1.5 size-1 shrink-0 rounded-full" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <p className="text-ink-400 mt-5 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
                    No incluye
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {p.excludes.map((ex) => (
                      <li key={ex} className="text-ink-400 flex gap-2.5 text-[12.5px] leading-snug">
                        <span className="bg-ink-300 mt-1.5 size-1 shrink-0 rounded-full" />
                        {ex}
                      </li>
                    ))}
                  </ul>

                  <Button href={p.cta.href} size="md" block className="mt-6" variant="secondary" arrow>
                    {p.cta.label}
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Third-party costs ---------------- */}
      <section id="revision" className="scroll-mt-28 py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Costes de terceros"
                title="Lo que no cobramos nosotros, y por qué existe."
                lede="Estos importes no van a nuestra cuenta. Los pagas directamente a quien corresponde y no les aplicamos ningún margen."
              />
            </Reveal>

            <Reveal delay={0.06}>
              <ul className="border-ink-100 border-t">
                {THIRD_PARTY_COSTS.map((c) => (
                  <li key={c.label} className="border-ink-100 border-b py-5">
                    <h3 className="text-ink-900 text-[15px] font-semibold">{c.label}</h3>
                    <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">{c.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Terms ---------------- */}
      <section className="pb-24">
        <div className="container-page">
          <Reveal>
            <div className="bg-ink-950 relative isolate overflow-hidden rounded-2xl p-7 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(700px 340px at 12% 0%, rgba(65,89,250,.34), transparent 62%)",
                }}
              />
              <div className="relative">
                <h2 className="font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] text-white md:text-[32px]">
                  Nuestras condiciones, en cinco frases.
                </h2>
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {PAYMENT_TERMS.map((t, i) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-white/65">
                      <span className="bg-signal-ok/15 text-signal-ok mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                        <CheckDraw size={11} strokeWidth={3.2} delay={0.2 + i * 0.1} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button href="/diagnostico" size="lg" variant="inverse" arrow magnetic>
                    Empezar por el diagnóstico gratuito
                  </Button>
                  <Button
                    href="/legal/condiciones"
                    size="lg"
                    variant="ghost"
                    className="border border-white/15 bg-white/[.06] text-white hover:bg-white/[.12]"
                  >
                    Leer las condiciones completas
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <LegalNote variant="framed" className="mx-auto mt-8 max-w-3xl">
            Los importes indicados son honorarios profesionales, IVA no incluido salvo indicación
            expresa, y tienen la consideración de precio de partida: el presupuesto definitivo se
            emite por escrito tras el diagnóstico, en función del alcance real de tu expediente.
          </LegalNote>
        </div>
      </section>
    </>
  );
}
