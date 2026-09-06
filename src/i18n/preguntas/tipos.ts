import { QUESTIONS, type Question } from "@/content/check-questions";
import type { Locale } from "@/i18n/config";

/**
 * TRADUCCIÓN DEL CUESTIONARIO.
 *
 * Las preguntas viven en `check-questions.ts` como un grafo con condiciones:
 * qué se pregunta depende de lo respondido antes. Ese grafo es lógica y no
 * debe duplicarse por idioma —una condición que se copia siete veces es una
 * condición que va a divergir—, así que aquí solo viajan los textos, indexados
 * por el identificador de la pregunta y el valor de la opción.
 *
 * ─── POR QUÉ ESTA PANTALLA Y NO OTRA ────────────────────────────────────
 *
 * Si solo se pudiera traducir una pantalla del producto, sería esta. Quien no
 * habla español **es** el usuario objetivo: alguien que domina el idioma
 * normalmente ya sabe qué trámite le toca. El cuestionario es lo único que
 * puede orientar a quien no sabe ni cómo se llama lo que necesita.
 *
 * ─── EL RESPALDO ES VISIBLE, NO SILENCIOSO ──────────────────────────────
 *
 * Un idioma sin traducir cae al español, y el texto español se marca como
 * español (`lang="es"`, `dir="ltr"`). No es cosmético: dentro de una página
 * en árabe, una frase española sin marcar se reordena por el algoritmo bidi y
 * los signos de interrogación saltan al otro extremo — «¿Cuál es tu
 * nacionalidad?» se renderizaba «Cuál es tu¿ ?nacionalidad». Marcar el idioma
 * del fragmento lo arregla y además le dice al lector de pantalla que cambie
 * de voz.
 */

export interface OpcionTraducida {
  label: string;
  hint?: string;
}

export interface PreguntaTraducida {
  title: string;
  help?: string;
  rail?: string;
  options: Record<string, OpcionTraducida>;
}

/**
 * El tipo se deriva del grafo real: si mañana se añade una pregunta, a las
 * traducciones les falta una clave y falla la comprobación de tipos. No se
 * puede añadir una pregunta y olvidarse de traducirla sin enterarse.
 */
export type TraduccionPreguntas = Record<(typeof QUESTIONS)[number]["id"], PreguntaTraducida>;

/** Una pregunta ya resuelta, con la marca de idioma de cada texto. */
export interface PreguntaResuelta extends Omit<Question, "options"> {
  /** `true` cuando el texto sigue en español porque no hay traducción. */
  enEspanol: boolean;
  options: (Question["options"][number] & { enEspanol: boolean })[];
}

/**
 * Aplica la traducción sobre el grafo, campo a campo.
 *
 * El respaldo es por campo y no por pregunta: si un idioma traduce el
 * enunciado pero no la ayuda, se muestra el enunciado traducido y la ayuda en
 * español marcada, en lugar de tirar la traducción entera por una cadena que
 * falta.
 */
export function resolverPregunta(
  q: Question,
  trad: Partial<TraduccionPreguntas> | null,
  locale: Locale,
): PreguntaResuelta {
  // Solo el español propiamente dicho queda sin marcar. Un idioma sin
  // traducción sirve texto español, y ese texto hay que marcarlo: es
  // exactamente el caso que rompía el árabe. La primera versión devolvía aquí
  // `enEspanol: false` para los dos casos y dejaba el portugués, el italiano,
  // el ruso y el chino con el español sin marca.
  if (locale === "es") {
    return {
      ...q,
      enEspanol: false,
      options: q.options.map((o) => ({ ...o, enEspanol: false })),
    };
  }

  if (!trad) {
    return {
      ...q,
      enEspanol: true,
      options: q.options.map((o) => ({ ...o, enEspanol: true })),
    };
  }

  const t = trad[q.id as keyof TraduccionPreguntas];

  return {
    ...q,
    title: t?.title ?? q.title,
    help: t?.help ?? q.help,
    rail: t?.rail ?? q.rail,
    enEspanol: !t?.title,
    options: q.options.map((o) => {
      const to = t?.options?.[o.value];
      return {
        ...o,
        label: to?.label ?? o.label,
        hint: to?.hint ?? o.hint,
        enEspanol: !to?.label,
      };
    }),
  };
}
