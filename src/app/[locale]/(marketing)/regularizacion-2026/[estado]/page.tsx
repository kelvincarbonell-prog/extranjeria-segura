import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import {
  ESTADOS,
  estado as findEstado,
  CONSULTADO,
  FECHAS,
  REVISADO_POR_PROFESIONAL,
} from "@/content/regularizacion-2026";
import { LoEsencial } from "@/components/contenido/LoEsencial";
import { Plazo } from "@/components/contenido/Plazo";
import { Fuente, BloqueFuentes } from "@/components/contenido/Fuente";
import { AvisoRevision } from "@/components/contenido/AvisoRevision";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/primitives";
import { TramiteFaq } from "@/components/marketing/TramiteFaq";
import { BarraAccion } from "@/components/marketing/BarraAccion";
import { IndiceLateral, ProgresoLectura } from "@/components/contenido/IndiceLateral";
import { site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ESTADOS.map((e) => ({ estado: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ estado: string; locale: Locale }>;
}): Promise<Metadata> {
  const { estado, locale } = await params;
  const e = findEstado(estado);
  if (!e) return {};
  return pageMetadata({
    locale,
    path: `/regularizacion-2026/${e.id}`,
    title: e.titulo,
    description: e.meta,
    type: "article",
    modifiedTime: CONSULTADO,
  });
}

/**
 * Página de estado de expediente.
 *
 * El orden de los bloques replica la anatomía que funciona en esta vertical y
 * no es negociable por estética: H1 con el término tal y como se busca, «Lo
 * esencial» antes del primer scroll, la tabla de plazos, el cuerpo con los H2
 * en forma de pregunta, las FAQ con la pregunta literal y las fuentes al final.
 *
 * En las páginas con plazo corriendo, la cuenta atrás va arriba del todo. Quien
 * llega aquí con un requerimiento en la mano necesita el número de días antes
 * que cualquier explicación.
 */
export default async function EstadoPage({
  params,
}: {
  params: Promise<{ estado: string }>;
}) {
  const { estado } = await params;
  const e = findEstado(estado);
  if (!e) notFound();

  const otros = ESTADOS.filter((x) => x.id !== e.id);

  const secciones = [
    { id: "reconocer", etiqueta: "¿Cómo sé que es mi caso?" },
    { id: "que-hacer", etiqueta: "Qué puedo hacer" },
    ...(e.datos.length > 0 ? [{ id: "plazos", etiqueta: "Qué plazos se aplican" }] : []),
    { id: "errores", etiqueta: "Errores que cuestan el expediente" },
    { id: "faq", etiqueta: "Preguntas frecuentes" },
    { id: "fuentes", etiqueta: "Fuentes" },
  ];
  const fuentes = e.datos.map((d) => ({
    fuente: d.fuente,
    articulo: d.articulo,
    verificado: d.verificado,
  }));

  return (
    <>
      {/* En móvil no hay raíl lateral: la única señal de cuánto queda es esta. */}
      <div className="fixed inset-x-0 top-16 z-30 lg:hidden">
        <ProgresoLectura />
      </div>

      <section className="relative pt-32 pb-10 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <nav aria-label="Migas de pan" className="mb-7">
            <ol className="text-ink-400 flex flex-wrap items-center gap-1.5 text-[13px]">
              <li>
                <Link href="/" className="hover:text-ink-700 tap inline-block transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/regularizacion-2026" className="hover:text-ink-700 tap inline-block transition-colors">
                  Regularización 2026
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-600">{e.comoLoVives}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge tone={e.urgente ? "risk" : "neutral"} dot={e.urgente} className="mb-5">
              {e.nombreTecnico}
            </Badge>
            {/* El H1 es la consulta tal y como se busca, no el nombre técnico. */}
            <h1 className="text-display-lg text-ink-950 text-balance">{e.h1}</h1>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
            <LoEsencial puntos={e.loEsencial} actualizado={CONSULTADO} />
            {e.id === "subsanacion" && (
              <Plazo
                fecha={FECHAS.finSubsanacion}
                etiqueta="Cierre del plazo de subsanación"
                detalle="fecha fija, no depende de tu expediente"
              />
            )}
            {e.urgente && e.id !== "subsanacion" && (
              <Card className="p-5">
                <h2 className="text-ink-900 text-[15px] font-semibold">Tu plazo es propio</h2>
                <p className="text-ink-600 mt-2 text-[14px] leading-relaxed">
                  A diferencia de la subsanación, este plazo no tiene una fecha común: depende del
                  día en que te notificaron o del día en que presentaste. Calcúlalo con tu fecha.
                </p>
                <Button
                  href="/calculadoras/plazos-regularizacion"
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  arrow
                >
                  Calcular mis plazos
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {/* ── Reconocer el documento ────────────────────────────── */}
            <section aria-labelledby="reconocer">
              <h2 id="reconocer" className="text-display-sm text-ink-950">
                ¿Cómo sé que este es mi caso?
              </h2>
              <p className="text-ink-600 mt-3 text-[15.5px] leading-relaxed">
                Las notificaciones administrativas se parecen mucho entre sí y la diferencia entre
                una y otra cambia por completo lo que hay que hacer. Mira estas señales en tu
                documento:
              </p>
              <ul className="mt-5 space-y-3">
                {e.comoSaberQueEsTuCaso.map((s) => (
                  <li key={s} className="text-ink-700 flex gap-3 text-[15px] leading-relaxed">
                    <span
                      aria-hidden
                      className="bg-ink-300 mt-[10px] size-1.5 shrink-0 rounded-full"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Qué hacer ─────────────────────────────────────────── */}
            <section aria-labelledby="que-hacer" className="mt-12">
              <h2 id="que-hacer" className="text-display-sm text-ink-950">
                ¿Qué puedo hacer, y en qué orden?
              </h2>
              <ol className="mt-6 space-y-5">
                {e.quePuedesHacer.map((p, i) => (
                  <li key={p.titulo} className="flex gap-4">
                    <span className="bg-ink-950 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white tabular-nums">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-ink-900 text-[15.5px] font-semibold tracking-[-0.012em]">
                        {p.titulo}
                      </h3>
                      <p className="text-ink-600 mt-1.5 text-[15px] leading-relaxed">{p.detalle}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Tabla de plazos con la norma ──────────────────────── */}
            {e.datos.length > 0 && (
              <section aria-labelledby="plazos" className="mt-12">
                <h2 id="plazos" className="text-display-sm text-ink-950">
                  ¿Qué plazos se aplican a mi caso?
                </h2>
                <div className="mt-6 sm:overflow-x-auto">
                  <table className="tabla-apilable text-left sm:min-w-[560px]">
                    <caption className="sr-only">
                      Plazos aplicables y norma que los establece
                    </caption>
                    <thead>
                      <tr className="border-ink-900/10 border-b">
                        <th
                          scope="col"
                          className="text-ink-500 py-3 pe-4 text-[12.5px] font-semibold tracking-[0.02em] uppercase"
                        >
                          Qué dice
                        </th>
                        <th
                          scope="col"
                          className="text-ink-500 w-[38%] py-3 text-[12.5px] font-semibold tracking-[0.02em] uppercase"
                        >
                          Norma
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-ink-900/[.07] divide-y">
                      {e.datos.map((d) => (
                        <tr key={d.valor} className="align-top">
                          <td className="text-ink-700 py-4 pe-4 text-[14.5px] leading-relaxed">
                            {d.valor}
                          </td>
                          <td className="py-4">
                            <Fuente
                              fuente={d.fuente}
                              articulo={d.articulo}
                              verificado={d.verificado}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ── Errores típicos ───────────────────────────────────── */}
            <section aria-labelledby="errores" className="mt-12">
              <h2 id="errores" className="text-display-sm text-ink-950">
                ¿Qué errores cuestan el expediente?
              </h2>
              <ul className="mt-6 space-y-2.5">
                {e.erroresTipicos.map((err) => (
                  <li
                    key={err}
                    className="border-signal-risk/20 bg-signal-risk-soft/50 text-ink-700 flex gap-3 rounded-md border p-3.5 text-[14.5px] leading-relaxed"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="none"
                      aria-hidden
                      className="text-signal-risk mt-[3px] shrink-0"
                    >
                      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.4" />
                      <path
                        d="M8 4.8v3.9M8 11.1h.01"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── FAQ con la pregunta literal ───────────────────────── */}
            <section aria-labelledby="faq" className="mt-12">
              <h2 id="faq" className="text-display-sm text-ink-950">
                Preguntas frecuentes
              </h2>
              <div className="mt-6">
                <TramiteFaq faqs={e.faqs} />
              </div>
            </section>

            {/* ── Contratación ──────────────────────────────────────── */}
            <section aria-labelledby="contratar" className="mt-12">
              <Card className="p-6 sm:p-7">
                <h2 id="contratar" className="text-ink-950 text-[20px] font-bold tracking-[-0.02em]">
                  {e.urgente
                    ? "Si tu plazo ya está corriendo, el siguiente paso es que alguien lo mire hoy."
                    : "El siguiente paso es que alguien mire tu caso de verdad."}
                </h2>
                <p className="text-ink-600 mt-3 text-[15px] leading-relaxed">
                  Subes el documento, lo revisamos y te decimos qué es exactamente, qué plazo tienes
                  y qué cabe hacer. Sin compromiso de contratar nada después.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={e.servicio.href} arrow>
                    {e.servicio.etiqueta}
                  </Button>
                  <Button href="/diagnostico" variant="secondary">
                    Hacer el diagnóstico gratuito
                  </Button>
                </div>
              </Card>
            </section>

            <AvisoRevision
              revisado={REVISADO_POR_PROFESIONAL}
              actualizado={CONSULTADO}
              className="mt-10"
            />

            <BloqueFuentes fuentes={fuentes} consultado={CONSULTADO} />
          </div>

          {/* ── Raíl lateral ─────────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-7">
              <IndiceLateral secciones={secciones} />

              <div className="border-ink-900/10 border-t pt-6">
                <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
                  Otra situación
                </p>
                <ul className="space-y-2 text-[13.5px]">
                  {otros.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/regularizacion-2026/${o.id}`}
                        className="text-ink-500 hover:text-ink-900 transition-colors"
                      >
                        {o.comoLoVives}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BarraAccion
        href={e.servicio.href}
        etiqueta={e.urgente ? "Que lo miren hoy" : e.servicio.etiqueta}
        nota={
          e.urgente
            ? "Subes el documento y te decimos qué plazo tienes"
            : "Diagnóstico gratuito · sin registro"
        }
        secundario={{ href: "/diagnostico", etiqueta: "Diagnóstico" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: e.titulo,
              description: e.meta,
              dateModified: CONSULTADO,
              inLanguage: "es-ES",
              isAccessibleForFree: true,
              publisher: { "@type": "Organization", name: site.name, url: site.url },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: e.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />
    </>
  );
}
