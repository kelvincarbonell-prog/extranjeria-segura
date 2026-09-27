import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/motion/primitives";
import { Glyph } from "@/components/brand/Glyph";

/**
 * PROBABLEMENTE ESTÁS EN UNA DE ESTAS.
 *
 * La portada iba de «Tu vida en España» a «Dinos qué quieres conseguir» sin
 * ningún momento intermedio. Entre las dos falta lo único que hace que
 * alguien se quede: que la página nombre la situación en la que está antes de
 * pedirle nada.
 *
 * ─── OBJETIVOS Y SITUACIONES NO SON LO MISMO ────────────────────────────
 *
 * El selector de más abajo pregunta por objetivos —«quiero vivir en España»,
 * «quiero trabajar»—, que es lo que quieres conseguir. Esto pregunta por
 * dónde estás, que es distinto y suele ser más urgente. Quien acaba de abrir
 * una carta de la Administración no está pensando en su objetivo vital: está
 * pensando en ese papel.
 *
 * Y quien está en una de estas situaciones no busca «arraigo sociolaboral»
 * —no sabe que se llama así—, busca «me han denegado los papeles». El
 * catálogo entero está indexado por el nombre técnico; esto es la entrada por
 * el otro lado.
 *
 * ─── DE DÓNDE SALE LA VOZ ───────────────────────────────────────────────
 *
 * Tres de estas frases no son nuevas: son el campo `comoLoVives` que el hub
 * de la regularización ya usaba junto al nombre técnico de cada estado. La
 * idea estaba escrita y vivía en una sola página; aquí sube a la portada.
 *
 * ─── LO QUE HUMANIZAR NO PUEDE SIGNIFICAR AQUÍ ──────────────────────────
 *
 * Ni una cara de banco de imágenes, ni un testimonio, ni una cifra de casos
 * resueltos. La tentación al «humanizar» una landing legal es exactamente esa,
 * y en este producto está prohibida: no se inventan clientes ni resultados.
 * Lo humano es nombrar bien la situación de quien lee, no poblarla de gente
 * que no existe.
 */

const SITUACIONES: {
  frase: string;
  detalle: string;
  href: string;
  glifo: string;
  /** Marca las que llevan un plazo corriendo detrás. */
  urgente?: boolean;
}[] = [
  {
    frase: "Me ha llegado un papel y no entiendo qué me pide",
    detalle: "Un requerimiento tiene plazo, y el plazo corre desde que te lo notifican.",
    href: "/regularizacion-2026/subsanacion",
    glifo: "alert",
    urgente: true,
  },
  {
    frase: "Me la han denegado",
    detalle: "Hay plazo para recurrir, y depende del día en que te lo notificaron.",
    href: "/regularizacion-2026/denegacion",
    glifo: "scales",
    urgente: true,
  },
  {
    frase: "No me contestan y no sé si eso es bueno o malo",
    detalle: "El silencio también tiene fecha. Te decimos cuál es la tuya.",
    href: "/regularizacion-2026/silencio-administrativo",
    glifo: "clock",
    urgente: true,
  },
  {
    frase: "Llevo años aquí y no sé por dónde se empieza",
    detalle: "Hay cinco vías de arraigo distintas y no todas piden lo mismo.",
    href: "/tramites/categoria/arraigo",
    glifo: "roots",
  },
  {
    frase: "Mi tarjeta caduca y no quiero volver a la casilla de salida",
    detalle: "La renovación tiene una ventana concreta. Calcularla es gratis.",
    href: "/calculadoras/plazos-regularizacion",
    glifo: "cycle",
  },
  {
    frase: "Trabajo en remoto y quiero mudarme a España",
    detalle: "Qué pide el visado de teletrabajo y qué hay que acreditar.",
    href: "/tramites/teletrabajo-internacional",
    glifo: "signal",
  },
];

export function Situaciones() {
  return (
    <section
      id="situaciones"
      aria-labelledby="situaciones-titulo"
      className="bg-canvas-deep scroll-mt-28 py-16 md:py-24"
    >
      <div className="container-page">
        <Reveal>
          <h2
            id="situaciones-titulo"
            className="text-display-md md:text-display-lg text-ink-900 text-balance"
          >
            Probablemente estás en una de estas.
          </h2>
          <p className="text-ink-500 mt-4 max-w-xl text-[17px] leading-[1.6]">
            No hace falta que sepas cómo se llama tu trámite. Empieza por lo que te está pasando.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SITUACIONES.map((s, i) => (
            <Reveal key={s.href} delay={i * 0.04} as="li">
              <Link
                href={s.href}
                className="group bg-surface ring-ink-900/[.07] hover:ring-brand-600/30 flex h-full flex-col rounded-lg p-5 ring-1 transition-all duration-200 ring-inset hover:shadow-[0_12px_28px_-14px_rgb(10_13_22_/_0.25)]"
              >
                <span className="flex items-start gap-3">
                  <span
                    className={
                      s.urgente
                        ? "bg-signal-risk-soft text-signal-risk flex size-9 shrink-0 items-center justify-center rounded-[11px]"
                        : "bg-ink-50 text-ink-500 group-hover:bg-brand-50 group-hover:text-brand-700 flex size-9 shrink-0 items-center justify-center rounded-[11px] transition-colors"
                    }
                  >
                    <Glyph name={s.glifo} className="size-[17px]" />
                  </span>
                  {/* Las comillas no son decorativas: marcan que la frase es de
                      quien lee, no nuestra. Es la diferencia entre reconocerse
                      y que te describan. */}
                  <span className="text-ink-900 text-[15.5px] leading-snug font-semibold text-balance">
                    «{s.frase}»
                  </span>
                </span>

                <span className="text-ink-500 mt-3 block text-[13.5px] leading-relaxed">
                  {s.detalle}
                </span>

                <span className="text-brand-600 group-hover:text-brand-800 mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors">
                  {s.urgente ? "Ver mi plazo" : "Ver qué me toca"}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* La salida para quien no se reconoce en ninguna. Sin esto, seis
            tarjetas que no encajan se leen como «esto no es para mí». */}
        <Reveal delay={0.25}>
          <p className="text-ink-500 mt-8 text-[14.5px]">
            ¿No es ninguna de estas?{" "}
            <Link
              href="/diagnostico"
              className="text-brand-600 hover:text-brand-800 font-semibold underline underline-offset-2"
            >
              Cuéntanos tu caso en tres minutos
            </Link>{" "}
            y te decimos por dónde va.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
