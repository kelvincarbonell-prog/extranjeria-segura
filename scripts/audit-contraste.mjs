import { readFileSync } from "node:fs";

/**
 * AUDITORÍA DE CONTRASTE DE LOS TOKENS DE COLOR.
 *
 * Comprueba la rampa de tinta y los colores de señal contra las tres
 * superficies del sistema. Existe porque el fallo que encontró —ink-400 a
 * 3,23:1 usado como texto en 218 sitios— no se ve mirando la pantalla: se ve
 * calculándolo. Un gris que parece «suficientemente oscuro» en un monitor
 * bueno es ilegible en un móvil de gama media a plena luz, que es exactamente
 * el dispositivo de este público.
 *
 * Los tonos declarados como decorativos se miden contra 3:1 (WCAG 1.4.11,
 * elementos de interfaz), no contra 4,5:1. La condición para estar en esa
 * lista es no usarse nunca para texto, y eso lo comprueba `npm run lint` de
 * forma indirecta: si alguien pone un tamaño de fuente junto a un tono
 * decorativo, esta auditoría no lo detecta, pero la revisión sí. Por eso la
 * lista es corta y explícita.
 *
 *   npm run audit:contraste
 */

const CSS = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

const tokens = Object.fromEntries(
  [...CSS.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]),
);

const FONDOS = {
  canvas: tokens["canvas"],
  "canvas-deep": tokens["canvas-deep"],
  surface: tokens["surface"],
};

/**
 * Tonos que llevan iconos o elementos de interfaz que hay que poder
 * distinguir, pero nunca texto. Mínimo 3:1 (WCAG 1.4.11).
 */
const INTERFAZ = new Set(["ink-300"]);

/**
 * Tonos que solo son relleno: fondos, bordes finos, filetes de degradado y
 * flechas decorativas junto a un enlace que ya tiene texto visible. La 1.4.11
 * excluye expresamente la decoración, así que medirlos aquí solo produciría
 * ruido que enseña a ignorar la auditoría.
 *
 * Meter un token en esta lista es una afirmación: «esto no lleva texto ni
 * información». Si algún día lo lleva, hay que sacarlo de aquí.
 */
const SOLO_RELLENO = new Set([
  "canvas",
  "canvas-deep",
  "surface",
  "ink-200",
  "ink-100",
  "ink-50",
  "signal-ok-soft",
  "signal-warn-soft",
  "signal-risk-soft",
  "signal-idle-soft",
  "brand-50",
  "brand-100",
  "brand-200",
  "brand-300",
  // Solo en el subrayado de una cita y en un filete de degradado.
  "brand-400",
]);

const lin = (c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
const lum = (h) =>
  0.2126 * lin(parseInt(h.slice(1, 3), 16)) +
  0.7152 * lin(parseInt(h.slice(3, 5), 16)) +
  0.0722 * lin(parseInt(h.slice(5, 7), 16));
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let fallos = 0;
const filas = [];

for (const [nombre, valor] of Object.entries(tokens)) {
  if (SOLO_RELLENO.has(nombre)) continue;
  if (!/^(ink|brand|signal)-/.test(nombre)) continue;

  const decorativo = INTERFAZ.has(nombre);
  const minimo = decorativo ? 3.0 : 4.5;

  const peor = Math.min(...Object.values(FONDOS).map((f) => ratio(valor, f)));
  const pasa = peor >= minimo;
  if (!pasa) fallos++;

  filas.push({
    nombre,
    valor,
    peor: peor.toFixed(2),
    minimo: minimo.toFixed(1),
    tipo: decorativo ? "interfaz" : "texto",
    pasa,
  });
}

console.log("\nContraste de los tokens sobre la superficie más exigente del sistema\n");
console.log("  token          color     peor    mín   uso        ");
console.log("  ─────────────────────────────────────────────────");
for (const f of filas) {
  const marca = f.pasa ? "✓" : "✗";
  console.log(
    `  ${marca} ${f.nombre.padEnd(12)} ${f.valor}  ${f.peor.padStart(5)}  ${f.minimo.padStart(4)}   ${f.tipo}`,
  );
}

if (fallos > 0) {
  console.log(`\n${fallos} token(s) por debajo del mínimo. WCAG 2.2 AA exige 4,5:1 para texto`);
  console.log("normal y 3:1 para elementos de interfaz.\n");
  process.exit(1);
}

console.log(`\nLos ${filas.length} tokens cumplen su mínimo.\n`);
