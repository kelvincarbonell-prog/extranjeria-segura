import { LOCALES, type Locale } from "@/i18n/config";

/**
 * RECORDATORIOS DE DOCUMENTACIÓN, EN EL IDIOMA DEL CLIENTE.
 *
 * Perseguir documentos es la tarea más repetitiva de un despacho de
 * extranjería y la que más retrasa expedientes: el escrito está listo y falta
 * un certificado que el cliente no sabe que tenía que pedir.
 *
 * ─── POR QUÉ ESTO ESTÁ AQUÍ Y NO EN LOS DICCIONARIOS DE LA INTERFAZ ─────
 *
 * El diccionario traduce lo que el cliente lee **en la web**. Esto es otra
 * cosa: es un texto que el responsable copia y manda por el canal que use, y
 * que el cliente lee fuera del producto. Mezclarlos habría hecho que cada
 * cambio en el tono de un mensaje tocara el archivo del que depende toda la
 * interfaz.
 *
 * ─── POR QUÉ ESTÁ EN OCHO IDIOMAS ──────────────────────────────────────
 *
 * Es donde el trabajo multilingüe deja de ser decoración. Un despacho español
 * que reclama documentación a un cliente marroquí le escribe en español, el
 * cliente lo entiende a medias, aporta el documento equivocado y se pierden
 * dos semanas. Aquí el responsable escribe una vez y el texto sale en la
 * lengua del cliente, con los nombres de los documentos en español entre
 * paréntesis —que es como aparecen en la lista oficial que le van a pedir—.
 *
 * Ninguna plantilla afirma nada jurídico. Dicen qué falta y para cuándo; no
 * dicen si el expediente saldrá bien, porque eso no lo sabe nadie y menos un
 * mensaje automático.
 */

export interface PlantillaRecordatorio {
  /** Saludo con el nombre del cliente. */
  saludo: (nombre: string) => string;
  /** Por qué le escribimos. */
  intro: (tramite: string) => string;
  /** Encabezado de la lista de documentos. */
  listaTitulo: string;
  /** Cómo se enumera cada documento pendiente. */
  item: (nombre: string, nota?: string) => string;
  /** Aviso de plazo, cuando hay uno corriendo. */
  plazo: (dias: number, fecha: string) => string;
  /** Cómo aportarlos. */
  comoEnviar: string;
  /** Despedida. */
  cierre: string;
  /** Nota de que puede responder en su idioma. */
  idioma: string;
}

