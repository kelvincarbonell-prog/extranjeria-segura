import type { Dictionary } from "./es";

/**
 * Français.
 *
 * Le vouvoiement est la norme dans un contexte juridique en français, même
 * quand l'espagnol tutoie. On garde le ton direct sans la familiarité : « vous »
 * n'empêche pas d'écrire clairement.
 */
export const fr: Dictionary = {
  meta: {
    locale: "fr",
    reviewNotice:
      "L'interface est en français. Le contenu juridique détaillé est en cours de révision et la version de référence reste toujours l'espagnole.",
  },

  common: {
    back: "Retour",
    continue: "Continuer",
    cancel: "Annuler",
    save: "Enregistrer",
    send: "Envoyer",
    close: "Fermer",
    open: "Ouvrir",
    loading: "Chargement",
    seeAll: "Tout voir",
    seeMore: "Voir plus",
    from: "à partir de",
    free: "Gratuit",
    optional: "facultatif",
    required: "obligatoire",
    yes: "Oui",
    no: "Non",
    demo: "Démo",
    skipToContent: "Aller au contenu principal",
    languageLabel: "Langue",
    changeLanguage: "Changer de langue",
    comingSoon: "Bientôt disponible",
  },

  nav: {
    howItWorks: "Comment ça marche",
    tramites: "Démarches",
    pricing: "Tarifs",
    reviews: "Avis",
    resources: "Ressources",
    signIn: "Se connecter",
    cta: "Vérifier ma situation",
    ctaShort: "Commencer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    byCategory: "Par catégorie",
    mostRequested: "Les plus demandées",
    dontKnow: "Vous ne savez pas laquelle vous concerne ?",
    doTheCheck: "Faire le diagnostic",
    home: "Accueil",
    allTramites: "Voir toutes les démarches",
  },

  hero: {
    eyebrow: "Immigration · 100 % en ligne",
    titleA: "Votre vie en Espagne.",
    titleB: "Les papiers, c'est notre affaire.",
    subtitle:
      "Découvrez en moins de 3 minutes quel titre de séjour vous correspond, quels documents fournir et comment nous pouvons gérer l'ensemble à votre place.",
    ctaPrimary: "Vérifier ma situation",
    ctaSecondary: "Je sais déjà quelle démarche il me faut",
    promises: [
      "Première orientation gratuite",
      "Gestion 100 % en ligne",
      "Suivi en temps réel",
    ],
    strip: "Nous gérons le dossier complet en",
  },

  intents: {
    eyebrow: "Point de départ",
    titleA: "Dites-nous ce que vous voulez obtenir.",
    titleB: "Nous trouvons le chemin.",
    lede: "Vous n'avez pas besoin de connaître le nom de la démarche. Partez de votre objectif, nous traduisons.",
    changeGoal: "Changer d'objectif",
    mostCommon: "Le plus fréquent",
    alternative: "Alternative",
    checkFit: "Vérifier mon éligibilité en 3 minutes",
    seeCatalogue: "Voir le catalogue complet",
    quoteAfter: "Devis après le diagnostic",
    labels: {
      vivir: "Je veux vivre en Espagne",
      trabajar: "Je veux travailler en Espagne",
      nomada: "Je suis nomade numérique",
      estudiar: "Je veux étudier",
      familia: "Je veux faire venir ma famille",
      regularizar: "Je vis déjà ici et je veux régulariser ma situation",
      renovar: "Je veux renouveler mon titre",
      nacionalidad: "Je veux obtenir la nationalité espagnole",
      requerimiento: "J'ai reçu une demande de l'administration",
      no_se: "Je ne sais pas ce qu'il me faut",
    },
    notes: {
      vivir: "Les voies pour vous installer durablement, avec ou sans activité professionnelle en Espagne.",
      trabajar: "Cela dépend de si vous êtes en Espagne ou à l'étranger, et de qui vous recrute.",
      nomada: "Vous travaillez à distance pour des entreprises ou des clients situés hors d'Espagne.",
      estudiar: "Séjour pour études, puis passage vers une autorisation de travail.",
      familia: "Le régime applicable change beaucoup selon la nationalité de votre proche.",
      regularizar: "Les voies d'arraigo partent de votre ancienneté en Espagne et de votre situation.",
      renovar: "Le moment du dépôt est déterminant. Vérifiez-le avant l'expiration de votre carte.",
      nacionalidad: "Nous auditons d'abord vos années de résidence légale et vos absences.",
      requerimiento: "Les délais sont courts. Si vous venez de la recevoir, écrivez-nous aujourd'hui.",
      no_se: "C'est la réponse la plus fréquente, et ce n'est pas un problème. Le diagnostic est fait pour ça.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "Le cœur de la plateforme",
    lede: "Répondez à quelques questions et découvrez les options qui peuvent correspondre à votre situation. Huit questions conditionnelles : nous ne demandons que ce que votre cas exige.",
    start: "Commencer le diagnostic",
    howWeAnalyse: "Voir comment nous l'analysons",
    preview: "Aperçu",
    questionOf: "Question {current} sur {total}",
    exit: "Quitter le diagnostic",
    confidential: "Cette réponse est confidentielle et sert uniquement à vous orienter",
    goBackAnytime: "Vous pouvez revenir en arrière à tout moment",
    features: [
      { title: "Les voies qui peuvent vous correspondre", detail: "Classées par adéquation préliminaire, avec les alternatives." },
      { title: "Les documents qu'on va vous demander", detail: "La liste réelle, en indiquant qui obtient chaque pièce." },
      { title: "Ce qu'il faudrait vérifier dans votre cas", detail: "Ce qu'un professionnel doit examiner en priorité." },
    ],
    boundary:
      "Le diagnostic est une **orientation préliminaire** automatisée. Ce n'est pas un conseil juridique et cela ne confirme pas que vous remplissez les conditions : seul un professionnel examinant vos documents réels peut le faire.",
    footerNote:
      "Le résultat est une **orientation préliminaire** générée automatiquement à partir de vos réponses. Ce n'est pas un conseil juridique et cela ne confirme aucune condition. La **validation professionnelle** exige qu'un spécialiste examine vos documents réels.",
  },

  analysis: {
    title: "Analyse de votre situation",
    stages: [
      "Lecture de vos réponses",
      "Comparaison avec les voies disponibles",
      "Examen de ce qu'il faudrait vérifier",
      "Préparation de votre résultat",
    ],
    reveal: "Nous avons un chemin pour vous.",
    revealSub: "Nous allons vous montrer ce qui correspond et ce qu'il reste à vérifier.",
  },

  result: {
    eyebrow: "Résultat de votre diagnostic",
    restart: "Refaire le diagnostic",
    talkToSpecialist: "Parler à un spécialiste",
    mainPath: "Voie principale",
    alternative: "Alternative",
    alternatives: "Alternatives",
    whyItFits: "Pourquoi cela peut vous correspondre",
    needToVerify: "Ce que nous devons vérifier",
    documentation: "Documents",
    documents: "documents",
    fees: "Honoraires",
    custom: "Sur mesure",
    deadlines: "Délais :",
    reviewWithSpecialist: "Faire examiner mon dossier par un spécialiste",
    seeRequirements: "Voir les conditions",
    nextStepTitle: "L'étape suivante, c'est que quelqu'un l'examine vraiment.",
    nextStepBody:
      "45 minutes avec un spécialiste qui examine vos documents, confirme la stratégie et vous remet le plan documentaire par écrit. Le montant est déduit si vous nous confiez le dossier.",
    saveResult: "Enregistrer mon résultat",
    whatYouGot: "Ce que vous venez de recevoir",
    whatYouGotBody:
      "Une **orientation préliminaire** générée à partir de vos réponses. Elle indique où regarder et ce qu'il faut vérifier.",
    whatItIsNot: "Ce que ce n'est pas encore",
    whatItIsNotBody:
      "Une **validation professionnelle**. Personne n'a encore vu vos documents réels, et c'est là que se joue un dossier.",
    disclaimer:
      "Ce résultat ne constitue pas un conseil juridique, ne crée aucune relation professionnelle et ne garantit l'octroi d'aucune autorisation. Les conditions exactes dépendent de la réglementation en vigueur au moment de la demande et de l'appréciation du service compétent. Vos réponses ont été traitées dans votre navigateur et n'ont été envoyées à aucun serveur.",
    downloadPdf: "Télécharger en PDF",
    changeAnswers: "Modifier mes réponses",
    seeAnswers: "Voir les réponses ayant servi à calculer ce résultat",
    urgentTitle: "Votre dossier a des délais qui courent en ce moment",
    urgentBody:
      "Les demandes de l'administration et les refus ont des délais courts qui commencent le jour de la notification. Envoyez le document au plus vite et nous l'examinons le jour même.",
    fit: {
      alto: "Adéquation préliminaire élevée",
      medio: "Adéquation préliminaire moyenne",
      explorar: "Mérite d'être exploré",
    },
    summaryOne: "Nous avons trouvé une voie qui peut correspondre à votre situation.",
    summaryMany: "Nous avons trouvé {count} voies possibles pour vous.",
    summaryNone:
      "Avec ce que vous nous avez indiqué, nous ne pouvons pas encore désigner une voie claire. Cela ne veut pas dire qu'il n'y en a pas : cela veut dire que votre cas mérite un examen plus approfondi.",
    summaryUrgent:
      "Vous avez reçu une communication de l'administration. Ces dossiers ont des délais courts, nous les traitons donc en priorité.",
    fallback:
      "Nous vous proposons une consultation avec un spécialiste pour examiner votre dossier en détail. Si après examen aucune voie n'est viable, nous vous le dirons clairement.",
  },

  app: {
    greeting: "Bonjour, {name}",
    greetingSub: "Voici où en est votre dossier en ce moment.",
    nav: {
      home: "Accueil",
      case: "Mon dossier",
      caseShort: "Dossier",
      documents: "Documents",
      messages: "Messages",
      appointments: "Rendez-vous",
      payments: "Paiements",
      notifications: "Notifications",
      profile: "Profil",
      signOut: "Se déconnecter",
    },
    caseRef: "Dossier",
    progress: "Avancement du dossier",
    completed: "terminé",
    nextStepLabel: "Ce dont nous avons besoin maintenant",
    uploadDocument: "Téléverser un document",
    yourSpecialist: "Votre spécialiste",
    sendMessage: "Envoyer un message",
    recentActivity: "Activité récente",
    missingDocuments: "Documents manquants",
    manage: "Gérer",
    caseData: "Données du dossier",
    reference: "Référence",
    openedOn: "Ouvert le",
    status: "Statut",
    docStates: {
      pendiente: "En attente",
      subido: "Déposé",
      revision: "En cours d'examen",
      correcto: "Validé",
      cambios: "À corriger",
      caducado: "Périmé",
    },
    docStateHelp: {
      pendiente: "Vous ne l'avez pas encore déposé.",
      subido: "Nous l'avons bien reçu.",
      revision: "Votre spécialiste est en train de l'examiner.",
      correcto: "Validé par un professionnel. Rien à faire de plus.",
      cambios: "Il y a quelque chose à corriger. Nous vous disons exactement quoi.",
      caducado: "Il n'est plus valable et doit être renouvelé.",
    },
    dropzone: {
      title: "Glissez vos documents ici",
      dropNow: "Déposez votre document ici",
      hint: "PDF, JPG ou PNG · jusqu'à 20 Mo par fichier · vous pouvez aussi prendre une photo",
      selectFile: "Choisir un fichier",
      takePhoto: "Prendre une photo",
      privacy: "Stockage privé. Chaque fichier est servi par un lien signé qui expire.",
    },
    filters: { all: "Tous", pending: "En attente", inReview: "En cours d'examen", validated: "Validés" },
    chatPlaceholder: "Écrivez votre message…",
    assistantName: "Assistant Extranjería Segura",
    demoBanner: {
      strong: "Mode démonstration.",
      body: "Les données de ce dossier sont fictives et ne correspondent à aucune personne réelle. L'authentification Supabase est implémentée mais n'est pas activée dans cet environnement.",
      cta: "Créer mon vrai compte",
    },
  },

  footer: {
    ctaTitle: "Vous ne savez pas quelle démarche il vous faut ?",
    ctaBody:
      "Répondez à quelques questions et nous vous dirons quelles voies peuvent vous correspondre, quels documents sont nécessaires et ce qu'il faudrait vérifier. Sans inscription et sans frais.",
    ctaButton: "Faire le diagnostic gratuit",
    tagline:
      "Nous gérons votre dossier d'immigration du début à la fin. Vous savez à tout moment où il en est, ce qui manque et qui s'en occupe.",
    trust: { encrypted: "Données chiffrées", gdpr: "RGPD", traceable: "Dossier traçable" },
    groups: {
      services: "Services",
      tramites: "Démarches",
      resources: "Ressources",
      company: "Entreprise",
      legal: "Mentions légales",
    },
    rights: "Tous droits réservés.",
    disclaimer:
      "Les informations publiées sur ce site sont fournies à titre indicatif et ne constituent pas un conseil juridique. Chaque dossier requiert l'analyse d'un professionnel.",
    cookiePrefs: "Préférences de cookies",
  },

  auth: {
    signInTitle: "Accédez à votre dossier",
    signInSub: "Connectez-vous pour voir où en est votre dossier et ce qui manque.",
    signUpTitle: "Créez votre compte",
    signUpSub: "Ouvrez votre dossier et enregistrez le résultat de votre diagnostic.",
    name: "Nom",
    email: "Adresse e-mail",
    password: "Mot de passe",
    show: "Afficher",
    hide: "Masquer",
    forgot: "J'ai oublié mon mot de passe",
    signInButton: "Se connecter",
    signUpButton: "Créer mon compte",
    noAccount: "Pas encore de compte ?",
    createIt: "Créez-le ici",
    haveAccount: "Vous avez déjà un compte ?",
    signInHere: "Connectez-vous",
    securityNote:
      "Votre compte donne accès à des documents d'identité. Utilisez un mot de passe que vous ne réutilisez nulle part ailleurs et activez la double authentification dès votre connexion.",
  },

  errors: {
    notFoundTitle: "Cette page n'existe pas.",
    notFoundBody:
      "Le lien est peut-être erroné, ou nous avons déplacé le contenu. Tout le reste est toujours là : voici par où continuer.",
    backHome: "Retour à l'accueil",
    orStartCategory: "Ou commencez par une catégorie",
  },
};
