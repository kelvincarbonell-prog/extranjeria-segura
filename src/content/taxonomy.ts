import type { SourceKey } from "./site";

export type CategoryId =
  | "residencia"
  | "trabajo"
  | "arraigo"
  | "estudios"
  | "familia"
  | "nacionalidad"
  | "nomadas"
  | "renovaciones"
  | "recursos"
  | "requerimientos"
  | "proteccion"
  | "comunitarios";

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  blurb: string;
  /** Geometric glyph key rendered by <TramiteGlyph/>. No emoji, no clipart. */
  glyph: GlyphKey;
}

export type GlyphKey =
  | "door"
  | "briefcase"
  | "roots"
  | "cap"
  | "family"
  | "passport"
  | "signal"
  | "cycle"
  | "scales"
  | "alert"
  | "shelter"
  | "stars";

export const CATEGORIES: Category[] = [
  { id: "residencia", label: "Residencia", short: "Residencia", glyph: "door", blurb: "Autorizaciones para vivir en España de forma estable." },
  { id: "trabajo", label: "Trabajo", short: "Trabajo", glyph: "briefcase", blurb: "Permisos por cuenta ajena, propia y traslados." },
  { id: "arraigo", label: "Arraigo", short: "Arraigo", glyph: "roots", blurb: "Vías para regularizar una situación ya existente en España." },
  { id: "estudios", label: "Estudios", short: "Estudios", glyph: "cap", blurb: "Estancia por estudios, prácticas y búsqueda de empleo." },
  { id: "familia", label: "Familia", short: "Familia", glyph: "family", blurb: "Reagrupación y residencia de familiares." },
  { id: "nacionalidad", label: "Nacionalidad", short: "Nacionalidad", glyph: "passport", blurb: "Nacionalidad española por residencia y por opción." },
  { id: "nomadas", label: "Nómadas digitales", short: "Nómadas", glyph: "signal", blurb: "Teletrabajo internacional y perfiles altamente cualificados." },
  { id: "renovaciones", label: "Renovaciones", short: "Renovaciones", glyph: "cycle", blurb: "Renovar, modificar o prorrogar tu autorización." },
  { id: "recursos", label: "Recursos", short: "Recursos", glyph: "scales", blurb: "Recursos administrativos y vía contencioso-administrativa." },
  { id: "requerimientos", label: "Requerimientos", short: "Requerimientos", glyph: "alert", blurb: "Subsanación de expedientes y respuesta a la Administración." },
  { id: "proteccion", label: "Protección internacional", short: "Protección", glyph: "shelter", blurb: "Asilo, protección subsidiaria y razones humanitarias." },
  { id: "comunitarios", label: "Comunitarios", short: "Comunitarios", glyph: "stars", blurb: "Régimen de la Unión Europea y familiares de comunitario." },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;

/* ------------------------------------------------------------------ */

export interface FaqItem {
  q: string;
  a: string;
}

export interface ProcessStep {
  title: string;
  detail: string;
  actor: "cliente" | "extranjeria-segura" | "administracion";
  /** Orientative duration label, never a promise. */
  duration?: string;
}

export interface DocumentRequirement {
  name: string;
  note?: string;
  /** Whether the client obtains it, or we prepare it. */
  source: "cliente" | "nosotros" | "administracion";
  optional?: boolean;
}

export interface Tramite {
  slug: string;
  name: string;
  /** Short name for chips and breadcrumbs. */
  shortName?: string;
  category: CategoryId;
  /** Secondary categories the trámite also belongs to. */
  alsoIn?: CategoryId[];
  tagline: string;
  /** SEO meta description, 140–160 chars. */
  metaDescription: string;
  whatItIs: string;
  forWho: string[];
  requirements: string[];
  needsVerification: string[];
  documents: DocumentRequirement[];
  process: ProcessStep[];
  /** Honorarios in cents. `null` = quoted after diagnosis. */
  feeFromCents: number | null;
  /** Orientative administrative timeframe. Always framed as orientative. */
  timeframe: string;
  /** Administrative fee (tasa) — variable, so we describe rather than quote. */
  adminFeesNote: string;
  faqs: FaqItem[];
  sources: SourceKey[];
  /** ISO date of last legal review of this page's content. */
  updatedAt: string;
  /** Set true until the firm's lawyer signs the content off. */
  pendingLegalReview: boolean;
  related: string[];
  /** Cities/countries this trámite generates programmatic landing pages for. */
  seoCities?: string[];
  seoNationalities?: string[];
}
