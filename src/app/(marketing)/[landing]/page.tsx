import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  allLandings,
  resolveLanding,
  siblingLandings,
  crossLandings,
  landingH1,
  landingTitle,
  landingDescription,
} from "@/content/seo-landings";
import { OFFICIAL_SOURCES, reviewedBy, site } from "@/content/site";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { TramiteFaq } from "@/components/marketing/TramiteFaq";
import { eur, formatDateES } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLandings().map((l) => ({ landing: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ landing: string }>;
}): Promise<Metadata> {
  const { landing } = await params;
  const l = resolveLanding(landing);
  if (!l) return {};
  return {
    title: landingTitle(l),
    description: landingDescription(l),
    alternates: { canonical: `/${l.slug}` },
    openGraph: {
      title: `${landingTitle(l)} · ${site.name}`,
      description: landingDescription(l),
      url: `/${l.slug}`,
      type: "article",
      modifiedTime: l.tramite.updatedAt,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const l = resolveLanding(landing);
  if (!l) notFound();

  const t = l.tramite;
  const siblings = siblingLandings(l);
  const cross = crossLandings(l);

  /** The genuinely local / country-specific facts. This is why the page exists. */
  const localNotes = l.city?.notes ?? l.nationality?.notes ?? [];

  return (
    <>
      <section className="relative pt-32 pb-12 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="text-ink-400 flex flex-wrap items-center gap-1.5 text-[13px]">
              <li>
                <Link href="/tramites" className="hover:text-ink-900 transition-colors">
                  Trámites
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/tramites/${t.slug}`} className="hover:text-ink-900 transition-colors">
                  {t.shortName ?? t.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-700 font-medium">
                {l.kind === "city" ? l.city!.name : l.nationality!.country}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
            <div>
              <span className="bg-brand-50 text-brand-700 mb-5 inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-[12px] font-semibold">
                <Glyph name={l.kind === "city" ? "door" : "globe"} className="size-4" />
                {l.kind === "city" ? l.city!.community : l.nationality!.country}
              </span>

              <h1 className="text-display-md md:text-display-lg text-ink-900 max-w-3xl">
                {landingH1(l)}
              </h1>
              <p className="text-ink-500 mt-5 max-w-2xl text-[17px] leading-[1.6]">
                {l.kind === "city"
                  ? `Los requisitos del ${(t.shortName ?? t.name).toLowerCase()} son estatales, pero la práctica cambia según el territorio. Esto es lo que es distinto ${l.city!.inCity}.`
                  : `Los requisitos son los mismos para todo el mundo, pero la documentación de ${l.nationality!.country} tiene su propia ruta de obtención y legalización. Esto es lo que cambia en tu caso.`}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/diagnostico" size="lg" arrow magnetic>
                  Comprobar mi situación
                </Button>
                <Button href={`/tramites/${t.slug}`} size="lg" variant="secondary">
                  Ver el trámite completo
                </Button>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Card padding="none" className="overflow-hidden">
                <dl className="divide-ink-100 divide-y">
                  <div className="p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Honorarios
                    </dt>
                    <dd className="text-ink-900 font-display mt-1.5 text-[24px] leading-none font-extrabold tracking-[-0.035em] tabular-nums">
                      {t.feeFromCents !== null ? (
                        <>
                          <span className="text-ink-400 text-[14px] font-medium">desde </span>
                          {eur(t.feeFromCents)}
                        </>
                      ) : (
                        <span className="text-[19px]">A medida</span>
                      )}
                    </dd>
                  </div>
                  {l.kind === "city" && (
                    <div className="p-5">
                      <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                        Informe de arraigo
                      </dt>
                      <dd className="text-ink-700 mt-1.5 text-[13px] leading-relaxed">
                        {l.city!.arraigoReportBody}
                      </dd>
                    </div>
                  )}
                  {l.kind === "nationality" && (
                    <>
                      <div className="p-5">
                        <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                          Legalización
                        </dt>
                        <dd className="text-ink-700 mt-1.5 text-[13px] leading-relaxed">
                          {l.nationality!.apostille
                            ? "Apostilla de La Haya"
                            : "Legalización por vía consular"}
                        </dd>
                      </div>
                      <div className="p-5">
                        <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                          Antecedentes penales
                        </dt>
                        <dd className="text-ink-700 mt-1.5 text-[13px] leading-relaxed">
                          {l.nationality!.criminalRecordBody}
                        </dd>
                      </div>
                      <div className="p-5">
                        <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                          Nacionalidad por residencia
                        </dt>
                        <dd className="text-ink-700 mt-1.5 text-[13px] leading-relaxed">
                          Plazo de {l.nationality!.nationalityYears === 2 ? "2 años" : "10 años"}{" "}
                          de residencia legal
                          {l.nationality!.nationalityYears === 2 ? " (plazo reducido)" : ""}
                        </dd>
                      </div>
                    </>
                  )}
                  <div className="bg-canvas-deep p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Última revisión
                    </dt>
                    <dd className="text-ink-700 mt-1.5 text-[13px] font-medium">
                      {formatDateES(t.updatedAt)}
                    </dd>
                    {t.pendingLegalReview && (
                      <dd className="mt-3">
                        <Badge tone="warn">Pendiente de firma jurídica</Badge>
                      </dd>
                    )}
                  </div>
                </dl>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <div className="container-page pb-24">
        <div className="max-w-3xl">
          {/* ---- The differentiated content ---- */}
          <section className="scroll-mt-28 py-10">
            <h2 className="text-ink-900 font-display mb-6 text-[24px] font-extrabold tracking-[-0.032em] md:text-[28px]">
              {l.kind === "city"
                ? `Qué cambia ${l.city!.inCity}`
                : `Qué cambia si tu documentación es de ${l.nationality!.country}`}
            </h2>
            <ul className="flex flex-col gap-4">
              {localNotes.map((n, i) => (
                <li key={n} className="flex gap-3.5">
                  <span className="bg-brand-50 text-brand-600 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
                    {i + 1}
                  </span>
                  <p className="text-ink-600 text-[15.5px] leading-[1.65]">{n}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- Shared requirements, contextualised ---- */}
          <section className="border-ink-100 scroll-mt-28 border-t py-10">
            <h2 className="text-ink-900 font-display mb-6 text-[24px] font-extrabold tracking-[-0.032em] md:text-[28px]">
              Requisitos
            </h2>
            <ol className="border-ink-100 flex flex-col border-t">
              {t.requirements.map((r, i) => (
                <li key={r} className="border-ink-100 flex gap-4 border-b py-4">
                  <span className="data text-ink-300 shrink-0 pt-0.5 text-[12px] font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-700 text-[15px] leading-relaxed">{r}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ---- Documents ---- */}
          <section className="border-ink-100 scroll-mt-28 border-t py-10">
            <h2 className="text-ink-900 font-display mb-6 text-[24px] font-extrabold tracking-[-0.032em] md:text-[28px]">
              Documentación
            </h2>
            <ul className="bg-surface divide-ink-100 divide-y overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
              {t.documents.map((d) => (
                <li key={d.name} className="flex items-start gap-3 p-4">
                  <span className="bg-ink-50 text-ink-400 flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                    <Glyph name="doc" className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-900 block text-[14px] font-medium">{d.name}</span>
                    {d.note && (
                      <span className="text-ink-500 mt-0.5 block text-[12.5px] leading-snug">
                        {d.note}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {l.kind === "nationality" && (
              <div className="bg-brand-50/60 ring-brand-600/12 mt-5 rounded-lg p-5 ring-1 ring-inset">
                <h3 className="text-brand-800 mb-2 flex items-center gap-2 text-[13.5px] font-bold">
                  <Glyph name="stamp" className="size-4" />
                  Documentos emitidos en {l.nationality!.country}
                </h3>
                <p className="text-ink-600 text-[13.5px] leading-relaxed">
                  Todo documento emitido fuera de España debe llegar legalizado
                  {l.nationality!.apostille ? " mediante apostilla de La Haya" : " por vía consular"}{" "}
                  y, si no está en español, traducido por traductor jurado. Es el paso que más
                  retrasa los expedientes, así que conviene iniciarlo antes que ningún otro.
                </p>
              </div>
            )}
          </section>

          {/* ---- FAQ ---- */}
          <section className="border-ink-100 scroll-mt-28 border-t py-10">
            <h2 className="text-ink-900 font-display mb-6 text-[24px] font-extrabold tracking-[-0.032em] md:text-[28px]">
              Preguntas frecuentes
            </h2>
            <TramiteFaq faqs={t.faqs} />
          </section>

          {/* ---- Internal linking ---- */}
          {(siblings.length > 0 || cross.length > 0) && (
            <section className="border-ink-100 border-t py-10">
              {siblings.length > 0 && (
                <div className="mb-7">
                  <h2 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
                    {t.shortName ?? t.name} en otros casos
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {siblings.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                        >
                          {landingTitle(s)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cross.length > 0 && (
                <div>
                  <h2 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
                    Otros trámites{" "}
                    {l.kind === "city" ? l.city!.inCity : `para ${l.nationality!.demonym}`}
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {cross.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                        >
                          {landingTitle(s)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* ---- Sources ---- */}
          <section className="border-ink-100 border-t py-10">
            <h2 className="text-ink-900 font-display mb-6 text-[20px] font-extrabold tracking-[-0.03em]">
              Fuentes oficiales
            </h2>
            <ul className="flex flex-col gap-2.5">
              {t.sources.map((s) => (
                <li key={s}>
                  <a
                    href={OFFICIAL_SOURCES[s].url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-ink-600 hover:text-brand-700 bg-surface ring-ink-900/[.06] flex items-center justify-between gap-3 rounded-sm px-4 py-3 text-[14px] ring-1 ring-inset transition-colors"
                  >
                    {OFFICIAL_SOURCES[s].label}
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                      <path
                        d="M6 3h7v7M13 3 4 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <LegalNote variant="framed" className="mt-6">
              Página informativa, no asesoramiento jurídico. Los requisitos son los previstos por la
              normativa estatal; la información territorial y de legalización recogida aquí describe
              la práctica administrativa habitual y puede cambiar. Revisado por {reviewedBy()}.
              Última actualización: {formatDateES(t.updatedAt)}.
              {t.pendingLegalReview &&
                " Contenido pendiente de la validación y firma del profesional responsable."}
            </LegalNote>
          </section>

          {/* ---- CTA ---- */}
          <Reveal>
            <div className="bg-ink-950 mt-6 rounded-xl p-6 md:p-8">
              <h2 className="font-display text-[21px] leading-tight font-extrabold tracking-[-0.03em] text-white">
                ¿Encaja esto con tu caso?
              </h2>
              <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-white/55">
                El diagnóstico te lo dice en tres minutos, gratis y sin registro. Y si no encaja, te
                proponemos las alternativas.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button href="/diagnostico" variant="inverse" size="lg" arrow>
                  Comprobar mi situación
                </Button>
                <Button
                  href="/citas"
                  variant="ghost"
                  size="lg"
                  className="border border-white/15 bg-white/[.06] text-white hover:bg-white/[.12]"
                >
                  Hablar con un especialista
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {["Sin registro", "Sin coste", "3 minutos"].map((x) => (
                  <li key={x} className="flex items-center gap-2 text-[13px] text-white/50">
                    <span className="text-signal-ok">
                      <CheckDraw size={12} strokeWidth={3} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
