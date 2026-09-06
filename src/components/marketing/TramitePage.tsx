import { Link } from "@/components/ui/Link";
import type { Category, Tramite } from "@/content/taxonomy";
import type { CITIES, NATIONALITIES } from "@/content/geo";
import { OFFICIAL_SOURCES, reviewedBy } from "@/content/site";
import { BarraAccion } from "./BarraAccion";
import { IndiceLateral, ProgresoLectura } from "@/components/contenido/IndiceLateral";
import { LoEsencial } from "@/components/contenido/LoEsencial";
import { loEsencialTramite } from "@/content/lo-esencial-tramite";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Badge, Card, LegalNote, Divider } from "@/components/ui/primitives";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { TramiteFaq } from "./TramiteFaq";
import { eur, formatDateES, cn } from "@/lib/utils";

type City = (typeof CITIES)[number];
type Nationality = (typeof NATIONALITIES)[number];

const ACTOR_LABEL = {
  cliente: "Tú",
  "extranjeria-segura": "Nosotros",
  administracion: "La Administración",
} as const;

const SOURCE_LABEL = {
  cliente: "Lo aportas tú",
  nosotros: "Lo preparamos nosotros",
  administracion: "Lo emite la Administración",
} as const;

export function TramitePage({
  tramite: t,
  category,
  related,
  cities,
  nationalities,
}: {
  tramite: Tramite;
  category: Category;
  related: (Tramite | undefined)[];
  cities: City[];
  nationalities: Nationality[];
}) {
  return (
    <>
      {/* En móvil no hay raíl lateral: la única señal de cuánto queda de una
          ficha de dos mil palabras es esta barra. */}
      <div className="fixed inset-x-0 top-16 z-30 lg:hidden">
        <ProgresoLectura />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-14 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="text-ink-400 flex flex-wrap items-center gap-1.5 text-[13px]">
              <li>
                <Link href="/tramites" className="hover:text-ink-900 tap inline-block transition-colors">
                  Trámites
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/tramites/categoria/${category.id}`}
                  className="hover:text-ink-900 tap inline-block transition-colors"
                >
                  {category.label}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-700 font-medium">{t.shortName ?? t.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div>
              <span className="bg-brand-50 text-brand-700 mb-5 inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-[12px] font-semibold">
                <Glyph name={category.glyph} className="size-4" />
                {category.label}
              </span>

              <h1 className="text-display-md md:text-display-lg text-ink-900 max-w-3xl">
                {t.name}
              </h1>
              <p className="text-ink-500 mt-5 max-w-2xl text-[17px] leading-[1.6] md:text-[18.5px]">
                {t.tagline}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/diagnostico?objetivo=${intentFor(t)}`} size="lg" arrow magnetic>
                  Comprobar si encaja conmigo
                </Button>
                <Button href="/citas" size="lg" variant="secondary">
                  Hablar con un especialista
                </Button>
              </div>

              {/* Mobile/tablet: the rail is hidden, so the headline facts
                  travel with the hero instead of disappearing. */}
              <dl className="border-ink-100 mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-3 lg:hidden">
                <div>
                  <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                    Honorarios
                  </dt>
                  <dd className="text-ink-900 font-display mt-1 text-[19px] font-extrabold tracking-[-0.03em] tabular-nums">
                    {t.feeFromCents !== null ? `desde ${eur(t.feeFromCents)}` : "A medida"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                    Documentación
                  </dt>
                  <dd className="text-ink-900 font-display mt-1 text-[19px] font-extrabold tracking-[-0.03em]">
                    {t.documents.length} docs
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                    Última revisión
                  </dt>
                  <dd className="text-ink-700 mt-1 text-[13.5px] font-medium">
                    {formatDateES(t.updatedAt, "short")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* «Lo esencial», antes del primer scroll. Cada punto lleva una
                cifra que la ficha ya publica más abajo —documentos, honorarios,
                pasos, puntos por verificar— y que hasta ahora había que leerse
                la página entera para reunir. Es también la unidad que los
                buscadores generativos extraen literalmente. */}
            <LoEsencial
              puntos={loEsencialTramite(t)}
              actualizado={t.updatedAt}
              className="mt-9"
            />
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <div className="container-page pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div className="max-w-3xl">
            {/* ---- Qué es ---- */}
            <Section id="que-es" title="Qué es">
              <p className="text-ink-600 text-[16px] leading-[1.7]">{t.whatItIs}</p>
            </Section>

            {/* ---- Para quién ---- */}
            <Section id="para-quien" title="Para quién es">
              <ul className="flex flex-col gap-3">
                {t.forWho.map((f, i) => (
                  <li key={f} className="text-ink-600 flex gap-3 text-[15px] leading-relaxed">
                    <span className="bg-brand-50 text-brand-600 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                      <CheckDraw size={11} strokeWidth={3.2} delay={i * 0.1} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Section>

            {/* ---- Requisitos ---- */}
            <Section id="requisitos" title="Requisitos">
              <ol className="border-ink-100 flex flex-col border-t">
                {t.requirements.map((r, i) => (
                  <li key={r} className="border-ink-100 flex gap-4 border-b py-4">
                    <span className="data text-ink-400 shrink-0 pt-0.5 text-[12px] font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-700 text-[15px] leading-relaxed">{r}</span>
                  </li>
                ))}
              </ol>

              {t.needsVerification.length > 0 && (
                <div className="bg-signal-warn-soft ring-signal-warn/15 mt-6 rounded-lg p-5 ring-1 ring-inset">
                  <h3 className="text-signal-warn mb-3 flex items-center gap-2 text-[13.5px] font-bold">
                    <Glyph name="alert" className="size-4" />
                    Lo que hay que verificar en cada caso
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {t.needsVerification.map((v) => (
                      <li key={v} className="text-ink-600 flex gap-2.5 text-[13.5px] leading-snug">
                        <span className="text-signal-warn mt-1 shrink-0">·</span>
                        {v}
                      </li>
                    ))}
                  </ul>
                  <p className="text-ink-500 mt-4 text-[12.5px] leading-relaxed">
                    Estos puntos son la diferencia entre un expediente que se resuelve y uno que se
                    deniega. Ninguna web puede resolverlos por ti: hay que mirar tus documentos.
                  </p>
                </div>
              )}
            </Section>

            {/* ---- Documentación ---- */}
            <Section id="documentacion" title="Documentación">
              <ul className="bg-surface divide-ink-100 divide-y overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
                {t.documents.map((d) => (
                  <li key={d.name} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
                        d.source === "cliente"
                          ? "bg-brand-50 text-brand-600"
                          : d.source === "nosotros"
                            ? "bg-signal-ok-soft text-signal-ok"
                            : "bg-ink-50 text-ink-400",
                      )}
                    >
                      <Glyph name="doc" className="size-[17px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-900 block text-[14.5px] font-medium">
                        {d.name}
                        {d.optional && (
                          <span className="text-ink-400 ml-2 text-[12px] font-normal">
                            (si aplica)
                          </span>
                        )}
                      </span>
                      {d.note && (
                        <span className="text-ink-500 mt-0.5 block text-[13px] leading-snug">
                          {d.note}
                        </span>
                      )}
                    </span>
                    <span className="text-ink-400 shrink-0 text-[12px] font-medium sm:pt-2">
                      {SOURCE_LABEL[d.source]}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ---- Proceso ---- */}
            <Section id="proceso" title="Cómo es el proceso">
              <ol className="relative flex flex-col">
                {t.process.map((s, i) => (
                  <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
                    {i < t.process.length - 1 && (
                      <span
                        aria-hidden
                        className="bg-ink-100 absolute top-9 left-[17px] w-px"
                        style={{ height: "calc(100% - 20px)" }}
                      />
                    )}
                    <span
                      className={cn(
                        "font-display relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
                        s.actor === "extranjeria-segura"
                          ? "bg-ink-950 text-white"
                          : s.actor === "cliente"
                            ? "bg-brand-50 text-brand-700 ring-brand-600/15 ring-1 ring-inset"
                            : "bg-ink-50 text-ink-400 ring-ink-900/[.06] ring-1 ring-inset",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-ink-900 font-display text-[16.5px] font-extrabold tracking-[-0.025em]">
                          {s.title}
                        </h3>
                        <span className="text-ink-400 text-[11.5px] font-medium">
                          {ACTOR_LABEL[s.actor]}
                          {s.duration ? ` · ${s.duration}` : ""}
                        </span>
                      </div>
                      <p className="text-ink-500 mt-1.5 text-[14.5px] leading-relaxed">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {/* ---- Precio ---- */}
            <Section id="precio" title="Precio y qué incluye">
              <Card padding="lg">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <p className="text-ink-400 text-[12.5px]">Honorarios profesionales</p>
                    <p className="text-ink-900 font-display mt-1 text-[32px] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                      {t.feeFromCents !== null ? `desde ${eur(t.feeFromCents)}` : "Presupuesto a medida"}
                    </p>
                  </div>
                  <Button href="/precios" variant="secondary" size="md">
                    Ver todos los precios
                  </Button>
                </div>

                <Divider label="No incluido" className="my-6" />
                <p className="text-ink-500 text-[14px] leading-relaxed">{t.adminFeesNote}</p>

                <div className="bg-canvas-deep mt-5 rounded-sm p-4">
                  <p className="text-ink-600 text-[13px] leading-relaxed">
                    Antes de empezar recibes un presupuesto cerrado por escrito. Si durante el
                    expediente aparece algo que cambia el alcance, se acuerda contigo antes de
                    hacerlo. Nunca aparece un cargo que no hayas aprobado.
                  </p>
                </div>
              </Card>
            </Section>

            {/* ---- FAQs ---- */}
            <Section id="faq" title="Preguntas frecuentes">
              <TramiteFaq faqs={t.faqs} />
            </Section>

            {/* ---- Programmatic SEO hubs ---- */}
            {(cities.length > 0 || nationalities.length > 0) && (
              <Section id="tu-caso" title="Información para tu caso concreto">
                <p className="text-ink-500 mb-6 text-[15px] leading-relaxed">
                  Los requisitos son estatales, pero la práctica cambia según dónde vivas y de dónde
                  vengan tus documentos. Estas páginas recogen lo que es distinto en cada caso.
                </p>

                {cities.length > 0 && (
                  <div className="mb-7">
                    <h3 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Por ciudad
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {cities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/${t.slug}-${c.slug}`}
                            className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                          >
                            {t.shortName ?? t.name} {c.inCity}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nationalities.length > 0 && (
                  <div>
                    <h3 className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Por nacionalidad
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {nationalities.map((n) => (
                        <li key={n.slug}>
                          <Link
                            href={`/${t.slug}-${n.slug}`}
                            className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                          >
                            Para {n.demonym}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>
            )}

            {/* ---- Sources ---- */}
            <Section id="fuentes" title="Fuentes oficiales">
              <ul className="flex flex-col gap-2.5">
                {t.sources.map((s) => {
                  const src = OFFICIAL_SOURCES[s];
                  return (
                    <li key={s}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-ink-600 hover:text-brand-700 bg-surface ring-ink-900/[.06] flex items-center justify-between gap-3 rounded-sm px-4 py-3 text-[14px] ring-1 ring-inset transition-colors"
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
                  );
                })}
              </ul>

              <LegalNote variant="framed" className="mt-6">
                Esta página tiene carácter informativo y no constituye asesoramiento jurídico. Los
                requisitos aquí descritos resumen la normativa vigente en la fecha de revisión
                indicada y pueden cambiar. Contenido revisado por {reviewedBy()}. Última
                actualización: {formatDateES(t.updatedAt)}.
                {t.pendingLegalReview &&
                  " Este contenido está pendiente de la validación y firma del profesional responsable antes de su publicación definitiva."}
              </LegalNote>
            </Section>
          </div>

          {/* ---- Right rail: table of contents ---- */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-8">
              {/* Facts first: price, document count, timeframe, review date. */}
              <div>
                          <Card padding="none" className="overflow-hidden">
                <dl className="divide-ink-100 divide-y">
                  <div className="p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Honorarios
                    </dt>
                    <dd className="text-ink-900 font-display mt-1.5 text-[26px] leading-none font-extrabold tracking-[-0.035em] tabular-nums">
                      {t.feeFromCents !== null ? (
                        <>
                          <span className="text-ink-400 text-[15px] font-medium">desde </span>
                          {eur(t.feeFromCents)}
                        </>
                      ) : (
                        <span className="text-[20px]">A medida</span>
                      )}
                    </dd>
                    <dd className="text-ink-400 mt-2 text-[12px] leading-relaxed">
                      {t.adminFeesNote}
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Documentación
                    </dt>
                    <dd className="text-ink-900 mt-1.5 text-[15px] font-semibold">
                      {t.documents.length} documentos
                    </dd>
                    <dd className="text-ink-400 mt-1 text-[12.5px]">
                      {t.documents.filter((d) => d.source === "cliente").length} los aportas tú ·{" "}
                      {t.documents.filter((d) => d.source !== "cliente").length} los gestionamos
                    </dd>
                  </div>

                  <div className="p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Plazos
                    </dt>
                    <dd className="text-ink-600 mt-1.5 text-[13px] leading-relaxed">
                      {t.timeframe}
                    </dd>
                  </div>

                  <div className="bg-canvas-deep p-5">
                    <dt className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                      Última revisión
                    </dt>
                    <dd className="text-ink-700 mt-1.5 text-[13px] font-medium">
                      {formatDateES(t.updatedAt)}
                    </dd>
                    <dd className="text-ink-400 mt-0.5 text-[12.5px]">
                      Revisado por {reviewedBy()}
                    </dd>
                    {t.pendingLegalReview && (
                      <dd className="mt-3">
                        <Badge tone="warn">Pendiente de firma jurídica</Badge>
                      </dd>
                    )}
                  </div>
                </dl>
              </Card>
              </div>

              <div>
              <IndiceLateral
                secciones={[
                  { id: "que-es", etiqueta: "Qué es" },
                  { id: "para-quien", etiqueta: "Para quién es" },
                  { id: "requisitos", etiqueta: "Requisitos" },
                  { id: "documentacion", etiqueta: "Documentación" },
                  { id: "proceso", etiqueta: "Proceso" },
                  { id: "precio", etiqueta: "Precio" },
                  { id: "faq", etiqueta: "Preguntas frecuentes" },
                  ...(cities.length || nationalities.length
                    ? [{ id: "tu-caso", etiqueta: "Para tu caso" }]
                    : []),
                  { id: "fuentes", etiqueta: "Fuentes oficiales" },
                ]}
              />

              <div className="bg-ink-950 mt-8 rounded-lg p-5 text-white">
                <p className="font-display text-[15px] leading-snug font-bold">
                  ¿Esto encaja con tu caso?
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  El diagnóstico te lo dice en 3 minutos, gratis y sin registro.
                </p>
                <Button
                  href={`/diagnostico?objetivo=${intentFor(t)}`}
                  variant="inverse"
                  size="sm"
                  block
                  className="mt-4"
                  arrow
                >
                  Comprobarlo
                </Button>
              </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ---- Related ---- */}
        {related.length > 0 && (
          <Reveal>
            <div className="border-ink-100 mt-16 border-t pt-12">
              <h2 className="text-ink-900 font-display mb-6 text-[22px] font-extrabold tracking-[-0.03em]">
                Trámites relacionados
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {related.map((r) =>
                  r ? (
                    <Link
                      key={r.slug}
                      href={`/tramites/${r.slug}`}
                      className="group bg-surface flex flex-col rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_18px_40px_-16px_rgb(10_13_22_/_0.2)]"
                    >
                      <h3 className="text-ink-900 font-display text-[16px] font-extrabold tracking-[-0.025em]">
                        {r.shortName ?? r.name}
                      </h3>
                      <p className="text-ink-500 mt-2 text-[13.5px] leading-relaxed">{r.tagline}</p>
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* La ficha mide dos mil palabras y el CTA vive arriba. En móvil no hay
          raíl lateral que lo sostenga, así que la acción baja con el lector. */}
      <BarraAccion
        href="/diagnostico"
        etiqueta="Comprobar si encajo"
        nota="Gratis · sin registro · no pedimos documentos todavía"
        secundario={{ href: "/citas", etiqueta: "Consulta" }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-ink-100 border-t py-10 first:border-t-0 first:pt-0">
      <h2 className="text-ink-900 font-display mb-6 text-[24px] font-extrabold tracking-[-0.032em] md:text-[28px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Maps a trámite to the wizard intent that pre-seeds the check. */
function intentFor(t: Tramite): string {
  const map: Record<string, string> = {
    arraigo: "regularizar",
    nacionalidad: "nacionalidad",
    nomadas: "nomada",
    familia: "familia",
    comunitarios: "familia",
    estudios: "estudiar",
    trabajo: "trabajar",
    renovaciones: "renovar",
    recursos: "requerimiento",
    requerimientos: "requerimiento",
    residencia: "vivir",
    proteccion: "no_se",
  };
  return map[t.category] ?? "no_se";
}
