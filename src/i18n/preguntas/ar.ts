import type { TraduccionPreguntas } from "./tipos";

/**
 * أسئلة التقييم — العربية.
 *
 * Es la traducción que más urgía. Antes de existir, /ar servía las preguntas
 * en español dentro de una página `dir="rtl"`, y el algoritmo bidi mandaba los
 * signos de interrogación al extremo contrario: «¿Cuál es tu nacionalidad?» se
 * leía «Cuál es tu¿ ?nacionalidad». No era solo que estuviera sin traducir:
 * estaba roto.
 *
 * Los términos administrativos españoles que el usuario va a ver escritos tal
 * cual en una ventanilla —«padrón», «arraigo»— se mantienen en alfabeto latino
 * junto a la explicación en árabe. Traducirlos del todo haría que buscara una
 * palabra que no aparece en ningún formulario.
 */
export const ar: TraduccionPreguntas = {
  objetivo: {
    title: "ما الذي تريد تحقيقه؟",
    help: "اختر ما يشبه وضعك أكثر. يمكنك تعديله لاحقًا.",
    rail: "الهدف",
    options: {
      vivir: { label: "العيش في إسبانيا", hint: "الاستقرار بشكل دائم" },
      trabajar: { label: "العمل في إسبانيا", hint: "بعقد عمل أو لحسابي الخاص" },
      nomada: { label: "العمل عن بُعد من إسبانيا", hint: "لشركة أو عملاء خارج إسبانيا" },
      estudiar: { label: "الدراسة", hint: "جامعة أو ماجستير أو تكوين مهني" },
      familia: { label: "إحضار عائلتي أو الالتحاق بها", hint: "لمّ الشمل أو صلة عائلية" },
      regularizar: { label: "تسوية وضعي القانوني", hint: "أعيش هنا بالفعل وأحتاج أوراقًا" },
      renovar: { label: "تجديد تصريحي", hint: "بطاقتي على وشك الانتهاء أو انتهت" },
      nacionalidad: { label: "الحصول على الجنسية الإسبانية" },
      requerimiento: { label: "وصلني طلب استكمال أو قرار رفض", hint: "أحتاج إلى الرد" },
      no_se: { label: "لا أعرف ما أحتاج إليه", hint: "ساعدني في معرفة ذلك" },
    },
  },

  nacionalidad_region: {
    title: "ما جنسيتك الحالية؟",
    help: "جنسيتك تحدّد النظام القانوني الذي ينطبق عليك والمهل الزمنية.",
    rail: "الجنسية",
    options: {
      ue: { label: "دولة من الاتحاد الأوروبي أو المنطقة الاقتصادية أو سويسرا", hint: "ينطبق عليك نظام الاتحاد الأوروبي" },
      iberoamerica: { label: "دولة أيبيرية أمريكية", hint: "تشمل أمريكا اللاتينية" },
      preferente: { label: "الفلبين أو غينيا الاستوائية أو البرتغال أو أندورا" },
      resto: { label: "دولة أخرى", hint: "النظام العام لشؤون الأجانب" },
    },
  },

  ubicacion: {
    title: "أين تتواجد الآن؟",
    rail: "المكان",
    options: {
      espana: { label: "في إسبانيا", hint: "أقيم أو أتواجد هنا حاليًا" },
      fuera: { label: "خارج إسبانيا", hint: "سأقدّم الطلب من بلدي" },
    },
  },

  tiempo_espana: {
    title: "منذ متى تعيش في إسبانيا دون انقطاع؟",
    help: "احسب من آخر دخول لك، دون فترات غياب طويلة.",
    rail: "مدة الإقامة",
    options: {
      menos_6m: { label: "أقل من 6 أشهر" },
      "6_12m": { label: "بين 6 أشهر وسنة" },
      "12_24m": { label: "بين سنة وسنتين" },
      "24_36m": { label: "بين سنتين وثلاث سنوات" },
      mas_36m: { label: "أكثر من ثلاث سنوات" },
    },
  },

  situacion: {
    title: "ما وضعك الإداري اليوم؟",
    help: "كن صريحًا. هذه المعلومة تُستخدم فقط لتوجيهك بشكل أفضل وتبقى سرّية.",
    rail: "الوضع",
    options: {
      sin_autorizacion: { label: "بدون تصريح إقامة" },
      estancia_estudios: { label: "إقامة دراسية سارية" },
      autorizacion_vigente: { label: "تصريح إقامة ساري" },
      autorizacion_caducada: { label: "تصريح منتهٍ أو مرفوض" },
      visado_vigente: { label: "تأشيرة أو إقامة سارية" },
      solicitud_tramite: { label: "لديّ طلب قيد الدراسة" },
    },
  },

  empadronamiento: {
    title: "هل أنت مسجّل في قيد السكان (padrón) في إسبانيا؟",
    help: "التسجيل في قيد السكان من أهم وسائل إثبات الإقامة المتواصلة.",
    rail: "قيد السكان",
    options: {
      si_mas_2a: { label: "نعم، منذ أكثر من سنتين" },
      si_1_2a: { label: "نعم، منذ سنة إلى سنتين" },
      si_menos_1a: { label: "نعم، منذ أقل من سنة" },
      no: { label: "لست مسجّلًا" },
      no_se: { label: "لست متأكدًا" },
    },
  },

  vinculo_familiar: {
    title: "هل لديك صلة عائلية في إسبانيا؟",
    rail: "العائلة",
    options: {
      conyuge_espanol: { label: "زوج/زوجة أو شريك مسجّل إسباني" },
      pareja_ue: { label: "زوج/زوجة أو شريك من دولة في الاتحاد الأوروبي" },
      hijo_espanol: { label: "ابن أو ابنة يحمل الجنسية الإسبانية" },
      familiar_residente: { label: "قريب مباشر يقيم بصفة قانونية" },
      ninguno: { label: "لا شيء مما سبق" },
    },
  },

  trabajo: {
    title: "ما وضعك المهني؟",
    rail: "العمل",
    options: {
      contrato_vigente: { label: "لديّ عقد عمل في إسبانيا" },
      oferta_firmada: { label: "لديّ عرض عمل موقّع" },
      remoto_extranjero: { label: "أعمل عن بُعد لشركة خارج إسبانيا" },
      autonomo_extranjero: { label: "أعمل لحسابي الخاص مع عملاء خارج إسبانيا" },
      autonomo_espana: { label: "أريد العمل لحسابي الخاص في إسبانيا" },
      ninguno: { label: "ليس لديّ عمل ولا عرض حاليًا" },
    },
  },

  formacion: {
    title: "هل أنت مسجّل في تكوين أو تنوي التسجيل؟",
    help: "تعليم نظامي أو شهادة تأهيل مهني (certificado de profesionalidad) أو دراسات رسمية.",
    rail: "التكوين",
    options: {
      matriculado: { label: "نعم، أنا مسجّل بالفعل" },
      prevista: { label: "أنوي التسجيل" },
      ninguna: { label: "لا" },
    },
  },

  anos_residencia_legal: {
    title: "كم سنة قضيت في إسبانيا بإقامة قانونية؟",
    help: "تُحتسب فقط الفترات التي كان لديك فيها تصريح أو بطاقة سارية.",
    rail: "الإقامة القانونية",
    options: {
      menos_1: { label: "أقل من سنة" },
      "1_2": { label: "بين سنة وسنتين" },
      "2_5": { label: "بين سنتين وخمس سنوات" },
      "5_10": { label: "بين خمس وعشر سنوات" },
      mas_10: { label: "أكثر من عشر سنوات" },
    },
  },

  recursos: {
    title: "هل يمكنك إثبات موارد مالية مستقرة؟",
    help: "كشوف رواتب أو مدّخرات أو إيرادات أو معاشات أو فواتير العمل الحر.",
    rail: "الموارد",
    options: {
      si_holgados: { label: "نعم، بهامش مريح" },
      si_justos: { label: "نعم، لكن بالكاد" },
      no: { label: "لا في الوقت الحالي" },
      no_se: { label: "لا أعرف ما هو المطلوب مني" },
    },
  },

  antecedentes: {
    title: "هل لديك سوابق جنائية في أي بلد؟",
    help: "وجود سوابق لا يغلق تلقائيًا كل الطرق، لكنه يغيّر التحليل.",
    rail: "السوابق",
    options: {
      ninguno: { label: "لا، لا شيء" },
      si: { label: "نعم" },
      no_se: { label: "لست متأكدًا" },
    },
  },
};
