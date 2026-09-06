/**
 * REGISTRO DE FUENTES NORMATIVAS.
 *
 * Regla del proyecto: ninguna afirmación con cifra, plazo o artículo se
 * publica sin la norma detrás. Este archivo es donde vive esa norma.
 *
 * Sobre los enlaces al BOE. Enlazar a la portada de boe.es no sirve ni para un
 * lector ni para un buscador: hay que llegar al texto consolidado del artículo
 * concreto. El texto consolidado vive en
 * `https://www.boe.es/buscar/act.php?id=<identificador>`, y el identificador
 * (BOE-A-año-número) es un dato que hay que conocer, no deducir.
 *
 * Por eso `boeId` puede ser `null`. Un identificador inventado produce un
 * enlace que resuelve a otra norma distinta, que es peor que no enlazar: el
 * lector cree que ha comprobado algo y no ha comprobado nada. Cuando `boeId`
 * es `null` la cita se publica completa pero sin enlace, y la referencia queda
 * listada en `fuentesPendientesDeVerificar()` para que quien tenga acceso al
 * BOE la complete. El sitio nunca finge tener una comprobación que no tiene.
 */

export interface Fuente {
  /** Clave estable con la que se cita desde el contenido. */
  id: string;
  /** Cita formal completa, tal y como debe leerse. */
  norma: string;
  /** Identificador del BOE para el texto consolidado. `null` si no verificado. */
  boeId: string | null;
  /**
   * Qué dice esta norma sobre lo que estamos afirmando. Es lo que permite al
   * revisor jurídico comprobar la referencia sin leerse la norma entera.
   */
  respalda: string;
  /**
   * `true` mientras el equipo jurídico no haya confirmado la referencia contra
   * el texto consolidado. Se muestra al usuario, no se esconde.
   */
  pendienteVerificacion: boolean;
}

/** Texto consolidado en el BOE, o `null` si no hay identificador verificado. */
export function boeUrl(f: Fuente): string | null {
  return f.boeId ? `https://www.boe.es/buscar/act.php?id=${f.boeId}` : null;
}

/**
 * Enlace profundo a un artículo concreto del texto consolidado.
 * El BOE ancla los artículos como `#a124`, `#da20`, `#a46`.
 */
export function boeArticuloUrl(f: Fuente, ancla: string): string | null {
  const base = boeUrl(f);
  return base ? `${base}#${ancla}` : null;
}

export const FUENTES: Record<string, Fuente> = {
  "ley-39-2015": {
    id: "ley-39-2015",
    norma:
      "Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas",
    boeId: "BOE-A-2015-10565",
    respalda:
      "Cómputo de plazos, efectos del silencio administrativo y plazo del recurso de reposición.",
    pendienteVerificacion: false,
  },

  "ley-29-1998": {
    id: "ley-29-1998",
    norma: "Ley 29/1998, de 13 de julio, reguladora de la Jurisdicción Contencioso-administrativa",
    boeId: "BOE-A-1998-16718",
    respalda:
      "Plazo para interponer recurso contencioso-administrativo frente a acto expreso y frente a acto presunto.",
    pendienteVerificacion: false,
  },

  /**
   * Las tres normas de extranjería recientes se citan sin enlace al
   * consolidado a propósito: no disponemos del identificador BOE verificado.
   * Publicar uno aproximado enlazaría a una norma distinta.
   */
  "rd-1155-2024": {
    id: "rd-1155-2024",
    norma:
      "Real Decreto 1155/2024, de 19 de noviembre, por el que se aprueba el Reglamento de la Ley Orgánica 4/2000",
    boeId: null,
    respalda:
      "Régimen general de las figuras de arraigo vigentes: modalidades, periodos de permanencia exigidos, informe de arraigo y duración de las autorizaciones.",
    pendienteVerificacion: true,
  },

  "rd-316-2026": {
    id: "rd-316-2026",
    norma: "Real Decreto 316/2026, de 14 de abril",
    boeId: null,
    respalda:
      "Disposiciones adicionales que habilitan el procedimiento extraordinario de 2026: plazo de solicitud, requisitos de acceso y plazo de resolución.",
    pendienteVerificacion: true,
  },

  "rd-126-2026": {
    id: "rd-126-2026",
    norma: "Real Decreto 126/2026, por el que se fija el salario mínimo interprofesional para 2026",
    boeId: null,
    respalda: "Cuantía del SMI de 2026, usada como referencia de medios económicos.",
    pendienteVerificacion: true,
  },
};

export function fuente(id: keyof typeof FUENTES | string): Fuente | undefined {
  return FUENTES[id];
}

/**
 * Referencias que el equipo jurídico debe completar contra el texto
 * consolidado antes de que el contenido que las cita pueda considerarse
 * verificado. Se usa en el panel interno y en el informe de contenido.
 */
export function fuentesPendientesDeVerificar(): Fuente[] {
  return Object.values(FUENTES).filter((f) => f.pendienteVerificacion || f.boeId === null);
}
