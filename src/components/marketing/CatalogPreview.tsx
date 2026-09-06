import Link from "next/link";
import { CATEGORIES } from "@/content/taxonomy";
import { TRAMITES } from "@/content/tramites";
import { Glyph } from "@/components/brand/Glyph";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Button } from "@/components/ui/Button";

export function CatalogPreview() {
  return (
    <section id="tramites" className="relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Catálogo"
              title="Doce familias de trámites. Un único expediente."
              lede="Cada trámite tiene su página con requisitos, documentación, proceso, plazos y honorarios. Sin letra pequeña."
            />
            <Button href="/tramites" variant="secondary" size="md" className="shrink-0" arrow>
              Ver los {TRAMITES.length} trámites
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const count = TRAMITES.filter(
              (t) => t.category === c.id || t.alsoIn?.includes(c.id),
            ).length;
            return (
              <Reveal key={c.id} delay={i * 0.03}>
                <Link
                  href={`/tramites/categoria/${c.id}`}
                  className="group bg-surface relative flex h-full flex-col overflow-hidden rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.18),0_20px_46px_-16px_rgb(10_13_22_/_0.2)]"
                >
                  <span
                    aria-hidden
                    className="from-brand-50/70 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="bg-ink-50 text-ink-700 group-hover:bg-ink-950 flex size-11 items-center justify-center rounded-[13px] transition-colors duration-400 group-hover:text-white">
                      <Glyph name={c.glyph} className="size-5" />
                    </span>
                    <span className="data text-ink-300 text-[11.5px] font-semibold">
                      {String(count).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-ink-900 font-display relative mt-4 text-[17px] font-extrabold tracking-[-0.028em]">
                    {c.label}
                  </h3>
                  <p className="text-ink-500 relative mt-1.5 flex-1 text-[13.5px] leading-relaxed">
                    {c.blurb}
                  </p>
                  <span className="text-brand-600 relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Ver trámites
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden>
                      <path
                        d="M3 8h9M8.6 4.6 12 8l-3.4 3.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
