/**
 * DEMO DATASET.
 *
 * Every screen that renders this data MUST show a <DemoTag/>. This is
 * fabricated data used to demonstrate the interface; it is not, and must never
 * be presented as, a real client, a real case or a real outcome.
 *
 * The names are deliberately generic ("María G.", "Especialista asignado")
 * rather than invented full identities, and no real advisor is named until the
 * business supplies real team members in `site.ts`.
 */

export type DocState = "pendiente" | "subido" | "revision" | "correcto" | "cambios" | "caducado";

export interface DemoDocument {
  id: string;
  name: string;
  state: DocState;
  /** Who has to act next. */
  owner: "cliente" | "nosotros" | "administracion";
  hint?: string;
  /** Problem detail, shown verbatim to the client when state needs action. */
  issue?: { title: string; detail: string; action: string };
  updatedAt: string;
  sizeKb?: number;
  pages?: number;
  /** Fields the document-reading layer extracted. */
  extracted?: Record<string, string>;
}

export const DOC_STATE_META: Record<
  DocState,
  { label: string; tone: "ok" | "warn" | "risk" | "neutral" | "brand"; glyph: string }
> = {
  pendiente: { label: "Pendiente", tone: "neutral", glyph: "doc" },
  subido: { label: "Subido", tone: "brand", glyph: "doc" },
  revision: { label: "En revisión", tone: "brand", glyph: "clock" },
  correcto: { label: "Validado", tone: "ok", glyph: "shield" },
  cambios: { label: "Requiere cambios", tone: "warn", glyph: "alert" },
  caducado: { label: "Caducado", tone: "risk", glyph: "alert" },
};

export const DEMO_CASE = {
  reference: "ES-2048",
  clientFirstName: "María",
  tramite: "Arraigo sociolaboral",
  tramiteSlug: "arraigo-sociolaboral",
  status: "Documentación en curso",
  progress: 68,
  openedAt: "2026-07-14",
  advisor: { name: "Especialista asignado", role: "Abogada de extranjería" },
  nextStep: {
    title: "Subir el certificado de antecedentes penales",
    detail: "Es el último documento que nos falta para poder cerrar la revisión.",
    href: "/app/documentos",
  },
  timeline: [
    { key: "diagnostico", label: "Diagnóstico", state: "done", date: "2026-07-14" },
    { key: "contratacion", label: "Contratación", state: "done", date: "2026-07-18" },
    { key: "documentacion", label: "Documentación", state: "active", date: null },
    { key: "revision", label: "Revisión jurídica", state: "todo", date: null },
    { key: "presentacion", label: "Presentación", state: "todo", date: null },
    { key: "administracion", label: "En la Administración", state: "todo", date: null },
    { key: "resolucion", label: "Resolución", state: "todo", date: null },
  ] as const,
};

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: "d1",
    name: "Pasaporte completo",
    state: "correcto",
    owner: "cliente",
    updatedAt: "2026-08-02T10:12:00Z",
    sizeKb: 2410,
    pages: 32,
    extracted: {
      Titular: "María G.",
      Documento: "Pasaporte",
      Número: "•••• 4821",
      "País emisor": "Colombia",
      Caducidad: "14/03/2031",
    },
  },
  {
    id: "d2",
    name: "Certificado de empadronamiento histórico",
    state: "correcto",
    owner: "cliente",
    updatedAt: "2026-08-04T16:40:00Z",
    sizeKb: 180,
    pages: 2,
    extracted: {
      "Tipo documental": "Empadronamiento histórico",
      Municipio: "València",
      "Fecha de expedición": "28/07/2026",
      "Antigüedad acreditada": "3 años y 2 meses",
    },
  },
  {
    id: "d3",
    name: "Contrato de trabajo",
    state: "cambios",
    owner: "cliente",
    updatedAt: "2026-08-11T09:05:00Z",
    sizeKb: 640,
    pages: 6,
    issue: {
      title: "Falta la firma de la empresa",
      detail:
        "El contrato está firmado por ti pero no por la parte empleadora. Necesitamos el documento con las dos firmas para poder presentarlo.",
      action: "Subir nueva versión",
    },
    extracted: {
      "Tipo documental": "Contrato de trabajo",
      Jornada: "40 h/semana",
      Duración: "Indefinido",
    },
  },
  {
    id: "d4",
    name: "Certificado de antecedentes penales",
    state: "pendiente",
    owner: "cliente",
    updatedAt: "2026-07-18T12:00:00Z",
    hint: "Debe estar apostillado y traducido por traductor jurado.",
  },
  {
    id: "d5",
    name: "Vida laboral",
    state: "correcto",
    owner: "cliente",
    updatedAt: "2026-08-05T11:20:00Z",
    sizeKb: 220,
    pages: 3,
  },
  {
    id: "d6",
    name: "Documentación de la empresa",
    state: "revision",
    owner: "nosotros",
    updatedAt: "2026-08-12T08:30:00Z",
    sizeKb: 1120,
    pages: 11,
  },
  {
    id: "d7",
    name: "Impreso oficial de solicitud",
    state: "pendiente",
    owner: "nosotros",
    updatedAt: "2026-07-18T12:00:00Z",
    hint: "Lo preparamos nosotros cuando el resto esté validado.",
  },
  {
    id: "d8",
    name: "Justificante de abono de tasa",
    state: "pendiente",
    owner: "nosotros",
    updatedAt: "2026-07-18T12:00:00Z",
    hint: "Se genera en el momento de la presentación.",
  },
];

