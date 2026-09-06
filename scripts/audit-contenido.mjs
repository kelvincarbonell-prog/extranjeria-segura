/**
 * AUDITORÍA DE LOS BLOQUES «LO ESENCIAL»
 *
 *   npm run audit:contenido     (con el servidor levantado)
 *
 * Comprueba la única regla del bloque, que es también la razón de que exista:
 *
 *   Cada punto debe poder leerse fuera de contexto y contener al menos una
 *   cifra o una referencia normativa. Si no tiene ni número ni artículo, no es
 *   esencial: es relleno, y está compitiendo por la atención con los puntos
 *   que sí lo son.
 *
 * La regla es fácil de enunciar en un comentario y fácil de incumplir seis
 * meses después, cuando alguien añade «tramitamos tu expediente con la máxima
 * diligencia» a un bloque. Esto la hace comprobable.
 *
 * También verifica que el bloque existe donde debe: las fichas y las guías son
 * las páginas que reciben el tráfico de búsqueda, y son justo donde un bloque
 * de respuesta directa cambia si te citan o no.
 */

import { esperarServidor } from "./navegador.mjs";

const BASE = process.env.BASE ?? "http://localhost:3000";

await esperarServidor(BASE);

/** Páginas que deben llevar bloque de respuesta directa. */
const RUTAS = [
  "/regularizacion-2026",
  "/regularizacion-2026/subsanacion",
  "/regularizacion-2026/silencio-administrativo",
  "/regularizacion-2026/denegacion",
  "/tramites/arraigo-social",
  "/tramites/arraigo-sociolaboral",
  "/tramites/nacionalidad-por-residencia",
  "/tramites/teletrabajo-internacional",
];

// La regla de «tiene dato» se importa del código de la aplicación en lugar de
// reimplementarse aquí. Estuvieron duplicadas exactamente un rato, y el
// desacuerdo apareció de inmediato: el generador descartaba «el plazo legal es
// de un año» por no llevar dígito mientras la auditoría lo daba por bueno.
import { tieneDato } from "../src/lib/dato.ts";

const problemas = [];
let puntosTotales = 0;
let puntosConDato = 0;

for (const ruta of RUTAS) {
  const respuesta = await fetch(BASE + ruta);
  if (!respuesta.ok) {
    problemas.push(`${ruta}: responde ${respuesta.status}`);
    continue;
  }
  const html = await respuesta.text();

  // El bloque es un <aside aria-label="Lo esencial…"> con una lista dentro.
  const bloque = html.match(
    /<aside[^>]*aria-label="Lo esencial[^"]*"[^>]*>([\s\S]*?)<\/aside>/,
  );
  if (!bloque) {
    problemas.push(`${ruta}: no lleva bloque «Lo esencial»`);
    continue;
  }

  const puntos = [...bloque[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;|&#\d+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  if (puntos.length < 4 || puntos.length > 6) {
    problemas.push(`${ruta}: ${puntos.length} puntos (la regla es entre 4 y 6)`);
  }

  const sinDato = [];
  for (const p of puntos) {
    puntosTotales++;
    if (tieneDato(p)) {
      puntosConDato++;
    } else {
      sinDato.push(p);
    }
  }

  for (const p of sinDato) {
    problemas.push(`${ruta}: punto sin cifra ni norma — «${p.slice(0, 80)}…»`);
  }

  console.log(`  ${ruta.padEnd(46)} ${puntos.length} puntos, ${puntos.length - sinDato.length} con dato`);
}

console.log(`\n  ${puntosConDato}/${puntosTotales} puntos llevan cifra o referencia normativa.`);

if (problemas.length > 0) {
  console.log();
  problemas.forEach((p) => console.log("PROBLEMA:", p));
  console.log(
    "\nLa regla del bloque: cada punto se lee fuera de contexto y lleva un número o un artículo.\n",
  );
  process.exit(1);
}

console.log("\nTodos los bloques cumplen la regla.\n");
