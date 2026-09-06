import Link from "next/link";
import { DEMO_PIPELINE, PIPELINE_STAGES } from "@/content/demo";
import { Card, Badge, DemoTag, Progress } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/primitives";
import { eur, cn } from "@/lib/utils";

export const metadata = { title: "Panel" };

/**
 * Internal dashboard.
 *
 * The top row is deliberately operational rather than vanity: overdue SLA and
 * unassigned cases come before revenue, because in immigration a missed
 * deadline is a client's life, not a missed quarter.
 */
export default function AdminHome() {
  const active = DEMO_PIPELINE.filter(
    (c) => !["archivado", "resolucion"].includes(c.stage),
  );
  const overdue = DEMO_PIPELINE.filter((c) => c.slaDays !== null && c.slaDays < 0);
  const urgent = DEMO_PIPELINE.filter((c) => c.slaDays !== null && c.slaDays >= 0 && c.slaDays <= 2);
  const unassigned = DEMO_PIPELINE.filter((c) => c.owner === "Sin asignar");
  const leads = DEMO_PIPELINE.filter((c) => ["lead", "diagnostico", "consulta"].includes(c.stage));
  const contracted = DEMO_PIPELINE.filter(
    (c) => !["lead", "diagnostico", "consulta"].includes(c.stage),
  );
  const contractedValue = contracted.reduce((a, c) => a + c.valueCents, 0);
  const conversion = Math.round((contracted.length / DEMO_PIPELINE.length) * 100);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
            Panel
          </h1>
          <p className="text-ink-500 mt-1.5 text-[14.5px]">
            Estado operativo del despacho ahora mismo.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <DemoTag label="Datos de demostración" />
          <Button href="/admin/pipeline" size="sm" arrow>
            Abrir pipeline
          </Button>
        </div>
      </div>

      {/* ---------------- Alert row ---------------- */}
      {(overdue.length > 0 || unassigned.length > 0) && (
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {overdue.length > 0 && (
              <AlertCard
                tone="risk"
                glyph="alert"
                title={`${overdue.length} ${overdue.length === 1 ? "expediente con plazo vencido" : "expedientes con plazo vencido"}`}
                body={overdue.map((c) => `${c.reference} · ${c.client}`).join(" · ")}
                href="/admin/pipeline"
              />
            )}
            {unassigned.length > 0 && (
              <AlertCard
                tone="warn"
                glyph="family"
                title={`${unassigned.length} sin responsable asignado`}
                body={unassigned.map((c) => `${c.reference} · ${c.tramite}`).join(" · ")}
                href="/admin/pipeline"
              />
            )}
          </div>
        </Reveal>
      )}

      {/* ---------------- Metrics ---------------- */}
      <Reveal delay={0.04}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label="Expedientes activos" value={String(active.length)} sub="en tramitación" glyph="path" />
          <Metric
            label="Plazos críticos"
            value={String(overdue.length + urgent.length)}
            sub="vencen en 48 h o menos"
            glyph="clock"
            tone={overdue.length > 0 ? "risk" : urgent.length > 0 ? "warn" : "ok"}
          />
          <Metric label="Leads abiertos" value={String(leads.length)} sub="sin contratar" glyph="door" />
          <Metric
            label="Valor contratado"
            value={eur(contractedValue)}
            sub={`${conversion}% de conversión`}
            glyph="stamp"
          />
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---------------- Stage distribution ---------------- */}
        <Reveal delay={0.06}>
          <Card padding="lg">
            <h2 className="text-ink-900 mb-5 text-[15px] font-semibold">Distribución por fase</h2>
            <ul className="flex flex-col gap-3">
              {PIPELINE_STAGES.map((s) => {
                const items = DEMO_PIPELINE.filter((c) => c.stage === s.id);
                if (items.length === 0) return null;
                const pct = Math.round((items.length / DEMO_PIPELINE.length) * 100);
                return (
                  <li key={s.id} className="flex items-center gap-4">
                    <span className="text-ink-600 w-[132px] shrink-0 text-[13px] font-medium">
                      {s.label}
                    </span>
                    <div className="flex-1">
                      <Progress value={pct} size="sm" tone="ink" />
                    </div>
                    <span className="data text-ink-400 w-8 shrink-0 text-right text-[12px]">
                      {items.length}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Reveal>

        {/* ---------------- SLA queue ---------------- */}
        <Reveal delay={0.08}>
          <Card padding="none" className="overflow-hidden">
            <div className="border-ink-100 border-b px-5 py-4">
              <h2 className="text-ink-900 text-[15px] font-semibold">Cola por plazo</h2>
              <p className="text-ink-400 text-[12px]">Lo que vence antes, primero</p>
            </div>
            <ul className="divide-ink-100 divide-y">
              {[...DEMO_PIPELINE]
                .filter((c) => c.slaDays !== null)
                .sort((a, b) => (a.slaDays ?? 0) - (b.slaDays ?? 0))
                .slice(0, 6)
                .map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-bold",
                        (c.slaDays ?? 0) < 0
                          ? "bg-signal-risk-soft text-signal-risk"
                          : (c.slaDays ?? 0) <= 2
                            ? "bg-signal-warn-soft text-signal-warn"
                            : "bg-ink-50 text-ink-400",
                      )}
                    >
                      {(c.slaDays ?? 0) < 0 ? "!" : c.slaDays}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-900 block truncate text-[13.5px] font-medium">
                        {c.client}
                      </span>
                      <span className="text-ink-400 block truncate text-[12px]">
                        {c.reference} · {c.tramite}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </Card>
        </Reveal>
      </div>

      {/* ---------------- Automations ---------------- */}
      <Reveal delay={0.1}>
        <Card padding="lg">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-ink-900 text-[15px] font-semibold">Automatizaciones</h2>
            <Badge tone="neutral">Configuradas, sin proveedor conectado</Badge>
          </div>
          <p className="text-ink-500 mb-5 text-[13px] leading-relaxed">
            Las reglas están definidas en el backend. Al conectar el proveedor de envío, se activan
            sin tocar código.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              { t: "Documento pendiente 3 días", a: "Recordatorio al cliente por correo", g: "doc" },
              { t: "Permiso caduca en 60 días", a: "Aviso de renovación al cliente y al gestor", g: "cycle" },
              { t: "Requerimiento recibido", a: "Alerta urgente al abogado responsable", g: "alert" },
              { t: "Cita en 24 horas", a: "Recordatorio con el enlace de la videollamada", g: "clock" },
              { t: "Pago fraccionado próximo", a: "Aviso previo antes del cargo", g: "stamp" },
              { t: "Expediente sin movimiento 14 días", a: "Escalado al responsable del área", g: "path" },
            ].map((r) => (
              <li
                key={r.t}
                className="bg-canvas-deep ring-ink-900/[.05] flex items-start gap-3 rounded-sm p-3.5 ring-1 ring-inset"
              >
                <span className="bg-surface text-ink-500 flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                  <Glyph name={r.g} className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="text-ink-900 block text-[13px] font-semibold">{r.t}</span>
                  <span className="text-ink-500 block text-[12px] leading-snug">→ {r.a}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Metric({
  label,
  value,
  sub,
  glyph,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  glyph: string;
  tone?: "neutral" | "warn" | "risk" | "ok";
}) {
  return (
    <Card padding="md">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px]",
          tone === "risk"
            ? "bg-signal-risk-soft text-signal-risk"
            : tone === "warn"
              ? "bg-signal-warn-soft text-signal-warn"
              : tone === "ok"
                ? "bg-signal-ok-soft text-signal-ok"
                : "bg-ink-50 text-ink-500",
        )}
      >
        <Glyph name={glyph} className="size-4" />
      </span>
      <p className="text-ink-900 font-display data mt-3 text-[22px] leading-none font-extrabold tracking-[-0.035em]">
        {value}
      </p>
      <p className="text-ink-400 mt-1.5 text-[11.5px] leading-tight">
        {label} · {sub}
      </p>
    </Card>
  );
}

function AlertCard({
  tone,
  glyph,
  title,
  body,
  href,
}: {
  tone: "risk" | "warn";
  glyph: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // min-w-0 on the grid item and on the text column: without both, the
        // truncated body sets a min-content floor and the card pushes the
        // whole page — measured at 603px inside a 360px viewport.
        "flex min-w-0 items-start gap-3.5 rounded-lg p-4 ring-1 ring-inset transition-transform duration-300 hover:-translate-y-0.5",
        tone === "risk"
          ? "bg-signal-risk-soft ring-signal-risk/20"
          : "bg-signal-warn-soft ring-signal-warn/20",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
          tone === "risk"
            ? "bg-signal-risk/10 text-signal-risk"
            : "bg-signal-warn/10 text-signal-warn",
        )}
      >
        <Glyph name={glyph} className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[14px] font-semibold",
            tone === "risk" ? "text-signal-risk" : "text-signal-warn",
          )}
        >
          {title}
        </span>
        <span className="text-ink-600 mt-0.5 block truncate text-[12.5px]">{body}</span>
      </span>
    </Link>
  );
}
