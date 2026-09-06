import { Link } from "@/components/ui/Link";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { CheckDraw } from "@/components/motion/primitives";

/**
 * Split auth layout.
 *
 * The right panel is not decoration: it restates what the account actually
 * gives you and how the data is protected, because "create an account" on an
 * immigration site is a bigger ask than on a shopping site.
 */
export function AuthLayout({
  children,
  side,
}: {
  children: React.ReactNode;
  side: { title: string; points: string[] };
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* ---------------- Form ---------------- */}
      <div className="relative flex flex-col px-5 py-8 sm:px-8 lg:px-14">
        <div
          aria-hidden
          className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-50 lg:hidden"
        />
        <header className="mb-auto">
          <Logo size="md" />
        </header>

        <main id="contenido" className="mx-auto w-full max-w-[420px] py-12">
          {children}
        </main>

        <footer className="text-ink-400 mt-auto flex flex-wrap gap-x-5 gap-y-2 text-[12.5px]">
          <Link href="/legal/privacidad" className="hover:text-ink-700 tap inline-block transition-colors">
            Privacidad
          </Link>
          <Link href="/legal/aviso-legal" className="hover:text-ink-700 tap inline-block transition-colors">
            Aviso legal
          </Link>
          <Link href="/seguridad" className="hover:text-ink-700 tap inline-block transition-colors">
            Seguridad
          </Link>
        </footer>
      </div>

      {/* ---------------- Side panel ---------------- */}
      <aside className="bg-ink-950 relative hidden isolate overflow-hidden lg:flex lg:flex-col lg:justify-center lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(760px 420px at 20% 10%, rgba(65,89,250,.36), transparent 62%), radial-gradient(520px 380px at 90% 92%, rgba(11,138,95,.16), transparent 62%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, #000 5%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, #000 5%, transparent 72%)",
          }}
        />

        <div className="relative max-w-md">
          <h2 className="font-display text-[32px] leading-[1.08] font-extrabold tracking-[-0.038em] text-white">
            {side.title}
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {side.points.map((p, i) => (
              <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-white/65">
                <span className="bg-signal-ok/15 text-signal-ok mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                  <CheckDraw size={11} strokeWidth={3.2} delay={0.3 + i * 0.12} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                { glyph: "lock", label: "Almacenamiento privado" },
                { glyph: "shield", label: "Aislamiento por fila" },
                { glyph: "doc", label: "Registro de auditoría" },
                { glyph: "globe", label: "Datos alojados en la UE" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="flex items-center gap-2 text-[12.5px] text-white/45"
                >
                  <Glyph name={t.glyph} className="size-4" />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
