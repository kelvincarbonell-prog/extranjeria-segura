/**
 * VERIFIED REVIEWS.
 *
 * This array is intentionally empty and must stay that way until the business
 * supplies reviews that can be traced to a public source.
 *
 * To publish a review, every field below is mandatory — including `sourceUrl`,
 * which must resolve to somewhere a visitor can independently read it. If you
 * cannot fill `sourceUrl`, the review does not go on the site.
 *
 * `<SocialProof/>` switches from the verification-policy layout to the review
 * grid automatically as soon as this array has entries.
 */

export interface Review {
  id: string;
  author: string;
  /** Country of origin, e.g. "Colombia". */
  origin: string;
  /** City in Spain where the case was handled. */
  city: string;
  /** Trámite name, matching a slug in the catalogue where possible. */
  tramite: string;
  body: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Public, checkable source. Mandatory. */
  sourceUrl: string;
  source: "google" | "video" | "caso-documentado";
  publishedAt: string;
  /** Set when the person consented to be identified by full name. */
  consentToPublishName: boolean;
}

export const REVIEWS: Review[] = [];

/** Optional: wire to Google Places to keep this in sync automatically. */
export const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? null;
