import { cn, formatDateES } from "@/lib/utils";

/**
 * «LO ESENCIAL EN 30 SEGUNDOS» (A4).
 *
 * Bloque de respuesta directa, antes del primer scroll. Es la unidad que los
 * buscadores generativos extraen literalmente, y también lo único que va a
 * leer quien llega con un requerimiento en la mano y ocho días de plazo.
 *
 * Regla de escritura, no negociable: cada punto debe poder leerse fuera de
 * contexto y contener al menos una cifra o una norma. Un punto sin cifra ni
 * artículo no es esencial, es relleno, y compite por la atención con los que
 * sí lo son.
 *
 * La regla se comprueba en `scripts/audit-contenido.mjs`, no solo se enuncia
 * en un comentario: un bloque sin cifras falla la auditoría.
 */
export function LoEsencial({
  puntos,
  actualizado,
  titulo = "Lo esencial en 30 segundos",
  className,
}: {
  puntos: string[];
  /** Fecha ISO de última revisión del bloque. */
  actualizado?: string;
  titulo?: string;
  className?: string;
}) {
  return (
    <aside
      aria-label={titulo}
      className={cn(
        "border-brand-200/70 bg-brand-50/50 relative overflow-hidden rounded-lg border p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-ink-900 font-display text-[15px] font-bold tracking-[-0.01em]">
          {titulo}
        </h2>
        {actualizado && (
          <p className="text-ink-500 text-[12.5px]">
            Revisado el{" "}
            <time dateTime={actualizado}>{formatDateES(actualizado)}</time>
          </p>
        )}
      </div>

      <ul className="space-y-2.5">
        {puntos.map((p) => (
          <li key={p} className="text-ink-700 flex gap-2.5 text-[14.5px] leading-relaxed">
            <span aria-hidden className="bg-brand-500 mt-[9px] size-1.5 shrink-0 rounded-full" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
