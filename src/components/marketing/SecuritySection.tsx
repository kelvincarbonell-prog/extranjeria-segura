import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

/**
 * Trust is the product.
 *
 * We ask people to upload a passport, a criminal record certificate and their
 * whole administrative history. That deserves an explicit, concrete section —
 * not a padlock icon in the footer. Every claim here maps to something
 * actually implemented in the codebase (RLS policies, signed URLs, the audit
 * table) so it stays honest as the platform grows.
 */

const MEASURES = [
  {
    glyph: "lock",
    title: "Tus documentos no son públicos. Nunca.",
    body: "El almacenamiento es privado. Cada descarga se sirve con un enlace firmado que caduca en minutos y solo funciona para ti. No hay URLs adivinables ni carpetas abiertas.",
  },
  {
    glyph: "shield",
    title: "Aislamiento por fila, no por confianza",
    body: "La base de datos aplica Row Level Security: tu expediente es inaccesible para cualquier otra cuenta, incluso si una consulta fuera mal escrita. La seguridad no depende de que el código acierte.",
  },
  {
    glyph: "doc",
    title: "Registro de auditoría de todo",
    body: "Quién ha visto o modificado cada documento, cuándo y desde dónde. Puedes pedirnos ese registro en cualquier momento: es tuyo.",
  },
  {
    glyph: "stamp",
    title: "Roles con el mínimo privilegio",
    body: "Tu gestor ve lo que necesita para tu expediente y nada más. Los perfiles comerciales no acceden a documentación migratoria.",
  },
  {
    glyph: "clock",
    title: "Retención con fecha de caducidad",
    body: "Definimos cuánto tiempo se conserva cada tipo de documento y se elimina cuando toca. Puedes pedir la supresión antes.",
  },
  {
    glyph: "globe",
    title: "Datos alojados en la Unión Europea",
    body: "Infraestructura y copias de seguridad en región europea, con los encargados de tratamiento identificados en nuestra política de privacidad.",
  },
];

const RIGHTS = [
  "Acceder a todo lo que tenemos sobre ti",
  "Rectificar cualquier dato incorrecto",
  "Exportar tu expediente completo",
  "Solicitar la supresión de tus datos",
  "Retirar un consentimiento concreto",
  "Consultar el registro de accesos",
];

export function SecuritySection() {
  return (
    <section id="seguridad" className="relative py-4">
      <div className="container-page">
        <div className="bg-ink-950 relative isolate overflow-hidden rounded-2xl px-6 py-16 md:px-14 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(800px 400px at 12% 0%, rgba(65,89,250,.34), transparent 60%), radial-gradient(600px 400px at 92% 100%, rgba(11,138,95,.18), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 80% 70% at 30% 20%, #000 10%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 20%, #000 10%, transparent 70%)",
            }}
          />

          <div className="relative">
            <Reveal>
              <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-white/50 uppercase">
                <span aria-hidden className="h-px w-5 rounded-full bg-white/40" />
                Seguridad y privacidad
              </span>
              <h2 className="text-display-md md:text-display-lg max-w-3xl text-white">
                Nos vas a confiar tu pasaporte.
                <br />
                <span className="text-white/40">Eso lo tratamos como lo que es.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-white/55">
                Un expediente de extranjería contiene tu identidad completa: pasaporte, NIE,
                antecedentes, domicilio, situación familiar y laboral. Estas son las medidas
                concretas con las que trabajamos, no una declaración de intenciones.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {MEASURES.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.05}>
                  <div className="flex flex-col">
                    <span className="flex size-10 items-center justify-center rounded-[12px] bg-white/[.07] text-white ring-1 ring-white/10 ring-inset">
                      <Glyph name={m.glyph} className="size-[19px]" />
                    </span>
                    <h3 className="font-display mt-4 text-[15.5px] leading-snug font-bold tracking-[-0.02em] text-white">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-display text-[17px] font-extrabold tracking-[-0.025em] text-white">
                    Tus derechos, sin tener que pelearlos
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {RIGHTS.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-[13.5px] text-white/55">
                        <span aria-hidden className="bg-signal-ok size-1 rounded-full" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                  <Button href="/legal/privacidad" variant="inverse" size="md">
                    Política de privacidad
                  </Button>
                  <Button
                    href="/legal/proteccion-datos"
                    variant="ghost"
                    size="md"
                    className="border border-white/15 bg-white/[.06] text-white hover:bg-white/[.12]"
                  >
                    Protección de datos
                  </Button>
                </div>
              </div>
            </Reveal>

            {!site.features.aiDocumentReview && (
              <Reveal delay={0.14}>
                <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-white/35">
                  Nota de transparencia: la revisión automática de documentos y las integraciones de
                  pago y firma electrónica están construidas en la arquitectura pero no activadas en
                  producción. Cuando lo estén, lo indicaremos aquí y en la política de privacidad,
                  con el encargado de tratamiento correspondiente.
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
