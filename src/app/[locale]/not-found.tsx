import { Link } from "@/components/ui/Link";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/content/taxonomy";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="grid-fine grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <header className="container-page py-6">
        <Logo size="md" />
      </header>

      <main id="contenido" className="container-page flex flex-1 items-center py-12">
        <div className="mx-auto w-full max-w-2xl text-center">
          <span className="data text-ink-400 text-[13px] font-semibold tracking-[0.14em]">404</span>

          <h1 className="text-display-md md:text-display-lg text-ink-900 mt-4">
            Esta página no existe.
          </h1>
          <p className="text-ink-500 mx-auto mt-5 max-w-lg text-[16.5px] leading-relaxed">
            Puede que el enlace esté mal, o que hayamos movido el contenido. Lo que sí existe es
            todo lo demás: te dejamos por dónde seguir.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/diagnostico" size="lg" arrow magnetic>
              Comprobar mi situación
            </Button>
            <Button href="/tramites" size="lg" variant="secondary">
              Ver todos los trámites
            </Button>
          </div>

          <nav aria-label="Categorías de trámites" className="mt-12">
            <p className="text-ink-400 mb-4 text-[11px] font-bold tracking-[0.11em] uppercase">
              O empieza por una categoría
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tramites/categoria/${c.id}`}
                    className="text-ink-600 hover:text-brand-700 bg-surface hover:bg-brand-50 ring-ink-900/[.07] inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium ring-1 ring-inset transition-colors"
                  >
                    <Glyph name={c.glyph} className="size-4" />
                    {c.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="container-page py-6">
        <Link href="/" className="text-ink-400 hover:text-ink-900 text-[13px] transition-colors">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  );
}
