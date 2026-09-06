import { cuentaAtras, fechaLarga, parseDia } from "@/lib/plazos";
import { cn } from "@/lib/utils";

/**
 * CONTADOR DE PLAZO REAL (A3).
 *
 * Urgencia verdadera, que es la única que encaja con el tono de este producto.
 * No hay «¡solo quedan 3 plazas!»: hay una fecha que está en el BOE y una
 * resta. Si el plazo vence, el componente desaparece solo en el siguiente
 * despliegue en lugar de mentir sobre una urgencia que ya pasó.
 *
 * Se renderiza en el servidor a propósito. Un contador en el cliente parpadea
 * en la hidratación —primero nada, después el número— justo en el elemento que
 * más urgencia comunica; y calcular la fecha en el navegador del usuario hace
 * que un reloj mal puesto muestre un plazo equivocado. La fecha de referencia
 * es la del despliegue, y como el sitio se despliega en cada cambio, el desfase
 * máximo es de un día en una página que además muestra la fecha exacta.
 */
export function Plazo({
  fecha,
  etiqueta,
  detalle,
  className,
  compacto = false,
}: {
  /** Fecha ISO de vencimiento. */
  fecha: string;
  etiqueta: string;
  detalle?: string;
  className?: string;
  compacto?: boolean;
}) {
  const { dias, estado, critico } = cuentaAtras(parseDia(fecha));

  // Un plazo vencido no se muestra: no aporta nada y confunde.
  if (estado === "vencido") return null;

  const tono = critico
    ? "border-signal-risk/25 bg-signal-risk-soft"
    : "border-signal-warn/25 bg-signal-warn-soft";

  const numero = estado === "ultimo-dia" ? "Hoy" : String(dias);
  const unidad = estado === "ultimo-dia" ? "último día" : dias === 1 ? "día" : "días";

  if (compacto) {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1.5 rounded-[7px] border px-2 py-1 text-[13px]",
          tono,
          className,
        )}
      >
        <strong className={cn("font-semibold", critico ? "text-signal-risk" : "text-signal-warn")}>
          {numero} {unidad}
        </strong>
        <span className="text-ink-500">· {etiqueta}</span>
      </span>
    );
  }

  return (
    <div className={cn("rounded-lg border p-4 sm:p-5", tono, className)}>
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "font-display text-[34px] leading-none font-extrabold tabular-nums",
            critico ? "text-signal-risk" : "text-signal-warn",
          )}
        >
          {numero}
        </span>
        <span className="text-ink-700 text-[15px] font-medium">
          {unidad} {estado === "ultimo-dia" ? "" : "restantes"}
        </span>
      </div>
      <p className="text-ink-800 mt-2 text-[14.5px] font-medium">{etiqueta}</p>
      <p className="text-ink-500 mt-1 text-[13px]">
        Vence el <time dateTime={fecha}>{fechaLarga(parseDia(fecha))}</time>
        {detalle ? ` · ${detalle}` : ""}
      </p>
    </div>
  );
}
