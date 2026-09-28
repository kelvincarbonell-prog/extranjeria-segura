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
  /** Artículo del nombre, para poder escribir «sube el certificado». */
  articulo: "el" | "la";
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

/* ------------------------------------------------------------------ *
 * FECHAS DEL EXPEDIENTE DE DEMOSTRACIÓN DEL CLIENTE
 *
 * Eran fijas —julio y agosto de 2026— y la demostración se pudría sola: a
 * finales de septiembre la «próxima cita» del 20 de agosto ya había pasado,
 * el segundo pago «programado» para el 18 de septiembre también, y la
 * última actividad del expediente era de hacía siete semanas. Un área de
 * cliente que enseña un caso abandonado demuestra justo lo contrario de lo
 * que viene a demostrar.
 *
 * Ahora todo se sitúa respecto a hoy y la historia conserva su forma: se
 * abrió hace unos dos meses y medio, hubo movimiento esta semana y la
 * siguiente cita está por delante.
 * ------------------------------------------------------------------ */

/** Un instante `dias` después de hoy (negativo: antes), a una hora UTC. */
function momento(dias: number, hora = "10:00"): string {
  const d = new Date();
  const [h, m] = hora.split(":").map(Number);
  d.setUTCHours(h, m, 0, 0);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString();
}

/** Solo el día, en ISO. */
function fechaDemo(dias: number): string {
  return momento(dias).slice(0, 10);
}

/** «28/07/2026», como lo imprime un certificado español. */
function fechaCertificado(dias: number): string {
  const [a, m, d] = fechaDemo(dias).split("-");
  return `${d}/${m}/${a}`;
}

const APERTURA = -75;
/**
 * Un día laborable a `dias` de hoy: si cae en fin de semana, el lunes.
 * Una videollamada con el despacho un sábado es la clase de detalle que hace
 * que una demostración deje de parecer real.
 */
function laborable(dias: number): number {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dias);
  const dow = d.getUTCDay();
  return dias + (dow === 6 ? 2 : dow === 0 ? 1 : 0);
}

const CITA_SEGUIMIENTO = momento(laborable(5), "15:00");

/** «Viernes 3 de octubre, 17:00 (hora de España)», para el aviso de la cita. */
function fechaCita(iso: string): string {
  const texto = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(iso));
  return `${texto.charAt(0).toUpperCase()}${texto.slice(1)} (hora de España).`;
}

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: "d1",
    articulo: "el",
    name: "Pasaporte completo",
    state: "correcto",
    owner: "cliente",
    updatedAt: momento(-58, "10:12"),
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
    articulo: "el",
    name: "Certificado de empadronamiento histórico",
    state: "correcto",
    owner: "cliente",
    updatedAt: momento(-56, "16:40"),
    sizeKb: 180,
    pages: 2,
    extracted: {
      "Tipo documental": "Empadronamiento histórico",
      Municipio: "València",
      "Fecha de expedición": fechaCertificado(-60),
      "Antigüedad acreditada": "3 años y 2 meses",
    },
  },
  {
    id: "d3",
    articulo: "el",
    name: "Contrato de trabajo",
    state: "cambios",
    owner: "cliente",
    updatedAt: momento(-3, "09:05"),
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
    articulo: "el",
    name: "Certificado de antecedentes penales",
    state: "pendiente",
    owner: "cliente",
    updatedAt: momento(APERTURA + 4, "12:00"),
    hint: "Debe estar apostillado y traducido por traductor jurado.",
  },
  {
    id: "d5",
    articulo: "la",
    name: "Vida laboral",
    state: "correcto",
    owner: "cliente",
    updatedAt: momento(-55, "11:20"),
    sizeKb: 220,
    pages: 3,
  },
  {
    id: "d6",
    articulo: "la",
    name: "Documentación de la empresa",
    state: "revision",
    owner: "nosotros",
    updatedAt: momento(-2, "08:30"),
    sizeKb: 1120,
    pages: 11,
  },
  {
    id: "d7",
    articulo: "el",
    name: "Impreso oficial de solicitud",
    state: "pendiente",
    owner: "nosotros",
    updatedAt: momento(APERTURA + 4, "12:00"),
    hint: "Lo preparamos nosotros cuando el resto esté validado.",
  },
  {
    id: "d8",
    articulo: "el",
    name: "Justificante de abono de tasa",
    state: "pendiente",
    owner: "nosotros",
    updatedAt: momento(APERTURA + 4, "12:00"),
    hint: "Se genera en el momento de la presentación.",
  },
];

