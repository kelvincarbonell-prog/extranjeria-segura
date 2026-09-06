import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { footerNav, site } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Glyph } from "@/components/brand/Glyph";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-ink-100 relative border-t">
      {/* ---------- Closing CTA ---------- */}
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-2xl bg-ink-950 px-6 py-14 md:px-14 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(760px 340px at 18% -10%, rgba(65,89,250,.42), transparent 62%), radial-gradient(600px 320px at 88% 118%, rgba(36,56,232,.30), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, #000 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, #000 20%, transparent 75%)",
            }}
          />

          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-display-md md:text-display-lg text-white">
                ¿No sabes qué trámite necesitas?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-white/60">
                Responde unas preguntas y te diremos qué vías pueden encajar contigo, qué
                documentación hace falta y qué habría que verificar. Sin registro y sin coste.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="/diagnostico" size="lg" variant="inverse" arrow magnetic>
                Haz el diagnóstico gratuito
              </Button>
              <Button
                href="/tramites"
                size="lg"
                className="border border-white/15 bg-white/[.06] text-white hover:bg-white/[.12]"
                variant="ghost"
              >
                Ver todos los trámites
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Sitemap ---------- */}
      <div className="container-page pt-16 pb-10 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))] md:gap-8">
          <div>
            <Logo size="md" />
            <p className="text-ink-500 mt-5 max-w-xs text-[14px] leading-relaxed">
              Gestionamos tu extranjería de principio a fin. Tú sabes en todo momento dónde está tu
              expediente, qué falta y quién te está ayudando.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <TrustChip glyph="lock" label="Datos cifrados" />
              <TrustChip glyph="shield" label="RGPD" />
              <TrustChip glyph="doc" label="Expediente trazable" />
            </div>
          </div>

          {Object.entries(footerNav).map(([group, links]) => (
            <nav key={group} aria-label={group}>
              <h3 className="text-ink-900 mb-4 text-[12px] font-bold tracking-[0.1em] uppercase">
                {group}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-ink-500 hover:text-ink-900 tap inline-block text-[13.5px] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ---------- Legal strip ---------- */}
      <div className="border-ink-100 border-t">
        <div className="container-page flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
          <div className="text-ink-400 flex flex-col gap-1 text-[12.5px]">
            <p>
              © {year} {site.legalName ?? site.name}
              {site.nif ? ` · ${site.nif}` : ""} · Todos los derechos reservados.
            </p>
            <p className="max-w-2xl leading-relaxed">
              La información publicada en este sitio tiene carácter orientativo y no constituye
              asesoramiento jurídico. Cada expediente requiere el análisis de un profesional.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/legal/cookies"
              className="text-ink-400 hover:text-ink-900 tap inline-block text-[12.5px] transition-colors"
            >
              Preferencias de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TrustChip({ glyph, label }: { glyph: string; label: string }) {
  return (
    <span className="text-ink-500 bg-ink-50 ring-ink-900/[.05] inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-medium ring-1 ring-inset">
      <Glyph name={glyph} className="size-3.5" />
      {label}
    </span>
  );
}
