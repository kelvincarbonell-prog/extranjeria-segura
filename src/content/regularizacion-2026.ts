import { FUENTES, type Fuente } from "./fuentes";

/**
 * REGULARIZACIÓN EXTRAORDINARIA 2026.
 *
 * El mayor movimiento de expedientes de extranjería en España en dos décadas.
 * La fase de presentación está cerrada; la que empieza ahora es la de
 * seguimiento: distinguir una admisión de un requerimiento, calcular cuándo
 * vence el silencio, decidir entre recurso y vía paralela.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CÓMO ESTÁ CONSTRUIDO ESTE ARCHIVO, Y POR QUÉ
 *
 * La regla del producto es que no se publica una cifra sin la norma detrás.
 * Aquí eso se lleva al tipo: un `Dato` no puede existir sin `fuente`. No es
 * posible añadir un plazo a este archivo y olvidarse de citarlo, porque no
 * compila.
 *
 * `verificado` distingue dos cosas que suelen confundirse:
 *
 *   · `true`  — la afirmación se apoya en una norma cuyo texto consolidado
 *               está enlazado y comprobado. Ejemplo: el plazo de un mes del
 *               recurso de reposición.
 *   · `false` — la afirmación procede de fuente pública fiable (boletín
 *               oficial, nota de La Moncloa, portal del procedimiento) pero
 *               nadie de este equipo la ha contrastado todavía contra el texto
 *               consolidado.
 *
 * Lo que NO se hace en ningún caso: publicar un dato `false` como si fuera
 * `true`. La interfaz marca la diferencia delante del usuario. En un sector
 * donde un plazo mal contado cuesta un expediente, decir «esto aún no lo hemos
 * comprobado» vale más que aparentar una certeza que no se tiene.
 *
 * Y lo que tampoco se hace: publicar una tasa de concesión. A la fecha de
 * redacción no hay datos oficiales de concesiones y denegaciones. Quien
 * publique un porcentaje se lo está inventando.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Dato {
  /** La afirmación, redactada para poder leerse fuera de contexto. */
  valor: string;
  /** Norma o publicación que la respalda. Obligatorio por diseño. */
  fuente: Fuente;
  /** Ancla del artículo dentro del texto consolidado, si aplica. */
  articulo?: string;
  /** ¿Contrastado contra el texto consolidado por este equipo? */
  verificado: boolean;
}

/** Fecha en la que se recopilaron los datos de fuentes públicas. */
export const CONSULTADO = "2026-09-06";

/**
 * Estado de revisión del hub completo.
 * Mientras sea `false`, cada página muestra el aviso correspondiente.
 */
export const REVISADO_POR_PROFESIONAL = false;

// ── Fechas duras ────────────────────────────────────────────────────────────
// Se guardan como fechas y no como texto porque de ellas se calculan cuentas
// atrás y plazos. Un plazo escrito a mano en una frase se queda obsoleto sin
// que nadie se entere; uno calculado desde una fecha, no.

export const FECHAS = {
  /** Apertura del plazo de solicitud. */
  inicioSolicitud: "2026-04-16",
  /** Cierre del plazo de solicitud. Cerrado. */
  finSolicitud: "2026-06-30",
  /** Cierre del plazo de subsanación. Es la única fecha innegociable. */
  finSubsanacion: "2026-09-30",
} as const;

// ── Los hechos ──────────────────────────────────────────────────────────────