const CASO_BASE = {
  reference: "ES-2048",
  clientFirstName: "María",
  tramite: "Arraigo sociolaboral",
  tramiteSlug: "arraigo-sociolaboral",
  status: "Documentación en curso",
  openedAt: fechaDemo(APERTURA),
  advisor: { name: "Especialista asignado", role: "Abogada de extranjería" },
  timeline: [
    { key: "diagnostico", label: "Diagnóstico", state: "done", date: fechaDemo(APERTURA) },
    { key: "contratacion", label: "Contratación", state: "done", date: fechaDemo(APERTURA + 4) },
    { key: "documentacion", label: "Documentación", state: "active", date: null },
    { key: "revision", label: "Revisión jurídica", state: "todo", date: null },
    { key: "presentacion", label: "Presentación", state: "todo", date: null },
    { key: "administracion", label: "En la Administración", state: "todo", date: null },
    { key: "resolucion", label: "Resolución", state: "todo", date: null },
  ] as const,
};

/**
 * Lo que el cliente tiene que hacer, derivado de sus documentos.
 *
 * Estaba escrito a mano: «Subir el certificado de antecedentes penales. Es el
 * último documento que nos falta». No era verdad —el contrato también tenía
 * que corregirse, y estaba justo debajo con su aviso—, y la tarjeta de al
 * lado decía «4 pendientes de ti» contando el impreso y la tasa, que prepara
 * el despacho. Tres números distintos para la misma pregunta en la misma
 * pantalla, en el producto que promete no dar sorpresas.
 *
 * Ahora la frase, el contador y la lista salen del mismo filtro.
 */
export function pendientesDelClienteDemo(docs: DemoDocument[]): DemoDocument[] {
  return docs
    .filter(
      (d) =>
        d.owner === "cliente" &&
        (d.state === "pendiente" || d.state === "cambios" || d.state === "caducado"),
    )
    // Primero lo que no existe todavía: pedir una apostilla lleva semanas;
    // corregir una firma, un día.
    .sort((a, b) => Number(b.state === "pendiente") - Number(a.state === "pendiente"));
}

function siguientePasoCliente(docs: DemoDocument[]) {
  const [primero, ...resto] = pendientesDelClienteDemo(docs);
  if (!primero) {
    return {
      title: "Por tu parte no falta nada",
      detail: "Estamos revisando lo que has enviado. Te avisaremos si hace falta algo más.",
      href: "/app/expediente",
    };
  }
  const accion = (d: DemoDocument) =>
    d.state === "cambios"
      ? `corregir ${d.articulo} ${d.name.toLowerCase()}${d.issue ? ` (${d.issue.title.toLowerCase()})` : ""}`
      : d.state === "caducado"
        ? `renovar ${d.articulo} ${d.name.toLowerCase()}`
        : `subir ${d.articulo} ${d.name.toLowerCase()}`;
  const titulo = accion(primero);
  return {
    title: titulo.charAt(0).toUpperCase() + titulo.slice(1),
    detail:
      resto.length === 0
        ? "Es lo único que falta por tu parte. El resto lo preparamos nosotros."
        : `Y después, ${resto.map(accion).join(" y ")}. Con eso, tu parte está hecha.`,
    href: "/app/documentos",
  };
}

/**
 * Avance por fases, no un número escrito a mano.
 *
 * Decía «68 % completado» con el expediente en la tercera de siete fases y
 * tres de ocho documentos validados. No salía de ningún sitio. Ahora es la
 * proporción de fases cerradas, con la actual contada a medias.
 */
function progresoPorFases(timeline: readonly { state: string }[]): number {
  const hechas = timeline.filter((t) => t.state === "done").length;
  const activa = timeline.some((t) => t.state === "active") ? 0.5 : 0;
  return Math.round(((hechas + activa) / timeline.length) * 100);
}

