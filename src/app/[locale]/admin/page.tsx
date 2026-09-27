import { Link } from "@/components/ui/Link";
import { DEMO_PIPELINE, expedientesDemo, PIPELINE_STAGES } from "@/content/demo";
import { Card, Badge, DemoTag, Progress } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/primitives";
import { CuentaPlazo } from "@/components/admin/CuentaPlazo";
import { plazoPrincipal } from "@/lib/vigilancia";
import { ordenDelDia, motivoDelOrden } from "@/lib/orden-del-dia";
import { EstadoPreparacion } from "@/components/admin/Preparacion";
import { filtrarAsignados, filtrarAsignadosPorOwner } from "@/lib/mis-expedientes";
import { rolDemo } from "@/lib/rol-demo";
import { puede } from "@/content/roles";
import { eur, cn } from "@/lib/utils";

export const metadata = { title: "Panel" };

/**
 * PANEL DEL DESPACHO.
 *
 * La primera fila es operativa y no de vanidad a propósito: plazos vencidos y
 * expedientes sin responsable van antes que la facturación, porque en
 * extranjería un plazo perdido es la vida de alguien, no un trimestre flojo.
 *
 * ─── DE DÓNDE SALEN LOS DÍAS ────────────────────────────────────────────
 *
 * De los hechos del expediente, no de un campo. Esta pantalla leía `slaDays`,
 * un número escrito a mano que dejaba de ser cierto al día siguiente: la
 * alerta de arriba —lo primero que se ve al abrir el panel— podía estar
 * anunciando un vencimiento que ya no existía o, peor, callando uno nuevo.
 * Ahora sale de `plazoPrincipal()`, igual que la tabla de expedientes y el
 * tablero, y cada número lleva detrás su fecha y su norma.
 */
