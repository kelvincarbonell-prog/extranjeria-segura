/**
 * DICCIONARIO DE REFERENCIA (español).
 *
 * Este archivo es la fuente de verdad. El tipo `Dictionary` se deriva de él,
 * de modo que a cualquier otro idioma al que le falte una clave —o que se
 * invente una— le falla la comprobación de tipos. No existe el estado
 * «traducción a medias que nadie ha notado».
 *
 * Regla de redacción, igual que en el resto del producto: lenguaje humano y
 * directo. Nada de calcos administrativos. Si una frase suena a formulario,
 * está mal escrita.
 */

export const es = {
  meta: {
    /** Se usa en <html lang> y en Intl. */
    locale: "es",
    /** Aviso que ve quien lee un idioma cuyo contenido jurídico aún no está revisado. */
    reviewNotice:
      "La interfaz está en español. El contenido jurídico detallado está en revisión y la versión de referencia es siempre la española.",
  },

  common: {
    back: "Atrás",
    continue: "Continuar",
    cancel: "Cancelar",
    save: "Guardar",
    send: "Enviar",
    close: "Cerrar",
    open: "Abrir",
    loading: "Cargando",
    seeAll: "Ver todo",
    seeMore: "Ver más",
    from: "desde",
    free: "Gratis",
    optional: "opcional",
    required: "obligatorio",
    yes: "Sí",
    no: "No",
    demo: "Demo",
    skipToContent: "Saltar al contenido principal",
    languageLabel: "Idioma",
    changeLanguage: "Cambiar idioma",
    comingSoon: "Próximamente",
  },

  nav: {
    howItWorks: "Cómo funciona",
    tramites: "Trámites",
    pricing: "Precios",
    reviews: "Opiniones",
    resources: "Recursos",
    signIn: "Acceder",
    cta: "Comprobar mi situación",
    ctaShort: "Empezar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    byCategory: "Por categoría",
    mostRequested: "Más solicitados",
    dontKnow: "¿No sabes cuál es el tuyo?",
    doTheCheck: "Hacer el diagnóstico",
    home: "Inicio",
    allTramites: "Ver todos los trámites",
  },

  hero: {
    eyebrow: "Extranjería · 100% online",
    titleA: "Tu vida en España.",
    titleB: "Nosotros resolvemos los papeles.",
    subtitle:
      "Descubre en menos de 3 minutos qué permiso necesitas, qué documentación debes presentar y cómo podemos gestionarlo por ti de principio a fin.",
    ctaPrimary: "Comprobar mi situación",
    ctaSecondary: "Ya sé qué trámite necesito",
    promises: [
      "Primera orientación gratuita",
      "Gestión 100% online",
      "Seguimiento en tiempo real",
    ],
    strip: "Gestionamos el expediente completo en",
  },

  intents: {
    eyebrow: "Punto de partida",
    titleA: "Dinos qué quieres conseguir.",
    titleB: "Nosotros encontramos el camino.",
    lede: "No necesitas saber el nombre del trámite. Empieza por tu objetivo y nosotros traducimos.",
    changeGoal: "Cambiar objetivo",
    mostCommon: "Más habitual",
    alternative: "Alternativa",
    checkFit: "Comprobar mi encaje en 3 minutos",
    seeCatalogue: "Ver el catálogo completo",
    quoteAfter: "Presupuesto tras el diagnóstico",
    labels: {
      vivir: "Quiero vivir en España",
      trabajar: "Quiero trabajar en España",
      nomada: "Soy nómada digital",
      estudiar: "Quiero estudiar",
      familia: "Quiero traer a mi familia",
      regularizar: "Ya vivo aquí y quiero regularizarme",
      renovar: "Quiero renovar mi permiso",
      nacionalidad: "Quiero obtener la nacionalidad",
      requerimiento: "He recibido un requerimiento",
      no_se: "No sé qué necesito",
    },
    notes: {
      vivir: "Vías para establecerte de forma estable, con o sin actividad laboral en España.",
      trabajar: "Depende de si te encuentras dentro o fuera de España y de quién te contrata.",
      nomada: "Trabajas en remoto para empresas o clientes situados fuera de España.",
      estudiar: "Estancia por estudios y cómo pasar después a una autorización de trabajo.",
      familia: "El régimen que te aplica cambia mucho según la nacionalidad de tu familiar.",
      regularizar: "Las vías de arraigo parten del tiempo que llevas en España y de tu situación.",
      renovar: "El momento de presentación es determinante. Consúltalo antes de que caduque.",
      nacionalidad: "Antes de nada auditamos tus años de residencia legal y tus ausencias.",
      requerimiento: "Los plazos son cortos. Si acabas de recibirlo, escríbenos hoy mismo.",
      no_se: "Es la respuesta más común y no pasa nada. El diagnóstico está hecho para esto.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "La joya de la plataforma",
    lede: "Responde unas preguntas y descubre qué opciones pueden encajar con tu situación. Ocho preguntas condicionales: solo te preguntamos lo que hace falta para tu caso.",
    start: "Empezar el diagnóstico",
    howWeAnalyse: "Ver cómo lo analizamos",
    preview: "Vista previa",
    questionOf: "Pregunta {current} de {total}",
    exit: "Salir del diagnóstico",
    confidential: "Esta respuesta es confidencial y solo se usa para orientarte",
    goBackAnytime: "Puedes volver atrás en cualquier momento",
    features: [
      { title: "Vías que pueden encajar contigo", detail: "Ordenadas por encaje preliminar, con las alternativas." },
      { title: "Qué documentación te van a pedir", detail: "La lista real, con quién obtiene cada documento." },
      { title: "Qué habría que verificar en tu caso", detail: "Lo que un profesional tiene que mirar antes de nada." },
    ],
    boundary:
      "El diagnóstico es una **orientación preliminar** automatizada. No es asesoramiento jurídico ni confirma que cumplas los requisitos: eso solo puede hacerlo un profesional revisando tu documentación real.",
    footerNote:
      "El resultado es una **orientación preliminar** generada automáticamente a partir de tus respuestas. No es asesoramiento jurídico ni confirma que cumplas los requisitos de ninguna vía. La **validación profesional** requiere que un especialista revise tu documentación real.",
  },

  analysis: {
    title: "Analizando tu situación",
    stages: [
      "Leyendo tus respuestas",
      "Comparando con las vías disponibles",
      "Revisando qué habría que verificar",
      "Preparando tu resultado",
    ],
    reveal: "Tenemos un camino para ti.",
    revealSub: "Vamos a enseñártelo con lo que encaja y con lo que todavía habría que comprobar.",
  },

  result: {
    eyebrow: "Resultado de tu diagnóstico",
    restart: "Repetir diagnóstico",
    talkToSpecialist: "Hablar con un especialista",
    mainPath: "Vía principal",
    alternative: "Alternativa",
    alternatives: "Alternativas",
    whyItFits: "Por qué podría encajar contigo",
    needToVerify: "Necesitamos verificar",
    documentation: "Documentación",
    documents: "documentos",
    fees: "Honorarios",
    custom: "A medida",
    deadlines: "Plazos:",
    reviewWithSpecialist: "Revisar mi caso con un especialista",
    seeRequirements: "Ver requisitos",
    nextStepTitle: "El siguiente paso es que alguien lo mire de verdad.",
    nextStepBody:
      "45 minutos con un especialista que revisa tu documentación, confirma la estrategia y te entrega el plan documental por escrito. Si contratas la gestión, se te descuenta.",
    saveResult: "Guardar mi resultado",
    whatYouGot: "Lo que acabas de recibir",
    whatYouGotBody:
      "Una **orientación preliminar** generada a partir de tus respuestas. Te dice por dónde mirar y qué hace falta comprobar.",
    whatItIsNot: "Lo que todavía no es",
    whatItIsNotBody:
      "Una **validación profesional**. Nadie ha visto aún tus documentos reales, y ahí es donde se decide un expediente.",
    disclaimer:
      "Este resultado no constituye asesoramiento jurídico, no crea relación profesional y no garantiza la concesión de ninguna autorización. Las condiciones exactas dependen de la normativa vigente en el momento de la solicitud y del criterio de la oficina competente. Tus respuestas se han procesado en tu navegador y no se han enviado a ningún servidor.",
    downloadPdf: "Descargar en PDF",
    changeAnswers: "Cambiar mis respuestas",
    seeAnswers: "Ver las respuestas con las que se ha calculado este resultado",
    urgentTitle: "Tu caso tiene plazos que corren ahora mismo",
    urgentBody:
      "Los requerimientos y las denegaciones tienen plazos cortos que empiezan el día de la notificación. Sube el documento cuanto antes y lo miramos el mismo día.",
    fit: {
      alto: "Encaje preliminar alto",
      medio: "Encaje preliminar medio",
      explorar: "Merece explorarse",
    },
    summaryOne: "Hemos encontrado una vía que puede encajar con tu situación.",
    summaryMany: "Hemos encontrado {count} posibles vías para ti.",
    summaryNone:
      "Con lo que nos has contado no podemos señalar una vía clara todavía. No significa que no exista: significa que tu caso necesita mirarse con más detalle.",
    summaryUrgent:
      "Has recibido una comunicación de la Administración. Estos casos tienen plazos cortos, así que los tratamos con prioridad.",
    fallback:
      "Te proponemos una consulta con un especialista para revisar tu caso en detalle. Si tras revisarlo no hay una vía viable, te lo diremos con claridad.",
  },

  app: {
    greeting: "Hola, {name}",
    greetingSub: "Esto es lo que está pasando con tu expediente ahora mismo.",
    nav: {
      home: "Inicio",
      case: "Mi expediente",
      caseShort: "Expediente",
      documents: "Documentos",
      messages: "Mensajes",
      appointments: "Citas",
      payments: "Pagos",
      notifications: "Notificaciones",
      profile: "Perfil",
      signOut: "Salir",
    },
    caseRef: "Expediente",
    progress: "Progreso del expediente",
    completed: "completado",
    nextStepLabel: "Lo que necesitamos de ti ahora",
    uploadDocument: "Subir documento",
    yourSpecialist: "Tu especialista",
    sendMessage: "Enviar un mensaje",
    recentActivity: "Actividad reciente",
    missingDocuments: "Documentos que faltan",
    manage: "Gestionar",
    caseData: "Datos del expediente",
    reference: "Referencia",
    openedOn: "Abierto el",
    status: "Estado",
    docStates: {
      pendiente: "Pendiente",
      subido: "Subido",
      revision: "En revisión",
      correcto: "Validado",
      cambios: "Requiere cambios",
      caducado: "Caducado",
    },
    docStateHelp: {
      pendiente: "Todavía no lo has subido.",
      subido: "Lo hemos recibido correctamente.",
      revision: "Tu especialista lo está revisando.",
      correcto: "Validado por un profesional. No hay que tocarlo.",
      cambios: "Hay algo que corregir. Te decimos exactamente qué.",
      caducado: "Ha perdido vigencia y hay que renovarlo.",
    },
    dropzone: {
      title: "Arrastra tus documentos aquí",
      dropNow: "Suelta aquí tu documento",
      hint: "PDF, JPG o PNG · hasta 20 MB por archivo · también puedes hacer una foto",
      selectFile: "Seleccionar archivo",
      takePhoto: "Hacer una foto",
      privacy: "Almacenamiento privado. Cada archivo se sirve con un enlace firmado que caduca.",
    },
    filters: { all: "Todos", pending: "Pendientes", inReview: "En revisión", validated: "Validados" },
    chatPlaceholder: "Escribe tu mensaje…",
    assistantName: "Asistente de Extranjería Segura",
    demoBanner: {
      strong: "Modo demostración.",
      body: "Los datos de este expediente son ficticios y no corresponden a ninguna persona real. La autenticación con Supabase está implementada pero no activada en este entorno.",
      cta: "Crear mi cuenta real",
    },
  },

  footer: {
    ctaTitle: "¿No sabes qué trámite necesitas?",
    ctaBody:
      "Responde unas preguntas y te diremos qué vías pueden encajar contigo, qué documentación hace falta y qué habría que verificar. Sin registro y sin coste.",
    ctaButton: "Haz el diagnóstico gratuito",
    tagline:
      "Gestionamos tu extranjería de principio a fin. Tú sabes en todo momento dónde está tu expediente, qué falta y quién te está ayudando.",
    trust: { encrypted: "Datos cifrados", gdpr: "RGPD", traceable: "Expediente trazable" },
    groups: {
      services: "Servicios",
      tramites: "Trámites",
      resources: "Recursos",
      company: "Empresa",
      legal: "Legal",
    },
    rights: "Todos los derechos reservados.",
    disclaimer:
      "La información publicada en este sitio tiene carácter orientativo y no constituye asesoramiento jurídico. Cada expediente requiere el análisis de un profesional.",
    cookiePrefs: "Preferencias de cookies",
  },

  auth: {
    signInTitle: "Accede a tu expediente",
    signInSub: "Entra para ver en qué punto está tu expediente y qué falta.",
    signUpTitle: "Crea tu cuenta",
    signUpSub: "Abre tu expediente y guarda el resultado de tu diagnóstico.",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    show: "Mostrar",
    hide: "Ocultar",
    forgot: "He olvidado mi contraseña",
    signInButton: "Entrar",
    signUpButton: "Crear mi cuenta",
    noAccount: "¿Aún no tienes cuenta?",
    createIt: "Créala aquí",
    haveAccount: "¿Ya tienes cuenta?",
    signInHere: "Accede",
    securityNote:
      "Tu cuenta da acceso a documentación de identidad. Usa una contraseña que no reutilices en ningún otro sitio y activa la verificación en dos pasos en cuanto entres.",
  },

  errors: {
    notFoundTitle: "Esta página no existe.",
    notFoundBody:
      "Puede que el enlace esté mal, o que hayamos movido el contenido. Lo que sí existe es todo lo demás: te dejamos por dónde seguir.",
    backHome: "Volver al inicio",
    orStartCategory: "O empieza por una categoría",
  },
};

/** El tipo se deriva del español: cualquier otro idioma debe encajar en él. */
export type Dictionary = typeof es;