export interface DemoNotification {
  id: string;
  kind: "documento" | "cita" | "expediente" | "mensaje" | "pago";
  title: string;
  body?: string;
  at: string;
  read: boolean;
  href?: string;
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "n1",
    kind: "documento",
    title: "Tu contrato necesita una corrección",
    body: "Falta la firma de la parte empleadora.",
    at: "2026-08-12T09:10:00Z",
    read: false,
    href: "/app/documentos",
  },
  {
    id: "n2",
    kind: "mensaje",
    title: "Tu especialista ha respondido",
    body: "Sobre la apostilla del certificado de antecedentes.",
    at: "2026-08-11T18:42:00Z",
    read: false,
    href: "/app/mensajes",
  },
  {
    id: "n3",
    kind: "documento",
    title: "Empadronamiento validado",
    body: "Acredita 3 años y 2 meses de permanencia.",
    at: "2026-08-04T17:02:00Z",
    read: true,
    href: "/app/documentos",
  },
  {
    id: "n4",
    kind: "cita",
    title: "Videollamada de seguimiento",
    body: "Miércoles 20 de agosto, 17:00 (CEST).",
    at: "2026-08-03T10:00:00Z",
    read: true,
    href: "/app/citas",
  },
  {
    id: "n5",
    kind: "pago",
    title: "Factura disponible",
    body: "Primer plazo de la gestión del expediente.",
    at: "2026-07-18T14:20:00Z",
    read: true,
    href: "/app/pagos",
  },
  {
    id: "n6",
    kind: "expediente",
    title: "Tu expediente se ha abierto",
    body: "Referencia ES-2048 · Arraigo sociolaboral.",
    at: "2026-07-14T09:00:00Z",
    read: true,
    href: "/app/expediente",
  },
];

export interface DemoMessage {
  id: string;
  from: "cliente" | "especialista" | "asistente";
  authorName: string;
  body: string;
  at: string;
  attachment?: { name: string; kind: "pdf" | "image" };
}

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: "m1",
    from: "asistente",
    authorName: "Asistente de Extranjería Segura",
    body: "Hola María. Soy el asistente de la plataforma. Puedo ayudarte con el estado de tu expediente, la documentación y los siguientes pasos. Para cualquier cuestión jurídica te paso con tu especialista.",
    at: "2026-07-14T09:02:00Z",
  },
  {
    id: "m2",
    from: "cliente",
    authorName: "María",
    body: "Hola. El certificado de antecedentes de Colombia, ¿tiene que estar apostillado sí o sí?",
    at: "2026-08-11T17:58:00Z",
  },
  {
    id: "m3",
    from: "asistente",
    authorName: "Asistente de Extranjería Segura",
    body: "Es una cuestión que afecta a la validez de tu expediente, así que voy a trasladar esta consulta a tu especialista para que te la confirme.",
    at: "2026-08-11T17:58:30Z",
  },
  {
    id: "m4",
    from: "especialista",
    authorName: "Tu especialista",
    body: "Hola María. Sí: el certificado tiene que venir apostillado por la autoridad competente colombiana y, si no está en español, traducido por traductor jurado. Te dejo la guía paso a paso.",
    at: "2026-08-11T18:42:00Z",
    attachment: { name: "Guia-apostilla-Colombia.pdf", kind: "pdf" },
  },
  {
    id: "m5",
    from: "cliente",
    authorName: "María",
    body: "Perfecto, lo pido esta semana. Gracias.",
    at: "2026-08-11T19:03:00Z",
  },
];

export interface DemoPayment {
  id: string;
  concept: string;
  amountCents: number;
  state: "pagado" | "pendiente" | "programado";
  date: string;
  invoice?: string;
}

