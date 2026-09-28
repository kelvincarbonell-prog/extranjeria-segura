import { Link } from "@/components/ui/Link";
import { SoloCon } from "@/components/admin/SoloCon";
import { DEMO_PIPELINE, expedientesDemo, PIPELINE_STAGES } from "@/content/demo";
import { Card, Badge } from "@/components/ui/primitives";
import { ExportarCSV } from "@/components/admin/ExportarCSV";
import { ETIQUETA_ESTADO } from "@/lib/preparacion";
import { CuentaPlazo } from "@/components/admin/CuentaPlazo";
import { EstadoPreparacion, BarraPreparacion } from "@/components/admin/Preparacion";
import { plazoPrincipal } from "@/lib/vigilancia";
import { ordenDelDia, motivoDelOrden } from "@/lib/orden-del-dia";
import { filtrarAsignados, filtrarAsignadosPorOwner } from "@/lib/mis-expedientes";
import { rolDemo } from "@/lib/rol-demo";
import { cn } from "@/lib/utils";

export const metadata = { title: "Expedientes" };

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, s.label]));

/**
 * LA LISTA DE EXPEDIENTES, ORDENADA POR LO QUE HAY QUE HACER.
 *
 * Antes ordenaba solo por plazo y se servía como una tabla de 860 px dentro
 * de un contenedor con desplazamiento horizontal. En un teléfono eso son ocho
 * columnas que hay que arrastrar para leer, cuando la pregunta que se hace
 * quien abre esto en el metro es una sola: ¿qué hago ahora?
 *
 * Dos cambios, y el segundo depende del primero:
 *
 *  1. ORDEN. Lo irreversible primero —un plazo vencido o a siete días—, y el
 *     resto por esfuerzo: lo que una firma cierra antes que lo que necesita
 *     seis documentos del cliente. Ver `orden-del-dia.ts`.
 *
 *  2. FORMA. Por debajo de `sm` deja de ser tabla y pasa a ser una lista de
 *     tarjetas, cada una con la frase de qué toca hacer. La tabla sigue
 *     existiendo desde `sm`, donde caben las ocho columnas y comparar filas
 *     tiene sentido.
 *
 * No es la tabla apilada de `globals.css`: allí se conserva el `<table>`
 * porque la relación encabezado-celda es la información. Aquí lo que importa
 * en móvil no es la fila entera sino una frase por expediente, así que el
 * marcado que sirve es una lista.
 */
