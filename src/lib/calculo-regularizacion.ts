import { aISO, cuentaAtras, hoy, parseDia, sumarMeses, type Cuenta } from "./plazos";

/**
 * LÓGICA DE LA CALCULADORA DE PLAZOS DE LA REGULARIZACIÓN (A2).
 *
 * Separada del componente a propósito: así se puede probar sin renderizar
 * nada, y las pruebas de `plazos.test.ts` cubren la aritmética que hay debajo.
 *
 * Todo se ejecuta en el navegador. Ninguna fecha introducida por el usuario
 * sale del dispositivo, y eso no es un detalle de implementación: alguien que
 * escribe la fecha de presentación de su expediente de extranjería está
 * diciendo, implícitamente, que es extranjero y que tiene un procedimiento
 * abierto. Ese dato no tiene por qué existir en ningún servidor nuestro.
 */

export type TipoResolucion = "sin-resolucion" | "denegada" | "inadmitida" | "concedida";

export interface EntradaCalculo {
  /** Fecha ISO de presentación de la solicitud. */
  fechaPresentacion: string;
  /** ¿Ha llegado una resolución expresa? */
  tipoResolucion: TipoResolucion;
  /** Fecha ISO de notificación, si hay resolución. */
  fechaNotificacion?: string;
}

export interface Via {
  id: string;
  nombre: string;
  /** `null` cuando la vía existe pero no tiene fecha de cierre. */
  vence: string | null;
  cuenta: Cuenta | null;
  norma: string;
  articulo?: string;
  /** Clave de `FUENTES`. */
  fuenteId: string;
  explicacion: string;
}

export interface ResultadoCalculo {
  /** Fecha en que se produce el silencio, si no hay resolución expresa. */
  silencio: string;
  cuentaSilencio: Cuenta;
  /** ¿Ya se ha producido el silencio a fecha de hoy? */
  silencioProducido: boolean;
  estado:
    | "en-plazo-de-resolucion"
    | "silencio-producido"
    | "resolucion-expresa"
    | "concedida";
  vias: Via[];
  /** Avisos que dependen del caso concreto. */
  avisos: string[];
}

/** Errores de entrada, en lenguaje humano. */
export function validarEntrada(e: Partial<EntradaCalculo>): string | null {
  if (!e.fechaPresentacion) return "Indica la fecha en que presentaste la solicitud.";

  const presentacion = parseDia(e.fechaPresentacion);
  if (Number.isNaN(presentacion.getTime())) return "Esa fecha no es válida.";

  // El procedimiento tuvo un plazo cerrado. Una fecha fuera de él casi siempre
  // significa que el usuario está pensando en otro trámite, y conviene decirlo
  // antes de darle unos plazos que no le corresponden.
  if (aISO(presentacion) < "2026-04-16" || aISO(presentacion) > "2026-06-30") {
    return "El plazo de este procedimiento fue del 16 de abril al 30 de junio de 2026. Si tu fecha está fuera, es probable que tu solicitud sea de otro trámite.";
  }

  if (e.tipoResolucion && e.tipoResolucion !== "sin-resolucion") {
    if (!e.fechaNotificacion) return "Indica la fecha en que te notificaron la resolución.";
    const notificacion = parseDia(e.fechaNotificacion);
    if (Number.isNaN(notificacion.getTime())) return "Esa fecha de notificación no es válida.";
    if (notificacion < presentacion) {
      return "La notificación no puede ser anterior a la presentación. Revisa las dos fechas.";
    }
  }

  return null;
}

