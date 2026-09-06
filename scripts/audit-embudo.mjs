import { chromium } from "playwright";

/**
 * Comprueba que la instrumentación del embudo registra de verdad, y —igual de
 * importante— que NO registra ninguna respuesta.
 *
 * Lo segundo es el motivo real de que este script exista. Es muy fácil que
 * alguien añada `detalle: answers[q.id]` para «tener más contexto» y convierta
 * un registro anónimo de recorrido en un historial de la situación
 * administrativa de una persona guardado en su propio navegador.
 */

const BASE = process.env.BASE ?? "http://localhost:3000";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });

await page.goto(`${BASE}/diagnostico`, { waitUntil: "networkidle" });

// Recorrer el cuestionario pulsando siempre la primera opción.
const respuestas = [];
for (let i = 0; i < 12; i++) {
  const opcion = page.locator("[role='radio']").first();
  if ((await opcion.count()) === 0) break;
  respuestas.push((await opcion.innerText()).trim().split("\n")[0]);
  await opcion.click();
  await page.waitForTimeout(430);
  if ((await page.locator("text=Analizando tu situación").count()) > 0) break;
}
await page.waitForTimeout(4200);

const historial = await page.evaluate(() => {
  try {
    return JSON.parse(localStorage.getItem("es.embudo.v1") ?? "[]");
  } catch {
    return [];
  }
});

const eventos = historial.map((r) => r.evento);
const unicos = [...new Set(eventos)];
console.log(`\n  ${historial.length} eventos registrados: ${unicos.join(", ")}`);

const problemas = [];
for (const requerido of ["check:inicio", "check:pregunta", "check:resultado"]) {
  if (!eventos.includes(requerido)) problemas.push(`no se registró ${requerido}`);
}

const preguntas = historial.filter((r) => r.evento === "check:pregunta");
console.log(`  preguntas alcanzadas: ${preguntas.map((p) => p.detalle).join(" → ")}`);

// Ninguna respuesta del usuario puede aparecer en el registro.
const serializado = JSON.stringify(historial).toLowerCase();
for (const r of respuestas) {
  const aguja = r.toLowerCase().slice(0, 14);
  if (aguja.length > 5 && serializado.includes(aguja)) {
    problemas.push(`el registro contiene una respuesta del usuario: «${r}»`);
  }
}

// El detalle solo puede ser el número de pregunta o la rama del resultado.
for (const r of historial) {
  if (r.detalle === undefined) continue;
  const ok =
    typeof r.detalle === "number" || ["urgente", "normal", "explorar"].includes(r.detalle);
  if (!ok) problemas.push(`detalle inesperado en ${r.evento}: ${JSON.stringify(r.detalle)}`);
}

await browser.close();

console.log();
if (problemas.length > 0) {
  problemas.forEach((p) => console.log("PROBLEMA:", p));
  process.exit(1);
}
console.log("Embudo instrumentado y sin ninguna respuesta del usuario en el registro.\n");