export default async function AdminHome() {
  // Todo el panel se calcula sobre lo asignado. Si el abogado ve «3 sin
  // responsable asignado» pero ninguno es suyo, la alerta no es suya y le
  // está robando la atención a la que sí lo es.
  const rol = await rolDemo();
  const expedientes = filtrarAsignados(expedientesDemo(), rol);
  const cartera = filtrarAsignadosPorOwner(DEMO_PIPELINE, rol);

  const plazos = plazoPrincipal(expedientes);
  const conPlazo = cartera.filter((c) => plazos.has(c.id));

  // El orden del día: lo irreversible primero, después lo que menos trabajo
  // pide. Es la misma función que ordena /admin/expedientes, para que las dos
  // pantallas no propongan planes distintos para la misma mañana.
  const porCartera = new Map(cartera.map((c) => [c.id, c]));
  const agenda = ordenDelDia(
    expedientes.map((e) => ({ expediente: e, plazo: plazos.get(e.id) })),
  ).filter((f) => porCartera.has(f.expediente.id));

  const listos = agenda.filter((f) => f.preparacion.estado === "listo");

  const active = cartera.filter(
    (c) => !["archivado", "resolucion"].includes(c.stage),
  );
  const overdue = conPlazo.filter((c) => plazos.get(c.id)!.cuenta.estado === "vencido");
  const urgent = conPlazo.filter((c) => {
    const { cuenta } = plazos.get(c.id)!;
    return cuenta.estado !== "vencido" && cuenta.critico;
  });
  const unassigned = cartera.filter((c) => c.owner === "Sin asignar");
  const leads = cartera.filter((c) => ["lead", "diagnostico", "consulta"].includes(c.stage));
  const contracted = cartera.filter(
    (c) => !["lead", "diagnostico", "consulta"].includes(c.stage),
  );
  const contractedValue = contracted.reduce((a, c) => a + c.valueCents, 0);
  // Sin cartera no hay conversión que calcular. Dividir entre cero daba
  // «NaN% de conversión» en el panel de un rol sin expedientes asignados: una
  // métrica rota en la primera pantalla que se ve al entrar.
  const conversion = cartera.length > 0 ? Math.round((contracted.length / cartera.length) * 100) : null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
            Panel
          </h1>
          <p className="text-ink-500 mt-1.5 text-[14.5px]">
            Estado operativo del despacho ahora mismo.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <DemoTag label="Datos de demostración" />
          <Button href="/admin/pipeline" size="sm" arrow>
            Abrir pipeline
          </Button>
        </div>
      </div>

      {/* ---------------- Alert row ---------------- */}
      {(overdue.length > 0 || unassigned.length > 0) && (
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {overdue.length > 0 && (
              <AlertCard
                tone="risk"
                glyph="alert"
                title={`${overdue.length} ${overdue.length === 1 ? "expediente con plazo vencido" : "expedientes con plazo vencido"}`}
                body={overdue.map((c) => `${c.reference} · ${c.client}`).join(" · ")}
                href="/admin/pipeline"
              />
            )}
            {unassigned.length > 0 && (
              <AlertCard
                tone="warn"
                glyph="family"
                title={`${unassigned.length} sin responsable asignado`}
                body={unassigned.map((c) => `${c.reference} · ${c.tramite}`).join(" · ")}
                href="/admin/pipeline"
              />
            )}
          </div>
        </Reveal>
      )}

      {/* Un panel a cero no es un panel roto, pero lo parece. Quien entra con
          un rol sin cartera asignada necesita leer por qué, no deducirlo de
          cuatro ceros seguidos. */}
      {cartera.length === 0 && (
        <Reveal>
          <Card padding="lg">
            <h2 className="text-ink-900 text-[15px] font-semibold">
              No tienes ningún expediente asignado
            </h2>
            <p className="text-ink-600 mt-1.5 max-w-2xl text-[13.5px] leading-relaxed">
              Tu rol ve los expedientes de los que es responsable, y ahora mismo no hay ninguno a
              tu nombre. Los números de abajo están a cero por eso, no porque el despacho esté
              parado. Quien administra la cuenta asigna los expedientes.
            </p>
          </Card>
        </Reveal>
      )}

      {/* En una pantalla estrecha lo primero tiene que ser accionable. Cuatro
          métricas seguidas de un bloque de fases no dicen qué hacer; la lista
          de qué toca hoy, sí. En escritorio caben las dos cosas a la vez y se
          recupera el orden de lectura original. */}
      {/* ---------------- Metrics ---------------- */}
      <Reveal delay={0.04} className="order-2 lg:order-none">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label="Expedientes activos" value={String(active.length)} sub="en tramitación" glyph="path" />
          {/* El subtítulo decía «vencen en 48 h o menos» y contaba dos cosas
              que no son eso: los ya vencidos —que no vencen, vencieron— y los
              que están dentro del umbral crítico, que son siete días y no dos.
              El umbral lo fija `cuenta.critico` en plazos.ts; aquí solo se
              nombra lo que ese umbral significa. */}
          <Metric
            label="Plazos críticos"
            value={String(overdue.length + urgent.length)}
            sub="vencidos o a 7 días o menos"
            glyph="clock"
            tone={overdue.length > 0 ? "risk" : urgent.length > 0 ? "warn" : "ok"}
          />
          {/* El número que más decide la mañana de quien tramita: cuántos
              expedientes cierra hoy una firma. Para un perfil comercial, que
              no ve expedientes, el dato útil sigue siendo el de leads. */}
          {puede(rol, "documentos") ? (
            <Metric
              label="Listos para presentar"
              value={String(listos.length)}
              sub="solo falta firmar"
              glyph="stamp"
              tone={listos.length > 0 ? "ok" : undefined}
            />
          ) : (
            <Metric label="Leads abiertos" value={String(leads.length)} sub="sin contratar" glyph="door" />
          )}
          <Metric
            label="Valor contratado"
            value={eur(contractedValue)}
            sub={conversion === null ? "sin cartera asignada" : `${conversion}% de conversión`}
            glyph="stamp"
          />
        </div>
      </Reveal>

      <div className="order-1 grid gap-5 lg:order-none lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---------------- Stage distribution ---------------- */}
        <Reveal delay={0.06} className="order-2 lg:order-none">
          <Card padding="lg">
            <h2 className="text-ink-900 mb-5 text-[15px] font-semibold">Distribución por fase</h2>
            <ul className="flex flex-col gap-3">
              {PIPELINE_STAGES.map((s) => {
                const items = cartera.filter((c) => c.stage === s.id);
                if (items.length === 0) return null;
                const pct = Math.round((items.length / cartera.length) * 100);
                return (
                  <li key={s.id} className="flex items-center gap-4">
                    <span className="text-ink-600 w-[132px] shrink-0 text-[13px] font-medium">
                      {s.label}
                    </span>
                    <div className="flex-1">
                      <Progress value={pct} size="sm" tone="ink" />
                    </div>
                    <span className="data text-ink-400 w-8 shrink-0 text-right text-[12px]">
                      {items.length}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Reveal>

        {/* ---------------- Orden del día ---------------- */}
        <Reveal delay={0.08} className="order-1 lg:order-none">
          <Card padding="none" className="overflow-hidden">
            <div className="border-ink-100 border-b px-5 py-4">
              <h2 className="text-ink-900 text-[15px] font-semibold">Qué toca hoy</h2>
              {/* Antes era «cola por plazo» y solo ordenaba por reloj. Un
                  expediente completo esperando una firma se quedaba semanas
                  sin presentar porque su vencimiento estaba lejos. */}
              <p className="text-ink-400 text-[12px]">
                Lo que no espera, y luego lo que se cierra antes
              </p>
            </div>
            <ul className="divide-ink-100 divide-y">
              {agenda.slice(0, 6).map((f) => {
                const c = porCartera.get(f.expediente.id)!;
                return (
                  <li key={f.expediente.id} className="flex items-start gap-3 px-5 py-3.5">
                    <CuentaPlazo plazo={plazos.get(c.id)} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-900 block truncate text-[13.5px] font-medium">
                        {c.client}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[12px] leading-snug",
                          f.urgente ? "text-signal-risk" : "text-ink-500",
                        )}
                      >
                        {motivoDelOrden(f)}
                      </span>
                      <span className="mt-1.5 block">
                        <EstadoPreparacion preparacion={f.preparacion} />
                      </span>
                    </span>
                  </li>
                );
              })}
              {agenda.length === 0 && (
                <li className="text-ink-500 px-5 py-8 text-center text-[13px]">
                  Nada pendiente en tus expedientes.
                </li>
              )}
            </ul>
          </Card>
        </Reveal>
      </div>

      {/* `order-3` explícito: en un contenedor flex, los hijos sin `order`
          valen 0, así que este bloque informativo se colaba por delante de
          todo lo que sí lo llevaba. Medido a 360 px: «Automatizaciones»
          salía en y=693 y «Qué toca hoy» en y=1392. */}
      {/* ---------------- Automations ---------------- */}
      <Reveal delay={0.1} className="order-3 lg:order-none">
        <Card padding="lg">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-ink-900 text-[15px] font-semibold">Automatizaciones</h2>
            <Badge tone="neutral">Configuradas, sin proveedor conectado</Badge>
          </div>
          <p className="text-ink-500 mb-5 text-[13px] leading-relaxed">
            Las reglas están definidas en el backend. Al conectar el proveedor de envío, se activan
            sin tocar código.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              { t: "Documento pendiente 3 días", a: "Recordatorio al cliente por correo", g: "doc" },
              { t: "Permiso caduca en 60 días", a: "Aviso de renovación al cliente y al gestor", g: "cycle" },
              { t: "Requerimiento recibido", a: "Alerta urgente al abogado responsable", g: "alert" },
              { t: "Cita en 24 horas", a: "Recordatorio con el enlace de la videollamada", g: "clock" },
              { t: "Pago fraccionado próximo", a: "Aviso previo antes del cargo", g: "stamp" },
              { t: "Expediente sin movimiento 14 días", a: "Escalado al responsable del área", g: "path" },
            ].map((r) => (
              <li
                key={r.t}
                className="bg-canvas-deep ring-ink-900/[.05] flex items-start gap-3 rounded-sm p-3.5 ring-1 ring-inset"
              >
                <span className="bg-surface text-ink-500 flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                  <Glyph name={r.g} className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="text-ink-900 block text-[13px] font-semibold">{r.t}</span>
                  <span className="text-ink-500 block text-[12px] leading-snug">→ {r.a}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Metric({
  label,
  value,
  sub,
  glyph,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  glyph: string;
  tone?: "neutral" | "warn" | "risk" | "ok";
}) {
  return (
    <Card padding="md">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px]",
          tone === "risk"
            ? "bg-signal-risk-soft text-signal-risk"
            : tone === "warn"
              ? "bg-signal-warn-soft text-signal-warn"
              : tone === "ok"
                ? "bg-signal-ok-soft text-signal-ok"
                : "bg-ink-50 text-ink-500",
        )}
      >
        <Glyph name={glyph} className="size-4" />
      </span>
      <p className="text-ink-900 font-display data mt-3 text-[22px] leading-none font-extrabold tracking-[-0.035em]">
        {value}
      </p>
      <p className="text-ink-400 mt-1.5 text-[11.5px] leading-tight">
        {label} · {sub}
      </p>
    </Card>
  );
}

function AlertCard({
  tone,
  glyph,
  title,
  body,
  href,
}: {
  tone: "risk" | "warn";
  glyph: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // min-w-0 on the grid item and on the text column: without both, the
        // truncated body sets a min-content floor and the card pushes the
        // whole page — measured at 603px inside a 360px viewport.
        "flex min-w-0 items-start gap-3.5 rounded-lg p-4 ring-1 ring-inset transition-transform duration-300 hover:-translate-y-0.5",
        tone === "risk"
          ? "bg-signal-risk-soft ring-signal-risk/20"
          : "bg-signal-warn-soft ring-signal-warn/20",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
          tone === "risk"
            ? "bg-signal-risk/10 text-signal-risk"
            : "bg-signal-warn/10 text-signal-warn",
        )}
      >
        <Glyph name={glyph} className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[14px] font-semibold",
            tone === "risk" ? "text-signal-risk" : "text-signal-warn",
          )}
        >
          {title}
        </span>
        <span className="text-ink-600 mt-0.5 block truncate text-[12.5px]">{body}</span>
      </span>
    </Link>
  );
}
