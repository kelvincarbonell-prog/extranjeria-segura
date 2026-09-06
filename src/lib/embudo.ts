"use client";

/**
 * INSTRUMENTACIÓN MÍNIMA DEL EMBUDO (A20).
 *
 * Sin desglose por pregunta se está optimizando a ciegas la pieza central del
 * producto. La tasa global de finalización no dice nada útil: si el 40% no
 * termina, lo accionable no es ese número, es *qué pregunta* los pierde. Suele
 * ser una sola y suele ser reescribible.
 *
 * ─── POR QUÉ NO HAY UN PROVEEDOR DE ANALÍTICA AQUÍ ──────────────────────
 *
 * El recorrido que se está midiendo revela, paso a paso, la situación
 * administrativa de una persona extranjera: si está en situación irregular,
 * cuánto lleva en España, si tiene antecedentes. Mandar eso a un tercero
 * —aunque sea «anonimizado»— es exactamente lo que este producto promete no
 * hacer, y la promesa es la razón por la que alguien se atreve a responder.
 *
 * Así que los eventos se quedan en el dispositivo. Lo que se guarda es el
 * nombre del evento, el número de pregunta y la marca de tiempo: nunca la
 * respuesta. Saber que la pregunta 4 pierde gente no requiere saber qué
 * contestó nadie.
 *
 * ─── CÓMO SE LEE ESTO ───────────────────────────────────────────────────
 *
 * Hoy, abriendo la consola del navegador y llamando a `embudoResumen()`, o
 * desde el panel interno. Es poco, y es honesto decirlo: para agregar el
 * embudo de todos los visitantes hace falta un destino, y elegirlo es una
 * decisión del negocio (Bloque B). Lo que no puede pasar es llegar a esa
 * decisión sin haber instrumentado nada, porque entonces se empieza a medir
 * desde cero el día que se decida.
 */

export type EventoEmbudo =
  | "check:inicio"
  | "check:pregunta"
  | "check:guardado"
  | "check:resultado"
  | "check:cta"
  | "reserva:completada";

interface Registro {
  evento: EventoEmbudo;
  /** Número de pregunta, rama del resultado… nunca una respuesta. */
  detalle?: string | number;
  t: number;
}

const CLAVE = "es.embudo.v1";
const MAXIMO = 400;

function leer(): Registro[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Registro[]) : [];
  } catch {
    return [];
  }
}

/**
 * Registra un evento del embudo.
 *
 * Nunca lanza. Un fallo al medir no puede romper lo que se está midiendo:
 * si el almacenamiento está bloqueado —navegación privada, cookies de terceros
 * desactivadas, cuota llena—, el diagnóstico tiene que seguir funcionando
 * igual.
 */
export function registrar(evento: EventoEmbudo, detalle?: string | number): void {
  if (typeof window === "undefined") return;
  try {
    const historial = leer();
    historial.push({ evento, detalle, t: Date.now() });
    // Se recorta por el principio: interesa el recorrido reciente, y un
    // localStorage que crece sin límite acaba lanzando QuotaExceededError.
    localStorage.setItem(CLAVE, JSON.stringify(historial.slice(-MAXIMO)));
  } catch {
    /* medir nunca puede romper lo medido */
  }
}

export interface ResumenEmbudo {
  inicios: number;
  /** Cuántas veces se alcanzó cada número de pregunta. */
  porPregunta: Record<string, number>;
  guardados: number;
  resultados: number;
  clicsCta: number;
  reservas: number;
  /** Dónde se cae más gente: la pregunta con mayor caída respecto a la previa. */
  mayorCaida: { pregunta: string; perdidos: number } | null;
}

export function embudoResumen(): ResumenEmbudo {
  const historial = typeof window === "undefined" ? [] : leer();

  const porPregunta: Record<string, number> = {};
  let inicios = 0,
    guardados = 0,
    resultados = 0,
    clicsCta = 0,
    reservas = 0;

  for (const r of historial) {
    switch (r.evento) {
      case "check:inicio":
        inicios++;
        break;
      case "check:pregunta":
        porPregunta[String(r.detalle)] = (porPregunta[String(r.detalle)] ?? 0) + 1;
        break;
      case "check:guardado":
        guardados++;
        break;
      case "check:resultado":
        resultados++;
        break;
      case "check:cta":
        clicsCta++;
        break;
      case "reserva:completada":
        reservas++;
        break;
    }
  }

  // La pregunta que rompe el embudo es aquella tras la cual más gente no llega
  // a la siguiente.
  const numeros = Object.keys(porPregunta)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  let mayorCaida: ResumenEmbudo["mayorCaida"] = null;
  for (let i = 0; i < numeros.length - 1; i++) {
    const perdidos = porPregunta[String(numeros[i])] - porPregunta[String(numeros[i + 1])];
    if (perdidos > 0 && (mayorCaida === null || perdidos > mayorCaida.perdidos)) {
      mayorCaida = { pregunta: String(numeros[i]), perdidos };
    }
  }

  return { inicios, porPregunta, guardados, resultados, clicsCta, reservas, mayorCaida };
}

/** Borra el historial local. El usuario es dueño de sus propios datos. */
export function embudoBorrar(): void {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    /* nada que hacer */
  }
}
