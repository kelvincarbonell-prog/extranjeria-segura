import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { TRAMITES } from "@/content/tramites";
import { CATEGORIES } from "@/content/taxonomy";
import { allLandings } from "@/content/seo-landings";
import { CALCULATORS } from "@/content/calculators";
import { LEGAL_DOCUMENTS } from "@/content/legal";

/**
 * Sitemap.
 *
 * Priorities reflect what actually converts and what actually helps, not a
 * uniform 0.8 on everything. Unreviewed legal templates are excluded: they
 * carry `noindex` and should not be advertised to crawlers either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/diagnostico`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/tramites`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/precios`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/como-funciona`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/calculadoras`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/recursos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/citas`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/seguridad`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/opiniones`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/empresa`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const tramiteRoutes: MetadataRoute.Sitemap = TRAMITES.map((t) => ({
    url: `${base}/tramites/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/tramites/categoria/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const landingRoutes: MetadataRoute.Sitemap = allLandings().map((l) => ({
    url: `${base}/${l.slug}`,
    lastModified: new Date(l.tramite.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.filter((c) => c.ready).map((c) => ({
    url: `${base}/calculadoras/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  // Only reviewed legal texts are listed. Templates stay out of the index.
  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCUMENTS.filter((d) => d.reviewed).map((d) => ({
    url: `${base}/legal/${d.slug}`,
    lastModified: new Date(d.updatedAt),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...staticRoutes,
    ...tramiteRoutes,
    ...categoryRoutes,
    ...landingRoutes,
    ...calculatorRoutes,
    ...legalRoutes,
  ];
}
