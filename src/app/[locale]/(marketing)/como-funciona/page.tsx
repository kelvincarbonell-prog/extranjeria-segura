import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { LiveDemo } from "@/components/marketing/LiveDemo";
import { CheckTeaser } from "@/components/marketing/CheckTeaser";
import { SectionHeading, Card, LegalNote } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/como-funciona",
    title: "Cómo funciona",
    description: "Cómo gestionamos tu expediente de extranjería: diagnóstico, consulta con especialista, documentación revisada, presentación telemática y seguimiento hasta la resolución.",
  });
}

const PRINCIPLES = [
  {
    glyph: "shield",
    title: "Te decimos que no cuando toca",
    body: "Si tu caso no tiene recorrido, te lo decimos antes de cobrarte. Preferimos perder un encargo a presentar algo que sabemos que se va a denegar.",
  },
  {
    glyph: "doc",
    title: "Un profesional mira cada documento",
    body: "La automatización lee, ordena y avisa. Quien decide si un documento sirve es siempre una persona colegiada, y su revisión queda firmada.",
  },
  {
    glyph: "clock",
    title: "Los plazos son nuestro problema, no el tuyo",
    body: "Vigilamos caducidades, ventanas de presentación y requerimientos. Si algo corre, te avisamos antes de que corra.",
  },
  {
    glyph: "path",
    title: "Siempre sabes dónde está tu expediente",
    body: "Ningún «lo estamos mirando». Ves la fase, lo que falta, quién lo tiene y qué pasa después.",
  },
  {
    glyph: "stamp",
    title: "El precio no se mueve por sorpresa",
    body: "Presupuesto cerrado por escrito. Si el alcance cambia, se acuerda contigo antes de tocar nada.",
  },
  {
    glyph: "lock",
    title: "Tu documentación no es material de marketing",
    body: "No publicamos casos ni capturas de expedientes reales. Lo que subes se usa para tu trámite y para nada más.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="relative pt-32 pb-4 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Metodología"
            title="Cómo trabajamos, dicho sin rodeos."
            lede="La extranjería no se gana con prisa: se gana con el expediente bien construido y presentado a tiempo. Todo lo que hacemos gira alrededor de eso."
          />
        </div>
      </section>

      <HowItWorks />

      <section className="py-20 md:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Nuestros principios"
              title="Seis compromisos que nos autoimponemos."
              lede="No son valores de folleto. Cada uno tiene una consecuencia concreta en cómo está construida la plataforma."
            />
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <Card padding="lg" className="h-full">
                  <span className="bg-ink-950 flex size-10 items-center justify-center rounded-[12px] text-white">
                    <Glyph name={p.glyph} className="size-[19px]" />
                  </span>
                  <h3 className="text-ink-900 font-display mt-4 text-[16.5px] leading-snug font-extrabold tracking-[-0.025em]">
                    {p.title}
                  </h3>
                  <p className="text-ink-500 mt-2 text-[13.5px] leading-relaxed">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CheckTeaser />
      <LiveDemo />

      <section className="pb-24">
        <div className="container-page">
          <LegalNote variant="framed" className="mx-auto max-w-3xl">
            La gestión de expedientes se presta bajo la dirección del profesional responsable
            indicado en el aviso legal. Los contenidos informativos de este sitio son orientativos y
            no sustituyen el análisis individualizado de cada caso.
          </LegalNote>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/diagnostico" size="lg" arrow magnetic>
              Empezar por el diagnóstico
            </Button>
            <Button href="/precios" size="lg" variant="secondary">
              Ver precios
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
