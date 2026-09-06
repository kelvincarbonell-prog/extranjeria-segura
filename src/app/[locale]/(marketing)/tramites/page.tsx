import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { TRAMITES } from "@/content/tramites";
import { CATEGORIES } from "@/content/taxonomy";
import { TramiteExplorer } from "@/components/marketing/TramiteExplorer";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/tramites",
    title: "Todos los trámites de extranjería",
    description: "Catálogo completo de trámites de extranjería en España: arraigo, nacionalidad, nómada digital, reagrupación familiar, renovaciones, recursos y más. Requisitos, documentación, plazos y honorarios.",
  });
}

export default function TramitesPage() {
  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="container-page">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Catálogo"
              title="Todos los trámites, con la letra pequeña delante."
              lede="Cada ficha incluye requisitos, documentación exacta, proceso paso a paso, plazos orientativos, honorarios y lo que no está incluido. Y la fecha de su última revisión."
            />
          </Reveal>
        </div>
      </section>

      <TramiteExplorer tramites={TRAMITES} categories={CATEGORIES} />
    </>
  );
}
