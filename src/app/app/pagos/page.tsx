import { DEMO_PAYMENTS } from "@/content/demo";
import { THIRD_PARTY_COSTS, PAYMENT_TERMS } from "@/content/pricing";
import { Card, Badge, LegalNote, KeyValue } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal, CheckDraw } from "@/components/motion/primitives";
import { site } from "@/content/site";
import { eur, formatDateES } from "@/lib/utils";

export const metadata = { title: "Pagos" };

export default function PagosPage() {
  const paid = DEMO_PAYMENTS.filter((p) => p.state === "pagado");
  const totalPaid = paid.reduce((a, p) => a + p.amountCents, 0);
  const pending = DEMO_PAYMENTS.filter((p) => p.state !== "pagado");
  const totalPending = pending.reduce((a, p) => a + p.amountCents, 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
          Pagos
        </h1>
        <p className="text-ink-500 mt-1.5 text-[15px]">
          Todo lo que has pagado, lo que queda y por qué. Sin cargos que no hayas aprobado.
        </p>
      </div>

      <Reveal>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card padding="md">
            <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">Pagado</p>
            <p className="text-ink-900 font-display data mt-2 text-[26px] leading-none font-extrabold tracking-[-0.035em]">
              {eur(totalPaid)}
            </p>
            <p className="text-ink-400 mt-1.5 text-[12px]">{paid.length} pagos completados</p>
          </Card>
          <Card padding="md">
            <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
              Pendiente
            </p>
            <p className="text-ink-900 font-display data mt-2 text-[26px] leading-none font-extrabold tracking-[-0.035em]">
              {eur(totalPending)}
            </p>
            <p className="text-ink-400 mt-1.5 text-[12px]">
              {pending.length > 0 ? `Próximo: ${formatDateES(pending[0].date, "short")}` : "Nada pendiente"}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
              Presupuesto total
            </p>
            <p className="text-ink-900 font-display data mt-2 text-[26px] leading-none font-extrabold tracking-[-0.035em]">
              {eur(totalPaid + totalPending)}
            </p>
            <p className="text-ink-400 mt-1.5 text-[12px]">Cerrado por escrito</p>
          </Card>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Card padding="none" className="overflow-hidden">
          <div className="border-ink-100 border-b px-5 py-4">
            <h2 className="text-ink-900 text-[15px] font-semibold">Movimientos</h2>
          </div>
          <ul className="divide-ink-100 divide-y">
            {DEMO_PAYMENTS.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-[11px] ${
                    p.state === "pagado"
                      ? "bg-signal-ok-soft text-signal-ok"
                      : "bg-ink-50 text-ink-400"
                  }`}
                >
                  {p.state === "pagado" ? (
                    <CheckDraw size={16} strokeWidth={2.8} />
                  ) : (
                    <Glyph name="clock" className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink-900 text-[14px] font-medium">{p.concept}</p>
                  <p className="text-ink-400 text-[12.5px]">
                    {formatDateES(p.date)}
                    {p.invoice ? ` · Factura ${p.invoice}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-ink-900 data text-[15px] font-semibold">
                    {eur(p.amountCents)}
                  </span>
                  <Badge
                    tone={p.state === "pagado" ? "ok" : p.state === "programado" ? "neutral" : "warn"}
                  >
                    {p.state === "pagado"
                      ? "Pagado"
                      : p.state === "programado"
                        ? "Programado"
                        : "Pendiente"}
                  </Badge>
                  {p.invoice && (
                    <Button size="sm" variant="ghost">
                      Factura
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.08}>
          <Card padding="md" className="h-full">
            <h2 className="text-ink-900 mb-3 text-[15px] font-semibold">Nuestras condiciones</h2>
            <ul className="flex flex-col gap-2.5">
              {PAYMENT_TERMS.map((t, i) => (
                <li key={t} className="text-ink-600 flex gap-2.5 text-[13.5px] leading-snug">
                  <span className="bg-signal-ok-soft text-signal-ok mt-px flex size-[17px] shrink-0 items-center justify-center rounded-full">
                    <CheckDraw size={10} strokeWidth={3.4} delay={i * 0.1} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card padding="md" className="h-full">
            <h2 className="text-ink-900 mb-1 text-[15px] font-semibold">Costes de terceros</h2>
            <p className="text-ink-500 mb-3 text-[13px] leading-relaxed">
              No los cobramos nosotros ni los llevamos margen. Los pagas directamente a quien
              corresponde.
            </p>
            <dl className="divide-ink-100 divide-y">
              {THIRD_PARTY_COSTS.slice(0, 4).map((c) => (
                <div key={c.label} className="py-2.5">
                  <dt className="text-ink-800 text-[13.5px] font-medium">{c.label}</dt>
                  <dd className="text-ink-400 mt-0.5 text-[12.5px] leading-snug">{c.detail}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <Card padding="md">
          <h2 className="text-ink-900 mb-1 text-[15px] font-semibold">Método de pago</h2>
          <dl className="divide-ink-100 divide-y">
            <KeyValue k="Procesador" v="Stripe" />
            <KeyValue k="Datos de tarjeta" v="Nunca se almacenan en nuestros servidores" />
            <KeyValue k="Reembolsos" v="Según las condiciones de contratación" />
          </dl>
          {!site.features.stripe && (
            <LegalNote variant="framed" className="mt-4">
              La integración de pagos está preparada (productos, pagos fraccionados, facturas,
              cupones y reembolsos) pero no activada en este entorno. Extranjería Segura no almacena
              datos de tarjeta en ningún caso: los gestiona íntegramente el procesador.
            </LegalNote>
          )}
        </Card>
      </Reveal>
    </div>
  );
}
