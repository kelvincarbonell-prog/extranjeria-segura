import { Link } from "@/components/ui/Link";
import {
  colaVerificacion,
  resumenVerificacion,
  ETIQUETAS_TIPO,
  ETIQUETAS_PRIORIDAD,
  type Pendiente,
} from "@/content/verificacion";
import { boeUrl } from "@/content/fuentes";
import { Card, Badge } from "@/components/ui/primitives";
import { formatDateES } from "@/lib/utils";

export const metadata = { title: "Verificación de contenido" };

/**
 * COLA DE VERIFICACIÓN JURÍDICA.
 *
 * La auditoría dice que reescribir las 25 fichas con cifras y artículos es la
 * tarea de mayor impacto absoluto, y su última página avisa de que el riesgo
 * no es dar números sino dar números equivocados. Las dos cosas son verdad.
 *
 * La respuesta a esa tensión no es escribir las cifras y esperar: es separar
 * quién escribe de quién verifica, y convertir «revisar el contenido del
 * sitio» —que es una tarea infinita que nadie empieza nunca— en una lista
 * concreta, ordenada y con final.
 *
 * Cada línea dice qué comprobar, contra qué norma, dónde está publicado y por
 * qué corre prisa. El orden lo decide cuánta gente lo está leyendo hoy: las
 * normas del procedimiento con el plazo abierto van antes que una plantilla
 * legal que nadie abre.
 *
 * La lista se calcula del contenido real en cada build, no se mantiene a mano.
 * Cuando alguien marca un dato como verificado en el código, desaparece de
 * aquí solo. Una lista de tareas que hay que actualizar aparte de la cosa que
 * describe siempre acaba mintiendo.
 */
export default function VerificacionPage() {
  const cola = colaVerificacion();
  const resumen = resumenVerificacion();

  const porPrioridad = [1, 2, 3].map((p) => ({
    prioridad: p as 1 | 2 | 3,
    items: cola.filter((c) => c.prioridad === p),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-ink-950 font-display text-[26px] font-extrabold tracking-[-0.03em]">
          Verificación de contenido
        </h1>
        <p className="text-ink-600 mt-2 max-w-2xl text-[15px] leading-relaxed">
          Todo lo que un profesional tiene que comprobar antes de que el contenido publicado pueda
          considerarse verificado. Se calcula del contenido real en cada despliegue: al marcar algo
          como verificado en el código, desaparece de esta lista sola.
        </p>
      </header>

      <div className="mb-9 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Pendientes
          </p>
          <p className="text-ink-950 font-display mt-1.5 text-[28px] leading-none font-extrabold tabular-nums">
            {resumen.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Con plazo abierto
          </p>
          <p className="text-signal-warn font-display mt-1.5 text-[28px] leading-none font-extrabold tabular-nums">
            {resumen.porPrioridad[1]}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Fuentes consultadas
          </p>
          <p className="text-ink-700 mt-2 text-[14px]">{formatDateES(resumen.consultado)}</p>
        </Card>
      </div>

      {resumen.total === 0 && (
        <Card className="p-6">
          <p className="text-ink-700 text-[15px]">
            No queda nada por verificar. Todas las normas citadas tienen su identificador de BOE,
            todas las cifras están contrastadas y todas las fichas están firmadas.
          </p>
        </Card>
      )}

      {porPrioridad.map(({ prioridad, items }) =>
        items.length === 0 ? null : (
          <section key={prioridad} className="mb-10">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-ink-900 text-[17px] font-bold tracking-[-0.02em]">
                {ETIQUETAS_PRIORIDAD[prioridad]}
              </h2>
              <span className="text-ink-400 text-[13px] tabular-nums">{items.length}</span>
            </div>

            <ul className="space-y-2.5">
              {items.map((p) => (
                <li key={p.id}>
                  <Fila pendiente={p} />
                </li>
              ))}
            </ul>
          </section>
        ),
      )}

      <section className="border-ink-900/10 mt-12 border-t pt-6">
        <h2 className="text-ink-900 text-[15px] font-semibold">Cómo se usa esta lista</h2>
        <ol className="text-ink-600 mt-3 space-y-2 text-[14px] leading-relaxed">
          <li>
            <strong className="text-ink-800">1.</strong> Abre la norma en el BOE por el enlace de la
            fila, o búscala si todavía no tiene identificador.
          </li>
          <li>
            <strong className="text-ink-800">2.</strong> Contrasta la afirmación contra el texto
            consolidado, no contra la versión publicada en su día.
          </li>
          <li>
            <strong className="text-ink-800">3.</strong> Si es correcta, se marca{" "}
            <code className="data text-ink-500">verificado: true</code> en el archivo de contenido y
            deja de mostrarse el aviso al usuario. Si no lo es, se corrige el texto.
          </li>
        </ol>
        <p className="text-ink-500 mt-4 text-[13.5px] leading-relaxed">
          Mientras algo esté en esta lista, la página que lo contiene lo dice delante del lector con
          un distintivo de «referencia por verificar». No se esconde: en un sector donde un plazo
          mal contado cuesta un expediente, decir «esto aún no lo hemos comprobado» vale más que
          aparentar una certeza que no se tiene.
        </p>
      </section>
    </div>
  );
}

function Fila({ pendiente: p }: { pendiente: Pendiente }) {
  const enlaceBoe = p.fuente ? boeUrl(p.fuente) : null;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Badge tone={p.prioridad === 1 ? "warn" : "neutral"}>{ETIQUETAS_TIPO[p.tipo]}</Badge>
        <Link
          href={p.ruta}
          className="text-brand-700 hover:text-brand-800 tap text-[13px] font-medium"
        >
          Ver publicado
        </Link>
      </div>

      <p className="text-ink-800 mt-2.5 text-[14.5px] leading-relaxed">{p.que}</p>

      <dl className="text-ink-500 mt-3 grid gap-x-6 gap-y-1 text-[12.5px] sm:grid-cols-2">
        <div className="flex gap-1.5">
          <dt className="text-ink-400 shrink-0">Dónde:</dt>
          <dd>{p.donde}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-ink-400 shrink-0">Contra:</dt>
          <dd>
            {enlaceBoe ? (
              <a
                href={enlaceBoe}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-700 underline underline-offset-2"
              >
                {p.contra}
              </a>
            ) : (
              p.contra
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