export const DEMO_CASE = {
  ...CASO_BASE,
  progress: progresoPorFases(CASO_BASE.timeline),
  nextStep: siguientePasoCliente(DEMO_DOCUMENTS),
};

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
    at: momento(-2, "09:10"),
    read: false,
    href: "/app/documentos",
  },
  {
    id: "n2",
    kind: "mensaje",
    title: "Tu especialista ha respondido",
    body: "Sobre la apostilla del certificado de antecedentes.",
    at: momento(-3, "18:42"),
    read: false,
    href: "/app/mensajes",
  },
  {
    id: "n3",
    kind: "documento",
    title: "Empadronamiento validado",
    body: "Acredita 3 años y 2 meses de permanencia.",
    at: momento(-55, "17:02"),
    read: true,
    href: "/app/documentos",
  },
  {
    id: "n4",
    kind: "cita",
    title: "Videollamada de seguimiento",
    body: fechaCita(CITA_SEGUIMIENTO),
    at: momento(-4, "10:00"),
    read: true,
    href: "/app/citas",
  },
  {
    id: "n5",
    kind: "pago",
    title: "Factura disponible",
    body: "Primer plazo de la gestión del expediente.",
    at: momento(APERTURA + 4, "14:20"),
    read: true,
    href: "/app/pagos",
  },
  {
    id: "n6",
    kind: "expediente",
    title: "Tu expediente se ha abierto",
    body: "Referencia ES-2048 · Arraigo sociolaboral.",
    at: momento(APERTURA, "09:00"),
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
    at: momento(APERTURA, "09:02"),
  },
  {
    id: "m2",
    from: "cliente",
    authorName: "María",
    body: "Hola. El certificado de antecedentes de Colombia, ¿tiene que estar apostillado sí o sí?",
    at: momento(-3, "17:58"),
  },
  {
    id: "m3",
    from: "asistente",
    authorName: "Asistente de Extranjería Segura",
    body: "Es una cuestión que afecta a la validez de tu expediente, así que voy a trasladar esta consulta a tu especialista para que te la confirme.",
    at: momento(-3, "17:58"),
  },
  {
    id: "m4",
    from: "especialista",
    authorName: "Tu especialista",
    body: "Hola María. Sí: el certificado tiene que venir apostillado por la autoridad competente colombiana y, si no está en español, traducido por traductor jurado. Te dejo la guía paso a paso.",
    at: momento(-3, "18:42"),
    attachment: { name: "Guia-apostilla-Colombia.pdf", kind: "pdf" },
  },
  {
    id: "m5",
    from: "cliente",
    authorName: "María",
    body: "Perfecto, lo pido esta semana. Gracias.",
    at: momento(-3, "19:03"),
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
    date: fechaDemo(APERTURA),
    invoice: "F-2026-0417",
  },
  {
    id: "p2",
    concept: "Gestión de arraigo sociolaboral · 1er plazo",
    amountCents: 22450,
    state: "pagado",
    date: fechaDemo(APERTURA + 4),
    invoice: "F-2026-0431",
  },
  {
    id: "p3",
    concept: "Gestión de arraigo sociolaboral · 2º plazo",
    amountCents: 22450,
    state: "programado",
    date: fechaDemo(21),
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
    at: CITA_SEGUIMIENTO,
    durationMin: 30,
    mode: "videollamada",
    language: "Español",
    with: "Tu especialista",
    state: "confirmada",
  },
  {
    id: "a2",
    title: "Consulta inicial",
    at: momento(APERTURA, "09:00"),
    durationMin: 45,
    mode: "videollamada",
    language: "Español",
    with: "Tu especialista",
    state: "pasada",
  },
];

/**
 * La próxima cita confirmada que todavía no ha pasado.
 *
 * «Próxima» significa por delante: la tarjeta de Inicio enseñaba la primera
 * cita confirmada de la lista aunque fuera de hacía un mes.
 */
