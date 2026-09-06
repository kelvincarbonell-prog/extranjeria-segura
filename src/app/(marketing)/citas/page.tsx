import type { Metadata } from "next";
import { ENTRY_PLANS } from "@/content/pricing";
import { SectionHeading, Card, LegalNote, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { CheckDraw } from "@/components/motion/primitives";
import { locales, site } from "@/content/site";
import { eur } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reservar consulta",
  description:
    "Reserva una consulta de 45 minutos con un especialista en extranjería. Revisamos tu caso, confirmamos la estrategia y te damos el plan documental por escrito.",
  alternates: { canonical: "/citas" },
};

const consulta = ENTRY_PLANS.find((p) => p.id === "consulta")!;

const AGENDA = [
  "Revisamos tu diagnóstico y tu situación real",
  "Confirmamos qué vía encaja mejor y por qué",
  "Repasamos los documentos que ya tienes",
  "Te decimos qué habría que verificar y cómo",
  "Sales con un plan documental por escrito",
];

export default function CitasPage() {
  return (
    <>
      <section className="relative pt-32 pb-10 md:pt-40">
        <div aria-hidden className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Consulta"
            title="45 minutos con alguien que ha visto tu caso mil veces."
            lede="No es una llamada comercial. Es una revisión real de tu situación por un profesional, con conclusiones por escrito al terminar."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* ---- Booking ---- */}
            <Card padding="lg">
              <h2 className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em]">
                Reserva tu hueco
              </h2>
              <p className="text-ink-500 mt-1.5 text-[14px]">
                Elige el tipo de consulta, el idioma y el momento.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 [&>label]:min-w-0">
                <label className="flex flex-col gap-1.5">
                  <span className="text-ink-600 text-[12.5px] font-medium">Tipo de consulta</span>
                  <select className="bg-surface text-ink-900 h-11 w-full min-w-0 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none">
                    <option>Primera consulta sobre mi situación</option>
                    <option>Tengo un requerimiento o una denegación</option>
                    <option>Nacionalidad española</option>
                    <option>Nómada digital / teletrabajo</option>
                    <option>Reagrupación familiar</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-ink-600 text-[12.5px] font-medium">Idioma</span>
                  <select className="bg-surface text-ink-900 h-11 w-full min-w-0 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none">
                    {locales.filter((l) => l.ready).map((l) => (
                      <option key={l.code}>{l.native}</option>
                    ))}
                    <option>Otro idioma (lo consultamos)</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-ink-600 text-[12.5px] font-medium">Fecha</span>
                  <input type="date" className="bg-surface text-ink-900 data h-11 w-full min-w-0 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-ink-600 text-[12.5px] font-medium">Hora (CET)</span>
                  <select className="bg-surface text-ink-900 data h-11 w-full min-w-0 rounded-sm px-3.5 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none">
                    <option>10:00</option>
                    <option>12:00</option>
                    <option>16:00</option>
                    <option>18:00</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href="/crear-cuenta" size="lg" arrow>
                  Continuar con la reserva
                </Button>
                <span className="text-ink-400 text-[12.5px]">
                  Necesitarás una cuenta para recibir el enlace y el resumen.
                </span>
              </div>

              {!site.features.videoCalls && (
                <LegalNote variant="framed" className="mt-6">
                  La reserva está construida en la interfaz pero todavía no conectada a un proveedor
                  de calendario y videollamada. Al activarla, la integración se documentará en la
                  política de privacidad con su encargado de tratamiento.
                </LegalNote>
              )}
            </Card>

            {/* ---- Summary ---- */}
            <div className="flex flex-col gap-4">
              <Card padding="lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-ink-950 flex size-11 items-center justify-center rounded-[13px] text-white">
                    <Glyph name="clock" className="size-5" />
                  </span>
                  <Badge tone="brand">Se descuenta de la gestión</Badge>
                </div>
                <h2 className="text-ink-900 font-display mt-4 text-[18px] font-extrabold tracking-[-0.028em]">
                  {consulta.name}
                </h2>
                <p className="text-ink-900 font-display data mt-3 text-[32px] leading-none font-extrabold tracking-[-0.045em]">
                  {eur(consulta.priceCents!)}
                </p>
                <p className="text-ink-400 mt-1.5 text-[12.5px]">45 minutos · videollamada</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {AGENDA.map((a, i) => (
                    <li key={a} className="text-ink-600 flex gap-2.5 text-[13.5px] leading-snug">
                      <span className="bg-signal-ok-soft text-signal-ok mt-px flex size-4 shrink-0 items-center justify-center rounded-full">
                        <CheckDraw size={9} strokeWidth={3.4} delay={0.2 + i * 0.09} />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="md" className="bg-ink-950 text-white shadow-none">
                <p className="font-display text-[15px] leading-snug font-bold">
                  ¿Prefieres empezar gratis?
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  El diagnóstico te da las vías que pueden encajar contigo en tres minutos, sin
                  registro ni coste. Muchas personas llegan a la consulta ya con él hecho.
                </p>
                <Button href="/diagnostico" variant="inverse" size="sm" block className="mt-4" arrow>
                  Hacer el diagnóstico
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
