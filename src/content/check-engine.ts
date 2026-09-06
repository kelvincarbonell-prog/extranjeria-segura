import type { Answers } from "./check-questions";
import { TRAMITE_MAP } from "./tramites";

/**
 * ORIENTATION ENGINE.
 *
 * Deliberate design constraints:
 *  · It outputs a *fit* ("encaje preliminar"), never a probability of success.
 *    We have no statistical model, so we do not print one. No "87 %".
 *  · Every positive signal is paired with what still has to be verified.
 *  · A blocker never says "you cannot"; it says "this needs review first".
 *  · Output is deterministic and explainable: each item carries the reason
 *    that produced it, so an advisor can audit the result with the client.
 */

export type Fit = "alto" | "medio" | "explorar";

export interface Pathway {
  slug: string;
  name: string;
  fit: Fit;
  /** Ordered, human-readable signals that pushed this pathway up. */
  reasons: string[];
  /** What a professional must confirm before this becomes advice. */
  verify: string[];
  /** Weight used only for ordering. Never surfaced as a percentage. */
  score: number;
}

export interface CheckResult {
  pathways: Pathway[];
  /** Shown when nothing scores: we never leave the user with an empty screen. */
  fallbackMessage?: string;
  /** Urgent situations get routed differently. */
  urgent: boolean;
  summary: string;
}

interface Rule {
  slug: string;
  base: number;
  /** Returns [scoreDelta, reason?] — reason only when it should be shown. */
  signals: Array<(a: Answers) => [number, string?, string?] | null>;
  /** Always-shown verification items for this pathway. */
  verify: string[];
  /** Hard gate: pathway is not offered at all when this returns true. */
  excludeWhen?: (a: Answers) => boolean;
}

const has = (a: Answers, k: string, ...v: string[]) => v.includes(String(a[k] ?? ""));

const TIME_RANK: Record<string, number> = {
  menos_6m: 0,
  "6_12m": 1,
  "12_24m": 2,
  "24_36m": 3,
  mas_36m: 4,
};

