"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Glyph } from "@/components/brand/Glyph";
import type { EntradaNav } from "@/content/nav-admin";
import { cn } from "@/lib/utils";

/**
 * NAVEGACIÓN DEL PANEL EN MÓVIL.
 *
 * Antes era una fila de pestañas con desplazamiento horizontal bajo la
 * cabecera. Medido en un móvil de 360 px con la cuenta de administrador: se
 * veían **tres de ocho**, y «Expedientes» —la lista de trabajo del día,
 * ordenada por prioridad— no era ninguna de las tres. Estaba a un arrastre
 * lateral que nada anuncia.
 *
 * Reordenar no lo arregla: solo cambia cuáles se esconden. Un carrusel
 * horizontal esconde por diseño, y en una herramienta interna lo que se
 * esconde deja de usarse.
 *
 * Aquí las cuatro de cada día están siempre visibles y el resto vive en
 * «Más», que es una diferencia importante: un menú se sabe que está, un
 * elemento fuera de pantalla no.
 *
 * ─── POR QUÉ ABAJO ──────────────────────────────────────────────────────
 *
 * Por el pulgar, y por coherencia: el área de cliente ya navega así desde el
 * principio. Que las dos mitades del producto se manejen igual en el mismo
 * teléfono no es una preferencia estética, es una cosa menos que aprender.
 *
 * `env(safe-area-inset-bottom)` para que no quede debajo de la barra de
 * gestos del iPhone, y `pb-24` en el contenido para que la barra no tape la
 * última fila de una tabla.
 */
export function NavMovil({ barra, mas }: { barra: EntradaNav[]; mas: EntradaNav[] }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = React.useState(false);
  const reduce = useReducedMotion();

  const activa = (item: EntradaNav) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const hayActivaEnMas = mas.some(activa);

  return (
    <>
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id="mas-panel"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-50 rounded-t-lg p-3 shadow-[0_-12px_40px_-12px_rgb(10_13_22_/_0.3)] md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {mas.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    // Se cierra al pulsar, que es cuando hay que cerrarla. La
                    // primera versión reaccionaba al cambio de ruta con un
                    // `useEffect` que llamaba a `setState` —el patrón que avisa
                    // `react-hooks/set-state-in-effect`— y además dejaba la
                    // hoja un frame sobre la pantalla nueva.
                    onClick={() => setAbierto(false)}
                    aria-current={activa(item) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium transition-colors",
                      activa(item) ? "bg-brand-50 text-brand-800" : "text-ink-700 hover:bg-ink-50",
                    )}
                  >
                    <Glyph name={item.glyph} className="size-[19px]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Secciones del panel"
        /* Opaca, no translúcida.
           
           El área de cliente usa `glass` —72 % de blanco— y allí funciona
           porque su contenido es holgado. Aquí se leen referencias, fechas y
           nombres, y el texto de debajo se colaba entre los rótulos: en la
           primera captura «Sofia B.» se leía encima de «Panel». Una barra de
           navegación que compite con el contenido por los mismos píxeles no
           es elegante, es ilegible. */
        className="bg-surface border-ink-100 fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(10_13_22_/_0.25)] md:hidden"
      >
        <ul className="flex h-16 items-stretch">
          {barra.map((item) => {
            const act = activa(item);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={act ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 transition-colors",
                    act ? "text-brand-700" : "text-ink-400",
                  )}
                >
                  <Glyph name={item.glyph} className="size-[21px]" />
                  {/* El rótulo siempre, no solo en la activa: un icono sin
                      palabra obliga a adivinar, y «Avisos» y «Plazos» no se
                      distinguen por el dibujo. */}
                  <span className="text-[10.5px] leading-none font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {mas.length > 0 && (
            <li className="flex-1">
              <button
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-expanded={abierto}
                aria-controls="mas-panel"
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 transition-colors",
                  abierto || hayActivaEnMas ? "text-brand-700" : "text-ink-400",
                )}
              >
                <span className="relative flex size-[21px] items-center justify-center">
                  <TresPuntos />
                  {/* Si la pantalla en la que estás vive dentro de «Más», la
                      barra tiene que decirlo: si no, parece que no estás en
                      ninguna sección. */}
                  {hayActivaEnMas && !abierto && (
                    <span className="bg-brand-600 absolute -top-0.5 -right-0.5 size-1.5 rounded-full" />
                  )}
                </span>
                <span className="text-[10.5px] leading-none font-medium">Más</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

function TresPuntos() {
  return (
    <svg viewBox="0 0 20 20" width="21" height="21" fill="none" aria-hidden="true">
      <circle cx="4" cy="10" r="1.7" fill="currentColor" />
      <circle cx="10" cy="10" r="1.7" fill="currentColor" />
      <circle cx="16" cy="10" r="1.7" fill="currentColor" />
    </svg>
  );
}