export function proximaCita(
  citas: DemoAppointment[],
  desde: number = Date.now(),
): DemoAppointment | undefined {
  return citas
    .filter((a) => a.state === "confirmada" && new Date(a.at).getTime() > desde)
    .sort((a, b) => a.at.localeCompare(b.at))[0];
}

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
  // «Cerrado» y no «Archivado». En extranjería el archivo del procedimiento
  // es un resultado —casi siempre por desistimiento o caducidad—, no una
  // carpeta. Un expediente presentado aparecía con la etiqueta «Archivado»,
  // que para un abogado de la materia se lee como «se ha perdido».
  { id: "archivado", label: "Cerrado" },
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
  /**
   * Importe de la operación. En las cuatro vías con precio publicado coincide
   * con la tarifa de `pricing.ts`, para que el panel no enseñe 449 € por un
   * arraigo mientras la web pide 539.
   *
   * En reagrupación familiar y protección internacional no coincide con nada,
   * y es correcto: son justo las vías que salen a presupuesto a medida, así
   * que un importe negociado distinto de cualquier tarifa es lo que debe
   * haber ahí.
   */
  valueCents: number;
  /**
   * Días desde el último movimiento. Era una fecha fija —«12 ago 2026»— y a
   * las pocas semanas toda la lista parecía abandonada. Lo que interesa a
   * quien lleva el caso no es la fecha, es cuánto lleva quieto.
   */
  movimientoHaceDias: number;
  flags?: string[];
}

