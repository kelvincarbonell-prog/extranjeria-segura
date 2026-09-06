import { site, reviewedBy } from "@/content/site";
import { formatDateES } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * SELLO DE REVISIÓN (A7).
 *
 * Lo que había antes era «Pendiente de la validación y firma del profesional
 * responsable», repetido en 25 páginas indexables y además como distintivo en
 * cada tarjeta de listado. Era honesto y era un error: le estaba diciendo a
 * Google, en un sector donde la evaluación de calidad es la más estricta que
 * existe, que el contenido no está validado. La frase no describía el
 * contenido, describía lo que le falta.
 *
 * El arreglo no es mentir. Es decir lo que sí es verdad, que es bastante:
 * cada afirmación tiene su norma citada, cada página tiene fecha de revisión y
 * la metodología está publicada. Eso es una afirmación positiva, comprobable y
 * más informativa que la anterior.
 *
 * La reserva sigue estando —quien lee esto merece saber que ningún colegiado
 * ha firmado todavía— pero una vez, en el pie de la página, donde va una nota
 * legal; no como distintivo en cada tarjeta de un listado, donde no informaba
 * de nada y sí penalizaba a todas.
 *
 * Cuando `site.review.reviewer` tenga nombre y número de colegiado, este
 * componente pasa solo a la versión firmada. No hay nada más que tocar.
 */
export function AvisoRevision({
  revisado,
  actualizado,
  className,
  variante = "bloque",
}: {
  /** ¿Ha firmado un profesional colegiado identificable? */
  revisado: boolean;
  /** Fecha ISO de última revisión del contenido. */
  actualizado?: string;
  className?: string;
  variante?: "bloque" | "linea";
}) {
  const firmante = site.review.reviewer;

  if (revisado && firmante) {
    return (
      <p
        className={cn(
          "text-ink-500 text-[13px] leading-relaxed",
          variante === "bloque" && "border-ink-900/10 rounded-md border p-4",
          className,
        )}
      >
        Contenido revisado y firmado por <strong className="text-ink-700">{reviewedBy()}</strong>
        {actualizado && (
          <>
            {" "}
            · Última revisión: <time dateTime={actualizado}>{formatDateES(actualizado)}</time>
          </>
        )}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "text-[13px] leading-relaxed",
        variante === "bloque" && "border-ink-900/10 bg-ink-50/60 rounded-md border p-4",
        className,
      )}
    >
      <p className="text-ink-700">
        <strong className="font-semibold">Cómo se ha escrito esta página.</strong> Cada afirmación
        con cifra, plazo o artículo lleva citada la norma que la respalda, enlazada al texto
        consolidado del BOE cuando disponemos del identificador verificado.
        {actualizado && (
          <>
            {" "}
            Última revisión: <time dateTime={actualizado}>{formatDateES(actualizado)}</time>.
          </>
        )}
      </p>
      <p className="text-ink-500 mt-2">
        Tiene carácter orientativo y no constituye asesoramiento jurídico. Todavía no lleva la firma
        de un profesional colegiado a título personal; hasta entonces, la responsabilidad editorial
        es de {reviewedBy()}. Antes de presentar un escrito, comprueba la norma vigente ese día.
      </p>
    </div>
  );
}
