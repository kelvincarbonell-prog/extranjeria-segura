import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, CATEGORY_MAP, type CategoryId } from "@/content/taxonomy";
import { TRAMITES } from "@/content/tramites";
import { TramiteCard } from "@/components/marketing/TramiteExplorer";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = CATEGORY_MAP[id as CategoryId];
  if (!c) return {};
  return {
    title: `Trámites de ${c.label}`,
    description: `${c.blurb} Requisitos, documentación, plazos y honorarios de cada trámite. Diagnóstico gratuito y gestión 100% online.`,
    alternates: { canonical: `/tramites/categoria/${c.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = CATEGORY_MAP[id as CategoryId];
  if (!category) notFound();

  const items = TRAMITES.filter(
    (t) => t.category === category.id || t.alsoIn?.includes(category.id),
  );

  return (
    <>
      <section className="relative pt-32 pb-12 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="text-ink-400 flex items-center gap-1.5 text-[13px]">
              <li>
                <Link href="/tramites" className="hover:text-ink-900 transition-colors">
                  Trámites
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-700 font-medium">{category.label}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-5">
            <span className="bg-ink-950 flex size-14 shrink-0 items-center justify-center rounded-[18px] text-white">
              <Glyph name={category.glyph} className="size-7" />
            </span>
            <div>
              <SectionHeading
                as="h1"
                title={category.label}
                lede={category.blurb}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <li key={t.slug}>
                <Reveal delay={i * 0.04}>
                  <TramiteCard tramite={t} categories={CATEGORIES} />
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <div className="bg-canvas-deep ring-ink-900/[.06] mt-10 flex flex-col items-start gap-5 rounded-xl p-6 ring-1 ring-inset md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <h2 className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em]">
                  ¿No sabes cuál de estos es el tuyo?
                </h2>
                <p className="text-ink-500 mt-1.5 max-w-md text-[14.5px] leading-relaxed">
                  Es lo normal. Cuéntanos tu situación y te decimos qué vías pueden encajar.
                </p>
              </div>
              <Button href="/diagnostico" size="lg" arrow>
                Hacer el diagnóstico
              </Button>
            </div>
          </Reveal>

          <nav aria-label="Otras categorías" className="mt-12">
            <h2 className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.11em] uppercase">
              Otras categorías
            </h2>
            <ul className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.id !== category.id).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tramites/categoria/${c.id}`}
                    className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                  >
                    <Glyph name={c.glyph} className="size-4" />
                    {c.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
