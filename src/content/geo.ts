/**
 * PROGRAMMATIC SEO SOURCE DATA.
 *
 * The rule for this file: a city or nationality page only exists if we have
 * something genuinely different to say on it. Swapping a place name into a
 * template produces a junk page that helps nobody and, for legal content,
 * actively misleads. So each entry carries its own facts — the competent
 * office, the local particularity, the legalisation route of that country —
 * and the page generator refuses to build a combination without them.
 *
 * All of it is flagged for legal review before publication.
 */

export interface City {
  slug: string;
  name: string;
  /** Grammatically correct "in <city>" for headlines. */
  inCity: string;
  province: string;
  community: string;
  /** Who issues the arraigo/integration report in this territory. */
  arraigoReportBody: string;
  /** Genuinely local, non-templated notes. */
  notes: string[];
}

export const CITIES: City[] = [
  {
    slug: "madrid",
    name: "Madrid",
    inCity: "en Madrid",
    province: "Madrid",
    community: "Comunidad de Madrid",
    arraigoReportBody: "Dirección General competente de la Comunidad de Madrid",
    notes: [
      "Madrid concentra el mayor volumen de expedientes de España, lo que se traduce en plazos de cita y de resolución sensiblemente distintos según la oficina asignada.",
      "El informe de arraigo lo tramita la Comunidad de Madrid, con su propio procedimiento y sus propios plazos, independientes del expediente principal.",
      "Al ser sede de las unidades de tramitación de la Ley 14/2013, los perfiles altamente cualificados y de teletrabajo internacional suelen resolverse aquí con plazos más cortos que en la vía general.",
    ],
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    inCity: "en Barcelona",
    province: "Barcelona",
    community: "Cataluña",
    arraigoReportBody: "Generalitat de Catalunya, a través del circuito de informes de estrangeria",
    notes: [
      "En Cataluña el informe de arraigo lo emite la Generalitat siguiendo un circuito propio que se inicia normalmente en el ayuntamiento de residencia.",
      "El empadronamiento en Barcelona ciudad y en el área metropolitana tiene requisitos de acreditación de domicilio que conviene resolver antes de iniciar el expediente.",
      "Existen servicios municipales de acogida cuyos informes y certificados pueden reforzar la acreditación de integración.",
    ],
  },
  {
    slug: "valencia",
    name: "València",
    inCity: "en València",
    province: "Valencia",
    community: "Comunitat Valenciana",
    arraigoReportBody: "Generalitat Valenciana",
    notes: [
      "El informe de arraigo en la Comunitat Valenciana lo emite la Generalitat, habitualmente previa intervención de los servicios sociales municipales.",
      "València ha ganado peso como destino de teletrabajo internacional, lo que hace frecuentes las modificaciones y renovaciones vinculadas a esta vía.",
      "Los plazos de cita para la toma de huellas de la TIE varían de forma notable entre las comisarías de la provincia.",
    ],
  },
  {
    slug: "sevilla",
    name: "Sevilla",
    inCity: "en Sevilla",
    province: "Sevilla",
    community: "Andalucía",
    arraigoReportBody: "Junta de Andalucía",
    notes: [
      "En Andalucía el informe de arraigo lo emite la Junta, con criterios propios de valoración de la integración.",
      "La estacionalidad del empleo agrícola y hostelero en la provincia influye en cómo se acreditan las cotizaciones en renovaciones.",
    ],
  },
  {
    slug: "malaga",
    name: "Málaga",
    inCity: "en Málaga",
    province: "Málaga",
    community: "Andalucía",
    arraigoReportBody: "Junta de Andalucía",
    notes: [
      "Málaga concentra un volumen alto de residencias no lucrativas y de teletrabajo internacional por el perfil de población extranjera de la Costa del Sol.",
      "La demanda de citas de extranjería en la provincia es de las más altas de España, lo que hace crítico anticipar la gestión de la cita.",
    ],
  },
  {
    slug: "murcia",
    name: "Murcia",
    inCity: "en Murcia",
    province: "Murcia",
    community: "Región de Murcia",
    arraigoReportBody: "Comunidad Autónoma de la Región de Murcia",
    notes: [
      "El peso del sector agroalimentario hace que las vías vinculadas a contrato de trabajo sean especialmente frecuentes en la región.",
      "El informe de arraigo lo emite la Comunidad Autónoma, con su propio formulario y su propio plazo.",
    ],
  },
  {
    slug: "zaragoza",
    name: "Zaragoza",
    inCity: "en Zaragoza",
    province: "Zaragoza",
    community: "Aragón",
    arraigoReportBody: "Gobierno de Aragón",
    notes: [
      "El informe de arraigo lo emite el Gobierno de Aragón, normalmente a través de los servicios sociales del ayuntamiento correspondiente.",
      "El volumen de expedientes es menor que en Madrid o Barcelona, lo que en la práctica suele traducirse en plazos de cita más manejables.",
    ],
  },
  {
    slug: "bilbao",
    name: "Bilbao",
    inCity: "en Bilbao",
    province: "Bizkaia",
    community: "País Vasco",
    arraigoReportBody: "Gobierno Vasco",
    notes: [
      "En el País Vasco el informe de arraigo lo emite el Gobierno Vasco, con un circuito propio que incluye a los servicios sociales de base.",
      "Los servicios municipales de Bilbao ofrecen recursos de acogida cuya documentación puede reforzar la acreditación de integración.",
    ],
  },
  {
    slug: "alicante",
    name: "Alicante",
    inCity: "en Alicante",
    province: "Alicante",
    community: "Comunitat Valenciana",
    arraigoReportBody: "Generalitat Valenciana",
    notes: [
      "Alicante combina un alto volumen de residencias no lucrativas de ciudadanos de terceros países con expedientes vinculados a hostelería y turismo.",
      "El informe de arraigo sigue el circuito de la Generalitat Valenciana.",
    ],
  },
  {
    slug: "palma",
    name: "Palma",
    inCity: "en Palma",
    province: "Illes Balears",
    community: "Illes Balears",
    arraigoReportBody: "Govern de les Illes Balears",
    notes: [
      "La fuerte estacionalidad del empleo balear condiciona cómo se acreditan las cotizaciones en las renovaciones.",
      "La disponibilidad de citas en las islas es especialmente sensible en temporada alta.",
    ],
  },
];

