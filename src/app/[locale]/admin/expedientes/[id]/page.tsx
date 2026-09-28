import { notFound } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { SoloCon } from "@/components/admin/SoloCon";
import { CuentaPlazo } from "@/components/admin/CuentaPlazo";
import { EstadoPreparacion, BarraPreparacion } from "@/components/admin/Preparacion";
import { Fuente } from "@/components/contenido/Fuente";
import { Glyph } from "@/components/brand/Glyph";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { DEMO_PIPELINE, DOC_STATE_META, PIPELINE_STAGES, expedientesDemo } from "@/content/demo";
import { TRAMITE_MAP } from "@/content/tramites";
import { rolDemo } from "@/lib/rol-demo";
import { filtrarAsignados } from "@/lib/mis-expedientes";
import { prepararExpediente } from "@/lib/preparacion";
import { plazosDe, aperturaRenovacion, type PlazoVivo } from "@/lib/vigilancia";
import { fechaLarga, parseDia } from "@/lib/plazos";
import {
  planDocumental,
  ORDEN_GRUPOS,
  TITULO_GRUPO,
  type FilaDocumento,
  type GrupoDocumento,
} from "@/lib/ficha-expediente";
import { LOCALE_META } from "@/i18n/config";
import { cn, eur } from "@/lib/utils";

/**
 * LA FICHA DE UN EXPEDIENTE.
 *
 * No existía. El panel tenía lista, tablero, torre de plazos y reclamación de
 * documentos, y ninguna pantalla donde abrir UN caso: el nombre del cliente
 * enlazaba al tablero, y «Abrir expediente» en la torre de plazos llevaba de
 * vuelta a la lista. Quien quería saber qué le faltaba a Ibrahim K. tenía que
 * cruzar tres pantallas de memoria.
 *
 * ─── EL ORDEN DE ARRIBA ABAJO ES EL DE LAS PREGUNTAS ────────────────────
 *
 * 1. ¿Qué hago ahora? — una frase y un botón que lleva a hacerlo.
 * 2. ¿Cuánto tiempo tengo? — los plazos vivos, con la norma que los fija.
 * 3. ¿Qué falta y de quién depende? — los documentos agrupados por quién
 *    mueve ficha, no en el orden del catálogo.
 * 4. ¿Qué hay que comprobar antes de firmar? — lo que el trámite marca como
 *    pendiente de verificación jurídica.
 *
 * Lo demás —importe, idioma, responsable— va en una columna aparte: se
 * consulta, no se decide con ello.
 */

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.id, s.label]));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = expedientesDemo().find((e) => e.id === id);
  // El título de la pestaña lleva la referencia, no el nombre del cliente:
  // el historial del navegador y las pestañas compartidas no deberían
  // enseñar a quién pertenece un expediente de extranjería.
  return { title: exp ? `Expediente ${exp.referencia}` : "Expediente" };
}

