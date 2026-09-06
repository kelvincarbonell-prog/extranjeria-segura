import { ROLES } from "@/content/roles";
import { Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";

export const metadata = { title: "Equipo y roles" };

const GLYPHS: Record<string, string> = {
  admin: "shield",
  abogado: "scales",
  gestor: "path",
  paralegal: "doc",
  comercial: "door",
  cliente: "family",
};

export default function EquipoPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
          Equipo y roles
        </h1>
        <p className="text-ink-500 mt-1.5 max-w-2xl text-[14.5px] leading-relaxed">
          Estos permisos no son una convención de la interfaz: se corresponden con las políticas de
          seguridad a nivel de fila de la base de datos. Ocultar un botón no protege un pasaporte;
          la política sí.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {ROLES.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.05}>
            <Card padding="lg" className="h-full">
              <div className="mb-4 flex items-center gap-3">
                <span className="bg-ink-950 flex size-10 items-center justify-center rounded-[12px] text-white">
                  <Glyph name={GLYPHS[r.id]} className="size-[19px]" />
                </span>
                <div>
                  <h2 className="text-ink-900 font-display text-[17px] font-extrabold tracking-[-0.028em]">
                    {r.label}
                  </h2>
                  <p className="text-ink-400 text-[12.5px]">{r.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
                  Puede
                </p>
                <ul className="flex flex-col gap-1.5">
                  {r.can.map((c) => (
                    <li key={c} className="text-ink-600 flex gap-2 text-[13px] leading-snug">
                      <span className="bg-signal-ok mt-1.5 size-1 shrink-0 rounded-full" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
                  No puede
                </p>
                <ul className="flex flex-col gap-1.5">
                  {r.cannot.map((c) => (
                    <li key={c} className="text-ink-500 flex gap-2 text-[13px] leading-snug">
                      <span className="bg-signal-risk mt-1.5 size-1 shrink-0 rounded-full" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Card padding="lg">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-ink-900 text-[15px] font-semibold">Miembros del equipo</h2>
          <Badge tone="neutral">Pendiente de configurar</Badge>
        </div>
        <p className="text-ink-500 text-[13.5px] leading-relaxed">
          No hay miembros dados de alta todavía. Se crean invitando por correo desde aquí una vez
          activada la autenticación; cada invitación asigna un rol y queda registrada en el log de
          auditoría. No incluimos personas de ejemplo: un equipo ficticio en un panel interno acaba
          apareciendo en una captura de pantalla comercial.
        </p>
        <LegalNote variant="framed" className="mt-4">
          El rol de abogado debe asignarse únicamente a profesionales colegiados. La firma y
          presentación de expedientes queda vinculada a la persona concreta que la realiza y se
          registra de forma inmutable.
        </LegalNote>
      </Card>
    </div>
  );
}
