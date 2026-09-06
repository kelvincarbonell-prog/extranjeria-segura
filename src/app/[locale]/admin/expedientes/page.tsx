import { Link } from "@/components/ui/Link";
import { DEMO_PIPELINE, DEMO_EXPEDIENTES, PIPELINE_STAGES } from "@/content/demo";
import { Card, Badge, DemoTag } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { CuentaPlazo } from "@/components/admin/CuentaPlazo";
import { plazoPrincipal } from "@/lib/vigilancia";
import { eur, formatDateES, cn } from "@/lib/utils";

export const metadata = { title: "Expedientes" };

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, s.label]));

/** Un expediente sin plazo vivo va al final, no al principio con un cero. */
const SIN_PLAZO = Number.MAX_SAFE_INTEGER;

export default function ExpedientesPage() {
  // El plazo se deriva de los hechos en cada render. Antes se leía de un campo
  // guardado que dejaba de ser cierto al día siguiente de escribirlo.
  const plazos = plazoPrincipal(DEMO_EXPEDIENTES);

  const rows = [...DEMO_PIPELINE].sort(
    (a, b) =>
      (plazos.get(a.id)?.cuenta.dias ?? SIN_PLAZO) - (plazos.get(b.id)?.cuenta.dias ?? SIN_PLAZO),
  );

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
                    <CuentaPlazo plazo={plazos.get(c.id)} />
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
