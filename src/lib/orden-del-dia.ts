import type { Expediente, PlazoVivo } from "./vigilancia";
import { prepararExpediente, type Preparacion } from "./preparacion";

/**
 * EL ORDEN DEL DÍA.
 *
 * Había dos criterios de orden compitiendo, y los dos tienen razón:
 *
 *  · Por plazo. Responde «qué es urgente». Un plazo perdido es irreversible.
 *  · Por preparación. Responde «qué cierro hoy con menos esfuerzo».
 *
 * Elegir uno hace mal la otra mitad del trabajo. Con solo plazos, un
 * expediente completo esperando una firma se queda semanas sin presentar
 * porque su vencimiento está lejos. Con solo preparación, un requerimiento
 * que vence mañana cae al final de la lista porque le faltan seis documentos.
 *
 * Aquí se combinan con una regla que un responsable de expedientes aplica sin
 * pensarla: **lo irreversible primero**. Un plazo vencido o crítico —siete
 * días o menos— sube por encima de todo, porque perderlo no se arregla
 * después. El resto se ordena por esfuerzo, que es donde se gana tiempo.
 *
 * Dentro de lo urgente manda el reloj; dentro de lo demás, lo que menos
 * trabajo pide.
 */

export interface EntradaOrden {
  expediente: Expediente;
  plazo?: PlazoVivo;
}

export interface FilaOrdenada extends EntradaOrden {
  preparacion: Preparacion;
  /** `true` cuando sube por plazo y no por preparación. */
  urgente: boolean;
}

/** Un plazo cuenta como irreversible si ya venció o quedan siete días o menos. */
function esUrgente(plazo?: PlazoVivo): boolean {
  if (!plazo) return false;
  return plazo.cuenta.estado === "vencido" || plazo.cuenta.critico;
}

const PRIORIDAD_PREPARACION = {
  listo: 0,
  "en-revision": 1,
  "esperando-cliente": 2,
  presentado: 3,
} as const;

export function ordenDelDia(entradas: EntradaOrden[]): FilaOrdenada[] {
  const filas: FilaOrdenada[] = entradas.map((e) => ({
    ...e,
    preparacion: prepararExpediente({
      tramiteSlug: e.expediente.tramiteSlug,
      documentos: e.expediente.documentos ?? [],
      presentado: e.expediente.presentado,
    }),
    urgente: esUrgente(e.plazo),
  }));

  return filas.sort((a, b) => {
    // 1. Lo irreversible, y entre ello el reloj.
    if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
    if (a.urgente && b.urgente) {
      return (a.plazo?.cuenta.dias ?? 0) - (b.plazo?.cuenta.dias ?? 0);
    }

    // 2. Lo demás, por lo que menos trabajo pide.
    const porEstado =
      PRIORIDAD_PREPARACION[a.preparacion.estado] - PRIORIDAD_PREPARACION[b.preparacion.estado];
    if (porEstado !== 0) return porEstado;

    const pendientes = (p: Preparacion) =>
      p.faltan.length + p.incidencias.length + p.caducados.length + p.porRevisar.length;
    const porPendientes = pendientes(a.preparacion) - pendientes(b.preparacion);
    if (porPendientes !== 0) return porPendientes;

    // 3. A igualdad de todo, el que antes vence.
    return (a.plazo?.cuenta.dias ?? Number.MAX_SAFE_INTEGER) -
      (b.plazo?.cuenta.dias ?? Number.MAX_SAFE_INTEGER);
  });
}

/**
 * Por qué este expediente está donde está.
 *
 * Una lista ordenada por un criterio que no se ve es una lista que parece
 * arbitraria, y una lista que parece arbitraria se reordena a mano. Esto lo
 * dice en tres palabras.
 */
export function motivoDelOrden(fila: FilaOrdenada): string {
  if (fila.urgente) {
    const { cuenta } = fila.plazo!;
    return cuenta.estado === "vencido"
      ? `Plazo vencido hace ${Math.abs(cuenta.dias)} d`
      : cuenta.dias === 0
        ? "Vence hoy"
        : `Vence en ${cuenta.dias} d`;
  }
  return fila.preparacion.siguiente;
}
