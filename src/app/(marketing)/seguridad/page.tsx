import type { Metadata } from "next";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { SectionHeading, Card, LegalNote } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { ROLES } from "@/content/roles";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Seguridad",
  description:
    "Cómo protegemos tu pasaporte, tu NIE y tu documentación migratoria: almacenamiento privado, enlaces firmados, aislamiento por fila, roles con mínimo privilegio y registro de auditoría.",
  alternates: { canonical: "/seguridad" },
};

export default function SeguridadPage() {
  return (
    <>
      <section className="relative pt-32 pb-8 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Seguridad"
            title="Lo que nos confías y lo que hacemos con ello."
            lede="Un expediente de extranjería es tu identidad completa. Esta página explica, sin marketing, cómo está construida la plataforma para protegerla."
          />
        </div>
      </section>

      <SecuritySection />

      <section className="py-20 md:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Mínimo privilegio"
              title="Quién ve qué, dentro del equipo."
              lede="Estos permisos no son una convención de la interfaz: se corresponden con políticas de la base de datos. Ocultar un botón no protege un pasaporte."
            />
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <Card padding="lg" className="h-full">
                  <h3 className="text-ink-900 font-display text-[17px] font-extrabold tracking-[-0.028em]">
                    {r.label}
                  </h3>
                  <p className="text-ink-400 mt-1 text-[12.5px]">{r.description}</p>
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {r.cannot.map((c) => (
                      <li key={c} className="text-ink-600 flex gap-2 text-[13px] leading-snug">
                        <span className="bg-signal-risk mt-1.5 size-1 shrink-0 rounded-full" />
                        No puede: {c.charAt(0).toLowerCase() + c.slice(1)}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          <LegalNote variant="framed" className="mt-10">
            Si detectas una vulnerabilidad, escríbenos antes de divulgarla. Nos comprometemos a
            responder, a corregirla y a reconocer públicamente el aviso si así lo prefieres.
          </LegalNote>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/legal/proteccion-datos" size="lg" variant="secondary">
              Protección de datos
            </Button>
            <Button href="/legal/privacidad" size="lg" variant="secondary">
              Política de privacidad
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