export const CITY_MAP = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

/* ------------------------------------------------------------------ */

export interface Nationality {
  slug: string;
  /** Demonym in plural, as used in the URL and headlines: "colombianos". */
  demonym: string;
  country: string;
  /** Reduced nationality residence period, when the Civil Code provides one. */
  nationalityYears: 2 | 10;
  /** Whether the country is party to the Hague Apostille Convention. */
  apostille: boolean;
  /** Country-specific document notes. */
  notes: string[];
  /** Where the criminal-record certificate comes from. */
  criminalRecordBody: string;
}

export const NATIONALITIES: Nationality[] = [
  {
    slug: "colombianos",
    demonym: "colombianos",
    country: "Colombia",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Policía Nacional de Colombia",
    notes: [
      "Colombia es parte del Convenio de La Haya, por lo que los documentos se legalizan mediante apostilla, que puede obtenerse en línea a través de la Cancillería.",
      "Los certificados de nacimiento deben solicitarse en copia reciente en la Registraduría antes de apostillarse.",
      "Al ser país iberoamericano, el plazo de residencia legal exigido para la nacionalidad por residencia es el reducido de dos años.",
    ],
  },
  {
    slug: "venezolanos",
    demonym: "venezolanos",
    country: "Venezuela",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Ministerio del Poder Popular para Relaciones Interiores",
    notes: [
      "La obtención y apostilla de documentos venezolanos suele ser el cuello de botella del expediente, por lo que conviene iniciarla antes que nada.",
      "Venezuela es parte del Convenio de La Haya: la legalización se realiza mediante apostilla.",
      "Como país iberoamericano, aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "peruanos",
    demonym: "peruanos",
    country: "Perú",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Poder Judicial del Perú / RENIEC según el certificado",
    notes: [
      "Perú permite obtener buena parte de los certificados registrales de forma telemática, lo que acorta mucho la preparación del expediente.",
      "La legalización se realiza mediante apostilla del Ministerio de Relaciones Exteriores.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "argentinos",
    demonym: "argentinos",
    country: "Argentina",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Registro Nacional de Reincidencia",
    notes: [
      "El certificado de antecedentes se obtiene en el Registro Nacional de Reincidencia y puede tramitarse a distancia desde España.",
      "Argentina es parte del Convenio de La Haya y apostilla de forma digital, lo que agiliza la legalización.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "brasilenos",
    demonym: "brasileños",
    country: "Brasil",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Polícia Federal",
    notes: [
      "Los documentos brasileños requieren apostilla y traducción jurada al español; la apostilla la realizan los cartórios habilitados.",
      "Brasil es uno de los principales orígenes de solicitudes de teletrabajo internacional hacia España.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "ecuatorianos",
    demonym: "ecuatorianos",
    country: "Ecuador",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Ministerio del Interior del Ecuador",
    notes: [
      "Buena parte de la documentación registral ecuatoriana puede obtenerse en línea y apostillarse digitalmente.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "marroquies",
    demonym: "marroquíes",
    country: "Marruecos",
    nationalityYears: 10,
    apostille: true,
    criminalRecordBody: "Ministerio de Justicia de Marruecos",
    notes: [
      "Los documentos marroquíes deben venir apostillados y traducidos por traductor jurado de árabe.",
      "Marruecos no está entre los países con plazo reducido, por lo que para la nacionalidad por residencia aplica el plazo general de diez años, salvo que concurra otro supuesto reducido.",
      "La transcripción de matrimonios y nacimientos en registros españoles suele requerir pasos adicionales.",
    ],
  },
  {
    slug: "dominicanos",
    demonym: "dominicanos",
    country: "República Dominicana",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Procuraduría General de la República",
    notes: [
      "Los certificados de la Junta Central Electoral deben apostillarse por la Procuraduría antes de su presentación en España.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "chinos",
    demonym: "chinos",
    country: "China",
    nationalityYears: 10,
    apostille: true,
    criminalRecordBody: "Autoridad de seguridad pública del lugar de residencia",
    notes: [
      "China se incorporó al Convenio de La Haya en 2023, de modo que los documentos se apostillan en lugar de seguir la legalización consular anterior. Verifica siempre la fecha de emisión del documento.",
      "Toda la documentación requiere traducción jurada de chino a español.",
      "Aplica el plazo general de diez años para la nacionalidad por residencia, salvo otro supuesto reducido.",
    ],
  },
  {
    slug: "estadounidenses",
    demonym: "estadounidenses",
    country: "Estados Unidos",
    nationalityYears: 10,
    apostille: true,
    criminalRecordBody: "FBI (Identity History Summary)",
    notes: [
      "El certificado del FBI debe apostillarse en el Departamento de Estado, un paso que suele añadir semanas al calendario.",
      "Es uno de los orígenes más frecuentes de residencia no lucrativa y de teletrabajo internacional.",
      "Aplica el plazo general de diez años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "britanicos",
    demonym: "británicos",
    country: "Reino Unido",
    nationalityYears: 10,
    apostille: true,
    criminalRecordBody: "ACRO Criminal Records Office",
    notes: [
      "Tras la salida del Reino Unido de la Unión Europea, los ciudadanos británicos se rigen por el régimen general de extranjería salvo que estén amparados por el Acuerdo de Retirada.",
      "El certificado de ACRO debe apostillarse en el FCDO.",
      "Aplica el plazo general de diez años para la nacionalidad por residencia.",
    ],
  },
  {
    slug: "mexicanos",
    demonym: "mexicanos",
    country: "México",
    nationalityYears: 2,
    apostille: true,
    criminalRecordBody: "Fiscalía General de la República o autoridad estatal",
    notes: [
      "La apostilla se realiza en la Secretaría de Gobernación o en las secretarías estatales, según el emisor del documento.",
      "Aplica el plazo reducido de dos años para la nacionalidad por residencia.",
    ],
  },
];

export const NATIONALITY_MAP = Object.fromEntries(NATIONALITIES.map((n) => [n.slug, n]));
