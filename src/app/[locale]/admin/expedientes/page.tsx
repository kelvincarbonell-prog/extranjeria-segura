import { Link } from "@/components/ui/Link";
import { DEMO_PIPELINE, PIPELINE_STAGES } from "@/content/demo";
import { Card, Badge, DemoTag } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { eur, formatDateES, cn } from "@/lib/utils";

export const metadata = { title: "Expedientes" };

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, s.label]));

export default function ExpedientesPage() {
  const rows = [...DEMO_PIPELINE].sort((a, b) => {
    const as = a.slaDays ?? 999;
    const bs = b.slaDays ?? 999;
    return as - bs;
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
            Expedientes
          </h1>
          <p className="text-ink-500 mt-1.5 text-[14.5px]">
            {rows.length} expedientes, ordenados por proximidad del plazo.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <DemoTag label="Datos de demostración" />
          <Button size="sm" variant="secondary">
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-ink-100 border-b">
                {["Referencia", "Cliente", "Trámite", "Fase", "Responsable", "Plazo", "Valor", "Actualizado"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="text-ink-400 px-4 py-3 text-[11px] font-bold tracking-[0.09em] uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-ink-100 divide-y">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-canvas-deep transition-colors">
                  <td className="px-4 py-3.5">
                    <Link
                      href="/admin/pipeline"
                      className="data text-brand-600 hover:text-brand-800 tap inline-block text-[12.5px] font-semibold"
                    >
                      {c.reference}
                    </Link>
                  </td>
                  <td className="text-ink-900 px-4 py-3.5 text-[13.5px] font-medium">{c.client}</td>
                  <td className="text-ink-600 px-4 py-3.5 text-[13px]">{c.tramite}</td>
                  <td className="px-4 py-3.5">
                    <Badge tone="neutral">{STAGE_LABEL[c.stage]}</Badge>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3.5 text-[13px]",
                      c.owner === "Sin asignar" ? "text-signal-warn font-medium" : "text-ink-600",
                    )}
                  >
                    {c.owner}
                  </td>
                  <td className="px-4 py-3.5">
                    {c.slaDays === null ? (
                      <span className="text-ink-300 text-[12.5px]">—</span>
                    ) : (
                      <span
                        className={cn(
                          "data rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
                          c.slaDays < 0
                            ? "bg-signal-risk-soft text-signal-risk"
                            : c.slaDays <= 2
                              ? "bg-signal-warn-soft text-signal-warn"
                              : "bg-ink-50 text-ink-500",
                        )}
                      >
                        {c.slaDays < 0 ? `${Math.abs(c.slaDays)} d vencido` : `${c.slaDays} d`}
                      </span>
                    )}
                  </td>
                  <td className="text-ink-800 data px-4 py-3.5 text-[13px] font-semibold">
                    {c.valueCents > 0 ? eur(c.valueCents) : "—"}
                  </td>
                  <td className="text-ink-400 px-4 py-3.5 text-[12.5px]">
                    {formatDateES(c.updatedAt, "short")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
