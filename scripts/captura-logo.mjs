import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/**
 * Captura el gesto del isotipo fotograma a fotograma.
 *
 * Existe porque una animación no se revisa leyendo el código: hay que verla.
 * Y porque el fallo típico de un logo animado no es que no funcione, es que
 * funcione mal en un momento concreto —un fotograma en el que la marca no se
 * reconoce— y eso solo se detecta mirando la secuencia.
 */

const BASE = process.env.BASE ?? "http://localhost:3130";
const OUT = process.env.OUT ?? "/tmp/logo";
mkdirSync(OUT, { recursive: true });

// El entorno trae Chromium preinstalado con un número de build distinto al
// que espera esta versión de Playwright. Se apunta al ejecutable real en
// lugar de descargar otro.
const EJECUTABLE = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium";
const browser = await chromium.launch({ executablePath: EJECUTABLE });
const page = await browser.newPage({ viewport: { width: 1100, height: 420 }, deviceScaleFactor: 2 });

// Se monta sobre la home real para heredar fuentes, tokens y CSS del sitio.
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

// 1. Secuencia del gesto en el encabezado, recargando y capturando por tiempos.
const MOMENTOS = [0, 150, 350, 550, 750, 950, 1400];
for (const ms of MOMENTOS) {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("header");
  await page.waitForTimeout(ms);
  const logo = page.locator("header a[aria-label*='inicio']").first();
  await logo.screenshot({ path: `${OUT}/gesto-${String(ms).padStart(4, "0")}ms.png` });
}
console.log("secuencia del encabezado capturada");

// 2. El encabezado completo, ya asentado.
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.locator("header").first().screenshot({ path: `${OUT}/encabezado.png` });

// 3. La cortina de análisis, que es donde el gesto se ve a tamaño grande.
await page.goto(`${BASE}/diagnostico`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
// Recorrer el cuestionario pulsando siempre la primera opción.
for (let i = 0; i < 10; i++) {
  const opcion = page.locator("[role='radio']").first();
  if ((await opcion.count()) === 0) break;
  await opcion.click();
  await page.waitForTimeout(420);
  if ((await page.locator("text=Analizando tu situación").count()) > 0) break;
}
await page.waitForTimeout(300);
if ((await page.locator("text=Analizando tu situación").count()) > 0) {
  await page.screenshot({ path: `${OUT}/cortina.png` });
  console.log("cortina capturada");
} else {
  console.log("no se llegó a la cortina");
}

// 4. Comprobación de movimiento reducido: debe quedar el estado final, no vacío.
const reducida = await browser.newPage({
  viewport: { width: 600, height: 200 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
await reducida.goto(`${BASE}/`, { waitUntil: "networkidle" });
await reducida.waitForTimeout(400);
await reducida.locator("header a[aria-label*='inicio']").first().screenshot({
  path: `${OUT}/movimiento-reducido.png`,
});
console.log("movimiento reducido capturado");

await browser.close();
console.log(`\nCapturas en ${OUT}`);
