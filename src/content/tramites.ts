import type { Tramite } from "./taxonomy";

/**
 * CATÁLOGO DE TRÁMITES.
 *
 * Todo el contenido jurídico de este archivo está marcado
 * `pendingLegalReview: true` y la UI lo refleja con un aviso visible.
 * Ningún requisito aquí descrito debe publicarse como definitivo hasta que
 * el profesional responsable lo valide y firme (ver CONTENIDO-PENDIENTE-REVISION.md).
 *
 * Referencia normativa de base: LO 4/2000, RD 1155/2024 (Reglamento de
 * Extranjería), Ley 14/2013 y Código Civil para nacionalidad.
 *
 * ─── QUÉ FICHA PUBLICA HONORARIOS Y CUÁL NO ─────────────────────────────
 *
 * Las 25 vías siguen aquí con su ficha completa: quien busca «tarjeta de
 * familiar de comunitario» encuentra requisitos, documentos y plazos igual
 * que antes. Lo que cambia es el precio.
 *
 * Solo llevan `feeFromCents` las fichas que caen dentro de una de las cuatro
 * líneas de servicio con precio cerrado —arraigo, nómadas, nacionalidad y
 * renovaciones, ver `pricing.ts`—. Son once. Las catorce restantes van con
 * `feeFromCents: null`, que la interfaz muestra como «Presupuesto a medida».
 *
 * El motivo no es comercial sino de honestidad operativa: el despacho solo
 * puede comprometer un importe en las vías que tramita con volumen suficiente
 * para saber lo que cuestan. Publicar «desde 749 €» en un trámite que todavía
 * no se ha hecho veinte veces es prometer un número que se va a corregir en
 * la primera llamada, y un precio que se corrige al alza destruye más
 * confianza de la que ganó al publicarse.
 *
 * Una ficha sin honorarios no es una ficha incompleta: es una ficha que no
 * miente sobre lo que no sabe.
 */

const REVIEW = "2026-09-05";

