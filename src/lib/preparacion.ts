import { TRAMITE_MAP } from "@/content/tramites";
import type { DocumentRequirement } from "@/content/taxonomy";
import type { DocState } from "@/content/demo";

/**
 * CUÁNTO LE FALTA A UN EXPEDIENTE PARA PODER PRESENTARSE.
 *
 * ─── LO QUE ESTO NO ES ──────────────────────────────────────────────────
 *
 * No es una probabilidad de éxito. «Este arraigo tiene un 78 % de salir» es
 * una cifra inventada —nadie puede calcularla— y además una predicción
 * jurídica que ningún colegiado firmaría. El proyecto prohíbe expresamente
 * publicar tasas de éxito, y con razón: quien decide jugarse 500 € y seis
 * meses leyendo un porcentaje falso merece algo mejor.
 *
 * Esto mide otra cosa, que sí se puede medir y comprobar: qué documentos de
 * los que el trámite exige están aportados, cuáles faltan, cuáles han
 * caducado y cuáles esperan revisión. Es aritmética sobre hechos, no una
 * opinión sobre el futuro.
 *
 * ─── EL ORDEN, QUE ES LO QUE AHORRA TRABAJO ─────────────────────────────
 *
 * El panel ordenaba por plazo, que responde «qué es urgente». Esta otra
 * pregunta es «qué cierro hoy con menos esfuerzo», y tiene una respuesta
 * distinta: un expediente completo esperando una firma vale más minutos que
 * uno al que le faltan seis documentos del cliente, aunque el segundo venza
 * antes. Al primero lo cierra una acción; al segundo no lo cierra ninguna
 * acción del abogado, porque la pelota no la tiene él.
 *
 * De ahí sale el orden: primero lo que solo puede hacer el despacho, después
 * lo que espera al cliente —que se resuelve con un recordatorio automático y
 * cero trabajo del abogado— y al final lo que ya está en la Administración.
 */

/** Quién tiene que mover ficha para que el expediente avance. */
export type Pelota = "nosotros" | "cliente" | "administracion";

export type EstadoPreparacion =
  /** Todo validado: solo falta firmar y presentar. */
  | "listo"
  /** Hay documentos subidos esperando revisión del despacho. */
  | "en-revision"
  /** Falta documentación que solo puede aportar el cliente. */
  | "esperando-cliente"
  /** Ya presentado: no hay nada que preparar, solo vigilar el plazo. */
  | "presentado";

export interface DocumentoExpediente {
  /** Coincide con `name` del requisito del trámite. */
  nombre: string;
  estado: DocState;
}

export interface Preparacion {
  estado: EstadoPreparacion;
  pelota: Pelota;
  /** Documentos que el trámite exige y no son opcionales. */
  requeridos: number;
  /** De esos, cuántos están validados por el despacho. */
  validados: number;
  /** Lo que falta por aportar, con quién lo consigue. */
  faltan: DocumentRequirement[];
  /** Aportados pero con una incidencia que el cliente debe corregir. */
  incidencias: DocumentRequirement[];
  /** Caducados: la causa más común de un requerimiento de subsanación. */
  caducados: DocumentRequirement[];
  /** Subidos y esperando que alguien del despacho los mire. */
  porRevisar: DocumentRequirement[];
  /** Qué hay que verificar antes de que esto sea asesoramiento. */
  porVerificar: string[];
  /** La única frase que el abogado necesita leer de este expediente. */
  siguiente: string;
}

/**
 * El orden en que aparecen las cosas por hacer.
 *
 * Es el corazón del asunto: puesto más bajo, más trabajo del abogado ahorra
 * ponerlo arriba.
 */
const PRIORIDAD: Record<EstadoPreparacion, number> = {
  listo: 0,
  "en-revision": 1,
  "esperando-cliente": 2,
  presentado: 3,
};

/** Estados documentales que cuentan como «lo tenemos y sirve». */
const VALIDO: DocState[] = ["correcto"];

export interface EntradaPreparacion {
  tramiteSlug: string;
  documentos: DocumentoExpediente[];
  /** `true` cuando el expediente ya está en la Administración. */
  presentado?: boolean;
}

