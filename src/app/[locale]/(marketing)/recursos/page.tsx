import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Link } from "@/components/ui/Link";
import { CALCULATORS } from "@/content/calculators";
import { TRAMITES } from "@/content/tramites";
import { CATEGORIES } from "@/content/taxonomy";
import { site, reviewedBy, OFFICIAL_SOURCES } from "@/content/site";
import { Glyph } from "@/components/brand/Glyph";
import { SectionHeading, Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Plazo } from "@/components/contenido/Plazo";
import { FECHAS } from "@/content/regularizacion-2026";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/primitives";
import { formatDateES } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/recursos",
    title: "Centro de conocimiento",
    description: "Guías, calculadoras y actualizaciones normativas de extranjería en España. Contenido revisado, con fuentes oficiales y fecha de última revisión en cada página.",
  });
}

/**
 * Knowledge centre.
 *
 * The article database ships empty, so instead of a grid of placeholder cards
 * this page routes to what genuinely exists today — the trámite pages, which
 * ARE the guides, and the calculators — and states the editorial standard that
 * any future article must meet. An empty blog with three lorem posts is worse
 * than no blog.
 */

const STANDARD = [
  {
    glyph: "shield",
    // Este texto decía «ningún contenido se publica sin que un profesional lo
    // firme», y hoy no hay ninguna firma nominal en el sitio. Describir como
    // hecho consumado lo que todavía es un compromiso es exactamente lo que
    // este apartado dice no hacer.
    title: "Responsabilidad editorial identificada",
    body: "Cada página dice quién responde de ella y desde cuándo. Cuando un profesional colegiado firma un contenido a título personal, su nombre y su número aparecen en la propia página.",
  },
  {
    glyph: "doc",
    title: "Con fuentes oficiales enlazadas",
    body: "BOE, Ministerio de Inclusión, Ministerio de Justicia o la sede electrónica correspondiente. Si no hay fuente, no hay afirmación.",
  },
  {
    glyph: "clock",
    title: "Con fecha de última revisión",
    body: "La normativa de extranjería cambia. Un artículo sin fecha es un artículo en el que no puedes confiar.",
  },
  {
    glyph: "alert",
    title: "Sin promesas de resultado",
    body: "Explicamos requisitos y procedimientos. No decimos a nadie que va a conseguir un permiso.",
  },
];

