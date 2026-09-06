import type { Locale } from "@/i18n/config";
import type { TraduccionPreguntas } from "./tipos";
import { en } from "./en";
import { pt } from "./pt";
import { fr } from "./fr";
import { it } from "./it";
import { ar } from "./ar";
import { ru } from "./ru";
import { zh } from "./zh";

export type { TraduccionPreguntas, PreguntaResuelta } from "./tipos";
export { resolverPregunta } from "./tipos";

/**
 * Traducciones del cuestionario.
 *
 * Los ocho idiomas del sitio están aquí. Es la única pantalla del producto que
 * lo está, y es deliberado: el cuestionario es lo primero que ve alguien que no
 * sabe ni cómo se llama el trámite que necesita, y esa persona no habla
 * español por definición. Una ficha jurídica mal entendida se puede releer;
 * una pregunta mal entendida se responde mal y contamina todo lo que viene
 * después.
 *
 * El respaldo al español sigue existiendo en `resolverPregunta` y sigue
 * marcando el idioma del fragmento: no sobra por estar hoy las ocho completas.
 * Añadir una pregunta al grafo rompe la comprobación de tipos —el tipo se
 * deriva de `QUESTIONS`—, pero añadir un idioma a `LOCALES` no rompía nada y
 * habría servido español sin aviso. De eso se ocupa `preguntas.test.ts`.
 *
 * Se importan de forma estática, no dinámica: son doce preguntas de texto por
 * idioma, el peso es despreciable frente a lo que ya carga la página, y una
 * importación dinámica añadiría una espera justo en la pantalla que menos
 * puede permitírsela.
 */
const TRADUCCIONES: Partial<Record<Locale, TraduccionPreguntas>> = {
  en,
  pt,
  fr,
  it,
  ar,
  ru,
  zh,
};

export function traduccionPreguntas(locale: Locale): TraduccionPreguntas | null {
  return TRADUCCIONES[locale] ?? null;
}

/**
 * Idiomas con el cuestionario traducido. Hoy son todos; la comprueba el test,
 * que es donde tiene que fallar si algún día deja de serlo.
 */
export function cuestionarioTraducido(locale: Locale): boolean {
  return locale === "es" || locale in TRADUCCIONES;
}
