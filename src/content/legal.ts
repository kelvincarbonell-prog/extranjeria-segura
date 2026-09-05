/**
 * LEGAL TEXT TEMPLATES.
 *
 * ⚠️  EVERY DOCUMENT HERE IS A TEMPLATE, NOT A LEGAL TEXT.
 *
 * They are structured drafts that identify what each document must cover and
 * flag every value the business has to supply. They are deliberately NOT
 * written as finished legal copy: publishing invented company details,
 * invented data-processor lists or invented retention periods would be worse
 * than publishing nothing, because a visitor cannot tell the difference.
 *
 * `<LegalDocument/>` renders a permanent banner on every one of these pages
 * until `reviewed` is set to true by the responsible professional.
 *
 * Placeholders use the form [[NOMBRE]] and are highlighted in the UI so no
 * unfilled field can reach production unnoticed.
 */

export interface LegalSection {
  heading: string;
  /** Paragraphs. May contain [[PLACEHOLDER]] tokens. */
  body: string[];
  /** Bullet list rendered after the paragraphs. */
  list?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  /** Set to true only when a lawyer has reviewed and signed off the final text. */
  reviewed: boolean;
  updatedAt: string;
  /** What the reviewing professional specifically has to resolve. */
  reviewNotes: string[];
  sections: LegalSection[];
}

