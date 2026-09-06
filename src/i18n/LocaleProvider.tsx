"use client";

import * as React from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/es";

/**
 * Contexto de idioma para los componentes de cliente.
 *
 * El diccionario ya viene resuelto desde el servidor, así que un componente de
 * cliente no descarga ningún JSON de traducciones: recibe por props el objeto
 * que el servidor ya serializó.
 */
interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dir,
  dictionary,
  children,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ locale, dir, t: dictionary }),
    [locale, dir, dictionary],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale debe usarse dentro de <LocaleProvider>.");
  }
  return ctx;
}

/** Construye una ruta en el idioma actual. */
export function useHref() {
  const { locale } = useLocale();
  return React.useCallback(
    (path: string) => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      if (locale === DEFAULT_LOCALE) return clean;
      return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
    },
    [locale],
  );
}

/** Interpola {marcadores} en una cadena del diccionario. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
