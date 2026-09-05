/**
 * SINGLE SOURCE OF TRUTH for anything that is a business fact.
 *
 * RULE OF THE PROJECT: this file must never contain an invented figure.
 * Every metric, review, name or credential is either
 *   (a) a real, verifiable value the business supplies, or
 *   (b) `null` — and the UI renders the honest empty state.
 * Components must handle `null` gracefully; they must never fall back to a
 * plausible-looking number.
 */

export const site = {
  name: "Extranjería Segura",
  legalName: null as string | null, // ← razón social, pendiente de configurar
  nif: null as string | null,
  claim: "Tu vida en España empieza aquí.",
  claimAlt: "Tu extranjería, resuelta.",
  description:
    "Descubre en menos de 3 minutos qué permiso necesitas, qué documentación debes presentar y cómo podemos gestionarlo por ti de principio a fin.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://extranjeria-segura.vercel.app",
  locale: "es-ES",
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },
  /**
   * Trust metrics. Left null on purpose.
   * Fill only with figures that can be evidenced if a client, a competitor
   * or the Colegio de Abogados asks for the source.
   */
  metrics: {
    casesManaged: null as number | null,
    avgResponseHours: null as number | null,
    googleRating: null as number | null,
    googleReviewCount: null as number | null,
    nationalitiesServed: null as number | null,
  },
  /**
   * Legal review is attributed to the firm, not to an invented individual.
   * Set `reviewer` to a real, colegiado professional when available.
   */
  review: {
    reviewer: null as { name: string; role: string; barId?: string } | null,
    orgFallback: "Equipo jurídico de Extranjería Segura",
    lastReviewedAt: "2026-09-05",
  },
  /** Feature flags — the platform ships with integrations stubbed, not faked. */
  features: {
    stripe: false,
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    aiDocumentReview: false,
    videoCalls: false,
    eSignature: false,
  },
} as const;

/** Attribution string for any legally-reviewed page. */
export function reviewedBy() {
  return site.review.reviewer
    ? `${site.review.reviewer.name} · ${site.review.reviewer.role}`
    : site.review.orgFallback;
}

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */
export const primaryNav = [
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Trámites", href: "/tramites", mega: true },
  { label: "Precios", href: "/precios" },
  { label: "Opiniones", href: "/opiniones" },
  { label: "Recursos", href: "/recursos" },
] as const;

export const footerNav = {
  Servicios: [
    { label: "Diagnóstico de Extranjería", href: "/diagnostico" },
    { label: "Revisión documental", href: "/precios#revision" },
    { label: "Gestión integral de expediente", href: "/como-funciona" },
    { label: "Recursos y requerimientos", href: "/tramites/categoria/recursos" },
    { label: "Consulta con especialista", href: "/precios#consulta" },
  ],
  Trámites: [
    { label: "Arraigo", href: "/tramites/categoria/arraigo" },
    { label: "Nacionalidad española", href: "/tramites/categoria/nacionalidad" },
    { label: "Nómada digital", href: "/tramites/categoria/nomadas" },
    { label: "Reagrupación familiar", href: "/tramites/categoria/familia" },
    { label: "Renovaciones", href: "/tramites/categoria/renovaciones" },
    { label: "Ver todos los trámites", href: "/tramites" },
  ],
  Recursos: [
    { label: "Centro de conocimiento", href: "/recursos" },
    { label: "Calculadoras", href: "/calculadoras" },
    { label: "Calculadora Schengen 90/180", href: "/calculadoras/schengen-90-180" },
    { label: "Tiempo para la nacionalidad", href: "/calculadoras/tiempo-nacionalidad" },
    { label: "Actualizaciones normativas", href: "/recursos?categoria=normativa" },
  ],
  Empresa: [
    { label: "Sobre nosotros", href: "/empresa" },
    { label: "Metodología", href: "/como-funciona" },
    { label: "Seguridad", href: "/seguridad" },
    { label: "Contacto", href: "/contacto" },
  ],
  Legal: [
    { label: "Aviso legal", href: "/legal/aviso-legal" },
    { label: "Política de privacidad", href: "/legal/privacidad" },
    { label: "Política de cookies", href: "/legal/cookies" },
    { label: "Condiciones de contratación", href: "/legal/condiciones" },
    { label: "Protección de datos", href: "/legal/proteccion-datos" },
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Languages — the platform is architected multilingual from day one.
 * `ready: false` locales are routable and fall back to Spanish content
 * rather than shipping machine-translated legal text.
 * ------------------------------------------------------------------ */
export const locales = [
  { code: "es", label: "Español", native: "Español", dir: "ltr", ready: true },
  // `ready` means "the legal content exists and has been reviewed in this
  // locale", not "the switcher lists it". Nothing but Spanish qualifies today,
  // and claiming otherwise would be the same fabrication we refuse elsewhere.
  { code: "en", label: "Inglés", native: "English", dir: "ltr", ready: false },
  { code: "pt", label: "Portugués", native: "Português", dir: "ltr", ready: false },
  { code: "fr", label: "Francés", native: "Français", dir: "ltr", ready: false },
  { code: "it", label: "Italiano", native: "Italiano", dir: "ltr", ready: false },
  { code: "ar", label: "Árabe", native: "العربية", dir: "rtl", ready: false },
  { code: "ru", label: "Ruso", native: "Русский", dir: "ltr", ready: false },
  { code: "zh", label: "Chino", native: "中文", dir: "ltr", ready: false },
] as const;

export type LocaleCode = (typeof locales)[number]["code"];
export const defaultLocale: LocaleCode = "es";

/* ------------------------------------------------------------------ *
 * Official sources. Every legal claim on the site must cite one of these.
 * ------------------------------------------------------------------ */
export const OFFICIAL_SOURCES = {
  boe: { label: "BOE — Boletín Oficial del Estado", url: "https://www.boe.es" },
  inclusion: {
    label: "Ministerio de Inclusión, Seguridad Social y Migraciones",
    url: "https://www.inclusion.gob.es",
  },
  extranjeria: {
    label: "Portal de Inmigración — Ministerio de Inclusión",
    url: "https://www.inclusion.gob.es/web/migraciones/inicio",
  },
  mjusticia: { label: "Ministerio de Justicia", url: "https://www.mjusticia.gob.es" },
  exteriores: {
    label: "Ministerio de Asuntos Exteriores, UE y Cooperación",
    url: "https://www.exteriores.gob.es",
  },
  policia: { label: "Policía Nacional — Extranjería", url: "https://www.policia.es" },
  sede: {
    label: "Sede Electrónica de las Administraciones Públicas",
    url: "https://sede.administracion.gob.es",
  },
  mercurio: { label: "Sede electrónica Mercurio — Autorizaciones", url: "https://sede.administracionespublicas.gob.es" },
} as const;

export type SourceKey = keyof typeof OFFICIAL_SOURCES;
