import type { Metadata } from "next";
import { Link } from "@/components/ui/Link";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import {
  ESTADOS,
  HECHOS,
  FECHAS,
  LO_ESENCIAL_HUB,
  CONSULTADO,
  REVISADO_POR_PROFESIONAL,
} from "@/content/regularizacion-2026";
import { LoEsencial } from "@/components/contenido/LoEsencial";
import { Plazo } from "@/components/contenido/Plazo";
import { Fuente, BloqueFuentes } from "@/components/contenido/Fuente";
import { AvisoRevision } from "@/components/contenido/AvisoRevision";
import { Button } from "@/components/ui/Button";
import { Card, Badge, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/regularizacion-2026",
    title: "Regularización extraordinaria 2026: en qué punto está tu expediente",
    description:
      "Subsanación hasta el 30 de septiembre, silencio a los tres meses y plazos de recurso. Elige el estado de tu expediente y te decimos qué hacer y con qué plazo.",
    type: "article",
    modifiedTime: CONSULTADO,
  });
}

/**
 * HUB DE LA REGULARIZACIÓN EXTRAORDINARIA (A1).
 *
 * La página no está organizada por normativa sino por **estado de expediente**,
 * porque es así como llega el usuario: no busca «disposición adicional 21ª»,
 * busca «no me han contestado». El selector de estado es la unidad de valor de
 * la página, y va antes que cualquier explicación.
 */
