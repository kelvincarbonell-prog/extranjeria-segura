import { DEMO_APPOINTMENTS } from "@/content/demo";
import { Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata = { title: "Citas" };

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export default function CitasPage() {
  const upcoming = DEMO_APPOINTMENTS.filter((a) => a.state !== "pasada");
  const past = DEMO_APPOINTMENTS.filter((a) => a.state === "pasada");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
            Citas
          </h1>
          <p className="text-ink-500 mt-1.5 text-[15px]">
            Videollamadas con tu especialista y citas presenciales de la Administración.
          </p>
        </div>
        <Button size="md" arrow>
          Reservar videollamada
        </Button>
      </div>

      {upcoming.length > 0 ? (
        <Reveal>
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((a) => (
              <Card key={a.id} padding="lg" className="flex flex-col">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="bg-brand-50 text-brand-600 flex size-11 items-center justify-center rounded-[13px]">
                    <Glyph name="clock" className="size-5" />
                  </span>
                  <Badge tone={a.state === "confirmada" ? "ok" : "brand"} dot>
                    {a.state === "confirmada" ? "Confirmada" : "Propuesta"}
                  </Badge>
                </div>
                <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
                  {a.title}
                </h2>
                <p className="text-ink-700 mt-2 text-[14.5px] font-medium first-letter:uppercase">
                  {fmt(a.at)}
                </p>
                <dl className="text-ink-500 mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px]">
                  <div className="flex gap-1.5">
                    <dt className="text-ink-400">Duración:</dt>
                    <dd className="data">{a.durationMin} min</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-ink-400">Modalidad:</dt>
                    <dd className="capitalize">{a.mode}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-ink-400">Idioma:</dt>
                    <dd>{a.language}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button size="sm">Unirme a la llamada</Button>
                  <Button size="sm" variant="secondary">
                    Añadir a mi calendario
                  </Button>
                  <Button size="sm" variant="ghost">
                    Cambiar fecha
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-ink-700 text-[15px] font-semibold">No tienes citas programadas.</p>
          <p className="text-ink-500 mx-auto mt-1.5 max-w-sm text-[13.5px]">
            Puedes reservar una videollamada con tu especialista cuando lo necesites.
          </p>
        </Card>
      )}

      {/* ---------------- Booking form ---------------- */}
      <Reveal delay={0.06}>
        <Card padding="lg">
          <h2 className="text-ink-900 font-display text-[18px] font-extrabold tracking-[-0.028em]">
            Reservar una nueva cita
          </h2>
          <p className="text-ink-500 mt-1.5 text-[13.5px]">
            Elige el tipo de consulta, el idioma y el momento que mejor te venga.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de consulta">
              <select className="field">
                <option>Seguimiento de mi expediente</option>
                <option>Revisión de documentación</option>
                <option>Consulta sobre un requerimiento</option>
                <option>Otra cuestión</option>
              </select>
            </Field>
            <Field label="Idioma">
              <select className="field">
                <option>Español</option>
                <option>English</option>
              </select>
            </Field>
            <Field label="Fecha">
              <input type="date" className="field" />
            </Field>
            <Field label="Hora">
              <select className="field">
                <option>10:00</option>
                <option>12:00</option>
                <option>16:00</option>
                <option>18:00</option>
              </select>
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="md" arrow>
              Confirmar cita
            </Button>
            <span className="text-ink-400 text-[12.5px]">
              Recibirás el enlace por correo y podrás añadirla a tu calendario.
            </span>
          </div>

          {!site.features.videoCalls && (
            <LegalNote variant="framed" className="mt-5">
              La reserva de citas está construida en la interfaz pero no conectada aún a un
              proveedor de calendario y videollamada. Al activarla, la integración con Google
              Calendar se documentará en la política de privacidad.
            </LegalNote>
          )}
        </Card>
      </Reveal>

      {past.length > 0 && (
        <Reveal delay={0.1}>
          <Card padding="none" className="overflow-hidden">
            <div className="border-ink-100 border-b px-5 py-4">
              <h2 className="text-ink-900 text-[15px] font-semibold">Citas anteriores</h2>
            </div>
            <ul className="divide-ink-100 divide-y">
              {past.map((a) => (
                <li key={a.id} className="flex items-center gap-3.5 px-5 py-4">
                  <span className="bg-ink-50 text-ink-400 flex size-9 shrink-0 items-center justify-center rounded-[11px]">
                    <Glyph name="clock" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-ink-900 text-[14px] font-medium">{a.title}</p>
                    <p className="text-ink-400 text-[12.5px] first-letter:uppercase">{fmt(a.at)}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Ver resumen
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-ink-600 text-[12.5px] font-medium">{label}</span>
      <span
        className={cn(
          "[&_.field]:bg-surface [&_.field]:text-ink-900 [&_.field]:h-11 [&_.field]:w-full",
          "[&_.field]:rounded-sm [&_.field]:px-3.5 [&_.field]:text-[14px] [&_.field]:outline-none",
          "[&_.field]:shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)]",
          "[&_.field:focus]:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]",
        )}
      >
        {children}
      </span>
    </label>
  );
}