export default function RecursosPage() {
  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Centro de conocimiento"
            title="¿Qué quieres saber sobre extranjería?"
            lede="Guías por trámite, herramientas de cálculo y las fuentes oficiales que usamos nosotros. Todo con su fecha de revisión."
          />

          <div className="mt-8 max-w-2xl">
            <Link
              href="/tramites"
              className="bg-surface hover:bg-canvas-deep group flex items-center gap-3.5 rounded-lg px-5 py-4 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] transition-colors"
            >
              <span className="text-ink-300">
                <svg viewBox="0 0 20 20" width="19" height="19" fill="none" aria-hidden>
                  <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m13.6 13.6 3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-ink-400 flex-1 text-[15px]">
                Busca por trámite, situación u objetivo…
              </span>
              <span className="text-ink-300 group-hover:text-brand-600 transition-colors">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
                  <path
                    d="M3 8h10M9.4 4.4 13 8l-3.6 3.6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ----- Actualidad: lo que tiene plazo corriendo va primero ----- */}
      <section className="pb-14">
        <div className="container-page">
          <Link href="/regularizacion-2026" className="group block">
            <Card className="hover:border-brand-300/60 p-6 transition-colors sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warn" dot>
                  Plazo abierto
                </Badge>
                <Plazo
                  fecha={FECHAS.finSubsanacion}
                  etiqueta="para subsanar"
                  compacto
                />
              </div>
              <h2 className="text-ink-900 group-hover:text-brand-700 font-display mt-4 text-[22px] font-extrabold tracking-[-0.03em] transition-colors">
                Regularización extraordinaria 2026
              </h2>
              <p className="text-ink-600 mt-2 max-w-2xl text-[15px] leading-relaxed">
                Se presentaron más de un millón de solicitudes y la fase que corre ahora es la de
                seguimiento. Siete guías, una por estado de expediente, con los plazos de cada vía
                y la norma que los establece.
              </p>
              <span className="text-brand-700 mt-4 inline-flex items-center gap-1 text-[13.5px] font-medium">
                Ver en qué punto está tu expediente
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                  <path
                    d="M6 3.5 10.5 8 6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Card>
          </Link>
        </div>
      </section>

      {/* ---------------- Guides = trámite pages ---------------- */}
      <section className="pb-16">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-ink-900 font-display text-[22px] font-extrabold tracking-[-0.03em]">
                Guías por trámite
              </h2>
              <p className="text-ink-500 mt-1 text-[14px]">
                {TRAMITES.length} guías completas: requisitos, documentación, proceso, plazos y
                fuentes.
              </p>
            </div>
            <Button href="/tramites" variant="secondary" size="md" arrow>
              Ver todas
            </Button>
          </div>

          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => {
              const count = TRAMITES.filter(
                (t) => t.category === c.id || t.alsoIn?.includes(c.id),
              ).length;
              return (
                <li key={c.id}>
                  <Reveal delay={i * 0.03}>
                    <Link
                      href={`/tramites/categoria/${c.id}`}
                      className="group bg-surface flex items-center gap-3.5 rounded-lg p-4 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_14px_32px_-14px_rgb(10_13_22_/_0.18)]"
                    >
                      <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-colors group-hover:text-white">
                        <Glyph name={c.glyph} className="size-[19px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-ink-900 block text-[14.5px] font-semibold">
                          {c.label}
                        </span>
                        <span className="text-ink-400 block text-[12.5px]">
                          {count} {count === 1 ? "guía" : "guías"}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Calculators ---------------- */}
      <section className="bg-canvas-deep py-16 md:py-20">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-ink-900 font-display text-[22px] font-extrabold tracking-[-0.03em]">
                Calculadoras
              </h2>
              <p className="text-ink-500 mt-1 text-[14px]">
                Se ejecutan en tu navegador. Tus fechas no salen de tu dispositivo.
              </p>
            </div>
            <Button href="/calculadoras" variant="secondary" size="md" arrow>
              Ver todas
            </Button>
          </div>

          <ul className="grid gap-3 md:grid-cols-2">
            {CALCULATORS.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={i * 0.04}>
                  <Link
                    href={`/calculadoras/${c.slug}`}
                    className="group bg-surface flex h-full flex-col rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_18px_40px_-16px_rgb(10_13_22_/_0.2)]"
                  >
                    <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-10 items-center justify-center rounded-[12px] transition-colors group-hover:text-white">
                      <Glyph name={c.glyph} className="size-[19px]" />
                    </span>
                    <h3 className="text-ink-900 font-display mt-3.5 text-[16px] font-extrabold tracking-[-0.026em]">
                      {c.name}
                    </h3>
                    <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">{c.tagline}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Editorial standard ---------------- */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Nuestro criterio editorial"
              title="Qué tiene que cumplir un contenido para publicarse aquí."
              lede="Internet está lleno de artículos de extranjería sin firma, sin fuente y sin fecha. Ese es exactamente el material que hace que la gente pierda expedientes."
            />
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARD.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card padding="lg" className="h-full">
                  <span className="bg-brand-50 text-brand-600 flex size-10 items-center justify-center rounded-[12px]">
                    <Glyph name={s.glyph} className="size-[19px]" />
                  </span>
                  <h3 className="text-ink-900 font-display mt-4 text-[15.5px] leading-snug font-extrabold tracking-[-0.025em]">
                    {s.title}
                  </h3>
                  <p className="text-ink-500 mt-2 text-[13px] leading-relaxed">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Card padding="lg" className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-ink-900 text-[16px] font-semibold">
                  Artículos y actualizaciones normativas
                </h2>
                <Badge tone="neutral" dot>
                  Sin publicaciones todavía
                </Badge>
              </div>
              <p className="text-ink-500 mt-2.5 max-w-2xl text-[14px] leading-relaxed">
                La sección editorial está construida y conectada al modelo de datos, pero no vamos a
                inaugurarla con artículos de relleno. Cuando haya contenido revisado y firmado,
                aparecerá aquí con su autor, su fecha y sus fuentes. Mientras tanto, las guías por
                trámite cumplen exactamente ese estándar.
              </p>
              <p className="text-ink-400 mt-4 text-[12.5px]">
                Revisión jurídica a cargo de {reviewedBy()} · Última revisión general del contenido:{" "}
                {formatDateES(site.review.lastReviewedAt)}
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Official sources ---------------- */}
      <section className="pb-24">
        <div className="container-page">
          <h2 className="text-ink-900 font-display mb-5 text-[22px] font-extrabold tracking-[-0.03em]">
            Fuentes oficiales
          </h2>
          <p className="text-ink-500 mb-6 max-w-2xl text-[14.5px] leading-relaxed">
            Las mismas que usamos nosotros. Si alguna vez dudas de algo que leas aquí, ve directo a
            la fuente.
          </p>
          <ul className="grid gap-2.5 md:grid-cols-2">
            {Object.entries(OFFICIAL_SOURCES).map(([key, src]) => (
              <li key={key}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-ink-600 hover:text-brand-700 bg-surface ring-ink-900/[.06] flex items-center justify-between gap-3 rounded-sm px-4 py-3.5 text-[14px] ring-1 ring-inset transition-colors"
                >
                  {src.label}
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

          <LegalNote variant="framed" className="mt-8">
            El contenido de este centro tiene carácter informativo y orientativo. No constituye
            asesoramiento jurídico ni sustituye el análisis individualizado de cada caso por un
            profesional.
          </LegalNote>
        </div>
      </section>
    </>
  );
}
