/**
 * IMMIGRATION CHECK — question graph.
 *
 * One question per screen, conditional edges, no dead ends. The graph is
 * data, not code: the wizard renders whatever this file describes, so the
 * legal team can extend it without touching React.
 */

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue | undefined>;

export interface Option {
  value: string;
  label: string;
  hint?: string;
  /** Geometric glyph key. Never an emoji in the wizard itself. */
  glyph?: string;
}

export interface Question {
  id: string;
  /** Short label for the progress rail. */
  rail: string;
  title: string;
  help?: string;
  type: "single" | "multi";
  options: Option[];
  /** Question is asked only when this returns true. */
  when?: (a: Answers) => boolean;
  /** Marks a question whose answer is never stored server-side by default. */
  sensitive?: boolean;
}

const isIn = (a: Answers, key: string, ...vals: string[]) => vals.includes(String(a[key] ?? ""));
const inSpain = (a: Answers) => a.ubicacion === "espana";

export const QUESTIONS: Question[] = [
  {
    id: "objetivo",
    rail: "Objetivo",
    title: "¿Qué quieres conseguir?",
    help: "Elige lo que más se parezca a tu situación. Podrás ajustarlo después.",
    type: "single",
    options: [
      { value: "vivir", label: "Vivir en España", hint: "Establecerme de forma estable", glyph: "door" },
      { value: "trabajar", label: "Trabajar en España", hint: "Por cuenta ajena o propia", glyph: "briefcase" },
      { value: "nomada", label: "Trabajar en remoto desde España", hint: "Para una empresa o clientes de fuera", glyph: "signal" },
      { value: "estudiar", label: "Estudiar", hint: "Universidad, máster o formación", glyph: "cap" },
      { value: "familia", label: "Traer o acompañar a mi familia", hint: "Reagrupación o vínculo familiar", glyph: "family" },
      { value: "regularizar", label: "Regularizar mi situación", hint: "Ya vivo aquí y quiero papeles", glyph: "roots" },
      { value: "renovar", label: "Renovar mi permiso", hint: "Mi tarjeta caduca o ha caducado", glyph: "cycle" },
      { value: "nacionalidad", label: "Obtener la nacionalidad española", glyph: "passport" },
      { value: "requerimiento", label: "He recibido un requerimiento o denegación", hint: "Necesito responder", glyph: "alert" },
      { value: "no_se", label: "No sé qué necesito", hint: "Ayúdame a averiguarlo", glyph: "help" },
    ],
  },
  {
    id: "nacionalidad_region",
    rail: "Nacionalidad",
    title: "¿Cuál es tu nacionalidad actual?",
    help: "Tu nacionalidad determina qué régimen jurídico te aplica y los plazos.",
    type: "single",
    options: [
      { value: "ue", label: "Un país de la UE, EEE o Suiza", hint: "Se te aplica el régimen comunitario" },
      { value: "iberoamerica", label: "Un país iberoamericano", hint: "Incluye Latinoamérica" },
      { value: "preferente", label: "Filipinas, Guinea Ecuatorial, Portugal o Andorra" },
      { value: "resto", label: "Otro país", hint: "Régimen general de extranjería" },
    ],
  },
  {
    id: "ubicacion",
    rail: "Dónde estás",
    title: "¿Dónde te encuentras ahora?",
    type: "single",
    options: [
      { value: "espana", label: "En España", hint: "Actualmente resido o me encuentro aquí" },
      { value: "fuera", label: "Fuera de España", hint: "Voy a solicitarlo desde mi país" },
    ],
  },
  {
    id: "tiempo_espana",
    rail: "Tiempo aquí",
    title: "¿Cuánto tiempo llevas viviendo en España de forma continuada?",
    help: "Cuenta desde tu última entrada, sin ausencias largas.",
    type: "single",
    when: inSpain,
    options: [
      { value: "menos_6m", label: "Menos de 6 meses" },
      { value: "6_12m", label: "Entre 6 meses y 1 año" },
      { value: "12_24m", label: "Entre 1 y 2 años" },
      { value: "24_36m", label: "Entre 2 y 3 años" },
      { value: "mas_36m", label: "Más de 3 años" },
    ],
  },
  {
    id: "situacion",
    rail: "Situación",
    title: "¿Cuál es tu situación administrativa hoy?",
    help: "Sé sincero. Esto solo sirve para orientarte mejor y es confidencial.",
    type: "single",
    when: inSpain,
    sensitive: true,
    options: [
      { value: "sin_autorizacion", label: "Sin autorización de residencia" },
      { value: "estancia_estudios", label: "Estancia por estudios en vigor" },
      { value: "autorizacion_vigente", label: "Autorización de residencia en vigor" },
      { value: "autorizacion_caducada", label: "Autorización caducada o denegada" },
      { value: "visado_vigente", label: "Visado o estancia en vigor" },
      { value: "solicitud_tramite", label: "Tengo una solicitud en trámite" },
    ],
  },
  {
    id: "empadronamiento",
    rail: "Padrón",
    title: "¿Estás empadronado en España?",
    help: "El empadronamiento es una de las pruebas principales de permanencia.",
    type: "single",
    when: inSpain,
    options: [
      { value: "si_mas_2a", label: "Sí, desde hace más de 2 años" },
      { value: "si_1_2a", label: "Sí, desde hace entre 1 y 2 años" },
      { value: "si_menos_1a", label: "Sí, desde hace menos de 1 año" },
      { value: "no", label: "No estoy empadronado" },
      { value: "no_se", label: "No estoy seguro" },
    ],
  },
  {
    id: "vinculo_familiar",
    rail: "Familia",
    title: "¿Tienes algún vínculo familiar en España?",
    type: "single",
    options: [
      { value: "conyuge_espanol", label: "Cónyuge o pareja registrada española" },
      { value: "pareja_ue", label: "Cónyuge o pareja de un país de la UE" },
      { value: "hijo_espanol", label: "Hijo o hija de nacionalidad española" },
      { value: "familiar_residente", label: "Familiar directo con residencia legal" },
      { value: "ninguno", label: "Ninguno de los anteriores" },
    ],
  },
  {
    id: "trabajo",
    rail: "Trabajo",
    title: "¿Cuál es tu situación laboral?",
    type: "single",
    options: [
      { value: "contrato_vigente", label: "Tengo un contrato de trabajo en España" },
      { value: "oferta_firmada", label: "Tengo una oferta de trabajo firmada" },
      { value: "remoto_extranjero", label: "Trabajo en remoto para una empresa de fuera de España" },
      { value: "autonomo_extranjero", label: "Soy autónomo con clientes fuera de España" },
      { value: "autonomo_espana", label: "Quiero trabajar por cuenta propia en España" },
      { value: "ninguno", label: "No tengo trabajo ni oferta ahora mismo" },
    ],
  },
  {
    id: "formacion",
    rail: "Formación",
    title: "¿Estás matriculado o vas a matricularte en una formación?",
    help: "Formación reglada, certificado de profesionalidad o estudios oficiales.",
    type: "single",
    when: (a) => isIn(a, "objetivo", "regularizar", "estudiar", "no_se"),
    options: [
      { value: "matriculado", label: "Sí, ya estoy matriculado" },
      { value: "prevista", label: "Tengo pensado matricularme" },
      { value: "ninguna", label: "No" },
    ],
  },
  {
    id: "anos_residencia_legal",
    rail: "Años legales",
    title: "¿Cuántos años llevas con residencia legal en España?",
    help: "Solo cuentan los periodos con autorización o tarjeta en vigor.",
    type: "single",
    when: (a) => isIn(a, "objetivo", "nacionalidad", "renovar", "no_se") || a.situacion === "autorizacion_vigente",
    options: [
      { value: "menos_1", label: "Menos de 1 año" },
      { value: "1_2", label: "Entre 1 y 2 años" },
      { value: "2_5", label: "Entre 2 y 5 años" },
      { value: "5_10", label: "Entre 5 y 10 años" },
      { value: "mas_10", label: "Más de 10 años" },
    ],
  },
  {
    id: "recursos",
    rail: "Recursos",
    title: "¿Puedes acreditar medios económicos estables?",
    help: "Nóminas, ahorros, rentas, pensiones o facturación como autónomo.",
    type: "single",
    options: [
      { value: "si_holgados", label: "Sí, con margen" },
      { value: "si_justos", label: "Sí, pero justos" },
      { value: "no", label: "No en este momento" },
      { value: "no_se", label: "No sé qué se me exige" },
    ],
  },
  {
    id: "antecedentes",
    rail: "Antecedentes",
    title: "¿Tienes antecedentes penales en algún país?",
    help: "Tener antecedentes no cierra automáticamente todas las vías, pero cambia el análisis.",
    type: "single",
    sensitive: true,
    options: [
      { value: "ninguno", label: "No, ninguno" },
      { value: "si", label: "Sí" },
      { value: "no_se", label: "No estoy seguro" },
    ],
  },
];

/** Questions that actually apply to the current answers. */
export function activeQuestions(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => !q.when || q.when(answers));
}