export function prepararExpediente(entrada: EntradaPreparacion): Preparacion {
  const tramite = TRAMITE_MAP[entrada.tramiteSlug];

  // Un trámite que no existe en el catálogo no puede evaluarse, y fingir un
  // cero sería peor que decirlo: saldría ordenado como si estuviera listo.
  if (!tramite) {
    return {
      estado: "esperando-cliente",
      pelota: "nosotros",
      requeridos: 0,
      validados: 0,
      faltan: [],
      incidencias: [],
      caducados: [],
      porRevisar: [],
      porVerificar: [],
      siguiente: `Sin plan documental: «${entrada.tramiteSlug}» no está en el catálogo de trámites.`,
    };
  }

  const estadoDe = new Map(entrada.documentos.map((d) => [d.nombre, d.estado]));
  const requeridos = tramite.documents.filter((d) => !d.optional);

  const conEstado = (filtro: (e: DocState) => boolean) =>
    requeridos.filter((d) => filtro(estadoDe.get(d.name) ?? "pendiente"));

  const validados = conEstado((e) => VALIDO.includes(e));
  const caducados = conEstado((e) => e === "caducado");
  const incidencias = conEstado((e) => e === "cambios");
  const porRevisar = conEstado((e) => e === "subido" || e === "revision");
  const faltan = conEstado((e) => e === "pendiente");

  // Lo que espera al cliente frente a lo que espera al despacho. Un documento
  // que preparamos nosotros y está pendiente no es culpa del cliente ni se le
  // debe reclamar: es trabajo nuestro sin hacer.
  const pendienteDelCliente = [...faltan, ...incidencias, ...caducados].filter(
    (d) => d.source === "cliente",
  );
  const pendienteNuestro = faltan.filter((d) => d.source === "nosotros");

  const estado: EstadoPreparacion = entrada.presentado
    ? "presentado"
    : porRevisar.length > 0
      ? "en-revision"
      : validados.length === requeridos.length
        ? "listo"
        : pendienteDelCliente.length > 0
          ? "esperando-cliente"
          : "en-revision";

  const pelota: Pelota =
    estado === "presentado"
      ? "administracion"
      : estado === "esperando-cliente"
        ? "cliente"
        : "nosotros";

  return {
    estado,
    pelota,
    requeridos: requeridos.length,
    validados: validados.length,
    faltan,
    incidencias,
    caducados,
    porRevisar,
    porVerificar: tramite.needsVerification,
    siguiente: siguientePaso({
      estado,
      porRevisar: porRevisar.length,
      delCliente: pendienteDelCliente.length,
      nuestro: pendienteNuestro.length,
      caducados: caducados.length,
      incidencias: incidencias.length,
    }),
  };
}

/**
 * Una frase, no una lista.
 *
 * Quien abre el panel con veinte expedientes no lee veinte listas: lee
 * veinte frases y decide dónde entra. Si la frase no dice qué hacer, la
 * pantalla obliga a abrir el expediente para averiguarlo, que es justo el
 * trabajo que se quería quitar.
 */
function siguientePaso(x: {
  estado: EstadoPreparacion;
  porRevisar: number;
  delCliente: number;
  nuestro: number;
  caducados: number;
  incidencias: number;
}): string {
  const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);

  if (x.estado === "presentado") return "Presentado. Solo queda vigilar el plazo.";
  if (x.estado === "listo") return "Todo validado. Firmar y presentar.";

  if (x.porRevisar > 0) {
    return `Revisar ${x.porRevisar} ${plural(x.porRevisar, "documento", "documentos")}: el cliente ya ha hecho su parte.`;
  }
  if (x.caducados > 0) {
    return `${x.caducados} ${plural(x.caducados, "documento caducado", "documentos caducados")}: pedir renovación antes de presentar.`;
  }
  if (x.incidencias > 0) {
    return `${x.incidencias} ${plural(x.incidencias, "documento", "documentos")} con incidencia: el cliente tiene que corregirlo.`;
  }
  if (x.delCliente > 0) {
    return `Faltan ${x.delCliente} ${plural(x.delCliente, "documento del cliente", "documentos del cliente")}. Recordatorio automático.`;
  }
  if (x.nuestro > 0) {
    return `Faltan ${x.nuestro} ${plural(x.nuestro, "documento que preparamos", "documentos que preparamos")} nosotros.`;
  }
  return "Sin acciones pendientes.";
}

/**
 * Ordena por «qué cierro hoy con menos esfuerzo».
 *
 * A igualdad de estado, primero lo que tiene menos cosas pendientes: entre
 * dos expedientes esperando al cliente, el que necesita un documento está más
 * cerca de cerrarse que el que necesita seis.
 */
export function ordenarPorEsfuerzo<T>(
  registros: T[],
  preparacion: (r: T) => Preparacion,
): T[] {
  return [...registros].sort((a, b) => {
    const pa = preparacion(a);
    const pb = preparacion(b);
    const porEstado = PRIORIDAD[pa.estado] - PRIORIDAD[pb.estado];
    if (porEstado !== 0) return porEstado;

    const pendientes = (p: Preparacion) =>
      p.faltan.length + p.incidencias.length + p.caducados.length + p.porRevisar.length;
    return pendientes(pa) - pendientes(pb);
  });
}

export const ETIQUETA_ESTADO: Record<EstadoPreparacion, string> = {
  listo: "Listo para presentar",
  "en-revision": "Nos toca a nosotros",
  "esperando-cliente": "Esperando al cliente",
  presentado: "En la Administración",
};

export const TONO_ESTADO: Record<EstadoPreparacion, "ok" | "brand" | "warn" | "neutral"> = {
  listo: "ok",
  "en-revision": "brand",
  "esperando-cliente": "warn",
  presentado: "neutral",
};
