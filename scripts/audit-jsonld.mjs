/**
 * AUDITORÍA DE DATOS ESTRUCTURADOS
 *
 *   npm run audit:jsonld     (con el servidor levantado)
 *
 * Comprueba tres cosas sobre el HTML realmente servido:
 *
 *  1. Que el JSON-LD es JSON válido. Un bloque mal formado se ignora entero y
 *     en silencio; no hay error en consola ni aviso en ningún sitio.
 *  2. Que cada tipo de página emite la cobertura que le corresponde.
 *  3. Que NO se emite `AggregateRating`, `Review` ni `Rating`. No hay reseñas
 *     verificables, y el marcado de valoraciones inventadas es la penalización
 *     manual más común del sector legal. Esta comprobación existe para que
 *     nadie las añada por comodidad dentro de seis meses.
 */

const BASE = process.env.BASE ?? "http://localhost:3000";

/** Tipos que deben aparecer en cada ruta. */
const ESPERADO = {
  "/": ["Organization", "LegalService", "WebSite", "SearchAction"],
  "/tramites/arraigo-social": ["Service", "HowTo", "FAQPage", "Article", "BreadcrumbList"],
  "/calculadoras/plazos-regularizacion": ["WebApplication", "SoftwareApplication", "BreadcrumbList"],
  "/precios": ["OfferCatalog", "BreadcrumbList"],
  "/regularizacion-2026": ["Article", "BreadcrumbList"],
  "/regularizacion-2026/subsanacion": ["Article", "FAQPage", "BreadcrumbList"],
};

const PROHIBIDOS = new Set(["AggregateRating", "Review", "Rating"]);

const problemas = [];

for (const [ruta, esperados] of Object.entries(ESPERADO)) {
  const html = await fetch(BASE + ruta).then((r) => r.text());
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (m) => m[1],
  );

  if (bloques.length === 0) {
    problemas.push(`${ruta}: sin datos estructurados`);
    continue;
  }

  const tipos = new Set();
  for (const b of bloques) {
    let dato;
    try {
      dato = JSON.parse(b);
    } catch (e) {
      problemas.push(`${ruta}: JSON-LD inválido — ${e.message}`);
      continue;
    }
    const recorrer = (x) => {
      if (Array.isArray(x)) return x.forEach(recorrer);
      if (x && typeof x === "object") {
        const t = x["@type"];
        if (Array.isArray(t)) t.forEach((v) => tipos.add(v));
        else if (t) tipos.add(t);
        Object.values(x).forEach(recorrer);
      }
    };
    recorrer(dato);
  }

  const faltan = esperados.filter((t) => !tipos.has(t));
  if (faltan.length > 0) problemas.push(`${ruta}: faltan ${faltan.join(", ")}`);

  for (const p of PROHIBIDOS) {
    if (tipos.has(p)) {
      problemas.push(`${ruta}: emite ${p}. No debe existir sin reseñas verificables enlazadas.`);
    }
  }

  console.log(`  ${ruta.padEnd(40)} ${[...tipos].sort().join(", ")}`);
}

console.log();
if (problemas.length > 0) {
  problemas.forEach((p) => console.log("PROBLEMA:", p));
  process.exit(1);
}
console.log("Datos estructurados correctos en todas las rutas comprobadas.\n");
