import type { Dictionary } from "./es";

/**
 * Português (variante brasileira).
 *
 * Se escolhe o português do Brasil porque é de longe a comunidade lusófona
 * maior nos procedimentos de estrangeria em Espanha. Termos jurídicos
 * espanhóis sem equivalente —«arraigo», «TIE»— mantêm-se em espanhol: são
 * categorias legais, não palavras a traduzir.
 */
export const pt: Dictionary = {
  meta: {
    locale: "pt",
    reviewNotice:
      "A interface está em português. O conteúdo jurídico detalhado está em revisão e a versão de referência é sempre a espanhola.",
  },

  common: {
    back: "Voltar",
    continue: "Continuar",
    cancel: "Cancelar",
    save: "Salvar",
    send: "Enviar",
    close: "Fechar",
    open: "Abrir",
    loading: "Carregando",
    seeAll: "Ver tudo",
    seeMore: "Ver mais",
    from: "a partir de",
    free: "Grátis",
    optional: "opcional",
    required: "obrigatório",
    yes: "Sim",
    no: "Não",
    demo: "Demo",
    skipToContent: "Ir para o conteúdo principal",
    languageLabel: "Idioma",
    changeLanguage: "Mudar idioma",
    comingSoon: "Em breve",
  },

  nav: {
    howItWorks: "Como funciona",
    tramites: "Procedimentos",
    pricing: "Preços",
    reviews: "Avaliações",
    resources: "Recursos",
    signIn: "Entrar",
    cta: "Verificar minha situação",
    ctaShort: "Começar",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    byCategory: "Por categoria",
    mostRequested: "Mais solicitados",
    dontKnow: "Não sabe qual é o seu caso?",
    doTheCheck: "Fazer o diagnóstico",
    home: "Início",
    allTramites: "Ver todos os procedimentos",
  },

  hero: {
    eyebrow: "Estrangeria · 100% online",
    titleA: "Sua vida na Espanha.",
    titleB: "A papelada é com a gente.",
    subtitle:
      "Descubra em menos de 3 minutos qual autorização você precisa, quais documentos deve apresentar e como podemos cuidar de tudo por você.",
    ctaPrimary: "Verificar minha situação",
    ctaSecondary: "Já sei de qual procedimento preciso",
    promises: [
      "Primeira orientação gratuita",
      "Gestão 100% online",
      "Acompanhamento em tempo real",
    ],
    strip: "Cuidamos do processo completo em",
  },

  intents: {
    eyebrow: "Ponto de partida",
    titleA: "Diga o que você quer alcançar.",
    titleB: "Nós encontramos o caminho.",
    lede: "Você não precisa saber o nome do procedimento. Comece pelo seu objetivo e nós traduzimos.",
    changeGoal: "Mudar objetivo",
    mostCommon: "Mais comum",
    alternative: "Alternativa",
    checkFit: "Verificar meu encaixe em 3 minutos",
    seeCatalogue: "Ver o catálogo completo",
    quoteAfter: "Orçamento após o diagnóstico",
    labels: {
      vivir: "Quero morar na Espanha",
      trabajar: "Quero trabalhar na Espanha",
      nomada: "Sou nômade digital",
      estudiar: "Quero estudar",
      familia: "Quero trazer minha família",
      regularizar: "Já moro aqui e quero regularizar minha situação",
      renovar: "Quero renovar minha autorização",
      nacionalidad: "Quero a nacionalidade espanhola",
      requerimiento: "Recebi uma exigência da Administração",
      no_se: "Não sei do que preciso",
    },
    notes: {
      vivir: "Vias para se estabelecer de forma estável, com ou sem atividade laboral na Espanha.",
      trabajar: "Depende de você estar dentro ou fora da Espanha e de quem vai contratá-lo.",
      nomada: "Você trabalha remotamente para empresas ou clientes situados fora da Espanha.",
      estudiar: "Estadia por estudos e como passar depois a uma autorização de trabalho.",
      familia: "O regime aplicável muda bastante conforme a nacionalidade do seu familiar.",
      regularizar: "As vias de arraigo partem do tempo que você está na Espanha e da sua situação.",
      renovar: "O momento de apresentar é decisivo. Consulte antes que o cartão vença.",
      nacionalidad: "Antes de tudo auditamos seus anos de residência legal e suas ausências.",
      requerimiento: "Os prazos são curtos. Se acabou de receber, escreva para nós hoje mesmo.",
      no_se: "É a resposta mais comum e não tem problema. O diagnóstico existe exatamente para isso.",
    },
  },

  check: {
    name: "Immigration Check",
    eyebrow: "O coração da plataforma",
    lede: "Responda algumas perguntas e descubra quais opções podem encaixar na sua situação. Oito perguntas condicionais: só perguntamos o que o seu caso exige.",
    start: "Começar o diagnóstico",
    howWeAnalyse: "Ver como analisamos",
    preview: "Prévia",
    questionOf: "Pergunta {current} de {total}",
    exit: "Sair do diagnóstico",
    confidential: "Esta resposta é confidencial e serve apenas para orientar você",
    goBackAnytime: "Você pode voltar a qualquer momento",
    features: [
      { title: "Vias que podem encaixar com você", detail: "Ordenadas por encaixe preliminar, com as alternativas." },
      { title: "Quais documentos vão pedir", detail: "A lista real, indicando quem obtém cada documento." },
      { title: "O que precisaria ser verificado no seu caso", detail: "O que um profissional tem de olhar antes de tudo." },
    ],
    boundary:
      "O diagnóstico é uma **orientação preliminar** automatizada. Não é assessoria jurídica nem confirma que você cumpre os requisitos: isso só um profissional pode fazer revisando a sua documentação real.",
    footerNote:
      "O resultado é uma **orientação preliminar** gerada automaticamente a partir das suas respostas. Não é assessoria jurídica nem confirma que você cumpre os requisitos de nenhuma via. A **validação profissional** exige que um especialista revise a sua documentação real.",
  },

  analysis: {
    title: "Analisando a sua situação",
    stages: [
      "Lendo as suas respostas",
      "Comparando com as vias disponíveis",
      "Revisando o que precisaria ser verificado",
      "Preparando o seu resultado",
    ],
    reveal: "Temos um caminho para você.",
    revealSub: "Vamos mostrar o que encaixa e o que ainda precisaria ser conferido.",
  },

  result: {
    eyebrow: "Resultado do seu diagnóstico",
    restart: "Repetir diagnóstico",
    talkToSpecialist: "Falar com um especialista",
    mainPath: "Via principal",
    alternative: "Alternativa",
    alternatives: "Alternativas",
    whyItFits: "Por que pode encaixar com você",
    needToVerify: "Precisamos verificar",
    documentation: "Documentação",
    documents: "documentos",
    fees: "Honorários",
    custom: "Sob medida",
    deadlines: "Prazos:",
    reviewWithSpecialist: "Revisar meu caso com um especialista",
    seeRequirements: "Ver requisitos",
    nextStepTitle: "O próximo passo é alguém olhar isso de verdade.",
    nextStepBody:
      "45 minutos com um especialista que revisa a sua documentação, confirma a estratégia e entrega o plano documental por escrito. Se você contratar a gestão, o valor é descontado.",
    saveResult: "Salvar meu resultado",
    whatYouGot: "O que você acabou de receber",
    whatYouGotBody:
      "Uma **orientação preliminar** gerada a partir das suas respostas. Ela diz por onde olhar e o que precisa ser conferido.",
    whatItIsNot: "O que ainda não é",
    whatItIsNotBody:
      "Uma **validação profissional**. Ninguém viu ainda os seus documentos reais, e é aí que um processo se decide.",
    disclaimer:
      "Este resultado não constitui assessoria jurídica, não cria relação profissional e não garante a concessão de nenhuma autorização. As condições exatas dependem da norma vigente no momento do pedido e do critério da repartição competente. As suas respostas foram processadas no seu navegador e não foram enviadas a nenhum servidor.",
    downloadPdf: "Baixar em PDF",
    changeAnswers: "Mudar minhas respostas",
    seeAnswers: "Ver as respostas usadas para calcular este resultado",
    urgentTitle: "O seu caso tem prazos correndo agora mesmo",
    urgentBody:
      "Exigências e indeferimentos têm prazos curtos que começam no dia da notificação. Envie o documento o quanto antes e olhamos no mesmo dia.",
    fit: {
      alto: "Encaixe preliminar alto",
      medio: "Encaixe preliminar médio",
      explorar: "Vale explorar",
    },
    summaryOne: "Encontramos uma via que pode encaixar na sua situação.",
    summaryMany: "Encontramos {count} vias possíveis para você.",
    summaryNone:
      "Com o que você nos contou ainda não conseguimos apontar uma via clara. Isso não significa que não exista: significa que o seu caso precisa ser olhado com mais detalhe.",
    summaryUrgent:
      "Você recebeu uma comunicação da Administração. Estes casos têm prazos curtos, por isso os tratamos com prioridade.",
    fallback:
      "Propomos uma consulta com um especialista para revisar o seu caso em detalhe. Se depois de revisar não houver uma via viável, diremos com clareza.",
  },

  app: {
    greeting: "Olá, {name}",
    greetingSub: "É isto que está acontecendo com o seu processo agora.",
    nav: {
      home: "Início",
      case: "Meu processo",
      caseShort: "Processo",
      documents: "Documentos",
      messages: "Mensagens",
      appointments: "Agendamentos",
      payments: "Pagamentos",
      notifications: "Notificações",
      profile: "Perfil",
      signOut: "Sair",
    },
    caseRef: "Processo",
    progress: "Progresso do processo",
    completed: "concluído",
    nextStepLabel: "O que precisamos de você agora",
    uploadDocument: "Enviar documento",
    yourSpecialist: "Seu especialista",
    sendMessage: "Enviar uma mensagem",
    recentActivity: "Atividade recente",
    missingDocuments: "Documentos que faltam",
    manage: "Gerenciar",
    caseData: "Dados do processo",
    reference: "Referência",
    openedOn: "Aberto em",
    status: "Estado",
    docStates: {
      pendiente: "Pendente",
      subido: "Enviado",
      revision: "Em revisão",
      correcto: "Validado",
      cambios: "Precisa de correção",
      caducado: "Vencido",
    },
    docStateHelp: {
      pendiente: "Você ainda não enviou.",
      subido: "Recebemos corretamente.",
      revision: "Seu especialista está revisando.",
      correcto: "Validado por um profissional. Não há nada a fazer.",
      cambios: "Há algo a corrigir. Dizemos exatamente o quê.",
      caducado: "Perdeu a validade e precisa ser renovado.",
    },
    dropzone: {
      title: "Arraste os seus documentos aqui",
      dropNow: "Solte o seu documento aqui",
      hint: "PDF, JPG ou PNG · até 20 MB por arquivo · você também pode tirar uma foto",
      selectFile: "Selecionar arquivo",
      takePhoto: "Tirar uma foto",
      privacy: "Armazenamento privado. Cada arquivo é servido por um link assinado que expira.",
    },
    filters: { all: "Todos", pending: "Pendentes", inReview: "Em revisão", validated: "Validados" },
    chatPlaceholder: "Escreva a sua mensagem…",
    assistantName: "Assistente da Extranjería Segura",
    demoBanner: {
      strong: "Modo demonstração.",
      body: "Os dados deste processo são fictícios e não correspondem a nenhuma pessoa real. A autenticação com Supabase está implementada, mas não ativada neste ambiente.",
      cta: "Criar minha conta real",
    },
  },

  footer: {
    ctaTitle: "Não sabe de qual procedimento precisa?",
    ctaBody:
      "Responda algumas perguntas e diremos quais vias podem encaixar com você, quais documentos são necessários e o que precisaria ser verificado. Sem cadastro e sem custo.",
    ctaButton: "Faça o diagnóstico gratuito",
    tagline:
      "Cuidamos da sua estrangeria do início ao fim. Você sabe a todo momento onde está o seu processo, o que falta e quem está ajudando você.",
    trust: { encrypted: "Dados criptografados", gdpr: "RGPD", traceable: "Processo rastreável" },
    groups: {
      services: "Serviços",
      tramites: "Procedimentos",
      resources: "Recursos",
      company: "Empresa",
      legal: "Jurídico",
    },
    rights: "Todos os direitos reservados.",
    disclaimer:
      "A informação publicada neste site tem caráter orientativo e não constitui assessoria jurídica. Cada processo exige a análise de um profissional.",
    cookiePrefs: "Preferências de cookies",
  },

  auth: {
    signInTitle: "Acesse o seu processo",
    signInSub: "Entre para ver em que ponto está o seu processo e o que falta.",
    signUpTitle: "Crie a sua conta",
    signUpSub: "Abra o seu processo e salve o resultado do seu diagnóstico.",
    name: "Nome",
    email: "E-mail",
    password: "Senha",
    show: "Mostrar",
    hide: "Ocultar",
    forgot: "Esqueci a minha senha",
    signInButton: "Entrar",
    signUpButton: "Criar minha conta",
    noAccount: "Ainda não tem conta?",
    createIt: "Crie aqui",
    haveAccount: "Já tem conta?",
    signInHere: "Entre",
    securityNote:
      "A sua conta dá acesso a documentos de identidade. Use uma senha que não repita em nenhum outro lugar e ative a verificação em duas etapas assim que entrar.",
  },

  errors: {
    notFoundTitle: "Esta página não existe.",
    notFoundBody:
      "Pode ser que o link esteja errado, ou que tenhamos movido o conteúdo. O resto continua aqui: escolha por onde seguir.",
    backHome: "Voltar ao início",
    orStartCategory: "Ou comece por uma categoria",
  },
};