export const DEMO_PAYMENTS: DemoPayment[] = [
  {
    id: "p1",
    concept: "Consulta inicial con especialista",
    amountCents: 3900,
    state: "pagado",
    date: "2026-07-14",
    invoice: "F-2026-0417",
  },
  {
    id: "p2",
    concept: "Gestión de arraigo sociolaboral · 1er plazo",
    amountCents: 22450,
    state: "pagado",
    date: "2026-07-18",
    invoice: "F-2026-0431",
  },
  {
    id: "p3",
    concept: "Gestión de arraigo sociolaboral · 2º plazo",
    amountCents: 22450,
    state: "programado",
    date: "2026-09-18",
  },
];

export interface DemoAppointment {
  id: string;
  title: string;
  at: string;
  durationMin: number;
  mode: "videollamada" | "telefono";
  language: string;
  with: string;
  state: "confirmada" | "propuesta" | "pasada";
}

export const DEMO_APPOINTMENTS: DemoAppointment[] = [
  {
    id: "a1",
    title: "Seguimiento de documentación",
    at: "2026-08-20T15:00:00Z",
    durationMin: 30,
    mode: "videollamada",
    language: "Español",
    with: "Tu especialista",
    state: "confirmada",
  },
  {
    id: "a2",
    title: "Consulta inicial",
    at: "2026-07-14T09:00:00Z",
    durationMin: 45,
    mode: "videollamada",
    language: "Español",
    with: "Tu especialista",
    state: "pasada",
  },
];

/* ---------------- Admin / CRM demo data ---------------- */

export const PIPELINE_STAGES = [
  { id: "lead", label: "Lead" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "consulta", label: "Consulta" },
  { id: "contratado", label: "Contratado" },
  { id: "documentacion", label: "Documentación" },
  { id: "revision", label: "Revisión" },
  { id: "listo", label: "Listo para presentar" },
  { id: "presentado", label: "Presentado" },
  { id: "requerimiento", label: "Requerimiento" },
  { id: "resolucion", label: "Resolución" },
  { id: "archivado", label: "Archivado" },
] as const;

export type StageId = (typeof PIPELINE_STAGES)[number]["id"];

export interface DemoCaseCard {
  id: string;
  reference: string;
  client: string;
  tramite: string;
  stage: StageId;
  owner: string;
  /**
   * Aquí había un `slaDays: number | null` —los días que faltaban para el
   * próximo plazo, escritos a mano—. No está: los días se derivan de los
   * hechos del expediente con `plazoPrincipal()`. Un número guardado deja de
   * ser cierto al día siguiente, y tres pantallas leyéndolo por su cuenta
   * daban tres respuestas distintas a la misma pregunta.
   */
  valueCents: number;
  updatedAt: string;
  flags?: string[];
}

export const DEMO_PIPELINE: DemoCaseCard[] = [
  { id: "c1", reference: "ES-2048", client: "María G.", tramite: "Arraigo sociolaboral", stage: "documentacion", owner: "A. Ruiz", valueCents: 44900, updatedAt: "2026-08-12" },
  { id: "c2", reference: "ES-2051", client: "Ibrahim K.", tramite: "Nacionalidad por residencia", stage: "revision", owner: "A. Ruiz", valueCents: 39900, updatedAt: "2026-08-12" },
  { id: "c3", reference: "ES-2044", client: "Sofia B.", tramite: "Nómada digital", stage: "listo", owner: "L. Ortega", valueCents: 74900, updatedAt: "2026-08-11" },
  { id: "c4", reference: "ES-2039", client: "Carlos M.", tramite: "Reagrupación familiar", stage: "presentado", owner: "L. Ortega", valueCents: 54900, updatedAt: "2026-08-08" },
  { id: "c5", reference: "ES-2033", client: "Wei L.", tramite: "Renovación de residencia", stage: "requerimiento", owner: "A. Ruiz", valueCents: 29900, updatedAt: "2026-08-12", flags: ["Plazo vencido"] },
  { id: "c6", reference: "ES-2055", client: "Ana P.", tramite: "Arraigo social", stage: "contratado", owner: "Sin asignar", valueCents: 44900, updatedAt: "2026-08-12" },
  { id: "c7", reference: "ES-2057", client: "Youssef A.", tramite: "Arraigo sociolaboral", stage: "consulta", owner: "Comercial", valueCents: 44900, updatedAt: "2026-08-12" },
  { id: "c8", reference: "ES-2058", client: "Elena V.", tramite: "Nacionalidad por residencia", stage: "diagnostico", owner: "Comercial", valueCents: 39900, updatedAt: "2026-08-12" },
  { id: "c9", reference: "ES-2059", client: "Diego R.", tramite: "Nómada digital", stage: "lead", owner: "Sin asignar", valueCents: 74900, updatedAt: "2026-08-12" },
  { id: "c10", reference: "ES-2060", client: "Fatou N.", tramite: "Protección internacional", stage: "lead", owner: "Sin asignar", valueCents: 0, updatedAt: "2026-08-12" },
  { id: "c11", reference: "ES-2021", client: "Paulo S.", tramite: "Nómada digital", stage: "resolucion", owner: "L. Ortega", valueCents: 74900, updatedAt: "2026-08-05" },
  { id: "c12", reference: "ES-2018", client: "Nadia H.", tramite: "Arraigo familiar", stage: "archivado", owner: "A. Ruiz", valueCents: 39900, updatedAt: "2026-07-30" },
];

