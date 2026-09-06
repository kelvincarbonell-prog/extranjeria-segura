import type { Locale } from "@/i18n/config";
import type { TraduccionPreguntas } from "./tipos";
import { en } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";

export type { TraduccionPreguntas, PreguntaResuelta } from "./tipos";
export { resolverPregunta } from "./tipos";

/**
 * Traducciones del cuestionario disponibles hoy.
 *
 * Los tres idiomas traducidos son los tres corredores donde más gente llega
 * sin leer español: inglés como lengua franca, francés por el Magreb y África
 * occidental, y árabe. Los cuatro restantes caen al español, que es correcto
 * mientras se marque como tal —ver la nota de `tipos.ts`— y aparecen aquí
 * en cuanto exista su archivo.
 *
 * Se importan de forma estática, no dinámica: son doce preguntas de texto, el
 * peso es despreciable, y una importación dinámica añadiría una espera en la
 * pantalla que menos puede permitírsela.
 */
const TRADUCCIONES: Partial<Record<Locale, TraduccionPreguntas>> = { en, fr, ar };

export function traduccionPreguntas(locale: Locale): TraduccionPreguntas | null {
  return TRADUCCIONES[locale] ?? null;
}

/** Idiomas con el cuestionario traducido. Se usa para avisar al usuario. */
export function cuestionarioTraducido(locale: Locale): boolean {
  return locale === "es" || locale in TRADUCCIONES;
}