export const TRAMITES: Tramite[] = [
  /* ================================ ARRAIGO ================================ */
  {
    slug: "arraigo-sociolaboral",
    name: "Arraigo sociolaboral",
    category: "arraigo",
    alsoIn: ["trabajo", "residencia"],
    tagline: "Regulariza tu situación con un contrato de trabajo sobre la mesa.",
    metaDescription:
      "Arraigo sociolaboral en España: requisitos, documentación, plazos y honorarios. Comprueba tu encaje en 3 minutos y gestiónalo 100% online.",
    whatItIs:
      "Una autorización de residencia y trabajo para personas que ya llevan un tiempo viviendo en España y cuentan con una oferta o un contrato de trabajo que cumple las condiciones exigidas. Es una de las vías más utilizadas para pasar de una situación irregular a una situación administrativa estable.",
    forWho: [
      "Personas que residen en España de forma continuada durante el periodo mínimo exigido.",
      "Quien dispone de un contrato o de una oferta firme de trabajo por cuenta ajena.",
      "Quien puede acreditar su permanencia mediante empadronamiento y otros medios de prueba.",
    ],
    requirements: [
      "Permanencia continuada en España durante el periodo mínimo exigido por la normativa vigente.",
      "Contrato u oferta de trabajo que garantice la retribución mínima aplicable.",
      "Carecer de antecedentes penales en España y en los países de residencia previos.",
      "No encontrarse en situación de prohibición de entrada ni figurar como rechazable.",
    ],
    needsVerification: [
      "Cómputo exacto de la permanencia continuada y de las ausencias del territorio.",
      "Condiciones concretas del contrato: jornada, duración, retribución y convenio aplicable.",
      "Vigencia y traducción/legalización del certificado de antecedentes penales.",
      "Coherencia entre el empadronamiento y otros medios de prueba de permanencia.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente", note: "Todas las páginas, incluidas las que están en blanco." },
      { name: "Certificado de empadronamiento", source: "cliente", note: "Histórico y colectivo si convives con más personas." },
      { name: "Contrato u oferta de trabajo firmada", source: "cliente" },
      { name: "Documentación de la empresa contratante", source: "cliente" },
      { name: "Certificado de antecedentes penales del país de origen", source: "cliente", note: "Legalizado o apostillado y traducido." },
      { name: "Prueba de permanencia continuada", source: "cliente", note: "Informes médicos, matrículas, transferencias, contratos, etc." },
      { name: "Impreso oficial de solicitud", source: "nosotros" },
      { name: "Justificante de abono de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Analizamos tu situación y confirmamos si esta vía es la que mejor encaja.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Plan documental", detail: "Recibes la lista exacta de documentos, con instrucciones para cada uno.", actor: "extranjeria-segura", duration: "El mismo día" },
      { title: "Recopilación", detail: "Subes cada documento a tu expediente. Te avisamos de lo que falta.", actor: "cliente", duration: "Variable" },
      { title: "Revisión jurídica", detail: "Tu especialista revisa cada documento y te indica qué corregir.", actor: "extranjeria-segura", duration: "48–72 h" },
      { title: "Presentación telemática", detail: "Presentamos el expediente y te damos el justificante y el número.", actor: "extranjeria-segura", duration: "24 h" },
      { title: "Resolución", detail: "Seguimos el expediente y respondemos a cualquier requerimiento.", actor: "administracion", duration: "Según oficina" },
    ],
    feeFromCents: 53900,
    timeframe: "Los plazos de resolución varían según la Oficina de Extranjería. Te damos una estimación concreta para tu provincia en el diagnóstico.",
    adminFeesNote:
      "Las tasas administrativas (modelo 790) no están incluidas y se abonan directamente a la Administración. Tampoco se incluyen traducciones juradas, apostillas ni desplazamientos.",
    faqs: [
      { q: "¿Puedo solicitarlo si entré con visado de turista?", a: "La forma de entrada no impide por sí sola solicitar esta vía, pero sí condiciona cómo se acredita la permanencia. Es uno de los puntos que verificamos en el diagnóstico." },
      { q: "¿Y si tengo antecedentes penales?", a: "Depende del tipo de antecedente, de su antigüedad y de si está cancelado. No podemos anticipar un resultado sin revisar el certificado." },
      { q: "¿Necesito que la empresa haga algo?", a: "Sí. La empresa debe facilitar documentación y firmar el contrato u oferta. Te damos un dossier preparado para que se lo entregues." },
      { q: "¿Puedo trabajar mientras se resuelve?", a: "La autorización para trabajar surte efecto cuando se cumplen las condiciones previstas en la normativa. Te explicamos exactamente desde cuándo en tu caso." },
    ],
    sources: ["boe", "inclusion", "extranjeria"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["arraigo-social", "arraigo-socioformativo", "renovacion-residencia-trabajo"],
    seoCities: ["madrid", "barcelona", "valencia", "sevilla", "malaga", "murcia", "zaragoza", "bilbao", "alicante", "palma"],
    seoNationalities: ["colombianos", "venezolanos", "peruanos", "marroquies", "hondurenos", "ecuatorianos", "argentinos", "brasilenos"],
  },
  {
    slug: "arraigo-social",
    name: "Arraigo social",
    category: "arraigo",
    alsoIn: ["residencia"],
    tagline: "Para quien ha construido su vida aquí y tiene vínculos acreditables.",
    metaDescription:
      "Arraigo social: requisitos, documentación, informe de arraigo, plazos y coste. Comprueba tu encaje preliminar y gestiona el trámite 100% online.",
    whatItIs:
      "Autorización de residencia dirigida a personas que acreditan permanencia continuada en España y vínculos con la sociedad española, normalmente mediante un informe de arraigo emitido por la comunidad autónoma o el ayuntamiento.",
    forWho: [
      "Personas con permanencia continuada acreditable en España.",
      "Quien tiene vínculos familiares con residentes o puede obtener un informe de integración social.",
      "Quien no encaja en la vía sociolaboral por no disponer de contrato.",
    ],
    requirements: [
      "Permanencia continuada durante el periodo mínimo exigido.",
      "Vínculos familiares con extranjeros residentes o informe de arraigo favorable.",
      "Medios económicos suficientes según lo previsto en la normativa.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Qué administración emite el informe de arraigo en tu comunidad y qué exige.",
      "Cómputo de permanencia y ausencias.",
      "Acreditación concreta de medios económicos en tu caso.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente" },
      { name: "Empadronamiento histórico", source: "cliente" },
      { name: "Informe de arraigo social", source: "administracion", note: "Lo emite la CCAA o el ayuntamiento; te acompañamos en la solicitud." },
      { name: "Antecedentes penales del país de origen", source: "cliente", note: "Apostillado y traducido." },
      { name: "Acreditación de medios económicos", source: "cliente" },
      { name: "Documentación de vínculos familiares", source: "cliente", optional: true },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos vía, requisitos y qué informe necesitas.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Informe de arraigo", detail: "Preparamos y presentamos la solicitud del informe.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Recopilamos y revisamos todo el expediente.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación telemática y entrega del justificante.", actor: "extranjeria-segura" },
      { title: "Resolución y TIE", detail: "Seguimiento hasta la resolución y cita de huellas.", actor: "administracion" },
    ],
    feeFromCents: 53900,
    timeframe: "El informe de arraigo tiene su propio plazo, que se suma al del expediente principal. Te damos la estimación de tu comunidad autónoma.",
    adminFeesNote: "No incluye tasas, informe de arraigo si la CCAA lo tarifa, traducciones ni apostillas.",
    faqs: [
      { q: "¿Qué es exactamente el informe de arraigo?", a: "Es un informe emitido por la administración autonómica o local que valora tu integración. Los criterios y los plazos varían por territorio." },
      { q: "¿Sirve un contrato de trabajo?", a: "Si dispones de contrato, normalmente la vía sociolaboral encaja mejor. Lo comparamos en el diagnóstico." },
    ],
    sources: ["boe", "inclusion", "extranjeria"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["arraigo-sociolaboral", "arraigo-socioformativo", "arraigo-familiar"],
    seoCities: ["madrid", "barcelona", "valencia", "sevilla", "malaga", "murcia", "zaragoza", "bilbao"],
    seoNationalities: ["colombianos", "venezolanos", "peruanos", "marroquies", "ecuatorianos"],
  },
  {
    slug: "arraigo-socioformativo",
    name: "Arraigo socioformativo",
    category: "arraigo",
    alsoIn: ["estudios"],
    tagline: "Regularízate a través de una formación reglada o certificado de profesionalidad.",
    metaDescription:
      "Arraigo socioformativo: qué formación sirve, requisitos, documentación y plazos. Comprueba si encaja en tu caso y gestiónalo online.",
    whatItIs:
      "Vía de regularización pensada para quien se compromete a realizar una formación reglada para el empleo, un certificado de profesionalidad o una formación conducente a una titulación oficial.",
    forWho: [
      "Personas con permanencia continuada que quieren formarse para acceder al empleo.",
      "Quien no dispone de contrato de trabajo pero sí de una plaza formativa.",
    ],
    requirements: [
      "Permanencia continuada en España durante el periodo exigido.",
      "Matrícula o compromiso de matrícula en una formación admitida por la normativa.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Que la formación concreta esté dentro de las admitidas.",
      "Calendario del curso y compatibilidad con los plazos del expediente.",
      "Cómputo de permanencia.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente" },
      { name: "Empadronamiento histórico", source: "cliente" },
      { name: "Matrícula o compromiso de matrícula", source: "cliente" },
      { name: "Antecedentes penales del país de origen", source: "cliente" },
      { name: "Prueba de permanencia", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Validamos que tu formación encaja en esta vía.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparamos el expediente completo.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación telemática.", actor: "extranjeria-segura" },
      { title: "Seguimiento formativo", detail: "Te recordamos las obligaciones de aprovechamiento del curso.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 53900,
    timeframe: "Plazo de resolución variable por oficina. La formación tiene sus propios hitos que debes cumplir.",
    adminFeesNote: "No incluye tasas, matrícula del curso, traducciones ni apostillas.",
    faqs: [
      { q: "¿Vale cualquier curso?", a: "No. Debe ser una formación admitida por la normativa. Lo verificamos antes de que te matricules, para que no pagues un curso que no sirva." },
      { q: "¿Puedo trabajar con esta autorización?", a: "El alcance para trabajar depende de la modalidad concreta y de la normativa aplicable. Te lo concretamos en el diagnóstico." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["arraigo-sociolaboral", "arraigo-social", "residencia-estudios"],
    seoCities: ["madrid", "barcelona", "valencia", "sevilla", "malaga"],
  },
  {
    slug: "arraigo-familiar",
    name: "Arraigo familiar",
    category: "arraigo",
    alsoIn: ["familia"],
    tagline: "Cuando tu vínculo familiar en España es la vía más directa.",
    metaDescription:
      "Arraigo familiar en España: quién puede solicitarlo, requisitos, documentación y plazos. Diagnóstico gratuito y gestión online.",
    whatItIs:
      "Autorización de residencia para determinados familiares de personas de nacionalidad española o de menores españoles, con requisitos distintos y generalmente más ágiles que otras vías de arraigo.",
    forWho: [
      "Progenitores de menor de nacionalidad española a cargo.",
      "Determinados familiares de ciudadano español en los supuestos previstos.",
    ],
    requirements: [
      "Acreditar el vínculo familiar exigido.",
      "Convivencia o cumplimiento de las obligaciones respecto del menor, según el supuesto.",
      "Carecer de antecedentes penales en España.",
    ],
    needsVerification: [
      "Encaje exacto del supuesto familiar en la normativa vigente.",
      "Documentación registral del vínculo y su legalización.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente" },
      { name: "Certificado de nacimiento del menor o libro de familia", source: "cliente" },
      { name: "Empadronamiento conjunto", source: "cliente" },
      { name: "Antecedentes penales en España", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos el supuesto concreto que te aplica.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reunimos la prueba del vínculo.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación telemática y seguimiento.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 47900,
    timeframe: "Suele resolverse en plazos más cortos que otras vías de arraigo, pero depende de la oficina.",
    adminFeesNote: "No incluye tasas, traducciones ni apostillas.",
    faqs: [
      { q: "¿Necesito contrato de trabajo?", a: "En este supuesto no se exige contrato. Los requisitos giran en torno al vínculo familiar." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["arraigo-social", "tarjeta-familiar-comunitario", "reagrupacion-familiar"],
  },
  {
    slug: "arraigo-segunda-oportunidad",
    name: "Arraigo de segunda oportunidad",
    category: "arraigo",
    tagline: "Para quien tuvo autorización y la perdió.",
    metaDescription:
      "Arraigo de segunda oportunidad: para quién es, requisitos y documentación. Comprueba tu encaje preliminar en 3 minutos.",
    whatItIs:
      "Vía prevista para personas que fueron titulares de una autorización de residencia en España en los años previos y la perdieron, permitiéndoles recuperar una situación regular sin volver a empezar de cero.",
    forWho: [
      "Quien tuvo autorización de residencia y no pudo renovarla.",
      "Quien perdió la autorización por circunstancias sobrevenidas.",
    ],
    requirements: [
      "Haber sido titular de una autorización dentro del periodo previsto por la norma.",
      "Encontrarse en España.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Fechas exactas de vigencia de la autorización anterior.",
      "Motivo de la pérdida y si consta resolución desfavorable o expediente sancionador.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente" },
      { name: "TIE o resolución de la autorización anterior", source: "cliente" },
      { name: "Empadronamiento", source: "cliente" },
      { name: "Antecedentes penales", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Revisión del historial", detail: "Analizamos tu expediente administrativo previo.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reunimos la prueba de tu autorización anterior.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación telemática y seguimiento.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 53900,
    timeframe: "Variable según oficina.",
    adminFeesNote: "No incluye tasas ni traducciones.",
    faqs: [
      { q: "¿Y si tengo una resolución de expulsión?", a: "Cambia sustancialmente el análisis. Es lo primero que revisamos antes de plantear cualquier vía." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["arraigo-sociolaboral", "recurso-alzada"],
  },

  /* =============================== NÓMADAS ================================ */
  {
    slug: "teletrabajo-internacional",
    name: "Visado y residencia para teletrabajo internacional",
    shortName: "Nómada digital",
    category: "nomadas",
    alsoIn: ["residencia", "trabajo"],
    tagline: "Trabaja en remoto desde España, con todo en regla.",
    metaDescription:
      "Visado de nómada digital en España: requisitos de ingresos, documentación, plazos y coste. Solicitud desde el extranjero o desde España.",
    whatItIs:
      "Autorización prevista en la Ley 14/2013 para personas que trabajan en remoto para empresas o clientes situados fuera de España. Permite residir legalmente en España manteniendo tu actividad profesional a distancia.",
    forWho: [
      "Personas empleadas por una empresa extranjera que autoriza el trabajo en remoto.",
      "Profesionales autónomos con clientes mayoritariamente fuera de España.",
      "Quien quiere traer a su familia bajo la misma unidad familiar.",
    ],
    requirements: [
      "Relación laboral o profesional de al menos la antigüedad exigida con empresas de fuera de España.",
      "Que la empresa tenga la antigüedad de actividad mínima requerida.",
      "Ingresos suficientes según el umbral vinculado al SMI/IPREM aplicable.",
      "Titulación o experiencia profesional acreditable.",
      "Seguro médico y carencia de antecedentes penales.",
    ],
    needsVerification: [
      "Porcentaje de facturación que procede de clientes fuera de España, si eres autónomo.",
      "Umbral económico exacto vigente y cómo acreditarlo en tu caso.",
      "Si te conviene solicitar el visado en consulado o la autorización desde España.",
      "Situación de Seguridad Social y convenio bilateral aplicable.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Contrato de trabajo o contratos mercantiles", source: "cliente", note: "Con cláusula o autorización de trabajo en remoto." },
      { name: "Certificado de antigüedad de la empresa", source: "cliente" },
      { name: "Acreditación de ingresos", source: "cliente", note: "Nóminas, facturas, extractos bancarios." },
      { name: "Titulación universitaria o acreditación de experiencia", source: "cliente" },
      { name: "Seguro médico de cobertura completa en España", source: "cliente" },
      { name: "Antecedentes penales apostillados y traducidos", source: "cliente" },
      { name: "Certificado de cobertura de Seguridad Social o alta prevista", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico y estrategia", detail: "Decidimos si conviene visado consular o autorización desde España.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Dossier económico", detail: "Preparamos la acreditación de ingresos y actividad.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Recopilamos, traducimos y apostillamos lo necesario.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación ante la unidad competente.", actor: "extranjeria-segura" },
      { title: "Resolución y TIE", detail: "Resolución y cita para la tarjeta.", actor: "administracion" },
    ],
    feeFromCents: 89900,
    timeframe:
      "Las solicitudes tramitadas por la unidad de grandes empresas suelen tener plazos más cortos que la vía general. Te damos la estimación en el diagnóstico.",
    adminFeesNote:
      "No incluye tasas, seguro médico, traducciones juradas, apostillas ni asesoramiento fiscal. Podemos coordinarlo con un fiscalista si lo necesitas.",
    faqs: [
      { q: "¿Puedo tener clientes españoles?", a: "La normativa limita el porcentaje de actividad que puede desarrollarse con empresas situadas en España. Lo revisamos con tus facturas reales." },
      { q: "¿Cuántos años me dan?", a: "La duración depende de si se solicita como visado o como autorización, y de la vigencia de tu relación laboral." },
      { q: "¿Puedo traer a mi pareja e hijos?", a: "Sí, la normativa contempla la unidad familiar. Se tramita de forma conjunta o sucesiva." },
      { q: "¿Y los impuestos?", a: "Residir en España tiene consecuencias fiscales. No damos asesoramiento fiscal, pero te avisamos de qué debes revisar y con quién." },
    ],
    sources: ["boe", "inclusion", "exteriores"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["profesional-altamente-cualificado", "residencia-no-lucrativa", "emprendedores"],
    seoNationalities: ["brasilenos", "estadounidenses", "britanicos", "argentinos", "mexicanos", "colombianos", "rusos"],
    seoCities: ["madrid", "barcelona", "valencia", "malaga", "palma", "canarias"],
  },
  {
    slug: "profesional-altamente-cualificado",
    name: "Profesional altamente cualificado",
    category: "nomadas",
    alsoIn: ["trabajo"],
    tagline: "Vía rápida para perfiles con titulación y salario cualificado.",
    metaDescription:
      "Autorización de profesional altamente cualificado en España: requisitos, salario, documentación y plazos. Tramitación online.",
    whatItIs:
      "Autorización prevista en la Ley 14/2013 para profesionales contratados por empresas españolas en puestos que requieren titulación superior o experiencia equivalente y una retribución acorde.",
    forWho: [
      "Profesionales con oferta de una empresa española en un puesto cualificado.",
      "Empresas que necesitan incorporar talento internacional con plazos cortos.",
    ],
    requirements: [
      "Titulación superior o experiencia profesional equivalente acreditada.",
      "Contrato con una retribución acorde al puesto y al mercado.",
      "Empresa con actividad real y al corriente de obligaciones.",
      "Seguro o alta en Seguridad Social y carencia de antecedentes penales.",
    ],
    needsVerification: [
      "Encaje del puesto en la definición de altamente cualificado.",
      "Homologación o equivalencia del título cuando proceda.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Contrato de trabajo", source: "cliente" },
      { name: "Titulación acreditada", source: "cliente" },
      { name: "Documentación societaria y fiscal de la empresa", source: "cliente" },
      { name: "Antecedentes penales", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Análisis del puesto", detail: "Comprobamos encaje del puesto y de la retribución.", actor: "extranjeria-segura" },
      { title: "Dossier de empresa", detail: "Preparamos la documentación corporativa.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación ante la unidad competente.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 95900,
    timeframe: "La vía de Ley 14/2013 suele tener plazos de resolución cortos.",
    adminFeesNote: "No incluye tasas ni homologaciones de título.",
    faqs: [
      { q: "¿Sirve para trabajadores ya en España?", a: "En determinados supuestos sí puede solicitarse desde España. Depende de tu situación actual." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["teletrabajo-internacional", "residencia-trabajo-cuenta-ajena"],
  },

  /* ============================== RESIDENCIA =============================== */
  {
    slug: "residencia-no-lucrativa",
    name: "Residencia no lucrativa",
    category: "residencia",
    tagline: "Vivir en España con medios propios, sin trabajar aquí.",
    metaDescription:
      "Residencia no lucrativa en España: medios económicos exigidos, documentación, plazos y renovación. Tramitación 100% online.",
    whatItIs:
      "Autorización para residir en España sin realizar actividad laboral ni profesional, acreditando medios económicos suficientes y seguro médico. Es la vía habitual para jubilados, rentistas y personas con patrimonio propio.",
    forWho: [
      "Personas con rentas, pensiones o patrimonio suficientes.",
      "Quien quiere establecerse en España sin trabajar aquí.",
      "Familias que se trasladan con medios propios.",
    ],
    requirements: [
      "Medios económicos suficientes para el titular y, en su caso, la familia, referenciados al IPREM.",
      "Seguro médico privado de cobertura completa con entidad autorizada en España.",
      "Carecer de antecedentes penales.",
      "No encontrarse irregularmente en territorio español.",
    ],
    needsVerification: [
      "Importe exacto exigible según número de familiares y anualidad vigente.",
      "Que el seguro médico cumpla las condiciones exigidas (sin copagos ni carencias).",
      "Origen y estabilidad de los medios económicos.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Acreditación de medios económicos", source: "cliente", note: "Extractos, certificados bancarios, pensiones, rentas." },
      { name: "Póliza de seguro médico", source: "cliente" },
      { name: "Certificado médico", source: "cliente" },
      { name: "Antecedentes penales apostillados y traducidos", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico económico", detail: "Calculamos el umbral que te aplica y cómo acreditarlo.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparación, traducción y legalización.", actor: "cliente" },
      { title: "Solicitud consular", detail: "Presentación en el consulado correspondiente.", actor: "extranjeria-segura" },
      { title: "Llegada y TIE", detail: "Entrada en España y cita para la tarjeta.", actor: "cliente" },
    ],
    feeFromCents: null,
    timeframe: "Los plazos consulares varían de forma importante según el país. Te damos la referencia de tu consulado.",
    adminFeesNote: "No incluye tasas consulares, seguro médico, traducciones ni apostillas.",
    faqs: [
      { q: "¿Puedo trabajar en remoto con esta residencia?", a: "No es su finalidad. Si trabajas en remoto, la vía de teletrabajo internacional suele encajar mejor." },
      { q: "¿Cuánto dinero necesito?", a: "Se calcula a partir del IPREM del año en curso y del número de familiares. Te damos el importe exacto en el diagnóstico." },
    ],
    sources: ["boe", "exteriores", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["teletrabajo-internacional", "renovacion-residencia-trabajo", "reagrupacion-familiar"],
    seoNationalities: ["estadounidenses", "britanicos", "rusos", "mexicanos", "venezolanos"],
  },
  {
    slug: "residencia-larga-duracion",
    name: "Residencia de larga duración",
    category: "residencia",
    alsoIn: ["renovaciones"],
    tagline: "El paso que estabiliza tu vida en España de forma indefinida.",
    metaDescription:
      "Residencia de larga duración en España: requisitos de años, ausencias permitidas, documentación y renovación de la tarjeta.",
    whatItIs:
      "Autorización que permite residir y trabajar en España de forma indefinida, en las mismas condiciones que los españoles salvo las excepciones legales. Se obtiene tras acreditar el periodo de residencia legal y continuada exigido.",
    forWho: [
      "Personas con el periodo de residencia legal continuada exigido por la normativa.",
      "Quien busca estabilidad sin depender de renovaciones vinculadas al empleo.",
    ],
    requirements: [
      "Residencia legal y continuada durante el periodo exigido.",
      "No superar los límites de ausencia del territorio previstos.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Cómputo exacto de años y de ausencias.",
      "Continuidad entre autorizaciones sin lagunas.",
    ],
    documents: [
      { name: "Pasaporte y TIE en vigor", source: "cliente" },
      { name: "Certificado de vida laboral", source: "cliente" },
      { name: "Historial de autorizaciones previas", source: "cliente" },
      { name: "Empadronamiento", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Auditoría de tu historial", detail: "Revisamos años, lagunas y ausencias.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparación del expediente.", actor: "cliente" },
      { title: "Presentación y TIE", detail: "Presentación y cita de huellas.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Variable según oficina.",
    adminFeesNote: "No incluye tasas.",
    faqs: [
      { q: "¿Cuántos meses puedo estar fuera de España?", a: "Existen límites de ausencia y su cómputo es uno de los motivos más habituales de denegación. Lo auditamos antes de presentar." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["nacionalidad-por-residencia", "renovacion-residencia-trabajo"],
  },

  /* ================================ TRABAJO =============================== */
  {
    slug: "residencia-trabajo-cuenta-ajena",
    name: "Residencia y trabajo por cuenta ajena",
    category: "trabajo",
    alsoIn: ["residencia"],
    tagline: "Contratación inicial de un trabajador desde el extranjero.",
    metaDescription:
      "Autorización inicial de residencia y trabajo por cuenta ajena: requisitos para la empresa y el trabajador, documentación y plazos.",
    whatItIs:
      "Autorización inicial que permite a una empresa española contratar a una persona que se encuentra fuera de España, cuando el puesto encaja en los supuestos previstos por la normativa.",
    forWho: [
      "Empresas españolas que contratan talento internacional.",
      "Personas con una oferta firme desde fuera de España.",
    ],
    requirements: [
      "Oferta de empleo que cumpla la normativa laboral y de convenio.",
      "Que el puesto encaje en el catálogo de ocupaciones de difícil cobertura o en un supuesto exceptuado.",
      "Empresa solvente y al corriente de obligaciones.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Situación nacional de empleo aplicable al puesto.",
      "Solvencia de la empresa y ratio de plantilla.",
    ],
    documents: [
      { name: "Pasaporte del trabajador", source: "cliente" },
      { name: "Contrato de trabajo firmado", source: "cliente" },
      { name: "Documentación societaria, fiscal y laboral de la empresa", source: "cliente" },
      { name: "Titulación o acreditación profesional cuando proceda", source: "cliente" },
      { name: "Antecedentes penales apostillados", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Análisis del puesto", detail: "Comprobamos la vía correcta y la situación nacional de empleo.", actor: "extranjeria-segura" },
      { title: "Solicitud de la empresa", detail: "La empresa presenta la solicitud de autorización.", actor: "extranjeria-segura" },
      { title: "Visado", detail: "El trabajador solicita el visado en el consulado.", actor: "cliente" },
      { title: "Alta y TIE", detail: "Entrada, alta en Seguridad Social y cita de huellas.", actor: "cliente" },
    ],
    feeFromCents: null,
    timeframe: "Plazo administrativo más plazo consular. Te damos la estimación de ambos.",
    adminFeesNote: "No incluye tasas administrativas ni consulares, traducciones ni apostillas.",
    faqs: [
      { q: "¿Puede solicitarlo el trabajador?", a: "En la vía general la solicitud la presenta la empresa empleadora." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["profesional-altamente-cualificado", "residencia-trabajo-cuenta-propia", "arraigo-sociolaboral"],
  },
  {
    slug: "residencia-trabajo-cuenta-propia",
    name: "Residencia y trabajo por cuenta propia",
    category: "trabajo",
    alsoIn: ["residencia"],
    tagline: "Monta tu actividad en España con la autorización correcta.",
    metaDescription:
      "Residencia y trabajo por cuenta propia en España: plan de negocio, inversión, requisitos y documentación. Gestión online.",
    whatItIs:
      "Autorización para desarrollar una actividad por cuenta propia en España, acreditando la viabilidad del proyecto, la inversión prevista y el cumplimiento de los requisitos sectoriales.",
    forWho: [
      "Emprendedores y autónomos que quieren establecer su actividad en España.",
      "Profesionales colegiados que van a ejercer por cuenta propia.",
    ],
    requirements: [
      "Proyecto viable con plan de negocio e inversión acreditada.",
      "Cumplir los requisitos sectoriales y de habilitación de la actividad.",
      "Medios económicos para el establecimiento y el mantenimiento.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Requisitos de la actividad concreta y licencias necesarias.",
      "Suficiencia de la inversión prevista.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Plan de negocio", source: "cliente", note: "Te damos una plantilla y lo revisamos contigo." },
      { name: "Acreditación de inversión y medios", source: "cliente" },
      { name: "Titulación o habilitación profesional", source: "cliente", optional: true },
      { name: "Antecedentes penales", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico del proyecto", detail: "Analizamos viabilidad y requisitos sectoriales.", actor: "extranjeria-segura" },
      { title: "Plan de negocio", detail: "Revisión del plan y de la inversión.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación de la solicitud.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Variable según oficina y según informes sectoriales.",
    adminFeesNote: "No incluye tasas, licencias, notaría ni asesoría fiscal o contable.",
    faqs: [
      { q: "¿Necesito informe de una entidad?", a: "Según la actividad y la vía, puede requerirse informe de viabilidad. Lo verificamos antes." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["emprendedores", "teletrabajo-internacional"],
  },
  {
    slug: "emprendedores",
    name: "Residencia para emprendedores",
    category: "trabajo",
    alsoIn: ["nomadas", "residencia"],
    tagline: "Para proyectos de carácter innovador e interés económico.",
    metaDescription:
      "Visado y residencia para emprendedores en España (Ley 14/2013): informe ENISA, requisitos, documentación y plazos.",
    whatItIs:
      "Vía de la Ley 14/2013 para el desarrollo de una actividad emprendedora de carácter innovador y de especial interés económico para España, previo informe favorable del organismo competente.",
    forWho: [
      "Fundadores de startups con proyecto innovador.",
      "Equipos que quieren establecer su sede en España.",
    ],
    requirements: [
      "Proyecto innovador con informe favorable del organismo competente.",
      "Medios económicos suficientes.",
      "Seguro médico y carencia de antecedentes penales.",
    ],
    needsVerification: [
      "Encaje del proyecto en los criterios de innovación e interés económico.",
      "Estado del informe preceptivo y plazos.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Memoria del proyecto", source: "cliente" },
      { name: "Acreditación de medios económicos", source: "cliente" },
      { name: "Seguro médico", source: "cliente" },
      { name: "Antecedentes penales", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Preparación de la memoria", detail: "Estructuramos el proyecto según los criterios de valoración.", actor: "extranjeria-segura" },
      { title: "Informe favorable", detail: "Solicitud del informe preceptivo.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación de la solicitud de autorización o visado.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Depende del informe preceptivo y de la unidad competente.",
    adminFeesNote: "Presupuesto a medida tras el diagnóstico. No incluye tasas.",
    faqs: [
      { q: "¿Qué se considera innovador?", a: "Se valoran el perfil profesional, el plan de negocio y el valor añadido para la economía española. Trabajamos la memoria con ese marco." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["residencia-trabajo-cuenta-propia", "profesional-altamente-cualificado"],
  },

  /* ================================ ESTUDIOS ============================== */
  {
    slug: "residencia-estudios",
    name: "Estancia y residencia por estudios",
    category: "estudios",
    tagline: "Estudia en España con la autorización correcta desde el primer día.",
    metaDescription:
      "Visado y autorización de estancia por estudios en España: requisitos, medios económicos, seguro, documentación y prórroga.",
    whatItIs:
      "Autorización para permanecer en España con el fin de cursar estudios, formación, investigación o prácticas en un centro autorizado, con la posibilidad de prorrogarla mientras se mantengan las condiciones.",
    forWho: [
      "Estudiantes admitidos en universidades o centros autorizados.",
      "Investigadores y personas en programas de movilidad.",
      "Quien realiza prácticas o formación reglada.",
    ],
    requirements: [
      "Admisión en un centro de enseñanza autorizado.",
      "Medios económicos suficientes para el periodo de estancia.",
      "Seguro médico con cobertura en España.",
      "Carecer de antecedentes penales cuando la estancia supere el plazo previsto.",
    ],
    needsVerification: [
      "Que el centro y el programa estén dentro de los admitidos.",
      "Importe económico exigible según la duración.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Carta de admisión del centro", source: "cliente" },
      { name: "Acreditación de medios económicos", source: "cliente" },
      { name: "Seguro médico", source: "cliente" },
      { name: "Antecedentes penales cuando proceda", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos vía, plazos y si solicitas desde España o consulado.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparación del expediente completo.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación y seguimiento.", actor: "extranjeria-segura" },
      { title: "TIE", detail: "Cita de huellas si la estancia supera seis meses.", actor: "cliente" },
    ],
    feeFromCents: null,
    timeframe: "Variable según consulado u oficina.",
    adminFeesNote: "No incluye tasas, matrícula, seguro ni traducciones.",
    faqs: [
      { q: "¿Puedo trabajar mientras estudio?", a: "La normativa permite trabajar con límites de jornada y compatibilidad con los estudios. Te concretamos el alcance." },
      { q: "¿Puedo pasar de estudios a trabajo?", a: "Existe una vía de modificación. Los requisitos y el momento adecuado dependen de tu caso." },
    ],
    sources: ["boe", "inclusion", "exteriores"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["modificacion-estudios-trabajo", "arraigo-socioformativo"],
    seoCities: ["madrid", "barcelona", "valencia", "salamanca", "granada", "sevilla"],
  },
  {
    slug: "modificacion-estudios-trabajo",
    name: "Modificación de estudios a trabajo",
    category: "estudios",
    alsoIn: ["trabajo", "renovaciones"],
    tagline: "Convierte tu estancia por estudios en una autorización de trabajo.",
    metaDescription:
      "Modificación de estancia por estudios a residencia y trabajo en España: requisitos, plazos y documentación.",
    whatItIs:
      "Procedimiento para pasar de una estancia por estudios a una autorización de residencia y trabajo, cuando se cumplen las condiciones de permanencia y se dispone de una oferta laboral.",
    forWho: [
      "Estudiantes que han finalizado o están finalizando sus estudios.",
      "Quien ha recibido una oferta de trabajo en España.",
    ],
    requirements: [
      "Haber permanecido en España con estancia por estudios el tiempo exigido.",
      "Contrato u oferta que cumpla la normativa.",
      "Carecer de antecedentes penales.",
    ],
    needsVerification: [
      "Cómputo del tiempo de estancia y aprovechamiento de los estudios.",
      "Momento óptimo de presentación respecto a la caducidad de la estancia.",
    ],
    documents: [
      { name: "Pasaporte y TIE de estudios", source: "cliente" },
      { name: "Certificado de estudios superados", source: "cliente" },
      { name: "Contrato de trabajo", source: "cliente" },
      { name: "Documentación de la empresa", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Análisis de plazos", detail: "El momento de presentación es determinante.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Expediente del trabajador y de la empresa.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación telemática y seguimiento.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Variable según oficina.",
    adminFeesNote: "No incluye tasas.",
    faqs: [
      { q: "¿Cuándo debo presentarla?", a: "Hay ventanas temporales concretas respecto a la vigencia de tu estancia. Es el error más frecuente en esta modificación." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["residencia-estudios", "residencia-trabajo-cuenta-ajena"],
  },

  /* ================================ FAMILIA =============================== */
  {
    slug: "reagrupacion-familiar",
    name: "Reagrupación familiar",
    category: "familia",
    tagline: "Trae a tu familia contigo, con el expediente bien construido.",
    metaDescription:
      "Reagrupación familiar en España: requisitos de vivienda y medios económicos, familiares reagrupables, documentación y plazos.",
    whatItIs:
      "Procedimiento por el que una persona residente en España solicita la autorización de residencia de determinados familiares, acreditando vivienda adecuada y medios económicos suficientes.",
    forWho: [
      "Residentes que quieren reagrupar a cónyuge o pareja registrada.",
      "Residentes con hijos menores o personas a cargo.",
      "Quien reagrupa a ascendientes en los supuestos previstos.",
    ],
    requirements: [
      "Residencia legal en España durante el periodo exigido y renovación en curso o autorización vigente.",
      "Vivienda adecuada acreditada mediante informe.",
      "Medios económicos suficientes según el número de familiares.",
      "Acreditación del vínculo familiar legalizada y traducida.",
    ],
    needsVerification: [
      "Importe económico exigible según unidad familiar.",
      "Qué administración emite el informe de vivienda en tu municipio.",
      "Legalización de los certificados del país de origen.",
    ],
    documents: [
      { name: "Pasaporte y TIE del reagrupante", source: "cliente" },
      { name: "Informe de vivienda adecuada", source: "administracion" },
      { name: "Acreditación de medios económicos", source: "cliente" },
      { name: "Certificados de matrimonio o nacimiento legalizados", source: "cliente" },
      { name: "Pasaporte del familiar reagrupado", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Verificamos requisitos económicos y de vivienda.", actor: "extranjeria-segura" },
      { title: "Informe de vivienda", detail: "Solicitud y seguimiento del informe.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación de la solicitud en España.", actor: "extranjeria-segura" },
      { title: "Visado del familiar", detail: "Solicitud del visado en el consulado.", actor: "cliente" },
    ],
    feeFromCents: null,
    timeframe: "Plazo administrativo en España más plazo consular en el país del familiar.",
    adminFeesNote: "No incluye tasas, informe de vivienda si el ayuntamiento lo tarifa, traducciones ni apostillas.",
    faqs: [
      { q: "¿Puedo reagrupar a mi pareja de hecho?", a: "Sí en los supuestos previstos, acreditando el registro o la relación de forma admisible." },
      { q: "¿Cuánto dinero necesito?", a: "Se calcula sobre el IPREM y varía según el número de personas de la unidad familiar." },
    ],
    sources: ["boe", "inclusion", "exteriores"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["tarjeta-familiar-comunitario", "arraigo-familiar"],
    seoNationalities: ["venezolanos", "colombianos", "marroquies", "peruanos", "dominicanos", "chinos"],
    seoCities: ["madrid", "barcelona", "valencia", "murcia", "sevilla"],
  },
  {
    slug: "tarjeta-familiar-comunitario",
    name: "Tarjeta de familiar de ciudadano de la Unión",
    shortName: "Familiar de comunitario",
    category: "comunitarios",
    alsoIn: ["familia", "residencia"],
    tagline: "El régimen comunitario, cuando tu vínculo es con un ciudadano de la UE.",
    metaDescription:
      "Tarjeta de familiar de ciudadano de la Unión: requisitos, documentación, plazos y renovación. Régimen comunitario en España.",
    whatItIs:
      "Autorización de residencia por el régimen de la Unión Europea para familiares de ciudadanos de la UE, EEE o Suiza que ejercen su derecho de libre circulación en España. Sus requisitos y plazos son distintos del régimen general.",
    forWho: [
      "Cónyuges y parejas registradas de ciudadanos de la UE.",
      "Hijos y ascendientes a cargo en los supuestos previstos.",
      "Familiares de español en los casos asimilados.",
    ],
    requirements: [
      "Vínculo familiar acreditado y vigente.",
      "Que el ciudadano de la Unión resida en España cumpliendo las condiciones del régimen.",
      "Documentación de medios y seguro según el supuesto.",
    ],
    needsVerification: [
      "Encaje exacto del vínculo y del supuesto en el régimen comunitario.",
      "Situación del ciudadano de la Unión: trabajador, estudiante, inactivo con medios.",
    ],
    documents: [
      { name: "Pasaporte del solicitante", source: "cliente" },
      { name: "Documentación del ciudadano de la Unión", source: "cliente" },
      { name: "Certificado de matrimonio o pareja registrada", source: "cliente" },
      { name: "Empadronamiento conjunto", source: "cliente" },
      { name: "Acreditación de la situación del comunitario", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos que aplica el régimen comunitario.", actor: "extranjeria-segura" },
      { title: "Cita y documentación", detail: "Gestión de la cita y preparación del expediente.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación presencial o telemática según provincia.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "El régimen comunitario suele tener plazos de resolución más cortos que el régimen general.",
    adminFeesNote: "No incluye tasas, traducciones ni apostillas.",
    faqs: [
      { q: "¿Puedo trabajar con esta tarjeta?", a: "Sí, la tarjeta de familiar de comunitario habilita para trabajar en los términos previstos." },
    ],
    sources: ["boe", "inclusion", "policia"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["reagrupacion-familiar", "arraigo-familiar", "certificado-registro-ue"],
  },
  {
    slug: "certificado-registro-ue",
    name: "Certificado de registro de ciudadano de la Unión",
    shortName: "Certificado UE",
    category: "comunitarios",
    tagline: "El registro obligatorio si eres ciudadano de la UE y te quedas en España.",
    metaDescription:
      "Certificado de registro de ciudadano de la Unión (NIE verde): requisitos, documentación, cita previa y plazos.",
    whatItIs:
      "Inscripción en el Registro Central de Extranjeros que deben realizar los ciudadanos de la UE, EEE o Suiza que residen en España más del plazo previsto. Es el conocido «certificado verde».",
    forWho: ["Ciudadanos de la UE, EEE o Suiza que se establecen en España."],
    requirements: [
      "Ser ciudadano de la UE, EEE o Suiza.",
      "Acreditar trabajo, medios económicos y seguro, o condición de estudiante, según el supuesto.",
    ],
    needsVerification: ["Qué supuesto acreditas y qué documentación exige tu provincia."],
    documents: [
      { name: "Pasaporte o documento de identidad en vigor", source: "cliente" },
      { name: "Acreditación del supuesto: contrato, medios o matrícula", source: "cliente" },
      { name: "Seguro médico cuando proceda", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Cita previa", detail: "Gestionamos la cita en tu provincia.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparamos el expediente para la comparecencia.", actor: "extranjeria-segura" },
      { title: "Comparecencia", detail: "Acudes con todo listo y recoges el certificado.", actor: "cliente" },
    ],
    feeFromCents: null,
    timeframe: "Se suele entregar en el mismo acto, sujeto a disponibilidad de cita.",
    adminFeesNote: "No incluye tasa modelo 790.",
    faqs: [{ q: "¿Caduca?", a: "El certificado no tiene la misma lógica de caducidad que una TIE, pero conviene revisar tu situación al cambiar de circunstancias." }],
    sources: ["boe", "policia"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["tarjeta-familiar-comunitario", "nie-tie"],
  },

  /* ============================= NACIONALIDAD ============================= */
  {
    slug: "nacionalidad-por-residencia",
    name: "Nacionalidad española por residencia",
    category: "nacionalidad",
    tagline: "El expediente que cierra el círculo. Preparado para no fallar.",
    metaDescription:
      "Nacionalidad española por residencia: años exigidos, exámenes CCSE y DELE, documentación, plazos y jura. Expediente 100% online.",
    whatItIs:
      "Procedimiento para adquirir la nacionalidad española tras acreditar el periodo de residencia legal y continuada exigido, buena conducta cívica y suficiente grado de integración, que se acredita mediante las pruebas CCSE y, cuando procede, DELE A2.",
    forWho: [
      "Personas con el periodo de residencia legal exigido según su nacionalidad y situación.",
      "Nacionales de países iberoamericanos y otros supuestos con plazo reducido.",
      "Cónyuges de español y determinados supuestos especiales.",
    ],
    requirements: [
      "Residencia legal, continuada e inmediatamente anterior a la solicitud durante el plazo exigido.",
      "Buena conducta cívica.",
      "Suficiente grado de integración: prueba CCSE y, si procede, DELE A2.",
      "Documentación registral del país de origen legalizada y traducida.",
    ],
    needsVerification: [
      "Plazo exacto que te aplica según nacionalidad y situación personal.",
      "Continuidad de la residencia legal y efecto de las ausencias.",
      "Vigencia de los certificados y de los exámenes.",
    ],
    documents: [
      { name: "Pasaporte y TIE en vigor", source: "cliente" },
      { name: "Certificado de nacimiento legalizado y traducido", source: "cliente" },
      { name: "Certificado de antecedentes penales del país de origen", source: "cliente" },
      { name: "Certificado de antecedentes penales en España", source: "nosotros" },
      { name: "Certificado de empadronamiento", source: "cliente" },
      { name: "Diploma CCSE", source: "cliente" },
      { name: "Diploma DELE A2 cuando proceda", source: "cliente" },
      { name: "Certificado de matrimonio cuando proceda", source: "cliente", optional: true },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Auditoría de residencia", detail: "Revisamos años, autorizaciones y ausencias antes de nada.", actor: "extranjeria-segura", duration: "48 h" },
      { title: "Plan de exámenes", detail: "Te decimos qué pruebas necesitas y cuándo convocarte.", actor: "extranjeria-segura" },
      { title: "Documentación registral", detail: "Preparamos legalizaciones y traducciones.", actor: "cliente" },
      { title: "Presentación telemática", detail: "Presentación del expediente y número de referencia.", actor: "extranjeria-segura" },
      { title: "Seguimiento", detail: "Vigilamos el estado y respondemos a requerimientos.", actor: "extranjeria-segura" },
      { title: "Jura y Registro Civil", detail: "Te acompañamos hasta la inscripción.", actor: "administracion" },
    ],
    feeFromCents: 47900,
    timeframe:
      "El plazo legal de resolución es de un año desde la solicitud, prorrogable. En la práctica varía. Te informamos del estado real de tu expediente en cada momento.",
    adminFeesNote:
      "No incluye la tasa de la solicitud, las tasas de los exámenes CCSE y DELE, traducciones juradas ni apostillas.",
    faqs: [
      { q: "¿Cuántos años necesito?", a: "El plazo general es de diez años, con supuestos reducidos: dos años para nacionales de países iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial, Portugal y sefardíes; y un año en supuestos como el matrimonio con español. Verificamos el que te aplica." },
      { q: "¿Los años deben ser con tarjeta?", a: "Debe tratarse de residencia legal. Los periodos en situación irregular no computan. Es lo primero que auditamos." },
      { q: "¿Qué pasa si me deniegan?", a: "Cabe recurso. Analizamos el motivo y te decimos si tiene recorrido antes de que gastes en un recurso sin base." },
      { q: "¿Puedo conservar mi nacionalidad de origen?", a: "Depende de tu país y de los convenios aplicables. En la declaración de jura se manifiesta lo que corresponda según tu caso." },
    ],
    sources: ["boe", "mjusticia", "sede"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["nacionalidad-por-opcion", "residencia-larga-duracion"],
    seoNationalities: ["colombianos", "venezolanos", "peruanos", "argentinos", "brasilenos", "ecuatorianos", "dominicanos", "cubanos", "mexicanos", "bolivianos", "marroquies", "chinos"],
    seoCities: ["madrid", "barcelona", "valencia", "sevilla", "malaga", "bilbao", "zaragoza", "murcia"],
  },
  {
    slug: "nacionalidad-por-opcion",
    name: "Nacionalidad española por opción",
    category: "nacionalidad",
    tagline: "Cuando la ley te reconoce un derecho directo por origen o filiación.",
    metaDescription:
      "Nacionalidad española por opción: supuestos, requisitos, documentación y plazos. Comprueba si te corresponde.",
    whatItIs:
      "Vía de adquisición de la nacionalidad española reservada a supuestos concretos previstos en el Código Civil, como determinados casos de filiación, adopción o personas cuyo padre o madre fue originariamente español.",
    forWho: [
      "Hijos de padre o madre originariamente español nacido en España.",
      "Personas adoptadas por españoles en los supuestos previstos.",
      "Otros supuestos legalmente tasados.",
    ],
    requirements: [
      "Encajar en uno de los supuestos tasados del Código Civil.",
      "Acreditar la filiación o el hecho determinante mediante certificación registral.",
      "Presentar la solicitud dentro del plazo previsto cuando exista.",
    ],
    needsVerification: [
      "Que tu supuesto está efectivamente previsto y sigue vigente.",
      "Plazos de caducidad del derecho de opción.",
    ],
    documents: [
      { name: "Certificado de nacimiento del solicitante", source: "cliente" },
      { name: "Certificado de nacimiento del progenitor español", source: "cliente" },
      { name: "Documento de identidad", source: "cliente" },
      { name: "Impreso oficial", source: "nosotros" },
    ],
    process: [
      { title: "Verificación del supuesto", detail: "Confirmamos que la opción te corresponde.", actor: "extranjeria-segura" },
      { title: "Documentación registral", detail: "Obtención y legalización de certificados.", actor: "cliente" },
      { title: "Presentación en Registro Civil", detail: "Presentación y seguimiento.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 41900,
    timeframe: "Depende del Registro Civil competente.",
    adminFeesNote: "No incluye tasas, traducciones ni legalizaciones.",
    faqs: [
      { q: "¿Es lo mismo que la nacionalidad por residencia?", a: "No. La opción no exige años de residencia, pero solo cabe en supuestos tasados." },
    ],
    sources: ["boe", "mjusticia"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["nacionalidad-por-residencia"],
  },

  /* ============================= RENOVACIONES ============================= */
  {
    slug: "renovacion-residencia-trabajo",
    name: "Renovación de residencia y trabajo",
    category: "renovaciones",
    tagline: "No dejes que una fecha te devuelva a la casilla de salida.",
    metaDescription:
      "Renovación de la autorización de residencia y trabajo en España: plazos, requisitos, cotizaciones y documentación.",
    whatItIs:
      "Procedimiento para prorrogar una autorización de residencia y trabajo antes o inmediatamente después de su caducidad, acreditando la continuidad de las condiciones que la justificaron.",
    forWho: [
      "Titulares de una autorización próxima a caducar.",
      "Quien ha cambiado de empleo o de situación laboral y necesita revisar su renovación.",
    ],
    requirements: [
      "Continuidad de la actividad o acreditación de la situación prevista para la renovación.",
      "Cotizaciones o medios según el supuesto.",
      "Presentación dentro del plazo legal.",
    ],
    needsVerification: [
      "Días efectivamente cotizados y periodos de desempleo.",
      "Ventana temporal exacta de presentación en tu caso.",
    ],
    documents: [
      { name: "Pasaporte y TIE", source: "cliente" },
      { name: "Vida laboral actualizada", source: "cliente" },
      { name: "Contrato vigente o documentación de la actividad", source: "cliente" },
      { name: "Empadronamiento", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Auditoría de cotizaciones", detail: "Revisamos vida laboral y periodos.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Preparación del expediente.", actor: "cliente" },
      { title: "Presentación", detail: "Presentación dentro de plazo.", actor: "extranjeria-segura" },
      { title: "TIE", detail: "Cita de huellas para la nueva tarjeta.", actor: "cliente" },
    ],
    feeFromCents: 35900,
    timeframe: "Variable según oficina. La presentación en plazo mantiene la vigencia de tu situación mientras se resuelve.",
    adminFeesNote: "No incluye tasas.",
    faqs: [
      { q: "Se me ha caducado la tarjeta, ¿llego a tiempo?", a: "Existe un margen posterior a la caducidad en el que aún puede presentarse. Revisa tu fecha con nosotros cuanto antes." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["residencia-larga-duracion", "nie-tie", "modificacion-estudios-trabajo"],
    seoCities: ["madrid", "barcelona", "valencia", "murcia", "sevilla", "malaga", "alicante"],
  },
  {
    slug: "nie-tie",
    name: "NIE y Tarjeta de Identidad de Extranjero",
    shortName: "NIE / TIE",
    category: "renovaciones",
    alsoIn: ["residencia"],
    tagline: "El documento que lo desbloquea todo: banco, contrato, alquiler.",
    metaDescription:
      "NIE y TIE en España: diferencias, cómo obtenerlos, cita previa, documentación y plazos. Gestión de cita y expediente.",
    whatItIs:
      "El NIE es el número de identificación de extranjero; la TIE es la tarjeta física que acredita tu autorización de residencia. Son cosas distintas y se solicitan por procedimientos distintos.",
    forWho: [
      "Quien necesita un NIE por intereses económicos, profesionales o sociales.",
      "Quien ya tiene una autorización concedida y debe obtener o renovar su TIE.",
    ],
    requirements: [
      "Motivo acreditable para la solicitud del NIE.",
      "Resolución favorable previa en el caso de la TIE.",
      "Cita previa en la oficina competente.",
    ],
    needsVerification: ["Qué oficina es competente y qué documentación exige tu provincia."],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Resolución de concesión (para TIE)", source: "cliente" },
      { name: "Fotografía tamaño carné con fondo blanco", source: "cliente" },
      { name: "Justificante de la causa (para NIE)", source: "cliente" },
      { name: "Impreso oficial y tasa", source: "nosotros" },
    ],
    process: [
      { title: "Cita previa", detail: "Gestionamos la cita, que suele ser el cuello de botella.", actor: "extranjeria-segura" },
      { title: "Preparación", detail: "Te enviamos la carpeta exacta para la comparecencia.", actor: "extranjeria-segura" },
      { title: "Comparecencia", detail: "Acudes a la toma de huellas.", actor: "cliente" },
    ],
    feeFromCents: 15900,
    timeframe: "Sujeto a disponibilidad de cita en tu provincia.",
    adminFeesNote: "No incluye tasa modelo 790.",
    faqs: [
      { q: "¿NIE y TIE son lo mismo?", a: "No. El NIE es un número; la TIE es la tarjeta que acredita tu residencia. Puedes tener NIE sin ser residente." },
    ],
    sources: ["policia", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["renovacion-residencia-trabajo", "certificado-registro-ue"],
    seoCities: ["madrid", "barcelona", "valencia", "malaga", "murcia", "alicante", "sevilla", "bilbao"],
  },

  /* ======================= RECURSOS Y REQUERIMIENTOS ====================== */
  {
    slug: "requerimiento-subsanacion",
    name: "Respuesta a requerimiento de subsanación",
    shortName: "Requerimiento",
    category: "requerimientos",
    tagline: "Tienes un plazo corto. Aquí es donde se gana o se pierde el expediente.",
    metaDescription:
      "Requerimiento de subsanación en extranjería: qué significa, plazo para responder, cómo contestar y qué documentación aportar.",
    whatItIs:
      "Comunicación de la Administración solicitando que aportes documentación o aclares algún extremo de tu expediente en un plazo determinado. No responder correctamente y en plazo suele suponer el archivo o la denegación.",
    forWho: [
      "Quien ha recibido una notificación de la Oficina de Extranjería o del Registro Civil.",
      "Quien no entiende exactamente qué le están pidiendo.",
    ],
    requirements: [
      "Responder dentro del plazo indicado en la notificación.",
      "Aportar exactamente lo requerido, con la forma exigida.",
    ],
    needsVerification: [
      "Fecha real de notificación y cómputo del plazo.",
      "Alcance exacto de lo solicitado.",
    ],
    documents: [
      { name: "Notificación recibida", source: "cliente", note: "Súbela completa, incluidas todas las páginas." },
      { name: "Documentación requerida", source: "cliente" },
      { name: "Escrito de contestación", source: "nosotros" },
    ],
    process: [
      { title: "Lectura urgente", detail: "Analizamos la notificación y el plazo el mismo día.", actor: "extranjeria-segura", duration: "24 h" },
      { title: "Plan de respuesta", detail: "Te decimos exactamente qué necesitamos de ti.", actor: "extranjeria-segura" },
      { title: "Contestación", detail: "Redactamos y presentamos el escrito con la documentación.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Los plazos de subsanación son cortos e improrrogables en la práctica. Actuamos con prioridad.",
    adminFeesNote: "No incluye traducciones ni tasas si el requerimiento las exige.",
    faqs: [
      { q: "Me llegó hace días, ¿aún estoy a tiempo?", a: "Depende de la fecha de notificación efectiva. Súbela y la revisamos el mismo día." },
      { q: "¿Puedo pedir más plazo?", a: "En determinados supuestos cabe solicitar ampliación. No siempre se concede y hay que pedirla correctamente." },
    ],
    sources: ["boe", "inclusion", "sede"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["recurso-alzada", "recurso-contencioso"],
  },
  {
    slug: "recurso-alzada",
    name: "Recurso administrativo contra una denegación",
    shortName: "Recurso administrativo",
    category: "recursos",
    tagline: "Una denegación no siempre es el final. Pero hay que leerla bien.",
    metaDescription:
      "Recurso de alzada y reposición en extranjería: plazos, motivos de denegación más frecuentes y cómo recurrir.",
    whatItIs:
      "Vía para impugnar en sede administrativa una resolución desfavorable, alegando los motivos jurídicos y aportando la prueba que corresponda dentro del plazo legal.",
    forWho: [
      "Quien ha recibido una denegación o un archivo.",
      "Quien quiere saber si su caso tiene recorrido antes de gastar en un recurso.",
    ],
    requirements: [
      "Resolución notificada y dentro de plazo para recurrir.",
      "Motivos jurídicos que sustenten la impugnación.",
    ],
    needsVerification: [
      "Fecha de notificación y plazo aplicable según el tipo de recurso.",
      "Motivación concreta de la resolución.",
    ],
    documents: [
      { name: "Resolución denegatoria completa", source: "cliente" },
      { name: "Expediente presentado en su día", source: "cliente" },
      { name: "Nueva prueba si la hay", source: "cliente", optional: true },
      { name: "Escrito de recurso", source: "nosotros" },
    ],
    process: [
      { title: "Análisis de viabilidad", detail: "Te decimos con franqueza si el recurso tiene recorrido.", actor: "extranjeria-segura", duration: "48 h" },
      { title: "Redacción", detail: "Preparamos el escrito con fundamentación y prueba.", actor: "extranjeria-segura" },
      { title: "Presentación", detail: "Presentación telemática y seguimiento.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "El plazo para recurrir es breve y comienza con la notificación. Consúltanos el mismo día que la recibas.",
    adminFeesNote: "No incluye tasas ni costas. Si el caso no tiene recorrido, te lo diremos antes de cobrarte un recurso.",
    faqs: [
      { q: "¿Merece la pena recurrir?", a: "Depende del motivo de denegación. Hacemos un análisis de viabilidad previo y te damos una respuesta honesta." },
      { q: "¿Puedo presentar una solicitud nueva en vez de recurrir?", a: "A veces es la mejor estrategia. Lo valoramos en el análisis." },
    ],
    sources: ["boe", "inclusion", "sede"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["recurso-contencioso", "requerimiento-subsanacion"],
  },
  {
    slug: "recurso-contencioso",
    name: "Recurso contencioso-administrativo",
    category: "recursos",
    tagline: "Cuando la vía administrativa se agota y toca ir al juzgado.",
    metaDescription:
      "Recurso contencioso-administrativo en extranjería: plazos, procedimiento, costes y cuándo tiene sentido acudir al juzgado.",
    whatItIs:
      "Impugnación judicial de una resolución administrativa firme en vía administrativa, ante los juzgados de lo contencioso-administrativo. Requiere abogado y procurador.",
    forWho: [
      "Quien ha agotado la vía administrativa.",
      "Quien ha recibido una resolución con recorrido judicial.",
    ],
    requirements: [
      "Resolución que agote la vía administrativa o que sea directamente recurrible.",
      "Presentación dentro del plazo procesal.",
      "Representación de abogado y procurador.",
    ],
    needsVerification: [
      "Plazo procesal exacto y firmeza de la resolución.",
      "Viabilidad del recurso y jurisprudencia aplicable.",
    ],
    documents: [
      { name: "Resolución y notificación", source: "cliente" },
      { name: "Expediente administrativo completo", source: "cliente" },
      { name: "Poder para pleitos", source: "cliente" },
      { name: "Demanda", source: "nosotros" },
    ],
    process: [
      { title: "Dictamen de viabilidad", detail: "Análisis jurídico previo con pronóstico realista.", actor: "extranjeria-segura" },
      { title: "Poder y personación", detail: "Otorgamiento del poder y designación de procurador.", actor: "cliente" },
      { title: "Interposición y demanda", detail: "Presentación y seguimiento procesal.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Los procedimientos judiciales tienen plazos propios, habitualmente más largos que la vía administrativa.",
    adminFeesNote: "Presupuesto a medida. No incluye procurador, peritos ni eventuales costas.",
    faqs: [
      { q: "¿Puedo ir directamente al juzgado?", a: "Depende de si la resolución agota la vía administrativa. Lo comprobamos antes." },
    ],
    sources: ["boe", "sede"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["recurso-alzada"],
  },

  /* ============================== PROTECCIÓN ============================== */
  {
    slug: "proteccion-internacional",
    name: "Protección internacional (asilo)",
    category: "proteccion",
    tagline: "Un procedimiento con reglas propias. Acompañamiento desde el primer paso.",
    metaDescription:
      "Solicitud de protección internacional en España: manifestación de voluntad, cita, entrevista, tarjeta roja y resolución.",
    whatItIs:
      "Procedimiento por el que se solicita el reconocimiento del estatuto de refugiado o la protección subsidiaria. Tiene su propia normativa, sus propios plazos y garantías específicas.",
    forWho: [
      "Personas que han tenido que salir de su país por motivos previstos en la normativa de asilo.",
      "Quien necesita orientación sobre el procedimiento y sus derechos.",
    ],
    requirements: [
      "Manifestar la voluntad de solicitar protección internacional.",
      "Comparecer a la entrevista y aportar el relato y la prueba disponible.",
    ],
    needsVerification: [
      "Encaje del relato en los motivos de protección previstos.",
      "Situación documental y de plazos.",
    ],
    documents: [
      { name: "Documentación de identidad disponible", source: "cliente" },
      { name: "Relato de los hechos", source: "cliente", note: "Te ayudamos a estructurarlo." },
      { name: "Prueba documental disponible", source: "cliente", optional: true },
    ],
    process: [
      { title: "Primera orientación", detail: "Te explicamos el procedimiento, los plazos y tus derechos.", actor: "extranjeria-segura" },
      { title: "Cita y manifestación", detail: "Gestión de la cita de manifestación de voluntad.", actor: "extranjeria-segura" },
      { title: "Entrevista", detail: "Preparación de la entrevista y acompañamiento.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "Seguimiento y, en su caso, recurso.", actor: "administracion" },
    ],
    feeFromCents: null,
    timeframe: "Los plazos de este procedimiento son propios y suelen ser prolongados.",
    adminFeesNote:
      "Existen servicios de asistencia jurídica gratuita para protección internacional. Te informamos de ellos con transparencia antes de contratar nada.",
    faqs: [
      { q: "¿Puedo trabajar mientras se resuelve?", a: "La normativa prevé la autorización para trabajar transcurrido un plazo desde la admisión a trámite." },
      { q: "¿Esto es gratis?", a: "Existe asistencia jurídica gratuita para este procedimiento. Te indicamos cómo acceder a ella." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: REVIEW,
    pendingLegalReview: true,
    related: ["requerimiento-subsanacion"],
  },
];

/* ------------------------------------------------------------------ */

export const TRAMITE_MAP = Object.fromEntries(TRAMITES.map((t) => [t.slug, t]));

export function getTramite(slug: string) {
  return TRAMITE_MAP[slug];
}

export function tramitesByCategory(category: string) {
  return TRAMITES.filter((t) => t.category === category || t.alsoIn?.includes(category as never));
}

export function displayName(t: { name: string; shortName?: string }) {
  return t.shortName ?? t.name;
}
