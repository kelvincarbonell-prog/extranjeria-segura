import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * robots.txt
 *
 * Los rastreadores de IA están explícitamente permitidos, y es una decisión,
 * no un descuido. Muchas plantillas de framework los bloquean por defecto, y
 * en esta vertical la citación en asistentes ya mueve volumen real: alguien
 * que pregunta «cuánto tengo para recurrir una denegación» a un asistente
 * recibe una respuesta, y esa respuesta sale de algún sitio.
 *
 * Que salga de aquí nos conviene por una razón que va más allá del tráfico:
 * nuestro contenido cita la norma, lleva fecha y no promete resultados. Si un
 * asistente va a contestar esa pregunta de todas formas, es mejor que la
 * conteste con esto que con una página que se inventa un porcentaje de éxito.
 *
 * Se listan uno a uno en lugar de confiar en el comodín porque un `Allow`
 * nominal sobrevive a que alguien añada un `Disallow: /` genérico más
 * adelante, y porque deja constancia de que la decisión se tomó.
 */

const RASTREADORES_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
];

/** No son páginas públicas: expedientes, panel interno y API. */
const PRIVADO = ["/app/", "/admin/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVADO },
      ...RASTREADORES_IA.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVADO,
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