export const HECHOS: Record<string, Dato> = {
  normaHabilitante: {
    valor:
      "El procedimiento se habilita mediante el Real Decreto 316/2026, de 14 de abril, que añade dos disposiciones adicionales al Reglamento de Extranjería: una para solicitantes de protección internacional y otra de arraigo extraordinario.",
    fuente: FUENTES["rd-316-2026"],
    verificado: false,
  },

  plazoSolicitud: {
    valor:
      "El plazo para presentar la solicitud fue del 16 de abril al 30 de junio de 2026. Está cerrado: no se puede presentar una solicitud nueva por esta vía.",
    fuente: FUENTES["rd-316-2026"],
    verificado: false,
  },

  volumen: {
    valor:
      "Se presentaron 1.174.978 solicitudes, de las cuales 609.737 estaban procesadas a 2 de julio de 2026. El 79,6% por la vía de arraigo extraordinario y el 20,4% por la de protección internacional.",
    fuente: {
      id: "moncloa-2026-07-02",
      norma: "Balance del Gobierno publicado por La Moncloa el 2 de julio de 2026",
      boeId: null,
      respalda: "Volumen de solicitudes presentadas y procesadas, y reparto por vía.",
      pendienteVerificacion: true,
    },
    verificado: false,
  },

  subsanacion: {
    valor:
      "El plazo de subsanación sigue abierto hasta el 30 de septiembre de 2026. Alcanza a quien presentó en plazo y necesita aportar documentación, por iniciativa propia o en respuesta a un requerimiento.",
    fuente: {
      id: "portal-regularizacion",
      norma: "Portal oficial del procedimiento de regularización extraordinaria",
      boeId: null,
      respalda: "Apertura y cierre del plazo de subsanación.",
      pendienteVerificacion: true,
    },
    verificado: false,
  },

  plazoResolucion: {
    valor:
      "El plazo de resolución es de tres meses desde la presentación. Transcurrido sin notificación, el silencio es negativo: la solicitud se entiende desestimada y se abre la vía de recurso.",
    fuente: FUENTES["rd-316-2026"],
    verificado: false,
  },

  computoPlazos: {
    valor:
      "Los plazos por meses se cuentan de fecha a fecha, desde el día siguiente al de la notificación o al de la presentación. Si el día equivalente no existe en el mes de vencimiento, el plazo termina el último día del mes.",
    fuente: FUENTES["ley-39-2015"],
    articulo: "a30",
    verificado: true,
  },

  silencioNegativo: {
    valor:
      "Cuando el silencio tiene efecto desestimatorio, el interesado puede recurrir sin esperar a una resolución expresa, que la Administración sigue obligada a dictar.",
    fuente: FUENTES["ley-39-2015"],
    articulo: "a24",
    verificado: true,
  },

  reposicionExpresa: {
    valor:
      "Frente a una resolución expresa, el recurso de reposición se interpone en el plazo de un mes desde el día siguiente a la notificación.",
    fuente: FUENTES["ley-39-2015"],
    articulo: "a124",
    verificado: true,
  },

  reposicionSilencio: {
    valor:
      "Frente a un acto presunto —cuando no ha llegado resolución—, el recurso de reposición puede interponerse en cualquier momento a partir del día siguiente a aquel en que se produzcan los efectos del silencio.",
    fuente: FUENTES["ley-39-2015"],
    articulo: "a124",
    verificado: true,
  },

  contenciosoExpreso: {
    valor:
      "El recurso contencioso-administrativo frente a una resolución expresa se interpone en el plazo de dos meses desde el día siguiente a la notificación.",
    fuente: FUENTES["ley-29-1998"],
    articulo: "a46",
    verificado: true,
  },

  contenciosoPresunto: {
    valor:
      "Frente a un acto presunto, el plazo del contencioso-administrativo es de seis meses, contados desde el día siguiente a aquel en que se produzca el acto presunto.",
    fuente: FUENTES["ley-29-1998"],
    articulo: "a46",
    verificado: true,
  },

  sinTasaConcesion: {
    valor:
      "No hay datos oficiales de concesiones y denegaciones. Cualquier porcentaje de éxito que circule sobre este procedimiento no procede de una fuente oficial.",
    fuente: {
      id: "ausencia-datos",
      norma: "Ausencia de publicación oficial a la fecha de consulta",
      boeId: null,
      respalda: "No consta publicación de datos de resolución del procedimiento.",
      pendienteVerificacion: false,
    },
    verificado: true,
  },
};

// ── Estados de expediente ───────────────────────────────────────────────────

