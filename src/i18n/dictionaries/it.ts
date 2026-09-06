import type { Dictionary } from "./es";

/**
 * Italiano.
 *
 * Registro: «tu», come in spagnolo. In Italia il lei resta la norma negli studi
 * legali tradizionali, ed è esattamente il tono da cui questo prodotto prende
 * le distanze. Chiaro e diretto, mai confidenziale.
 */
export const it: Dictionary = {
  meta: {
    locale: "it",
    reviewNotice:
      "L'interfaccia è in italiano. Il contenuto giuridico dettagliato è in revisione e la versione di riferimento resta sempre quella spagnola.",
  },

  common: {
    back: "Indietro",
    continue: "Continua",
    cancel: "Annulla",
    save: "Salva",
    send: "Invia",
    close: "Chiudi",
    open: "Apri",
    loading: "Caricamento",
    seeAll: "Vedi tutto",
    seeMore: "Vedi altro",
    from: "da",
    free: "Gratis",
    optional: "facoltativo",
    required: "obbligatorio",
    yes: "Sì",
    no: "No",
    demo: "Demo",
    skipToContent: "Vai al contenuto principale",
    languageLabel: "Lingua",
    changeLanguage: "Cambia lingua",
    comingSoon: "Presto disponibile",
  },

  nav: {
    howItWorks: "Come funziona",
    tramites: "Pratiche",
    pricing: "Prezzi",
    reviews: "Recensioni",
    resources: "Risorse",
    signIn: "Accedi",
    cta: "Verifica la mia situazione",
    ctaShort: "Inizia",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    byCategory: "Per categoria",
    mostRequested: "Più richieste",
    dontKnow: "Non sai qual è la tua?",
    doTheCheck: "Fai la valutazione",
    home: "Home",
    allTramites: "Vedi tutte le pratiche",
  },

  hero: {
    eyebrow: "Immigrazione · 100% online",
    titleA: "La tua vita in Spagna.",
    titleB: "Alle pratiche pensiamo noi.",
    subtitle:
      "Scopri in meno di 3 minuti quale permesso ti serve, quali documenti devi presentare e come possiamo gestire tutto al posto tuo.",
    ctaPrimary: "Verifica la mia situazione",
    ctaSecondary: "So già di quale pratica ho bisogno",
    promises: [
      "Prima consulenza gratuita",
      "Gestione 100% online",
      "Monitoraggio in tempo reale",
    ],
    strip: "Gestiamo la pratica completa in",
  },

  intents: {
    eyebrow: "Punto di partenza",
    titleA: "Dicci cosa vuoi ottenere.",
    titleB: "La strada la troviamo noi.",
    lede: "Non serve conoscere il nome della pratica. Parti dal tuo obiettivo: alla traduzione pensiamo noi.",
    changeGoal: "Cambia obiettivo",
    mostCommon: "Più comune",
    alternative: "Alternativa",
    checkFit: "Verifica la mia idoneità in 3 minuti",
    seeCatalogue: "Vedi il catalogo completo",
    quoteAfter: "Preventivo dopo la valutazione",
    labels: {
      vivir: "Voglio vivere in Spagna",
      trabajar: "Voglio lavorare in Spagna",
      nomada: "Sono un nomade digitale",
      estudiar: "Voglio studiare",
      familia: "Voglio far venire la mia famiglia",
      regularizar: "Vivo già qui e voglio regolarizzarmi",
      renovar: "Voglio rinnovare il mio permesso",
      nacionalidad: "Voglio la cittadinanza spagnola",
      requerimiento: "Ho ricevuto una richiesta dall'amministrazione",
      no_se: "Non so di cosa ho bisogno",
    },
    notes: {
      vivir: "Le vie per stabilirti in modo stabile, con o senza attività lavorativa in Spagna.",
      trabajar: "Dipende da se ti trovi dentro o fuori dalla Spagna e da chi ti assume.",
      nomada: "Lavori da remoto per aziende o clienti con sede fuori dalla Spagna.",
      estudiar: "Soggiorno per studio e come passare poi a un permesso di lavoro.",
      familia: "Il regime applicabile cambia molto in base alla cittadinanza del tuo familiare.",
      regularizar: "Le vie di arraigo partono da quanto tempo sei in Spagna e dalla tua situazione.",
      renovar: "Il momento della presentazione è decisivo. Verificalo prima della scadenza.",
      nacionalidad: "Prima di tutto verifichiamo i tuoi anni di residenza legale e le tue assenze.",
      requerimiento: "I termini sono brevi. Se l'hai appena ricevuta, scrivici oggi stesso.",
      no_se: "È la risposta più comune e va benissimo. La valutazione serve esattamente a questo.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "Il cuore della piattaforma",
    /** Titular de la sección: la intención en palabras del usuario, no la marca. */
    headline: "Scopri in 3 minuti quale via di residenza fa al caso tuo.",
    lede: "Rispondi ad alcune domande e scopri quali opzioni possono adattarsi alla tua situazione. Otto domande condizionali: chiediamo solo ciò che il tuo caso richiede.",
    start: "Inizia la valutazione",
    howWeAnalyse: "Vedi come la analizziamo",
    preview: "Anteprima",
    questionOf: "Domanda {current} di {total}",
    exit: "Esci dalla valutazione",
    confidential: "Questa risposta è riservata e serve solo a orientarti",
    goBackAnytime: "Puoi tornare indietro in qualsiasi momento",
    features: [
      { title: "Le vie che possono fare al caso tuo", detail: "Ordinate per idoneità preliminare, con le alternative." },
      { title: "Quali documenti ti chiederanno", detail: "L'elenco reale, con chi ottiene ciascun documento." },
      { title: "Cosa andrebbe verificato nel tuo caso", detail: "Ciò che un professionista deve guardare per primo." },
    ],
    boundary:
      "La valutazione è un **orientamento preliminare** automatizzato. Non è consulenza legale e non conferma che tu soddisfi i requisiti: solo un professionista che esamina i tuoi documenti reali può farlo.",
    footerNote:
      "Il risultato è un **orientamento preliminare** generato automaticamente a partire dalle tue risposte. Non è consulenza legale e non conferma i requisiti di alcuna via. La **validazione professionale** richiede che uno specialista esamini i tuoi documenti reali.",
  },

  analysis: {
    title: "Stiamo analizzando la tua situazione",
    stages: [
      "Leggiamo le tue risposte",
      "Confrontiamo con le vie disponibili",
      "Verifichiamo cosa andrebbe controllato",
      "Prepariamo il tuo risultato",
    ],
    reveal: "Abbiamo una strada per te.",
    revealSub: "Ti mostriamo cosa si adatta e cosa resta da verificare.",
  },

  result: {
    eyebrow: "Risultato della tua valutazione",
    restart: "Ripeti la valutazione",
    talkToSpecialist: "Parla con uno specialista",
    mainPath: "Via principale",
    alternative: "Alternativa",
    alternatives: "Alternative",
    whyItFits: "Perché potrebbe fare al caso tuo",
    needToVerify: "Cosa dobbiamo verificare",
    documentation: "Documentazione",
    documents: "documenti",
    fees: "Onorari",
    custom: "Su misura",
    deadlines: "Tempistiche:",
    reviewWithSpecialist: "Far esaminare il mio caso da uno specialista",
    seeRequirements: "Vedi i requisiti",
    nextStepTitle: "Il passo successivo è che qualcuno lo guardi davvero.",
    nextStepBody:
      "45 minuti con uno specialista che esamina i tuoi documenti, conferma la strategia e ti consegna il piano documentale per iscritto. Se ci affidi la pratica, l'importo viene scalato.",
    saveResult: "Salva il mio risultato",
    whatYouGot: "Cosa hai appena ricevuto",
    whatYouGotBody:
      "Un **orientamento preliminare** generato dalle tue risposte. Ti dice dove guardare e cosa va verificato.",
    whatItIsNot: "Cosa non è ancora",
    whatItIsNotBody:
      "Una **validazione professionale**. Nessuno ha ancora visto i tuoi documenti reali, ed è lì che si decide una pratica.",
    disclaimer:
      "Questo risultato non costituisce consulenza legale, non crea un rapporto professionale e non garantisce la concessione di alcun permesso. Le condizioni esatte dipendono dalla normativa vigente al momento della domanda e dalla valutazione dell'ufficio competente. Le tue risposte sono state elaborate nel tuo browser e non sono state inviate ad alcun server.",
    downloadPdf: "Scarica in PDF",
    changeAnswers: "Modifica le mie risposte",
    seeAnswers: "Vedi le risposte con cui è stato calcolato questo risultato",
    urgentTitle: "Il tuo caso ha termini che corrono in questo momento",
    urgentBody:
      "Richieste di integrazione e dinieghi hanno termini brevi che decorrono dal giorno della notifica. Carica il documento il prima possibile e lo esaminiamo lo stesso giorno.",
    fit: {
      alto: "Idoneità preliminare alta",
      medio: "Idoneità preliminare media",
      explorar: "Vale la pena approfondire",
    },
    summaryOne: "Abbiamo trovato una via che può adattarsi alla tua situazione.",
    summaryMany: "Abbiamo trovato {count} possibili vie per te.",
    summaryNone:
      "Con quello che ci hai detto non possiamo ancora indicare una via chiara. Non significa che non esista: significa che il tuo caso va guardato più da vicino.",
    summaryUrgent:
      "Hai ricevuto una comunicazione dall'amministrazione. Questi casi hanno termini brevi, per questo li trattiamo con priorità.",
    fallback:
      "Ti proponiamo una consulenza con uno specialista per esaminare il tuo caso nel dettaglio. Se dopo l'esame non ci fosse una via percorribile, te lo diremo con chiarezza.",
  },

  app: {
    greeting: "Ciao, {name}",
    greetingSub: "Ecco a che punto è la tua pratica in questo momento.",
    nav: {
      home: "Home",
      case: "La mia pratica",
      caseShort: "Pratica",
      documents: "Documenti",
      messages: "Messaggi",
      appointments: "Appuntamenti",
      payments: "Pagamenti",
      notifications: "Notifiche",
      profile: "Profilo",
      signOut: "Esci",
    },
    caseRef: "Pratica",
    progress: "Avanzamento della pratica",
    completed: "completato",
    nextStepLabel: "Cosa ci serve da te adesso",
    uploadDocument: "Carica documento",
    yourSpecialist: "Il tuo specialista",
    sendMessage: "Invia un messaggio",
    recentActivity: "Attività recente",
    missingDocuments: "Documenti mancanti",
    manage: "Gestisci",
    caseData: "Dati della pratica",
    reference: "Riferimento",
    openedOn: "Aperta il",
    status: "Stato",
    docStates: {
      pendiente: "In attesa",
      subido: "Caricato",
      revision: "In revisione",
      correcto: "Validato",
      cambios: "Da correggere",
      caducado: "Scaduto",
    },
    docStateHelp: {
      pendiente: "Non l'hai ancora caricato.",
      subido: "L'abbiamo ricevuto correttamente.",
      revision: "Il tuo specialista lo sta esaminando.",
      correcto: "Validato da un professionista. Non c'è altro da fare.",
      cambios: "C'è qualcosa da correggere. Ti diciamo esattamente cosa.",
      caducado: "Non è più valido e va rinnovato.",
    },
    dropzone: {
      title: "Trascina qui i tuoi documenti",
      dropNow: "Rilascia qui il tuo documento",
      hint: "PDF, JPG o PNG · fino a 20 MB per file · puoi anche scattare una foto",
      selectFile: "Seleziona file",
      takePhoto: "Scatta una foto",
      privacy: "Archiviazione privata. Ogni file viene servito con un link firmato che scade.",
    },
    filters: { all: "Tutti", pending: "In attesa", inReview: "In revisione", validated: "Validati" },
    chatPlaceholder: "Scrivi il tuo messaggio…",
    assistantName: "Assistente di Extranjería Segura",
    demoBanner: {
      strong: "Modalità dimostrativa.",
      body: "I dati di questa pratica sono fittizi e non corrispondono ad alcuna persona reale. L'autenticazione con Supabase è implementata ma non attiva in questo ambiente.",
      cta: "Crea il mio account reale",
    },
  },

  footer: {
    ctaTitle: "Non sai di quale pratica hai bisogno?",
    ctaBody:
      "Rispondi ad alcune domande e ti diremo quali vie possono fare al caso tuo, quali documenti servono e cosa andrebbe verificato. Senza registrazione e senza costi.",
    ctaButton: "Fai la valutazione gratuita",
    tagline:
      "Gestiamo la tua pratica di immigrazione dall'inizio alla fine. Sai sempre a che punto è, cosa manca e chi ti sta aiutando.",
    trust: { encrypted: "Dati cifrati", gdpr: "GDPR", traceable: "Pratica tracciabile" },
    groups: {
      services: "Servizi",
      tramites: "Pratiche",
      resources: "Risorse",
      company: "Azienda",
      legal: "Note legali",
    },
    rights: "Tutti i diritti riservati.",
    disclaimer:
      "Le informazioni pubblicate su questo sito hanno carattere orientativo e non costituiscono consulenza legale. Ogni pratica richiede l'analisi di un professionista.",
    cookiePrefs: "Preferenze cookie",
  },

  auth: {
    signInTitle: "Accedi alla tua pratica",
    signInSub: "Entra per vedere a che punto è la tua pratica e cosa manca.",
    signUpTitle: "Crea il tuo account",
    signUpSub: "Apri la tua pratica e salva il risultato della tua valutazione.",
    name: "Nome",
    email: "Indirizzo e-mail",
    password: "Password",
    show: "Mostra",
    hide: "Nascondi",
    forgot: "Ho dimenticato la password",
    signInButton: "Accedi",
    signUpButton: "Crea il mio account",
    noAccount: "Non hai ancora un account?",
    createIt: "Crealo qui",
    haveAccount: "Hai già un account?",
    signInHere: "Accedi",
    securityNote:
      "Il tuo account dà accesso a documenti d'identità. Usa una password che non riutilizzi da nessun'altra parte e attiva la verifica in due passaggi appena entri.",
  },

  errors: {
    notFoundTitle: "Questa pagina non esiste.",
    notFoundBody:
      "Forse il link è sbagliato, o abbiamo spostato il contenuto. Tutto il resto è ancora qui: ecco da dove ripartire.",
    backHome: "Torna alla home",
    orStartCategory: "Oppure parti da una categoria",
  },
};
