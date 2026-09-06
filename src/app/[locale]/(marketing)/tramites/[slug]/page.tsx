import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { jsonLd, servicio, comoHacerlo, faq, articulo, migas } from "@/lib/jsonld";
import { OFFICIAL_SOURCES } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { TRAMITES, getTramite } from "@/content/tramites";
import { CATEGORY_MAP } from "@/content/taxonomy";
import { CITIES, NATIONALITIES } from "@/content/geo";
import { TramitePage } from "@/components/marketing/TramitePage";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRAMITES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = getTramite(slug);
  if (!t) return {};
  return pageMetadata({
    locale,
    path: `/tramites/${t.slug}`,
    title: t.name,
    description: t.metaDescription,
    type: "article",
    modifiedTime: t.updatedAt,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const t = getTramite(slug);
  if (!t) notFound();

  const category = CATEGORY_MAP[t.category];
  const related = t.related.map(getTramite).filter(Boolean);
  const cities = (t.seoCities ?? [])
    .map((c) => CITIES.find((x) => x.slug === c))
    .filter((c): c is (typeof CITIES)[number] => Boolean(c));
  const nationalities = (t.seoNationalities ?? [])
    .map((n) => NATIONALITIES.find((x) => x.slug === n))
    .filter((n): n is (typeof NATIONALITIES)[number] => Boolean(n));

  return (
    <>
      <TramitePage
        tramite={t}
        category={category}
        related={related}
        cities={cities}
        nationalities={nationalities}
      />

      {/* Cobertura completa para una ficha: el servicio con su precio, el
          proceso paso a paso, las preguntas frecuentes, la guía en sí y la
          ruta de migas. Sin AggregateRating: ver la nota en lib/jsonld.ts. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            servicio({
              nombre: t.name,
              descripcion: t.metaDescription,
              precioCentimos: t.feeFromCents,
              ruta: `/tramites/${t.slug}`,
              locale,
            }),
            comoHacerlo({
              nombre: `Cómo tramitar ${t.name.toLowerCase()}`,
              descripcion: t.metaDescription,
              pasos: t.process.map((paso) => ({ nombre: paso.title, texto: paso.detail })),
            }),
            faq(t.faqs),
            articulo({
              titulo: t.name,
              descripcion: t.metaDescription,
              ruta: `/tramites/${t.slug}`,
              modificado: t.updatedAt,
              locale,
              fuentes: (t.sources ?? []).map((k) => OFFICIAL_SOURCES[k]?.label ?? k),
            }),
            migas(
              [
                { nombre: "Trámites", ruta: "/tramites" },
                { nombre: category.label, ruta: `/tramites/categoria/${category.id}` },
                { nombre: t.name, ruta: `/tramites/${t.slug}` },
              ],
              locale,
            ),
          ),
        }}
      />
    </>
  );
}