async function FichaInterior({ id }: { id: string }) {
  const rol = await rolDemo();
  const todos = expedientesDemo();
  const exp = todos.find((e) => e.id === id);
  // Con `loading.tsx` la respuesta ya ha empezado a enviarse cuando llega
  // aquí, así que Next pinta la página de «no existe» con `noindex` pero con
  // estado 200, no 404. Es su comportamiento documentado para rutas con
  // streaming; en un panel privado y no indexable se acepta a cambio de que
  // la ficha enseñe su esqueleto al instante.
  if (!exp) notFound();

  // Que exista no significa que te toque verlo. Se responde con una
  // explicación, no con un 404: un 404 le hace creer a un compañero que el
  // expediente no existe, y el siguiente paso es darlo de alta otra vez.
  const visible = filtrarAsignados([exp], rol).length > 0;
  if (!visible) return <NoAsignado responsable={exp.responsable} />;

  const tarjeta = DEMO_PIPELINE.find((c) => c.id === exp.id);
  const tramite = TRAMITE_MAP[exp.tramiteSlug];
  const preparacion = prepararExpediente({
    tramiteSlug: exp.tramiteSlug,
    documentos: exp.documentos ?? [],
    presentado: exp.presentado,
  });
  const plazos = plazosDe(exp);
  const principal = plazos[0];
  const plan = planDocumental(exp);
  const porGrupo = new Map<GrupoDocumento, FilaDocumento[]>();
  for (const f of plan) porGrupo.set(f.grupo, [...(porGrupo.get(f.grupo) ?? []), f]);

  const delCliente = porGrupo.get("cliente")?.length ?? 0;
  const porRevisar = porGrupo.get("revisar")?.length ?? 0;
  const faseDocumental = exp.documentos !== undefined && !exp.presentado;
  const urgente =
    principal && (principal.cuenta.estado !== "abierto" || principal.cuenta.critico);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/admin/expedientes"
        className="text-ink-500 hover:text-ink-900 inline-flex w-fit items-center gap-1.5 py-1 text-[13px] font-medium transition-colors"
      >
        <span aria-hidden="true">←</span> Expedientes
      </Link>

      {/* ───────── Cabecera ───────── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-ink-400 flex flex-wrap items-center gap-2 text-[12.5px]">
            <span className="data">{exp.referencia}</span>
            {tarjeta && <Badge tone="neutral">{STAGE_LABEL[tarjeta.stage]}</Badge>}
          </p>
          <h1 className="text-ink-900 font-display mt-1.5 text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[30px]">
            {exp.cliente}
          </h1>
          <p className="text-ink-600 mt-1 text-[15px]">{exp.tramite}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <EstadoPreparacion preparacion={preparacion} />
          {preparacion.requeridos > 0 && preparacion.estado !== "presentado" && (
            <span className="block w-40">
              <BarraPreparacion preparacion={preparacion} />
            </span>
          )}
        </div>
      </header>

      {/* ───────── 1. Qué hago ahora ───────── */}
      <section
        aria-labelledby="ahora"
        className={cn(
          "rounded-lg p-5 md:p-6",
          urgente
            ? "bg-signal-risk-soft ring-signal-risk/20 ring-1 ring-inset"
            : "bg-ink-950 text-white",
        )}
      >
        <h2
          id="ahora"
          className={cn(
            "text-[11px] font-bold tracking-[0.12em] uppercase",
            urgente ? "text-signal-risk" : "text-white/55",
          )}
        >
          {urgente ? "Antes que nada" : "Lo siguiente"}
        </h2>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {urgente && principal ? (
              <>
                <p className="text-ink-900 text-[19px] leading-snug font-semibold tracking-[-0.015em]">
                  {principal.titulo}:{" "}
                  {principal.cuenta.estado === "vencido"
                    ? `venció hace ${Math.abs(principal.cuenta.dias)} ${Math.abs(principal.cuenta.dias) === 1 ? "día" : "días"}`
                    : principal.cuenta.estado === "ultimo-dia"
                      ? "vence hoy"
                      : `vence en ${principal.cuenta.dias} ${principal.cuenta.dias === 1 ? "día" : "días"}`}
                  .
                </p>
                <p className="text-ink-700 mt-1.5 text-[14.5px] leading-relaxed">
                  {principal.accion}. {preparacion.siguiente}
                </p>
              </>
            ) : (
              <p className="text-[19px] leading-snug font-semibold tracking-[-0.015em]">
                {preparacion.siguiente}
              </p>
            )}
          </div>

          {/* El botón lleva a HACER lo que dice la frase, no a otra lista. Si
              lo siguiente es algo que no se puede hacer desde el panel
              —firmar, presentar—, no hay botón: uno que no hiciera nada sería
              peor que ninguno. */}
          <div className="flex flex-wrap gap-2">
            {porRevisar > 0 && (
              <Button href="#documentos" size="md" variant={urgente ? "primary" : "inverse"}>
                Revisar {porRevisar} {porRevisar === 1 ? "documento" : "documentos"}
              </Button>
            )}
            {faseDocumental && delCliente > 0 && (
              <Button
                href={`/admin/recordatorios?exp=${exp.id}`}
                size="md"
                variant={porRevisar > 0 ? "secondary" : urgente ? "primary" : "inverse"}
                arrow
              >
                Reclamar al cliente
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* ───────── 2. Plazos ───────── */}
          <Card padding="none">
            <div className="border-ink-100 flex items-baseline justify-between gap-3 border-b px-5 py-4">
              <h2 className="text-ink-900 text-[16px] font-semibold tracking-[-0.015em]">Plazos</h2>
              <span className="text-ink-400 text-[12.5px]">
                {plazos.length === 0
                  ? "Ninguno corre"
                  : `${plazos.length} ${plazos.length === 1 ? "vivo" : "vivos"}`}
              </span>
            </div>
            {plazos.length === 0 ? (
              <p className="text-ink-500 px-5 py-5 text-[14px] leading-relaxed">
                No hay ningún plazo administrativo corriendo en este expediente. No es lo mismo
                que tener cero días: aquí nada vence.
              </p>
            ) : (
              <ul className="divide-ink-100 divide-y">
                {plazos.map((p, i) => (
                  <FilaPlazo key={`${p.origen}-${i}`} plazo={p} />
                ))}
              </ul>
            )}
          </Card>

          {/* ───────── 3. Documentos ───────── */}
          <Card padding="none" as="section" aria-labelledby="documentos-titulo">
            <div
              id="documentos"
              className="border-ink-100 flex scroll-mt-28 flex-wrap items-baseline justify-between gap-3 border-b px-5 py-4"
            >
              <h2
                id="documentos-titulo"
                className="text-ink-900 text-[16px] font-semibold tracking-[-0.015em]"
              >
                Documentos
              </h2>
              <span className="data numeros text-ink-400 text-[12.5px]">
                {preparacion.validados} de {preparacion.requeridos} validados
              </span>
            </div>

            {plan.length === 0 ? (
              <p className="text-ink-500 px-5 py-5 text-[14px]">
                Este trámite no tiene plan documental en el catálogo.
              </p>
            ) : (
              ORDEN_GRUPOS.filter((g) => porGrupo.has(g)).map((g) => (
                <GrupoDocs key={g} grupo={g} filas={porGrupo.get(g)!} />
              ))
            )}
          </Card>
        </div>

        {/* ───────── Columna de consulta ───────── */}
        <aside className="flex flex-col gap-5">
          <Card padding="none">
            <dl className="divide-ink-100 divide-y text-[13.5px]">
              <Dato etiqueta="Responsable">
                <span
                  className={cn(
                    exp.responsable === "Sin asignar" && "text-signal-warn font-semibold",
                  )}
                >
                  {exp.responsable}
                </span>
              </Dato>
              <Dato etiqueta="Idioma del cliente">
                {LOCALE_META[exp.idioma ?? "es"].native}
              </Dato>
              {tarjeta && (
                <Dato etiqueta="Importe">
                  {tarjeta.valueCents > 0 ? eur(tarjeta.valueCents) : "A presupuesto"}
                </Dato>
              )}
              {tramite && (
                <Dato etiqueta="Trámite">
                  <Link
                    href={`/tramites/${tramite.slug}`}
                    target="_blank"
                    className="text-brand-700 hover:text-brand-800 font-medium"
                  >
                    Ver requisitos
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </Link>
                </Dato>
              )}
            </dl>
          </Card>

          {preparacion.porVerificar.length > 0 && (
            <Card>
              <h2 className="text-ink-900 flex items-center gap-2 text-[14.5px] font-semibold">
                <Glyph name="scales" className="text-ink-500 size-4" />
                Comprobar antes de firmar
              </h2>
              {/* Esto no es burocracia interna: son los puntos que el catálogo
                  marca como pendientes de verificación jurídica. Que se vean
                  en la ficha, y no solo en /admin/contenido, es lo que evita
                  presentar con un criterio que nadie ha contrastado. */}
              <ul className="mt-3 flex flex-col gap-2">
                {preparacion.porVerificar.map((v) => (
                  <li key={v} className="text-ink-600 flex gap-2.5 text-[13px] leading-snug">
                    <span className="bg-signal-warn mt-1.5 size-1.5 shrink-0 rounded-full" />
                    {v}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function FilaPlazo({ plazo: p }: { plazo: PlazoVivo }) {
  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 px-5 py-4">
      <CuentaPlazo plazo={p} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-ink-900 text-[14.5px] font-medium">{p.titulo}</p>
        <p className="text-ink-600 mt-0.5 text-[13.5px] leading-relaxed">{p.accion}</p>
        <p className="text-ink-500 mt-1.5 text-[12.5px]">
          Vence el <time dateTime={p.vence}>{fechaLarga(parseDia(p.vence))}</time>
          {p.origen === "renovacion" && (
            <> · ventana abierta desde el {fechaLarga(parseDia(aperturaRenovacion(p.vence)))}</>
          )}
        </p>
        <Fuente fuente={p.norma} articulo={p.articulo} verificado={p.verificado} className="mt-1" />
      </div>
    </li>
  );
}

function GrupoDocs({ grupo, filas }: { grupo: GrupoDocumento; filas: FilaDocumento[] }) {
  const { titulo, detalle } = TITULO_GRUPO[grupo];
  const validado = grupo === "validado";

  const contenido = (
    <ul className="flex flex-col">
      {filas.map((f) => {
        const meta = DOC_STATE_META[f.estado];
        return (
          <li
            key={f.nombre}
            className="border-ink-100 flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5 border-t px-5 py-3 first:border-t-0"
          >
            <div className="min-w-0 flex-1">
              <p className={cn("text-[14px]", validado ? "text-ink-500" : "text-ink-800")}>
                {f.nombre}
                {f.opcional && <span className="text-ink-400"> · opcional</span>}
              </p>
              {f.nota && !validado && (
                <p className="text-ink-400 mt-0.5 text-[12.5px] leading-snug">{f.nota}</p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-2">
              {f.esperaDias !== undefined && !validado && (
                <span className="data text-ink-400 text-[12px]">
                  pedido hace {f.esperaDias} {f.esperaDias === 1 ? "día" : "días"}
                </span>
              )}
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="border-ink-100 border-t first:border-t-0">
      {validado ? (
        // Lo validado se pliega: está bien y no pide nada. Abierto, empujaba
        // lo pendiente fuera de la pantalla en los trámites de nueve papeles.
        <details className="group">
          <summary className="hover:bg-canvas-deep flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 transition-colors">
            <span>
              <span className="text-ink-700 text-[13.5px] font-semibold">{titulo}</span>
              <span className="text-ink-400 ml-2 text-[12.5px]">{filas.length}</span>
            </span>
            <span
              aria-hidden="true"
              className="text-ink-400 text-[12px] transition-transform group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          {contenido}
        </details>
      ) : (
        <>
          <div className="bg-canvas-deep/60 px-5 py-2.5">
            <p className="text-ink-800 text-[13px] font-semibold">
              {titulo} <span className="text-ink-400 font-normal">· {filas.length}</span>
            </p>
            <p className="text-ink-500 text-[12px] leading-snug">{detalle}</p>
          </div>
          {contenido}
        </>
      )}
    </div>
  );
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3">
      <dt className="text-ink-500">{etiqueta}</dt>
      <dd className="text-ink-900 text-right font-medium">{children}</dd>
    </div>
  );
}

function NoAsignado({ responsable }: { responsable: string }) {
  return (
    <div className="mx-auto max-w-xl">
      <Card padding="lg">
        <span className="bg-ink-50 text-ink-500 flex size-11 items-center justify-center rounded-[13px]">
          <Glyph name="lock" className="size-5" />
        </span>
        <h1 className="text-ink-900 font-display mt-4 text-[20px] font-extrabold tracking-[-0.03em]">
          Este expediente no está asignado a ti
        </h1>
        <p className="text-ink-600 mt-2 text-[14px] leading-relaxed">
          Lo lleva <strong>{responsable}</strong>. Tu rol ve los expedientes de los que es
          responsable; si necesitas entrar en este, pide que te lo asignen a quien administra la
          cuenta.
        </p>
        <Link
          href="/admin/expedientes"
          className="text-brand-600 hover:text-brand-800 mt-5 inline-flex items-center gap-1.5 py-1 text-[14px] font-semibold"
        >
          Ver mis expedientes <span aria-hidden="true">→</span>
        </Link>
      </Card>
    </div>
  );
}

export default async function FichaExpediente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <SoloCon permiso="documentos">
      <FichaInterior id={id} />
    </SoloCon>
  );
}
