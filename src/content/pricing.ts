/**
 * HONORARIOS.
 *
 * Los importes van en céntimos y son la única fuente de verdad del sitio.
 * Cuando se active la integración con Stripe pasan a ser claves de búsqueda
 * de Price; hasta entonces, nada en el sitio puede mostrar un precio que no
 * esté aquí.
 *
 * Todo plan declara `excludes`. Un precio sin lista de exclusiones es un
 * sobrecoste esperando a aparecer, y este producto no hace eso.
 *
 * ─── CUATRO LÍNEAS CON PRECIO CERRADO, EL RESTO A MEDIDA ────────────────
 *
 * Solo cuatro servicios publican importe: arraigo, nacionalidad, nómada
 * digital y renovaciones. Son las cuatro vías con volumen suficiente para
 * que el despacho sepa lo que cuesta tramitarlas de verdad, y donde está
 * toda la inversión de contenido del sitio.
 *
 * Los otros dos —familia y recursos— salen a presupuesto. No es una forma
 * elegante de esconder el precio: es que el alcance real de una reagrupación
 * o de un recurso depende de cosas que no se saben antes de leer el
 * expediente, y publicar un «desde» que luego se dobla es exactamente la
 * práctica que este producto dice combatir. Antes que un número que va a
 * cambiar, ninguno.
 *
 * Lo mismo vale para las fichas de trámite: solo llevan honorarios las que
 * caen dentro de estas cuatro líneas. Ver la nota en `tramites.ts`.
 */

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** null = quoted after the diagnosis. Never show "desde" without a number. */
  priceCents: number | null;
  priceNote?: string;
  /** true = the recommended entry point, styled as the anchor card. */
  featured?: boolean;
  includes: string[];
  excludes: string[];
  cta: { label: string; href: string };
  /** Stripe Price lookup key, wired when features.stripe is enabled. */
  stripeLookupKey?: string;
  glyph: string;
}

export const ENTRY_PLANS: Plan[] = [
  {
    id: "diagnostico",
    name: "Diagnóstico de Extranjería",
    tagline: "Orientación preliminar automatizada sobre tu situación.",
    priceCents: 0,
    priceNote: "Gratis, sin registro",
    includes: [
      "Cuestionario guiado de 8 a 12 preguntas",
      "Vías que pueden encajar con tu situación",
      "Qué hace falta verificar en tu caso",
      "Documentación orientativa y honorarios",
      "Resultado descargable en PDF",
    ],
    excludes: [
      "No es asesoramiento jurídico ni validación profesional",
      "No garantiza que cumplas los requisitos",
    ],
    cta: { label: "Hacer el diagnóstico", href: "/diagnostico" },
    glyph: "path",
  },
  {
    id: "consulta",
    name: "Consulta con especialista",
    tagline: "45 minutos con un profesional que revisa tu caso de verdad.",
    priceCents: 3900,
    priceNote: "Se descuenta si contratas la gestión",
    featured: true,
    includes: [
      "Videollamada de 45 minutos",
      "Revisión previa de tu diagnóstico y tus documentos",
      "Estrategia recomendada y alternativas",
      "Plan documental concreto por escrito",
      "Resumen escrito tras la consulta",
    ],
    excludes: [
      "No incluye la presentación del expediente",
      "No incluye redacción de escritos ni recursos",
    ],
    cta: { label: "Reservar consulta", href: "/citas" },
    stripeLookupKey: "consulta_inicial",
    glyph: "clock",
  },
  {
    id: "revision",
    name: "Revisión documental",
    tagline: "Que no te devuelvan el expediente por un documento mal traído.",
    priceCents: 7900,
    includes: [
      "Revisión de hasta 12 documentos",
      "Comprobación de vigencia, legalización y traducción",
      "Informe con correcciones concretas por documento",
      "Una segunda revisión tras tus correcciones",
    ],
    excludes: [
      "No incluye traducciones juradas ni apostillas",
      "No incluye la presentación del expediente",
    ],
    cta: { label: "Contratar revisión", href: "/entrar?next=/app/documentos" },
    stripeLookupKey: "revision_documental",
    glyph: "doc",
  },
];

