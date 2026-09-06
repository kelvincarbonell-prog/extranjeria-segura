import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LEGAL_DOCUMENTS, LEGAL_MAP } from "@/content/legal";
import { site } from "@/content/site";
import { Glyph } from "@/components/brand/Glyph";
import { Badge } from "@/components/ui/primitives";
import { formatDateES } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_MAP[slug];
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${doc.slug}` },
    // Unreviewed templates must not be indexed as if they were legal texts.
    robots: doc.reviewed ? { index: true, follow: true } : { index: false, follow: true },
  };
}

/** Highlights [[PLACEHOLDER]] tokens so no unfilled field slips into production. */
function renderWithPlaceholders(text: string) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((part, i) =>
    part.startsWith("[[") ? (
      <mark
        key={i}
        className="bg-signal-warn-soft text-signal-warn rounded-[4px] px-1 py-0.5 font-mono text-[0.86em] font-medium"
      >
        {part.slice(2, -2)}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = LEGAL_MAP[slug];
  if (!doc) notFound();

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <div className="container-tight">
        <nav aria-label="Migas de pan" className="mb-7">
          <ol className="text-ink-400 flex items-center gap-1.5 text-[13px]">
            <li>
              <Link href="/" className="hover:text-ink-900 tap inline-block transition-colors">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink-700 font-medium">{doc.title}</li>
          </ol>
        </nav>

        <h1 className="text-display-md md:text-display-lg text-ink-900">{doc.title}</h1>
        <p className="text-ink-500 mt-4 text-[17px] leading-relaxed">{doc.description}</p>

        <p className="text-ink-400 mt-5 text-[13px]">
          Última actualización: {formatDateES(doc.updatedAt)}
        </p>

        {/* ---- The banner that must never be removed until reviewed ---- */}
        {!doc.reviewed && (
          <div className="bg-signal-warn-soft ring-signal-warn/20 mt-8 rounded-lg p-5 ring-1 ring-inset md:p-6">
            <div className="flex gap-3.5">
              <span className="bg-signal-warn/12 text-signal-warn flex size-9 shrink-0 items-center justify-center rounded-[11px]">
                <Glyph name="alert" className="size-[18px]" />
              </span>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-signal-warn text-[15px] font-bold">
                    Plantilla pendiente de revisión jurídica
                  </h2>
                  <Badge tone="warn">No es un texto legal vigente</Badge>
                </div>
                <p className="text-ink-600 text-[13.5px] leading-relaxed">
                  Este documento es un borrador estructurado que identifica qué debe cubrir cada
                  apartado y marca en amarillo los datos que {site.name} tiene que aportar. No
                  constituye el texto legal definitivo y no debe publicarse como tal hasta que el
                  profesional responsable lo revise, lo complete y lo firme. Preferimos mostrar un
                  borrador identificado como tal antes que un texto legal inventado que parezca
                  real.
                </p>

                <h3 className="text-ink-800 mt-4 mb-2 text-[12.5px] font-bold tracking-[0.06em] uppercase">
                  Qué debe resolver la revisión
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {doc.reviewNotes.map((n) => (
                    <li key={n} className="text-ink-600 flex gap-2.5 text-[13px] leading-snug">
                      <span className="bg-signal-warn mt-1.5 size-1 shrink-0 rounded-full" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ---- Body ---- */}
        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-ink-900 font-display text-[21px] font-extrabold tracking-[-0.03em] md:text-[24px]">
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-3.5">
                {section.body.map((p, i) => (
                  <p key={i} className="text-ink-600 text-[15.5px] leading-[1.7]">
                    {renderWithPlaceholders(p)}
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-ink-600 flex gap-3 text-[15px] leading-relaxed">
                      <span className="bg-ink-300 mt-2.5 size-1 shrink-0 rounded-full" />
                      <span>{renderWithPlaceholders(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* ---- Other documents ---- */}
        <nav aria-label="Otros documentos legales" className="border-ink-100 mt-14 border-t pt-8">
          <h2 className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.11em] uppercase">
            Otros documentos
          </h2>
          <ul className="flex flex-wrap gap-2">
            {LEGAL_DOCUMENTS.filter((d) => d.slug !== doc.slug).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
