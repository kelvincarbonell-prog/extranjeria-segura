import type { TraduccionPreguntas } from "./tipos";

/**
 * Immigration Check questions — English.
 *
 * Spanish legal categories keep their Spanish name where there is no English
 * equivalent: "arraigo" is a category in the Reglamento de Extranjería, not a
 * concept with an English translation. Inventing one would send the user
 * looking for something that does not exist on any official form.
 */
export const en: TraduccionPreguntas = {
  objetivo: {
    title: "What do you want to achieve?",
    help: "Pick whatever is closest to your situation. You can change it later.",
    rail: "Goal",
    options: {
      vivir: { label: "Live in Spain", hint: "Settle here for good" },
      trabajar: { label: "Work in Spain", hint: "Employed or self-employed" },
      nomada: { label: "Work remotely from Spain", hint: "For a company or clients abroad" },
      estudiar: { label: "Study", hint: "University, master's or vocational training" },
      familia: { label: "Bring or join my family", hint: "Family reunification or a family tie" },
      regularizar: { label: "Regularise my status", hint: "I already live here and need papers" },
      renovar: { label: "Renew my permit", hint: "My card is expiring or has expired" },
      nacionalidad: { label: "Get Spanish citizenship" },
      requerimiento: {
        label: "I've received a request or a refusal",
        hint: "I need to respond",
      },
      no_se: { label: "I don't know what I need", hint: "Help me work it out" },
    },
  },

  nacionalidad_region: {
    title: "What is your current nationality?",
    help: "Your nationality determines which legal regime applies to you, and the timescales.",
    rail: "Nationality",
    options: {
      ue: { label: "An EU, EEA or Swiss country", hint: "The EU regime applies to you" },
      iberoamerica: { label: "An Ibero-American country", hint: "Includes Latin America" },
      preferente: { label: "Philippines, Equatorial Guinea, Portugal or Andorra" },
      resto: { label: "Another country", hint: "General immigration regime" },
    },
  },

  ubicacion: {
    title: "Where are you right now?",
    rail: "Location",
    options: {
      espana: { label: "In Spain", hint: "I currently live or am here" },
      fuera: { label: "Outside Spain", hint: "I'll be applying from my own country" },
    },
  },

  tiempo_espana: {
    title: "How long have you been living in Spain without a break?",
    help: "Count from your last entry, without long absences.",
    rail: "Time in Spain",
    options: {
      menos_6m: { label: "Less than 6 months" },
      "6_12m": { label: "Between 6 months and 1 year" },
      "12_24m": { label: "Between 1 and 2 years" },
      "24_36m": { label: "Between 2 and 3 years" },
      mas_36m: { label: "More than 3 years" },
    },
  },

  situacion: {
    title: "What is your administrative status today?",
    help: "Be honest. This is only used to guide you better, and it stays confidential.",
    rail: "Status",
    options: {
      sin_autorizacion: { label: "No residence permit" },
      estancia_estudios: { label: "Valid student stay" },
      autorizacion_vigente: { label: "Valid residence permit" },
      autorizacion_caducada: { label: "Expired or refused permit" },
      visado_vigente: { label: "Valid visa or stay" },
      solicitud_tramite: { label: "I have an application in progress" },
    },
  },

  empadronamiento: {
    title: "Are you registered on the padrón in Spain?",
    help: "The padrón registration is one of the main ways of proving continuous residence.",
    rail: "Padrón",
    options: {
      si_mas_2a: { label: "Yes, for more than 2 years" },
      si_1_2a: { label: "Yes, for between 1 and 2 years" },
      si_menos_1a: { label: "Yes, for less than 1 year" },
      no: { label: "I'm not registered" },
      no_se: { label: "I'm not sure" },
    },
  },

  vinculo_familiar: {
    title: "Do you have family ties in Spain?",
    rail: "Family",
    options: {
      conyuge_espanol: { label: "Spanish spouse or registered partner" },
      pareja_ue: { label: "Spouse or partner from an EU country" },
      hijo_espanol: { label: "A child with Spanish nationality" },
      familiar_residente: { label: "A direct relative with legal residence" },
      ninguno: { label: "None of the above" },
    },
  },

  trabajo: {
    title: "What is your work situation?",
    rail: "Work",
    options: {
      contrato_vigente: { label: "I have an employment contract in Spain" },
      oferta_firmada: { label: "I have a signed job offer" },
      remoto_extranjero: { label: "I work remotely for a company outside Spain" },
      autonomo_extranjero: { label: "I'm self-employed with clients outside Spain" },
      autonomo_espana: { label: "I want to be self-employed in Spain" },
      ninguno: { label: "I have no job or offer right now" },
    },
  },

  formacion: {
    title: "Are you enrolled, or about to enrol, in a course?",
    help: "Formal education, a certificado de profesionalidad or official studies.",
    rail: "Training",
    options: {
      matriculado: { label: "Yes, I'm already enrolled" },
      prevista: { label: "I'm planning to enrol" },
      ninguna: { label: "No" },
    },
  },

  anos_residencia_legal: {
    title: "How many years of legal residence do you have in Spain?",
    help: "Only periods with a valid permit or card count.",
    rail: "Legal residence",
    options: {
      menos_1: { label: "Less than 1 year" },
      "1_2": { label: "Between 1 and 2 years" },
      "2_5": { label: "Between 2 and 5 years" },
      "5_10": { label: "Between 5 and 10 years" },
      mas_10: { label: "More than 10 years" },
    },
  },

  recursos: {
    title: "Can you prove stable financial means?",
    help: "Payslips, savings, rental income, pensions or self-employed invoicing.",
    rail: "Means",
    options: {
      si_holgados: { label: "Yes, comfortably" },
      si_justos: { label: "Yes, but only just" },
      no: { label: "Not at the moment" },
      no_se: { label: "I don't know what's required of me" },
    },
  },

  antecedentes: {
    title: "Do you have a criminal record in any country?",
    help: "Having a record doesn't automatically close every route, but it changes the analysis.",
    rail: "Record",
    options: {
      ninguno: { label: "No, none" },
      si: { label: "Yes" },
      no_se: { label: "I'm not sure" },
    },
  },
};
