import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { NeedsFinder } from "@/components/marketing/NeedsFinder";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CheckTeaser } from "@/components/marketing/CheckTeaser";
import { LiveDemo } from "@/components/marketing/LiveDemo";
import { CatalogPreview } from "@/components/marketing/CatalogPreview";
import { GlobeSection } from "@/components/marketing/GlobeSection";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FaqSection } from "@/components/marketing/FaqSection";
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <NeedsFinder />
      <CheckTeaser />
      <HowItWorks />
      <LiveDemo />
      <CatalogPreview />
      <SecuritySection />
      <GlobeSection />
      <PricingPreview />
      <SocialProof />
      <FaqSection />

      {/* Structured data: an Organization that makes no claim we cannot evidence. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            description: site.description,
            url: site.url,
            areaServed: { "@type": "Country", name: "España" },
            serviceType: "Servicios jurídicos y de gestión en extranjería",
            availableLanguage: ["es", "en"],
          }),
        }}
      />
    </>
  );
}
