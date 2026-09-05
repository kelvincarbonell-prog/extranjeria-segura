import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.claim}`,
    short_name: site.name,
    description: site.description,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAFB",
    theme_color: "#05070D",
    lang: "es",
    dir: "ltr",
    categories: ["business", "productivity", "government"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Mi expediente", url: "/app/expediente" },
      { name: "Subir documento", url: "/app/documentos" },
      { name: "Mensajes", url: "/app/mensajes" },
    ],
  };
}
