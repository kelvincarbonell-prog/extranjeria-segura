import { boeUrl, boeArticuloUrl, type Fuente as FuenteType } from "@/content/fuentes";

/**
 * CITA NORMATIVA CON ENLACE PROFUNDO (A6).
 *
 * Enlazar a la portada de boe.es no vale como fuente ni para un lector ni para
 * un buscador. Este componente lleva al **texto consolidado** del artículo
 * concreto, que es la versión vigente con todas sus modificaciones aplicadas.
 *
 * Cuando no disponemos del identificador BOE verificado, la cita se publica
 * completa pero sin enlace y se marca como pendiente de verificación. Un
 * identificador aproximado resolvería a una norma distinta, y eso es peor que
 * no enlazar: el lector creería haber comprobado algo que no ha comprobado.
 *
 * Efecto secundario buscado: obliga a que cada afirmación tenga su norma
 * detrás, que es lo que dice la política editorial del sitio.
 */
export function Fuente({
  fuente,
  articulo,
  verificado = true,
  className,
}: {
  fuente: FuenteType;
  /** Ancla del artículo en el consolidado: "a124", "a46", "da20". */
  articulo?: string;
  verificado?: boolean;
  className?: string;
}) {
  const url = articulo ? boeArticuloUrl(fuente, articulo) : boeUrl(fuente);

  return (
    <cite
      className={`text-ink-500 block text-[13px] leading-relaxed not-italic ${className ?? ""}`}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-ink-300 hover:text-brand-700 hover:decoration-brand-400 underline underline-offset-[3px] transition-colors"
        >
          {fuente.norma}
          <span className="sr-only"> (se abre en el BOE, texto consolidado)</span>
        </a>
      ) : (
        <span>{fuente.norma}</span>
      )}
      {articulo && <span className="text-ink-400"> · art. {articulo.replace(/^a/, "")}</span>}
      {!verificado && (
        <span className="text-signal-warn bg-signal-warn-soft ms-1.5 inline-block rounded-[5px] px-1.5 py-px align-middle text-[11px] font-medium">
          referencia por verificar
        </span>
      )}
    </cite>
  );
}

/**
 * Bloque «Fuentes» al pie de una página. Reúne todas las normas citadas en un
 * solo sitio, que es donde las busca quien quiere comprobar algo.
 */
export function BloqueFuentes({
  fuentes,
  consultado,
}: {
  fuentes: { fuente: FuenteType; articulo?: string; verificado: boolean }[];
  consultado?: string;
}) {
  // Una misma norma citada por varios datos aparece una sola vez.
  const unicas = new Map<string, { fuente: FuenteType; verificado: boolean }>();
  for (const f of fuentes) {
    const prev = unicas.get(f.fuente.id);
    unicas.set(f.fuente.id, {
      fuente: f.fuente,
      // Si algún dato que la cita está sin verificar, la norma se marca así.
      verificado: (prev?.verificado ?? true) && f.verificado,
    });
  }

  if (unicas.size === 0) return null;

  return (
    <section aria-labelledby="fuentes" className="border-ink-900/10 mt-14 border-t pt-8">
      <h2 id="fuentes" className="eyebrow mb-4">
        Fuentes
      </h2>
      <ul className="space-y-2.5">
        {[...unicas.values()].map(({ fuente, verificado }) => (
          <li key={fuente.id}>
            <Fuente fuente={fuente} verificado={verificado} />
            <p className="text-ink-400 mt-0.5 text-[12.5px] leading-relaxed">{fuente.respalda}</p>
          </li>
        ))}
      </ul>
      {consultado && (
        <p className="text-ink-400 mt-5 text-[12.5px]">
          Fuentes consultadas el {consultado}. La normativa de extranjería cambia: si vas a
          presentar un escrito, comprueba la versión vigente el día de la presentación.
        </p>
      )}
    </section>
  );
}
