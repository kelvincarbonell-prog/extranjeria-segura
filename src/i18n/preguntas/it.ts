import type { TraduccionPreguntas } from "./tipos";

/**
 * Domande della valutazione — italiano.
 *
 * I termini amministrativi che la persona vedrà scritti così allo sportello
 * — «padrón», «arraigo», «certificado de profesionalidad» — restano in
 * spagnolo con la spiegazione accanto: tradurli la manderebbe a cercare una
 * parola che non compare su nessun modulo.
 */
export const it: TraduccionPreguntas = {
  objetivo: {
    title: "Che cosa vuoi ottenere?",
    help: "Scegli ciò che assomiglia di più alla tua situazione. Potrai modificarlo dopo.",
    rail: "Obiettivo",
    options: {
      vivir: { label: "Vivere in Spagna", hint: "Stabilirmi in modo stabile" },
      trabajar: { label: "Lavorare in Spagna", hint: "Come dipendente o in proprio" },
      nomada: {
        label: "Lavorare da remoto dalla Spagna",
        hint: "Per un'azienda o clienti fuori dalla Spagna",
      },
      estudiar: { label: "Studiare", hint: "Università, master o formazione" },
      familia: {
        label: "Portare o raggiungere la mia famiglia",
        hint: "Ricongiungimento o legame familiare",
      },
      regularizar: {
        label: "Regolarizzare la mia situazione",
        hint: "Vivo già qui e mi servono i documenti",
      },
      renovar: { label: "Rinnovare il mio permesso", hint: "La mia carta scade o è scaduta" },
      nacionalidad: { label: "Ottenere la cittadinanza spagnola" },
      requerimiento: {
        label: "Ho ricevuto una richiesta o un diniego",
        hint: "Devo rispondere",
      },
      no_se: { label: "Non so di cosa ho bisogno", hint: "Aiutami a capirlo" },
    },
  },

  nacionalidad_region: {
    title: "Qual è la tua cittadinanza attuale?",
    help: "La cittadinanza determina quale regime giuridico ti si applica e i tempi.",
    rail: "Cittadinanza",
    options: {
      ue: { label: "Un paese UE, SEE o la Svizzera", hint: "Ti si applica il regime comunitario" },
      iberoamerica: { label: "Un paese ibero-americano", hint: "America Latina inclusa" },
      preferente: { label: "Filippine, Guinea Equatoriale, Portogallo o Andorra" },
      resto: { label: "Un altro paese", hint: "Regime generale per stranieri" },
    },
  },

  ubicacion: {
    title: "Dove ti trovi adesso?",
    rail: "Luogo",
    options: {
      espana: { label: "In Spagna", hint: "Attualmente risiedo o mi trovo qui" },
      fuera: { label: "Fuori dalla Spagna", hint: "Farò domanda dal mio paese" },
    },
  },

  tiempo_espana: {
    title: "Da quanto tempo vivi in Spagna senza interruzioni?",
    help: "Conta dal tuo ultimo ingresso, senza assenze lunghe.",
    rail: "Tempo in Spagna",
    options: {
      menos_6m: { label: "Meno di 6 mesi" },
      "6_12m": { label: "Tra 6 mesi e 1 anno" },
      "12_24m": { label: "Tra 1 e 2 anni" },
      "24_36m": { label: "Tra 2 e 3 anni" },
      mas_36m: { label: "Più di 3 anni" },
    },
  },

  situacion: {
    title: "Qual è la tua situazione amministrativa oggi?",
    help: "Rispondi con sincerità. Serve solo a orientarti meglio ed è riservato.",
    rail: "Situazione",
    options: {
      sin_autorizacion: { label: "Senza permesso di soggiorno" },
      estancia_estudios: { label: "Soggiorno per studio in corso di validità" },
      autorizacion_vigente: { label: "Permesso di soggiorno in corso di validità" },
      autorizacion_caducada: { label: "Permesso scaduto o negato" },
      visado_vigente: { label: "Visto o soggiorno in corso di validità" },
      solicitud_tramite: { label: "Ho una domanda in corso" },
    },
  },

  empadronamiento: {
    title: "Sei iscritto al padrón in Spagna?",
    help: "L'iscrizione al padrón è una delle prove principali di permanenza continuativa.",
    rail: "Padrón",
    options: {
      si_mas_2a: { label: "Sì, da più di 2 anni" },
      si_1_2a: { label: "Sì, da 1 a 2 anni" },
      si_menos_1a: { label: "Sì, da meno di 1 anno" },
      no: { label: "Non sono iscritto" },
      no_se: { label: "Non ne sono sicuro" },
    },
  },

  vinculo_familiar: {
    title: "Hai legami familiari in Spagna?",
    rail: "Famiglia",
    options: {
      conyuge_espanol: { label: "Coniuge o convivente registrato spagnolo" },
      pareja_ue: { label: "Coniuge o convivente di un paese UE" },
      hijo_espanol: { label: "Un figlio o una figlia di cittadinanza spagnola" },
      familiar_residente: { label: "Un familiare diretto con soggiorno regolare" },
      ninguno: { label: "Nessuno dei precedenti" },
    },
  },

  trabajo: {
    title: "Qual è la tua situazione lavorativa?",
    rail: "Lavoro",
    options: {
      contrato_vigente: { label: "Ho un contratto di lavoro in Spagna" },
      oferta_firmada: { label: "Ho un'offerta di lavoro firmata" },
      remoto_extranjero: { label: "Lavoro da remoto per un'azienda fuori dalla Spagna" },
      autonomo_extranjero: { label: "Sono autonomo con clienti fuori dalla Spagna" },
      autonomo_espana: { label: "Voglio lavorare in proprio in Spagna" },
      ninguno: { label: "Al momento non ho lavoro né offerte" },
    },
  },

  formacion: {
    title: "Sei iscritto o stai per iscriverti a un corso?",
    help: "Formazione riconosciuta, certificado de profesionalidad o studi ufficiali.",
    rail: "Formazione",
    options: {
      matriculado: { label: "Sì, sono già iscritto" },
      prevista: { label: "Ho intenzione di iscrivermi" },
      ninguna: { label: "No" },
    },
  },

  anos_residencia_legal: {
    title: "Da quanti anni hai il soggiorno regolare in Spagna?",
    help: "Contano solo i periodi con permesso o carta in corso di validità.",
    rail: "Soggiorno regolare",
    options: {
      menos_1: { label: "Meno di 1 anno" },
      "1_2": { label: "Tra 1 e 2 anni" },
      "2_5": { label: "Tra 2 e 5 anni" },
      "5_10": { label: "Tra 5 e 10 anni" },
      mas_10: { label: "Più di 10 anni" },
    },
  },

  recursos: {
    title: "Puoi dimostrare mezzi economici stabili?",
    help: "Buste paga, risparmi, redditi da locazione, pensioni o fatturato da autonomo.",
    rail: "Mezzi",
    options: {
      si_holgados: { label: "Sì, con margine" },
      si_justos: { label: "Sì, ma al limite" },
      no: { label: "Non in questo momento" },
      no_se: { label: "Non so cosa mi viene richiesto" },
    },
  },

  antecedentes: {
    title: "Hai precedenti penali in qualche paese?",
    help: "Avere precedenti non chiude automaticamente tutte le vie, ma cambia l'analisi.",
    rail: "Precedenti",
    options: {
      ninguno: { label: "No, nessuno" },
      si: { label: "Sì" },
      no_se: { label: "Non ne sono sicuro" },
    },
  },
};
