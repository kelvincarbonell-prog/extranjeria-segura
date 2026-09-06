import { FUENTES, type Fuente } from "@/content/fuentes";
import { aISO, cuentaAtras, hoy, parseDia, sumarDias, sumarMeses, type Cuenta } from "./plazos";

/**
 * VIGILANCIA DE PLAZOS DE EXPEDIENTE.
 *
 * Lo que de verdad pierde expedientes en un despacho de extranjería no es
 * equivocarse de estrategia: es que un plazo venza mientras el escrito estaba
 * a medias. El responsable lleva veinte casos a la vez, cada uno con su reloj,
 * y todos los relojes empezaron un día distinto.
 *
 * ─── POR QUÉ NO BASTA CON GUARDAR «DÍAS RESTANTES» ──────────────────────
 *
 * El panel guardaba `slaDays: 6` en cada tarjeta. Un número escrito a mano en
 * una base de datos deja de ser cierto al día siguiente, y a la semana está
 * mintiendo a quien lo mira para decidir qué hacer hoy. Peor: no dice de dónde
 * sale, así que nadie puede comprobarlo ni corregirlo.
 *
 * Aquí un plazo no se guarda: se **deriva** de un hecho con fecha —«se
 * notificó el requerimiento el 2 de septiembre»— y de una regla con su norma
 * detrás. El hecho no caduca y la regla es auditable. Los días restantes se
 * calculan en el momento de mirarlos.
 *
 * ─── LA REGLA CITA SU NORMA, Y DICE SI ESTÁ VERIFICADA ──────────────────
 *
 * Cada plazo que sale de aquí lleva la norma que lo establece y el mismo
 * indicador de verificación que el contenido público. Un plazo cuya norma
 * todavía no se ha contrastado contra el texto consolidado se muestra, pero
 * marcado: quien organiza su semana con esta pantalla tiene derecho a saber
 * cuáles de esos relojes están confirmados.
 */

export type OrigenPlazo =
  | "requerimiento"
  | "silencio"
  | "reposicion"
  | "contencioso"
  | "renovacion"
  | "documento";

/** Un hecho con fecha del que nacen plazos. Es lo que se guarda. */
export interface HechoExpediente {
  tipo:
    | "presentacion"
    | "requerimiento-notificado"
    | "resolucion-notificada"
    | "caducidad-tarjeta"
    | "caducidad-documento";
  fecha: string;
  /** Días concedidos, cuando el propio documento los fija. */
  diasConcedidos?: number;
  /** Nombre del documento, para los plazos de vigencia documental. */
  etiqueta?: string;
  /** Sentido de la resolución: sin ella no se sabe si hay algo que recurrir. */
  sentido?: "favorable" | "denegatoria" | "inadmision";
}

export interface Expediente {
  id: string;
  referencia: string;
  cliente: string;
  tramite: string;
  responsable: string;
  hechos: HechoExpediente[];
}

export interface PlazoVivo {
  expedienteId: string;
  origen: OrigenPlazo;
  /** Qué vence, en la frase que usaría el responsable. */
  titulo: string;
  /** Qué hay que hacer antes de esa fecha. */
  accion: string;
  vence: string;
  cuenta: Cuenta;
  norma: Fuente;
  articulo?: string;
  /** ¿La norma que fija este plazo está contrastada? */
  verificado: boolean;
}

/**
 * Plazo por defecto de un requerimiento de subsanación cuando el documento no
 * dice otra cosa. La cifra está en el art. 68.1 de la Ley 39/2015 y todavía
 * no la ha contrastado nadie de este equipo contra el texto consolidado, así
 * que todo plazo derivado de ella sale marcado.
 */
const DIAS_SUBSANACION_POR_DEFECTO = 10;
const SUBSANACION_VERIFICADA = false;

/**
 * Ventana de renovación: se admite desde 60 días antes de la caducidad y
 * hasta 90 días después. Mismo criterio que la calculadora pública, y misma
 * reserva: pendiente de contrastar.
 */
const DIAS_ANTES_RENOVACION = 60;
const DIAS_DESPUES_RENOVACION = 90;
const RENOVACION_VERIFICADA = false;

