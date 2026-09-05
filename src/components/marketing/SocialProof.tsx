import { site } from "@/content/site";
import { SectionHeading, Badge, LegalNote } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { REVIEWS, type Review } from "@/content/reviews";
import { Avatar } from "@/components/ui/primitives";

/**
 * SOCIAL PROOF.
 *
 * `REVIEWS` ships empty. Nothing here is invented: no fabricated names, no
 * "4,9 ★ sobre 300 reseñas", no stock-photo testimonials. Until the business
 * connects a real review source, the section renders its verification policy
 * instead — which is itself a stronger trust signal than a wall of reviews a
 * visitor has no way to check.
 *
 * When reviews are added to `src/content/reviews.ts` (or wired to the Google
 * Places API) this component switches to the populated layout automatically.
 */

export function SocialProof() {
  const hasReviews = REVIEWS.length > 0;

  return (
    <section id="opiniones" className="relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Opiniones"
            title={
              hasReviews ? "Lo que dicen quienes ya lo han pasado." : "Solo publicamos reseñas que puedes comprobar."
            }
            lede={
              hasReviews
                ? "Historias reales, con el trámite y el país de origen de cada persona."
                : "Es fácil llenar esta sección de testimonios inventados. No lo vamos a hacer. Aquí solo aparecerán opiniones verificables, enlazadas a su origen, con el trámite y el país de la persona que las escribió."
            }
            align="center"
            className="mx-auto"
          />
        </Reveal>

        {hasReviews ? <ReviewGrid reviews={REVIEWS} /> : <VerificationPolicy />}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ReviewGrid({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {site.metrics.googleRating !== null && (
        <Reveal>
          <div className="mt-10 flex justify-center">
            <div className="bg-surface inline-flex items-center gap-3 rounded-full py-2.5 pr-5 pl-3 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
              <span className="text-ink-900 font-display text-[18px] font-extrabold tabular-nums">
                {site.metrics.googleRating.toFixed(1)}
              </span>
              <span className="text-ink-400 text-[13px]">
                sobre {site.metrics.googleReviewCount} reseñas verificadas
              </span>
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.05}>
            <figure className="bg-surface flex h-full flex-col rounded-lg p-6 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
              <blockquote className="text-ink-700 flex-1 text-[14.5px] leading-relaxed">
                “{r.body}”
              </blockquote>
              <figcaption className="border-ink-100 mt-5 flex items-center gap-3 border-t pt-4">
                <Avatar name={r.author} size={34} />
                <span className="min-w-0">
                  <span className="text-ink-900 block truncate text-[13.5px] font-semibold">
                    {r.author}
                  </span>
                  <span className="text-ink-400 block truncate text-[12px]">
                    {r.tramite} · {r.origin} → {r.city}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

const POLICY = [
  {
    glyph: "shield",
    title: "Origen verificable",
    body: "Cada reseña enlaza a su fuente pública (Google, vídeo o caso documentado). Si no se puede comprobar, no se publica.",
  },
  {
    glyph: "doc",
    title: "Contexto completo",
    body: "Trámite, país de origen y ciudad. Una reseña sin contexto no sirve para que sepas si se parece a tu caso.",
  },
  {
    glyph: "alert",
    title: "También las malas",
    body: "No filtramos las críticas. Si un expediente no salió como se esperaba y la persona lo cuenta, se queda publicado.",
  },
];

function VerificationPolicy() {
  return (
    <>
      <div className="mt-12 grid gap-3 md:grid-cols-3">
        {POLICY.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="bg-surface flex h-full flex-col rounded-lg p-6 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
              <span className="bg-ink-50 text-ink-700 flex size-10 items-center justify-center rounded-[12px]">
                <Glyph name={p.glyph} className="size-[19px]" />
              </span>
              <h3 className="text-ink-900 font-display mt-4 text-[16px] font-extrabold tracking-[-0.025em]">
                {p.title}
              </h3>
              <p className="text-ink-500 mt-2 text-[13.5px] leading-relaxed">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div className="bg-canvas-deep ring-ink-900/[.06] mt-6 flex flex-col items-start gap-5 rounded-xl p-6 ring-1 ring-inset md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="neutral" dot>
                Pendiente de conectar la fuente de reseñas
              </Badge>
            </div>
            <p className="text-ink-600 text-[14.5px] leading-relaxed">
              Esta sección está construida y se rellena sola en cuanto se conecta la fuente
              verificable. Mientras tanto preferimos un espacio honesto a un muro de testimonios que
              nadie puede comprobar.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <Button href="/diagnostico" size="md" arrow>
              Juzga por el producto
            </Button>
            <Button href="/como-funciona" size="md" variant="secondary">
              Cómo trabajamos
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <LegalNote className="mx-auto mt-6 max-w-2xl justify-center text-center">
          Configura la fuente en <code className="data text-ink-500">src/content/reviews.ts</code> o
          conecta la Google Places API. La sección cambia de diseño automáticamente al detectar
          reseñas.
        </LegalNote>
      </Reveal>
    </>
  );
}
