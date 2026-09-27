import { Card, Badge, Avatar } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { Reveal } from "@/components/motion/primitives";
import { CerrarSesion, SinSesion } from "@/components/auth/CerrarSesion";
import { LanguageSwitcher } from "@/components/marketing/LanguageSwitcher";
import { ROLE_MAP } from "@/content/roles";
import { USUARIOS_DEMO } from "@/content/demo-sesion";
import { rolDemo } from "@/lib/rol-demo";
import { sesionDemo } from "@/lib/sesion-demo";
import { navPermitida } from "@/content/nav-admin";
import type { Role } from "@/content/roles";

export const metadata = { title: "Tu cuenta" };

/**
 * TU CUENTA.
 *
 * El panel no tenía ninguna: la identidad vivía en un avatar de la cabecera y
 * la salida, en un botón de 42 px al lado. Esta pantalla responde las tres
 * preguntas que alguien se hace sobre su propia cuenta y no podía responder
 * en ninguna parte: quién soy aquí, qué me deja hacer este rol, y cómo salgo.
 *
 * Lo que enseña son **los permisos reales**, los mismos que deciden la
 * navegación y cierran las pantallas —ver `roles.ts`—, no una lista escrita
 * aparte. Una página de cuenta que describe permisos que el código no aplica
 * es peor que no tenerla.
 */
export default async function CuentaPage() {
  const rol = await rolDemo();
  const sesion = await sesionDemo();
  const definicion = ROLE_MAP[rol];
  const perfil = USUARIOS_DEMO[rol as Exclude<Role, "cliente">];
  const nombre = sesion?.nombre ?? perfil.nombre;
  const pantallas = navPermitida(rol);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
          Tu cuenta
        </h1>
        <p className="text-ink-500 mt-1.5 text-[14.5px]">
          Quién eres en el panel, qué te deja hacer tu rol y cómo salir.
        </p>
      </div>

      {/* ───────── Identidad ───────── */}
      <Reveal>
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={nombre} size={56} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em]">
                {nombre}
              </p>
              <p className="text-ink-500 mt-0.5 text-[13.5px]">
                {sesion?.puesto ?? perfil.puesto}
              </p>
              {sesion && (
                <p className="data text-ink-400 mt-1 text-[12.5px]">{sesion.email}</p>
              )}
            </div>
            <Badge tone="brand" className="self-start sm:self-center">
              {definicion.label}
            </Badge>
          </div>
        </Card>
      </Reveal>

      {/* ───────── Qué puede este rol ───────── */}
      <Reveal delay={0.05}>
        <Card padding="lg">
          <h2 className="text-ink-900 text-[16px] font-semibold">Lo que te permite tu rol</h2>
          <p className="text-ink-500 mt-1 text-[13px] leading-relaxed">
            {definicion.description}
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
                Puedes
              </p>
              <ul className="flex flex-col gap-1.5">
                {definicion.can.map((c) => (
                  <li key={c} className="text-ink-700 flex gap-2.5 text-[13.5px] leading-snug">
                    <span className="bg-signal-ok mt-1.5 size-1 shrink-0 rounded-full" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
                No puedes
              </p>
              <ul className="flex flex-col gap-1.5">
                {definicion.cannot.map((c) => (
                  <li key={c} className="text-ink-500 flex gap-2.5 text-[13.5px] leading-snug">
                    <span className="bg-ink-300 mt-1.5 size-1 shrink-0 rounded-full" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Las pantallas que se ven salen de la misma función que pinta el
              menú. Si algún día divergieran, esta página mentiría sobre la
              de al lado. */}
          <div className="border-ink-100 mt-5 border-t pt-5">
            <p className="text-ink-400 mb-2 text-[11px] font-bold tracking-[0.11em] uppercase">
              Pantallas a las que entras ({pantallas.length})
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {pantallas.map((p) => (
                <li
                  key={p.href}
                  className="bg-ink-50 text-ink-600 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px]"
                >
                  <Glyph name={p.glyph} className="size-3.5" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Reveal>

      {/* ───────── Idioma ───────── */}
      <Reveal delay={0.1}>
        <Card padding="lg">
          <h2 className="text-ink-900 text-[16px] font-semibold">Idioma de la interfaz</h2>
          <p className="text-ink-500 mt-1 max-w-xl text-[13px] leading-relaxed">
            El panel está en español y el contenido jurídico también. Lo que cambia con esto es la
            interfaz del sitio; los expedientes y los escritos siguen en el idioma en que están.
          </p>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </Card>
      </Reveal>

      {/* ───────── Salir ───────── */}
      <Reveal delay={0.15}>
        <Card padding="lg">
          <h2 className="text-ink-900 text-[16px] font-semibold">Sesión</h2>
          {sesion ? (
            <>
              <p className="text-ink-500 mt-1 max-w-xl text-[13px] leading-relaxed">
                Al salir se borran las dos cookies de la demostración —la de sesión y la del rol— y
                vuelves a la pantalla de acceso.
              </p>
              <CerrarSesion className="mt-4 max-w-xs" />
            </>
          ) : (
            <SinSesion className="mt-2" />
          )}
        </Card>
      </Reveal>
    </div>
  );
}
