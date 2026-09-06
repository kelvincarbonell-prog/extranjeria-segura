import type { Metadata } from "next";
import { site } from "@/content/site";
import {
  CONTENT_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  hasReviewedContent,
  href,
  type Locale,
} from "@/i18n/config";

/**
 * METADATOS DE PÁGINA — un solo sitio donde se construyen.
 *
 * El problema que resuelve es concreto y se detectó midiendo el HTML servido:
 * cuando una página define `alternates`, Next **reemplaza** el objeto entero
 * del layout en lugar de fusionarlo. Resultado: `/ar` se auto-declaraba
 * canónica hacia la portada española y no emitía ni un `hreflang`. Lo mismo
 * pasaba con `openGraph`: las páginas de categoría heredaban el `og:url` de la
 * portada.
 *
 * Con un helper, cada página declara lo que la distingue —ruta, título,
 * descripción— y todo lo derivable —canónica, alternativas de idioma, Open
 * Graph, Twitter, robots— se calcula una vez y de la misma forma.
 *
 * Regla de indexación: solo se indexan los idiomas cuyo contenido está
 * revisado (`CONTENT_LOCALES`). Hoy, la interfaz está traducida a ocho idiomas
 * pero el cuerpo jurídico sigue en español; indexar las ocho versiones sería
 * ofrecer al buscador ocho páginas casi idénticas y canibalizar la original.
 * Se sirven para quien navega, no se indexan hasta que estén traducidas.
 */

export interface PageMetaOptions {
  locale: Locale;
  /** Ruta sin prefijo de idioma: "/tramites/arraigo-social". */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * Fuerza `noindex` con independencia del idioma. Para páginas que no deben
   * estar en el índice por sí mismas (área privada, panel, resultados).
   */
  noindex?: boolean;
  /** Añade `%s · Extranjería Segura` al título de la pestaña. Por defecto sí. */
  absoluteTitle?: boolean;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  absoluteTitle = false,
}: PageMetaOptions): Metadata {
  const canonicalPath = href(path, locale);
  const url = `${site.url}${canonicalPath === "/" ? "" : canonicalPath}`;

  // Solo se anuncian como alternativa los idiomas realmente traducidos.
  // Prometer `hreflang="ru"` sobre una página en español es una promesa falsa.
  const languages: Record<string, string> = {};
  for (const l of CONTENT_LOCALES) {
    const p = href(path, l);
    languages[LOCALE_META[l].bcp47] = `${site.url}${p === "/" ? "" : p}`;
  }
  const defaultPath = href(path, DEFAULT_LOCALE);
  languages["x-default"] = `${site.url}${defaultPath === "/" ? "" : defaultPath}`;

  const index = !noindex && hasReviewedContent(locale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: canonicalPath, languages },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
      : // `follow` siempre: aunque la página no entre en el índice, el enlazado
        // interno que contiene sigue transmitiendo señales.
        { index: false, follow: true },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: `${title} · ${site.name}`,
      description,
      locale: LOCALE_META[locale].bcp47.replace("-", "_"),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    // El bug que señaló la auditoría: `twitter:title` valía «Extranjería
    // Segura» en todas las URL. Aquí es, por construcción, el de la página.
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
    },
  };
}

/**
 * Metadatos de una superficie privada (área de cliente, panel interno).
 * Nunca se indexa, en ningún idioma, y no declara alternativas de idioma:
 * no es contenido público.
 */
export function privateMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}
