import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRAMITES, getTramite } from "@/content/tramites";
import { CATEGORY_MAP } from "@/content/taxonomy";
import { site } from "@/content/site";
import { CITIES, NATIONALITIES } from "@/content/geo";
import { TramitePage } from "@/components/marketing/TramitePage";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRAMITES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTramite(slug);
  if (!t) return {};
  return {
    title: t.name,
    description: t.metaDescription,
    alternates: { canonical: `/tramites/${t.slug}` },
    openGraph: {
      title: `${t.name} · ${site.name}`,
      description: t.metaDescription,
      url: `/tramites/${t.slug}`,
      type: "article",
      modifiedTime: t.updatedAt,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: t.name,
                description: t.metaDescription,
                serviceType: category.label,
                areaServed: { "@type": "Country", name: "España" },
                provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
                ...(t.feeFromCents !== null && {
                  offers: {
                    "@type": "Offer",
                    price: (t.feeFromCents / 100).toFixed(2),
                    priceCurrency: "EUR",
                    description: "Honorarios profesionales desde. No incluye tasas administrativas.",
                  },
                }),
              },
              {
                "@type": "FAQPage",
                mainEntity: t.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Trámites", item: `${site.url}/tramites` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: category.label,
                    item: `${site.url}/tramites/categoria/${category.id}`,
                  },
                  { "@type": "ListItem", position: 3, name: t.name },
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}
