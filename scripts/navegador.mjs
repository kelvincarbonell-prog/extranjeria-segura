import { chromium } from "playwright";
import { existsSync } from "node:fs";

/**
 * Lanza Chromium para las auditorías.
 *
 * Hay dos entornos y no coinciden. En el contenedor de desarrollo hay un
 * Chromium preinstalado en `/opt/pw-browsers/chromium`, a veces con un número
 * de build distinto del que espera esta versión de Playwright; ahí hay que
 * apuntar al ejecutable a mano. En CI, `playwright install` lo deja donde
 * Playwright lo busca solo, y forzar una ruta que no existe rompe el job.
 *
 * Por eso `executablePath` se pasa únicamente si el archivo está ahí. Sin
 * esto, cada arreglo de un entorno rompía el otro.
 */
export async function lanzarNavegador() {
  const ruta = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium";
  const opciones = existsSync(ruta) ? { executablePath: ruta } : {};
  return chromium.launch(opciones);
}

/** Espera a que el servidor responda. Sin dependencias añadidas. */
export async function esperarServidor(base, intentos = 60) {
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetch(base, { signal: AbortSignal.timeout(2000) });
      if (r.ok) return;
    } catch {
      /* todavía no está levantado */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`El servidor no respondió en ${base} tras ${intentos} intentos`);
}
