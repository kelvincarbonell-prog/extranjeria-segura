import { TRAMITES, getTramite } from "./tramites";
import { CITIES, NATIONALITIES, CITY_MAP, NATIONALITY_MAP } from "./geo";
import type { Tramite } from "./taxonomy";

/**
 * PROGRAMMATIC LANDING RESOLVER.
 *
 * URLs are the ones a person would actually type or search:
 *   /arraigo-sociolaboral-madrid
 *   /nacionalidad-por-residencia-colombianos
 *
 * A combination only exists when BOTH sides carry their own data — the
 * trámite has declared it in `seoCities` / `seoNationalities`, and the city
 * or nationality has real notes in geo.ts. `dynamicParams = false` on the
 * route means anything else is a genuine 404 rather than a thin auto-page.
 */

export type LandingKind = "city" | "nationality";

export interface Landing {
  slug: string;
  kind: LandingKind;
  tramite: Tramite;
  city?: (typeof CITIES)[number];
  nationality?: (typeof NATIONALITIES)[number];
}

export function allLandings(): Landing[] {
  const out: Landing[] = [];

  for (const t of TRAMITES) {
    for (const citySlug of t.seoCities ?? []) {
      const city = CITY_MAP[citySlug];
      if (!city) continue;
      out.push({ slug: `${t.slug}-${city.slug}`, kind: "city", tramite: t, city });
    }
    for (const natSlug of t.seoNationalities ?? []) {
      const nationality = NATIONALITY_MAP[natSlug];
      if (!nationality) continue;
      out.push({
        slug: `${t.slug}-${nationality.slug}`,
        kind: "nationality",
        tramite: t,
        nationality,
      });
    }
  }

  return out;
}

const INDEX = new Map<string, Landing>();

export function resolveLanding(slug: string): Landing | null {
  if (INDEX.size === 0) {
    for (const l of allLandings()) INDEX.set(l.slug, l);
  }
  return INDEX.get(slug) ?? null;
}

/** Landing pages that point at the same trámite, for internal linking. */
export function siblingLandings(landing: Landing, limit = 8): Landing[] {
  return allLandings()
    .filter((l) => l.tramite.slug === landing.tramite.slug && l.slug !== landing.slug)
    .slice(0, limit);
}

/** Same city or nationality, different trámite. */
export function crossLandings(landing: Landing, limit = 6): Landing[] {
  const key = landing.city?.slug ?? landing.nationality?.slug;
  if (!key) return [];
  return allLandings()
    .filter(
      (l) =>
        (l.city?.slug === key || l.nationality?.slug === key) &&
        l.tramite.slug !== landing.tramite.slug,
    )
    .slice(0, limit);
}

export function landingTitle(l: Landing): string {
  const name = l.tramite.shortName ?? l.tramite.name;
  return l.kind === "city" ? `${name} ${l.city!.inCity}` : `${name} para ${l.nationality!.demonym}`;
}

export function landingH1(l: Landing): string {
  const name = l.tramite.shortName ?? l.tramite.name;
  return l.kind === "city"
    ? `${name} ${l.city!.inCity}`
    : `${name} para ${l.nationality!.demonym}`;
}

export function landingDescription(l: Landing): string {
  if (l.kind === "city") {
    return `${l.tramite.shortName ?? l.tramite.name} ${l.city!.inCity}: qué cambia en ${l.city!.community}, quién emite los informes, requisitos, documentación y plazos. Gestión 100% online.`.slice(
      0,
      158,
    );
  }
  return `${l.tramite.shortName ?? l.tramite.name} para ${l.nationality!.demonym}: legalización de documentos de ${l.nationality!.country}, plazos, requisitos y documentación. Gestión 100% online.`.slice(
    0,
    158,
  );
}

export { getTramite };