export default function RegularizacionHub() {
  const fuentes = [
    ...Object.values(HECHOS).map((d) => ({
      fuente: d.fuente,
      articulo: d.articulo,
      verificado: d.verificado,
    })),
  ];

  return (
    <>
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
                <Link href="/recursos" className="hover:text-ink-700 tap inline-block transition-colors">
                  Centro de conocimiento
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-600">Regularización 2026</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <Badge tone="warn" dot className="mb-5">
              Plazo de subsanación abierto
            </Badge>
            <h1 className="text-display-lg text-ink-950 text-balance">
              Regularización extraordinaria 2026:
              <br className="hidden sm:block" /> en qué punto está tu expediente
            </h1>
            <p className="text-ink-600 mt-5 max-w-2xl text-[17px] leading-relaxed text-pretty">
              Se presentaron más de un millón de solicitudes y la fase que empieza ahora no es la de
              presentar, es la de seguir: distinguir una admisión de un requerimiento, saber cuándo
              vence el silencio y decidir qué cabe hacer. Elige tu situación y te decimos qué hacer
              y con qué plazo.
            </p>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_320px]">
            <LoEsencial puntos={LO_ESENCIAL_HUB} actualizado={CONSULTADO} />
            <Plazo
              fecha={FECHAS.finSubsanacion}
              etiqueta="Cierre del plazo de subsanación"
              detalle="para quien presentó en plazo"
            />
          </div>

          <AvisoRevision revisado={REVISADO_POR_PROFESIONAL} className="mt-5" />
        </div>
      </section>

      {/* ── Selector de estado: la unidad de valor de la página ───────── */}
      <section className="py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Elige tu situación"
            title="¿Qué ha pasado con tu solicitud?"
            lede="Cada camino tiene plazos distintos y algunos corren desde el día en que te notificaron. Si no estás seguro de cuál es el tuyo, empieza por el primero que se parezca."
            id="estados"
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESTADOS.map((e, i) => (
              <li key={e.id}>
                <Reveal delay={i * 0.04}>
                  <Link
                    href={`/regularizacion-2026/${e.id}`}
                    className="group block h-full focus-visible:outline-none"
                  >
                    <Card className="hover:border-brand-300/60 h-full p-5 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-ink-900 group-hover:text-brand-700 text-[16px] leading-snug font-semibold tracking-[-0.015em] transition-colors">
                          {e.comoLoVives}
                        </h3>
                        {e.urgente && (
                          <Badge tone="risk" className="shrink-0">
                            Plazo
                          </Badge>
                        )}
                      </div>
                      <p className="text-ink-400 mt-1.5 text-[12.5px] tracking-[0.01em] uppercase">
                        {e.nombreTecnico}
                      </p>
                      <p className="text-ink-600 mt-3 text-[14px] leading-relaxed">
                        {e.loEsencial[0]}
                      </p>
                      <span className="text-brand-700 mt-4 inline-flex items-center gap-1 text-[13.5px] font-medium">
                        Ver qué hacer
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
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Button href="/calculadoras/plazos-regularizacion" variant="secondary" arrow>
              Calcular mis plazos exactos
            </Button>
          </div>
        </div>
      </section>

      {/* ── Los hechos, en tabla ──────────────────────────────────────── */}
      <section className="border-ink-900/[.07] border-t py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Los hechos"
            title="Qué dice la norma y qué dicen los datos"
            lede="Cada fila lleva su fuente. Las que aún no hemos contrastado contra el texto consolidado están marcadas como tales."
            id="hechos"
          />

          <div className="mt-8 sm:overflow-x-auto">
            <table className="tabla-apilable text-left sm:min-w-[620px]">
              <caption className="sr-only">
                Datos del procedimiento de regularización extraordinaria de 2026 con su fuente
              </caption>
              <thead>
                <tr className="border-ink-900/10 border-b">
                  <th scope="col" className="text-ink-500 w-[30%] py-3 pe-4 text-[12.5px] font-semibold tracking-[0.02em] uppercase">
                    Dato
                  </th>
                  <th scope="col" className="text-ink-500 py-3 text-[12.5px] font-semibold tracking-[0.02em] uppercase">
                    Detalle y fuente
                  </th>
                </tr>
              </thead>
              <tbody className="divide-ink-900/[.07] divide-y">
                {[
                  ["Norma habilitante", HECHOS.normaHabilitante],
                  ["Plazo de solicitud", HECHOS.plazoSolicitud],
                  ["Volumen", HECHOS.volumen],
                  ["Subsanación", HECHOS.subsanacion],
                  ["Resolución y silencio", HECHOS.plazoResolucion],
                  ["Recurso de reposición", HECHOS.reposicionExpresa],
                  ["Contencioso-administrativo", HECHOS.contenciosoExpreso],
                  ["Tasa de concesión", HECHOS.sinTasaConcesion],
                ].map(([label, dato]) => {
                  const d = dato as (typeof HECHOS)[string];
                  return (
                    <tr key={label as string} className="align-top">
                      <th
                        scope="row"
                        className="text-ink-800 py-4 pe-4 text-[14px] font-semibold"
                      >
                        {label as string}
                      </th>
                      <td className="py-4">
                        <p className="text-ink-700 text-[14.5px] leading-relaxed">{d.valor}</p>
                        <Fuente
                          fuente={d.fuente}
                          articulo={d.articulo}
                          verificado={d.verificado}
                          className="mt-1.5"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <section className="border-ink-900/[.07] border-t py-14 sm:py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="text-display-sm text-ink-950">
              Si tienes un plazo corriendo, no esperes al lunes.
            </h2>
            <p className="text-ink-600 mt-4 text-[16px] leading-relaxed">
              Los requerimientos y las denegaciones tienen plazos cortos que empiezan el día de la
              notificación. Súbenos el documento y lo miramos el mismo día: te decimos qué es, qué
              plazo tienes y qué cabe hacer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/diagnostico" arrow>
                Comprobar mi situación
              </Button>
              <Button href="/precios#revision" variant="secondary">
                Revisión documental · 79 €
              </Button>
            </div>
          </div>

          <BloqueFuentes fuentes={fuentes} consultado={CONSULTADO} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Regularización extraordinaria 2026: en qué punto está tu expediente",
            dateModified: CONSULTADO,
            inLanguage: "es-ES",
            isAccessibleForFree: true,
            publisher: { "@type": "Organization", name: site.name, url: site.url },
            about: { "@type": "Thing", name: "Regularización extraordinaria de extranjería 2026" },
          }),
        }}
      />
    </>
  );
}