export function calcular(entrada: EntradaCalculo, referencia = hoy()): ResultadoCalculo {
  const presentacion = parseDia(entrada.fechaPresentacion);

  // Tres meses de fecha a fecha desde la presentación (art. 21 y 30, Ley 39/2015).
  const silencioDate = sumarMeses(presentacion, 3);
  const silencio = aISO(silencioDate);
  const cuentaSilencio = cuentaAtras(silencioDate, referencia);
  const silencioProducido = referencia >= silencioDate;

  const avisos: string[] = [];
  const vias: Via[] = [];

  if (entrada.tipoResolucion === "concedida") {
    return {
      silencio,
      cuentaSilencio,
      silencioProducido,
      estado: "concedida",
      vias: [],
      avisos: [
        "Con una resolución favorable no hay plazo de recurso que calcular. El siguiente paso es la cita para la toma de huellas y la expedición de la TIE.",
      ],
    };
  }

  const hayResolucionExpresa =
    entrada.tipoResolucion === "denegada" || entrada.tipoResolucion === "inadmitida";

  if (hayResolucionExpresa && entrada.fechaNotificacion) {
    const notificacion = parseDia(entrada.fechaNotificacion);

    const reposicion = sumarMeses(notificacion, 1);
    vias.push({
      id: "reposicion",
      nombre: "Recurso de reposición",
      vence: aISO(reposicion),
      cuenta: cuentaAtras(reposicion, referencia),
      norma: "Ley 39/2015",
      articulo: "a124",
      fuenteId: "ley-39-2015",
      explicacion:
        "Un mes desde el día siguiente a la notificación. Es potestativo: puedes ir directamente al contencioso.",
    });

    const contencioso = sumarMeses(notificacion, 2);
    vias.push({
      id: "contencioso",
      nombre: "Recurso contencioso-administrativo",
      vence: aISO(contencioso),
      cuenta: cuentaAtras(contencioso, referencia),
      norma: "Ley 29/1998",
      articulo: "a46",
      fuenteId: "ley-29-1998",
      explicacion:
        "Dos meses desde el día siguiente a la notificación. Si interpones reposición, este plazo se reanuda cuando aquella se resuelve o vence.",
    });

    if (entrada.tipoResolucion === "inadmitida") {
      avisos.push(
        "Una inadmisión no es una denegación: la Administración no ha valorado si cumples los requisitos. El recurso tiene que combatir el motivo de inadmisión, no el fondo del asunto.",
      );
    }

    avisos.push(
      "Los dos plazos corren a la vez desde la notificación. Interponer reposición no hace desaparecer el del contencioso: lo suspende hasta que la reposición se resuelva o venza su plazo.",
    );

    return {
      silencio,
      cuentaSilencio,
      silencioProducido,
      estado: "resolucion-expresa",
      vias,
      avisos,
    };
  }

  // Sin resolución expresa.
  if (!silencioProducido) {
    avisos.push(
      "Todavía estás dentro del plazo de resolución. Hasta que venza no hay acto que recurrir, así que ninguna vía de recurso está abierta aún.",
    );
    return {
      silencio,
      cuentaSilencio,
      silencioProducido,
      estado: "en-plazo-de-resolucion",
      vias: [],
      avisos,
    };
  }

  // Silencio ya producido: se abre la vía de recurso frente al acto presunto.
  vias.push({
    id: "reposicion-presunto",
    nombre: "Recurso de reposición frente al silencio",
    vence: null,
    cuenta: null,
    norma: "Ley 39/2015",
    articulo: "a124",
    fuenteId: "ley-39-2015",
    explicacion:
      "Frente a un acto presunto, la reposición puede interponerse en cualquier momento a partir del día siguiente a aquel en que se produzcan los efectos del silencio. No tiene fecha de cierre.",
  });

  const contenciosoPresunto = sumarMeses(silencioDate, 6);
  vias.push({
    id: "contencioso-presunto",
    nombre: "Recurso contencioso-administrativo frente al silencio",
    vence: aISO(contenciosoPresunto),
    cuenta: cuentaAtras(contenciosoPresunto, referencia),
    norma: "Ley 29/1998",
    articulo: "a46",
    fuenteId: "ley-29-1998",
    explicacion:
      "Seis meses desde el día siguiente a aquel en que se produce el acto presunto. Este sí tiene fecha de cierre.",
  });

  avisos.push(
    "La Administración sigue obligada a dictar una resolución expresa aunque el silencio ya se haya producido, y esa resolución puede ser favorable. Si llega, los plazos se recalculan desde su notificación.",
  );

  return {
    silencio,
    cuentaSilencio,
    silencioProducido,
    estado: "silencio-producido",
    vias,
    avisos,
  };
}