export type EstadoId =
  | "subsanacion"
  | "silencio-administrativo"
  | "denegacion"
  | "inadmision"
  | "no-presente"
  | "concedida";

export interface Estado {
  id: EstadoId;
  /** Cómo lo describiría el propio interesado, no cómo lo llama la norma. */
  comoLoVives: string;
  /** El nombre técnico, para que aprenda a reconocerlo en su notificación. */
  nombreTecnico: string;
  titulo: string;
  h1: string;
  /** Descripción para metadatos. Máximo ~158 caracteres. */
  meta: string;
  /** Bloque de respuesta directa: cada punto con cifra o norma. */
  loEsencial: string[];
  /** Qué mirar en el papel que ha recibido para saber que está aquí. */
  comoSaberQueEsTuCaso: string[];
  /** Qué hacer, en orden. */
  quePuedesHacer: { titulo: string; detalle: string }[];
  /** Errores que cuestan el expediente. */
  erroresTipicos: string[];
  /** Servicio que corresponde, por slug del catálogo de precios. */
  servicio: { etiqueta: string; href: string };
  /** ¿Hay plazo corriendo? Cambia el tono y el orden de la página. */
  urgente: boolean;
  faqs: { q: string; a: string }[];
  datos: Dato[];
}

export const ESTADOS: Estado[] = [
  {
    id: "subsanacion",
    comoLoVives: "Me han pedido más documentación",
    nombreTecnico: "Requerimiento de subsanación",
    titulo: "Subsanación de la regularización: qué aportar y hasta cuándo",
    h1: "Me han requerido documentación de la regularización",
    meta: "Plazo de subsanación de la regularización extraordinaria 2026: hasta el 30 de septiembre. Qué se puede aportar, cómo se presenta y los errores que cuestan el expediente.",
    loEsencial: [
      "El plazo de subsanación se cierra el 30 de septiembre de 2026.",
      "Alcanza a quien presentó dentro del plazo del 16 de abril al 30 de junio de 2026.",
      "Se puede aportar documentación por iniciativa propia, sin esperar a que la Administración la pida.",
      "Un requerimiento sin contestar en plazo permite tener por desistida la solicitud: el expediente se cierra sin entrar en el fondo.",
      "El plazo de resolución sigue siendo de tres meses y el silencio es negativo.",
    ],
    comoSaberQueEsTuCaso: [
      "El documento usa las palabras «requerimiento», «subsanación» o «se le requiere para que aporte».",
      "Enumera documentos concretos que faltan o que no se consideran válidos.",
      "Fija un plazo de días para contestar y advierte de las consecuencias de no hacerlo.",
      "No contiene una decisión sobre el fondo: no concede ni deniega nada todavía.",
    ],
    quePuedesHacer: [
      {
        titulo: "Localiza la fecha de notificación, no la fecha del documento",
        detalle:
          "El plazo se cuenta desde el día siguiente a la notificación, que puede ser días posterior a la fecha que aparece firmada en el documento. Es el error de cómputo más común.",
      },
      {
        titulo: "Lee qué se pide exactamente y en qué forma",
        detalle:
          "No es lo mismo un documento que falta que uno aportado en forma incorrecta —sin traducir, sin apostillar, sin compulsar—. La respuesta es distinta en cada caso.",
      },
      {
        titulo: "Aporta y conserva el justificante de presentación",
        detalle:
          "El justificante con sello de entrada es la prueba de que contestaste en plazo. Guárdalo aunque el expediente se resuelva favorablemente.",
      },
      {
        titulo: "Si falta algo que no puedes conseguir a tiempo, dilo por escrito",
        detalle:
          "Acreditar que has solicitado un documento y estás esperando a que te lo emitan no es lo mismo que no aportarlo. Constan cosas distintas en el expediente.",
      },
    ],
    erroresTipicos: [
      "Contar el plazo desde la fecha del documento y no desde la notificación.",
      "Aportar el documento correcto sin traducción jurada cuando la necesita.",
      "Responder por un canal distinto al que indica el requerimiento.",
      "Aportar solo una parte de lo pedido y dar por hecho que el resto se entiende.",
      "No guardar el justificante de presentación.",
    ],
    servicio: { etiqueta: "Revisión documental", href: "/precios#revision" },
    urgente: true,
    faqs: [
      {
        q: "¿Hasta cuándo puedo subsanar la regularización?",
        a: "Hasta el 30 de septiembre de 2026, según el portal oficial del procedimiento. El plazo alcanza a quien presentó su solicitud dentro del periodo del 16 de abril al 30 de junio de 2026.",
      },
      {
        q: "¿Puedo aportar documentación sin que me la hayan pedido?",
        a: "Sí. Durante el plazo de subsanación se puede aportar documentación por iniciativa propia, sin esperar a un requerimiento. Es lo aconsejable cuando sabes que algo faltaba o se aportó en forma incorrecta.",
      },
      {
        q: "¿Qué pasa si no contesto a un requerimiento?",
        a: "Un requerimiento sin contestar en plazo permite a la Administración tener por desistida la solicitud y archivar el expediente sin resolver sobre el fondo. Se cierra sin decidir si cumplías o no los requisitos.",
      },
      {
        q: "¿Desde cuándo se cuenta el plazo del requerimiento?",
        a: "Desde el día siguiente al de la notificación, no desde la fecha que figura firmada en el documento. Los plazos por días hábiles excluyen sábados, domingos y festivos (Ley 39/2015).",
      },
    ],
    datos: [HECHOS.subsanacion, HECHOS.plazoSolicitud, HECHOS.computoPlazos, HECHOS.plazoResolucion],
  },

  {
    id: "silencio-administrativo",
    comoLoVives: "No me han contestado",
    nombreTecnico: "Silencio administrativo desestimatorio",
    titulo: "No me contestan a la regularización: el silencio administrativo",
    h1: "No me han contestado a la regularización",
    meta: "Han pasado tres meses y no hay resolución. Qué significa el silencio negativo, cuándo se produce exactamente y qué recursos caben, con los plazos de cada uno.",
    loEsencial: [
      "El plazo de resolución es de tres meses desde la presentación de la solicitud.",
      "Transcurrido sin notificación, el silencio es negativo: la solicitud se entiende desestimada.",
      "Los tres meses se cuentan de fecha a fecha, desde el día siguiente a la presentación (art. 30, Ley 39/2015).",
      "Frente al silencio, la reposición no tiene plazo de cierre (art. 124, Ley 39/2015).",
      "Frente al silencio, el contencioso-administrativo tiene seis meses (art. 46, Ley 29/1998).",
      "La Administración sigue obligada a resolver expresamente aunque el silencio ya se haya producido.",
    ],
    comoSaberQueEsTuCaso: [
      "Presentaste en plazo y han pasado más de tres meses desde la presentación.",
      "No has recibido ninguna notificación: ni requerimiento, ni concesión, ni denegación.",
      "La sede electrónica sigue mostrando el expediente en trámite, sin resolución.",
    ],
    quePuedesHacer: [
      {
        titulo: "Calcula la fecha exacta en que se produjo el silencio",
        detalle:
          "Tres meses de fecha a fecha desde el día siguiente a la presentación. Esa fecha es el punto de partida de todos los plazos posteriores, así que conviene tenerla escrita.",
      },
      {
        titulo: "Comprueba que no hay una notificación que no has visto",
        detalle:
          "Una notificación electrónica se entiende rechazada si no se accede a ella en diez días naturales, y a partir de ahí el procedimiento sigue. Revisa la sede y la carpeta ciudadana antes de dar por hecho que hay silencio.",
      },
      {
        titulo: "Decide entre esperar, recurrir o abrir una vía paralela",
        detalle:
          "No siempre conviene recurrir de inmediato. A veces la vía más rápida es otra figura de arraigo por la que ya cumples requisitos. Esa decisión depende de tu caso concreto y de qué documentación tienes.",
      },
    ],
    erroresTipicos: [
      "Contar los tres meses desde la fecha de la cita y no desde la presentación efectiva.",
      "Dar por hecho que el silencio impide que llegue después una resolución expresa. Puede llegar, y cambia los plazos.",
      "Dejar pasar los seis meses del contencioso creyendo que, al no haber plazo de cierre en la reposición, tampoco lo hay en la vía judicial.",
      "No revisar las notificaciones electrónicas, que se entienden practicadas aunque no se hayan leído.",
    ],
    servicio: { etiqueta: "Recurso administrativo", href: "/precios#recursos" },
    urgente: true,
    faqs: [
      {
        q: "¿Cuánto tiene la Administración para resolver la regularización?",
        a: "Tres meses desde la presentación de la solicitud. Transcurrido ese plazo sin notificación, el silencio tiene efecto desestimatorio y se abre la vía de recurso.",
      },
      {
        q: "¿El silencio negativo significa que me han denegado?",
        a: "Significa que puedes actuar como si te hubieran denegado, a efectos de recurrir. No es una decisión sobre el fondo de tu caso: la Administración sigue obligada a dictar una resolución expresa, que puede ser favorable.",
      },
      {
        q: "¿Cuánto tiempo tengo para recurrir el silencio?",
        a: "El recurso de reposición frente a un acto presunto puede interponerse en cualquier momento a partir del día siguiente a aquel en que se produzcan los efectos del silencio (art. 124, Ley 39/2015). El contencioso-administrativo tiene seis meses desde esa misma fecha (art. 46, Ley 29/1998).",
      },
      {
        q: "¿Puedo pedir otra cosa mientras tanto?",
        a: "Depende de tu situación. En algunos casos existe una figura de arraigo por la que ya se cumplen requisitos y que resuelve antes que un recurso. Es una decisión que requiere ver tu documentación real.",
      },
    ],
    datos: [
      HECHOS.plazoResolucion,
      HECHOS.computoPlazos,
      HECHOS.silencioNegativo,
      HECHOS.reposicionSilencio,
      HECHOS.contenciosoPresunto,
    ],
  },

  {
    id: "denegacion",
    comoLoVives: "Me la han denegado",
    nombreTecnico: "Resolución denegatoria",
    titulo: "Me han denegado la regularización: plazos y vía de recurso",
    h1: "Me han denegado la regularización",
    meta: "Una denegación abre un plazo de un mes para la reposición y dos meses para el contencioso. Qué se recurre, cómo se construye el recurso y qué motivos se combaten mejor.",
    loEsencial: [
      "El recurso de reposición se interpone en un mes desde el día siguiente a la notificación (art. 124, Ley 39/2015).",
      "El recurso contencioso-administrativo, en dos meses desde el día siguiente a la notificación (art. 46, Ley 29/1998).",
      "La reposición es potestativa: se puede ir directamente al contencioso.",
      "Interponer reposición suspende el plazo del contencioso hasta que se resuelva o transcurra el plazo para resolverla.",
      "El recurso se construye contra el motivo concreto de la denegación, no contra la denegación en general.",
    ],
    comoSaberQueEsTuCaso: [
      "El documento contiene una decisión: «se deniega», «se desestima».",
      "Incluye un apartado de motivación con los hechos y los fundamentos.",
      "Termina con un pie de recurso que indica qué recurso cabe, ante quién y en qué plazo.",
    ],
    quePuedesHacer: [
      {
        titulo: "Lee el motivo exacto, no el resultado",
        detalle:
          "Una denegación por falta de acreditación de un requisito se combate aportando prueba. Una por interpretación de la norma se combate con argumentación jurídica. Son escritos completamente distintos.",
      },
      {
        titulo: "Anota los dos plazos el mismo día",
        detalle:
          "Un mes para la reposición, dos para el contencioso, ambos desde el día siguiente a la notificación. El segundo sigue corriendo mientras decides sobre el primero.",
      },
      {
        titulo: "Valora si hay una vía paralela más rápida que el recurso",
        detalle:
          "Un recurso puede tardar más que una solicitud nueva por otra figura para la que ya cumples requisitos. No siempre, pero es la primera pregunta que hay que hacerse.",
      },
    ],
    erroresTipicos: [
      "Recurrir sin leer la motivación, repitiendo lo ya presentado.",
      "Dejar pasar el mes de la reposición creyendo que el contencioso empieza después.",
      "Aportar en el recurso documentación que no se pidió y no aportar la que sí rebate el motivo.",
      "Presentar el recurso ante un órgano distinto del que indica el pie de recurso.",
    ],
    servicio: { etiqueta: "Recurso administrativo", href: "/precios#recursos" },
    urgente: true,
    faqs: [
      {
        q: "¿Cuánto tiempo tengo para recurrir una denegación?",
        a: "Un mes para el recurso de reposición y dos meses para el contencioso-administrativo, ambos contados desde el día siguiente al de la notificación.",
      },
      {
        q: "¿Tengo que presentar reposición antes de ir al juzgado?",
        a: "No. La reposición es potestativa: se puede acudir directamente al contencioso-administrativo. Si se interpone reposición, hay que esperar a que se resuelva o a que venza su plazo antes de acudir al juzgado.",
      },
      {
        q: "¿Puedo volver a solicitar en lugar de recurrir?",
        a: "El procedimiento extraordinario está cerrado, así que no por esa vía. Sí puede caber una solicitud por otra figura de arraigo si se cumplen sus requisitos, y a veces resuelve antes que un recurso.",
      },
    ],
    datos: [HECHOS.reposicionExpresa, HECHOS.contenciosoExpreso, HECHOS.computoPlazos],
  },

  {
    id: "inadmision",
    comoLoVives: "No me la han admitido a trámite",
    nombreTecnico: "Inadmisión a trámite",
    titulo: "Inadmisión a trámite de la regularización: qué la distingue de una denegación",
    h1: "No me han admitido a trámite la regularización",
    meta: "Inadmitir no es denegar: la Administración no ha entrado en el fondo. Qué se recurre, con qué plazo y por qué el escrito es distinto al de una denegación.",
    loEsencial: [
      "Inadmitir a trámite no es denegar: la Administración no ha llegado a valorar si cumples los requisitos.",
      "La inadmisión se apoya en un defecto de acceso al procedimiento, no en el fondo del caso.",
      "El plazo de reposición es de un mes desde el día siguiente a la notificación (art. 124, Ley 39/2015).",
      "El contencioso-administrativo, dos meses desde la notificación (art. 46, Ley 29/1998).",
      "El escrito debe combatir el motivo de inadmisión; discutir el fondo antes de derribarlo no sirve de nada.",
    ],
    comoSaberQueEsTuCaso: [
      "El documento dice «se inadmite a trámite» o «no ha lugar a admitir».",
      "No hay valoración de si cumples o no los requisitos de la figura solicitada.",
      "El motivo se refiere a la presentación: plazo, legitimación, requisito de acceso, duplicidad.",
    ],
    quePuedesHacer: [
      {
        titulo: "Identifica el motivo de inadmisión con precisión",
        detalle:
          "Presentar fuera de plazo, no reunir un requisito de acceso o tener otro procedimiento en curso son motivos distintos, y cada uno se rebate de una forma.",
      },
      {
        titulo: "Comprueba si el motivo es cierto",
        detalle:
          "Las inadmisiones por error material —una fecha mal leída, un documento que sí constaba— existen, y se resuelven acreditando el hecho.",
      },
      {
        titulo: "Recurre contra la inadmisión, no contra el fondo",
        detalle:
          "El objetivo del recurso es que el expediente entre a trámite. Sólo cuando entra tiene sentido discutir si cumples los requisitos.",
      },
    ],
    erroresTipicos: [
      "Tratar la inadmisión como una denegación y argumentar sobre el fondo.",
      "Presentar una solicitud nueva idéntica en lugar de recurrir la inadmisión.",
      "Dejar pasar el plazo creyendo que, al no haber decisión sobre el fondo, no hay nada que recurrir.",
    ],
    servicio: { etiqueta: "Recurso administrativo", href: "/precios#recursos" },
    urgente: true,
    faqs: [
      {
        q: "¿Qué diferencia hay entre inadmitir y denegar?",
        a: "Denegar es decidir que no cumples los requisitos, tras haberlos valorado. Inadmitir es no llegar a valorarlos, por un defecto de acceso al procedimiento. La consecuencia práctica es la misma —no obtienes la autorización— pero lo que hay que combatir en el recurso es distinto.",
      },
      {
        q: "¿Qué recurso cabe frente a una inadmisión?",
        a: "Los mismos que frente a una denegación: reposición en un mes o contencioso-administrativo en dos, desde el día siguiente a la notificación. Lo que cambia es el contenido del escrito, no el plazo.",
      },
    ],
    datos: [HECHOS.reposicionExpresa, HECHOS.contenciosoExpreso, HECHOS.computoPlazos],
  },

  {
    id: "no-presente",
    comoLoVives: "No llegué a presentarla",
    nombreTecnico: "Fuera del procedimiento extraordinario",
    titulo: "No presenté la regularización: qué opciones quedan",
    h1: "No llegué a presentar la regularización",
    meta: "El procedimiento extraordinario está cerrado, pero las figuras de arraigo del Reglamento siguen vigentes. Cuáles hay, en qué se diferencian y por dónde empezar.",
    loEsencial: [
      "El plazo del procedimiento extraordinario se cerró el 30 de junio de 2026 y no se ha reabierto.",
      "Las figuras de arraigo del Reglamento de Extranjería siguen vigentes y son la vía ordinaria.",
      "Cada figura de arraigo exige un periodo de permanencia y unos requisitos distintos.",
      "El punto de partida es siempre el mismo: cuánto tiempo llevas en España y qué puedes acreditar.",
      "El empadronamiento continuado suele ser la prueba principal de permanencia, y conviene revisarlo antes que nada.",
    ],
    comoSaberQueEsTuCaso: [
      "No presentaste solicitud entre el 16 de abril y el 30 de junio de 2026.",
      "O la presentaste y fue archivada por desistimiento sin entrar en el fondo.",
    ],
    quePuedesHacer: [
      {
        titulo: "Audita tu permanencia antes que ninguna otra cosa",
        detalle:
          "El tiempo acreditable en España determina qué figuras están a tu alcance. Un padrón con un hueco de meses cambia por completo el análisis, y es mejor descubrirlo ahora.",
      },
      {
        titulo: "Compara las figuras por lo que puedes acreditar, no por su nombre",
        detalle:
          "Las modalidades de arraigo se distinguen por el tipo de vínculo que acreditas —social, laboral, formativo, familiar—. La pregunta útil no es cuál prefieres, sino cuál puedes probar.",
      },
      {
        titulo: "Revisa qué te falta y cuánto tarda en conseguirse",
        detalle:
          "Un certificado de antecedentes penales de tu país puede tardar semanas y necesita apostilla y traducción. Empezar por ahí ahorra meses.",
      },
    ],
    erroresTipicos: [
      "Esperar a que se reabra el procedimiento extraordinario.",
      "Elegir la figura de arraigo por el nombre en lugar de por lo que se puede acreditar.",
      "Dejar caducar el empadronamiento o cambiar de domicilio sin actualizarlo.",
      "Solicitar los antecedentes penales al final del proceso en lugar de al principio.",
    ],
    servicio: { etiqueta: "Gestión de arraigo", href: "/tramites/categoria/arraigo" },
    urgente: false,
    faqs: [
      {
        q: "¿Se va a reabrir el plazo de la regularización?",
        a: "No consta ninguna previsión oficial de reapertura. El plazo se cerró el 30 de junio de 2026. Lo que sigue vigente son las figuras de arraigo del Reglamento de Extranjería, que son la vía ordinaria.",
      },
      {
        q: "¿Qué figura de arraigo me corresponde?",
        a: "Depende del tiempo de permanencia que puedas acreditar y del tipo de vínculo que tengas —laboral, social, formativo o familiar—. El diagnóstico gratuito recorre esas preguntas y señala las vías que pueden encajar, indicando qué habría que verificar en cada una.",
      },
    ],
    datos: [HECHOS.plazoSolicitud],
  },

  {
    id: "concedida",
    comoLoVives: "Me la han concedido",
    nombreTecnico: "Resolución favorable",
    titulo: "Me han concedido la regularización: de la resolución a la TIE",
    h1: "Me han concedido la regularización",
    meta: "La resolución favorable no es el final: queda la huella y la TIE. Qué plazos hay, qué documentación se lleva a la cita y qué hacer si la tarjeta tarda.",
    loEsencial: [
      "La resolución favorable concede la autorización, pero la tarjeta física es un trámite posterior.",
      "El siguiente paso es la cita para la toma de huellas y la expedición de la TIE.",
      "La autorización empieza a producir efectos desde la notificación de la resolución favorable.",
      "Conviene guardar la resolución: es el documento que acredita tu situación mientras no tengas la tarjeta.",
      "Los plazos de cita para la toma de huellas varían mucho entre comisarías.",
    ],
    comoSaberQueEsTuCaso: [
      "El documento dice «se concede» o «se estima» la solicitud.",
      "Indica el tipo y la duración de la autorización concedida.",
      "Suele señalar el plazo para solicitar la tarjeta.",
    ],
    quePuedesHacer: [
      {
        titulo: "Pide cita para la huella en cuanto tengas la resolución",
        detalle:
          "Los plazos de cita son el cuello de botella real. Cuanto antes la pidas, antes tienes la tarjeta en la mano.",
      },
      {
        titulo: "Prepara la documentación de la cita antes de que llegue el día",
        detalle:
          "Fotografía con los requisitos exactos, tasa abonada, pasaporte y resolución. Un requisito mal cumplido en la cita significa pedir otra.",
      },
      {
        titulo: "Guarda la resolución mientras esperas la tarjeta",
        detalle:
          "Es el documento que acredita tu situación en ese periodo intermedio. Consérvala en digital y en papel.",
      },
    ],
    erroresTipicos: [
      "Esperar a recibir la tarjeta para empezar a hacer trámites que ya se pueden hacer con la resolución.",
      "Acudir a la cita con una fotografía que no cumple los requisitos.",
      "No abonar la tasa antes de la cita.",
      "Perder la resolución y no tener copia.",
    ],
    servicio: { etiqueta: "Gestión de la TIE", href: "/tramites" },
    urgente: false,
    faqs: [
      {
        q: "Me han concedido la regularización, ¿ya puedo trabajar?",
        a: "Depende del tipo de autorización concedida, que consta en la propia resolución. La resolución indica la duración y si habilita a trabajar. Es el primer dato que hay que leer en ella.",
      },
      {
        q: "¿Cuánto tarda la TIE después de la concesión?",
        a: "El tiempo depende sobre todo del plazo de cita para la toma de huellas, que varía mucho entre comisarías y provincias. La expedición posterior es rápida en comparación.",
      },
    ],
    datos: [],
  },
];

export function estado(id: string): Estado | undefined {
  return ESTADOS.find((e) => e.id === id);
}

/** Los hechos que van en el bloque «Lo esencial» del hub. */
export const LO_ESENCIAL_HUB: string[] = [
  "El plazo de solicitud fue del 16 de abril al 30 de junio de 2026 y está cerrado.",
  "La subsanación de documentación sigue abierta hasta el 30 de septiembre de 2026.",
  "Se presentaron 1.174.978 solicitudes; 609.737 estaban procesadas a 2 de julio de 2026.",
  "El plazo de resolución es de tres meses y el silencio es negativo.",
  "Frente al silencio, la reposición no tiene plazo de cierre; el contencioso, seis meses.",
  "No hay datos oficiales de concesiones y denegaciones: cualquier tasa de éxito que circule no es oficial.",
];
