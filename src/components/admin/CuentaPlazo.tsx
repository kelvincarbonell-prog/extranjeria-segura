import type { PlazoVivo } from "@/lib/vigilancia";
import { fechaLarga, parseDia } from "@/lib/plazos";
import { cn } from "@/lib/utils";

/**
 * LA CUENTA ATRÁS DE UN EXPEDIENTE, EN UNA SOLA FORMA.
 *
 * Tres pantallas del panel pintaban su propia versión de lo mismo, cada una
 * con su umbral y su redacción: el inicio decía «!» para lo vencido, la tabla
 * decía «1 d vencido» y el tablero «1d vencido». Tres formas de escribir el
 * mismo dato son tres oportunidades de que una se quede atrás, y en un panel
 * de plazos eso no es un detalle de estilo.
 *
 * El umbral crítico tampoco se decide aquí: viene de `cuenta.critico`, que lo
 * fija `plazos.ts` en un único sitio para todo el producto.
 *
 * ─── POR QUÉ EL TÍTULO LLEVA LA FECHA Y LA NORMA ────────────────────────
 *
 * «6 d» no se puede comprobar. El `title` y el texto accesible dicen qué
 * vence, qué día y con qué norma detrás, para que quien organiza su semana
 * con esto pueda contrastarlo sin abrir el expediente. Y si la norma todavía
 * no está verificada por el equipo, lo dice.
 */
export function CuentaPlazo({ plazo, className }: { plazo?: PlazoVivo; className?: string }) {
  if (!plazo) {
    return (
      <span className={cn("text-ink-400 text-[12.5px]", className)} title="Sin plazo vivo">
        —
      </span>
    );
  }

  const { cuenta } = plazo;

  const texto =
    cuenta.estado === "vencido"
      ? `${Math.abs(cuenta.dias)} d vencido`
      : cuenta.estado === "ultimo-dia"
        ? "hoy"
        : `${cuenta.dias} d`;

  /**
   * Lo esencial, y lo que se lee en voz alta: qué vence, qué día, y la
   * reserva si la hay.
   *
   * La norma completa no entra aquí. «Ley 39/2015, de 1 de octubre, del
   * Procedimiento Administrativo Común de las Administraciones Públicas»
   * leída doce veces seguidas —una por fila de la tabla— hace inservible la
   * pantalla con lector de pantalla. Va en el `title`, para quien pasa el
   * ratón, y entera en /admin/plazos, que es donde se consulta a propósito.
   */
  const esencial = [
    `${plazo.titulo}: vence el ${fechaLarga(parseDia(plazo.vence))}`,
    plazo.verificado ? null : "referencia por verificar",
  ]
    .filter(Boolean)
    .join(" · ");

  const detalle = [
    esencial,
    `${plazo.norma.norma}${plazo.articulo ? `, art. ${plazo.articulo.replace(/^a/, "")}` : ""}`,
  ].join(" · ");

  return (
    <span
      title={detalle}
      className={cn(
        // `relative` no es decorativo: `sr-only` es `position: absolute`, y sin
        // un ancestro posicionado su bloque contenedor es el elemento raíz. En
        // el tablero del pipeline —que se desplaza en horizontal— eso sacaba el
        // texto para lector de pantalla FUERA del scroller, a unos 2.900 px del
        // origen, y ensanchaba el documento entero: 2.347 px de desbordamiento
        // a 360 px de ancho, con la página renderizada en miniatura. El
        // `overflow-x` del scroller no lo recortaba porque un absoluto solo lo
        // recortan los ancestros de su bloque contenedor, y ninguno lo era.
        // Con `relative` el bloque contenedor pasa a ser este badge, que sí
        // está dentro del scroller. Lo detectó `npm run audit:movil`.
        "data relative inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
        cuenta.estado === "vencido"
          ? "bg-signal-risk-soft text-signal-risk"
          : cuenta.critico
            ? "bg-signal-warn-soft text-signal-warn"
            : "bg-ink-50 text-ink-500",
        className,
      )}
    >
      {texto}
      {/* El asterisco marca un plazo cuya norma nadie del equipo ha
          contrastado todavía. Se enseña igual —esconderlo sería peor—, pero
          se enseña con la reserva puesta. */}
      {!plazo.verificado && <span aria-hidden="true">*</span>}
      <span className="sr-only"> — {esencial}</span>
    </span>
  );
}