export const MANAGED_PLANS: Plan[] = [
  {
    id: "arraigo",
    name: "Arraigo",
    tagline: "Gestión integral de cualquier modalidad de arraigo.",
    priceCents: 53900,
    priceNote: "desde",
    featured: true,
    includes: [
      "Diagnóstico y estrategia jurídica",
      "Plan documental personalizado",
      "Revisión de cada documento por tu especialista",
      "Redacción y presentación telemática",
      "Seguimiento del expediente hasta la resolución",
      "Respuesta a un requerimiento de subsanación incluida",
      "Expediente y mensajería en tu área privada",
    ],
    excludes: [
      "Tasas administrativas (modelo 790)",
      "Traducciones juradas y apostillas",
      "Informe de arraigo si tu comunidad lo tarifa",
      "Desplazamientos y citas presenciales",
    ],
    cta: { label: "Comprobar mi encaje", href: "/diagnostico" },
    stripeLookupKey: "gestion_arraigo",
    glyph: "roots",
  },
  {
    id: "nacionalidad",
    name: "Nacionalidad española",
    tagline: "Auditoría de residencia, expediente y seguimiento hasta la jura.",
    priceCents: 47900,
    priceNote: "desde",
    includes: [
      "Auditoría de años de residencia legal y ausencias",
      "Plan de exámenes CCSE y DELE",
      "Preparación de legalizaciones y traducciones",
      "Presentación telemática del expediente",
      "Seguimiento y respuesta a requerimientos",
      "Acompañamiento hasta la jura e inscripción",
    ],
    excludes: [
      "Tasa de la solicitud",
      "Tasas de los exámenes CCSE y DELE",
      "Traducciones juradas y apostillas",
    ],
    cta: { label: "Comprobar mi encaje", href: "/diagnostico" },
    stripeLookupKey: "gestion_nacionalidad",
    glyph: "passport",
  },
  {
    id: "nomada",
    name: "Nómada digital",
    tagline: "Teletrabajo internacional, para ti y para tu familia.",
    priceCents: 89900,
    priceNote: "desde",
    includes: [
      "Estrategia: visado consular o autorización desde España",
      "Dossier económico y de actividad",
      "Revisión de contratos y facturación",
      "Presentación ante la unidad competente",
      "Extensión a la unidad familiar",
      "Seguimiento hasta la resolución y la TIE",
    ],
    excludes: [
      "Tasas administrativas y consulares",
      "Seguro médico",
      "Traducciones juradas y apostillas",
      "Asesoramiento fiscal",
    ],
    cta: { label: "Comprobar mi encaje", href: "/diagnostico" },
    stripeLookupKey: "gestion_nomada",
    glyph: "signal",
  },
  {
    id: "familia",
    name: "Familia",
    tagline: "Reagrupación familiar y régimen comunitario.",
    // A medida: el alcance depende del régimen aplicable, de cuántos
    // familiares entran y de si hace falta informe de vivienda. Un «desde»
    // aquí sería un número que cambia en la primera llamada.
    priceCents: null,
    includes: [
      "Diagnóstico del vínculo y del régimen aplicable",
      "Gestión del informe de vivienda cuando proceda",
      "Preparación de la documentación registral",
      "Presentación y seguimiento",
      "Coordinación con el consulado del familiar",
    ],
    excludes: [
      "Tasas administrativas y consulares",
      "Informe de vivienda si el ayuntamiento lo tarifa",
      "Traducciones juradas y apostillas",
    ],
    cta: { label: "Solicitar presupuesto", href: "/diagnostico" },
    glyph: "family",
  },
  {
    id: "renovacion",
    name: "Renovaciones y TIE",
    tagline: "Que una fecha no te devuelva a la casilla de salida.",
    priceCents: 35900,
    priceNote: "desde",
    includes: [
      "Auditoría de cotizaciones y de tu vida laboral",
      "Cálculo de la ventana exacta de presentación",
      "Presentación telemática en plazo",
      "Gestión de la cita de huellas",
      "Avisos automáticos antes de cada caducidad",
    ],
    excludes: ["Tasas administrativas", "Desplazamientos a la cita de huellas"],
    cta: { label: "Comprobar mi encaje", href: "/diagnostico" },
    stripeLookupKey: "gestion_renovacion",
    glyph: "cycle",
  },
  {
    id: "recursos",
    name: "Recursos y requerimientos",
    tagline: "Cuando la Administración responde y hay poco tiempo.",
    // A medida: no cuesta lo mismo contestar un requerimiento de dos
    // documentos que fundamentar una alzada contra una denegación motivada.
    // El importe sale del análisis de viabilidad, que es gratuito.
    priceCents: null,
    includes: [
      "Análisis de viabilidad honesto antes de cobrarte el recurso",
      "Lectura urgente de la notificación en 24 h",
      "Redacción del escrito con fundamentación",
      "Presentación telemática y seguimiento",
    ],
    excludes: [
      "Vía judicial contencioso-administrativa (presupuesto aparte)",
      "Procurador, peritos y eventuales costas",
      "Traducciones juradas",
    ],
    cta: { label: "Tengo un requerimiento", href: "/diagnostico?objetivo=requerimiento" },
    glyph: "scales",
  },
];

/** Third-party costs we never absorb and always name up front. */
export const THIRD_PARTY_COSTS = [
  {
    label: "Tasas administrativas",
    detail:
      "Modelo 790 según el trámite. Se abonan directamente a la Administración y su importe lo fija el Estado.",
  },
  {
    label: "Traducciones juradas",
    detail:
      "Necesarias para documentos emitidos en otro idioma. Trabajamos con traductores jurados y te pasamos su presupuesto sin recargo.",
  },
  {
    label: "Apostilla y legalización",
    detail:
      "La realiza la autoridad competente del país emisor. Te indicamos exactamente qué documento la necesita y cómo obtenerla.",
  },
  {
    label: "Exámenes CCSE y DELE",
    detail: "Solo para nacionalidad. Los abona el solicitante al Instituto Cervantes.",
  },
  {
    label: "Informes de la Administración",
    detail:
      "Informe de arraigo o de vivienda adecuada. Algunos ayuntamientos y comunidades los tarifan.",
  },
  {
    label: "Seguro médico",
    detail:
      "Exigido en varias vías. Debe cumplir condiciones concretas; te decimos cuáles antes de que lo contrates.",
  },
];

export const PAYMENT_TERMS = [
  "Presupuesto cerrado por escrito antes de empezar. Si el alcance cambia, se acuerda contigo antes.",
  "Publicamos precio en las cuatro vías que tramitamos con volumen suficiente para comprometerlo. En el resto damos presupuesto tras el diagnóstico, en lugar de un «desde» que habría que corregir al alza.",
  "Puedes pagar en una sola vez o fraccionado en dos plazos, sin coste adicional.",
  "El importe de la consulta inicial se descuenta si contratas la gestión.",
  "Si tras el análisis de viabilidad tu caso no tiene recorrido, te lo decimos antes de cobrarte el trámite.",
  "Factura para cada pago, disponible en tu área privada.",
];
