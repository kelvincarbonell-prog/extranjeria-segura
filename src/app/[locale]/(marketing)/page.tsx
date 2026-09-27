import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Hero } from "@/components/marketing/Hero";
import { AvisoActualidad } from "@/components/marketing/AvisoActualidad";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { NeedsFinder } from "@/components/marketing/NeedsFinder";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CheckTeaser } from "@/components/marketing/CheckTeaser";
import { LiveDemo } from "@/components/marketing/LiveDemo";
import { CatalogPreview } from "@/components/marketing/CatalogPreview";
import { Situaciones } from "@/components/marketing/Situaciones";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FaqSection } from "@/components/marketing/FaqSection";
import { jsonLd, organizacion } from "@/lib/jsonld";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/",
    title: `${site.name} — ${site.claim}`,
    description: site.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          ORDEN DE LA PORTADA, POR LO QUE DECIDE SI ALGUIEN SE QUEDA.

          El orden anterior era el del producto: primero lo que hacemos,
          después cómo lo hacemos, y al final lo que cuesta y por qué fiarse.
          Es el orden en que se construyó, no el orden en que se decide.

          Quien llega aquí trae tres preguntas y las trae en este orden:
          ¿esto es para mi caso?, ¿cuánto me va a costar?, ¿me puedo fiar?
          El precio estaba en la posición 11, a catorce mil píxeles de
          scroll en un móvil: quien piensa «esto será carísimo» se marcha
          mucho antes de llegar. En extranjería ese miedo no es abstracto
          —hay quien ha pagado 2.000 € a un gestor por un formulario—, y
          una página que tarda catorce mil píxeles en hablar de dinero lo
          confirma en lugar de desmontarlo.

          Lo que baja: el catálogo, que son tres mil píxeles de enlaces y
          es navegación, no conversión —sigue en la página, y sigue valiendo
          para los buscadores—. Y el globo terráqueo, que sale de la
          portada: mil trescientos píxeles decorativos en el sitio donde se
          decide. El componente se queda por si vuelve a hacer falta.
          ───────────────────────────────────────────────────────────── */}

      <Hero />
      <AvisoActualidad />
      <TrustStrip />

      {/* Antes de pedir nada, nombrar la situación de quien lee. */}
      <Situaciones />

      <NeedsFinder />
      <CheckTeaser />

      {/* El dinero, temprano. Es la segunda pregunta que trae todo el mundo
          y la que más gente pierde cuando no se responde. */}
      <PricingPreview />

      <HowItWorks />
      <SecuritySection />
      <LiveDemo />
      <SocialProof />
      <FaqSection />

      {/* Navegación y profundidad, para quien ya ha decidido mirar en serio. */}
      <CatalogPreview />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organizacion(locale)) }}
      />
    </>
  );
}
