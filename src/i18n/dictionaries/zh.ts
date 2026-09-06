import type { Dictionary } from "./es";

/**
 * 简体中文 — chino simplificado.
 *
 * Se elige el simplificado, no el tradicional: la comunidad china en España
 * procede mayoritariamente de la China continental. Los términos jurídicos
 * españoles sin equivalente —«arraigo», «TIE», «NIE»— se mantienen en alfabeto
 * latino junto a la explicación, porque son literalmente lo que el usuario
 * leerá en su resolución.
 *
 * Sin espacios alrededor de la puntuación china (，。：) y sin espacio entre
 * caracteres chinos y cifras: es la convención tipográfica correcta.
 */
export const zh: Dictionary = {
  meta: {
    locale: "zh",
    reviewNotice:
      "界面已翻译为中文。详细的法律内容正在审核中，西班牙语版本始终为准。",
  },

  common: {
    back: "返回",
    continue: "继续",
    cancel: "取消",
    save: "保存",
    send: "发送",
    close: "关闭",
    open: "打开",
    loading: "加载中",
    seeAll: "查看全部",
    seeMore: "查看更多",
    from: "起价",
    free: "免费",
    optional: "选填",
    required: "必填",
    yes: "是",
    no: "否",
    demo: "演示",
    skipToContent: "跳至主要内容",
    languageLabel: "语言",
    changeLanguage: "切换语言",
    comingSoon: "即将推出",
  },

  nav: {
    howItWorks: "服务流程",
    tramites: "业务办理",
    pricing: "价格",
    reviews: "评价",
    resources: "资料中心",
    signIn: "登录",
    cta: "查看我的情况",
    ctaShort: "开始",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    byCategory: "按类别",
    mostRequested: "最常办理",
    dontKnow: "不确定自己该办哪一项？",
    doTheCheck: "开始评估",
    home: "首页",
    allTramites: "查看全部业务",
  },

  hero: {
    eyebrow: "居留业务 · 全程线上",
    titleA: "你在西班牙的生活。",
    titleB: "手续交给我们。",
    subtitle:
      "3分钟内了解你需要哪种许可、要准备哪些材料，以及我们如何从头到尾替你办完整个案件。",
    ctaPrimary: "查看我的情况",
    ctaSecondary: "我已经知道要办哪一项",
    promises: ["首次咨询免费", "全程线上办理", "实时查看进度"],
    strip: "我们全程负责的案件类型",
  },

  intents: {
    eyebrow: "从这里开始",
    titleA: "告诉我们你想达成什么。",
    titleB: "路径由我们来找。",
    lede: "你不需要知道业务的正式名称。从你的目标出发，剩下的我们来翻译。",
    changeGoal: "更改目标",
    mostCommon: "最常见",
    alternative: "备选方案",
    checkFit: "3分钟评估我的适配情况",
    seeCatalogue: "查看完整目录",
    quoteAfter: "评估后报价",
    labels: {
      vivir: "我想在西班牙生活",
      trabajar: "我想在西班牙工作",
      nomada: "我是数字游民",
      estudiar: "我想留学",
      familia: "我想把家人接过来",
      regularizar: "我已经住在这里，想合法化身份",
      renovar: "我想续签居留",
      nacionalidad: "我想申请西班牙国籍",
      requerimiento: "我收到了官方的补件通知",
      no_se: "我不知道自己需要什么",
    },
    notes: {
      vivir: "长期定居的各种途径，无论是否在西班牙工作。",
      trabajar: "取决于你人在西班牙境内还是境外，以及由谁雇用你。",
      nomada: "你为西班牙境外的公司或客户远程工作。",
      estudiar: "学习居留，以及之后如何转为工作许可。",
      familia: "适用的制度会因亲属的国籍而有很大差别。",
      regularizar: "arraigo（扎根居留）各条途径取决于你在西班牙居住的时间和当前状况。",
      renovar: "递交时机非常关键。请在卡片到期前确认。",
      nacionalidad: "我们会先核查你的合法居留年限和离境记录。",
      requerimiento: "时限很短。如果你刚收到，请今天就联系我们。",
      no_se: "这是最常见的回答，完全没问题。评估工具正是为此而设。",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "平台的核心",
    /** Titular de la sección: la intención en palabras del usuario, no la marca. */
    headline: "3分钟了解哪条居留路径适合你。",
    lede: "回答几个问题，了解哪些方案可能适合你的情况。八个条件式问题：只问你的案件真正需要的内容。",
    start: "开始评估",
    howWeAnalyse: "了解我们如何分析",
    preview: "预览",
    questionOf: "第{current}题，共{total}题",
    exit: "退出评估",
    confidential: "此回答保密，仅用于为你提供方向",
    goBackAnytime: "你随时可以返回上一步",
    features: [
      { title: "可能适合你的途径", detail: "按初步适配度排序，并附备选方案。" },
      { title: "会要求你提供哪些材料", detail: "真实清单，并注明每份材料由谁负责获取。" },
      { title: "你的情况需要核实什么", detail: "专业人员必须优先查看的内容。" },
    ],
    boundary:
      "本评估是自动生成的**初步方向建议**。它不是法律咨询，也不确认你符合条件：只有专业人员审阅你的真实材料才能确认。",
    footerNote:
      "结果是根据你的回答自动生成的**初步方向建议**。它不是法律咨询，也不确认你符合任何途径的条件。**专业确认**需要由专业人员审阅你的真实材料。",
  },

  analysis: {
    title: "正在分析你的情况",
    stages: ["读取你的回答", "与可行途径逐一比对", "梳理需要核实的内容", "准备你的结果"],
    reveal: "我们为你找到了一条路。",
    revealSub: "接下来会告诉你哪些条件已经符合，哪些还需要核实。",
  },

  result: {
    eyebrow: "你的评估结果",
    restart: "重新评估",
    talkToSpecialist: "与专业人员沟通",
    mainPath: "主要途径",
    alternative: "备选方案",
    alternatives: "备选方案",
    whyItFits: "为什么可能适合你",
    needToVerify: "需要核实的内容",
    documentation: "所需材料",
    documents: "份材料",
    fees: "服务费",
    custom: "按案件报价",
    deadlines: "时限：",
    reviewWithSpecialist: "让专业人员审阅我的案件",
    seeRequirements: "查看条件",
    nextStepTitle: "下一步，是让人真正把它看一遍。",
    nextStepBody:
      "45分钟，由专业人员审阅你的材料、确认策略，并以书面形式交付材料准备计划。如后续委托我们办理，这笔费用可抵扣。",
    saveResult: "保存我的结果",
    whatYouGot: "你刚刚拿到的是",
    whatYouGotBody: "根据你的回答生成的**初步方向建议**。它告诉你该往哪看、需要核实什么。",
    whatItIsNot: "它目前还不是",
    whatItIsNotBody: "**专业确认**。还没有人看过你的真实材料，而案件正是在那里定胜负。",
    disclaimer:
      "本结果不构成法律咨询，不建立专业委托关系，也不保证任何许可获批。具体条件取决于递交时有效的法规以及主管机关的判断。你的回答在浏览器内完成处理，未发送至任何服务器。",
    downloadPdf: "下载 PDF",
    changeAnswers: "修改我的回答",
    seeAnswers: "查看用于计算此结果的回答",
    urgentTitle: "你的案件时限正在计算中",
    urgentBody:
      "补件通知和驳回决定的时限很短，从收到通知当天起算。请尽快上传文件，我们当天查看。",
    fit: {
      alto: "初步适配度高",
      medio: "初步适配度中等",
      explorar: "值得进一步了解",
    },
    summaryOne: "我们找到了一条可能适合你情况的途径。",
    summaryMany: "我们为你找到了{count}条可行途径。",
    summaryNone:
      "根据你提供的信息，目前还无法指出一条明确的途径。这不代表没有：而是说明你的案件需要更细致地看。",
    summaryUrgent: "你收到了官方通知。这类案件时限很短，因此我们会优先处理。",
    fallback:
      "建议你与专业人员进行一次咨询，详细梳理你的案件。如果梳理后确实没有可行途径，我们会明确告诉你。",
  },

  app: {
    greeting: "你好，{name}",
    greetingSub: "这是你的案件目前的进展。",
    nav: {
      home: "首页",
      case: "我的案件",
      caseShort: "案件",
      documents: "材料",
      messages: "消息",
      appointments: "预约",
      payments: "付款",
      notifications: "通知",
      profile: "个人资料",
      signOut: "退出",
    },
    caseRef: "案件",
    progress: "案件进度",
    completed: "已完成",
    nextStepLabel: "现在需要你提供的",
    uploadDocument: "上传材料",
    yourSpecialist: "你的专属顾问",
    sendMessage: "发送消息",
    recentActivity: "最近动态",
    missingDocuments: "尚缺的材料",
    manage: "管理",
    caseData: "案件信息",
    reference: "案件编号",
    openedOn: "建档日期",
    status: "状态",
    docStates: {
      pendiente: "待提交",
      subido: "已上传",
      revision: "审核中",
      correcto: "已通过",
      cambios: "需要修改",
      caducado: "已过期",
    },
    docStateHelp: {
      pendiente: "你还没有上传。",
      subido: "我们已正确收到。",
      revision: "你的顾问正在审核。",
      correcto: "已由专业人员确认，无需再处理。",
      cambios: "有需要更正的地方，我们会告诉你具体是什么。",
      caducado: "已失效，需要重新办理。",
    },
    dropzone: {
      title: "把材料拖到这里",
      dropNow: "在此松开文件",
      hint: "PDF、JPG 或 PNG · 每个文件最大 20 MB · 也可以直接拍照",
      selectFile: "选择文件",
      takePhoto: "拍照上传",
      privacy: "私有存储。每个文件都通过会过期的签名链接提供。",
    },
    filters: { all: "全部", pending: "待提交", inReview: "审核中", validated: "已通过" },
    chatPlaceholder: "输入你的消息…",
    assistantName: "Extranjería Segura 助手",
    demoBanner: {
      strong: "演示模式。",
      body: "此案件中的数据均为虚构，不对应任何真实人物。Supabase 身份验证已实现，但未在此环境中启用。",
      cta: "创建我的正式账户",
    },
  },

  footer: {
    ctaTitle: "不确定该办哪项业务？",
    ctaBody:
      "回答几个问题，我们会告诉你哪些途径可能适合你、需要哪些材料、还有什么需要核实。无需注册，完全免费。",
    ctaButton: "免费开始评估",
    tagline:
      "我们从头到尾负责你的居留案件。你随时都知道案件进展到哪一步、还缺什么、由谁在帮你。",
    trust: { encrypted: "数据加密", gdpr: "GDPR 合规", traceable: "案件全程可追溯" },
    groups: {
      services: "服务",
      tramites: "业务办理",
      resources: "资料中心",
      company: "关于我们",
      legal: "法律信息",
    },
    rights: "保留所有权利。",
    disclaimer:
      "本网站发布的信息仅供参考，不构成法律咨询。每个案件都需要专业人员的分析。",
    cookiePrefs: "Cookie 设置",
  },

  auth: {
    signInTitle: "登录查看你的案件",
    signInSub: "登录后可查看案件进展和尚缺的材料。",
    signUpTitle: "创建账户",
    signUpSub: "建立你的案件档案，并保存评估结果。",
    name: "姓名",
    email: "电子邮箱",
    password: "密码",
    show: "显示",
    hide: "隐藏",
    forgot: "忘记密码",
    signInButton: "登录",
    signUpButton: "创建账户",
    noAccount: "还没有账户？",
    createIt: "在此创建",
    haveAccount: "已经有账户？",
    signInHere: "登录",
    securityNote:
      "你的账户可访问身份证件。请使用一个不在其他任何地方重复使用的密码，并在登录后立即开启两步验证。",
  },

  errors: {
    notFoundTitle: "此页面不存在。",
    notFoundBody: "可能是链接有误，也可能是内容被移动了。其他内容都还在，从这里继续即可。",
    backHome: "返回首页",
    orStartCategory: "或者从某个类别开始",
  },
};
