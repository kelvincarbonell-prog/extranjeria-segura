"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "¿Sois abogados o una gestoría?",
    a: "Trabajamos con profesionales del derecho de extranjería. Cada expediente lo revisa y firma un especialista antes de presentarse; la plataforma es la herramienta con la que lo hacemos, no un sustituto del profesional.",
  },
  {
    q: "¿El diagnóstico me dice si me van a conceder el permiso?",
    a: "No, y desconfía de quien te diga que sí. El diagnóstico te orienta sobre qué vías pueden encajar con tu perfil y qué habría que verificar. Solo un profesional que revise tu documentación real puede valorar si cumples los requisitos.",
  },
  {
    q: "¿Por qué no publicáis una tasa de éxito?",
    a: "Porque no tenemos un modelo estadístico que la sostenga y publicar un porcentaje sin él sería engañarte. Cuando dispongamos de datos suficientes y auditables, los publicaremos con su metodología.",
  },
  {
    q: "¿Qué pasa si mi caso no tiene recorrido?",
    a: "Te lo decimos antes de cobrarte la gestión. Preferimos perder un encargo a cobrarte por presentar algo que sabemos que se va a denegar.",
  },
  {
    q: "¿Tengo que ir a alguna oficina?",
    a: "La gestión del expediente es íntegramente online. Hay dos momentos que la Administración exige de forma presencial: la toma de huellas para la TIE y, en su caso, la jura de nacionalidad. Te preparamos para ambos.",
  },
  {
    q: "¿Qué pasa con mis documentos cuando termina el expediente?",
    a: "Se conservan durante el periodo de retención que marca la normativa y luego se eliminan. Puedes exportar tu expediente completo o pedir su supresión antes en cualquier momento desde tu área privada.",
  },
  {
    q: "¿Las tasas están incluidas en el precio?",
    a: "No. Nuestros honorarios y las tasas administrativas son cosas distintas y las separamos siempre. Junto a cada precio verás exactamente qué no está incluido: tasas, traducciones juradas, apostillas y demás.",
  },
  {
    q: "¿En qué idiomas atendéis?",
    a: "Atendemos en español e inglés. La plataforma está construida para ocho idiomas y los iremos activando a medida que el contenido jurídico esté revisado en cada uno; no publicamos requisitos legales traducidos automáticamente.",
  },
];

export function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Preguntas frecuentes"
              title="Lo que la gente nos pregunta antes de decidirse."
              lede="Y las respuestas que preferiríamos no tener que dar, pero que son las honestas."
            />
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="border-ink-100 border-t">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q} className="border-ink-100 border-b">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="group flex w-full items-start justify-between gap-5 py-5 text-left"
                      >
                        <span
                          className={cn(
                            "text-[15.5px] leading-snug font-semibold tracking-[-0.015em] transition-colors",
                            isOpen ? "text-ink-900" : "text-ink-700 group-hover:text-ink-900",
                          )}
                        >
                          {f.q}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                            isOpen ? "bg-ink-950 rotate-45 text-white" : "bg-ink-50 text-ink-400",
                          )}
                        >
                          <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden>
                            <path
                              d="M7 2.5v9M2.5 7h9"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-ink-500 max-w-xl pr-10 pb-5 text-[14.5px] leading-[1.65]">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
