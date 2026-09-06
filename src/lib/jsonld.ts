import { site } from "@/content/site";
import { LOCALE_META, href, type Locale } from "@/i18n/config";

/**
 * DATOS ESTRUCTURADOS (A15).
 *
 * Un solo sitio donde se construye el JSON-LD, por la misma razón que los
 * metadatos: repartido por las páginas, cada una acababa declarando un
 * subconjunto distinto y nadie podía decir qué emitía el sitio en total.
 *
 * ─── LO QUE DELIBERADAMENTE NO SE EMITE ─────────────────────────────────
 *
 * `AggregateRating` y `Review`. No hay reseñas verificables, y el marcado de
 * valoraciones inventadas es la penalización manual más común del sector
 * legal. Cuando existan reseñas con origen enlazado se añadirán aquí y solo
 * aquí; mientras tanto, ni siquiera hay una función que pueda emitirlas por
 * accidente.
 *
 * Tampoco se emite ningún dato de la ficha de empresa —dirección, teléfono,
 * número de colegiado— porque `site.ts` los tiene a `null` a propósito. Un
 * `LegalService` con una dirección inventada es peor que un `LegalService` sin
 * dirección: lo segundo es incompleto, lo primero es falso.
 *
 * Regla general del archivo: si un campo no tiene respaldo, no se emite. Se
 * omite la clave entera, no se rellena con una cadena vacía.
 */

type Json = Record<string, unknown>;

/** Quita las claves sin valor. Un `null` en JSON-LD es una afirmación vacía. */
function limpio(obj: Json): Json {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

const ORG_ID = `${site.url}/#organizacion`;
const WEB_ID = `${site.url}/#web`;

/**
 * Organización + servicio + sitio. Va en la portada y actúa como nodo raíz al
 * que se refieren el resto de entidades mediante `@id`.
 */
export function organizacion(locale: Locale = "es") {
  const org = limpio({
    "@type": ["Organization", "LegalService"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    areaServed: { "@type": "Country", name: "España" },
    serviceType: "Servicios jurídicos y de gestión en extranjería",
    knowsLanguage: [LOCALE_META[locale].bcp47],
    // Solo se declaran si están configurados. Ver la nota de cabecera.
    taxID: site.nif,
    email: site.contact?.email,
    telephone: site.contact?.phone,
  });

  const web: Json = {
    "@type": "WebSite",
    "@id": WEB_ID,
    url: site.url,
    name: site.name,
    inLanguage: LOCALE_META[locale].bcp47,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}${href("/tramites", locale)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return { "@context": "https://schema.org", "@graph": [org, web] };
}

/** Migas de pan. Google las usa para la línea de ruta del resultado. */
export function migas(items: { nombre: string; ruta: string }[], locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nombre,
      item: `${site.url}${href(it.ruta, locale)}`,
    })),
  };
}

export function faq(preguntas: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };
}

/**
 * Artículo o guía.
 *
 * `reviewedBy` solo se emite cuando hay un revisor con nombre. Declarar que
 * algo está revisado por «el equipo editorial» no aporta nada a un evaluador
 * de calidad y, en un sector YMYL, una afirmación de revisión sin persona
 * detrás es exactamente lo que se penaliza.
 */
export function articulo({
  titulo,
  descripcion,
  ruta,
  publicado,
  modificado,
  locale = "es",
  fuentes = [],
  revisadoPor,
}: {
  titulo: string;
  descripcion: string;
  ruta: string;
  publicado?: string;
  modificado: string;
  locale?: Locale;
  /** Normas citadas, para `citation`. */
  fuentes?: string[];
  revisadoPor?: { nombre: string; credencial?: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    ...limpio({
      "@type": "Article",
      headline: titulo,
      description: descripcion,
      mainEntityOfPage: `${site.url}${href(ruta, locale)}`,
      inLanguage: LOCALE_META[locale].bcp47,
      isAccessibleForFree: true,
      datePublished: publicado,
      dateModified: modificado,
      publisher: { "@id": ORG_ID },
      author: { "@id": ORG_ID },
      citation: fuentes.length > 0 ? fuentes : undefined,
      reviewedBy: revisadoPor
        ? limpio({
            "@type": "Person",
            name: revisadoPor.nombre,
            hasCredential: revisadoPor.credencial,
          })
        : undefined,
    }),
  };
}

/** Proceso paso a paso de un trámite. */
export function comoHacerlo({
  nombre,
  descripcion,
  pasos,
}: {
  nombre: string;
  descripcion: string;
  pasos: { nombre: string; texto: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: nombre,
    description: descripcion,
    step: pasos.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.nombre,
      text: p.texto,
    })),
  };
}

/**
 * Servicio con precio.
 *
 * `price` solo cuando hay un importe cerrado. Un servicio presupuestado caso
 * a caso se declara sin precio en lugar de con un «desde» que el marcado
 * interpretaría como precio final.
 */
export function servicio({
  nombre,
  descripcion,
  precioCentimos,
  ruta,
  locale = "es",
}: {
  nombre: string;
  descripcion: string;
  precioCentimos: number | null;
  ruta: string;
  locale?: Locale;
}) {
  return {
    "@context": "https://schema.org",
    ...limpio({
      "@type": "Service",
      name: nombre,
      description: descripcion,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "España" },
      url: `${site.url}${href(ruta, locale)}`,
      offers:
        precioCentimos !== null
          ? {
              "@type": "Offer",
              price: (precioCentimos / 100).toFixed(2),
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            }
          : undefined,
    }),
  };
}

/** Catálogo de servicios, para la página de precios. */
export function catalogoServicios(
  servicios: { nombre: string; descripcion: string; precioCentimos: number | null }[],
  locale: Locale = "es",
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Servicios de ${site.name}`,
    url: `${site.url}${href("/precios", locale)}`,
    itemListElement: servicios.map((s, i) =>
      limpio({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s.nombre, description: s.descripcion },
        price: s.precioCentimos !== null ? (s.precioCentimos / 100).toFixed(2) : undefined,
        priceCurrency: s.precioCentimos !== null ? "EUR" : undefined,
      }),
    ),
  };
}

/**
 * Herramienta que se ejecuta en el navegador.
 *
 * `price: 0` es literal: las calculadoras son gratuitas y no piden registro.
 * Es de los pocos sitios donde un cero en el marcado dice exactamente la
 * verdad.
 */
export function herramienta({
  nombre,
  descripcion,
  ruta,
  locale = "es",
}: {
  nombre: string;
  descripcion: string;
  ruta: string;
  locale?: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: nombre,
    description: descripcion,
    url: `${site.url}${href(ruta, locale)}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requiere JavaScript",
    inLanguage: LOCALE_META[locale].bcp47,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": ORG_ID },
  };
}

/** Serializa para `dangerouslySetInnerHTML`, escapando el cierre de script. */
export function jsonLd(...bloques: unknown[]): string {
  const contenido = bloques.length === 1 ? bloques[0] : bloques;
  return JSON.stringify(contenido).replace(/</g, "\\u003c");
}
