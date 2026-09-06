import type { Dictionary } from "./es";

/**
 * العربية — árabe estándar moderno.
 *
 * Se escribe de derecha a izquierda: `dir="rtl"` lo aplica el layout, pero el
 * texto debe redactarse ya pensando en esa dirección. Los números se escriben
 * en cifras occidentales (٠١٢ frente a 012) porque toda la documentación
 * administrativa española que el usuario va a manejar las usa así, y hacerle
 * traducir mentalmente un plazo es exactamente el tipo de fricción que este
 * producto existe para eliminar.
 *
 * Los términos jurídicos españoles sin equivalente —«arraigo», «TIE»— se
 * mantienen en alfabeto latino entre paréntesis: es lo que el usuario verá
 * literalmente en su notificación.
 */
export const ar: Dictionary = {
  meta: {
    locale: "ar",
    reviewNotice:
      "الواجهة متاحة بالعربية. المحتوى القانوني التفصيلي قيد المراجعة، والنسخة الإسبانية هي المرجع دائمًا.",
  },

  common: {
    back: "رجوع",
    continue: "متابعة",
    cancel: "إلغاء",
    save: "حفظ",
    send: "إرسال",
    close: "إغلاق",
    open: "فتح",
    loading: "جارٍ التحميل",
    seeAll: "عرض الكل",
    seeMore: "عرض المزيد",
    from: "ابتداءً من",
    free: "مجانًا",
    optional: "اختياري",
    required: "إلزامي",
    yes: "نعم",
    no: "لا",
    demo: "تجريبي",
    skipToContent: "الانتقال إلى المحتوى الرئيسي",
    languageLabel: "اللغة",
    changeLanguage: "تغيير اللغة",
    comingSoon: "قريبًا",
  },

  nav: {
    howItWorks: "كيف تعمل الخدمة",
    tramites: "المعاملات",
    pricing: "الأسعار",
    reviews: "التقييمات",
    resources: "الموارد",
    signIn: "تسجيل الدخول",
    cta: "تحقّق من وضعي",
    ctaShort: "ابدأ",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    byCategory: "حسب الفئة",
    mostRequested: "الأكثر طلبًا",
    dontKnow: "لا تعرف أي معاملة تخصّك؟",
    doTheCheck: "ابدأ التقييم",
    home: "الرئيسية",
    allTramites: "عرض جميع المعاملات",
  },

  hero: {
    eyebrow: "شؤون الأجانب · 100٪ عبر الإنترنت",
    titleA: "حياتك في إسبانيا.",
    titleB: "ونحن نتولّى الأوراق.",
    subtitle:
      "اكتشف في أقل من 3 دقائق أي تصريح تحتاج، وما المستندات المطلوبة منك، وكيف يمكننا إدارة ملفك من البداية إلى النهاية.",
    ctaPrimary: "تحقّق من وضعي",
    ctaSecondary: "أعرف المعاملة التي أحتاجها",
    promises: [
      "استشارة أولى مجانية",
      "إدارة 100٪ عبر الإنترنت",
      "متابعة فورية لملفك",
    ],
    strip: "ندير الملف كاملًا في",
  },

  intents: {
    eyebrow: "من أين تبدأ",
    titleA: "قل لنا ما تريد الوصول إليه.",
    titleB: "ونحن نجد لك الطريق.",
    lede: "لا تحتاج إلى معرفة اسم المعاملة. ابدأ من هدفك ونحن نترجمه.",
    changeGoal: "تغيير الهدف",
    mostCommon: "الأكثر شيوعًا",
    alternative: "بديل",
    checkFit: "تحقّق من مدى ملاءمتك في 3 دقائق",
    seeCatalogue: "عرض الدليل الكامل",
    quoteAfter: "عرض السعر بعد التقييم",
    labels: {
      vivir: "أريد الإقامة في إسبانيا",
      trabajar: "أريد العمل في إسبانيا",
      nomada: "أنا رحّالة رقمي",
      estudiar: "أريد الدراسة",
      familia: "أريد لمّ شمل عائلتي",
      regularizar: "أعيش هنا بالفعل وأريد تسوية وضعي",
      renovar: "أريد تجديد تصريحي",
      nacionalidad: "أريد الحصول على الجنسية الإسبانية",
      requerimiento: "وصلني طلب من الإدارة",
      no_se: "لا أعرف ما أحتاج إليه",
    },
    notes: {
      vivir: "طرق الاستقرار بشكل دائم، بعمل في إسبانيا أو من دونه.",
      trabajar: "يعتمد على وجودك داخل إسبانيا أو خارجها، وعلى الجهة التي ستوظفك.",
      nomada: "تعمل عن بُعد لشركات أو عملاء مقرّهم خارج إسبانيا.",
      estudiar: "الإقامة للدراسة، وكيفية الانتقال بعدها إلى تصريح عمل.",
      familia: "النظام المطبَّق يتغيّر كثيرًا حسب جنسية قريبك.",
      regularizar: "طرق «arraigo» تنطلق من مدة وجودك في إسبانيا ومن وضعك الحالي.",
      renovar: "توقيت التقديم حاسم. تحقّق منه قبل انتهاء صلاحية بطاقتك.",
      nacionalidad: "نبدأ بمراجعة سنوات إقامتك القانونية ومدد غيابك عن البلاد.",
      requerimiento: "المهل قصيرة. إذا وصلك للتو، راسلنا اليوم.",
      no_se: "هذه أكثر إجابة شيوعًا ولا مشكلة فيها. التقييم موجود لهذا بالضبط.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "جوهر المنصّة",
    /** Titular de la sección: la intención en palabras del usuario, no la marca. */
    headline: "اعرف في 3 دقائق أي طريق إقامة يناسبك.",
    lede: "أجب عن بضعة أسئلة واكتشف الخيارات التي قد تناسب وضعك. ثمانية أسئلة مشروطة: لا نسألك إلا عمّا تتطلبه حالتك.",
    start: "ابدأ التقييم",
    howWeAnalyse: "شاهد كيف نحلّل حالتك",
    preview: "معاينة",
    questionOf: "السؤال {current} من {total}",
    exit: "الخروج من التقييم",
    confidential: "هذه الإجابة سرّية وتُستخدم فقط لتوجيهك",
    goBackAnytime: "يمكنك الرجوع في أي وقت",
    features: [
      { title: "الطرق التي قد تناسبك", detail: "مرتّبة حسب الملاءمة الأولية، مع البدائل." },
      { title: "المستندات التي ستُطلب منك", detail: "القائمة الحقيقية، مع بيان من يحصل على كل مستند." },
      { title: "ما يجب التحقق منه في حالتك", detail: "ما يتعيّن على المختص فحصه قبل أي شيء." },
    ],
    boundary:
      "التقييم **توجيه أوّلي** آلي. ليس استشارة قانونية ولا يؤكّد استيفاءك للشروط: هذا لا يقوم به إلا مختص يراجع مستنداتك الفعلية.",
    footerNote:
      "النتيجة **توجيه أوّلي** يُنشأ آليًا من إجاباتك. ليست استشارة قانونية ولا تؤكّد استيفاء شروط أي طريق. **التحقق المهني** يتطلّب أن يراجع مختص مستنداتك الفعلية.",
  },

  analysis: {
    title: "نحلّل وضعك",
    stages: [
      "نقرأ إجاباتك",
      "نقارنها بالطرق المتاحة",
      "نراجع ما يجب التحقق منه",
      "نجهّز نتيجتك",
    ],
    reveal: "لدينا طريق لك.",
    revealSub: "سنعرض عليك ما يناسبك وما لا يزال بحاجة إلى تحقق.",
  },

  result: {
    eyebrow: "نتيجة تقييمك",
    restart: "إعادة التقييم",
    talkToSpecialist: "تحدّث إلى مختص",
    mainPath: "الطريق الرئيسي",
    alternative: "بديل",
    alternatives: "بدائل",
    whyItFits: "لماذا قد يناسبك",
    needToVerify: "ما نحتاج إلى التحقق منه",
    documentation: "المستندات",
    documents: "مستندات",
    fees: "الأتعاب",
    custom: "حسب الحالة",
    deadlines: "المهل:",
    reviewWithSpecialist: "مراجعة ملفي مع مختص",
    seeRequirements: "عرض الشروط",
    nextStepTitle: "الخطوة التالية أن يطّلع عليه شخص فعلًا.",
    nextStepBody:
      "45 دقيقة مع مختص يراجع مستنداتك، ويؤكّد الاستراتيجية، ويسلّمك خطة المستندات كتابةً. ويُخصم المبلغ إذا كلّفتنا بإدارة الملف.",
    saveResult: "حفظ نتيجتي",
    whatYouGot: "ما حصلت عليه الآن",
    whatYouGotBody:
      "**توجيه أوّلي** مبني على إجاباتك. يدلّك على أين تنظر وما الذي يجب التحقق منه.",
    whatItIsNot: "ما ليس عليه بعد",
    whatItIsNotBody:
      "**تحقق مهني**. لم يطّلع أحد بعد على مستنداتك الفعلية، وهناك يُحسم الملف.",
    disclaimer:
      "هذه النتيجة ليست استشارة قانونية، ولا تنشئ علاقة مهنية، ولا تضمن منح أي تصريح. تعتمد الشروط الدقيقة على التشريع النافذ وقت التقديم وعلى تقدير المكتب المختص. عولجت إجاباتك داخل متصفحك ولم تُرسل إلى أي خادم.",
    downloadPdf: "تنزيل بصيغة PDF",
    changeAnswers: "تعديل إجاباتي",
    seeAnswers: "عرض الإجابات التي حُسبت منها هذه النتيجة",
    urgentTitle: "ملفك له مهل سارية الآن",
    urgentBody:
      "طلبات استكمال المستندات وقرارات الرفض لها مهل قصيرة تبدأ من يوم التبليغ. ارفع المستند في أقرب وقت وسنراجعه في اليوم نفسه.",
    fit: {
      alto: "ملاءمة أولية عالية",
      medio: "ملاءمة أولية متوسطة",
      explorar: "يستحق الاستكشاف",
    },
    summaryOne: "وجدنا طريقًا قد يناسب وضعك.",
    summaryMany: "وجدنا {count} طرق ممكنة لك.",
    summaryNone:
      "بناءً على ما ذكرته لا يمكننا تحديد طريق واضح بعد. هذا لا يعني عدم وجوده: يعني أن حالتك تحتاج إلى فحص أدق.",
    summaryUrgent:
      "وصلك إشعار من الإدارة. هذه الحالات لها مهل قصيرة، ولذلك نتعامل معها بأولوية.",
    fallback:
      "نقترح عليك استشارة مع مختص لمراجعة حالتك بالتفصيل. وإذا تبيّن بعد المراجعة عدم وجود طريق قابل للتطبيق، سنخبرك بوضوح.",
  },

  app: {
    greeting: "مرحبًا، {name}",
    greetingSub: "هذا ما يجري في ملفك الآن.",
    nav: {
      home: "الرئيسية",
      case: "ملفي",
      caseShort: "الملف",
      documents: "المستندات",
      messages: "الرسائل",
      appointments: "المواعيد",
      payments: "المدفوعات",
      notifications: "الإشعارات",
      profile: "الملف الشخصي",
      signOut: "تسجيل الخروج",
    },
    caseRef: "الملف",
    progress: "تقدّم الملف",
    completed: "مكتمل",
    nextStepLabel: "ما نحتاجه منك الآن",
    uploadDocument: "رفع مستند",
    yourSpecialist: "المختص المسؤول عنك",
    sendMessage: "إرسال رسالة",
    recentActivity: "النشاط الأخير",
    missingDocuments: "المستندات الناقصة",
    manage: "إدارة",
    caseData: "بيانات الملف",
    reference: "المرجع",
    openedOn: "فُتح في",
    status: "الحالة",
    docStates: {
      pendiente: "قيد الانتظار",
      subido: "تم الرفع",
      revision: "قيد المراجعة",
      correcto: "مُعتمد",
      cambios: "يحتاج إلى تصحيح",
      caducado: "منتهي الصلاحية",
    },
    docStateHelp: {
      pendiente: "لم ترفعه بعد.",
      subido: "استلمناه بشكل صحيح.",
      revision: "المختص يراجعه الآن.",
      correcto: "مُعتمد من مختص. لا شيء آخر عليك فعله.",
      cambios: "هناك ما يجب تصحيحه. نخبرك بالضبط بماذا.",
      caducado: "انتهت صلاحيته ويجب تجديده.",
    },
    dropzone: {
      title: "اسحب مستنداتك إلى هنا",
      dropNow: "أفلت مستندك هنا",
      hint: "PDF أو JPG أو PNG · حتى 20 ميغابايت لكل ملف · يمكنك أيضًا التقاط صورة",
      selectFile: "اختيار ملف",
      takePhoto: "التقاط صورة",
      privacy: "تخزين خاص. يُقدَّم كل ملف عبر رابط موقَّع تنتهي صلاحيته.",
    },
    filters: { all: "الكل", pending: "قيد الانتظار", inReview: "قيد المراجعة", validated: "معتمدة" },
    chatPlaceholder: "اكتب رسالتك…",
    assistantName: "مساعد Extranjería Segura",
    demoBanner: {
      strong: "وضع العرض التجريبي.",
      body: "بيانات هذا الملف وهمية ولا تخصّ أي شخص حقيقي. المصادقة عبر Supabase منفَّذة لكنها غير مفعّلة في هذه البيئة.",
      cta: "إنشاء حسابي الحقيقي",
    },
  },

  footer: {
    ctaTitle: "لا تعرف أي معاملة تحتاج؟",
    ctaBody:
      "أجب عن بضعة أسئلة وسنخبرك بالطرق التي قد تناسبك، والمستندات المطلوبة، وما يجب التحقق منه. بلا تسجيل وبلا تكلفة.",
    ctaButton: "ابدأ التقييم المجاني",
    tagline:
      "ندير ملف إقامتك من البداية إلى النهاية. تعرف في كل لحظة أين وصل ملفك، وما الناقص، ومن يساعدك.",
    trust: { encrypted: "بيانات مشفّرة", gdpr: "اللائحة العامة لحماية البيانات", traceable: "ملف قابل للتتبّع" },
    groups: {
      services: "الخدمات",
      tramites: "المعاملات",
      resources: "الموارد",
      company: "الشركة",
      legal: "الشؤون القانونية",
    },
    rights: "جميع الحقوق محفوظة.",
    disclaimer:
      "المعلومات المنشورة في هذا الموقع ذات طابع إرشادي ولا تشكّل استشارة قانونية. كل ملف يتطلّب تحليل مختص.",
    cookiePrefs: "تفضيلات ملفات تعريف الارتباط",
  },

  auth: {
    signInTitle: "ادخل إلى ملفك",
    signInSub: "سجّل الدخول لترى أين وصل ملفك وما الناقص فيه.",
    signUpTitle: "أنشئ حسابك",
    signUpSub: "افتح ملفك واحفظ نتيجة تقييمك.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    show: "إظهار",
    hide: "إخفاء",
    forgot: "نسيت كلمة المرور",
    signInButton: "دخول",
    signUpButton: "إنشاء حسابي",
    noAccount: "ليس لديك حساب بعد؟",
    createIt: "أنشئه من هنا",
    haveAccount: "لديك حساب بالفعل؟",
    signInHere: "سجّل الدخول",
    securityNote:
      "حسابك يتيح الوصول إلى مستندات هوية. استخدم كلمة مرور لا تستعملها في أي مكان آخر، وفعّل التحقق بخطوتين فور دخولك.",
  },

  errors: {
    notFoundTitle: "هذه الصفحة غير موجودة.",
    notFoundBody:
      "قد يكون الرابط خاطئًا، أو نكون قد نقلنا المحتوى. أما بقية الموقع فما زالت هنا: اختر من أين تكمل.",
    backHome: "العودة إلى الرئيسية",
    orStartCategory: "أو ابدأ من فئة",
  },
};
