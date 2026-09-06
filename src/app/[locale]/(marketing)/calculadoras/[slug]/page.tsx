import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { jsonLd, herramienta, migas } from "@/lib/jsonld";
import type { Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { CALCULATORS, CALCULATOR_MAP } from "@/content/calculators";
import { getTramite } from "@/content/tramites";
import { CalculatorRenderer } from "@/components/calculators/Calculators";
import { LegalNote } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const c = CALCULATOR_MAP[slug];
  if (!c) return {};
  return pageMetadata({
    locale,
    path: `/calculadoras/${c.slug}`,
    title: c.name,
    description: c.description.slice(0, 158),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const c = CALCULATOR_MAP[slug];
  if (!c) notFound();

  const related = c.relatedTramite ? getTramite(c.relatedTramite) : undefined;

  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="text-ink-400 flex items-center gap-1.5 text-[13px]">
              <li>
                <Link href="/calculadoras" className="hover:text-ink-900 tap inline-block transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-700 font-medium">{c.name}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <span className="bg-ink-950 flex size-12 shrink-0 items-center justify-center rounded-[15px] text-white">
              <Glyph name={c.glyph} className="size-6" />
            </span>
            <div>
              <h1 className="text-display-md text-ink-900">{c.name}</h1>
              <p className="text-ink-500 mt-3 max-w-2xl text-[16.5px] leading-relaxed">
                {c.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <CalculatorRenderer slug={c.slug} />

          <LegalNote variant="framed" className="mt-8">
            El resultado es un cálculo orientativo sobre los datos que has introducido. No es
            asesoramiento jurídico ni valora si cumples los requisitos. Los cálculos se ejecutan en
            tu navegador y no se envían a ningún servidor.
          </LegalNote>

          {related && (
            <div className="bg-canvas-deep ring-ink-900/[.06] mt-6 flex flex-col items-start gap-5 rounded-xl p-6 ring-1 ring-inset md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.03em]">
                  {related.shortName ?? related.name}
                </h2>
                <p className="text-ink-500 mt-1.5 max-w-md text-[14px] leading-relaxed">
                  {related.tagline}
                </p>
              </div>
              <Button href={`/tramites/${related.slug}`} size="md" arrow>
                Ver requisitos y documentación
              </Button>
            </div>
          )}

          <nav aria-label="Otras calculadoras" className="mt-12">
            <h2 className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.11em] uppercase">
              Otras herramientas
            </h2>
            <ul className="flex flex-wrap gap-2">
              {CALCULATORS.filter((x) => x.slug !== c.slug).map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/calculadoras/${x.slug}`}
                    className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                  >
                    <Glyph name={x.glyph} className="size-4" />
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* La herramienta es gratuita y no pide registro: aquí el price: 0 del
          marcado dice literalmente la verdad, que es raro en este campo. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            herramienta({
              nombre: c.name,
              descripcion: c.description,
              ruta: `/calculadoras/${c.slug}`,
              locale,
            }),
            migas(
              [
                { nombre: "Calculadoras", ruta: "/calculadoras" },
                { nombre: c.name, ruta: `/calculadoras/${c.slug}` },
              ],
              locale,
            ),
          ),
        }}
      />
    </>
  );
}
