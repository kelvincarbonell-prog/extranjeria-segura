import { locales, defaultLocale, type LocaleCode } from "@/content/site";

/**
 * Locale as external state.
 *
 * The chosen locale lives in localStorage and on <html lang>, both of which
 * are outside React. Modelling it as an external store (rather than state
 * restored inside an effect) means the first client render already has the
 * right value, there is no flash of the wrong language, and multiple tabs
 * stay in sync through the `storage` event.
 */

const KEY = "es.locale";
const listeners = new Set<() => void>();

let cache: LocaleCode = defaultLocale;
let cacheValid = false;

function isSupported(code: string): code is LocaleCode {
  return locales.some((l) => l.code === code && l.ready);
}

function read(): LocaleCode {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && isSupported(stored)) return stored;

    // First visit: follow the browser, but only into a locale whose legal
    // content has actually been reviewed. We do not serve machine-translated
    // immigration requirements.
    const nav = navigator.language.slice(0, 2);
    if (isSupported(nav)) return nav;
  } catch {
    /* storage blocked — Spanish stands */
  }
  return defaultLocale;
}

export function subscribeLocale(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cacheValid = false;
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Cached so useSyncExternalStore does not see a new value every render. */
export function getLocaleSnapshot(): LocaleCode {
  if (!cacheValid) {
    cache = read();
    cacheValid = true;
  }
  return cache;
}

/** The server has no storage; it always renders the default locale. */
export function getLocaleServerSnapshot(): LocaleCode {
  return defaultLocale;
}

export function setLocale(code: LocaleCode) {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* storage blocked — the in-memory value still applies for this session */
  }
  cache = code;
  cacheValid = true;

  const meta = locales.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta?.dir ?? "ltr";

  listeners.forEach((l) => l());
}
