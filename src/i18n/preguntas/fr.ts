import type { TraduccionPreguntas } from "./tipos";

/**
 * Questions du diagnostic — français.
 *
 * Le corridor francophone vers l'Espagne est surtout maghrébin et ouest-
 * africain : beaucoup de personnes qui ne lisent pas l'espagnol lisent le
 * français couramment. C'est la deuxième traduction la plus utile après
 * l'arabe.
 *
 * Les termes administratifs espagnols que la personne verra écrits tels quels
 * au guichet — « padrón », « arraigo » — restent en espagnol avec leur
 * explication. Les traduire l'enverrait chercher un mot qui ne figure sur
 * aucun formulaire.
 */
export const fr: TraduccionPreguntas = {
  objetivo: {
    title: "Que voulez-vous obtenir ?",
    help: "Choisissez ce qui ressemble le plus à votre situation. Vous pourrez l'ajuster ensuite.",
    rail: "Objectif",
    options: {
      vivir: { label: "Vivre en Espagne", hint: "M'installer durablement" },
      trabajar: { label: "Travailler en Espagne", hint: "Salarié ou indépendant" },
      nomada: {
        label: "Travailler à distance depuis l'Espagne",
        hint: "Pour une entreprise ou des clients à l'étranger",
      },
      estudiar: { label: "Étudier", hint: "Université, master ou formation" },
      familia: {
        label: "Faire venir ma famille ou la rejoindre",
        hint: "Regroupement familial ou lien de famille",
      },
      regularizar: {
        label: "Régulariser ma situation",
        hint: "Je vis déjà ici et j'ai besoin de papiers",
      },
      renovar: { label: "Renouveler mon titre", hint: "Ma carte expire ou a expiré" },
      nacionalidad: { label: "Obtenir la nationalité espagnole" },
      requerimiento: {
        label: "J'ai reçu une demande ou un refus",
        hint: "Je dois répondre",
      },
      no_se: { label: "Je ne sais pas ce qu'il me faut", hint: "Aidez-moi à le découvrir" },
    },
  },

  nacionalidad_region: {
    title: "Quelle est votre nationalité actuelle ?",
    help: "Votre nationalité détermine le régime juridique qui vous est applicable et les délais.",
    rail: "Nationalité",
    options: {
      ue: { label: "Un pays de l'UE, de l'EEE ou la Suisse", hint: "Le régime européen vous est applicable" },
      iberoamerica: { label: "Un pays ibéro-américain", hint: "Amérique latine incluse" },
      preferente: { label: "Philippines, Guinée équatoriale, Portugal ou Andorre" },
      resto: { label: "Un autre pays", hint: "Régime général des étrangers" },
    },
  },

  ubicacion: {
    title: "Où vous trouvez-vous actuellement ?",
    rail: "Lieu",
    options: {
      espana: { label: "En Espagne", hint: "J'y réside ou m'y trouve actuellement" },
      fuera: { label: "Hors d'Espagne", hint: "Je ferai la demande depuis mon pays" },
    },
  },

  tiempo_espana: {
    title: "Depuis combien de temps vivez-vous en Espagne sans interruption ?",
    help: "Comptez depuis votre dernière entrée, sans absences longues.",
    rail: "Durée en Espagne",
    options: {
      menos_6m: { label: "Moins de 6 mois" },
      "6_12m": { label: "Entre 6 mois et 1 an" },
      "12_24m": { label: "Entre 1 et 2 ans" },
      "24_36m": { label: "Entre 2 et 3 ans" },
      mas_36m: { label: "Plus de 3 ans" },
    },
  },

  situacion: {
    title: "Quelle est votre situation administrative aujourd'hui ?",
    help: "Soyez sincère. Cela sert uniquement à mieux vous orienter et reste confidentiel.",
    rail: "Situation",
    options: {
      sin_autorizacion: { label: "Sans titre de séjour" },
      estancia_estudios: { label: "Séjour pour études en cours de validité" },
      autorizacion_vigente: { label: "Titre de séjour en cours de validité" },
      autorizacion_caducada: { label: "Titre expiré ou refusé" },
      visado_vigente: { label: "Visa ou séjour en cours de validité" },
      solicitud_tramite: { label: "J'ai une demande en cours d'instruction" },
    },
  },

  empadronamiento: {
    title: "Êtes-vous inscrit au padrón en Espagne ?",
    help: "L'inscription au padrón est l'une des principales preuves de séjour continu.",
    rail: "Padrón",
    options: {
      si_mas_2a: { label: "Oui, depuis plus de 2 ans" },
      si_1_2a: { label: "Oui, depuis 1 à 2 ans" },
      si_menos_1a: { label: "Oui, depuis moins d'un an" },
      no: { label: "Je ne suis pas inscrit" },
      no_se: { label: "Je ne suis pas sûr" },
    },
  },

  vinculo_familiar: {
    title: "Avez-vous des liens familiaux en Espagne ?",
    rail: "Famille",
    options: {
      conyuge_espanol: { label: "Conjoint ou partenaire enregistré espagnol" },
      pareja_ue: { label: "Conjoint ou partenaire d'un pays de l'UE" },
      hijo_espanol: { label: "Un enfant de nationalité espagnole" },
      familiar_residente: { label: "Un parent direct en séjour régulier" },
      ninguno: { label: "Aucun de ces cas" },
    },
  },

  trabajo: {
    title: "Quelle est votre situation professionnelle ?",
    rail: "Travail",
    options: {
      contrato_vigente: { label: "J'ai un contrat de travail en Espagne" },
      oferta_firmada: { label: "J'ai une promesse d'embauche signée" },
      remoto_extranjero: { label: "Je travaille à distance pour une entreprise hors d'Espagne" },
      autonomo_extranjero: { label: "Je suis indépendant avec des clients hors d'Espagne" },
      autonomo_espana: { label: "Je veux travailler à mon compte en Espagne" },
      ninguno: { label: "Je n'ai ni emploi ni promesse actuellement" },
    },
  },

  formacion: {
    title: "Êtes-vous inscrit, ou sur le point de vous inscrire, à une formation ?",
    help: "Formation diplômante, certificado de profesionalidad ou études officielles.",
    rail: "Formation",
    options: {
      matriculado: { label: "Oui, je suis déjà inscrit" },
      prevista: { label: "J'ai l'intention de m'inscrire" },
      ninguna: { label: "Non" },
    },
  },

  anos_residencia_legal: {
    title: "Combien d'années de séjour régulier avez-vous en Espagne ?",
    help: "Seules comptent les périodes couvertes par un titre ou une carte en cours de validité.",
    rail: "Séjour régulier",
    options: {
      menos_1: { label: "Moins d'un an" },
      "1_2": { label: "Entre 1 et 2 ans" },
      "2_5": { label: "Entre 2 et 5 ans" },
      "5_10": { label: "Entre 5 et 10 ans" },
      mas_10: { label: "Plus de 10 ans" },
    },
  },

  recursos: {
    title: "Pouvez-vous justifier de ressources stables ?",
    help: "Bulletins de salaire, épargne, revenus locatifs, pensions ou facturation d'indépendant.",
    rail: "Ressources",
    options: {
      si_holgados: { label: "Oui, largement" },
      si_justos: { label: "Oui, mais tout juste" },
      no: { label: "Pas pour le moment" },
      no_se: { label: "Je ne sais pas ce qui m'est demandé" },
    },
  },

  antecedentes: {
    title: "Avez-vous un casier judiciaire dans un pays ?",
    help: "Un casier ne ferme pas automatiquement toutes les voies, mais il change l'analyse.",
    rail: "Casier",
    options: {
      ninguno: { label: "Non, aucun" },
      si: { label: "Oui" },
      no_se: { label: "Je ne suis pas sûr" },
    },
  },
};
