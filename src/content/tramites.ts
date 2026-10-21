import type { Tramite } from "./taxonomy";
import { bloqueado } from "./bloqueos";

/**
 * CATÁLOGO DE TRÁMITES.
 *
 * Todo el contenido jurídico de este archivo está marcado
 * `pendingLegalReview: true` y la UI lo refleja con un aviso visible.
 * Ningún requisito aquí descrito debe publicarse como definitivo hasta que
 * el profesional responsable lo valide y firme (ver CONTENIDO-PENDIENTE-REVISION.md).
 *
 * Referencia normativa de base: LO 4/2000, RD 1155/2024 (Reglamento de
 * Extranjería), Ley 14/2013, Ley 35/2006 del IRPF y Código Civil para
 * nacionalidad.
 *
 * ─── EL CATÁLOGO DEL DESPACHO ───────────────────────────────────────────
 *
 * En octubre de 2026 el despacho entregó su catálogo de trámites recurrentes
 * de residencia y residencia fiscal. De ahí salen las doce fichas que se
 * sumaron a las 25 originales —familiares de españoles, tarjeta azul-UE,
 * traslado intraempresarial, investigadores, búsqueda de empleo, hijos de
 * residentes, prórroga de la regularización, renovación de inversores,
 * razones humanitarias y las tres de residencia fiscal— y las cifras con
 * artículo de las fichas de la Ley 14/2013. Llevan `updatedAt: CATALOGO`.
 *
 * Del catálogo quedan fuera, a propósito: los visados de corta duración y de
 * tránsito, la residencia con excepción de autorización de trabajo, el
 * retorno voluntario, temporada y gestión colectiva (que contrata el
 * empleador), transfronterizos y menores no acompañados. El catálogo los
 * enumera sin requisitos, y una ficha sin requisitos sería relleno.
 *
 * Siguen pendientes de firma igual que las demás: que el contenido venga del
 * despacho no sustituye a la revisión de la ficha publicada.
 *
 * A la inversa, lo que el catálogo no recoge —nacionalidad, régimen
 * comunitario, protección internacional y recursos— sigue aquí completo pero
 * bajo candado: no se publica. La lista está en `bloqueos.ts`.
 *
 * ─── QUÉ FICHA PUBLICA HONORARIOS Y CUÁL NO ─────────────────────────────
 *
 * Todas las vías tienen su ficha completa: quien busca «tarjeta de familiar
 * de comunitario» encuentra requisitos, documentos y plazos igual que antes.
 * Lo que cambia es el precio.
 *
 * Solo llevan `feeFromCents` las fichas que caen dentro de una de las cuatro
 * líneas de servicio con precio cerrado —arraigo, nómadas, nacionalidad y
 * renovaciones, ver `pricing.ts`—. Son once. Las demás van con
 * `feeFromCents: null`, que la interfaz muestra como «Presupuesto a medida»,
 * incluidas las doce del catálogo del despacho: ninguna tiene todavía un
 * importe que el despacho haya fijado, y este archivo no se lo inventa.
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

/**
 * Fichas incorporadas o completadas con el catálogo de trámites recurrentes
 * del despacho (RD 1155/2024 tras el RD 316/2026 y las sentencias del
 * Tribunal Supremo de julio de 2026, Ley 14/2013 y LIRPF).
 */
const CATALOGO = "2026-10-20";

