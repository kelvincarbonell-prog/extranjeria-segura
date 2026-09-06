"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Link } from "@/components/ui/Link";
import { cn } from "@/lib/utils";

/**
 * BARRA DE ACCIÓN FIJA EN MÓVIL (A11).
 *
 * Las fichas y las guías miden dos mil palabras y el botón de contratar vive
 * arriba del todo. Quien llega desde una búsqueda, lee, se convence a mitad de
 * página y no encuentra por dónde seguir, se va: no va a hacer scroll hacia
 * arriba para buscar un botón que no sabe si existe.
 *
 * Solo en móvil. En escritorio el raíl lateral ya cumple esta función, y una
 * barra fija ahí resta altura útil sin aportar nada.
 *
 * Aparece a partir del 15% de scroll —antes sería redundante con el CTA del
 * encabezado, que todavía se ve— y se esconde al llegar al final, donde ya hay
 * un bloque de contratación completo y taparlo con una barra sería competir
 * contra uno mismo.
 *
 * El hueco del segundo botón está reservado para el canal directo. Hoy no
 * existe, así que no se pinta un botón que no lleva a ninguna parte.
 */
export function BarraAccion({
  href,
  etiqueta,
  nota,
  secundario,
}: {
  href: string;
  etiqueta: string;
  /** Microcopy que reduce la fricción del clic. */
  nota?: string;
  secundario?: { href: string; etiqueta: string };
}) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = React.useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setVisible(p > 0.15 && p < 0.92);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 lg:hidden",
            // `pb-safe`: en iPhone la barra de gestos se come el borde inferior
            // y el botón queda por debajo del área tocable.
            "pb-[env(safe-area-inset-bottom)]",
          )}
        >
          <div className="glass border-ink-900/10 border-t px-4 py-3">
            <div className="flex items-center gap-2.5">
              {secundario && (
                <Link
                  href={secundario.href}
                  className="text-ink-700 border-ink-900/12 flex h-12 shrink-0 items-center rounded-sm border px-4 text-[14px] font-medium"
                >
                  {secundario.etiqueta}
                </Link>
              )}
              <Link
                href={href}
                className="bg-ink-950 flex h-12 flex-1 items-center justify-center gap-2 rounded-sm px-5 text-[15px] font-semibold text-white"
              >
                {etiqueta}
                <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
                  <path
                    d="M3 8h9.5M9 4.5 12.5 8 9 11.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
            {nota && (
              <p className="text-ink-500 mt-2 text-center text-[12px] leading-snug">{nota}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
