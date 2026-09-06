import Link from "next/link";
import { DEMO_CASE, DEMO_DOCUMENTS, DEMO_NOTIFICATIONS } from "@/content/demo";
import { getTramite } from "@/content/tramites";
import { Card, Badge, Progress, KeyValue, Avatar, LegalNote } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { CaseTimeline } from "@/components/app/CaseTimeline";
import { Reveal } from "@/components/motion/primitives";
import { formatDateES, relativeES } from "@/lib/utils";

export const metadata = { title: "Mi expediente" };

export default function ExpedientePage() {
  const tramite = getTramite(DEMO_CASE.tramiteSlug);
  const validated = DEMO_DOCUMENTS.filter((d) => d.state === "correcto").length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="data text-ink-400 text-[12px] font-medium">
          Expediente #{DEMO_CASE.reference}
        </p>
        <h1 className="text-ink-900 font-display mt-1 text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
          {DEMO_CASE.tramite}
        </h1>
      </div>

      <Reveal>
        <Card padding="lg">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Badge tone="brand" dot>
              {DEMO_CASE.status}
            </Badge>
            {tramite && (
              <Link
                href={`/tramites/${tramite.slug}`}
                className="text-brand-600 hover:text-brand-800 text-[13px] font-semibold transition-colors"
              >
                Ver requisitos del trámite →
              </Link>
            )}
          </div>

          <Progress value={DEMO_CASE.progress} label="Progreso" showValue />

          <div className="border-ink-100 mt-8 border-t pt-7">
            <CaseTimeline steps={DEMO_CASE.timeline} />
          </div>
        </Card>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <Card padding="md" className="h-full">
            <p className="text-ink-400 mb-1 text-[11px] font-bold tracking-[0.11em] uppercase">
              Datos del expediente
            </p>
            <dl className="divide-ink-100 divide-y">
              <KeyValue k="Referencia" v={`#${DEMO_CASE.reference}`} mono />
              <KeyValue k="Trámite" v={DEMO_CASE.tramite} />
              <KeyValue k="Abierto el" v={formatDateES(DEMO_CASE.openedAt)} />
              <KeyValue k="Estado" v={DEMO_CASE.status} />
              <KeyValue k="Documentación" v={`${validated}/${DEMO_DOCUMENTS.length} validados`} mono />
            </dl>
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <Card padding="md" className="h-full">
            <p className="text-ink-400 mb-3.5 text-[11px] font-bold tracking-[0.11em] uppercase">
              Quién lleva tu caso
            </p>
            <div className="flex items-center gap-3">
              <Avatar name={DEMO_CASE.advisor.name} size={44} />
              <div className="min-w-0">
                <p className="text-ink-900 truncate text-[14.5px] font-semibold">
                  {DEMO_CASE.advisor.name}
                </p>
                <p className="text-ink-400 truncate text-[12.5px]">{DEMO_CASE.advisor.role}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2.5">
              <Button href="/app/mensajes" variant="secondary" size="sm" className="flex-1">
                Escribirle
              </Button>
              <Button href="/app/citas" variant="secondary" size="sm" className="flex-1">
                Pedir cita
              </Button>
            </div>
            <p className="text-ink-400 mt-4 text-[12px] leading-relaxed">
              Tu especialista es la única persona que valida los documentos de tu expediente. El
              resto del equipo solo accede a lo que necesita para su función.
            </p>
          </Card>
        </Reveal>
      </div>

      {/* ---------------- Chronological history ---------------- */}
      <Reveal delay={0.1}>
        <Card padding="none" className="overflow-hidden">
          <div className="border-ink-100 flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-ink-900 text-[15px] font-semibold">Historial del expediente</h2>
            <span className="text-ink-400 text-[12px]">Orden cronológico</span>
          </div>
          <ol className="divide-ink-100 divide-y">
            {DEMO_NOTIFICATIONS.map((n) => (
              <li key={n.id} className="flex items-start gap-3.5 px-5 py-4">
                <span className="bg-ink-50 text-ink-400 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                  <Glyph
                    name={
                      { documento: "doc", cita: "clock", expediente: "path", mensaje: "family", pago: "stamp" }[
                        n.kind
                      ]
                    }
                    className="size-4"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink-900 text-[14px] font-medium">{n.title}</p>
                  {n.body && <p className="text-ink-500 mt-0.5 text-[12.5px]">{n.body}</p>}
                </div>
                <span className="data text-ink-300 shrink-0 text-[11.5px]">
                  {relativeES(n.at)}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="md">
            Exportar mi expediente
          </Button>
          <Button variant="ghost" size="md" href="/legal/proteccion-datos">
            Ver el registro de accesos
          </Button>
        </div>
        <LegalNote variant="framed" className="mt-4">
          Puedes descargar todo tu expediente en cualquier momento, incluidos los documentos que has
          subido y el histórico de acciones sobre ellos. Es tu información y te la llevas cuando
          quieras.
        </LegalNote>
      </Reveal>
    </div>
  );
}
