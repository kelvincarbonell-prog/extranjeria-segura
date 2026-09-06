import { Link } from "@/components/ui/Link";
import { DEMO_EXPEDIENTES } from "@/content/demo";
import { vigilar, aperturaRenovacion, type PlazoVivo } from "@/lib/vigilancia";
import { fechaLarga, parseDia } from "@/lib/plazos";
import { Fuente } from "@/components/contenido/Fuente";
import { Card, Badge, DemoTag } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const metadata = { title: "Plazos" };

/**
 * TORRE DE VIGILANCIA DE PLAZOS.
 *
 * Lo que de verdad pierde expedientes en extranjería no es equivocarse de
 * estrategia: es que un plazo venza mientras el escrito estaba a medias. El
 * responsable lleva veinte casos, cada uno con su reloj, y todos los relojes
 * empezaron un día distinto.
 *
 * Esta pantalla contesta una sola pregunta —qué se me vence— y la contesta
 * antes de cualquier otra cosa. No hay filtros, ni buscador, ni pestañas: el
 * orden lo decide el reloj, no el usuario. Un panel donde hay que elegir una
 * vista para ver lo urgente es un panel donde lo urgente se pierde.
 *
 * ─── DOS DECISIONES QUE PARECEN DETALLES ────────────────────────────────
 *
 * Los plazos vencidos siguen arriba. La tentación es esconderlos —ya no se
 * pueden cumplir— y es justo al revés: un plazo vencido es el que más
 * atención necesita, porque a partir de ahí hay que decidir qué se hace con
 * el expediente, y esa decisión tiene su propio reloj.
 *
 * Cada plazo enseña la norma que lo fija, y si esa norma todavía no se ha
 * contrastado, lo dice. Quien organiza su semana con esta pantalla tiene
 * derecho a saber cuáles de estos relojes están confirmados y cuáles no.
 */
