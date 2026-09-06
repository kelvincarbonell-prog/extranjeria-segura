import "server-only";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/es";

/**
 * Carga del diccionario.
 *
 * Import dinámico por idioma: el bundle de una página en árabe no arrastra las
 * traducciones al chino. `server-only` impide que este módulo acabe por error
 * en el cliente arrastrando los ocho.
 */
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  es: () => import("./dictionaries/es").then((m) => ({ default: m.es })),
  en: () => import("./dictionaries/en").then((m) => ({ default: m.en })),
  pt: () => import("./dictionaries/pt").then((m) => ({ default: m.pt })),
  fr: () => import("./dictionaries/fr").then((m) => ({ default: m.fr })),
  it: () => import("./dictionaries/it").then((m) => ({ default: m.it })),
  ar: () => import("./dictionaries/ar").then((m) => ({ default: m.ar })),
  ru: () => import("./dictionaries/ru").then((m) => ({ default: m.ru })),
  zh: () => import("./dictionaries/zh").then((m) => ({ default: m.zh })),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const mod = await loaders[key]();
  return mod.default;
}

export type { Dictionary };
