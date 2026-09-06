import type { TraduccionPreguntas } from "./tipos";

/**
 * 诊断问卷 —— 简体中文。
 *
 * 中文与西班牙语之间没有任何可以「猜」出来的共同词根。对讲葡萄牙语或意大利语
 * 的人来说，未翻译的西班牙语至少还能读懂一半；对中文读者来说是零。这一页如果
 * 不翻译，等于不存在。
 *
 * 办事窗口上原样写着的西班牙语行政术语 ——「padrón」「arraigo」
 * 「certificado de profesionalidad」—— 保留原文并在旁边解释：翻译成中文会让
 * 人去找一个任何表格上都不存在的词。
 */
export const zh: TraduccionPreguntas = {
  objetivo: {
    title: "您想办成什么？",
    help: "选择与您情况最接近的一项。之后可以修改。",
    rail: "目标",
    options: {
      vivir: { label: "在西班牙居住", hint: "长期定居" },
      trabajar: { label: "在西班牙工作", hint: "受雇或自雇" },
      nomada: {
        label: "在西班牙远程工作",
        hint: "为西班牙境外的公司或客户工作",
      },
      estudiar: { label: "学习", hint: "大学、硕士或职业培训" },
      familia: {
        label: "接家人过来或与家人团聚",
        hint: "家庭团聚或家庭关系",
      },
      regularizar: {
        label: "让我的身份合法化",
        hint: "我已经住在这里，需要办证件",
      },
      renovar: { label: "续签我的许可", hint: "我的居留卡即将到期或已过期" },
      nacionalidad: { label: "取得西班牙国籍" },
      requerimiento: {
        label: "我收到了补件通知或驳回决定",
        hint: "我需要答复",
      },
      no_se: { label: "我不知道自己需要办什么", hint: "请帮我判断" },
    },
  },

  nacionalidad_region: {
    title: "您目前是哪国国籍？",
    help: "国籍决定适用哪一套法律制度以及办理时限。",
    rail: "国籍",
    options: {
      ue: { label: "欧盟、欧洲经济区国家或瑞士", hint: "适用欧盟制度" },
      iberoamerica: { label: "伊比利亚美洲国家", hint: "包括拉丁美洲" },
      preferente: { label: "菲律宾、赤道几内亚、葡萄牙或安道尔" },
      resto: { label: "其他国家", hint: "适用外国人一般制度" },
    },
  },

  ubicacion: {
    title: "您现在人在哪里？",
    rail: "所在地",
    options: {
      espana: { label: "在西班牙", hint: "我目前住在或人在这里" },
      fuera: { label: "在西班牙境外", hint: "我将从本国提出申请" },
    },
  },

  tiempo_espana: {
    title: "您在西班牙连续居住多久了？",
    help: "从最后一次入境算起，中间没有长时间离境。",
    rail: "在西时长",
    options: {
      menos_6m: { label: "不满 6 个月" },
      "6_12m": { label: "6 个月到 1 年" },
      "12_24m": { label: "1 到 2 年" },
      "24_36m": { label: "2 到 3 年" },
      mas_36m: { label: "超过 3 年" },
    },
  },

  situacion: {
    title: "您目前的身份状态是？",
    help: "请如实回答。这只用于更准确地为您指路，内容保密。",
    rail: "身份状态",
    options: {
      sin_autorizacion: { label: "没有居留许可" },
      estancia_estudios: { label: "学生居留在有效期内" },
      autorizacion_vigente: { label: "居留许可在有效期内" },
      autorizacion_caducada: { label: "许可已过期或被驳回" },
      visado_vigente: { label: "签证或停留期在有效期内" },
      solicitud_tramite: { label: "我有一份申请正在审理中" },
    },
  },

  empadronamiento: {
    title: "您在西班牙办了 padrón 登记吗？",
    help: "padrón（市政居住登记）是证明连续居住的主要材料之一。",
    rail: "Padrón",
    options: {
      si_mas_2a: { label: "有，超过 2 年" },
      si_1_2a: { label: "有，1 到 2 年" },
      si_menos_1a: { label: "有，不满 1 年" },
      no: { label: "没有登记" },
      no_se: { label: "我不确定" },
    },
  },

  vinculo_familiar: {
    title: "您在西班牙有家庭关系吗？",
    rail: "家庭",
    options: {
      conyuge_espanol: { label: "配偶或已登记同居伴侣是西班牙人" },
      pareja_ue: { label: "配偶或伴侣是欧盟国家国民" },
      hijo_espanol: { label: "有一个西班牙国籍的子女" },
      familiar_residente: { label: "有合法居留的直系亲属" },
      ninguno: { label: "以上都没有" },
    },
  },

  trabajo: {
    title: "您的工作情况是？",
    rail: "工作",
    options: {
      contrato_vigente: { label: "我在西班牙有劳动合同" },
      oferta_firmada: { label: "我有一份已签署的录用书" },
      remoto_extranjero: { label: "我为西班牙境外的公司远程工作" },
      autonomo_extranjero: { label: "我是自雇，客户在西班牙境外" },
      autonomo_espana: { label: "我想在西班牙自雇经营" },
      ninguno: { label: "目前既没有工作也没有录用书" },
    },
  },

  formacion: {
    title: "您已经报名或打算报名参加培训吗？",
    help: "正规培训、certificado de profesionalidad（职业资格证书）或官方学历课程。",
    rail: "培训",
    options: {
      matriculado: { label: "是，已经报名" },
      prevista: { label: "打算报名" },
      ninguna: { label: "否" },
    },
  },

  anos_residencia_legal: {
    title: "您在西班牙合法居留了几年？",
    help: "只计算持有有效许可或居留卡的期间。",
    rail: "合法居留",
    options: {
      menos_1: { label: "不满 1 年" },
      "1_2": { label: "1 到 2 年" },
      "2_5": { label: "2 到 5 年" },
      "5_10": { label: "5 到 10 年" },
      mas_10: { label: "超过 10 年" },
    },
  },

  recursos: {
    title: "您能证明有稳定的经济来源吗？",
    help: "工资单、存款、房租收入、退休金或自雇营业收入。",
    rail: "经济来源",
    options: {
      si_holgados: { label: "能，而且有余裕" },
      si_justos: { label: "能，但很勉强" },
      no: { label: "目前不能" },
      no_se: { label: "我不知道对我的要求是什么" },
    },
  },

  antecedentes: {
    title: "您在任何国家有犯罪记录吗？",
    help: "有记录并不会自动堵死所有途径，但会改变分析方式。",
    rail: "犯罪记录",
    options: {
      ninguno: { label: "没有" },
      si: { label: "有" },
      no_se: { label: "我不确定" },
    },
  },
};
