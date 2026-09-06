"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { SectionHeading, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { TRAMITES } from "@/content/tramites";
import { eur, cn } from "@/lib/utils";

/**
 * "Dinos qué quieres conseguir."
 *
 * An intent router, not a list of services. Choosing an intent transforms the
 * section in place: the grid collapses to the chosen chip and the matching
 * pathways expand underneath, pre-seeded into the Immigration Check.
 */

interface Intent {
  id: string;
  label: string;
  glyph: string;
  /** Trámite slugs surfaced when this intent is picked, best-first. */
  slugs: string[];
  note: string;
}

const INTENTS: Intent[] = [
  {
    id: "vivir",
    label: "Quiero vivir en España",
    glyph: "door",
    slugs: ["residencia-no-lucrativa", "teletrabajo-internacional", "arraigo-social"],
    note: "Vías para establecerte de forma estable, con o sin actividad laboral en España.",
  },
  {
    id: "trabajar",
    label: "Quiero trabajar en España",
    glyph: "briefcase",
    slugs: ["residencia-trabajo-cuenta-ajena", "profesional-altamente-cualificado", "arraigo-sociolaboral"],
    note: "Depende de si te encuentras dentro o fuera de España y de quién te contrata.",
  },
  {
    id: "nomada",
    label: "Soy nómada digital",
    glyph: "signal",
    slugs: ["teletrabajo-internacional", "profesional-altamente-cualificado", "emprendedores"],
    note: "Trabajas en remoto para empresas o clientes situados fuera de España.",
  },
  {
    id: "estudiar",
    label: "Quiero estudiar",
    glyph: "cap",
    slugs: ["residencia-estudios", "modificacion-estudios-trabajo", "arraigo-socioformativo"],
    note: "Estancia por estudios y cómo pasar después a una autorización de trabajo.",
  },
  {
    id: "familia",
    label: "Quiero traer a mi familia",
    glyph: "family",
    slugs: ["reagrupacion-familiar", "tarjeta-familiar-comunitario", "arraigo-familiar"],
    note: "El régimen que te aplica cambia mucho según la nacionalidad de tu familiar.",
  },
  {
    id: "regularizar",
    label: "Ya vivo aquí y quiero regularizarme",
    glyph: "roots",
    slugs: ["arraigo-sociolaboral", "arraigo-social", "arraigo-socioformativo"],
    note: "Las vías de arraigo parten del tiempo que llevas en España y de tu situación.",
  },
  {
    id: "renovar",
    label: "Quiero renovar mi permiso",
    glyph: "cycle",
    slugs: ["renovacion-residencia-trabajo", "residencia-larga-duracion", "nie-tie"],
    note: "El momento de presentación es determinante. Consúltalo antes de que caduque.",
  },
  {
    id: "nacionalidad",
    label: "Quiero obtener la nacionalidad",
    glyph: "passport",
    slugs: ["nacionalidad-por-residencia", "nacionalidad-por-opcion", "residencia-larga-duracion"],
    note: "Antes de nada auditamos tus años de residencia legal y tus ausencias.",
  },
  {
    id: "requerimiento",
    label: "He recibido un requerimiento",
    glyph: "alert",
    slugs: ["requerimiento-subsanacion", "recurso-alzada", "recurso-contencioso"],
    note: "Los plazos son cortos. Si acabas de recibirlo, escríbenos hoy mismo.",
  },
  {
    id: "no_se",
    label: "No sé qué necesito",
    glyph: "help",
    slugs: [],
    note: "Es la respuesta más común y no pasa nada. El diagnóstico está hecho para esto.",
  },
];