const RULES: Rule[] = [
  /* -------------------------------- ARRAIGO ------------------------------- */
  {
    slug: "arraigo-sociolaboral",
    base: 0,
    excludeWhen: (a) => a.ubicacion !== "espana" || a.nacionalidad_region === "ue",
    signals: [
      (a) => (TIME_RANK[String(a.tiempo_espana)] >= 3 ? [42, "Llevas en España el tiempo que suele exigirse en esta vía"] : null),
      (a) => (TIME_RANK[String(a.tiempo_espana)] === 2 ? [26, "Estás cerca del tiempo de permanencia habitualmente exigido"] : null),
      (a) => (has(a, "trabajo", "contrato_vigente") ? [34, "Ya tienes un contrato de trabajo en España"] : null),
      (a) => (has(a, "trabajo", "oferta_firmada") ? [30, "Cuentas con una oferta de trabajo firmada"] : null),
      (a) => (has(a, "empadronamiento", "si_mas_2a") ? [16, "Tu empadronamiento respalda la permanencia continuada"] : null),
      (a) => (has(a, "empadronamiento", "si_1_2a") ? [9, "Tienes empadronamiento, aunque habrá que reforzar la prueba"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [14, "Esta vía está pensada precisamente para tu situación actual"] : null),
      (a) => (has(a, "objetivo", "regularizar", "trabajar") ? [10] : null),
      (a) => (has(a, "antecedentes", "si", "no_se") ? [-14, undefined, "Revisión del certificado de antecedentes penales y su alcance"] : null),
      (a) => (has(a, "empadronamiento", "no") ? [-18, undefined, "Cómo acreditar la permanencia sin empadronamiento"] : null),
    ],
    verify: [
      "Cómputo exacto de la permanencia continuada y de tus ausencias",
      "Condiciones del contrato: jornada, duración y retribución según convenio",
      "Certificado de antecedentes penales en vigor, legalizado y traducido",
    ],
  },
  {
    slug: "arraigo-social",
    base: 0,
    excludeWhen: (a) => a.ubicacion !== "espana" || a.nacionalidad_region === "ue",
    signals: [
      (a) => (TIME_RANK[String(a.tiempo_espana)] >= 3 ? [36, "Acumulas el tiempo de permanencia que suele exigirse"] : null),
      (a) => (TIME_RANK[String(a.tiempo_espana)] === 2 ? [22, "Te acercas al tiempo de permanencia habitual"] : null),
      (a) => (has(a, "trabajo", "ninguno") ? [16, "Es una vía que no depende de tener contrato de trabajo"] : null),
      (a) => (has(a, "vinculo_familiar", "familiar_residente") ? [18, "Tienes un familiar con residencia legal en España"] : null),
      (a) => (has(a, "empadronamiento", "si_mas_2a") ? [16, "Tu empadronamiento respalda la permanencia"] : null),
      (a) => (has(a, "recursos", "si_holgados", "si_justos") ? [10, "Puedes acreditar medios económicos"] : null),
      (a) => (has(a, "recursos", "no") ? [-12, undefined, "Cómo acreditar los medios económicos exigidos"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [10] : null),
    ],
    verify: [
      "Qué administración emite el informe de arraigo en tu comunidad y qué exige",
      "Cómputo de permanencia y de ausencias del territorio",
      "Forma concreta de acreditar los medios económicos en tu caso",
    ],
  },
  {
    slug: "arraigo-socioformativo",
    base: 0,
    excludeWhen: (a) => a.ubicacion !== "espana" || a.nacionalidad_region === "ue",
    signals: [
      (a) => (TIME_RANK[String(a.tiempo_espana)] >= 2 ? [28, "Cumples el perfil de permanencia de esta vía"] : null),
      (a) => (has(a, "formacion", "matriculado") ? [34, "Ya estás matriculado en una formación"] : null),
      (a) => (has(a, "formacion", "prevista") ? [24, "Tienes previsto matricularte en una formación"] : null),
      (a) => (has(a, "trabajo", "ninguno") ? [12, "No depende de tener contrato de trabajo"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [10] : null),
      (a) => (has(a, "formacion", "ninguna") ? [-40] : null),
    ],
    verify: [
      "Que la formación concreta esté entre las admitidas por la normativa",
      "Calendario del curso y su encaje con los plazos del expediente",
      "Compromiso de aprovechamiento y sus consecuencias",
    ],
  },
  {
    slug: "arraigo-familiar",
    base: 0,
    excludeWhen: (a) => a.ubicacion !== "espana",
    signals: [
      (a) => (has(a, "vinculo_familiar", "hijo_espanol") ? [58, "Tienes un hijo o hija de nacionalidad española"] : null),
      (a) => (has(a, "vinculo_familiar", "conyuge_espanol") ? [22, "Tu vínculo con una persona española abre esta vía o la comunitaria"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [14, "Es una vía habitual para regularizar con vínculo familiar"] : null),
    ],
    verify: [
      "Encaje exacto de tu supuesto familiar en la normativa vigente",
      "Documentación registral del vínculo y su legalización",
      "Acreditación de la convivencia o del cumplimiento de obligaciones",
    ],
  },
  {
    slug: "arraigo-segunda-oportunidad",
    base: 0,
    excludeWhen: (a) => a.ubicacion !== "espana",
    signals: [
      (a) => (has(a, "situacion", "autorizacion_caducada") ? [54, "Tuviste una autorización de residencia que ya no está vigente"] : null),
      (a) => (TIME_RANK[String(a.tiempo_espana)] >= 2 ? [14, "Mantienes permanencia en España"] : null),
    ],
    verify: [
      "Fechas exactas de vigencia de tu autorización anterior",
      "Motivo por el que se perdió y si consta resolución desfavorable",
      "Si existe expediente sancionador o de expulsión abierto",
    ],
  },

  /* ------------------------------- NÓMADAS -------------------------------- */
  {
    slug: "teletrabajo-internacional",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "trabajo", "remoto_extranjero") ? [52, "Trabajas en remoto para una empresa situada fuera de España"] : null),
      (a) => (has(a, "trabajo", "autonomo_extranjero") ? [46, "Facturas a clientes situados fuera de España"] : null),
      (a) => (has(a, "objetivo", "nomada") ? [24, "Es exactamente el objetivo que nos has indicado"] : null),
      (a) => (has(a, "recursos", "si_holgados") ? [18, "Tus ingresos apuntan a superar el umbral económico exigido"] : null),
      (a) => (has(a, "recursos", "si_justos") ? [6, undefined, "Si tus ingresos superan el umbral económico vigente"] : null),
      (a) => (has(a, "recursos", "no") ? [-30, undefined, "Acreditación del umbral económico exigido"] : null),
      (a) => (has(a, "ubicacion", "fuera") ? [8, "Puedes solicitarlo como visado desde tu país"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [-24, undefined, "Si tu situación actual permite solicitarlo desde España"] : null),
    ],
    verify: [
      "Porcentaje de tu actividad que procede de clientes fuera de España",
      "Umbral económico vigente y cómo acreditarlo con tu documentación",
      "Si te conviene el visado consular o la autorización desde España",
      "Cobertura de Seguridad Social y convenio bilateral aplicable",
    ],
  },
  {
    slug: "profesional-altamente-cualificado",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "trabajo", "oferta_firmada", "contrato_vigente") ? [30, "Cuentas con una relación laboral con una empresa española"] : null),
      (a) => (has(a, "recursos", "si_holgados") ? [16, "Tu perfil retributivo encaja con esta vía"] : null),
      (a) => (has(a, "objetivo", "trabajar") ? [14] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [-20] : null),
    ],
    verify: [
      "Encaje del puesto en la definición de profesional altamente cualificado",
      "Homologación o equivalencia de tu titulación cuando proceda",
      "Solvencia y obligaciones al día de la empresa contratante",
    ],
  },

  /* ------------------------------ RESIDENCIA ------------------------------ */
  {
    slug: "residencia-no-lucrativa",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "recursos", "si_holgados") ? [40, "Puedes acreditar medios económicos con margen"] : null),
      (a) => (has(a, "trabajo", "ninguno") && has(a, "recursos", "si_holgados") ? [16, "No necesitas trabajar en España para sostenerte"] : null),
      (a) => (has(a, "objetivo", "vivir") ? [22, "Encaja con tu objetivo de establecerte en España"] : null),
      (a) => (has(a, "ubicacion", "fuera") ? [16, "Es la vía habitual cuando se solicita desde el país de origen"] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [-34, undefined, "Esta vía no suele estar disponible desde una situación irregular"] : null),
      (a) => (has(a, "recursos", "no") ? [-40] : null),
    ],
    verify: [
      "Importe exacto exigible según el IPREM vigente y tu unidad familiar",
      "Que tu seguro médico cumpla las condiciones exigidas, sin copagos ni carencias",
      "Origen y estabilidad acreditable de tus medios económicos",
    ],
  },
  {
    slug: "residencia-larga-duracion",
    base: 0,
    signals: [
      (a) => (has(a, "anos_residencia_legal", "5_10", "mas_10") ? [50, "Acumulas el periodo de residencia legal que suele exigirse"] : null),
      (a) => (has(a, "situacion", "autorizacion_vigente") ? [18, "Mantienes una autorización en vigor"] : null),
      (a) => (has(a, "anos_residencia_legal", "menos_1", "1_2") ? [-40] : null),
    ],
    verify: [
      "Cómputo exacto de años de residencia legal y de tus ausencias",
      "Continuidad entre autorizaciones, sin lagunas",
    ],
  },

  /* ------------------------------- TRABAJO -------------------------------- */
  {
    slug: "residencia-trabajo-cuenta-ajena",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "ubicacion", "fuera") && has(a, "trabajo", "oferta_firmada") ? [48, "Tienes una oferta firmada y te encuentras fuera de España"] : null),
      (a) => (has(a, "objetivo", "trabajar") ? [18] : null),
      (a) => (has(a, "ubicacion", "espana") ? [-26] : null),
    ],
    verify: [
      "Situación nacional de empleo aplicable al puesto concreto",
      "Solvencia de la empresa y su capacidad para contratar",
      "Plazos consulares en tu país de residencia",
    ],
  },
  {
    slug: "residencia-trabajo-cuenta-propia",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "trabajo", "autonomo_espana") ? [46, "Quieres desarrollar una actividad por cuenta propia en España"] : null),
      (a) => (has(a, "recursos", "si_holgados") ? [18, "Dispones de medios para la inversión inicial"] : null),
      (a) => (has(a, "objetivo", "trabajar") ? [10] : null),
    ],
    verify: [
      "Requisitos sectoriales y licencias de tu actividad concreta",
      "Suficiencia de la inversión prevista y del plan de negocio",
    ],
  },

  /* ------------------------------- ESTUDIOS ------------------------------- */
  {
    slug: "residencia-estudios",
    base: 0,
    excludeWhen: (a) => a.nacionalidad_region === "ue",
    signals: [
      (a) => (has(a, "objetivo", "estudiar") ? [48, "Tu objetivo es cursar estudios en España"] : null),
      (a) => (has(a, "formacion", "matriculado", "prevista") ? [22, "Ya tienes formación matriculada o prevista"] : null),
      (a) => (has(a, "recursos", "si_holgados", "si_justos") ? [12, "Puedes acreditar medios para el periodo de estancia"] : null),
    ],
    verify: [
      "Que el centro y el programa estén entre los admitidos",
      "Importe económico exigible según la duración de tus estudios",
      "Si te corresponde solicitarlo en consulado o desde España",
    ],
  },
  {
    slug: "modificacion-estudios-trabajo",
    base: 0,
    signals: [
      (a) => (has(a, "situacion", "estancia_estudios") ? [46, "Estás en España con una estancia por estudios"] : null),
      (a) => (has(a, "trabajo", "contrato_vigente", "oferta_firmada") ? [30, "Dispones de contrato u oferta de trabajo"] : null),
      (a) => (has(a, "objetivo", "trabajar") ? [12] : null),
    ],
    verify: [
      "Tiempo de estancia por estudios efectivamente cumplido",
      "Ventana temporal exacta de presentación respecto a tu caducidad",
    ],
  },

  /* -------------------------------- FAMILIA ------------------------------- */
  {
    slug: "tarjeta-familiar-comunitario",
    base: 0,
    signals: [
      (a) => (has(a, "vinculo_familiar", "conyuge_espanol") ? [56, "Tu cónyuge o pareja registrada es de nacionalidad española"] : null),
      (a) => (has(a, "vinculo_familiar", "pareja_ue") ? [56, "Tu cónyuge o pareja es ciudadano de la Unión Europea"] : null),
      (a) => (has(a, "objetivo", "familia", "vivir") ? [14] : null),
      (a) => (has(a, "vinculo_familiar", "ninguno") ? [-60] : null),
    ],
    verify: [
      "Encaje exacto del vínculo en el régimen comunitario",
      "Situación del ciudadano de la Unión: trabajador, estudiante o inactivo con medios",
      "Documentación registral del vínculo y su vigencia",
    ],
  },
  {
    slug: "reagrupacion-familiar",
    base: 0,
    signals: [
      (a) => (has(a, "objetivo", "familia") ? [34, "Tu objetivo es reagrupar a tu familia"] : null),
      (a) => (has(a, "situacion", "autorizacion_vigente") ? [30, "Tienes una autorización de residencia en vigor"] : null),
      (a) => (has(a, "recursos", "si_holgados") ? [18, "Puedes acreditar medios económicos suficientes"] : null),
      (a) => (has(a, "recursos", "no") ? [-24, undefined, "Acreditación de los medios económicos exigidos por unidad familiar"] : null),
      (a) => (has(a, "vinculo_familiar", "conyuge_espanol", "pareja_ue") ? [-30] : null),
    ],
    verify: [
      "Importe económico exigible según el número de familiares",
      "Qué administración emite el informe de vivienda adecuada en tu municipio",
      "Legalización y traducción de los certificados del país de origen",
    ],
  },
  {
    slug: "certificado-registro-ue",
    base: 0,
    signals: [
      (a) => (has(a, "nacionalidad_region", "ue") ? [62, "Tu nacionalidad te sitúa en el régimen comunitario"] : null),
    ],
    verify: ["Qué supuesto acreditas: trabajo, medios propios o estudios", "Documentación exigida por tu provincia"],
  },

  /* ----------------------------- NACIONALIDAD ----------------------------- */
  {
    slug: "nacionalidad-por-residencia",
    base: 0,
    signals: [
      (a) =>
        has(a, "nacionalidad_region", "iberoamerica", "preferente") &&
        has(a, "anos_residencia_legal", "2_5", "5_10", "mas_10")
          ? [56, "Tu nacionalidad da acceso al plazo reducido y acumulas los años"]
          : null,
      (a) => (has(a, "anos_residencia_legal", "mas_10") ? [44, "Superas el plazo general de residencia legal"] : null),
      (a) =>
        has(a, "vinculo_familiar", "conyuge_espanol") && has(a, "anos_residencia_legal", "1_2", "2_5", "5_10", "mas_10")
          ? [40, "El matrimonio con persona española abre un plazo reducido"]
          : null,
      (a) => (has(a, "objetivo", "nacionalidad") ? [22] : null),
      (a) => (has(a, "anos_residencia_legal", "menos_1") ? [-40] : null),
      (a) => (has(a, "situacion", "sin_autorizacion") ? [-40, undefined, "Los periodos sin autorización no computan como residencia legal"] : null),
    ],
    verify: [
      "Plazo exacto que te aplica según tu nacionalidad y situación personal",
      "Continuidad de la residencia legal y efecto de tus ausencias",
      "Pruebas CCSE y, si procede, DELE A2, y su vigencia",
      "Legalización de tu certificado de nacimiento y antecedentes",
    ],
  },

  /* ----------------------------- RENOVACIONES ----------------------------- */
  {
    slug: "renovacion-residencia-trabajo",
    base: 0,
    signals: [
      (a) => (has(a, "objetivo", "renovar") ? [50, "Tu objetivo es renovar tu autorización actual"] : null),
      (a) => (has(a, "situacion", "autorizacion_vigente") ? [26, "Tu autorización sigue en vigor, que es el mejor momento"] : null),
      (a) => (has(a, "situacion", "autorizacion_caducada") ? [18, "Aún puede existir margen tras la caducidad"] : null),
      (a) => (has(a, "trabajo", "contrato_vigente") ? [16, "Mantienes actividad laboral"] : null),
    ],
    verify: [
      "Días efectivamente cotizados y periodos de desempleo",
      "Ventana temporal exacta de presentación en tu caso",
    ],
  },

  /* ---------------------------- REQUERIMIENTOS ---------------------------- */
  {
    slug: "requerimiento-subsanacion",
    base: 0,
    signals: [
      (a) => (has(a, "objetivo", "requerimiento") ? [70, "Nos has indicado que has recibido una comunicación de la Administración"] : null),
      (a) => (has(a, "situacion", "solicitud_tramite") ? [20, "Tienes un expediente abierto"] : null),
    ],
    verify: [
      "Fecha real de notificación y cómputo del plazo",
      "Alcance exacto de lo que te están requiriendo",
    ],
  },
  {
    slug: "recurso-alzada",
    base: 0,
    signals: [
      (a) => (has(a, "objetivo", "requerimiento") ? [34, "Si se trata de una denegación, cabe recurso"] : null),
      (a) => (has(a, "situacion", "autorizacion_caducada") ? [22, "Una resolución desfavorable puede impugnarse"] : null),
    ],
    verify: [
      "Fecha de notificación y plazo aplicable según el tipo de recurso",
      "Motivación concreta de la resolución recibida",
    ],
  },
];

