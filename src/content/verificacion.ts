import { FUENTES, fuentesPendientesDeVerificar, type Fuente } from "./fuentes";
import { HECHOS, ESTADOS, CONSULTADO } from "./regularizacion-2026";
import { TRAMITES } from "./tramites";
import { LEGAL_DOCUMENTS } from "./legal";

/**
 * COLA DE VERIFICACIÓN JURÍDICA.
 *
 * El informe de auditoría dice que la tarea de mayor impacto absoluto es
 * reescribir las fichas sustituyendo cada abstracción por el dato y el
 * artículo. El mismo informe avisa, en su última página, de que el riesgo no
 * es dar números sino dar números equivocados, y de que en este sector ese
 * error cuesta más de lo que rinde el acierto.
 *
 * Las dos cosas son verdad a la vez, y la forma de resolverlo no es escribir
 * las cifras y cruzar los dedos: es separar quién escribe de quién verifica, y
 * hacer que lo no verificado sea visible en lugar de invisible.
 *
 * Este módulo recorre todo el contenido del sitio y devuelve, en una sola
 * lista ordenada por impacto, cada cosa que un profesional tiene que
 * comprobar antes de que pueda considerarse verificada. No es documentación:
 * lo lee el panel interno y lo imprime el informe de contenido, así que no
 * puede quedarse obsoleto respecto al contenido real.
 *
 * El orden importa. Una ficha de arraigo la leen cientos de personas al mes y
 * una plantilla legal sin revisar la lee casi nadie: el revisor debe encontrar
 * arriba lo que más gente está leyendo.
 */

export type TipoPendiente =
  | "fuente-sin-identificador"
  | "dato-sin-contrastar"
  | "ficha-sin-firmar"
  | "plantilla-legal-sin-revisar";

export interface Pendiente {
  id: string;
  tipo: TipoPendiente;
  /** Qué hay que comprobar, en una frase accionable. */
  que: string;
  /** Dónde está publicado, para poder abrirlo. */
  donde: string;
  ruta: string;
  /** Contra qué se comprueba. */
  contra: string;
  /**
   * Cuánta gente lo lee. Es lo que ordena la cola: no tiene sentido revisar
   * primero una plantilla que nadie abre.
   */
  prioridad: 1 | 2 | 3;
  fuente?: Fuente;
}

export function colaVerificacion(): Pendiente[] {
  const cola: Pendiente[] = [];

  // ── 1. Normas citadas sin identificador de BOE comprobado ────────────
  // Bloquean el enlace al texto consolidado en TODAS las páginas que las
  // citan, así que van primero: una sola comprobación desbloquea muchas.
  for (const f of fuentesPendientesDeVerificar()) {
    cola.push({
      id: `fuente:${f.id}`,
      tipo: "fuente-sin-identificador",
      que: `Localizar el identificador BOE-A-… de «${f.norma}» y anotarlo en src/content/fuentes.ts`,
      donde: "Se cita en el hub de regularización y en las páginas de estado",
      ruta: "/regularizacion-2026",
      contra: "Texto consolidado en boe.es",
      prioridad: 1,
      fuente: f,
    });
  }

  // ── 2. Afirmaciones con cifra o plazo sin contrastar ─────────────────
  for (const [clave, dato] of Object.entries(HECHOS)) {
    if (dato.verificado) continue;
    cola.push({
      id: `hecho:${clave}`,
      tipo: "dato-sin-contrastar",
      que: dato.valor,
      donde: "Hub de regularización 2026 · tabla «Los hechos»",
      ruta: "/regularizacion-2026#hechos",
      contra: dato.fuente.norma,
      prioridad: 1,
      fuente: dato.fuente,
    });
  }

  for (const estado of ESTADOS) {
    for (const dato of estado.datos) {
      if (dato.verificado) continue;
      // El mismo dato puede aparecer en varias páginas; se lista una vez.
      const id = `hecho-estado:${dato.valor.slice(0, 40)}`;
      if (cola.some((c) => c.id === id)) continue;
      cola.push({
        id,
        tipo: "dato-sin-contrastar",
        que: dato.valor,
        donde: `Regularización 2026 · ${estado.comoLoVives}`,
        ruta: `/regularizacion-2026/${estado.id}`,
        contra: dato.fuente.norma,
        prioridad: estado.urgente ? 1 : 2,
        fuente: dato.fuente,
      });
    }
  }

  // ── 3. Fichas de trámite pendientes de firma ─────────────────────────
  // Las de arraigo y recursos primero: son las que reciben el tráfico de la
  // regularización, que es el que está llegando ahora.
  const PRIORITARIAS = new Set(["arraigo", "recursos"]);
  for (const t of TRAMITES) {
    if (!t.pendingLegalReview) continue;
    cola.push({
      id: `ficha:${t.slug}`,
      tipo: "ficha-sin-firmar",
      que: `Revisar y firmar la ficha de ${t.name}: requisitos, plazos, honorarios y documentación`,
      donde: `Catálogo de trámites · ${t.name}`,
      ruta: `/tramites/${t.slug}`,
      contra: "Reglamento de Extranjería vigente",
      prioridad: PRIORITARIAS.has(t.category) ? 2 : 3,
    });
  }

  // ── 4. Plantillas legales sin revisar ────────────────────────────────
  for (const d of LEGAL_DOCUMENTS) {
    if (d.reviewed) continue;
    cola.push({
      id: `legal:${d.slug}`,
      tipo: "plantilla-legal-sin-revisar",
      que: `Revisar y aprobar el texto de «${d.title}»`,
      donde: "Textos legales del sitio",
      ruta: `/legal/${d.slug}`,
      contra: "RGPD, LSSI y normativa de consumo",
      // Llevan noindex y no las lee casi nadie hasta que el negocio opera.
      prioridad: 3,
    });
  }

  return cola.sort((a, b) => a.prioridad - b.prioridad);
}

export interface ResumenVerificacion {
  total: number;
  porTipo: Record<TipoPendiente, number>;
  porPrioridad: Record<1 | 2 | 3, number>;
  /** Fecha de la última recopilación de fuentes públicas. */
  consultado: string;
  /** Normas citadas en el sitio, verificadas o no. */
  fuentesTotales: number;
}

export function resumenVerificacion(): ResumenVerificacion {
  const cola = colaVerificacion();
  const porTipo = {
    "fuente-sin-identificador": 0,
    "dato-sin-contrastar": 0,
    "ficha-sin-firmar": 0,
    "plantilla-legal-sin-revisar": 0,
  } as Record<TipoPendiente, number>;
  const porPrioridad = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;

  for (const p of cola) {
    porTipo[p.tipo]++;
    porPrioridad[p.prioridad]++;
  }

  return {
    total: cola.length,
    porTipo,
    porPrioridad,
    consultado: CONSULTADO,
    fuentesTotales: Object.keys(FUENTES).length,
  };
}

export const ETIQUETAS_TIPO: Record<TipoPendiente, string> = {
  "fuente-sin-identificador": "Norma sin enlace al consolidado",
  "dato-sin-contrastar": "Cifra o plazo por contrastar",
  "ficha-sin-firmar": "Ficha pendiente de firma",
  "plantilla-legal-sin-revisar": "Texto legal sin aprobar",
};

export const ETIQUETAS_PRIORIDAD: Record<1 | 2 | 3, string> = {
  1: "Bloquea contenido publicado con plazo abierto",
  2: "Contenido que recibe tráfico ahora",
  3: "Puede esperar",
};
