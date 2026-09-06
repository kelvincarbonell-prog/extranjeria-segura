import Link from "next/link";
import { DEMO_CASE, DEMO_DOCUMENTS, DEMO_NOTIFICATIONS, DEMO_APPOINTMENTS, DOC_STATE_META } from "@/content/demo";
import { Card, Badge, Progress, Avatar, KeyValue } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { CaseTimeline } from "@/components/app/CaseTimeline";
import { Reveal } from "@/components/motion/primitives";
import { formatDateES, relativeES, cn } from "@/lib/utils";

export default function AppHome() {
  const pending = DEMO_DOCUMENTS.filter((d) => d.state === "pendiente" || d.state === "cambios");
  const validated = DEMO_DOCUMENTS.filter((d) => d.state === "correcto").length;
  const nextAppointment = DEMO_APPOINTMENTS.find((a) => a.state === "confirmada");
  const unread = DEMO_NOTIFICATIONS.filter((n) => !n.read);

  return (
    <div className="flex flex-col gap-5">
      {/* ---------------- Greeting ---------------- */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-ink-900 font-display text-[28px] leading-tight font-extrabold tracking-[-0.035em] md:text-[34px]">
              Hola, {DEMO_CASE.clientFirstName} 👋
            </h1>
            <p className="text-ink-500 mt-1.5 text-[15px]">
              Esto es lo que está pasando con tu expediente ahora mismo.
            </p>
          </div>
          <Badge tone="brand" dot>
            {DEMO_CASE.status}
          </Badge>
        </div>
      </Reveal>

      {/* ---------------- Next action ---------------- */}
      <Reveal delay={0.05}>
        <div className="bg-ink-950 relative isolate overflow-hidden rounded-lg p-6 md:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(560px 260px at 8% 0%, rgba(65,89,250,.38), transparent 62%)",
            }}
          />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <p className="text-[11px] font-bold tracking-[0.12em] text-white/45 uppercase">
                Lo que necesitamos de ti ahora
              </p>
              <h2 className="font-display mt-2.5 text-[20px] leading-snug font-extrabold tracking-[-0.028em] text-white md:text-[23px]">
                {DEMO_CASE.nextStep.title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                {DEMO_CASE.nextStep.detail}
              </p>
            </div>
            <Button href="/app/documentos" variant="inverse" size="lg" arrow className="shrink-0">
              Subir documento
            </Button>
          </div>
        </div>
      </Reveal>

      {/* ---------------- Stat row ---------------- */}
      <Reveal delay={0.08}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Documentos"
            value={`${validated}/${DEMO_DOCUMENTS.length}`}
            sub="validados"
            glyph="doc"
            href="/app/documentos"
          />
          <StatTile
            label="Pendientes de ti"
            value={String(pending.length)}
            sub={pending.length === 1 ? "documento" : "documentos"}
            glyph="alert"
            tone={pending.length > 0 ? "warn" : "ok"}
            href="/app/documentos"
          />
          <StatTile
            label="Sin leer"
            value={String(unread.length)}
            sub="notificaciones"
            glyph="family"
            href="/app/notificaciones"
          />
          <StatTile
            label="Próxima cita"
            value={
              nextAppointment
                ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(
                    new Date(nextAppointment.at),
                  )
                : "—"
            }
            sub={nextAppointment ? "videollamada" : "sin citas"}
            glyph="clock"
            href="/app/citas"
          />
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------------- Case + timeline ---------------- */}
        <Reveal delay={0.1}>
          <Card padding="lg">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="data text-ink-400 text-[11.5px] font-medium">
                  Expediente #{DEMO_CASE.reference}
                </p>
                <h2 className="text-ink-900 font-display mt-1 text-[21px] font-extrabold tracking-[-0.03em]">
                  {DEMO_CASE.tramite}
                </h2>
              </div>
              <Link
                href={`/tramites/${DEMO_CASE.tramiteSlug}`}
                className="text-brand-600 hover:text-brand-800 text-[13px] font-semibold transition-colors"
              >
                Ver requisitos →
              </Link>
            </div>

            <Progress value={DEMO_CASE.progress} label="Progreso del expediente" showValue />

            <div className="border-ink-100 mt-7 border-t pt-6">
              <CaseTimeline steps={DEMO_CASE.timeline} />
            </div>
          </Card>
        </Reveal>

        {/* ---------------- Side rail ---------------- */}
        <div className="flex flex-col gap-5">
          <Reveal delay={0.13}>
            <Card padding="md">
              <p className="text-ink-400 mb-3.5 text-[11px] font-bold tracking-[0.11em] uppercase">
                Tu especialista
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={DEMO_CASE.advisor.name} size={42} />
                <div className="min-w-0">
                  <p className="text-ink-900 truncate text-[14px] font-semibold">
                    {DEMO_CASE.advisor.name}
                  </p>
                  <p className="text-ink-400 truncate text-[12.5px]">{DEMO_CASE.advisor.role}</p>
                </div>
              </div>
              <Button href="/app/mensajes" variant="secondary" size="sm" block className="mt-4">
                Enviar un mensaje
              </Button>
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card padding="md">
              <p className="text-ink-400 mb-1 text-[11px] font-bold tracking-[0.11em] uppercase">
                Datos del expediente
              </p>
              <dl className="divide-ink-100 divide-y">
                <KeyValue k="Referencia" v={`#${DEMO_CASE.reference}`} mono />
                <KeyValue k="Abierto el" v={formatDateES(DEMO_CASE.openedAt, "short")} />
                <KeyValue k="Estado" v={DEMO_CASE.status} />
              </dl>
            </Card>
          </Reveal>

          <Reveal delay={0.19}>
            <Card padding="md">
              <div className="mb-3.5 flex items-center justify-between">
                <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
                  Actividad reciente
                </p>
                <Link
                  href="/app/notificaciones"
                  className="text-brand-600 text-[12px] font-semibold"
                >
                  Ver todo
                </Link>
              </div>
              <ul className="flex flex-col gap-3">
                {DEMO_NOTIFICATIONS.slice(0, 4).map((n) => (
                  <li key={n.id} className="flex gap-2.5">
                    <span
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        n.read ? "bg-ink-200" : "bg-brand-600",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-800 block text-[13px] leading-snug font-medium">
                        {n.title}
                      </span>
                      <span className="text-ink-400 block text-[11.5px]">{relativeES(n.at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* ---------------- Documents needing action ---------------- */}
      {pending.length > 0 && (
        <Reveal delay={0.22}>
          <Card padding="none" className="overflow-hidden">
            <div className="border-ink-100 flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-ink-900 text-[15px] font-semibold">Documentos que faltan</h2>
              <Link href="/app/documentos" className="text-brand-600 text-[13px] font-semibold">
                Gestionar
              </Link>
            </div>
            <ul className="divide-ink-100 divide-y">
              {pending.map((d) => {
                const meta = DOC_STATE_META[d.state];
                return (
                  <li key={d.id} className="flex items-center gap-3.5 px-5 py-4">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
                        meta.tone === "warn"
                          ? "bg-signal-warn-soft text-signal-warn"
                          : "bg-ink-50 text-ink-400",
                      )}
                    >
                      <Glyph name={meta.glyph} className="size-[17px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-900 block text-[14px] font-medium">{d.name}</span>
                      <span className="text-ink-500 block text-[12.5px]">
                        {d.issue?.title ?? d.hint}
                      </span>
                    </span>
                    <Badge tone={meta.tone} className="shrink-0">
                      {meta.label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StatTile({
  label,
  value,
  sub,
  glyph,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  glyph: string;
  href: string;
  tone?: "neutral" | "warn" | "ok";
}) {
  return (
    <Link
      href={href}
      className="group bg-surface flex flex-col rounded-lg p-4 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_12px_28px_-12px_rgb(10_13_22_/_0.18)]"
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px]",
          tone === "warn"
            ? "bg-signal-warn-soft text-signal-warn"
            : tone === "ok"
              ? "bg-signal-ok-soft text-signal-ok"
              : "bg-ink-50 text-ink-500",
        )}
      >
        <Glyph name={glyph} className="size-4" />
      </span>
      <span className="text-ink-900 font-display data mt-3 text-[22px] leading-none font-extrabold tracking-[-0.035em]">
        {value}
      </span>
      <span className="text-ink-400 mt-1.5 text-[11.5px] leading-tight">
        {label} · {sub}
      </span>
    </Link>
  );
}
