import type { Metadata } from "next";
import { site } from "@/content/site";
import { SectionHeading, Card, LegalNote, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Qué es Extranjería Segura, por qué existe y hacia dónde va: la plataforma para empezar y gestionar tu vida en España.",
  alternates: { canonical: "/empresa" },
};

const FUTURE = [
  { glyph: "stamp", label: "Firma electrónica" },
  { glyph: "doc", label: "Lectura y validación documental" },
  { glyph: "globe", label: "Integración con la Administración, cuando sea posible" },
  { glyph: "family", label: "Videollamada integrada" },
  { glyph: "path", label: "Traducciones y apostillas coordinadas" },
  { glyph: "shield", label: "Seguros de salud" },
  { glyph: "door", label: "Empadronamiento y alquiler" },
  { glyph: "briefcase", label: "Empleo y homologación de títulos" },
];

export default function EmpresaPage() {
  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Sobre nosotros"
            title="Nosotros entendemos extranjería. Tú solo tienes que seguir avanzando."
            lede="Llegar a un país nuevo ya es bastante difícil. La parte administrativa no debería añadir incertidumbre encima."
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="prose-none flex flex-col gap-5">
                <h2 className="text-ink-900 font-display text-[24px] font-extrabold tracking-[-0.032em]">
                  Por qué existe esto
                </h2>
                <p className="text-ink-600 text-[16px] leading-[1.7]">
                  La extranjería en España funciona con plazos cortos, criterios que varían por
                  oficina y documentos que caducan mientras esperas otro. La mayoría de expedientes
                  que se pierden no se pierden por el fondo del asunto: se pierden por una fecha, un
                  documento sin apostillar o un requerimiento que llegó y nadie leyó a tiempo.
                </p>
                <p className="text-ink-600 text-[16px] leading-[1.7]">
                  Eso es un problema de proceso, y los problemas de proceso se resuelven con
                  producto. Por eso esto no es una web con un formulario de contacto: es una
                  plataforma donde el expediente es visible, los plazos se vigilan solos y cada
                  documento tiene un estado que significa algo.
                </p>
                <p className="text-ink-600 text-[16px] leading-[1.7]">
                  El objetivo emocional no es obtener un permiso. Es tranquilidad: saber dónde está
                  tu expediente, qué falta, qué ocurre ahora, quién te está ayudando y cuánto vas a
                  pagar.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <Card padding="lg" className="h-full">
                <h2 className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em]">
                  Hacia dónde va
                </h2>
                <p className="text-ink-500 mt-2 text-[14px] leading-relaxed">
                  La arquitectura está preparada para incorporar estas piezas cuando sea técnica y
                  jurídicamente posible. Ninguna está activa hoy, y lo decimos donde corresponde.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {FUTURE.map((f) => (
                    <li
                      key={f.label}
                      className="text-ink-600 bg-canvas-deep ring-ink-900/[.05] flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-[13px] ring-1 ring-inset"
                    >
                      <Glyph name={f.glyph} className="text-ink-400 size-4 shrink-0" />
                      {f.label}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-400 mt-5 text-[13px] leading-relaxed">
                  El destino no es ser una gestoría mejor. Es ser la plataforma desde la que
                  empiezas y gestionas tu vida en España.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Card padding="lg" className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-ink-900 text-[16px] font-semibold">Datos de la empresa</h2>
                {!site.legalName && <Badge tone="neutral">Pendiente de configurar</Badge>}
              </div>
              <LegalNote className="mt-4">
                La razón social, el NIF, los datos registrales y el colegio profesional del
                responsable se publican en el aviso legal en cuanto estén configurados. No
                mostramos datos societarios provisionales: en un sector donde la confianza lo es
                todo, un dato inventado vale menos que un hueco reconocido.
              </LegalNote>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/legal/aviso-legal" variant="secondary" size="md">
                  Aviso legal
                </Button>
                <Button href="/seguridad" variant="secondary" size="md">
                  Seguridad
                </Button>
                <Button href="/contacto" size="md" arrow>
                  Contactar
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
