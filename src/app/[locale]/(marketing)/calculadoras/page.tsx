import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/content/calculators";
import { Glyph } from "@/components/brand/Glyph";
import { SectionHeading, LegalNote, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Calculadoras de extranjería",
  description:
    "Herramientas gratuitas: calculadora Schengen 90/180, tiempo para la nacionalidad española, medios económicos exigibles y ventana de renovación. Sin registro.",
  alternates: { canonical: "/calculadoras" },
};

export default function CalculadorasPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Herramientas"
            title="Cuentas que conviene hacer bien."
            lede="Gratis, sin registro y sin que tus datos salgan de tu navegador. Son las cuentas que más veces hemos visto mal hechas."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <ul className="grid gap-3 md:grid-cols-2">
            {CALCULATORS.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={i * 0.05}>
                  <Link
                    href={`/calculadoras/${c.slug}`}
                    className="group bg-surface flex h-full flex-col rounded-lg p-6 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_20px_46px_-16px_rgb(10_13_22_/_0.2)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-11 items-center justify-center rounded-[13px] transition-colors duration-400 group-hover:text-white">
                        <Glyph name={c.glyph} className="size-5" />
                      </span>
                      {c.ready ? <Badge tone="ok">Disponible</Badge> : <Badge tone="neutral">Pronto</Badge>}
                    </div>
                    <h2 className="text-ink-900 font-display mt-4 text-[18px] font-extrabold tracking-[-0.028em]">
                      {c.name}
                    </h2>
                    <p className="text-brand-700 mt-1.5 text-[13.5px] font-medium">{c.tagline}</p>
                    <p className="text-ink-500 mt-2.5 flex-1 text-[13.5px] leading-relaxed">{c.description}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <LegalNote variant="framed" className="mt-8">
            Estas herramientas hacen aritmética sobre las fechas y los importes que introduces. No
            son asesoramiento jurídico y no valoran si cumples los requisitos de ninguna vía. Todos
            los cálculos se ejecutan en tu navegador: no enviamos tus fechas a ningún servidor.
          </LegalNote>
        </div>
      </section>
    </>
  );
}
