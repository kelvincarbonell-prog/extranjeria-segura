import dynamic from "next/dynamic";
import { Reveal } from "@/components/motion/primitives";
import { LegalNote } from "@/components/ui/primitives";
import { locales } from "@/content/site";

const Globe = dynamic(() => import("./Globe").then((m) => m.Globe));

const CORRIDORS = [
  "Latinoamérica",
  "Brasil",
  "Estados Unidos",
  "Reino Unido",
  "Europa del Este",
  "Asia",
  "Norte de África",
];

export function GlobeSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <span className="eyebrow mb-5">
                <span aria-hidden className="bg-brand-600 h-px w-5 rounded-full" />
                Sin importar desde dónde
              </span>
              <h2 className="text-display-md md:text-display-lg text-ink-900">
                De cualquier parte del mundo.
                <br />
                <span className="text-ink-300">A España.</span>
              </h2>
              <p className="text-ink-500 mt-5 max-w-lg text-[17px] leading-[1.6]">
                Todo el proceso es telemático. Puedes empezar tu expediente desde Bogotá, São Paulo,
                Londres o Casablanca, y continuarlo desde tu casa en Valencia sin perder un solo
                documento por el camino.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {CORRIDORS.map((c) => (
                  <li
                    key={c}
                    className="text-ink-600 bg-surface ring-ink-900/[.06] rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="border-ink-100 mt-9 border-t pt-7">
                <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.12em] uppercase">
                  Plataforma preparada en {locales.length} idiomas
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {locales.map((l) => (
                    <li
                      key={l.code}
                      className={`text-[14px] ${l.ready ? "text-ink-700 font-medium" : "text-ink-300"}`}
                      dir={l.dir}
                    >
                      {l.native}
                      {!l.ready && <span className="ml-1.5 text-[10px] uppercase">pronto</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <LegalNote className="mt-6 max-w-lg">
                La ilustración representa corredores migratorios habituales hacia España. No
                representa datos de clientes ni volúmenes de expedientes.
              </LegalNote>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <div className="relative aspect-square w-full">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(65,89,250,.14), transparent 76%)",
                }}
              />
              <Globe className="size-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
