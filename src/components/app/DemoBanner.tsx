import { Link } from "@/components/ui/Link";
import { Glyph } from "@/components/brand/Glyph";

/**
 * AVISO PERMANENTE DEL ÁREA DE CLIENTE.
 *
 * El área enseña un expediente inventado para poder evaluar la interfaz
 * antes de conectar la autenticación. Eso se dice en cada pantalla, no en una
 * nota al pie: un expediente que parece real y no lo es es justo lo que
 * erosiona la confianza en un producto así.
 *
 * ─── LO QUE CAMBIÓ Y POR QUÉ ────────────────────────────────────────────
 *
 * 1. Era una tarjeta negra de cinco líneas encima de otra tarjeta negra —«Lo
 *    que necesitamos de ti ahora»—. Dos bloques con el mismo peso visual
 *    compiten, y el que perdía era el importante. Ahora es una franja clara
 *    de una línea: se ve siempre, pero no manda.
 *
 * 2. Decía «la autenticación con Supabase está implementada pero no
 *    activada». Eso es una nota para el equipo técnico; a una persona que
 *    evalúa si confiar su residencia a este servicio no le dice nada.
 *
 * 3. Su botón, «Crear mi cuenta real», llevaba a un formulario que responde
 *    «autenticación no activada»: una promesa rota a dos pasos. Ahora lleva
 *    al diagnóstico, que es el primer paso real y funciona hoy.
 */
export function DemoBanner() {
  return (
    <div className="bg-surface ring-ink-900/[.08] mb-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-sm px-3.5 py-2.5 ring-1 ring-inset">
      <p className="text-ink-600 flex min-w-0 flex-1 items-center gap-2 text-[12.5px] leading-snug">
        <Glyph name="alert" className="text-ink-400 size-4 shrink-0" />
        <span>
          <strong className="text-ink-900 font-semibold">Demostración.</strong> Este expediente es
          inventado y no pertenece a nadie.
        </span>
      </p>
      <Link
        href="/diagnostico"
        className="text-brand-700 hover:text-brand-800 inline-flex shrink-0 items-center gap-1 py-1 pl-6 text-[12.5px] font-semibold sm:pl-0"
      >
        Empezar el mío <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
