/**
 * FREE TOOLS.
 *
 * These compute real answers, in the browser, with no account and no data
 * leaving the device. They exist because they are genuinely useful — the
 * Schengen 90/180 rule in particular is something people get wrong and then
 * lose a permit over — and because a tool that works is a better acquisition
 * argument than a landing page that claims one does.
 *
 * Each carries the same boundary as the rest of the product: arithmetic is
 * not legal advice.
 */

export interface CalculatorMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  glyph: string;
  /** Which trámite the result should hand off to. */
  relatedTramite?: string;
  ready: boolean;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "schengen-90-180",
    name: "Calculadora Schengen 90/180",
    tagline: "Cuántos días de estancia te quedan, contados bien.",
    description:
      "La regla de los 90 días en cualquier periodo de 180 no se cuenta por semestres naturales: es una ventana móvil que se recalcula cada día. Esta calculadora aplica la ventana móvil real sobre tus entradas y salidas.",
    glyph: "globe",
    ready: true,
  },
  {
    slug: "tiempo-nacionalidad",
    name: "Tiempo para la nacionalidad",
    tagline: "Cuándo podrás solicitar la nacionalidad española por residencia.",
    description:
      "Calcula la fecha a partir de la cual acumulas el periodo de residencia legal exigido según tu nacionalidad, y cuánto te falta.",
    glyph: "passport",
    relatedTramite: "nacionalidad-por-residencia",
    ready: true,
  },
  {
    slug: "medios-economicos",
    name: "Medios económicos exigibles",
    tagline: "Cuánto tienes que acreditar según el IPREM y tu unidad familiar.",
    description:
      "Varias vías exigen acreditar medios económicos referenciados al IPREM. Esta herramienta calcula el importe orientativo según el número de personas a tu cargo.",
    glyph: "stamp",
    relatedTramite: "residencia-no-lucrativa",
    ready: true,
  },
  {
    slug: "fechas-renovacion",
    name: "Ventana de renovación",
    tagline: "Cuándo puedes y cuándo debes presentar tu renovación.",
    description:
      "Presentar fuera de la ventana temporal es uno de los errores más caros en extranjería. Introduce la fecha de caducidad de tu tarjeta y te decimos el periodo en el que debes presentar.",
    glyph: "cycle",
    relatedTramite: "renovacion-residencia-trabajo",
    ready: true,
  },
];

export const CALCULATOR_MAP = Object.fromEntries(CALCULATORS.map((c) => [c.slug, c]));

/* ------------------------------------------------------------------ *
 * SCHENGEN 90/180
 * ------------------------------------------------------------------ */

export interface Stay {
  from: string; // ISO date
  to: string; // ISO date
}

const DAY = 86_400_000;

