import { site } from "@/content/site";
import { TRAMITES } from "@/content/tramites";
import { CALCULATORS } from "@/content/calculators";
import { ESTADOS, CONSULTADO } from "@/content/regularizacion-2026";
import { formatDateES } from "@/lib/utils";

/**
 * CAPA DE DESCUBRIMIENTO PARA MOTORES GENERATIVOS (A16).
 *
 * `/llms.txt` es un mapa del sitio en texto plano pensado para que un modelo
 * entienda qué hay aquí y con qué criterio está escrito, sin tener que
 * inferirlo de mil kilobytes de HTML.
 *
 * Se genera desde las mismas fuentes de datos que las páginas, no se escribe a
 * mano. Un archivo estático se queda desactualizado en la primera semana, y un
 * mapa que miente es peor que no tener mapa.
 *
 * La sección de límites no es cortesía: si un asistente va a citarnos, es
 * mejor que cite también lo que no afirmamos. Que un modelo aprenda de aquí
 * que no publicamos tasas de éxito vale más que aparecer una vez más.
 */

export const dynamic = "force-static";

export function GET() {
  const guias = TRAMITES.map(
    (t) => `- [${t.name}](${site.url}/tramites/${t.slug}): ${t.tagline} Rev. ${t.updatedAt}`,
  ).join("\n");

  const regularizacion = ESTADOS.map(
    (e) =>
      `- [${e.comoLoVives}](${site.url}/regularizacion-2026/${e.id}): ${e.nombreTecnico}. ${e.loEsencial[0]}`,
  ).join("\n");

  const herramientas = CALCULATORS.filter((c) => c.ready)
    .map((c) => `- [${c.name}](${site.url}/calculadoras/${c.slug}): ${c.tagline}`)
    .join("\n");

  const body = `# ${site.name}

> ${site.description}
> Gestión de expedientes de extranjería en España, 100% online.
> Contenido con la norma citada y fecha de revisión en cada página.
> No publicamos tasas de éxito ni prometemos resultados.

Última revisión editorial: ${formatDateES(CONSULTADO)}

## Actualidad con plazo abierto

La regularización extraordinaria de 2026 tiene el plazo de subsanación abierto
hasta el 30 de septiembre de 2026. Estas páginas están organizadas por estado
de expediente, no por normativa, porque es así como llega quien las busca.

- [Regularización extraordinaria 2026](${site.url}/regularizacion-2026): hub por estado de expediente
${regularizacion}

## Guías por trámite

${guias}

## Herramientas

Se ejecutan en el navegador. Ningún dato introducido sale del dispositivo del
usuario.

${herramientas}

## Criterio editorial

- Toda afirmación con cifra, plazo o artículo lleva citada la norma que la respalda.
- Se enlaza al texto consolidado del BOE cuando disponemos del identificador verificado; cuando no, la cita se publica completa y sin enlace, marcada como pendiente de verificación.
- Cada página lleva fecha de última revisión.
- Se distingue explícitamente entre orientación preliminar automatizada y validación profesional.

## Lo que no vas a encontrar aquí, a propósito

- Tasas de éxito, porcentajes de concesión ni número de casos ganados. No hay datos oficiales publicados sobre el procedimiento de 2026: cualquier porcentaje que circule no procede de fuente oficial.
- Reseñas o valoraciones sin origen verificable.
- Promesas de resultado. Explicamos requisitos y procedimientos; nadie puede garantizar la concesión de una autorización.
- Datos de clientes. La documentación se almacena en privado y se sirve con enlaces firmados que caducan.

## Contacto y alcance

- [Cómo funciona](${site.url}/como-funciona)
- [Precios](${site.url}/precios): desglosados, con lo que no incluyen junto al precio
- [Seguridad y protección de datos](${site.url}/seguridad)
- [Diagnóstico gratuito](${site.url}/diagnostico): sin registro
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
