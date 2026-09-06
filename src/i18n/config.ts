/**
 * CONFIGURACIÓN DE IDIOMAS
 *
 * Ocho idiomas elegidos por los corredores migratorios reales hacia España:
 * español, inglés, portugués (Brasil), francés (Magreb y África occidental),
 * italiano, árabe, ruso y chino.
 *
 * Decisiones de URL:
 *
 *  · El español se sirve en la raíz (`/tramites`), no en `/es/tramites`. Las
 *    177 URL ya publicadas e indexadas no se mueven, y el idioma mayoritario
 *    no paga el peaje de un prefijo.
 *  · El resto llevan prefijo (`/en/tramites`, `/ar/tramites`). Un idioma con
 *    URL propia es indexable; uno que depende de una cookie, no.
 *  · Ninguna redirección automática por `Accept-Language`: redirigir a alguien
 *    que ha pedido una URL concreta rompe los enlaces compartidos y confunde a
 *    los rastreadores. Se detecta el idioma para *sugerirlo*, no para imponerlo.
 */

export const LOCALES = ["es", "en", "pt", "fr", "it", "ar", "ru", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export interface LocaleMeta {
  code: Locale;
  /** Nombre en el propio idioma: es lo que un hablante reconoce. */
  native: string;
  /** Nombre en español, para el panel interno. */
  spanish: string;
  dir: "ltr" | "rtl";
  /** Etiqueta BCP 47 completa para `hreflang` y `Intl`. */
  bcp47: string;
  /** Corredor migratorio principal, para ordenar el selector con criterio. */
  note: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  es: { code: "es", native: "Español", spanish: "Español", dir: "ltr", bcp47: "es-ES", note: "Idioma oficial del procedimiento" },
  en: { code: "en", native: "English", spanish: "Inglés", dir: "ltr", bcp47: "en-GB", note: "Lengua franca internacional" },
  pt: { code: "pt", native: "Português", spanish: "Portugués", dir: "ltr", bcp47: "pt-BR", note: "Brasil y Portugal" },
  fr: { code: "fr", native: "Français", spanish: "Francés", dir: "ltr", bcp47: "fr-FR", note: "Magreb y África occidental" },
  it: { code: "it", native: "Italiano", spanish: "Italiano", dir: "ltr", bcp47: "it-IT", note: "Residentes comunitarios" },
  ar: { code: "ar", native: "العربية", spanish: "Árabe", dir: "rtl", bcp47: "ar", note: "Marruecos, Argelia y Oriente Medio" },
  ru: { code: "ru", native: "Русский", spanish: "Ruso", dir: "ltr", bcp47: "ru", note: "Europa del Este y Asia Central" },
  zh: { code: "zh", native: "中文", spanish: "Chino", dir: "ltr", bcp47: "zh-Hans", note: "China continental" },
};

/** Orden del selector: español primero, luego por volumen de corredor. */
export const LOCALE_ORDER: Locale[] = ["es", "en", "pt", "fr", "ar", "ru", "zh", "it"];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Idiomas cuyo CONTENIDO JURÍDICO está traducido y revisado, no solo la
 * interfaz. Hoy solo el español.
 *
 * La distinción no es cosmética. Una ficha de arraigo con la interfaz en ruso
 * y el cuerpo en español es, para un buscador, una página casi duplicada de la
 * española; ocho de esas por ficha canibalizan a la original y arrastran al
 * dominio entero. Mientras un idioma no esté aquí, sus páginas de contenido se
 * sirven —para que quien navega en ese idioma pueda leerlas— pero no se
 * indexan ni se declaran como alternativa `hreflang`.
 *
 * Ampliar esta lista es un acto deliberado: significa que alguien ha revisado
 * el contenido jurídico en ese idioma.
 */
export const CONTENT_LOCALES: Locale[] = ["es"];

export function hasReviewedContent(locale: Locale): boolean {
  return CONTENT_LOCALES.includes(locale);
}

/**
 * Robots para una página de contenido jurídico.
 * `follow` siempre: el enlazado interno sigue contando aunque la página no
 * entre en el índice.
 */
export function contentRobots(locale: Locale) {
  return hasReviewedContent(locale)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

/**
 * Mapa `hreflang` para una ruta. Solo declara los idiomas cuyo contenido está
 * realmente traducido: anunciar como alternativa una página que en realidad
 * está en español es una promesa falsa al rastreador.
 */
export function alternatesFor(path: string, origin: string) {
  const languages: Record<string, string> = {};
  for (const locale of CONTENT_LOCALES) {
    languages[LOCALE_META[locale].bcp47] = `${origin}${href(path, locale)}`;
  }
  languages["x-default"] = `${origin}${href(path, DEFAULT_LOCALE)}`;
  return languages;
}

/** Prefijo de ruta. El idioma por defecto no lleva ninguno. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Construye una ruta para un idioma.
 *   href("/tramites", "es") → "/tramites"
 *   href("/tramites", "ar") → "/ar/tramites"
 */
export function href(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Quita el prefijo de idioma de una ruta ya construida. */
export function stripLocale(path: string): { locale: Locale; path: string } {
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    return { locale: first, path: "/" + segments.slice(1).join("/") };
  }
  return { locale: DEFAULT_LOCALE, path };
}

/**
 * Negocia el mejor idioma a partir de la cabecera `Accept-Language`.
 * Se usa únicamente para *sugerir*, nunca para redirigir.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((x) => !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
