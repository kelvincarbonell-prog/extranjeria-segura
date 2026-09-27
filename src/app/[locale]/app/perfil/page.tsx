import { DEMO_CASE } from "@/content/demo";
import { Card, Avatar, Badge, LegalNote, KeyValue } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";
import { LanguageSwitcher } from "@/components/marketing/LanguageSwitcher";
import { CerrarSesion, SinSesion } from "@/components/auth/CerrarSesion";
import { sesionDemo } from "@/lib/sesion-demo";

export const metadata = { title: "Perfil" };

/**
 * Profile.
 *
 * The RGPD rights are controls on this page, not paragraphs in a policy: a
 * right you have to email someone to exercise is a right with friction on it.
 */
const RIGHTS = [
  {
    glyph: "doc",
    title: "Descargar todos mis datos",
    detail: "Un archivo con tu perfil, tu expediente, tus documentos y el histórico de acciones.",
    action: "Solicitar exportación",
  },
  {
    glyph: "shield",
    title: "Ver quién ha accedido a mi expediente",
    detail: "Registro de auditoría: qué persona del equipo ha visto o modificado qué y cuándo.",
    action: "Ver registro",
  },
  {
    glyph: "alert",
    title: "Rectificar un dato incorrecto",
    detail: "Si algo de tu perfil o de tu expediente no es correcto, lo corregimos.",
    action: "Solicitar rectificación",
  },
  {
    glyph: "lock",
    title: "Suprimir mis datos",
    detail:
      "Puedes pedir la supresión. Te explicamos qué debemos conservar por obligación legal y durante cuánto tiempo.",
    action: "Solicitar supresión",
  },
];

