import type { Answers } from "@/content/check-questions";

/**
 * Immigration Check answers, persisted for the length of the browser session.
 *
 * Deliberately sessionStorage, not localStorage and not a server: the answers
 * include administrative situation and criminal-record status. They survive an
 * accidental refresh mid-questionnaire and disappear when the tab closes.
 * Nothing is transmitted; the whole evaluation runs in the browser.
 *
 * Exposed as an external store so the wizard can take its initial state from a
 * pure lazy initializer instead of restoring it inside an effect.
 */

const KEY = "es.check.answers";
const listeners = new Set<() => void>();

let cache: Answers = {};
let cacheValid = false;

export function subscribeAnswers(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Cached: useSyncExternalStore requires a stable reference between renders. */
export function getAnswersSnapshot(): Answers {
  if (!cacheValid) {
    try {
      const raw = sessionStorage.getItem(KEY);
      cache = raw ? (JSON.parse(raw) as Answers) : {};
    } catch {
      cache = {};
    }
    cacheValid = true;
  }
  return cache;
}

/** The server has no session storage; it renders the loading gate. */
export function getAnswersServerSnapshot(): null {
  return null;
}

export function saveAnswers(answers: Answers) {
  cache = answers;
  cacheValid = true;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    /* storage blocked — the session still works, it just will not survive a refresh */
  }
}

export function clearAnswers() {
  cache = {};
  cacheValid = true;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
