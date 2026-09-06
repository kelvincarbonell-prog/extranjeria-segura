import { site } from "@/content/site";
import { Link } from "@/components/ui/Link";
import { SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
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

/**
 * LA PRUEBA QUE SÍ PODEMOS DAR (A12).
 *
 * Lo que había aquí era una declaración de política de reseñas: honesta, y
 * dejaba al usuario en cero justo en el momento de decidir. «No tenemos
 * testimonios y estos son nuestros principios» es una respuesta correcta a una
 * pregunta que nadie ha hecho. La pregunta real es «¿por qué me fío de
 * vosotros?», y a esa sí hay respuesta hoy.
 *
 * Cada tarjeta apunta a algo que el visitante puede abrir y comprobar ahora
 * mismo, sin registrarse: el expediente funcionando, los precios con lo que no
 * incluyen al lado, las medidas de seguridad concretas y el criterio con el
 * que se escribe cada página. Eso es prueba verificable; un muro de citas con
 * nombre de pila no lo es.
 *
 * La política de reseñas no desaparece: baja al final, en una línea, que es el
 * peso que le corresponde mientras no haya reseñas.
 */
const PRUEBAS = [
  {
    glyph: "signal",
    title: "El producto, antes de registrarte",
    body: "El área de cliente funciona en la propia web, con un expediente de ejemplo. Puedes ver exactamente qué vas a usar cada día antes de darnos un solo dato.",
    href: "/#demo",
    cta: "Abrir la demo",
  },
  {
    glyph: "scales",
    title: "El precio, y lo que no incluye",
    body: "Cada servicio lleva su importe y, al lado, la lista de lo que queda fuera: tasas, traducciones, apostillas. Sin «consúltanos» ni «desde» que luego no es desde.",
    href: "/precios",
    cta: "Ver precios",
  },
  {
    glyph: "shield",
    title: "Cómo se guarda tu pasaporte",
    body: "Almacenamiento privado, enlaces firmados que caducan, aislamiento por fila y registro de auditoría. Está explicado con nombre técnico para que se pueda contrastar.",
    href: "/seguridad",
    cta: "Ver las medidas",
  },
  {
    glyph: "doc",
    title: "Con qué criterio escribimos",
    body: "Toda afirmación con cifra o plazo lleva citada su norma, enlazada al BOE. Y decimos en cada página qué no hemos comprobado todavía.",
    href: "/recursos#criterio",
    cta: "Ver el criterio",
  },
];

function VerificationPolicy() {
  return (
    <>
      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {PRUEBAS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <Link href={p.href} className="group block h-full">
              <div className="bg-surface hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.25)] flex h-full flex-col rounded-lg p-6 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-shadow">
                <span className="bg-ink-50 text-ink-700 group-hover:bg-brand-50 group-hover:text-brand-700 flex size-10 items-center justify-center rounded-[12px] transition-colors">
                  <Glyph name={p.glyph} className="size-[19px]" />
                </span>
                <h3 className="text-ink-900 font-display mt-4 text-[16px] font-extrabold tracking-[-0.025em]">
                  {p.title}
                </h3>
                <p className="text-ink-500 mt-2 flex-1 text-[13.5px] leading-relaxed">{p.body}</p>
                <span className="text-brand-700 mt-4 inline-flex items-center gap-1 text-[13.5px] font-medium">
                  {p.cta}
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
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="border-ink-900/[.07] mx-auto mt-8 max-w-2xl border-t pt-6 text-center">
          <div className="mb-3 flex justify-center">
            <Badge tone="neutral" dot>
              Sin reseñas publicadas todavía
            </Badge>
          </div>
          <p className="text-ink-500 text-[13.5px] leading-relaxed">
            Cuando las haya, cada una enlazará a su fuente pública e indicará el trámite y el país
            de origen. Publicaremos también las críticas. Es fácil llenar esta sección de
            testimonios inventados y no lo vamos a hacer: mientras tanto, juzga por lo de arriba,
            que sí puedes comprobarlo.
          </p>
        </div>
      </Reveal>
    </>
  );
}
