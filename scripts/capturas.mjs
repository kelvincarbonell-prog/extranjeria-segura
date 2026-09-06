import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/** Capturas de revisión. Escritorio y móvil, sobre el build de producción. */

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "/tmp/capturas";
mkdirSync(OUT, { recursive: true });

const RUTAS = [
  ["/", "home"],
  ["/regularizacion-2026", "hub"],
  ["/regularizacion-2026/subsanacion", "subsanacion"],
  ["/calculadoras/plazos-regularizacion", "calculadora"],
  ["/tramites/arraigo-social", "ficha"],
  ["/opiniones", "opiniones"],
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium",
});

const escritorio = await browser.newPage({
  viewport: { width: 1360, height: 900 },
  deviceScaleFactor: 2,
});
for (const [ruta, nombre] of RUTAS) {
  await escritorio.goto(BASE + ruta, { waitUntil: "networkidle" });
  await escritorio.waitForTimeout(1400);
  await escritorio.screenshot({ path: `${OUT}/${nombre}.png` });
  console.log("escritorio:", nombre);
}

const movil = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await movil.goto(`${BASE}/regularizacion-2026/subsanacion`, { waitUntil: "networkidle" });
await movil.waitForTimeout(900);
await movil.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
await movil.waitForTimeout(1000);
await movil.screenshot({ path: `${OUT}/movil-barra.png` });
console.log("móvil: barra de acción");

await browser.close();
console.log(`\nCapturas en ${OUT}`);