async function ExpedientesPageInterior() {
  const rol = await rolDemo();

  const cartera = filtrarAsignadosPorOwner(DEMO_PIPELINE, rol);
  const expedientes = filtrarAsignados(expedientesDemo(), rol);
  const plazos = plazoPrincipal(expedientes);

  const porId = new Map(cartera.map((c) => [c.id, c]));
  const filas = ordenDelDia(
    expedientes.map((e) => ({ expediente: e, plazo: plazos.get(e.id) })),
  ).filter((f) => porId.has(f.expediente.id));

  const listos = filas.filter((f) => f.preparacion.estado === "listo").length;
  const urgentes = filas.filter((f) => f.urgente).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
            Expedientes
          </h1>
          {/* Qué orden es, dicho. Una lista ordenada por un criterio invisible
              parece arbitraria, y lo que parece arbitrario se reordena a mano. */}
          <p className="text-ink-500 mt-1.5 max-w-xl text-[14px] leading-relaxed">
            {filas.length} expedientes. Primero lo que no admite espera
            {urgentes > 0 ? ` (${urgentes})` : ""}; después, lo que se cierra con menos trabajo
            {listos > 0 ? `, empezando por ${listos} listo${listos === 1 ? "" : "s"} para presentar` : ""}.
          </p>
        </div>
        <ExportarCSV
          nombre={`expedientes-${new Date().toISOString().slice(0, 10)}`}
          cabecera={[
            "Referencia",
            "Cliente",
            "Trámite",
            "Fase",
            "Qué toca",
            "Estado",
            "Validados",
            "Requeridos",
            "Plazo",
            "Vence",
            "Días",
            "Responsable",
          ]}
          filas={filas.map((f) => {
            const c = porId.get(f.expediente.id)!;
            const p = plazos.get(c.id);
            return [
              c.reference,
              c.client,
              c.tramite,
              STAGE_LABEL[c.stage],
              motivoDelOrden(f),
              ETIQUETA_ESTADO[f.preparacion.estado],
              f.preparacion.validados,
              f.preparacion.requeridos,
              p?.titulo ?? "",
              p?.vence ?? "",
              p ? p.cuenta.dias : "",
              c.owner,
            ];
          })}
        />
      </div>

      {/* ───────── Móvil: una tarjeta por expediente ───────── */}
      <ul className="flex flex-col gap-2.5 sm:hidden">
        {filas.map((f) => {
          const c = porId.get(f.expediente.id)!;
          return (
            <li key={f.expediente.id}>
              {/* La tarjeta entera abre la ficha: en móvil no hay nombre
                  pequeño que acertar con el dedo. */}
              <Link href={`/admin/expedientes/${c.id}`} className="block rounded-lg">
              <Card padding="none" className="active:bg-canvas-deep p-4 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-ink-900 truncate text-[15px] font-semibold">{c.client}</p>
                    <p className="text-ink-500 mt-0.5 truncate text-[12.5px]">
                      <span className="data">{c.reference}</span> · {c.tramite}
                    </p>
                  </div>
                  <CuentaPlazo plazo={plazos.get(c.id)} className="shrink-0" />
                </div>

                <p
                  className={cn(
                    "mt-3 text-[13.5px] leading-snug font-medium",
                    f.urgente ? "text-signal-risk" : "text-ink-700",
                  )}
                >
                  {motivoDelOrden(f)}
                </p>

                <div className="mt-3">
                  <BarraPreparacion preparacion={f.preparacion} />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <EstadoPreparacion preparacion={f.preparacion} />
                    <span
                      className={cn(
                        "text-[12px]",
                        c.owner === "Sin asignar" ? "text-signal-warn font-medium" : "text-ink-400",
                      )}
                    >
                      {c.owner}
                    </span>
                  </div>
                </div>
              </Card>
              </Link>
            </li>
          );
        })}
        {filas.length === 0 && (
          <li>
            <SinExpedientes />
          </li>
        )}
      </ul>

      {/* ───────── Tablet y escritorio: la tabla ───────── */}
      <Card padding="none" className="hidden overflow-hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">
              Expedientes ordenados por urgencia y después por trabajo pendiente
            </caption>
            <thead>
              <tr className="border-ink-100 border-b">
                {["Cliente", "Trámite", "Qué toca", "Preparación", "Plazo", "Responsable", "Último movimiento"].map(
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
              {filas.map((f) => {
                const c = porId.get(f.expediente.id)!;
                return (
                  <tr key={f.expediente.id} className="hover:bg-canvas-deep transition-colors">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/expedientes/${c.id}`}
                        className="text-ink-900 hover:text-brand-700 block text-[13.5px] font-medium"
                      >
                        {c.client}
                        <span className="data text-ink-400 block text-[11.5px] font-normal">
                          {c.reference}
                        </span>
                      </Link>
                    </td>
                    <td className="text-ink-600 px-4 py-3.5 text-[13px]">
                      {c.tramite}
                      <Badge tone="neutral" className="mt-1 block w-fit">
                        {STAGE_LABEL[c.stage]}
                      </Badge>
                    </td>
                    <td
                      className={cn(
                        "max-w-[260px] px-4 py-3.5 text-[13px] leading-snug",
                        f.urgente ? "text-signal-risk font-medium" : "text-ink-700",
                      )}
                    >
                      {motivoDelOrden(f)}
                    </td>
                    <td className="w-[150px] px-4 py-3.5">
                      <BarraPreparacion preparacion={f.preparacion} />
                      <span className="mt-1.5 block">
                        <EstadoPreparacion preparacion={f.preparacion} />
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <CuentaPlazo plazo={plazos.get(c.id)} />
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3.5 text-[13px]",
                        c.owner === "Sin asignar" ? "text-signal-warn font-medium" : "text-ink-600",
                      )}
                    >
                      {c.owner}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3.5 text-[12.5px] whitespace-nowrap",
                        c.movimientoHaceDias >= 7 ? "text-signal-warn font-medium" : "text-ink-400",
                      )}
                    >
                      {haceDias(c.movimientoHaceDias)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filas.length === 0 && <SinExpedientes />}
      </Card>

      <p className="text-ink-400 text-[12px] leading-relaxed">
        La preparación cuenta documentos aportados y validados frente a los que exige el trámite.
        No es una previsión de resultado: nadie puede calcular eso, y este producto no publica
        cifras que no pueda sostener.
      </p>
    </div>
  );
}

/** «hoy», «ayer», «hace 5 días»: cuánto lleva quieto, que es lo que se mira. */
function haceDias(n: number): string {
  if (n <= 0) return "hoy";
  if (n === 1) return "ayer";
  return `hace ${n} días`;
}

function SinExpedientes() {
  return (
    <p className="text-ink-500 px-4 py-8 text-center text-[13.5px]">
      No hay ningún expediente asignado a ti. Tu rol ve los expedientes de los que es responsable;
      quien administra la cuenta los asigna.
    </p>
  );
}

/** La pantalla solo se renderiza si el rol activo tiene «documentos». */
export default function ExpedientesPage() {
  return (
    <SoloCon permiso="documentos">
      <ExpedientesPageInterior />
    </SoloCon>
  );
}