const PENDING = "2026-09-05";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "aviso-legal",
    title: "Aviso legal",
    description:
      "Información general del titular del sitio, condiciones de uso y régimen de responsabilidad.",
    reviewed: false,
    updatedAt: PENDING,
    reviewNotes: [
      "Completar la identificación del titular: razón social, NIF, domicilio y datos registrales.",
      "Indicar el colegio profesional de inscripción y el número de colegiado del profesional responsable, conforme a la Ley 34/2002 y a la normativa de servicios profesionales.",
      "Confirmar si procede mención al seguro de responsabilidad civil profesional.",
      "Revisar la cláusula de resolución de conflictos y el fuero aplicable.",
    ],
    sections: [
      {
        heading: "Titular del sitio web",
        body: [
          "En cumplimiento del deber de información recogido en la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, se hacen constar los siguientes datos:",
        ],
        list: [
          "Denominación social: [[RAZÓN SOCIAL]]",
          "NIF: [[NIF]]",
          "Domicilio social: [[DOMICILIO]]",
          "Correo electrónico de contacto: [[EMAIL]]",
          "Datos registrales: [[REGISTRO MERCANTIL, TOMO, FOLIO, HOJA]]",
          "Colegio profesional y número de colegiado del profesional responsable: [[COLEGIO Y Nº]]",
        ],
      },
      {
        heading: "Objeto",
        body: [
          "Este sitio web ofrece información sobre procedimientos de extranjería y da acceso a una plataforma de gestión de expedientes. El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación de las presentes condiciones.",
        ],
      },
      {
        heading: "Naturaleza de la información publicada",
        body: [
          "Los contenidos informativos sobre trámites, requisitos y plazos tienen carácter divulgativo y orientativo. No constituyen asesoramiento jurídico ni generan relación profesional alguna. La aplicación de la normativa a un caso concreto exige el análisis individualizado de la documentación por un profesional.",
          "Los resultados generados por la herramienta de diagnóstico son una orientación preliminar automatizada. No garantizan el cumplimiento de requisitos ni la concesión de ninguna autorización.",
        ],
      },
      {
        heading: "Propiedad intelectual e industrial",
        body: [
          "Los contenidos, la marca, el diseño y el código fuente de este sitio son titularidad de [[RAZÓN SOCIAL]] o se utilizan con la debida autorización. Queda prohibida su reproducción o distribución sin consentimiento expreso.",
        ],
      },
      {
        heading: "Responsabilidad",
        body: [
          "[[REVISAR: alcance de la exclusión de responsabilidad por disponibilidad del servicio, enlaces a sedes electrónicas de la Administración y cambios normativos posteriores a la fecha de revisión de cada contenido.]]",
        ],
      },
      {
        heading: "Legislación aplicable y jurisdicción",
        body: ["[[REVISAR: ley aplicable y fuero, con atención a la normativa de consumidores.]]"],
      },
    ],
  },
  {
    slug: "privacidad",
    title: "Política de privacidad",
    description:
      "Quién trata tus datos, con qué base legal, durante cuánto tiempo y cómo ejercer tus derechos.",
    reviewed: false,
    updatedAt: PENDING,
    reviewNotes: [
      "Identificar al responsable del tratamiento y, si procede, al delegado de protección de datos.",
      "Cerrar la lista de encargados de tratamiento reales (alojamiento, correo transaccional, pagos, calendario) y sus ubicaciones.",
      "Fijar los plazos de conservación por tipo de documento, conforme a la normativa de extranjería y a la de prevención del blanqueo si resulta aplicable.",
      "Determinar si el tratamiento de certificados de antecedentes penales requiere la base jurídica reforzada del artículo 10 del RGPD y documentarla.",
      "Valorar la necesidad de una evaluación de impacto (EIPD) por el volumen y la sensibilidad de la documentación tratada.",
    ],
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: ["Responsable: [[RAZÓN SOCIAL]], NIF [[NIF]], con domicilio en [[DOMICILIO]]."],
        list: [
          "Contacto para asuntos de protección de datos: [[EMAIL DPD O CONTACTO]]",
          "Delegado de protección de datos: [[NOMBRE O «no designado», justificando la decisión]]",
        ],
      },
      {
        heading: "Qué datos tratamos",
        body: [
          "Para gestionar un expediente de extranjería necesitamos tratar datos identificativos y documentación acreditativa. Es información sensible por su naturaleza y así la tratamos.",
        ],
        list: [
          "Datos identificativos y de contacto: nombre, apellidos, correo, teléfono, domicilio.",
          "Datos documentales: pasaporte, NIE o TIE, certificados registrales, empadronamiento.",
          "Datos relativos a antecedentes penales, cuando el procedimiento los exige. [[REVISAR base jurídica del art. 10 RGPD]]",
          "Datos laborales y económicos: contrato, vida laboral, acreditación de medios.",
          "Datos familiares, cuando el procedimiento lo requiere.",
          "Datos de uso de la plataforma y registro de accesos a tu expediente.",
        ],
      },
      {
        heading: "Con qué base legal",
        body: [
          "Ejecución del contrato de prestación de servicios, para la gestión del expediente.",
          "Cumplimiento de obligaciones legales, para la facturación y la conservación documental.",
          "Consentimiento, para las comunicaciones comerciales y para los canales de aviso opcionales. Puedes retirarlo en cualquier momento sin que afecte a la gestión de tu expediente.",
          "[[REVISAR: interés legítimo, si se invoca para algún tratamiento concreto, con el correspondiente juicio de ponderación documentado.]]",
        ],
      },
      {
        heading: "Durante cuánto tiempo",
        body: [
          "[[PENDIENTE: fijar plazos por categoría documental. Como criterio de partida, la documentación del expediente se conserva mientras dure la relación y, después, durante los plazos de prescripción de las acciones legales y de las obligaciones fiscales y profesionales que resulten aplicables.]]",
          "La plataforma tiene implementado un periodo de retención configurable por tipo de documento y un proceso de supresión automática al vencer.",
        ],
      },
      {
        heading: "A quién se comunican",
        body: [
          "A la Administración competente, cuando es necesario para la tramitación de tu expediente y con tu conocimiento.",
          "A los encargados de tratamiento que prestan servicios técnicos, con contrato conforme al artículo 28 del RGPD:",
        ],
        list: [
          "Alojamiento e infraestructura: [[PROVEEDOR Y UBICACIÓN]]",
          "Base de datos y almacenamiento documental: [[PROVEEDOR Y UBICACIÓN]]",
          "Correo transaccional: [[PROVEEDOR]]",
          "Pasarela de pago: [[PROVEEDOR]] — no tratamos ni almacenamos datos de tarjeta.",
          "Videollamada y calendario: [[PROVEEDOR, si se activa]]",
          "[[REVISAR: transferencias internacionales y garantías aplicables.]]",
        ],
      },
      {
        heading: "Medidas de seguridad",
        body: [
          "Almacenamiento privado sin acceso público, con enlaces firmados de vigencia limitada para cada descarga.",
          "Aislamiento de datos a nivel de fila en la base de datos: cada expediente es inaccesible desde cualquier otra cuenta.",
          "Control de acceso por roles con principio de mínimo privilegio.",
          "Registro de auditoría de accesos y modificaciones, consultable por la persona interesada.",
          "Cifrado en tránsito y en reposo.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad desde tu área privada o escribiendo a [[EMAIL]]. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Política de cookies",
    description: "Qué cookies utilizamos, para qué y cómo gestionarlas.",
    reviewed: false,
    updatedAt: PENDING,
    reviewNotes: [
      "Realizar una auditoría real de cookies antes de publicar y listar solo las que efectivamente se instalan.",
      "Si se incorpora analítica, configurar el banner con rechazo tan accesible como la aceptación, conforme a la guía de la AEPD.",
    ],
    sections: [
      {
        heading: "Situación actual",
        body: [
          "En su estado actual, la plataforma no instala cookies de analítica ni de publicidad. Utiliza exclusivamente almacenamiento técnico necesario para el funcionamiento del servicio:",
        ],
        list: [
          "Cookies de sesión de autenticación, necesarias para mantener tu sesión iniciada.",
          "Almacenamiento local para recordar tu preferencia de idioma.",
          "Almacenamiento de sesión para conservar el progreso del diagnóstico en tu navegador. Estos datos no se envían a ningún servidor.",
        ],
      },
      {
        heading: "Si se incorporan cookies no necesarias",
        body: [
          "[[PENDIENTE: en el momento en que se incorpore analítica o cualquier cookie no estrictamente necesaria, deberá implementarse un banner de consentimiento previo, granular, con opción de rechazo igual de accesible que la de aceptación, y actualizarse esta política con la tabla completa de cookies, su finalidad, su titular y su duración.]]",
        ],
      },
    ],
  },
  {
    slug: "condiciones",
    title: "Condiciones de contratación",
    description: "Qué contratas exactamente, qué incluye, cómo se paga y cómo se resuelve.",
    reviewed: false,
    updatedAt: PENDING,
    reviewNotes: [
      "Revisar el derecho de desistimiento de 14 días y su interacción con el inicio anticipado del servicio a petición del cliente.",
      "Concretar el alcance exacto de cada servicio y los supuestos de ampliación de alcance.",
      "Definir la política de reembolsos y el tratamiento de los pagos fraccionados en caso de resolución anticipada.",
      "Incluir la información obligatoria sobre resolución alternativa de litigios en consumo.",
    ],
    sections: [
      {
        heading: "Objeto",
        body: [
          "Estas condiciones regulan la contratación de servicios de asesoramiento y gestión en materia de extranjería prestados por [[RAZÓN SOCIAL]].",
        ],
      },
      {
        heading: "Qué se contrata",
        body: [
          "El servicio contratado es una obligación de medios, no de resultado. Nos comprometemos a preparar, presentar y seguir tu expediente con la diligencia profesional exigible, pero la concesión de una autorización corresponde a la Administración y no puede garantizarse.",
        ],
      },
      {
        heading: "Precio y forma de pago",
        body: [
          "El presupuesto se emite por escrito antes de iniciar el trabajo. Los honorarios no incluyen tasas administrativas, traducciones juradas, apostillas ni ningún otro coste de terceros, que se detallan expresamente junto al precio.",
          "Se admite el pago fraccionado en dos plazos sin coste adicional. [[REVISAR: consecuencias del impago de un plazo.]]",
        ],
      },
      {
        heading: "Desistimiento",
        body: [
          "[[PENDIENTE: redactar conforme al texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios, incluyendo el formulario de desistimiento y el efecto de solicitar el inicio del servicio antes del vencimiento del plazo.]]",
        ],
      },
      {
        heading: "Resolución de conflictos",
        body: [
          "[[PENDIENTE: información sobre la plataforma de resolución de litigios en línea y sobre los sistemas de resolución alternativa a los que, en su caso, esté adherido el prestador.]]",
        ],
      },
    ],
  },
  {
    slug: "proteccion-datos",
    title: "Protección de datos y seguridad",
    description:
      "Cómo está construida la plataforma para proteger documentación migratoria, y cómo ejercer tus derechos.",
    reviewed: false,
    updatedAt: PENDING,
    reviewNotes: [
      "Documentar el registro de actividades de tratamiento (art. 30 RGPD).",
      "Valorar y, en su caso, realizar la evaluación de impacto (art. 35 RGPD).",
      "Formalizar los contratos de encargo con cada proveedor antes de su activación en producción.",
      "Definir y probar el procedimiento de notificación de brechas en 72 horas.",
    ],
    sections: [
      {
        heading: "Privacidad por diseño",
        body: [
          "La protección de datos no se añadió al final: condiciona la arquitectura. Estas son las decisiones concretas que la implementan.",
        ],
        list: [
          "No existe ningún contenedor de almacenamiento público en el proyecto, de modo que un documento no puede quedar expuesto por un error de configuración.",
          "Cada descarga se sirve mediante un enlace firmado con vigencia de sesenta segundos.",
          "La base de datos aplica seguridad a nivel de fila: un expediente es inaccesible desde cualquier otra cuenta, con independencia de lo que haga la aplicación.",
          "Los perfiles comerciales están excluidos por política de toda la documentación migratoria.",
          "Los objetos almacenados son inmutables: una versión nueva es un objeto nuevo, de modo que ningún documento puede sustituirse en silencio.",
          "El registro de consentimientos y el de auditoría no admiten modificación ni borrado.",
          "Ningún dato personal viaja en la URL.",
        ],
      },
      {
        heading: "Derechos ejercitables desde tu área privada",
        body: [
          "Acceso, rectificación, supresión, portabilidad, oposición y limitación. También puedes consultar el registro de quién ha accedido a tu expediente y cuándo.",
        ],
      },
      {
        heading: "Brechas de seguridad",
        body: [
          "[[PENDIENTE: describir el procedimiento interno de detección, evaluación y notificación de brechas a la autoridad de control en 72 horas y, cuando proceda, a las personas afectadas.]]",
        ],
      },
    ],
  },
];

export const LEGAL_MAP = Object.fromEntries(LEGAL_DOCUMENTS.map((d) => [d.slug, d]));