export function NeedsFinder() {
  const [active, setActive] = React.useState<string | null>(null);
  const intent = INTENTS.find((i) => i.id === active) ?? null;

  return (
    <section id="que-necesitas" className="relative py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Punto de partida"
            title={
              <>
                Dinos qué quieres conseguir.
                <br />
                <span className="text-ink-400">Nosotros encontramos el camino.</span>
              </>
            }
            lede="No necesitas saber el nombre del trámite. Empieza por tu objetivo y nosotros traducimos."
          />
        </Reveal>

        <LayoutGroup id="needs">
          <div className="mt-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {!intent ? (
                <motion.ul
                  key="grid"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {INTENTS.map((it, i) => (
                    <motion.li key={it.id} layoutId={`intent-${it.id}`}>
                      <Reveal delay={i * 0.035}>
                        <button
                          type="button"
                          onClick={() => setActive(it.id)}
                          className={cn(
                            "group bg-surface flex w-full items-center gap-3.5 rounded-lg p-4 text-left",
                            "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
                            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            "hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.22),0_14px_34px_-14px_rgb(10_13_22_/_0.2)]",
                          )}
                        >
                          <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-colors duration-300 group-hover:text-white">
                            <Glyph name={it.glyph} className="size-[19px]" />
                          </span>
                          <span className="text-ink-900 flex-1 text-[14.5px] leading-snug font-semibold tracking-[-0.012em]">
                            {it.label}
                          </span>
                          <span className="text-ink-200 group-hover:text-brand-600 shrink-0 transition-all duration-300 group-hover:translate-x-0.5">
                            <Arrow />
                          </span>
                        </button>
                      </Reveal>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-6 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActive(null)}
                      className="text-ink-500 hover:text-ink-900 bg-surface hover:bg-ink-50 inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-colors"
                    >
                      <Arrow className="rotate-180" />
                      Cambiar objetivo
                    </button>
                    <motion.span
                      layoutId={`intent-${intent.id}`}
                      className="bg-ink-950 inline-flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5 text-[13.5px] font-semibold text-white"
                    >
                      <Glyph name={intent.glyph} className="size-4" />
                      {intent.label}
                    </motion.span>
                  </div>

                  <p className="text-ink-500 mb-7 max-w-xl text-[15px] leading-relaxed">
                    {intent.note}
                  </p>

                  {intent.slugs.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {intent.slugs.map((slug, i) => {
                        const t = TRAMITES.find((x) => x.slug === slug);
                        if (!t) return null;
                        return (
                          <motion.div
                            key={slug}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Link
                              href={`/tramites/${t.slug}`}
                              className="group bg-surface flex h-full flex-col rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_20px_46px_-16px_rgb(10_13_22_/_0.22)]"
                            >
                              <div className="mb-3 flex items-center justify-between">
                                {i === 0 ? (
                                  <Badge tone="brand">Más habitual</Badge>
                                ) : (
                                  <Badge tone="neutral">Alternativa</Badge>
                                )}
                                <span className="text-ink-200 group-hover:text-brand-600 transition-colors">
                                  <Arrow />
                                </span>
                              </div>
                              <h3 className="text-ink-900 font-display text-[17px] leading-tight font-extrabold tracking-[-0.025em]">
                                {t.shortName ?? t.name}
                              </h3>
                              <p className="text-ink-500 mt-2 flex-1 text-[13.5px] leading-relaxed">
                                {t.tagline}
                              </p>
                              <p className="text-ink-400 border-ink-100 mt-4 border-t pt-3 text-[12.5px]">
                                {t.feeFromCents !== null ? (
                                  <>
                                    Honorarios desde{" "}
                                    <span className="text-ink-900 data font-semibold">
                                      {eur(t.feeFromCents)}
                                    </span>
                                  </>
                                ) : (
                                  "Presupuesto tras el diagnóstico"
                                )}
                              </p>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-surface rounded-lg p-7 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
                      <p className="text-ink-700 max-w-lg text-[15px] leading-relaxed">
                        El diagnóstico te hace entre 8 y 12 preguntas y te devuelve las vías que
                        pueden encajar contigo, con lo que habría que verificar en cada una.
                      </p>
                    </div>
                  )}

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button href={`/diagnostico?objetivo=${intent.id}`} size="lg" arrow>
                      Comprobar mi encaje en 3 minutos
                    </Button>
                    <Button href="/tramites" size="lg" variant="secondary">
                      Ver el catálogo completo
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8h10M9.4 4.4 13 8l-3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