export const RECORDATORIOS: Record<Locale, PlantillaRecordatorio> = {
  es: {
    saludo: (n) => `Hola ${n}:`,
    intro: (t) =>
      `Te escribimos por tu expediente de ${t}. Para poder seguir necesitamos que nos hagas llegar la documentación que todavía falta.`,
    listaTitulo: "Lo que falta:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `Hay un plazo que vence el ${f}: quedan ${d} ${d === 1 ? "día" : "días"}. Cuanto antes lo tengamos, más margen tenemos para revisarlo.`,
    comoEnviar:
      "Puedes subirlos desde tu área privada, o hacerles una foto con el móvil si no tienes escáner. Se guardan en privado y solo los ve quien lleva tu expediente.",
    cierre: "Si algo no lo encuentras o no sabes dónde pedirlo, dínoslo y te explicamos cómo.",
    idioma: "",
  },

  en: {
    saludo: (n) => `Hello ${n},`,
    intro: (t) =>
      `We're writing about your ${t} case. To move forward we need you to send us the documents that are still missing.`,
    listaTitulo: "What's missing:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `There is a deadline on ${f}: ${d} ${d === 1 ? "day" : "days"} left. The sooner we have it, the more time we have to review it.`,
    comoEnviar:
      "You can upload them from your private area, or photograph them with your phone if you don't have a scanner. They're stored privately and only the person handling your case can see them.",
    cierre: "If you can't find something, or don't know where to request it, tell us and we'll explain how.",
    idioma: "You can reply in English.",
  },

  pt: {
    saludo: (n) => `Olá ${n},`,
    intro: (t) =>
      `Escrevemos sobre o seu processo de ${t}. Para prosseguir, precisamos que nos envie os documentos que ainda faltam.`,
    listaTitulo: "O que falta:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `Há um prazo que vence em ${f}: faltam ${d} ${d === 1 ? "dia" : "dias"}. Quanto antes tivermos, mais margem temos para revisar.`,
    comoEnviar:
      "Pode enviá-los pela sua área privada, ou tirar uma foto com o celular se não tiver scanner. Ficam guardados em privado e só quem cuida do seu processo os vê.",
    cierre: "Se não encontrar algum, ou não souber onde pedir, diga-nos e explicamos como.",
    idioma: "Pode responder em português.",
  },

  fr: {
    saludo: (n) => `Bonjour ${n},`,
    intro: (t) =>
      `Nous vous écrivons au sujet de votre dossier de ${t}. Pour avancer, nous avons besoin que vous nous transmettiez les documents encore manquants.`,
    listaTitulo: "Ce qui manque :",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `Un délai expire le ${f} : il reste ${d} ${d === 1 ? "jour" : "jours"}. Plus tôt nous l'aurons, plus nous aurons de marge pour l'examiner.`,
    comoEnviar:
      "Vous pouvez les déposer depuis votre espace privé, ou les photographier avec votre téléphone si vous n'avez pas de scanner. Ils sont stockés de façon privée et seule la personne qui suit votre dossier y a accès.",
    cierre:
      "Si vous ne trouvez pas un document, ou ne savez pas où le demander, dites-le nous et nous vous expliquerons.",
    idioma: "Vous pouvez répondre en français.",
  },

  it: {
    saludo: (n) => `Ciao ${n},`,
    intro: (t) =>
      `Ti scriviamo per la tua pratica di ${t}. Per andare avanti abbiamo bisogno che ci mandi i documenti che ancora mancano.`,
    listaTitulo: "Cosa manca:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `C'è un termine che scade il ${f}: mancano ${d} ${d === 1 ? "giorno" : "giorni"}. Prima li abbiamo, più margine abbiamo per controllarli.`,
    comoEnviar:
      "Puoi caricarli dalla tua area privata, o fotografarli con il telefono se non hai uno scanner. Restano archiviati in privato e li vede solo chi segue la tua pratica.",
    cierre: "Se non trovi qualcosa, o non sai dove richiederlo, dillo e ti spieghiamo come.",
    idioma: "Puoi rispondere in italiano.",
  },

  ar: {
    saludo: (n) => `مرحبًا ${n}،`,
    intro: (t) =>
      `نكتب إليك بخصوص ملفك (${t}). لكي نتمكن من المتابعة، نحتاج منك إرسال المستندات الناقصة.`,
    listaTitulo: "المستندات الناقصة:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `هناك مهلة تنتهي في ${f}: بقي ${d} ${d === 1 ? "يوم" : "أيام"}. كلما وصلتنا مبكرًا، اتسع وقتنا لمراجعتها.`,
    comoEnviar:
      "يمكنك رفعها من مساحتك الخاصة، أو تصويرها بهاتفك إن لم يكن لديك ماسح ضوئي. تُحفظ بشكل خاص ولا يطّلع عليها إلا من يتولى ملفك.",
    cierre: "إذا لم تجد مستندًا أو لم تعرف من أين تطلبه، أخبرنا ونشرح لك الطريقة.",
    idioma: "يمكنك الرد بالعربية.",
  },

  ru: {
    saludo: (n) => `Здравствуйте, ${n}!`,
    intro: (t) =>
      `Пишем по вашему делу «${t}». Чтобы двигаться дальше, нам нужно, чтобы вы прислали недостающие документы.`,
    listaTitulo: "Чего не хватает:",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) =>
      `Есть срок, который истекает ${f}: осталось ${d} ${d === 1 ? "день" : "дней"}. Чем раньше документы будут у нас, тем больше времени на проверку.`,
    comoEnviar:
      "Их можно загрузить в личном кабинете или сфотографировать телефоном, если нет сканера. Они хранятся приватно, и их видит только тот, кто ведёт ваше дело.",
    cierre: "Если что-то не находится или непонятно, где это запросить, напишите — объясним.",
    idioma: "Отвечать можно по-русски.",
  },

  zh: {
    saludo: (n) => `${n}，你好：`,
    intro: (t) => `关于你的${t}案件。为了继续办理，需要你把还缺的材料发给我们。`,
    listaTitulo: "还缺的材料：",
    item: (n, nota) => (nota ? `• ${n} — ${nota}` : `• ${n}`),
    plazo: (d, f) => `有一个时限在${f}截止，还剩${d}天。越早收到，我们审核的时间越充裕。`,
    comoEnviar:
      "你可以在个人区域上传，没有扫描仪的话用手机拍照也可以。材料私密存储，只有负责你案件的人能看到。",
    cierre: "如果有材料找不到，或者不知道去哪里申请，告诉我们，我们会说明怎么办。",
    idioma: "你可以用中文回复。",
  },
};

export interface DocumentoPendiente {
  nombre: string;
  nota?: string;
}

export interface DatosRecordatorio {
  cliente: string;
  tramite: string;
  documentos: DocumentoPendiente[];
  /** Plazo vivo, si lo hay. */
  plazo?: { dias: number; fecha: string };
  locale: Locale;
}

/**
 * Compone el mensaje completo.
 *
 * Los nombres de los documentos se dejan en español entre paréntesis cuando el
 * idioma no es el español: es como aparecen en la lista que le van a pedir en
 * la oficina, y traducirlos sin más haría que el cliente buscara un documento
 * cuyo nombre real no reconoce.
 */
export function componerRecordatorio(d: DatosRecordatorio): string {
  const p = RECORDATORIOS[d.locale];
  const partes: string[] = [p.saludo(d.cliente), "", p.intro(d.tramite), "", p.listaTitulo];

  for (const doc of d.documentos) {
    partes.push(p.item(doc.nombre, doc.nota));
  }

  if (d.plazo) {
    partes.push("", p.plazo(d.plazo.dias, d.plazo.fecha));
  }

  partes.push("", p.comoEnviar, "", p.cierre);
  if (p.idioma) partes.push("", p.idioma);

  return partes.join("\n");
}

/** Los idiomas disponibles, para el selector del panel. */
export const IDIOMAS_RECORDATORIO = LOCALES;