export function plazosDe(exp: Expediente, referencia = hoy()): PlazoVivo[] {
  const plazos: PlazoVivo[] = [];

  /**
   * Si ya ha llegado resolución expresa, el silencio queda superado: lo que
   * corre a partir de ahí son los plazos de recurso desde la notificación.
   *
   * Sin esta comprobación, un expediente resuelto seguía enseñando «silencio
   * vencido hace 17 días · decidir hoy» junto a su recurso de reposición. Es
   * una falsa alarma, y una falsa alarma en un panel de plazos es cara: si la
   * pantalla avisa de cosas que no hay que hacer, se deja de mirar, y el día
   * que avisa de una de verdad ya no la lee nadie.
   */
  const hayResolucion = exp.hechos.some((h) => h.tipo === "resolucion-notificada");

  const añadir = (p: Omit<PlazoVivo, "expedienteId" | "cuenta">) => {
    plazos.push({
      ...p,
      expedienteId: exp.id,
      cuenta: cuentaAtras(parseDia(p.vence), referencia),
    });
  };

  for (const h of exp.hechos) {
    switch (h.tipo) {
      case "requerimiento-notificado": {
        // Días hábiles en la norma; aquí se cuentan naturales a propósito.
        // Contar de más nunca hace perder un plazo; contar de menos, sí. La
        // fecha que sale es siempre igual o anterior a la real.
        const dias = h.diasConcedidos ?? DIAS_SUBSANACION_POR_DEFECTO;
        añadir({
          origen: "requerimiento",
          titulo: "Requerimiento de subsanación",
          accion: "Aportar la documentación requerida y guardar el justificante",
          vence: aISO(sumarDias(parseDia(h.fecha), dias)),
          norma: FUENTES["ley-39-2015"],
          articulo: "a68",
          verificado: SUBSANACION_VERIFICADA,
        });
        break;
      }

      case "presentacion": {
        if (hayResolucion) break;
        añadir({
          origen: "silencio",
          titulo: "Se produce el silencio administrativo",
          accion: "Decidir entre recurso, vía paralela o esperar resolución expresa",
          vence: aISO(sumarMeses(parseDia(h.fecha), 3)),
          norma: FUENTES["ley-39-2015"],
          articulo: "a24",
          verificado: true,
        });
        break;
      }

      case "resolucion-notificada": {
        // Una resolución favorable no abre plazos de recurso.
        if (h.sentido === "favorable") break;
        añadir({
          origen: "reposicion",
          titulo: "Recurso de reposición",
          accion: "Presentar reposición o decidir ir directamente al contencioso",
          vence: aISO(sumarMeses(parseDia(h.fecha), 1)),
          norma: FUENTES["ley-39-2015"],
          articulo: "a124",
          verificado: true,
        });
        añadir({
          origen: "contencioso",
          titulo: "Recurso contencioso-administrativo",
          accion: "Interponer el contencioso antes de que venza",
          vence: aISO(sumarMeses(parseDia(h.fecha), 2)),
          norma: FUENTES["ley-29-1998"],
          articulo: "a46",
          verificado: true,
        });
        break;
      }

      case "caducidad-tarjeta": {
        añadir({
          origen: "renovacion",
          titulo: "Cierre de la ventana de renovación",
          accion: "Presentar la renovación antes de que se cierre la ventana",
          vence: aISO(sumarDias(parseDia(h.fecha), DIAS_DESPUES_RENOVACION)),
          norma: FUENTES["rd-1155-2024"],
          verificado: RENOVACION_VERIFICADA,
        });
        break;
      }

      case "caducidad-documento": {
        añadir({
          origen: "documento",
          titulo: `Caduca: ${h.etiqueta ?? "documento del expediente"}`,
          accion: "Pedir uno nuevo antes de presentar, o el expediente entra con un documento vencido",
          vence: h.fecha,
          norma: FUENTES["rd-1155-2024"],
          verificado: RENOVACION_VERIFICADA,
        });
        break;
      }
    }
  }

  // Vencidos primero: son los que exigen una decisión hoy, no los que faltan.
  return plazos.sort((a, b) => a.cuenta.dias - b.cuenta.dias);
}

/** Cuándo se abre la ventana de renovación de una tarjeta. */
export function aperturaRenovacion(caducidadISO: string): string {
  return aISO(sumarDias(parseDia(caducidadISO), -DIAS_ANTES_RENOVACION));
}

export interface VigilanciaResumen {
  vencidos: PlazoVivo[];
  criticos: PlazoVivo[];
  proximos: PlazoVivo[];
  /** Expedientes sin ningún plazo vivo: ni urgentes ni olvidados. */
  sinPlazo: Expediente[];
}

/**
 * Agrupa por lo único que decide el orden del día: cuánto queda.
 *
 * Un plazo vencido no desaparece de la lista. Es la tentación obvia —ya no se
 * puede cumplir— y es justo al revés: un plazo vencido es el que más atención
 * necesita, porque a partir de ahí hay que decidir qué se hace con el
 * expediente, y esa decisión también tiene su propio reloj.
 */
export function vigilar(expedientes: Expediente[], referencia = hoy()): VigilanciaResumen {
  const todos = expedientes.flatMap((e) => plazosDe(e, referencia));

  const conPlazo = new Set(todos.map((p) => p.expedienteId));

  return {
    vencidos: todos.filter((p) => p.cuenta.estado === "vencido"),
    criticos: todos.filter((p) => p.cuenta.estado !== "vencido" && p.cuenta.critico),
    proximos: todos.filter(
      (p) => p.cuenta.estado !== "vencido" && !p.cuenta.critico && p.cuenta.dias <= 45,
    ),
    sinPlazo: expedientes.filter((e) => !conPlazo.has(e.id)),
  };
}

/**
 * El plazo que manda en cada expediente: el más próximo a vencer.
 *
 * Existe para que todas las pantallas del panel enseñen el mismo número. El
 * panel de inicio, la tabla de expedientes y el tablero mostraban cada uno su
 * propio contador de días leído de un campo guardado (`slaDays`), y bastaba
 * con que alguien actualizara uno para que los tres discreparan. Ahora los
 * tres derivan de aquí, y aquí se deriva de los hechos.
 *
 * Un expediente sin plazo vivo no aparece en el mapa. Es distinto de tener
 * cero días: significa que nada corre, y la pantalla debe poder decir eso en
 * lugar de pintar un contador a cero que asusta sin motivo.
 */
export function plazoPrincipal(
  expedientes: Expediente[],
  referencia = hoy(),
): Map<string, PlazoVivo> {
  const mapa = new Map<string, PlazoVivo>();

  for (const exp of expedientes) {
    // `plazosDe` ya devuelve ordenado por días restantes: el primero es el que
    // menos margen deja, incluidos los vencidos, que van delante.
    const [primero] = plazosDe(exp, referencia);
    if (primero) mapa.set(exp.id, primero);
  }

  return mapa;
}
