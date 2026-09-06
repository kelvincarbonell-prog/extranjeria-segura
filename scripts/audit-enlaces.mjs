/**
 * AUDITORÍA DE ENLACES INTERNOS
 *
 *   npm run audit:enlaces     (con el servidor levantado)
 *
 * Comprueba dos cosas que ningún compilador detecta y que nadie nota mirando
 * la pantalla, porque un enlace roto solo se nota si lo pulsas:
 *
 *  1. Que ninguna ruta interna devuelva 404.
 *  2. Que ningún ancla `#seccion` apunte a un id que no existe en su página
 *     de destino. Este es el que motivó el script: la sección de opiniones y
 *     `llms.txt` enlazaban a `/recursos#criterio` y ese id no existía, así que
 *     los dos dejaban al visitante al principio de la página preguntándose
 *     qué había ido a ver. Un ancla rota no da error: da una página correcta
 *     en el sitio equivocado.
 */

import { esperarServidor } from "./navegador.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";

await esperarServidor(BASE);

/** Páginas desde las que se rastrea. Cubren todos los patrones de plantilla. */
const SEMILLAS = [
  "/",
  "/tramites",
  "/tramites/arraigo-social",
  "/tramites/categoria/arraigo",
  "/precios",
  "/recursos",
  "/regularizacion-2026",
  "/regularizacion-2026/subsanacion",
  "/calculadoras",
  "/calculadoras/plazos-regularizacion",
  "/como-funciona",
  "/opiniones",
  "/seguridad",
  "/contacto",
  "/empresa",
  "/citas",
  "/diagnostico",
];

const cache = new Map();
async function pagina(ruta) {
  if (!cache.has(ruta)) {
    const r = await fetch(BASE + ruta);
    cache.set(ruta, { estado: r.status, html: r.ok ? await r.text() : "" });
  }
  return cache.get(ruta);
}

const problemas = [];
const destinos = new Set();

for (const semilla of SEMILLAS) {
  const { estado, html } = await pagina(semilla);
  if (estado !== 200) {
    problemas.push(`${semilla}: responde ${estado}`);
    continue;
  }
  for (const m of html.matchAll(/href="(\/[^"#]*)?(#[^"]*)?"/g)) {
    const ruta = m[1] ?? semilla;
    const ancla = m[2] ?? "";
    if (ruta.startsWith("/_next") || ruta.startsWith("/api")) continue;
    destinos.add(JSON.stringify({ desde: semilla, ruta, ancla }));
  }
}

let comprobados = 0;
for (const bruto of destinos) {
  const { desde, ruta, ancla } = JSON.parse(bruto);
  const { estado, html } = await pagina(ruta);
  comprobados++;

  if (estado !== 200) {
    problemas.push(`${desde} → ${ruta} responde ${estado}`);
    continue;
  }

  if (ancla && ancla !== "#") {
    const id = ancla.slice(1);
    // El id puede estar en cualquier elemento; se busca el atributo tal cual.
    const existe =
      html.includes(`id="${id}"`) || html.includes(`name="${id}"`);
    if (!existe) {
      problemas.push(`${desde} → ${ruta}${ancla}: el id «${id}» no existe en la página de destino`);
    }
  }
}

console.log(`\n  ${comprobados} destinos internos comprobados desde ${SEMILLAS.length} páginas.`);

if (problemas.length > 0) {
  console.log();
  [...new Set(problemas)].forEach((p) => console.log("PROBLEMA:", p));
  console.log();
  process.exit(1);
}

console.log("  Ningún enlace roto y ningún ancla huérfana.\n");
