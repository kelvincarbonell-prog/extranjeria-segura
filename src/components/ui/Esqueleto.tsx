import { cn } from "@/lib/utils";

/**
 * ESQUELETOS DE CARGA.
 *
 * ─── POR QUÉ NO HAY NINGÚN GIRADOR EN ESTE ARCHIVO ──────────────────────
 *
 * Un girador dice «espera» y no dice nada más: ni cuánto, ni qué viene, ni si
 * la pantalla va a cambiar de sitio cuando llegue. Un esqueleto con la forma
 * de lo que va a aparecer dice las tres cosas a la vez, y además reserva el
 * hueco: cuando llega el contenido no salta nada.
 *
 * Es lo que hacen las plataformas que se sienten rápidas sin serlo más.
 *
 * ─── EL DETALLE QUE CASI TODO EL MUNDO SE SALTA ─────────────────────────
 *
 * Un esqueleto que parpadea ochenta milisegundos se lee como un fallo, no
 * como una carga. Molesta más que no poner nada.
 *
 * Por eso estos nacen transparentes y aparecen a los 140 ms, con una
 * animación de CSS y sin una línea de JavaScript: si la pantalla llega antes
 * —que es lo normal—, el esqueleto no se llega a ver nunca. Solo aparece
 * cuando de verdad hay una espera, que es exactamente cuando hace falta.
 *
 * ─── Y EL SEGUNDO ──────────────────────────────────────────────────────
 *
 * El brillo se apaga con `prefers-reduced-motion`. Una animación en bucle a
 * pantalla completa es de las que provocan mareo, y aquí se muestra justo
 * cuando alguien está esperando y mirando fijamente.
 */

/** Una pieza gris con la forma de lo que va a llegar. */
export function Hueso({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("esqueleto block rounded-md", className)} />;
}

/**
 * Envoltura de una pantalla en carga.
 *
 * Lleva el `role="status"` y el texto para lector de pantalla: quien no ve el
 * esqueleto necesita que se le diga que hay algo cargando, y una sola vez, no
 * una por cada hueso.
 */
export function Cargando({
  children,
  etiqueta = "Cargando",
  className,
}: {
  children: React.ReactNode;
  etiqueta?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-carga="esqueleto"
      className={cn("esqueleto-entra", className)}
    >
      <span className="sr-only">{etiqueta}</span>
      {children}
    </div>
  );
}

/** Cabecera de pantalla: título y frase de apoyo. */
export function HuesoCabecera() {
  return (
    <div className="flex flex-col gap-2.5">
      <Hueso className="h-7 w-48 md:h-8 md:w-56" />
      <Hueso className="h-4 w-full max-w-md" />
    </div>
  );
}

/** Tarjeta de expediente, con la misma altura que la de verdad. */
export function HuesoTarjeta() {
  return (
    <div className="bg-surface ring-ink-900/[.06] rounded-lg p-4 ring-1 ring-inset">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Hueso className="h-4 w-32" />
          <Hueso className="mt-2 h-3 w-48" />
        </div>
        <Hueso className="h-5 w-16 shrink-0 rounded-full" />
      </div>
      <Hueso className="mt-3.5 h-3.5 w-full max-w-[260px]" />
      <Hueso className="mt-3.5 h-1 w-full rounded-full" />
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <Hueso className="h-5 w-28 rounded-full" />
        <Hueso className="h-3 w-14" />
      </div>
    </div>
  );
}

/** Fila de métricas del panel. */
export function HuesoMetricas({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="bg-surface ring-ink-900/[.06] rounded-lg p-4 ring-1 ring-inset">
          <Hueso className="size-9 rounded-[11px]" />
          <Hueso className="mt-4 h-7 w-12" />
          <Hueso className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Tarjeta con lista dentro: la cola de trabajo, los plazos, los avisos. */
export function HuesoLista({ filas = 4 }: { filas?: number }) {
  return (
    <div className="bg-surface ring-ink-900/[.06] overflow-hidden rounded-lg ring-1 ring-inset">
      <div className="border-ink-100 border-b px-5 py-4">
        <Hueso className="h-4 w-32" />
        <Hueso className="mt-2 h-3 w-44" />
      </div>
      <div className="divide-ink-100 divide-y">
        {Array.from({ length: filas }, (_, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5">
            <Hueso className="h-5 w-14 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Hueso className="h-3.5 w-28" />
              <Hueso className="mt-2 h-3 w-full max-w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
