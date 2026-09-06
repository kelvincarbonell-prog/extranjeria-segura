import { Link } from "@/components/ui/Link";
import { Plazo } from "@/components/contenido/Plazo";
import { FECHAS } from "@/content/regularizacion-2026";
import { cuentaAtras, parseDia } from "@/lib/plazos";

/**
 * FRANJA DE ACTUALIDAD CON PLAZO.
 *
 * Va inmediatamente después del hero, antes de cualquier argumento de venta,
 * y solo mientras el plazo siga vivo. Cuando el 30 de septiembre pase, este
 * componente devuelve `null` y desaparece de la portada sin que nadie tenga
 * que acordarse de quitarlo. Es la diferencia entre una urgencia real y un
 * banner que lleva dos años diciendo «última oportunidad».
 *
 * No usa rojo ni exclamaciones. La urgencia la comunica el número de días, que
 * es verdad y se puede comprobar.
 */
export function AvisoActualidad() {
  const { estado } = cuentaAtras(parseDia(FECHAS.finSubsanacion));
  if (estado === "vencido") return null;

  return (
    <section aria-label="Aviso de plazo abierto" className="border-ink-900/[.07] border-y">
      <div className="container-page py-4">
        <Link
          href="/regularizacion-2026"
          className="group flex flex-wrap items-center gap-x-4 gap-y-2.5"
        >
          <Plazo fecha={FECHAS.finSubsanacion} etiqueta="para subsanar la regularización" compacto />
          <p className="text-ink-600 group-hover:text-ink-900 min-w-0 flex-1 text-[14px] leading-snug transition-colors">
            <strong className="text-ink-900 font-semibold">Regularización extraordinaria 2026.</strong>{" "}
            Si presentaste y te han requerido documentación, si no te contestan o si te la han
            denegado, cada situación tiene su plazo.
          </p>
          <span className="text-brand-700 inline-flex shrink-0 items-center gap-1 text-[13.5px] font-medium">
            Ver mi situación
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
              <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
