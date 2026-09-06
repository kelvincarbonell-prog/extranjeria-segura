import type { TraduccionPreguntas } from "./tipos";

/**
 * Perguntas do diagnóstico — português do Brasil.
 *
 * A comunidade lusófona é a maior das não hispanofalantes nos processos de
 * estrangeria em Espanha, e a proximidade entre as duas línguas é justamente
 * o que torna a tradução necessária: o português entende o espanhol pela
 * metade, e nesta tela entender pela metade leva a responder errado.
 *
 * Os termos administrativos que a pessoa verá escritos assim mesmo no guichê
 * — «padrón», «arraigo», «certificado de profesionalidad» — ficam em espanhol
 * com a explicação ao lado.
 */
export const pt: TraduccionPreguntas = {
  objetivo: {
    title: "O que você quer alcançar?",
    help: "Escolha o que mais se parece com a sua situação. Você poderá ajustar depois.",
    rail: "Objetivo",
    options: {
      vivir: { label: "Morar na Espanha", hint: "Me estabelecer de forma estável" },
      trabajar: { label: "Trabalhar na Espanha", hint: "Com carteira ou por conta própria" },
      nomada: {
        label: "Trabalhar remotamente da Espanha",
        hint: "Para uma empresa ou clientes de fora",
      },
      estudiar: { label: "Estudar", hint: "Universidade, mestrado ou curso técnico" },
      familia: {
        label: "Trazer minha família ou me juntar a ela",
        hint: "Reunião familiar ou vínculo familiar",
      },
      regularizar: {
        label: "Regularizar minha situação",
        hint: "Já moro aqui e preciso de documentos",
      },
      renovar: { label: "Renovar minha autorização", hint: "Meu cartão vence ou já venceu" },
      nacionalidad: { label: "Obter a nacionalidade espanhola" },
      requerimiento: {
        label: "Recebi uma exigência ou um indeferimento",
        hint: "Preciso responder",
      },
      no_se: { label: "Não sei do que preciso", hint: "Me ajude a descobrir" },
    },
  },

  nacionalidad_region: {
    title: "Qual é a sua nacionalidade atual?",
    help: "Sua nacionalidade determina qual regime jurídico se aplica a você e os prazos.",
    rail: "Nacionalidade",
    options: {
      ue: { label: "Um país da UE, EEE ou Suíça", hint: "Aplica-se o regime comunitário" },
      iberoamerica: { label: "Um país ibero-americano", hint: "Inclui a América Latina" },
      preferente: { label: "Filipinas, Guiné Equatorial, Portugal ou Andorra" },
      resto: { label: "Outro país", hint: "Regime geral de estrangeria" },
    },
  },

  ubicacion: {
    title: "Onde você está agora?",
    rail: "Local",
    options: {
      espana: { label: "Na Espanha", hint: "Moro ou estou aqui atualmente" },
      fuera: { label: "Fora da Espanha", hint: "Vou solicitar do meu país" },
    },
  },

  tiempo_espana: {
    title: "Há quanto tempo você mora na Espanha sem interrupção?",
    help: "Conte a partir da sua última entrada, sem ausências longas.",
    rail: "Tempo na Espanha",
    options: {
      menos_6m: { label: "Menos de 6 meses" },
      "6_12m": { label: "Entre 6 meses e 1 ano" },
      "12_24m": { label: "Entre 1 e 2 anos" },
      "24_36m": { label: "Entre 2 e 3 anos" },
      mas_36m: { label: "Mais de 3 anos" },
    },
  },

  situacion: {
    title: "Qual é a sua situação administrativa hoje?",
    help: "Seja sincero. Isso serve apenas para orientar melhor e é confidencial.",
    rail: "Situação",
    options: {
      sin_autorizacion: { label: "Sem autorização de residência" },
      estancia_estudios: { label: "Estadia por estudos válida" },
      autorizacion_vigente: { label: "Autorização de residência válida" },
      autorizacion_caducada: { label: "Autorização vencida ou indeferida" },
      visado_vigente: { label: "Visto ou estadia válida" },
      solicitud_tramite: { label: "Tenho um pedido em análise" },
    },
  },

  empadronamiento: {
    title: "Você está registrado no padrón na Espanha?",
    help: "O registro no padrón é uma das principais provas de permanência contínua.",
    rail: "Padrón",
    options: {
      si_mas_2a: { label: "Sim, há mais de 2 anos" },
      si_1_2a: { label: "Sim, entre 1 e 2 anos" },
      si_menos_1a: { label: "Sim, há menos de 1 ano" },
      no: { label: "Não estou registrado" },
      no_se: { label: "Não tenho certeza" },
    },
  },

  vinculo_familiar: {
    title: "Você tem algum vínculo familiar na Espanha?",
    rail: "Família",
    options: {
      conyuge_espanol: { label: "Cônjuge ou companheiro registrado espanhol" },
      pareja_ue: { label: "Cônjuge ou companheiro de um país da UE" },
      hijo_espanol: { label: "Filho ou filha de nacionalidade espanhola" },
      familiar_residente: { label: "Parente direto com residência legal" },
      ninguno: { label: "Nenhum dos anteriores" },
    },
  },

  trabajo: {
    title: "Qual é a sua situação de trabalho?",
    rail: "Trabalho",
    options: {
      contrato_vigente: { label: "Tenho contrato de trabalho na Espanha" },
      oferta_firmada: { label: "Tenho uma proposta de emprego assinada" },
      remoto_extranjero: { label: "Trabalho remotamente para empresa de fora da Espanha" },
      autonomo_extranjero: { label: "Sou autônomo com clientes fora da Espanha" },
      autonomo_espana: { label: "Quero trabalhar por conta própria na Espanha" },
      ninguno: { label: "Não tenho emprego nem proposta no momento" },
    },
  },

  formacion: {
    title: "Você está matriculado ou vai se matricular em um curso?",
    help: "Formação regular, certificado de profesionalidad ou estudos oficiais.",
    rail: "Formação",
    options: {
      matriculado: { label: "Sim, já estou matriculado" },
      prevista: { label: "Pretendo me matricular" },
      ninguna: { label: "Não" },
    },
  },

  anos_residencia_legal: {
    title: "Quantos anos de residência legal você tem na Espanha?",
    help: "Contam apenas os períodos com autorização ou cartão válidos.",
    rail: "Residência legal",
    options: {
      menos_1: { label: "Menos de 1 ano" },
      "1_2": { label: "Entre 1 e 2 anos" },
      "2_5": { label: "Entre 2 e 5 anos" },
      "5_10": { label: "Entre 5 e 10 anos" },
      mas_10: { label: "Mais de 10 anos" },
    },
  },

  recursos: {
    title: "Você consegue comprovar meios econômicos estáveis?",
    help: "Holerites, poupança, aluguéis, aposentadoria ou faturamento como autônomo.",
    rail: "Recursos",
    options: {
      si_holgados: { label: "Sim, com folga" },
      si_justos: { label: "Sim, mas no limite" },
      no: { label: "Não neste momento" },
      no_se: { label: "Não sei o que me é exigido" },
    },
  },

  antecedentes: {
    title: "Você tem antecedentes criminais em algum país?",
    help: "Ter antecedentes não fecha automaticamente todas as vias, mas muda a análise.",
    rail: "Antecedentes",
    options: {
      ninguno: { label: "Não, nenhum" },
      si: { label: "Sim" },
      no_se: { label: "Não tenho certeza" },
    },
  },
};