export const DEMO_PIPELINE: DemoCaseCard[] = [
  { id: "c1", reference: "ES-2048", client: "María G.", tramite: "Arraigo sociolaboral", stage: "documentacion", owner: "A. Ruiz", valueCents: 53900, movimientoHaceDias: 1 },
  { id: "c2", reference: "ES-2051", client: "Ibrahim K.", tramite: "Nacionalidad por residencia", stage: "revision", owner: "A. Ruiz", valueCents: 47900, movimientoHaceDias: 0 },
  { id: "c3", reference: "ES-2044", client: "Sofia B.", tramite: "Nómada digital", stage: "listo", owner: "L. Ortega", valueCents: 89900, movimientoHaceDias: 1 },
  { id: "c4", reference: "ES-2039", client: "Carlos M.", tramite: "Reagrupación familiar", stage: "presentado", owner: "L. Ortega", valueCents: 54900, movimientoHaceDias: 4 },
  { id: "c5", reference: "ES-2033", client: "Wei L.", tramite: "Renovación de residencia", stage: "requerimiento", owner: "A. Ruiz", valueCents: 35900, movimientoHaceDias: 0, flags: ["Plazo vencido"] },
  { id: "c6", reference: "ES-2055", client: "Ana P.", tramite: "Arraigo social", stage: "contratado", owner: "Sin asignar", valueCents: 53900, movimientoHaceDias: 2 },
  { id: "c7", reference: "ES-2057", client: "Youssef A.", tramite: "Arraigo sociolaboral", stage: "consulta", owner: "Comercial", valueCents: 53900, movimientoHaceDias: 0 },
  { id: "c8", reference: "ES-2058", client: "Elena V.", tramite: "Nacionalidad por residencia", stage: "diagnostico", owner: "Comercial", valueCents: 47900, movimientoHaceDias: 1 },
  { id: "c9", reference: "ES-2059", client: "Diego R.", tramite: "Nómada digital", stage: "lead", owner: "Bufete asociado", valueCents: 89900, movimientoHaceDias: 3 },
  { id: "c10", reference: "ES-2060", client: "Fatou N.", tramite: "Protección internacional", stage: "lead", owner: "Sin asignar", valueCents: 0, movimientoHaceDias: 0 },
  { id: "c11", reference: "ES-2021", client: "Paulo S.", tramite: "Nómada digital", stage: "resolucion", owner: "L. Ortega", valueCents: 89900, movimientoHaceDias: 5 },
  { id: "c12", reference: "ES-2018", client: "Nadia H.", tramite: "Arraigo familiar", stage: "presentado", owner: "A. Ruiz", valueCents: 47900, movimientoHaceDias: 9 },
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
import { aISO, hoy, sumarDias } from "@/lib/plazos";
import { TRAMITE_MAP } from "./tramites";
import type { DocumentoExpediente } from "@/lib/preparacion";

/**
 * Un día de calendario relativo a hoy.
 *
 * Las fechas de estos expedientes eran fijas —«2026-08-26»— y eso convierte
 * la demostración en una bomba de relojería: el motor de plazos deriva los
 * días de verdad, así que a las dos semanas de escribirlas todo aparecía
 * vencido. Comprobado: el 22 de septiembre, los tres expedientes del abogado
 * salían en rojo y la pantalla no demostraba nada salvo un despacho en
 * llamas.
 *
 * Con desplazamientos, la demostración conserva siempre su forma: uno
 * vencido que exige decidir hoy, uno crítico a seis días, y varios con
 * margen. Que es justo lo que hay que poder enseñar.
 */
function dia(desplazamiento: number): string {
  return aISO(sumarDias(hoy(), desplazamiento));
}

/**
 * Es una función y no una constante a propósito: una constante fija las
 * fechas cuando arranca el proceso, y un servidor que lleve semanas en pie
 * volvería a enseñar la demostración envejecida. El panel es `force-dynamic`,
 * así que llamarla por petición no cuesta nada.
 */
/**
 * Todos los documentos del trámite, validados.
 *
 * Se deriva del catálogo en lugar de escribirse a mano: si mañana un trámite
 * gana un requisito, este expediente deja de estar completo solo, que es lo
 * correcto. Una lista copiada seguiría diciendo «listo para presentar» con un
 * documento de menos.
 */
function todosValidados(slug: string): DocumentoExpediente[] {
  return (TRAMITE_MAP[slug]?.documents ?? []).map((d) => ({
    nombre: d.name,
    estado: "correcto" as const,
  }));
}

export function expedientesDemo(): Expediente[] {
  return [
    {
      id: "c5",
      referencia: "ES-2033",
      cliente: "Wei L.",
      tramite: "Renovación de residencia",
      tramiteSlug: "renovacion-residencia-trabajo",
      responsable: "A. Ruiz",
      idioma: "zh",
      hechos: [{ tipo: "requerimiento-notificado", fecha: dia(-11) }], // venció ayer
      // Un documento caducado es la causa más común de un requerimiento de
      // subsanación, y por eso está aquí: es el caso que hay que saber ver.
      documentos: [
        { nombre: "Pasaporte y TIE", estado: "correcto" },
        { nombre: "Vida laboral actualizada", estado: "caducado", pedidoEl: dia(-6) },
        { nombre: "Contrato vigente o documentación de la actividad", estado: "correcto" },
        { nombre: "Empadronamiento", estado: "correcto" },
      ],
    },
    {
      id: "c2",
      referencia: "ES-2051",
      cliente: "Ibrahim K.",
      tramite: "Nacionalidad por residencia",
      tramiteSlug: "nacionalidad-por-residencia",
      responsable: "A. Ruiz",
      idioma: "ar",
      hechos: [{ tipo: "requerimiento-notificado", fecha: dia(-4), diasConcedidos: 10 }], // seis días
      documentos: [
        { nombre: "Pasaporte y TIE en vigor", estado: "revision" },
        { nombre: "Certificado de nacimiento legalizado y traducido", estado: "cambios", pedidoEl: dia(-19) },
        { nombre: "Certificado de antecedentes penales del país de origen", estado: "correcto" },
        { nombre: "Certificado de antecedentes penales en España", estado: "correcto" },
        { nombre: "Certificado de empadronamiento", estado: "correcto" },
        { nombre: "Diploma CCSE", estado: "correcto" },
        { nombre: "Diploma DELE A2 cuando proceda", estado: "pendiente", pedidoEl: dia(-4) },
      ],
    },
    {
      id: "c4",
      referencia: "ES-2039",
      cliente: "Carlos M.",
      tramite: "Reagrupación familiar",
      tramiteSlug: "reagrupacion-familiar",
      responsable: "L. Ortega",
      idioma: "pt",
      hechos: [{ tipo: "presentacion", fecha: dia(-66) }], // silencio a tres meses
      presentado: true,
      documentos: todosValidados("reagrupacion-familiar"),
    },
    {
      id: "c11",
      referencia: "ES-2021",
      cliente: "Paulo S.",
      tramite: "Nómada digital",
      tramiteSlug: "teletrabajo-internacional",
      responsable: "L. Ortega",
      hechos: [
        { tipo: "presentacion", fecha: dia(-125) },
        { tipo: "resolucion-notificada", fecha: dia(-5), sentido: "denegatoria" },
      ],
      presentado: true,
      documentos: todosValidados("teletrabajo-internacional"),
    },
    {
      id: "c1",
      referencia: "ES-2048",
      cliente: "María G.",
      tramite: "Arraigo sociolaboral",
      tramiteSlug: "arraigo-sociolaboral",
      responsable: "A. Ruiz",
      idioma: "es",
      hechos: [
        {
          // La caducidad se vigila sobre un documento ENTREGADO. Antes estaba
          // puesta sobre el certificado de antecedentes penales, que el
          // cliente todavía no ha aportado: el panel avisaba de que iba a
          // caducar un papel que no existía.
          tipo: "caducidad-documento",
          fecha: dia(14),
          etiqueta: "Certificado de empadronamiento",
        },
      ],
      documentos: [
        { nombre: "Pasaporte completo en vigor", estado: "correcto" },
        { nombre: "Certificado de empadronamiento", estado: "correcto" },
        { nombre: "Contrato u oferta de trabajo firmada", estado: "cambios" },
        { nombre: "Prueba de permanencia continuada", estado: "correcto" },
        { nombre: "Documentación de la empresa contratante", estado: "revision" },
        {
          nombre: "Certificado de antecedentes penales del país de origen",
          estado: "pendiente",
          pedidoEl: dia(-11),
        },
      ],
    },
    {
      id: "c3",
      referencia: "ES-2044",
      cliente: "Sofia B.",
      tramite: "Nómada digital",
      tramiteSlug: "teletrabajo-internacional",
      responsable: "L. Ortega",
      hechos: [{ tipo: "caducidad-tarjeta", fecha: dia(54) }],
      // Completo: este es el expediente que una firma cierra, y el que debe
      // salir el primero de la lista aunque su plazo sea el más lejano.
      documentos: todosValidados("teletrabajo-internacional"),
    },
    {
      id: "c6",
      referencia: "ES-2055",
      cliente: "Ana P.",
      tramite: "Arraigo social",
      tramiteSlug: "arraigo-social",
      responsable: "Sin asignar",
      hechos: [],
      documentos: [
        { nombre: "Pasaporte completo en vigor", estado: "revision" },
        { nombre: "Empadronamiento histórico", estado: "subido" },
      ],
    },

    /* Los que no tienen plazo vivo. Un lead al que todavía no se le ha presentado
       nada no tiene ningún reloj administrativo corriendo, y no hay que
       inventarle uno: la urgencia comercial de contestarle es otra cosa, se
       mide de otra forma y mezclarla con los plazos de la Administración es
       justo lo que vuelve inservible un panel de plazos. */
    {
      id: "c7",
      referencia: "ES-2057",
      cliente: "Youssef A.",
      tramite: "Arraigo sociolaboral",
      tramiteSlug: "arraigo-sociolaboral",
      responsable: "Comercial",
      hechos: [],
    },
    {
      id: "c8",
      referencia: "ES-2058",
      cliente: "Elena V.",
      tramite: "Nacionalidad por residencia",
      tramiteSlug: "nacionalidad-por-residencia",
      responsable: "Comercial",
      hechos: [],
    },
    {
      id: "c9",
      referencia: "ES-2059",
      cliente: "Diego R.",
      tramite: "Nómada digital",
      tramiteSlug: "teletrabajo-internacional",
      // Derivado por un colaborador externo: es la única forma de que su rol
      // se pueda enseñar. Antes estaba «Sin asignar» y entrar como
      // colaborador daba una pantalla vacía.
      responsable: "Bufete asociado",
      hechos: [],
    },
    {
      id: "c10",
      referencia: "ES-2060",
      cliente: "Fatou N.",
      tramite: "Protección internacional",
      tramiteSlug: "proteccion-internacional",
      responsable: "Sin asignar",
      hechos: [],
    },
    {
      id: "c12",
      referencia: "ES-2018",
      cliente: "Nadia H.",
      tramite: "Arraigo familiar",
      tramiteSlug: "arraigo-familiar",
      responsable: "A. Ruiz",
      hechos: [{ tipo: "presentacion", fecha: dia(-58) }],
      presentado: true,
      documentos: todosValidados("arraigo-familiar"),
    },
  ];
}
