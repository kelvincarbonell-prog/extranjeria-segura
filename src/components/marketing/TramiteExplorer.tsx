"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Tramite } from "@/content/taxonomy";
import { Glyph } from "@/components/brand/Glyph";
import { Badge } from "@/components/ui/primitives";
import { eur, cn } from "@/lib/utils";

/** Diacritic-insensitive matching: "nomada" must find "nómada". */
function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function TramiteExplorer({
  tramites,
  categories,
}: {
  tramites: Tramite[];
  categories: Category[];
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(null);

  const results = React.useMemo(() => {
    const q = fold(query.trim());
    return tramites.filter((t) => {
      if (category && t.category !== category && !t.alsoIn?.includes(category as never))
        return false;
      if (!q) return true;
      const haystack = fold(
        [t.name, t.shortName ?? "", t.tagline, t.whatItIs, ...t.forWho].join(" "),
      );
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [tramites, query, category]);

  return (
    <section className="pb-24">
      <div className="container-page">
        {/* ---- Controls ---- */}
        <div className="bg-canvas/85 sticky top-[86px] z-20 -mx-1 rounded-lg px-1 py-3 backdrop-blur-lg">
          <div className="relative">
            <span className="text-ink-300 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
                <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13.6 13.6 3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por trámite, situación u objetivo — «arraigo», «renovar», «traer a mi mujer»…"
              aria-label="Buscar trámites"
              className="bg-surface text-ink-900 placeholder:text-ink-300 h-14 w-full rounded-lg pr-4 pl-12 text-[15px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] transition-shadow outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
            />
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              Todos
              <span className="data ml-1.5 opacity-50">{tramites.length}</span>
            </FilterChip>
            {categories.map((c) => {
              const count = tramites.filter(
                (t) => t.category === c.id || t.alsoIn?.includes(c.id),
              ).length;
              if (count === 0) return null;
              return (
                <FilterChip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(category === c.id ? null : c.id)}
                >
                  <Glyph name={c.glyph} className="size-3.5" />
                  {c.short}
                  <span className="data ml-0.5 opacity-50">{count}</span>
                </FilterChip>
              );
            })}
          </div>
        </div>

        {/* ---- Results ---- */}
        <p aria-live="polite" className="text-ink-400 mt-6 mb-4 text-[13px]">
          {results.length === 0
            ? "Ningún trámite coincide con tu búsqueda."
            : `${results.length} ${results.length === 1 ? "trámite" : "trámites"}`}
        </p>

        {results.length === 0 ? (
          <div className="bg-surface rounded-lg p-10 text-center shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
            <p className="text-ink-700 text-[16px] font-semibold">
              No pasa nada: casi nadie sabe cómo se llama su trámite.
            </p>
            <p className="text-ink-500 mx-auto mt-2 max-w-md text-[14px] leading-relaxed">
              Cuéntanos tu situación en el diagnóstico y te decimos nosotros qué vías pueden encajar.
            </p>
            <Link
              href="/diagnostico"
              className="bg-ink-950 mt-6 inline-flex h-11 items-center rounded-xs px-5 text-[14.5px] font-medium text-white"
            >
              Hacer el diagnóstico
            </Link>
          </div>
        ) : (
          <motion.ul layout className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((t) => (
                <motion.li
                  key={t.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TramiteCard tramite={t} categories={categories} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
        active
          ? "bg-ink-950 text-white"
          : "bg-surface text-ink-600 hover:text-ink-900 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]",
      )}
    >
      {children}
    </button>
  );
}

export function TramiteCard({
  tramite: t,
  categories,
}: {
  tramite: Tramite;
  categories: Category[];
}) {
  const cat = categories.find((c) => c.id === t.category);
  return (
    <Link
      href={`/tramites/${t.slug}`}
      className="group bg-surface flex h-full flex-col rounded-lg p-5 shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(36_56_232_/_0.2),0_20px_48px_-18px_rgb(10_13_22_/_0.22)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="bg-ink-50 text-ink-600 group-hover:bg-brand-600 flex size-10 shrink-0 items-center justify-center rounded-[12px] transition-colors duration-400 group-hover:text-white">
          <Glyph name={cat?.glyph ?? "doc"} className="size-[19px]" />
        </span>
        {cat && (
          <span className="text-ink-300 text-[11px] font-semibold tracking-[0.08em] uppercase">
            {cat.short}
          </span>
        )}
      </div>

      <h2 className="text-ink-900 font-display mt-4 text-[17px] leading-tight font-extrabold tracking-[-0.028em]">
        {t.shortName ?? t.name}
      </h2>
      <p className="text-ink-500 mt-2 flex-1 text-[13.5px] leading-relaxed">{t.tagline}</p>

      <div className="border-ink-100 mt-4 flex items-center justify-between border-t pt-3.5">
        <span className="text-ink-400 text-[12.5px]">
          {t.feeFromCents !== null ? (
            <>
              desde{" "}
              <span className="text-ink-900 data font-semibold">{eur(t.feeFromCents)}</span>
            </>
          ) : (
            "Presupuesto a medida"
          )}
        </span>
        <span className="data text-ink-300 text-[11.5px]">{t.documents.length} docs</span>
      </div>

      {t.pendingLegalReview && (
        <Badge tone="neutral" className="mt-3 self-start text-[10.5px]">
          Contenido en revisión jurídica
        </Badge>
      )}
    </Link>
  );
}
