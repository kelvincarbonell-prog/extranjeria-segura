import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Manrope, JetBrains_Mono, Noto_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import { site } from "@/content/site";
import { LOCALES, LOCALE_META, isLocale, href, alternatesFor } from "@/i18n/config";
import { getDictionary } from "@/i18n/get";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import "../globals.css";

/**
 * LAYOUT RAÍZ.
 *
 * Vive dentro de `[locale]` y no en `src/app/`, a propósito. `<html lang>` y
 * `<html dir>` dependen del idioma, y el idioma es un segmento de ruta: si el
 * layout raíz estuviera fuera, tendría que leerlo de una cabecera, y leer
 * cabeceras convierte TODAS las páginas del sitio en dinámicas. Medido: con el
 * layout fuera, las 1.374 páginas se renderizaban en cada petición; aquí se
 * prerenderizan en el build. En un público que navega desde móvil de gama
 * media, esa diferencia es el LCP entero.
 *
 * Los archivos de metadatos (`robots.ts`, `sitemap.ts`, `manifest.ts`, los
 * iconos) siguen en `src/app/`: no son páginas y no necesitan layout.
 */

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
  weight: ["400", "500", "600"],
});

/**
 * Inter y Manrope no dibujan árabe ni chino: sin estas dos familias, esos
 * idiomas caerían en la fuente del sistema y romperían la identidad visual —o
 * peor, mostrarían tofu. Se cargan siempre como último recurso de la pila de
 * fuentes; el navegador solo descarga los glifos que necesita.
 */
const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

const chinese = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-chinese",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#05070D" },
  ],
};

/**
 * `hreflang` por idioma.
 *
 * Sin esto, ocho traducciones de la misma página compiten entre sí en el
 * índice en lugar de reforzarse. `x-default` apunta al español, que es la
 * versión de referencia del contenido jurídico.
 *
 * Solo se declaran como alternativa los idiomas con contenido revisado
 * (`CONTENT_LOCALES`). Anunciar `hreflang="ru"` sobre una página cuyo cuerpo
 * sigue en español es prometerle al rastreador algo que no va a encontrar.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.claim}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    alternates: {
      canonical: href("/", locale),
      languages: alternatesFor("/", site.url),
    },
    openGraph: {
      type: "website",
      url: `${site.url}${href("/", locale)}`,
      siteName: site.name,
      title: `${site.name} — ${site.claim}`,
      description: site.description,
      locale: LOCALE_META[locale].bcp47.replace("-", "_"),
    },
    twitter: { card: "summary_large_image", title: site.name, description: site.description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    appleWebApp: { capable: true, title: site.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  const meta = LOCALE_META[locale];

  return (
    <html
      lang={meta.bcp47}
      dir={meta.dir}
      className={`${inter.variable} ${manrope.variable} ${mono.variable} ${arabic.variable} ${chinese.variable}`}
    >
      <body>
        <LocaleProvider locale={locale} dir={meta.dir} dictionary={dictionary}>
          <a
            href="#contenido"
            className="focus:bg-ink-950 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-sm focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
          >
            {dictionary.common.skipToContent}
          </a>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
