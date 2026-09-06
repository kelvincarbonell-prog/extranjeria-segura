import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { TRAMITES } from "@/content/tramites";
import { CATEGORIES } from "@/content/taxonomy";
import { allLandings } from "@/content/seo-landings";
import { CALCULATORS } from "@/content/calculators";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { ESTADOS, CONSULTADO } from "@/content/regularizacion-2026";

/**
 * Sitemap.
 *
 * Tres decisiones que lo separan de un sitemap generado por defecto:
 *
 * · Solo español. Las otras siete lenguas tienen la interfaz traducida pero el
 *   contenido jurídico todavía en español, y llevan `noindex`. Anunciar en el
 *   sitemap una URL que se declara no indexable es una contradicción que hay
 *   que resolver en un sitio, y este es el sitio.
 *
 * · `lastModified` real, no la fecha del build. Un sitemap que dice que las
 *   177 páginas cambiaron hoy —porque hoy se desplegó un cambio de CSS— deja
 *   de ser una señal y pasa a ser ruido: el rastreador aprende a ignorarlo.
 *   Cada grupo usa la fecha que de verdad tiene: la revisión de la ficha, la
 *   consulta de las fuentes, la actualización del texto legal.
 *
 * · Las prioridades reflejan qué convierte y qué ayuda, no un 0,8 uniforme.
 *
 * Las plantillas legales sin revisar quedan fuera: llevan `noindex` y no deben
 * anunciarse tampoco aquí.
 */

/** Fecha de la última revisión editorial de las páginas que no tienen fecha
 *  propia. Se actualiza a mano cuando se revisa el contenido, no en cada
 *  despliegue: eso es justamente lo que la convierte en una señal. */
const REVISION_EDITORIAL = "2026-09-06";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const editorial = new Date(REVISION_EDITORIAL);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: editorial, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/regularizacion-2026`,
      lastModified: new Date(CONSULTADO),
      changeFrequency: "weekly",
      priority: 0.97,
    },
    { url: `${base}/diagnostico`, lastModified: editorial, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/tramites`, lastModified: editorial, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/precios`, lastModified: editorial, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/como-funciona`, lastModified: editorial, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/calculadoras`, lastModified: editorial, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/recursos`, lastModified: editorial, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/citas`, lastModified: editorial, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/seguridad`, lastModified: editorial, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/opiniones`, lastModified: editorial, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/empresa`, lastModified: editorial, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contacto`, lastModified: editorial, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Prioridad alta: son las páginas con un plazo real corriendo encima.
  const regularizacionRoutes: MetadataRoute.Sitemap = ESTADOS.map((e) => ({
    url: `${base}/regularizacion-2026/${e.id}`,
    lastModified: new Date(CONSULTADO),
    changeFrequency: "weekly",
    priority: e.urgente ? 0.95 : 0.85,
  }));

  const tramiteRoutes: MetadataRoute.Sitemap = TRAMITES.map((t) => ({
    url: `${base}/tramites/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/tramites/categoria/${c.id}`,
    lastModified: editorial,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /**
   * Solo las programáticas que superan el umbral de diferenciación, el mismo
   * que decide su `robots` en la propia página. Si un día se añade una ciudad
   * sin notas propias, deja de anunciarse aquí sin que nadie tenga que
   * acordarse de quitarla.
   */
  const landingRoutes: MetadataRoute.Sitemap = allLandings()
    .filter((l) => (l.city?.notes ?? l.nationality?.notes ?? []).length >= 2)
    .map((l) => ({
      url: `${base}/${l.slug}`,
      lastModified: new Date(l.tramite.updatedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.filter((c) => c.ready).map((c) => ({
    url: `${base}/calculadoras/${c.slug}`,
    lastModified: editorial,
    changeFrequency: "monthly",
    priority: c.slug === "plazos-regularizacion" ? 0.9 : 0.65,
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCUMENTS.filter((d) => d.reviewed).map((d) => ({
    url: `${base}/legal/${d.slug}`,
    lastModified: new Date(d.updatedAt),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...staticRoutes,
    ...regularizacionRoutes,
    ...tramiteRoutes,
    ...categoryRoutes,
    ...landingRoutes,
    ...calculatorRoutes,
    ...legalRoutes,
  ];
}
