import type { Dictionary } from "./es";

/**
 * English.
 *
 * Translated, not transliterated. Spanish immigration terms that have no
 * English equivalent keep the Spanish word with a short gloss the first time
 * — "arraigo" is a legal category, not a word to invent an English name for.
 */
export const en: Dictionary = {
  meta: {
    locale: "en",
    reviewNotice:
      "The interface is in English. The detailed legal content is under review, and the Spanish version is always the authoritative one.",
  },

  common: {
    back: "Back",
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    send: "Send",
    close: "Close",
    open: "Open",
    loading: "Loading",
    seeAll: "See all",
    seeMore: "See more",
    from: "from",
    free: "Free",
    optional: "optional",
    required: "required",
    yes: "Yes",
    no: "No",
    demo: "Demo",
    skipToContent: "Skip to main content",
    languageLabel: "Language",
    changeLanguage: "Change language",
    comingSoon: "Coming soon",
  },

  nav: {
    howItWorks: "How it works",
    tramites: "Procedures",
    pricing: "Pricing",
    reviews: "Reviews",
    resources: "Resources",
    signIn: "Sign in",
    cta: "Check my situation",
    ctaShort: "Start",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    byCategory: "By category",
    mostRequested: "Most requested",
    dontKnow: "Not sure which one is yours?",
    doTheCheck: "Take the assessment",
    home: "Home",
    allTramites: "See all procedures",
  },

  hero: {
    eyebrow: "Immigration · 100% online",
    titleA: "Your life in Spain.",
    titleB: "We handle the paperwork.",
    subtitle:
      "Find out in under 3 minutes which permit you need, what documents you have to provide, and how we can handle the whole thing for you.",
    ctaPrimary: "Check my situation",
    ctaSecondary: "I already know which procedure I need",
    promises: ["First assessment free", "100% online", "Track it in real time"],
    strip: "We handle the full case for",
  },

  intents: {
    eyebrow: "Where to start",
    titleA: "Tell us what you want to achieve.",
    titleB: "We'll find the way there.",
    lede: "You don't need to know what the procedure is called. Start from your goal and we'll translate it.",
    changeGoal: "Change goal",
    mostCommon: "Most common",
    alternative: "Alternative",
    checkFit: "Check my fit in 3 minutes",
    seeCatalogue: "See the full catalogue",
    quoteAfter: "Quoted after the assessment",
    labels: {
      vivir: "I want to live in Spain",
      trabajar: "I want to work in Spain",
      nomada: "I'm a digital nomad",
      estudiar: "I want to study",
      familia: "I want to bring my family",
      regularizar: "I already live here and want to regularise my status",
      renovar: "I want to renew my permit",
      nacionalidad: "I want Spanish citizenship",
      requerimiento: "I've received a request from the authorities",
      no_se: "I don't know what I need",
    },
    notes: {
      vivir: "Routes to settle here for good, with or without working in Spain.",
      trabajar: "It depends on whether you're inside or outside Spain, and who is hiring you.",
      nomada: "You work remotely for companies or clients based outside Spain.",
      estudiar: "Student stay, and how to move to a work permit afterwards.",
      familia: "The rules change a great deal depending on your relative's nationality.",
      regularizar: "The arraigo routes start from how long you've been in Spain and your current status.",
      renovar: "Timing is everything here. Check it before your card expires.",
      nacionalidad: "First of all we audit your years of legal residence and your absences.",
      requerimiento: "Deadlines are short. If you've just received it, write to us today.",
      no_se: "That's the most common answer, and it's fine. The assessment exists for exactly this.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "The heart of the platform",
    lede: "Answer a few questions and find out which options may fit your situation. Eight conditional questions: we only ask what your case actually requires.",
    start: "Start the assessment",
    howWeAnalyse: "See how we analyse it",
    preview: "Preview",
    questionOf: "Question {current} of {total}",
    exit: "Exit the assessment",
    confidential: "This answer is confidential and is used only to guide you",
    goBackAnytime: "You can go back at any point",
    features: [
      { title: "Routes that may fit you", detail: "Ranked by preliminary fit, with the alternatives." },
      { title: "What documents you'll be asked for", detail: "The real list, showing who obtains each one." },
      { title: "What needs verifying in your case", detail: "What a professional has to look at before anything else." },
    ],
    boundary:
      "The assessment is automated **preliminary guidance**. It is not legal advice and it does not confirm that you meet the requirements: only a professional reviewing your actual documents can do that.",
    footerNote:
      "The result is automated **preliminary guidance** based on your answers. It is not legal advice and it does not confirm that you meet the requirements of any route. **Professional validation** requires a specialist to review your actual documents.",
  },

  analysis: {
    title: "Analysing your situation",
    stages: [
      "Reading your answers",
      "Comparing against the available routes",
      "Reviewing what would need verifying",
      "Preparing your result",
    ],
    reveal: "We have a route for you.",
    revealSub: "We'll show you what fits and what would still need checking.",
  },

  result: {
    eyebrow: "Your assessment result",
    restart: "Retake the assessment",
    talkToSpecialist: "Talk to a specialist",
    mainPath: "Main route",
    alternative: "Alternative",
    alternatives: "Alternatives",
    whyItFits: "Why it may fit you",
    needToVerify: "What we need to verify",
    documentation: "Documents",
    documents: "documents",
    fees: "Fees",
    custom: "Quoted individually",
    deadlines: "Timelines:",
    reviewWithSpecialist: "Review my case with a specialist",
    seeRequirements: "See requirements",
    nextStepTitle: "The next step is having someone actually look at it.",
    nextStepBody:
      "45 minutes with a specialist who reviews your documents, confirms the strategy and gives you the document plan in writing. It's deducted if you hire us for the case.",
    saveResult: "Save my result",
    whatYouGot: "What you've just received",
    whatYouGotBody:
      "**Preliminary guidance** generated from your answers. It tells you where to look and what needs checking.",
    whatItIsNot: "What it is not yet",
    whatItIsNotBody:
      "**Professional validation**. Nobody has seen your actual documents yet, and that is where a case is decided.",
    disclaimer:
      "This result is not legal advice, creates no professional relationship and guarantees no permit. The exact conditions depend on the rules in force when you apply and on the assessment of the competent office. Your answers were processed in your browser and sent to no server.",
    downloadPdf: "Download as PDF",
    changeAnswers: "Change my answers",
    seeAnswers: "See the answers this result was calculated from",
    urgentTitle: "Your case has deadlines running right now",
    urgentBody:
      "Requests and refusals carry short deadlines that start the day you're notified. Upload the document as soon as you can and we'll look at it the same day.",
    fit: {
      alto: "Strong preliminary fit",
      medio: "Moderate preliminary fit",
      explorar: "Worth exploring",
    },
    summaryOne: "We've found one route that may fit your situation.",
    summaryMany: "We've found {count} possible routes for you.",
    summaryNone:
      "From what you've told us we can't point to a clear route yet. That doesn't mean there isn't one: it means your case needs a closer look.",
    summaryUrgent:
      "You've received a communication from the authorities. These cases have short deadlines, so we treat them as a priority.",
    fallback:
      "We suggest a consultation with a specialist to review your case in detail. If there turns out to be no viable route, we'll tell you plainly.",
  },

  app: {
    greeting: "Hello, {name}",
    greetingSub: "Here's what's happening with your case right now.",
    nav: {
      home: "Home",
      case: "My case",
      caseShort: "Case",
      documents: "Documents",
      messages: "Messages",
      appointments: "Appointments",
      payments: "Payments",
      notifications: "Notifications",
      profile: "Profile",
      signOut: "Sign out",
    },
    caseRef: "Case",
    progress: "Case progress",
    completed: "complete",
    nextStepLabel: "What we need from you now",
    uploadDocument: "Upload document",
    yourSpecialist: "Your specialist",
    sendMessage: "Send a message",
    recentActivity: "Recent activity",
    missingDocuments: "Documents still missing",
    manage: "Manage",
    caseData: "Case details",
    reference: "Reference",
    openedOn: "Opened on",
    status: "Status",
    docStates: {
      pendiente: "Pending",
      subido: "Uploaded",
      revision: "Under review",
      correcto: "Validated",
      cambios: "Needs changes",
      caducado: "Expired",
    },
    docStateHelp: {
      pendiente: "You haven't uploaded it yet.",
      subido: "We've received it correctly.",
      revision: "Your specialist is reviewing it.",
      correcto: "Validated by a professional. Nothing more to do.",
      cambios: "Something needs correcting. We tell you exactly what.",
      caducado: "It's no longer valid and needs renewing.",
    },
    dropzone: {
      title: "Drag your documents here",
      dropNow: "Drop your document here",
      hint: "PDF, JPG or PNG · up to 20 MB per file · you can also take a photo",
      selectFile: "Select file",
      takePhoto: "Take a photo",
      privacy: "Private storage. Every file is served through a signed link that expires.",
    },
    filters: { all: "All", pending: "Pending", inReview: "Under review", validated: "Validated" },
    chatPlaceholder: "Write your message…",
    assistantName: "Extranjería Segura assistant",
    demoBanner: {
      strong: "Demo mode.",
      body: "The data in this case is fictional and belongs to no real person. Supabase authentication is implemented but not enabled in this environment.",
      cta: "Create my real account",
    },
  },

  footer: {
    ctaTitle: "Not sure which procedure you need?",
    ctaBody:
      "Answer a few questions and we'll tell you which routes may fit you, what documents are needed and what would have to be verified. No sign-up, no cost.",
    ctaButton: "Take the free assessment",
    tagline:
      "We handle your immigration case from start to finish. You always know where your case stands, what's missing and who is helping you.",
    trust: { encrypted: "Encrypted data", gdpr: "GDPR", traceable: "Traceable case file" },
    groups: {
      services: "Services",
      tramites: "Procedures",
      resources: "Resources",
      company: "Company",
      legal: "Legal",
    },
    rights: "All rights reserved.",
    disclaimer:
      "The information published on this site is for guidance only and does not constitute legal advice. Every case requires analysis by a professional.",
    cookiePrefs: "Cookie preferences",
  },

  auth: {
    signInTitle: "Access your case",
    signInSub: "Sign in to see where your case stands and what's missing.",
    signUpTitle: "Create your account",
    signUpSub: "Open your case file and save your assessment result.",
    name: "Name",
    email: "Email address",
    password: "Password",
    show: "Show",
    hide: "Hide",
    forgot: "I've forgotten my password",
    signInButton: "Sign in",
    signUpButton: "Create my account",
    noAccount: "Don't have an account yet?",
    createIt: "Create one here",
    haveAccount: "Already have an account?",
    signInHere: "Sign in",
    securityNote:
      "Your account gives access to identity documents. Use a password you don't reuse anywhere else, and turn on two-factor authentication as soon as you're in.",
  },

  errors: {
    notFoundTitle: "This page doesn't exist.",
    notFoundBody:
      "The link may be wrong, or we may have moved the content. Everything else is still here — pick up from one of these.",
    backHome: "Back to home",
    orStartCategory: "Or start from a category",
  },
};