export default function PlazosPage() {
  const { vencidos, criticos, proximos, sinPlazo } = vigilar(DEMO_EXPEDIENTES);
  const porId = new Map(DEMO_EXPEDIENTES.map((e) => [e.id, e]));

  const bloques = [
    {
      clave: "vencidos",
      titulo: "Vencidos",
      lede: "No se ocultan. Hay que decidir qué se hace con el expediente, y esa decisión también corre.",
      items: vencidos,
      tono: "risk" as const,
    },
    {
      clave: "criticos",
      titulo: "Esta semana",
      lede: "Siete días o menos. Es lo que hay que resolver antes de abrir cualquier otra cosa.",
      items: criticos,
      tono: "warn" as const,
    },
    {
      clave: "proximos",
      titulo: "Próximos 45 días",
      lede: "Todavía hay margen, pero conviene tener pedida la documentación que tarda.",
      items: proximos,
      tono: "neutral" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-ink-950 font-display text-[26px] font-extrabold tracking-[-0.03em]">
            Plazos
          </h1>
          <p className="text-ink-600 mt-2 max-w-2xl text-[15px] leading-relaxed">
            Cada plazo se calcula de un hecho con fecha y de la norma que lo fija, no de un contador
            guardado. Ordenado por lo único que decide el orden del día: cuánto queda.
          </p>
        </div>
        <DemoTag />
      </header>

      <div className="mb-9 grid gap-3 sm:grid-cols-3">
        <Contador etiqueta="Vencidos" valor={vencidos.length} tono="risk" />
        <Contador etiqueta="Esta semana" valor={criticos.length} tono="warn" />
        <Contador etiqueta="Próximos 45 días" valor={proximos.length} tono="neutral" />
      </div>

      {bloques.map((b) =>
        b.items.length === 0 ? null : (
          <section key={b.clave} className="mb-10">
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <h2 className="text-ink-900 text-[17px] font-bold tracking-[-0.02em]">{b.titulo}</h2>
              <span className="text-ink-400 text-[13px] tabular-nums">{b.items.length}</span>
            </div>
            <p className="text-ink-500 mb-4 text-[13.5px]">{b.lede}</p>

            <ul className="space-y-2.5">
              {b.items.map((p) => {
                const e = porId.get(p.expedienteId);
                return (
                  <li key={`${p.expedienteId}-${p.origen}`}>
                    <FilaPlazo
                      plazo={p}
                      referencia={e?.referencia ?? p.expedienteId}
                      cliente={e?.cliente ?? ""}
                      tramite={e?.tramite ?? ""}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ),
      )}

      {sinPlazo.length > 0 && (
        <section className="border-ink-900/10 border-t pt-6">
          <h2 className="text-ink-900 text-[15px] font-semibold">Sin plazo vivo</h2>
          <p className="text-ink-500 mt-1.5 mb-4 text-[13.5px]">
            Ni urgentes ni olvidados. Aparecen aquí para que no desaparezcan del radar por no tener
            un reloj corriendo.
          </p>
          <ul className="flex flex-wrap gap-2">
            {sinPlazo.map((e) => (
              <li key={e.id}>
                <span className="text-ink-600 bg-surface ring-ink-900/[.07] inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] ring-1 ring-inset">
                  <span className="data text-ink-400">{e.referencia}</span>
                  {e.cliente} · {e.tramite}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-ink-400 mt-10 text-[12.5px] leading-relaxed">
        Los plazos por días se cuentan como naturales, no hábiles. Es deliberado: contar de más
        nunca hace perder un plazo, contar de menos sí. La fecha que aparece es siempre igual o
        anterior a la real.
      </p>
    </div>
  );
}

function Contador({
  etiqueta,
  valor,
  tono,
}: {
  etiqueta: string;
  valor: number;
  tono: "risk" | "warn" | "neutral";
}) {
  const color =
    tono === "risk" ? "text-signal-risk" : tono === "warn" ? "text-signal-warn" : "text-ink-700";
  return (
    <Card className="p-4">
      <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">{etiqueta}</p>
      <p
        className={cn(
          "font-display mt-1.5 text-[28px] leading-none font-extrabold tabular-nums",
          color,
        )}
      >
        {valor}
      </p>
    </Card>
  );
}

function FilaPlazo({
  plazo: p,
  referencia,
  cliente,
  tramite,
}: {
  plazo: PlazoVivo;
  referencia: string;
  cliente: string;
  tramite: string;
}) {
  const vencido = p.cuenta.estado === "vencido";
  const dias = Math.abs(p.cuenta.dias);

  return (
    <Card
      className={cn(
        "p-4",
        vencido && "ring-signal-risk/25 ring-1 ring-inset",
        !vencido && p.cuenta.critico && "ring-signal-warn/25 ring-1 ring-inset",
      )}
    >
      <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
        {/* El número, primero y grande: es lo que se lee de un vistazo. */}
        <div className="min-w-[92px]">
          <p
            className={cn(
              "font-display text-[26px] leading-none font-extrabold tabular-nums",
              vencido
                ? "text-signal-risk"
                : p.cuenta.critico
                  ? "text-signal-warn"
                  : "text-ink-800",
            )}
          >
            {p.cuenta.estado === "ultimo-dia" ? "Hoy" : dias}
          </p>
          <p className="text-ink-500 mt-1 text-[12px]">
            {p.cuenta.estado === "ultimo-dia"
              ? "último día"
              : vencido
                ? `${dias === 1 ? "día" : "días"} vencido`
                : `${dias === 1 ? "día" : "días"}`}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="data text-ink-400 text-[12px]">{referencia}</span>
            <span className="text-ink-800 text-[14.5px] font-semibold">{cliente}</span>
            <span className="text-ink-400 text-[13px]">· {tramite}</span>
          </div>

          <p className="text-ink-900 mt-1.5 text-[14.5px] font-medium">{p.titulo}</p>
          <p className="text-ink-600 mt-0.5 text-[13.5px] leading-relaxed">{p.accion}</p>

          <p className="text-ink-500 mt-2 text-[12.5px]">
            Vence el <time dateTime={p.vence}>{fechaLarga(parseDia(p.vence))}</time>
            {p.origen === "renovacion" && (
              <> · ventana abierta desde el {fechaLarga(parseDia(aperturaRenovacion(p.vence)))}</>
            )}
          </p>

          <Fuente
            fuente={p.norma}
            articulo={p.articulo}
            verificado={p.verificado}
            className="mt-1.5"
          />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {vencido && <Badge tone="risk">Decidir hoy</Badge>}
          <Link
            href="/admin/expedientes"
            className="text-brand-700 hover:text-brand-800 tap text-[13px] font-medium"
          >
            Abrir expediente
          </Link>
        </div>
      </div>
    </Card>
  );
}