/** Todas las fichas, incluidas las bloqueadas. Solo para el panel interno. */
export const TODAS_LAS_FICHAS: Tramite[] = [
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
    related: ["arraigo-social", "familiares-de-espanoles", "reagrupacion-familiar"],
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
    related: ["arraigo-sociolaboral", "arraigo-social"],
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
      "Visado de nómada digital en España: requisitos, documentos, resolución en 20 días con silencio positivo y hasta 3 años. Desde fuera o desde España.",
    whatItIs:
      "Autorización de la Ley 14/2013 (arts. 74 bis a 74 quinquies) para personas que trabajan en remoto para empresas o clientes situados fuera de España. Se tramita de forma electrónica ante la Unidad de Grandes Empresas y Colectivos Estratégicos (UGE-CE) y permite residir legalmente en España manteniendo tu actividad profesional a distancia.",
    forWho: [
      "Personas empleadas por una empresa extranjera que autoriza el trabajo en remoto.",
      "Profesionales autónomos con clientes mayoritariamente fuera de España.",
      "Quien quiere traer a su familia bajo la misma unidad familiar.",
    ],
    requirements: [
      "Empresa con al menos un año de actividad.",
      "Relación laboral o profesional con esa empresa de al menos tres meses.",
      "Acreditar que el trabajo puede prestarse a distancia.",
      "Titulación o tres años de experiencia profesional.",
      "Si trabajas como profesional, hasta el 20 % de tu actividad puede ser para empresas españolas.",
      "Requisitos generales del art. 62.3 de la Ley 14/2013: mayor de 18 años, no estar en situación irregular en España, seguro de enfermedad público o privado y recursos económicos suficientes.",
      "Sin antecedentes penales en España ni en los países de residencia de los dos últimos años, más declaración responsable sobre los cinco últimos, y no figurar como rechazable.",
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
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la autorización, o de la solicitud de visado en el consulado.", actor: "extranjeria-segura" },
      { title: "Resolución y TIE", detail: "Veinte días para la autorización, con silencio positivo; diez días hábiles para el visado. Después, cita para la tarjeta.", actor: "administracion", duration: "20 días" },
    ],
    feeFromCents: 89900,
    timeframe:
      "La UGE-CE resuelve la autorización en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo. El visado se resuelve en diez días hábiles.",
    adminFeesNote:
      "No incluye tasas, seguro médico, traducciones juradas, apostillas ni los trámites fiscales, que se presupuestan aparte.",
    faqs: [
      { q: "¿Puedo tener clientes españoles?", a: "Si trabajas como profesional, hasta el 20 % de tu actividad puede ser para empresas situadas en España. Lo revisamos con tus facturas reales." },
      { q: "¿Cuántos años me dan?", a: "El visado tiene una vigencia máxima de un año. La autorización de residencia, de hasta tres años, y se renueva por periodos de dos años." },
      { q: "¿Puedo traer a mi pareja e hijos?", a: "Sí. Cónyuge o pareja, hijos dependientes y ascendientes a cargo pueden incluirse de forma conjunta y simultánea o sucesiva (art. 62.4 de la Ley 14/2013)." },
      { q: "¿Y si la Administración no contesta?", a: "Si la UGE-CE no resuelve en veinte días, la autorización se entiende concedida por silencio administrativo. Frente a una denegación cabe recurso de alzada." },
      { q: "¿Puedo seguir en España mientras se resuelve?", a: "Si la pides desde España, la solicitud prorroga tu situación de residencia o estancia anterior hasta la resolución." },
      { q: "¿Y los impuestos?", a: "La residencia fiscal es un plano distinto de la TIE. El teletrabajo con visado de la Ley 14/2013 permite optar al régimen de impatriados («Ley Beckham»), y lo gestionamos en una ficha aparte." },
    ],
    sources: ["boe", "inclusion", "exteriores"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["regimen-impatriados", "tarjeta-azul-ue", "profesional-altamente-cualificado", "residencia-no-lucrativa"],
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
      "Titulación equiparable a MECES 1 o tres años de experiencia equiparable (art. 71.2.b de la Ley 14/2013).",
      "Contrato con una retribución acorde al puesto y al mercado.",
      "Empresa con actividad real y al corriente de obligaciones.",
      "Requisitos generales del art. 62.3: mayor de 18 años, sin antecedentes penales, seguro de enfermedad y recursos económicos suficientes.",
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
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la solicitud.", actor: "extranjeria-segura" },
    ],
    feeFromCents: 95900,
    timeframe:
      "La UGE-CE resuelve la autorización en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo. El visado se resuelve en diez días hábiles.",
    adminFeesNote: "No incluye tasas ni homologaciones de título.",
    faqs: [
      { q: "¿Sirve para trabajadores ya en España?", a: "En determinados supuestos sí puede solicitarse desde España, y la solicitud prorroga tu situación anterior hasta la resolución. Depende de tu situación actual." },
      { q: "¿Cuánto dura?", a: "Tres años, y se renueva por periodos de dos años." },
      { q: "¿Es lo mismo que la tarjeta azul-UE?", a: "No. Esta es la modalidad nacional (art. 71.2.b). La tarjeta azul-UE exige formación de nivel MECES 2 o cinco años de experiencia, un contrato de al menos seis meses y un umbral salarial propio." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["tarjeta-azul-ue", "teletrabajo-internacional", "residencia-trabajo-cuenta-ajena"],
  },

  {
    slug: "tarjeta-azul-ue",
    name: "Tarjeta azul-UE",
    category: "nomadas",
    alsoIn: ["trabajo"],
    tagline: "Para perfiles cualificados con un contrato de al menos seis meses.",
    metaDescription:
      "Tarjeta azul-UE en España (Ley 14/2013): formación o experiencia exigida, contrato de seis meses, umbral salarial, duración de 3 años y plazos de la UGE-CE.",
    whatItIs:
      "Autorización de residencia y trabajo de la Ley 14/2013 (arts. 71.2.a y 71 bis) para profesionales altamente cualificados contratados en España. Es la versión armonizada en la Unión Europea, y se tramita de forma electrónica ante la Unidad de Grandes Empresas y Colectivos Estratégicos (UGE-CE).",
    forWho: [
      "Profesionales con formación superior o experiencia equivalente y una oferta firme en España.",
      "Perfiles TIC que acreditan la experiencia en lugar del título.",
      "Empresas que quieren incorporar a un profesional extranjero con plazos cortos.",
    ],
    requirements: [
      "Formación superior de al menos tres años (MECES 2 / EQF 6) o cinco años de experiencia profesional; en el sector TIC, tres años de experiencia dentro de los últimos siete.",
      "Contrato u oferta firme de trabajo de al menos seis meses.",
      "Salario no inferior al umbral reglamentario: entre 1,0 y 1,6 veces el salario bruto anual medio, reducido al 80 % en determinados casos.",
      "Requisitos generales del art. 62.3 de la Ley 14/2013: mayor de 18 años, no estar en situación irregular en España, seguro de enfermedad y recursos económicos suficientes.",
      "Sin antecedentes penales en España ni en los países de residencia de los dos últimos años, más declaración responsable sobre los cinco últimos, y no figurar como rechazable.",
    ],
    needsVerification: [
      "Umbral salarial exacto que aplica a tu puesto y si entras en uno de los supuestos reducidos al 80 %.",
      "Equivalencia de tu título con el nivel MECES 2 / EQF 6, o cómo acreditar la experiencia.",
      "Que el contrato u oferta cumpla la duración mínima y esté firmado en los términos exigidos.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Contrato u oferta firme de trabajo", source: "cliente", note: "De al menos seis meses, con el salario bruto anual." },
      { name: "Título superior o acreditación de experiencia", source: "cliente", note: "Legalizado o apostillado y traducido cuando proceda." },
      { name: "Seguro de enfermedad", source: "cliente" },
      { name: "Certificado de antecedentes penales", source: "cliente", note: "De los países de residencia de los dos últimos años." },
      { name: "Declaración responsable de antecedentes de los cinco últimos años", source: "nosotros" },
      { name: "Documentación de la empresa", source: "cliente" },
      { name: "Solicitud electrónica y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Análisis del perfil y del salario", detail: "Comprobamos la formación o experiencia y el umbral salarial que aplica a tu puesto.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Documentación", detail: "Reúnes tu parte; preparamos con la empresa el dossier corporativo.", actor: "cliente" },
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la solicitud y de la tasa.", actor: "extranjeria-segura", duration: "24 h" },
      { title: "Resolución", detail: "Veinte días de plazo, con silencio positivo. Si estás fuera, el visado se resuelve en diez días hábiles.", actor: "administracion", duration: "20 días" },
      { title: "Entrada y TIE", detail: "Te acompañamos en la solicitud de la tarjeta.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe:
      "La UGE-CE resuelve la autorización en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo. El visado se resuelve en diez días hábiles.",
    adminFeesNote:
      "No incluye tasas, homologaciones de título, traducciones juradas ni apostillas.",
    faqs: [
      { q: "¿Cuánto dura?", a: "Tres años, o la duración del contrato más tres meses si es menor. Se renueva por periodos de dos años (art. 76.3 de la Ley 14/2013)." },
      { q: "¿Puedo traer a mi familia?", a: "Sí. Cónyuge o pareja, hijos dependientes y ascendientes a cargo pueden solicitarla de forma conjunta y simultánea o sucesiva (art. 62.4)." },
      { q: "¿Qué pasa si estoy en España mientras se resuelve?", a: "La solicitud prorroga tu situación de residencia o estancia anterior hasta que se resuelva." },
      { q: "¿Y si me la deniegan?", a: "Cabe recurso de alzada. Revisamos la resolución antes de recomendarte presentarlo." },
    ],
    sources: ["boe", "inclusion", "exteriores"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["profesional-altamente-cualificado", "traslado-intraempresarial", "regimen-impatriados"],
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
    related: ["renovacion-residencia-trabajo", "nie-tie"],
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
      "Actividad innovadora o de especial interés económico para España (arts. 69 y 70 de la Ley 14/2013).",
      "Informe preceptivo de ENISA, que valora tu perfil, el plan de negocio y el valor añadido.",
      "Requisitos generales del art. 62.3: mayor de 18 años, sin antecedentes penales, seguro de enfermedad y recursos económicos suficientes.",
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
      { title: "Informe de ENISA", detail: "Solicitud del informe preceptivo, que se emite en diez días hábiles.", actor: "extranjeria-segura", duration: "10 días hábiles" },
      { title: "Presentación", detail: "Desde el extranjero, autorización y visado se piden en una única instancia.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe:
      "ENISA emite su informe en diez días hábiles. La UGE-CE resuelve la autorización en veinte días, con silencio positivo.",
    adminFeesNote: "No incluye tasas.",
    faqs: [
      { q: "¿Qué se considera innovador?", a: "Se valoran el perfil profesional, el plan de negocio y el valor añadido para la economía española. Trabajamos la memoria con ese marco." },
      { q: "¿Cuánto dura?", a: "Tres años, y se renueva por periodos de dos años." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["residencia-trabajo-cuenta-propia", "profesional-altamente-cualificado"],
  },

  {
    slug: "traslado-intraempresarial",
    name: "Traslado intraempresarial",
    category: "trabajo",
    alsoIn: ["nomadas"],
    tagline: "Para quien su propia empresa o grupo desplaza a España.",
    metaDescription:
      "Autorización de traslado intraempresarial en España (art. 73 Ley 14/2013): ICT-UE y nacional, tres meses previos en el grupo, duración y plazos de la UGE-CE.",
    whatItIs:
      "Autorización de la Ley 14/2013 (art. 73) para trabajadores que su empresa o grupo empresarial desplaza a un centro en España. Tiene dos modalidades: el traslado intraempresarial UE (ICT-UE) y el nacional.",
    forWho: [
      "Directivos, especialistas y trabajadores en formación desplazados dentro de un mismo grupo.",
      "Empresas extranjeras que abren o refuerzan un centro de trabajo en España.",
    ],
    requirements: [
      "Actividad empresarial real de la empresa o grupo.",
      "Titulación equiparable a MECES 1 o tres años de experiencia profesional.",
      "Relación laboral o profesional previa y continuada de al menos tres meses con el grupo.",
      "Documentación del traslado emitida por la empresa.",
      "Requisitos generales del art. 62.3 de la Ley 14/2013: mayor de 18 años, sin antecedentes penales, seguro de enfermedad y recursos económicos suficientes.",
    ],
    needsVerification: [
      "Qué modalidad te conviene, ICT-UE o nacional, según la duración prevista del desplazamiento.",
      "Cómo acreditar la relación previa de tres meses con el grupo.",
      "Si el puesto encaja como directivo, especialista o trabajador en formación.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Carta de desplazamiento de la empresa", source: "cliente", note: "Con duración, puesto y retribución durante el traslado." },
      { name: "Acreditación de la relación previa con el grupo", source: "cliente" },
      { name: "Título o acreditación de experiencia", source: "cliente" },
      { name: "Documentación societaria de la empresa de origen y de destino", source: "cliente" },
      { name: "Seguro de enfermedad", source: "cliente" },
      { name: "Certificado de antecedentes penales", source: "cliente" },
      { name: "Solicitud electrónica y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Elegimos modalidad y comprobamos la relación previa con el grupo.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Dossier de empresa", detail: "Preparamos con el grupo la documentación del traslado.", actor: "extranjeria-segura" },
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la solicitud.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "Veinte días de plazo, con silencio positivo.", actor: "administracion", duration: "20 días" },
    ],
    feeFromCents: null,
    timeframe:
      "La UGE-CE resuelve la autorización en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo. El visado se resuelve en diez días hábiles.",
    adminFeesNote: "No incluye tasas, traducciones juradas ni apostillas.",
    faqs: [
      { q: "¿Cuánto dura?", a: "En el ICT-UE, un máximo de tres años, o de un año para trabajadores en formación. En la modalidad nacional, tres años." },
      { q: "¿Puede venir mi familia?", a: "Sí, en los términos del art. 62.4 de la Ley 14/2013: cónyuge o pareja, hijos dependientes y ascendientes a cargo." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["tarjeta-azul-ue", "profesional-altamente-cualificado", "regimen-impatriados"],
  },
  {
    slug: "investigacion-innovacion",
    name: "Formación, investigación, desarrollo e innovación",
    shortName: "Investigadores",
    category: "trabajo",
    alsoIn: ["estudios", "nomadas"],
    tagline: "Para investigadores, doctores y perfiles de I+D+i.",
    metaDescription:
      "Autorización para investigadores y personal de I+D+i en España (art. 72 Ley 14/2013): convenio de acogida, duración de 3 años y prórroga para buscar empleo.",
    whatItIs:
      "Autorización de la Ley 14/2013 (art. 72) para personal investigador, científico y técnico que desarrolla actividades de formación, investigación, desarrollo e innovación en España. Distingue la investigación UE, armonizada en la Unión, de los demás supuestos nacionales.",
    forWho: [
      "Doctores e investigadores con convenio de acogida o contrato con un organismo de investigación.",
      "Personal técnico y científico vinculado a proyectos de I+D+i.",
    ],
    requirements: [
      "Investigación UE: doctorado o titulación que dé acceso a programas de doctorado, y convenio de acogida o contrato con el organismo de investigación.",
      "Investigación nacional: encaje en alguno de los demás supuestos del art. 72.1 de la Ley 14/2013.",
      "Requisitos generales del art. 62.3: mayor de 18 años, sin antecedentes penales, seguro de enfermedad y recursos económicos suficientes.",
    ],
    needsVerification: [
      "Si tu caso encaja como investigación UE o como supuesto nacional.",
      "Que el convenio de acogida o el contrato recoja lo que exige la norma.",
    ],
    documents: [
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Convenio de acogida o contrato", source: "cliente" },
      { name: "Título de doctorado o de acceso al doctorado", source: "cliente" },
      { name: "Seguro de enfermedad", source: "cliente" },
      { name: "Certificado de antecedentes penales", source: "cliente" },
      { name: "Solicitud electrónica y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Encajamos tu caso en la modalidad UE o nacional.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Coordinamos con el organismo de acogida el convenio y su documentación.", actor: "cliente" },
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la solicitud.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "Veinte días de plazo, con silencio positivo.", actor: "administracion", duration: "20 días" },
    ],
    feeFromCents: null,
    timeframe:
      "La UGE-CE resuelve la autorización en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo.",
    adminFeesNote: "No incluye tasas, traducciones juradas ni apostillas.",
    faqs: [
      { q: "¿Cuánto dura?", a: "Tres años, o la duración del convenio si es menor. Se renueva por periodos de dos años." },
      { q: "¿Qué pasa cuando termina el proyecto?", a: "Al finalizar puedes pedir una prórroga de hasta doce meses para buscar empleo o emprender en España." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["tarjeta-azul-ue", "residencia-estudios", "emprendedores"],
  },
  {
    slug: "visado-busqueda-empleo",
    name: "Visado para la búsqueda de empleo",
    shortName: "Búsqueda de empleo",
    category: "trabajo",
    tagline: "Entrar en España para buscar trabajo, con un visado específico.",
    metaDescription:
      "Visado de búsqueda de empleo en España (arts. 43 a 45 RD 1155/2024): modalidad general, para hijos o nietos de español de origen y por ocupaciones.",
    whatItIs:
      "Visado previsto en los arts. 43 a 45 del Reglamento de Extranjería (RD 1155/2024) que permite entrar en España para buscar trabajo. Tiene tres modalidades: la general, la de hijos o nietos de español de origen, y la vinculada a determinadas ocupaciones y ámbitos territoriales.",
    forWho: [
      "Hijos y nietos de español de origen.",
      "Perfiles incluidos en las ocupaciones y territorios que habilitan esta vía.",
      "Quien quiere llegar a España con un visado que le permita buscar empleo.",
    ],
    requirements: [
      "Encajar en una de las tres modalidades de los arts. 43 a 45 del RD 1155/2024.",
      "Documentación general del visado (art. 38): pasaporte con vigencia mínima de un año, antecedentes penales de los últimos cinco años, certificado médico y tasa.",
      "En la modalidad de descendientes, acreditar que tu padre, madre, abuelo o abuela es o fue español de origen.",
    ],
    needsVerification: [
      "Qué modalidad te corresponde y si está abierta para tu ocupación o territorio.",
      "Cómo acreditar la nacionalidad española de origen del ascendiente.",
    ],
    documents: [
      { name: "Pasaporte con vigencia mínima de un año", source: "cliente" },
      { name: "Certificado de antecedentes penales de los últimos cinco años", source: "cliente", note: "Legalizado o apostillado y traducido." },
      { name: "Certificado médico", source: "cliente", note: "Conforme al Reglamento Sanitario Internacional de 2005." },
      { name: "Partidas de nacimiento que acrediten el vínculo con el español de origen", source: "cliente", optional: true },
      { name: "Impreso de solicitud y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos la modalidad y lo que tienes que acreditar.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reúnes partidas, antecedentes y certificado médico; te decimos cómo legalizarlos.", actor: "cliente" },
      { title: "Solicitud consular", detail: "Preparamos la solicitud para el consulado de tu demarcación.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "El consulado resuelve el visado.", actor: "administracion" },
    ],
    feeFromCents: null,
    timeframe: "Los plazos consulares varían según el país. Te damos la referencia de tu consulado en el diagnóstico.",
    adminFeesNote: "No incluye tasas consulares, traducciones juradas ni apostillas.",
    faqs: [
      { q: "Mi abuelo era español. ¿Me sirve?", a: "La modalidad para hijos y nietos de español de origen existe precisamente para eso. Lo que hay que acreditar es que era español de origen, y eso se comprueba con las partidas." },
      { q: "¿Y si encuentro trabajo?", a: "El objetivo del visado es que puedas pasar a una autorización de residencia y trabajo. Te acompañamos en ese cambio." },
    ],
    sources: ["boe", "exteriores", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["residencia-trabajo-cuenta-ajena", "familiares-de-espanoles"],
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
    related: ["familiares-de-espanoles", "arraigo-familiar"],
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
      { q: "Mi familiar es español. ¿Es esta mi vía?", a: "No. Desde el Reglamento de 2024 (RD 1155/2024), los familiares de españoles tienen su propia autorización de residencia (arts. 93 a 99). Esta tarjeta queda para familiares de ciudadanos de otros países de la UE, el EEE o Suiza." },
    ],
    sources: ["boe", "inclusion", "policia"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["familiares-de-espanoles", "reagrupacion-familiar", "certificado-registro-ue"],
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

  {
    slug: "familiares-de-espanoles",
    name: "Residencia de familiar de ciudadano español",
    shortName: "Familiar de español",
    category: "familia",
    alsoIn: ["residencia"],
    tagline: "Si tu familiar es español, tu vía ya no es la de comunitario.",
    metaDescription:
      "Residencia de familiar de español (arts. 93 a 99 RD 1155/2024): quién puede pedirla, solicitud desde España, trabajo desde la admisión y la sentencia de 2026.",
    whatItIs:
      "Autorización de residencia temporal para familiares de personas con nacionalidad española, regulada en los arts. 93 a 99 del Reglamento de Extranjería (RD 1155/2024). Sustituye a la tarjeta de familiar de comunitario para este caso, y desde el RD 316/2026 puede pedirse desde España.",
    forWho: [
      "Cónyuge mayor de 18 años, o pareja registrada o estable con al menos doce meses de convivencia, salvo descendencia común.",
      "Hijos menores de 26 años, o mayores a cargo o con discapacidad que precise apoyo.",
      "Ascendientes de primer grado a cargo y sin apoyo familiar en origen, o por razones humanitarias.",
      "Padre, madre o tutor de un menor español, y el familiar hasta segundo grado que cuide de un español con dependencia reconocida.",
      "Hijos de padre o madre que sean o hayan sido españoles de origen, y otros familiares que acrediten estar a cargo.",
    ],
    requirements: [
      "Convivir con el familiar español (art. 94.1).",
      "Acreditar el vínculo familiar y, cuando se exija, la dependencia económica.",
      "Solicitud desde España si tanto tú como tu familiar español estáis en territorio nacional (art. 97.1.c, redacción del RD 316/2026).",
      "Desde la admisión a trámite quedas autorizado provisionalmente a residir y trabajar (art. 97.5).",
    ],
    needsVerification: [
      "En qué supuesto del art. 94.1 encaja tu vínculo y cómo acreditarlo.",
      "La prueba de convivencia, y de dependencia económica si eres ascendiente o familiar a cargo.",
      "Cómo pondera la Administración tus antecedentes penales, si los tienes, tras la sentencia del Tribunal Supremo de 8 de julio de 2026.",
    ],
    documents: [
      { name: "Pasaporte completo en vigor", source: "cliente" },
      { name: "DNI del familiar español", source: "cliente" },
      { name: "Certificado de matrimonio, de pareja o de nacimiento", source: "cliente", note: "Legalizado o apostillado y traducido si es extranjero." },
      { name: "Empadronamiento conjunto", source: "cliente" },
      { name: "Prueba de dependencia económica", source: "cliente", optional: true, note: "Solo para ascendientes y otros familiares a cargo." },
      { name: "Certificado de antecedentes penales", source: "cliente" },
      { name: "Impreso oficial y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico del vínculo", detail: "Confirmamos el supuesto del art. 94.1 y cómo acreditarlo.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Documentación", detail: "Reúnes las partidas y la prueba de convivencia; te decimos cómo legalizarlas.", actor: "cliente" },
      { title: "Presentación", detail: "Presentamos desde España o preparamos la solicitud consular, según dónde estéis.", actor: "extranjeria-segura" },
      { title: "Admisión a trámite", detail: "Desde ese momento puedes residir y trabajar provisionalmente.", actor: "administracion" },
      { title: "Resolución y TIE", detail: "Seguimiento hasta la resolución y la cita de huellas.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "El plazo de resolución depende de la oficina. Te damos la estimación de tu provincia en el diagnóstico.",
    adminFeesNote: "No incluye tasas, traducciones juradas ni apostillas.",
    faqs: [
      { q: "¿No era esto la tarjeta de familiar de comunitario?", a: "Lo era. Con el Reglamento de 2024, los familiares de españoles tienen su propia autorización (arts. 93 a 99). La tarjeta de comunitario queda para familiares de ciudadanos de otros países de la UE." },
      { q: "¿Puedo pedirla sin salir de España?", a: "Sí. El art. 97.1.c, en la redacción del RD 316/2026, permite presentarla desde España cuando tanto tú como tu familiar español estáis aquí. Revisamos tu situación concreta antes de presentar." },
      { q: "¿Qué cambió con la sentencia del Supremo de julio de 2026?", a: "Anuló tres exigencias: que la tutela se hubiera constituido conforme al derecho español, que la dependencia del ascendiente se produjera en el país de origen y la denegación automática por antecedentes penales sin valorar el caso concreto." },
      { q: "¿Y si nos separamos?", a: "La norma prevé la residencia independiente cuando se rompe el vínculo familiar (art. 99). Conviene revisarlo antes de que se produzca la ruptura." },
    ],
    sources: ["boe", "inclusion", "extranjeria"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["reagrupacion-familiar", "arraigo-familiar", "residencia-hijos-residentes"],
  },
  {
    slug: "residencia-hijos-residentes",
    name: "Residencia de hijos o tutelados de residentes",
    shortName: "Hijos de residentes",
    category: "familia",
    tagline: "Para los hijos de quien ya reside legalmente en España.",
    metaDescription:
      "Residencia de hijos o tutelados de extranjeros residentes en España (arts. 159 y 160 RD 1155/2024) y lo que cambió con la sentencia del Supremo de 2026.",
    whatItIs:
      "Autorización de residencia para hijos o menores tutelados de extranjeros que residen legalmente en España, regulada en los arts. 159 y 160 del Reglamento de Extranjería (RD 1155/2024). La sentencia del Tribunal Supremo de 8 de julio de 2026 suavizó dos de sus exigencias.",
    forWho: [
      "Padres o tutores con residencia legal en España cuyos hijos o tutelados necesitan su propia autorización.",
    ],
    requirements: [
      "Que el progenitor o tutor resida legalmente en España.",
      "Acreditar el vínculo de filiación o la tutela.",
      "Residencia efectiva habitual del menor en España, con ausencias temporales justificadas admitidas.",
    ],
    needsVerification: [
      "Qué supuesto de los arts. 159 y 160 aplica según dónde nació y dónde vive el menor.",
      "Cómo justificar las ausencias temporales del territorio, si las hay.",
    ],
    documents: [
      { name: "Pasaporte del menor", source: "cliente" },
      { name: "Partida de nacimiento o documento de tutela", source: "cliente", note: "Legalizado o apostillado y traducido si es extranjero." },
      { name: "TIE en vigor del progenitor o tutor", source: "cliente" },
      { name: "Empadronamiento", source: "cliente" },
      { name: "Impreso oficial y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico", detail: "Confirmamos el supuesto y la documentación que aplica.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reúnes las partidas y la documentación del progenitor.", actor: "cliente" },
      { title: "Presentación", detail: "Presentamos la solicitud ante la Oficina de Extranjería.", actor: "extranjeria-segura" },
      { title: "Resolución y TIE", detail: "Seguimiento hasta la resolución y la tarjeta.", actor: "administracion" },
    ],
    feeFromCents: null,
    timeframe: "El plazo de resolución depende de la oficina. Te damos la estimación de tu provincia en el diagnóstico.",
    adminFeesNote: "No incluye tasas, traducciones juradas ni apostillas.",
    faqs: [
      { q: "Mi hijo es mayor de edad y está casado. ¿Ya no puede?", a: "Tras la sentencia del Tribunal Supremo de 8 de julio de 2026 ya no se exige la condición de «soltero». Revisamos el resto de requisitos en tu caso." },
      { q: "Ha pasado temporadas fuera de España. ¿Es un problema?", a: "La exigencia de no haberse ausentado se interpreta ahora como residencia efectiva habitual, que admite ausencias temporales justificadas. Hay que poder justificarlas." },
    ],
    sources: ["boe", "inclusion", "extranjeria"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["reagrupacion-familiar", "familiares-de-espanoles"],
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
    // El único importe que no cae limpio en la subida del 20 %. 129 × 1,20 =
    // 154,80, y queda casi a medio camino entre los dos precios terminados en
    // 9 —149 y 159—; todos los demás caían a menos de 0,20 € de uno. Se elige
    // 159: 149 sería bajar un 15,5 % cuando lo acordado era subir un 20 %, y
    // de los dos errores posibles el que cobra de menos es el que hay que
    // corregir después, delante del cliente.
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
    related: ["renovacion-residencia-trabajo", "residencia-larga-duracion"],
    seoCities: ["madrid", "barcelona", "valencia", "malaga", "murcia", "alicante", "sevilla", "bilbao"],
  },

  {
    slug: "prorroga-regularizacion-extraordinaria",
    name: "Prórroga o modificación de la regularización extraordinaria",
    shortName: "Prórroga de la regularización",
    category: "renovaciones",
    alsoIn: ["arraigo"],
    tagline: "Tu autorización de la regularización dura un año. Esto es lo que viene después.",
    metaDescription:
      "Qué hacer cuando vence la autorización de la regularización extraordinaria 2026: modificación del art. 191, prórroga de un año y prórroga de cuatro años.",
    whatItIs:
      "Las autorizaciones concedidas en la regularización extraordinaria (disposiciones adicionales 20.ª y 21.ª, introducidas por el RD 316/2026) tienen una vigencia de un año. El plazo para pedirlas está cerrado, pero quien la obtuvo tiene tres caminos para no perderla al vencer.",
    forWho: [
      "Personas con una autorización concedida en la regularización extraordinaria de 2026.",
    ],
    requirements: [
      "Modificación a otra autorización conforme al art. 191, en los dos meses previos al vencimiento.",
      "Prórroga excepcional por un año, acreditando búsqueda activa de empleo o un informe de esfuerzo de integración.",
      "Prórroga de cuatro años en casos de enfermedad grave, discapacidad o jubilación.",
    ],
    needsVerification: [
      "Fecha exacta de vencimiento de tu autorización y ventana de presentación.",
      "Cuál de los tres caminos encaja con tu situación laboral y personal.",
      "Qué documentación acredita la búsqueda de empleo o el esfuerzo de integración.",
    ],
    documents: [
      { name: "Resolución de concesión y TIE", source: "cliente" },
      { name: "Pasaporte en vigor", source: "cliente" },
      { name: "Contrato o documentación de la nueva autorización", source: "cliente", optional: true, note: "Si vas por la modificación del art. 191." },
      { name: "Acreditación de búsqueda activa de empleo o informe de integración", source: "cliente", optional: true },
      { name: "Informe médico, de discapacidad o de jubilación", source: "cliente", optional: true },
      { name: "Impreso oficial y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Cálculo de la ventana", detail: "Fijamos la fecha de vencimiento y los dos meses previos.", actor: "extranjeria-segura", duration: "El mismo día" },
      { title: "Elección del camino", detail: "Modificación, prórroga de un año o prórroga de cuatro años.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reúnes la prueba que exige el camino elegido.", actor: "cliente" },
      { title: "Presentación", detail: "Presentamos dentro de plazo y te damos el justificante.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "La modificación se pide en los dos meses previos al vencimiento de la autorización, que tiene una vigencia de un año.",
    adminFeesNote: "No incluye tasas.",
    faqs: [
      { q: "¿Todavía puedo pedir la regularización?", a: "No. Las solicitudes podían presentarse hasta el 30 de junio de 2026. Esta ficha es para quien ya la tiene concedida." },
      { q: "¿Qué pasa si no hago nada?", a: "La autorización se extingue al cumplir el año. Por eso conviene empezar antes de que se abra la ventana de los dos meses." },
    ],
    sources: ["boe", "inclusion", "extranjeria"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["renovacion-residencia-trabajo", "arraigo-sociolaboral"],
  },
  {
    slug: "renovacion-inversores",
    name: "Renovación de la residencia de inversor (Golden Visa)",
    shortName: "Renovación Golden Visa",
    category: "renovaciones",
    alsoIn: ["nomadas"],
    tagline: "La Golden Visa ya no se concede, pero la tuya se puede renovar.",
    metaDescription:
      "Renovación de la Golden Visa tras su supresión el 3 de abril de 2025: quién puede renovar, con qué normativa y por cuánto tiempo (Ley 14/2013).",
    whatItIs:
      "La residencia para inversores de la Ley 14/2013 quedó suprimida el 3 de abril de 2025: la disposición final 21.ª de la Ley Orgánica 1/2025 dejó sin contenido sus arts. 63 a 67. Las autorizaciones ya concedidas conservan su validez, y sus renovaciones se tramitan con la normativa vigente cuando se concedió la autorización inicial. Solo gestionamos renovaciones.",
    forWho: [
      "Titulares de un visado o una autorización de inversor válidos a 3 de abril de 2025 que necesitan renovarla.",
    ],
    requirements: [
      "Autorización de inversor concedida y válida a 3 de abril de 2025.",
      "Mantener la inversión y los demás requisitos de la normativa vigente en la fecha de concesión inicial.",
      "Requisitos generales del art. 62.3 de la Ley 14/2013: seguro de enfermedad, recursos económicos suficientes y sin antecedentes penales.",
    ],
    needsVerification: [
      "Qué normativa aplica a tu renovación según la fecha de tu autorización inicial.",
      "Que la inversión se mantiene en los términos en que se acreditó.",
    ],
    documents: [
      { name: "Pasaporte y TIE en vigor", source: "cliente" },
      { name: "Resolución de la autorización inicial", source: "cliente" },
      { name: "Acreditación de mantenimiento de la inversión", source: "cliente" },
      { name: "Seguro de enfermedad", source: "cliente" },
      { name: "Certificado de antecedentes penales", source: "cliente" },
      { name: "Solicitud electrónica y justificante de tasa", source: "nosotros" },
    ],
    process: [
      { title: "Revisión de la autorización inicial", detail: "Fijamos qué normativa aplica y la fecha de vencimiento.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Reúnes la acreditación de la inversión.", actor: "cliente" },
      { title: "Presentación ante la UGE-CE", detail: "Presentación electrónica de la renovación.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "Veinte días de plazo, con silencio positivo.", actor: "administracion", duration: "20 días" },
    ],
    feeFromCents: null,
    timeframe:
      "La UGE-CE resuelve en veinte días; sin respuesta en ese plazo, se entiende concedida por silencio administrativo. La renovación es por periodos de dos años.",
    adminFeesNote: "No incluye tasas, tasaciones ni certificaciones de la inversión.",
    faqs: [
      { q: "¿Podéis tramitarme una Golden Visa nueva?", a: "No. Desde el 3 de abril de 2025 no se puede solicitar. Si buscas residir en España con medios propios, mira la residencia no lucrativa." },
      { q: "¿Por cuánto tiempo se renueva?", a: "Por periodos de dos años (art. 76.3 de la Ley 14/2013)." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["residencia-no-lucrativa", "residencia-larga-duracion"],
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
    adminFeesNote: "No incluye procurador, peritos ni eventuales costas.",
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
  {
    slug: "razones-humanitarias-victimas",
    name: "Razones humanitarias y protección de víctimas",
    shortName: "Razones humanitarias",
    category: "proteccion",
    tagline: "Autorizaciones por circunstancias excepcionales, cuando la situación lo exige.",
    metaDescription:
      "Residencia por razones humanitarias y para víctimas de violencia de género, violencia sexual o trata (arts. 128 a 155 RD 1155/2024). Qué vía aplica y cómo.",
    whatItIs:
      "El Título VII del Reglamento de Extranjería (RD 1155/2024) prevé autorizaciones por circunstancias excepcionales: razones humanitarias, colaboración con autoridades, seguridad nacional e interés público (arts. 128 y 129), y las específicas para víctimas de violencia de género (arts. 133 a 136), de violencia sexual (arts. 137 a 141), de redes organizadas (arts. 142 a 147) y de trata de seres humanos (arts. 148 a 155).",
    forWho: [
      "Mujeres víctimas de violencia de género y víctimas de violencia sexual.",
      "Víctimas de trata de seres humanos o de redes organizadas que colaboran con las autoridades.",
      "Personas en situaciones humanitarias previstas en el art. 128.",
    ],
    requirements: [
      "Encajar en uno de los supuestos de los arts. 128 a 155 del RD 1155/2024.",
      "Acreditar la situación con la documentación que exige cada supuesto: resolución judicial, orden de protección, informe del Ministerio Fiscal u otro.",
      "Las de las letras b) y c) del art. 128.1 y las de víctimas (capítulos II a V del Título VII) no admiten modificación por la vía general (art. 191.7).",
    ],
    needsVerification: [
      "Qué supuesto se ajusta a tu situación y qué documento lo acredita.",
      "Si tienes derecho a asistencia jurídica gratuita.",
    ],
    documents: [
      { name: "Pasaporte o documento de identidad disponible", source: "cliente" },
      { name: "Documento que acredita la situación", source: "cliente", note: "Orden de protección, resolución judicial, informe o denuncia, según el supuesto." },
      { name: "Impreso oficial", source: "nosotros" },
    ],
    process: [
      { title: "Escucha y diagnóstico", detail: "Identificamos el supuesto con discreción y te informamos de la asistencia gratuita disponible.", actor: "extranjeria-segura" },
      { title: "Documentación", detail: "Te indicamos qué documento acredita tu situación y cómo obtenerlo.", actor: "cliente" },
      { title: "Presentación", detail: "Presentamos la solicitud ante la autoridad competente.", actor: "extranjeria-segura" },
      { title: "Resolución", detail: "Seguimiento del expediente hasta la resolución.", actor: "administracion" },
    ],
    feeFromCents: null,
    timeframe: "Cada supuesto tiene su propio procedimiento. Te damos el plazo del tuyo en el diagnóstico.",
    adminFeesNote:
      "Las víctimas de violencia de género y de trata pueden tener derecho a asistencia jurídica gratuita. Te informamos de ello con transparencia antes de contratar nada.",
    faqs: [
      { q: "¿Mi situación irregular me perjudica si denuncio?", a: "La normativa protege a las víctimas en estos supuestos. Antes de dar ningún paso, revisamos contigo cuál es el tuyo y qué garantías te da." },
      { q: "¿Puedo cambiar luego a otra autorización?", a: "Depende del supuesto: varias de estas autorizaciones no admiten la modificación general (art. 191.7). Cada una tiene su propio camino de continuidad, y lo planificamos desde el principio." },
    ],
    sources: ["boe", "inclusion"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["arraigo-social", "arraigo-familiar"],
  },

  /* ============================ RESIDENCIA FISCAL ============================ */
  {
    slug: "certificado-residencia-fiscal",
    name: "Certificado de residencia fiscal y alta censal",
    shortName: "Residencia fiscal",
    category: "fiscal",
    tagline: "Tener la TIE no te hace residente fiscal. Y al revés tampoco.",
    metaDescription:
      "Residencia fiscal en España: criterios del art. 9.1 LIRPF, alta censal con los modelos 030 y 036 y certificado de la AEAT, genérico o a efectos de convenio.",
    whatItIs:
      "La residencia administrativa (tu TIE) y la residencia fiscal son planos independientes. Eres residente fiscal en España si cumples alguno de los criterios del art. 9.1 de la Ley del IRPF, y lo acreditas con el certificado de residencia fiscal que expide la Agencia Tributaria, previa alta en el censo.",
    forWho: [
      "Quien acaba de trasladarse a España y necesita darse de alta como contribuyente.",
      "Quien necesita acreditar su residencia fiscal en España ante otro país para aplicar un convenio de doble imposición.",
      "Quien ha cambiado de domicilio o de datos personales ante la Agencia Tributaria.",
    ],
    requirements: [
      "Permanecer más de 183 días en España en el año natural; las ausencias esporádicas computan salvo que acredites la residencia fiscal en otro país (art. 9.1.a LIRPF).",
      "O tener en España el núcleo principal o la base de tus actividades o intereses económicos (art. 9.1.b LIRPF).",
      "Se presume residente, salvo prueba en contrario, quien tiene en España a su cónyuge no separado y a sus hijos menores dependientes.",
      "Alta censal: modelo 030 si no tienes actividad económica, o modelo 036 si la ejerces. El modelo 037 se suprimió por la Orden HAC/1526/2024.",
    ],
    needsVerification: [
      "Si cumples el criterio de los 183 días o el de intereses económicos, y cómo probarlo.",
      "Qué modalidad de certificado necesitas: genérico o a efectos de un convenio con un país concreto.",
      "Si el otro país también te considera residente, y cómo resuelve el convenio ese conflicto.",
    ],
    documents: [
      { name: "NIE o TIE", source: "cliente" },
      { name: "Certificado de empadronamiento", source: "cliente" },
      { name: "Prueba de permanencia en España", source: "cliente", note: "Contrato de alquiler, suministros, billetes, vida laboral." },
      { name: "Modelo 030 o 036 de alta censal", source: "nosotros" },
      { name: "Solicitud del certificado de residencia fiscal", source: "nosotros" },
    ],
    process: [
      { title: "Diagnóstico de residencia", detail: "Comprobamos qué criterio del art. 9.1 cumples y con qué pruebas.", actor: "extranjeria-segura" },
      { title: "Alta censal", detail: "Presentamos el modelo 030 o el 036 según tengas o no actividad económica.", actor: "extranjeria-segura" },
      { title: "Solicitud del certificado", detail: "En la sede electrónica de la AEAT o, en persona, con el Modelo 01.", actor: "extranjeria-segura" },
      { title: "Expedición", detail: "La AEAT expide el certificado o pide más documentación.", actor: "administracion" },
    ],
    feeFromCents: null,
    timeframe:
      "La AEAT puede expedirlo de forma inmediata por la sede electrónica. Si no lo hace, el expediente se reabre aportando prueba de residencia.",
    adminFeesNote: "No incluye traducciones juradas de la documentación extranjera que acredite tu residencia.",
    faqs: [
      { q: "Tengo TIE. ¿Ya soy residente fiscal?", a: "No necesariamente. La residencia administrativa y la fiscal son planos independientes. Puedes tener TIE y no ser residente fiscal, o al revés." },
      { q: "La AEAT me lo ha denegado. ¿Qué hago?", a: "Puede reabrirse el expediente aportando documentación que justifique tu residencia. Preparamos esa prueba." },
      { q: "¿Y si vengo de un paraíso fiscal?", a: "La Administración puede exigirte que pruebes que permaneciste allí 183 días en el año natural para aceptar que no eras residente en España." },
    ],
    sources: ["boe", "aeat"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["regimen-impatriados", "no-residentes-irnr", "teletrabajo-internacional"],
  },
  {
    slug: "regimen-impatriados",
    name: "Régimen de impatriados («Ley Beckham»)",
    shortName: "Ley Beckham",
    category: "fiscal",
    alsoIn: ["nomadas"],
    tagline: "Tributar al 24 % durante seis años si te trasladas a España a trabajar.",
    metaDescription:
      "Ley Beckham (art. 93 LIRPF): quién puede optar, retención del 24 %, plazo de seis meses para el modelo 149 y declaración anual con el modelo 151.",
    whatItIs:
      "Régimen especial para trabajadores desplazados a España (art. 93 de la Ley del IRPF y arts. 116 y 119 de su Reglamento). Quien opta tributa con las normas del Impuesto sobre la Renta de no Residentes durante el año del desplazamiento y los cinco siguientes, aunque sea residente fiscal en España.",
    forWho: [
      "Personas que se desplazan a España por un contrato de trabajo, incluido el teletrabajo con visado de la Ley 14/2013.",
      "Administradores de empresas y emprendedores con informe de ENISA.",
      "Profesionales altamente cualificados que prestan servicios a empresas emergentes o realizan actividades de I+D+i.",
      "Cónyuge e hijos menores de 25 años, que pueden extender el régimen (art. 93.3).",
    ],
    requirements: [
      "No haber sido residente fiscal en España en los cinco periodos impositivos anteriores.",
      "Desplazarse a España por alguno de los motivos previstos: contrato de trabajo, nombramiento como administrador, actividad emprendedora o profesional altamente cualificado.",
      "No obtener rentas mediante establecimiento permanente en España, salvo emprendedores y profesionales altamente cualificados.",
      "Comunicar la opción con el modelo 149 en el plazo máximo de seis meses desde el inicio de la actividad que conste en el alta en la Seguridad Social (art. 116.1.a RIRPF).",
      "No haberse acogido al procedimiento especial de retenciones del art. 89.B del RIRPF (art. 116.3).",
    ],
    needsVerification: [
      "Fecha exacta de inicio de actividad en tu alta en la Seguridad Social: de ella cuenta el plazo de seis meses.",
      "Si has sido residente fiscal en España en alguno de los cinco años anteriores.",
      "Si te conviene optar: el régimen implica tributar por obligación real en el Impuesto sobre el Patrimonio.",
    ],
    documents: [
      { name: "NIE o TIE", source: "cliente" },
      { name: "Alta en la Seguridad Social o certificado de cobertura", source: "cliente" },
      { name: "Contrato, nombramiento o informe de ENISA", source: "cliente" },
      { name: "Documentación del art. 119.2 RIRPF", source: "nosotros" },
      { name: "Modelo 149", source: "nosotros" },
      { name: "Documento acreditativo de la AEAT", source: "administracion" },
    ],
    process: [
      { title: "Diagnóstico de elegibilidad", detail: "Comprobamos los cinco años previos, el motivo del desplazamiento y la fecha de alta.", actor: "extranjeria-segura", duration: "24–48 h" },
      { title: "Modelo 149", detail: "Comunicamos la opción dentro de los seis meses, con la documentación del art. 119.2.", actor: "extranjeria-segura" },
      { title: "Documento acreditativo", detail: "La AEAT lo expide en diez días hábiles. Se lo entregas a tu pagador.", actor: "administracion", duration: "10 días hábiles" },
      { title: "Declaración anual", detail: "Cada año, la declaración con el modelo 151.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "La AEAT expide el documento acreditativo en diez días hábiles desde la comunicación (art. 119.4 RIRPF).",
    adminFeesNote: "La declaración anual con el modelo 151 se presupuesta aparte.",
    faqs: [
      { q: "¿Cuánto se paga?", a: "Una retención del 24 % sobre los rendimientos del trabajo, y del 47 % sobre el exceso de 600.000 euros." },
      { q: "¿Sirve si soy nómada digital?", a: "Sí: el teletrabajo con visado de la Ley 14/2013 es uno de los supuestos de desplazamiento que permiten optar." },
      { q: "¿Qué pasa si se me pasan los seis meses?", a: "El plazo es máximo y cuenta desde el inicio de actividad que figura en tu alta en la Seguridad Social. Fuera de plazo ya no se puede optar, por eso lo calculamos el primer día." },
    ],
    sources: ["boe", "aeat"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["teletrabajo-internacional", "certificado-residencia-fiscal", "tarjeta-azul-ue"],
  },
  {
    slug: "no-residentes-irnr",
    name: "Impuesto sobre la Renta de no Residentes (modelo 210)",
    shortName: "No residentes",
    category: "fiscal",
    tagline: "Si tienes rentas en España pero no vives aquí.",
    metaDescription:
      "Impuesto sobre la Renta de no Residentes: declaración con el modelo 210 y certificado de residencia fiscal del país de origen para aplicar el convenio.",
    whatItIs:
      "Quien obtiene rentas en España sin ser residente fiscal tributa por el Impuesto sobre la Renta de no Residentes, con el modelo 210. Para aplicar el convenio de doble imposición con su país necesita el certificado de residencia fiscal que expide la autoridad de ese país.",
    forWho: [
      "Propietarios de un inmueble en España que no residen aquí.",
      "Quien cobra en España rentas, intereses o rendimientos sin ser residente fiscal.",
    ],
    requirements: [
      "Declarar las rentas obtenidas en España con el modelo 210.",
      "Certificado de residencia fiscal del país de origen para aplicar el convenio.",
      "Los españoles que trasladan su residencia a un paraíso fiscal siguen siendo contribuyentes por IRPF en el periodo del cambio y en los cuatro siguientes (art. 8.2 LIRPF).",
    ],
    needsVerification: [
      "Si existe convenio con tu país y qué tipo aplica a cada renta.",
      "Qué rentas tienes que declarar y con qué periodicidad.",
    ],
    documents: [
      { name: "NIE", source: "cliente" },
      { name: "Certificado de residencia fiscal del país de origen", source: "cliente" },
      { name: "Justificantes de las rentas obtenidas en España", source: "cliente" },
      { name: "Modelo 210", source: "nosotros" },
    ],
    process: [
      { title: "Revisión de rentas", detail: "Identificamos qué rentas tributan y si aplica convenio.", actor: "extranjeria-segura" },
      { title: "Certificado de origen", detail: "Obtienes el certificado de residencia fiscal en tu país.", actor: "cliente" },
      { title: "Modelo 210", detail: "Preparamos y presentamos la declaración.", actor: "extranjeria-segura" },
    ],
    feeFromCents: null,
    timeframe: "Depende del tipo de renta. Te damos el calendario de declaraciones en el diagnóstico.",
    adminFeesNote: "No incluye el certificado de residencia fiscal de tu país, que expide su propia administración tributaria.",
    faqs: [
      { q: "Me mudo a España. ¿Sigo con el modelo 210?", a: "No, si pasas a ser residente fiscal: entonces declaras por IRPF. Revisamos en qué año cambias de régimen." },
    ],
    sources: ["boe", "aeat"],
    updatedAt: CATALOGO,
    pendingLegalReview: true,
    related: ["certificado-residencia-fiscal", "regimen-impatriados"],
  },
];

/* ------------------------------------------------------------------ */

/**
 * Las fichas que se publican. Todo lo público —listados, rutas, sitemap,
 * diagnóstico, SEO programático— parte de aquí. Las bloqueadas están en
 * `bloqueos.ts`.
 */
export const TRAMITES: Tramite[] = TODAS_LAS_FICHAS.filter((t) => !bloqueado("tramites", t.slug));

/** Fichas bajo candado: existen, el panel interno las ve, la web no. */
export const TRAMITES_BLOQUEADOS: Tramite[] = TODAS_LAS_FICHAS.filter((t) =>
  bloqueado("tramites", t.slug),
);

/**
 * Mapa de TODAS las fichas, bloqueadas incluidas. Lo usa el panel interno:
 * un expediente de nacionalidad abierto antes del bloqueo sigue necesitando
 * su plan documental. Lo público resuelve con `getTramite`.
 */
export const TRAMITE_MAP = Object.fromEntries(TODAS_LAS_FICHAS.map((t) => [t.slug, t]));

const PUBLICAS = Object.fromEntries(TRAMITES.map((t) => [t.slug, t]));

/** Resuelve una ficha publicada. Una bloqueada devuelve `undefined`, como si no existiera. */
export function getTramite(slug: string): Tramite | undefined {
  return PUBLICAS[slug];
}

export function tramitesByCategory(category: string) {
  return TRAMITES.filter((t) => t.category === category || t.alsoIn?.includes(category as never));
}

export function displayName(t: { name: string; shortName?: string }) {
  return t.shortName ?? t.name;
}