export default async function PerfilPage() {
  const sesion = await sesionDemo();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
          Perfil
        </h1>
        <p className="text-ink-500 mt-1.5 text-[15px]">
          Tus datos, tu seguridad y tus derechos, en un solo sitio.
        </p>
      </div>

      <Reveal>
        <Card padding="lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={DEMO_CASE.clientFirstName} size={64} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-900 font-display text-[20px] font-extrabold tracking-[-0.03em]">
                {DEMO_CASE.clientFirstName}
              </p>
              <p className="text-ink-400 mt-0.5 text-[13.5px]">Cuenta de demostración</p>
            </div>
          </div>

          <dl className="divide-ink-100 mt-6 divide-y border-t border-ink-100 pt-2">
            <KeyValue k="Zona horaria" v="Europe/Madrid" />
            <KeyValue k="Expediente activo" v={`#${DEMO_CASE.reference}`} mono />
          </dl>

          {/* «Idioma de la plataforma: Español» estaba escrito como dato fijo,
              con forma de ajuste y sin serlo, teniendo el sitio ocho idiomas
              construidos y un selector que funciona por URL. Un ajuste que no
              ajusta nada es peor que no ofrecerlo. */}
          <div className="border-ink-100 mt-5 border-t pt-5">
            <p className="text-ink-700 text-[13.5px] font-medium">Idioma de la plataforma</p>
            <p className="text-ink-400 mt-0.5 mb-3 text-[12.5px] leading-relaxed">
              Cambia la interfaz y se conserva al navegar. Tu expediente y los documentos siguen en
              el idioma en que están.
            </p>
            <LanguageSwitcher />
          </div>
        </Card>
      </Reveal>

      {/* ---------------- Security ---------------- */}
      <Reveal delay={0.05}>
        <Card padding="lg">
          <h2 className="text-ink-900 mb-1 text-[16px] font-semibold">Seguridad de la cuenta</h2>
          <p className="text-ink-500 mb-5 text-[13.5px] leading-relaxed">
            Tu cuenta da acceso a tu pasaporte y a tu documentación migratoria. Protégela como
            protegerías tu banco.
          </p>

          <ul className="divide-ink-100 divide-y">
            <SecurityRow
              glyph="lock"
              title="Contraseña"
              detail="Última actualización hace más de 90 días"
              action="Cambiar"
              tone="warn"
            />
            <SecurityRow
              glyph="shield"
              title="Verificación en dos pasos"
              detail="Añade un segundo factor para entrar en tu expediente"
              action="Activar"
              tone="warn"
            />
            <SecurityRow
              glyph="globe"
              title="Sesiones activas"
              detail="1 dispositivo · Madrid, España"
              action="Gestionar"
              tone="ok"
            />
            <SecurityRow
              glyph="clock"
              title="Cierre de sesión automático"
              detail="Tras 30 minutos de inactividad"
              action="Configurar"
              tone="ok"
            />
          </ul>
        </Card>
      </Reveal>

      {/* ---------------- RGPD ---------------- */}
      <Reveal delay={0.08}>
        <Card padding="lg">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="bg-brand-50 text-brand-600 flex size-8 items-center justify-center rounded-[10px]">
              <Glyph name="shield" className="size-[18px]" />
            </span>
            <div>
              <h2 className="text-ink-900 text-[16px] font-semibold">Tus derechos sobre tus datos</h2>
              <p className="text-ink-400 text-[12.5px]">
                Ejercitables desde aquí, sin escribir a nadie
              </p>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {RIGHTS.map((r) => (
              <li
                key={r.title}
                className="bg-canvas-deep ring-ink-900/[.05] flex flex-col rounded-sm p-4 ring-1 ring-inset"
              >
                <span className="bg-surface text-ink-500 flex size-8 items-center justify-center rounded-[10px]">
                  <Glyph name={r.glyph} className="size-4" />
                </span>
                <p className="text-ink-900 mt-3 text-[14px] font-semibold">{r.title}</p>
                <p className="text-ink-500 mt-1 flex-1 text-[12.5px] leading-relaxed">{r.detail}</p>
                <Button variant="secondary" size="sm" className="mt-3.5 self-start">
                  {r.action}
                </Button>
              </li>
            ))}
          </ul>

          <LegalNote variant="framed" className="mt-5">
            Atendemos estas solicitudes en el plazo previsto por el RGPD. Algunos documentos deben
            conservarse durante un periodo legal aunque solicites la supresión; en ese caso te
            indicamos cuáles, por qué y hasta cuándo.
          </LegalNote>
        </Card>
      </Reveal>

      {/* ---------------- Consents ---------------- */}
      <Reveal delay={0.1}>
        <Card padding="lg">
          <h2 className="text-ink-900 mb-1 text-[16px] font-semibold">Consentimientos</h2>
          <p className="text-ink-500 mb-4 text-[13.5px] leading-relaxed">
            Registramos qué has consentido y cuándo. Puedes retirar cualquiera de ellos sin que
            afecte a la gestión de tu expediente.
          </p>
          <ul className="divide-ink-100 divide-y">
            {[
              { t: "Tratamiento de datos para la gestión del expediente", d: "Base legal: ejecución de contrato", locked: true },
              { t: "Comunicaciones comerciales", d: "Novedades del servicio y contenido útil", locked: false, on: false },
              { t: "Uso de mi caso, anonimizado, con fines estadísticos", d: "Nunca se publican datos identificables", locked: false, on: false },
            ].map((c) => (
              <li key={c.t} className="flex items-center gap-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-ink-900 text-[13.5px] font-medium">{c.t}</p>
                  <p className="text-ink-400 text-[12px]">{c.d}</p>
                </div>
                <Badge tone={c.locked ? "neutral" : c.on ? "ok" : "neutral"} className="shrink-0">
                  {c.locked ? "Necesario" : c.on ? "Activo" : "No otorgado"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      {/* ───────── Sesión ─────────
          En móvil no había ninguna forma de cerrar sesión: el control vivía
          en la barra lateral, que se oculta por debajo de `lg`. Un cliente
          que entra desde el teléfono —la mayoría— se quedaba dentro. */}
      <Reveal delay={0.2}>
        <Card padding="lg">
          <h2 className="text-ink-900 mb-1 text-[16px] font-semibold">Sesión</h2>
          {sesion ? (
            <>
              <p className="text-ink-500 mb-4 max-w-xl text-[13.5px] leading-relaxed">
                Cierra la sesión si compartes el dispositivo. Tus documentos siguen guardados y los
                recuperas al volver a entrar.
              </p>
              <CerrarSesion className="max-w-xs" />
            </>
          ) : (
            <SinSesion className="mt-2" />
          )}
        </Card>
      </Reveal>

    </div>
  );
}

function SecurityRow({
  glyph,
  title,
  detail,
  action,
  tone,
}: {
  glyph: string;
  title: string;
  detail: string;
  action: string;
  tone: "ok" | "warn";
}) {
  return (
    <li className="flex items-center gap-3.5 py-3.5">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-[11px] ${
          tone === "ok" ? "bg-signal-ok-soft text-signal-ok" : "bg-signal-warn-soft text-signal-warn"
        }`}
      >
        <Glyph name={glyph} className="size-[17px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink-900 text-[14px] font-medium">{title}</p>
        <p className="text-ink-400 text-[12.5px]">{detail}</p>
      </div>
      <Button variant="secondary" size="sm" className="shrink-0">
        {action}
      </Button>
    </li>
  );
}
