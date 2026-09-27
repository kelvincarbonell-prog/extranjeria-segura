import { Badge } from "@/components/ui/primitives";
import { ETIQUETA_ESTADO, TONO_ESTADO, type Preparacion } from "@/lib/preparacion";
import { cn } from "@/lib/utils";

/**
 * EL ESTADO DE PREPARACIÓN, EN UNA ETIQUETA Y UNA FRACCIÓN.
 *
 * «7 de 8» dice cuánto falta; la etiqueta dice de quién depende. Las dos
 * juntas evitan la pregunta que obliga a abrir el expediente.
 *
 * La fracción se marca como número (`data`) y con `numeros`, que aísla la
 * dirección del texto: dentro de una página en árabe, «7 de 8» sin aislar lo
 * reordena el algoritmo bidi y se lee «8 de 7».
 */
export function EstadoPreparacion({
  preparacion,
  className,
}: {
  preparacion: Preparacion;
  className?: string;
}) {
  const { estado, validados, requeridos } = preparacion;

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <Badge tone={TONO_ESTADO[estado]}>{ETIQUETA_ESTADO[estado]}</Badge>
      {requeridos > 0 && estado !== "presentado" && (
        <span className="data numeros text-ink-400 text-[11.5px] font-semibold">
          {validados} de {requeridos}
        </span>
      )}
    </span>
  );
}

/**
 * La barra de avance documental.
 *
 * Sin número encima a propósito: el número ya está al lado y repetirlo en un
 * porcentaje invitaría a leerlo como probabilidad de éxito, que es justo lo
 * que este producto no calcula.
 */
export function BarraPreparacion({ preparacion }: { preparacion: Preparacion }) {
  const { validados, requeridos, estado } = preparacion;
  if (requeridos === 0) return null;
  const pct = Math.round((validados / requeridos) * 100);

  return (
    <span
      role="img"
      aria-label={`${validados} de ${requeridos} documentos validados`}
      className="bg-ink-100 block h-1 w-full overflow-hidden rounded-full"
    >
      <span
        className={cn(
          "block h-full rounded-full transition-[width] duration-500",
          estado === "listo" ? "bg-signal-ok" : "bg-ink-800",
        )}
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}