/* ------------------------------------------------------------------ */

function fitFor(score: number): Fit {
  if (score >= 70) return "alto";
  if (score >= 40) return "medio";
  return "explorar";
}

export function evaluate(answers: Answers): CheckResult {
  const pathways: Pathway[] = [];

  for (const rule of RULES) {
    if (rule.excludeWhen?.(answers)) continue;

    let score = rule.base;
    const reasons: string[] = [];
    const verify = [...rule.verify];

    for (const signal of rule.signals) {
      const out = signal(answers);
      if (!out) continue;
      const [delta, reason, verifyItem] = out;
      score += delta;
      if (reason) reasons.push(reason);
      if (verifyItem && !verify.includes(verifyItem)) verify.unshift(verifyItem);
    }

    if (score < 25) continue;

    const t = TRAMITE_MAP[rule.slug];
    if (!t) continue;

    pathways.push({
      slug: rule.slug,
      name: t.shortName ?? t.name,
      fit: fitFor(score),
      reasons: reasons.slice(0, 4),
      verify: verify.slice(0, 4),
      score,
    });
  }

  pathways.sort((a, b) => b.score - a.score);
  const top = pathways.slice(0, 3);

  const urgent = answers.objetivo === "requerimiento";

  let summary: string;
  if (urgent) {
    summary =
      "Has recibido una comunicación de la Administración. Estos casos tienen plazos cortos, así que los tratamos con prioridad.";
  } else if (top.length === 0) {
    summary =
      "Con lo que nos has contado no podemos señalar una vía clara todavía. No significa que no exista: significa que tu caso necesita mirarse con más detalle.";
  } else if (top.length === 1) {
    summary = "Hemos encontrado una vía que puede encajar con tu situación.";
  } else {
    summary = `Hemos encontrado ${top.length} posibles vías para ti.`;
  }

  return {
    pathways: top,
    urgent,
    summary,
    fallbackMessage:
      top.length === 0
        ? "Te proponemos una consulta con un especialista para revisar tu caso en detalle. Si tras revisarlo no hay una vía viable, te lo diremos con claridad."
        : undefined,
  };
}

export const FIT_LABEL: Record<Fit, string> = {
  alto: "Encaje preliminar alto",
  medio: "Encaje preliminar medio",
  explorar: "Merece explorarse",
};

export const FIT_TONE: Record<Fit, "ok" | "brand" | "neutral"> = {
  alto: "ok",
  medio: "brand",
  explorar: "neutral",
};