/* ------------------------------------------------------------------ *
 * VIGILANCIA DE PLAZOS
 *
 * Los expedientes se describen por HECHOS con fecha, no por un contador de
 * días. Un hecho —«se notificó el requerimiento el 2 de septiembre»— no
 * caduca; los días que quedan se calculan al mirarlos, contra la norma que
 * fija el plazo.
 *
 * Están los doce, incluidos los que no tienen ningún plazo vivo. Estaban solo
 * siete, y los cinco ausentes no salían como «sin plazo»: salían como si no
 * existieran. En un panel de vigilancia son dos cosas muy distintas —«nada
 * corre en este expediente» y «este expediente no está vigilado»— y la
 * segunda es la que pierde casos.
 * ------------------------------------------------------------------ */

import type { Expediente } from "@/lib/vigilancia";

export const DEMO_EXPEDIENTES: Expediente[] = [
  {
    id: "c5",
    referencia: "ES-2033",
    cliente: "Wei L.",
    tramite: "Renovación de residencia",
    responsable: "A. Ruiz",
    hechos: [{ tipo: "requerimiento-notificado", fecha: "2026-08-26" }],
  },
  {
    id: "c2",
    referencia: "ES-2051",
    cliente: "Ibrahim K.",
    tramite: "Nacionalidad por residencia",
    responsable: "A. Ruiz",
    hechos: [{ tipo: "requerimiento-notificado", fecha: "2026-09-02", diasConcedidos: 10 }],
  },
  {
    id: "c4",
    referencia: "ES-2039",
    cliente: "Carlos M.",
    tramite: "Reagrupación familiar",
    responsable: "L. Ortega",
    hechos: [{ tipo: "presentacion", fecha: "2026-06-30" }],
  },
  {
    id: "c11",
    referencia: "ES-2021",
    cliente: "Paulo S.",
    tramite: "Nómada digital",
    responsable: "L. Ortega",
    hechos: [
      { tipo: "presentacion", fecha: "2026-05-20" },
      { tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "denegatoria" },
    ],
  },
  {
    id: "c1",
    referencia: "ES-2048",
    cliente: "María G.",
    tramite: "Arraigo sociolaboral",
    responsable: "A. Ruiz",
    hechos: [
      {
        tipo: "caducidad-documento",
        fecha: "2026-09-20",
        etiqueta: "Certificado de antecedentes penales",
      },
    ],
  },
  {
    id: "c3",
    referencia: "ES-2044",
    cliente: "Sofia B.",
    tramite: "Nómada digital",
    responsable: "L. Ortega",
    hechos: [{ tipo: "caducidad-tarjeta", fecha: "2026-11-15" }],
  },
  {
    id: "c6",
    referencia: "ES-2055",
    cliente: "Ana P.",
    tramite: "Arraigo social",
    responsable: "Sin asignar",
    hechos: [],
  },

  /* Los cinco sin plazo vivo. Un lead al que todavía no se le ha presentado
     nada no tiene ningún reloj administrativo corriendo, y no hay que
     inventarle uno: la urgencia comercial de contestarle es otra cosa, se
     mide de otra forma y mezclarla con los plazos de la Administración es
     justo lo que vuelve inservible un panel de plazos. */
  {
    id: "c7",
    referencia: "ES-2057",
    cliente: "Youssef A.",
    tramite: "Arraigo sociolaboral",
    responsable: "Comercial",
    hechos: [],
  },
  {
    id: "c8",
    referencia: "ES-2058",
    cliente: "Elena V.",
    tramite: "Nacionalidad por residencia",
    responsable: "Comercial",
    hechos: [],
  },
  {
    id: "c9",
    referencia: "ES-2059",
    cliente: "Diego R.",
    tramite: "Nómada digital",
    responsable: "Sin asignar",
    hechos: [],
  },
  {
    id: "c10",
    referencia: "ES-2060",
    cliente: "Fatou N.",
    tramite: "Protección internacional",
    responsable: "Sin asignar",
    hechos: [],
  },
  {
    id: "c12",
    referencia: "ES-2018",
    cliente: "Nadia H.",
    tramite: "Arraigo familiar",
    responsable: "A. Ruiz",
    hechos: [],
  },
];
