import { Cargando, HuesoCabecera, HuesoTarjeta } from "@/components/ui/Esqueleto";

/**
 * El esqueleto copia la forma de la pantalla real, no una genérica.
 *
 * En móvil la lista de expedientes son tarjetas y desde `sm` es una tabla, así
 * que el esqueleto hace lo mismo. Uno que no coincide con lo que llega después
 * provoca un salto al sustituirse, y un salto cancela justo la sensación de
 * fluidez que se venía a comprar.
 */
export default function CargandoExpedientes() {
  return (
    <Cargando etiqueta="Cargando los expedientes" className="mx-auto flex max-w-7xl flex-col gap-5">
      <HuesoCabecera />
      <ul className="flex flex-col gap-2.5 sm:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i}>
            <HuesoTarjeta />
          </li>
        ))}
      </ul>
      <div className="bg-surface ring-ink-900/[.06] hidden overflow-hidden rounded-lg ring-1 ring-inset sm:block">
        <div className="border-ink-100 flex gap-4 border-b px-4 py-3">
          {[90, 110, 140, 90, 60, 80, 70].map((w, i) => (
            <span key={i} className="esqueleto block h-2.5 rounded" style={{ width: w }} />
          ))}
        </div>
        <div className="divide-ink-100 divide-y">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              {[90, 110, 140, 90, 60, 80, 70].map((w, j) => (
                <span key={j} className="esqueleto block h-3.5 rounded" style={{ width: w }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Cargando>
  );
}