function toUTC(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Days used within the 180-day window ending on `reference`, inclusive.
 * Both entry and exit days count as days of presence — the rule the Commission
 * calculator applies, and the one people most often get wrong.
 */
export function schengenDaysUsed(stays: Stay[], reference: string) {
  const ref = toUTC(reference);
  const windowStart = ref - 179 * DAY;

  let used = 0;
  for (const stay of stays) {
    if (!stay.from || !stay.to) continue;
    const from = Math.max(toUTC(stay.from), windowStart);
    const to = Math.min(toUTC(stay.to), ref);
    if (to < from) continue;
    used += Math.round((to - from) / DAY) + 1;
  }
  return used;
}

export function schengenSummary(stays: Stay[], reference: string) {
  const used = schengenDaysUsed(stays, reference);
  const remaining = Math.max(0, 90 - used);

  // The earliest date on which at least one more day becomes available:
  // the day after the oldest counted day rolls out of the window.
  let nextFreeDay: string | null = null;
  if (remaining === 0) {
    const ref = toUTC(reference);
    for (let i = 1; i <= 180; i++) {
      const probe = ref + i * DAY;
      const probeIso = new Date(probe).toISOString().slice(0, 10);
      if (schengenDaysUsed(stays, probeIso) < 90) {
        nextFreeDay = probeIso;
        break;
      }
    }
  }

  return {
    used,
    remaining,
    windowStart: new Date(toUTC(reference) - 179 * DAY).toISOString().slice(0, 10),
    reference,
    nextFreeDay,
    overstay: used > 90,
  };
}

/* ------------------------------------------------------------------ *
 * NATIONALITY TIMELINE
 * ------------------------------------------------------------------ */

export type NationalityTrack = "general" | "reducido2" | "reducido1";

export const NATIONALITY_TRACKS: Record<
  NationalityTrack,
  { years: number; label: string; detail: string }
> = {
  general: {
    years: 10,
    label: "Plazo general",
    detail: "Diez años de residencia legal, continuada e inmediatamente anterior a la solicitud.",
  },
  reducido2: {
    years: 2,
    label: "Plazo reducido de dos años",
    detail:
      "Nacionales de países iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial, Portugal y personas de origen sefardí.",
  },
  reducido1: {
    years: 1,
    label: "Plazo reducido de un año",
    detail:
      "Supuestos como el matrimonio con persona española, nacimiento en territorio español u otros previstos en el Código Civil.",
  },
};

export function nationalityEligibility(startIso: string, track: NationalityTrack, today = new Date()) {
  const { years } = NATIONALITY_TRACKS[track];
  const start = new Date(startIso);
  const eligible = new Date(start);
  eligible.setFullYear(eligible.getFullYear() + years);

  const msLeft = eligible.getTime() - today.getTime();
  const daysLeft = Math.ceil(msLeft / DAY);
  const totalDays = Math.round((eligible.getTime() - start.getTime()) / DAY);
  const elapsed = Math.max(0, Math.min(totalDays, totalDays - daysLeft));

  return {
    eligibleFrom: eligible.toISOString().slice(0, 10),
    daysLeft: Math.max(0, daysLeft),
    alreadyEligible: daysLeft <= 0,
    progress: Math.round((elapsed / totalDays) * 100),
    years,
  };
}

/* ------------------------------------------------------------------ *
 * ECONOMIC MEANS
 *
 * IPREM is set annually by the Ley de Presupuestos. It is stored as a single
 * configurable value rather than hard-coded across the app, and the UI states
 * the year it corresponds to so an outdated figure is visible rather than
 * silently wrong.
 * ------------------------------------------------------------------ */

export const IPREM = {
  year: 2025,
  /** Monthly IPREM in cents. Update annually — see CONTENIDO-PENDIENTE-REVISION.md */
  monthlyCents: 60000,
  /** Multiplier applied to the main applicant, by route. */
  routes: {
    "no-lucrativa": { holder: 4, perDependant: 1, label: "Residencia no lucrativa" },
    arraigo: { holder: 1, perDependant: 0.75, label: "Arraigo (orientativo)" },
    reagrupacion: { holder: 1.5, perDependant: 0.5, label: "Reagrupación familiar" },
  },
} as const;

export type MeansRoute = keyof typeof IPREM.routes;

export function economicMeans(route: MeansRoute, dependants: number) {
  const cfg = IPREM.routes[route];
  const monthlyCents = Math.round(
    IPREM.monthlyCents * (cfg.holder + cfg.perDependant * Math.max(0, dependants)),
  );
  return {
    monthlyCents,
    annualCents: monthlyCents * 12,
    label: cfg.label,
    iprem: IPREM,
  };
}

/* ------------------------------------------------------------------ *
 * RENEWAL WINDOW
 * ------------------------------------------------------------------ */

export function renewalWindow(expiryIso: string, today = new Date()) {
  const expiry = new Date(expiryIso);

  // Presentation is admitted from 60 days before expiry and up to 90 days
  // after. Both ends are checked by us against the current wording before any
  // filing — the calculator gives you the dates to work with, not a guarantee.
  const opens = new Date(expiry);
  opens.setDate(opens.getDate() - 60);
  const closes = new Date(expiry);
  closes.setDate(closes.getDate() + 90);

  const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / DAY);
  const inWindow = today >= opens && today <= closes;

  return {
    opens: opens.toISOString().slice(0, 10),
    expiry: expiryIso,
    closes: closes.toISOString().slice(0, 10),
    daysToExpiry,
    inWindow,
    expired: daysToExpiry < 0,
    stillInGrace: daysToExpiry < 0 && today <= closes,
  };
}
