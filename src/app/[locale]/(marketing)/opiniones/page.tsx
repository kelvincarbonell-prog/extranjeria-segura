import type { Metadata } from "next";
import { SocialProof } from "@/components/marketing/SocialProof";
import { SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Opiniones",
  description:
    "Nuestra política de reseñas: solo publicamos opiniones verificables, con su fuente, el trámite y el país de origen. Incluidas las críticas.",
  alternates: { canonical: "/opiniones" },
};

export default function OpinionesPage() {
  return (
    <>
      <section className="relative pt-32 pb-4 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Opiniones"
            title="Prefiero que no me creas."
            lede="Cualquiera puede escribir cinco testimonios entusiastas. Por eso aquí solo aparecen reseñas que puedes ir a comprobar por tu cuenta, y por eso, mientras no las tengamos, esta página explica el criterio en vez de rellenarse."
            align="center"
            className="mx-auto"
          />
        </div>
      </section>
      <SocialProof />
    </>
  );
}
