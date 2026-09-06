import type { Metadata } from "next";
import { site } from "@/content/site";
import { SectionHeading, Card, LegalNote, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo ponerte en contacto con Extranjería Segura y qué esperar de cada canal.",
  alternates: { canonical: "/contacto" },
};

const ROUTES = [
  {
    glyph: "path",
    title: "No sé qué trámite necesito",
    body: "Empieza por el diagnóstico. Son tres minutos y te da las vías que pueden encajar contigo.",
    action: { label: "Hacer el diagnóstico", href: "/diagnostico" },
  },
  {
    glyph: "clock",
    title: "Quiero hablar con alguien",
    body: "Reserva una consulta de 45 minutos. Se descuenta si después contratas la gestión.",
    action: { label: "Reservar consulta", href: "/citas" },
  },
  {
    glyph: "alert",
    title: "He recibido un requerimiento o una denegación",
    body: "Estos casos tienen plazos cortos. Súbelo cuanto antes y lo miramos el mismo día.",
    action: { label: "Es urgente", href: "/diagnostico?objetivo=requerimiento" },
  },
  {
    glyph: "doc",
    title: "Ya soy cliente",
    body: "Escribe a tu especialista desde el hilo de tu expediente: queda todo registrado en un solo sitio.",
    action: { label: "Entrar a mi expediente", href: "/entrar" },
  },
];

export default function ContactoPage() {
  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Contacto"
            title="Dinos qué necesitas y te llevamos al sitio correcto."
            lede="Cada situación tiene su vía. Elegir bien la primera vez te ahorra semanas."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="grid gap-3 md:grid-cols-2">
            {ROUTES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <Card padding="lg" className="flex h-full flex-col">
                  <span className="bg-ink-950 flex size-11 items-center justify-center rounded-[13px] text-white">
                    <Glyph name={r.glyph} className="size-5" />
                  </span>
                  <h2 className="text-ink-900 font-display mt-4 text-[18px] font-extrabold tracking-[-0.028em]">
                    {r.title}
                  </h2>
                  <p className="text-ink-500 mt-2 flex-1 text-[14px] leading-relaxed">{r.body}</p>
                  <Button href={r.action.href} size="md" className="mt-5 self-start" arrow>
                    {r.action.label}
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Card padding="lg" className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-ink-900 text-[16px] font-semibold">Datos de contacto</h2>
                {!site.contact.email && <Badge tone="neutral">Pendiente de configurar</Badge>}
              </div>
              <dl className="divide-ink-100 mt-4 divide-y">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-ink-400 text-[13px]">Correo electrónico</dt>
                  <dd className="text-ink-900 text-[13.5px] font-medium">
                    {site.contact.email ?? "Por configurar"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-ink-400 text-[13px]">Teléfono</dt>
                  <dd className="text-ink-900 text-[13.5px] font-medium">
                    {site.contact.phone ?? "Por configurar"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-ink-400 text-[13px]">Dirección</dt>
                  <dd className="text-ink-900 text-[13.5px] font-medium">
                    {site.contact.address ?? "Por configurar"}
                  </dd>
                </div>
              </dl>
              <LegalNote className="mt-5">
                No publicamos datos de contacto que no estén verificados. Se configuran en{" "}
                <code className="data text-ink-500">src/content/site.ts</code> y aparecen
                automáticamente aquí y en el aviso legal.
              </LegalNote>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
