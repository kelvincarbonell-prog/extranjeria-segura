"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Glyph } from "@/components/brand/Glyph";
import { cn } from "@/lib/utils";

/**
 * BUSCADOR DEL PANEL (⌘K).
 *
 * Con veinte expedientes, encontrar uno cuesta: abrir la lista, mirar, buscar
 * con el navegador, pulsar. Con doscientos, cuesta bastante más que el trabajo
 * que se venía a hacer. Esto lo reduce a escribir tres letras del apellido.
 *
 * Busca a la vez expedientes y pantallas del panel, porque quien escribe
 * «plaz» quiere ir a Plazos y quien escribe «Wei» quiere a Wei L., y obligar
 * a elegir antes de escribir es pedirle al usuario que resuelva un problema
 * de implementación.
 *
 * ─── LO QUE LO HACE UTILIZABLE Y NO SOLO BONITO ─────────────────────────
 *
 *  · Se abre con ⌘K o Ctrl+K, y también con un botón visible: un atajo que
 *    solo conocen los que ya lo conocen no es una función, es un secreto.
 *  · Flechas para moverse, Enter para entrar, Esc para salir. Sin ratón.
 *  · El foco vuelve a donde estaba al cerrar. Un diálogo que suelta el foco
 *    al `<body>` deja a quien navega con teclado empezando por el principio
 *    de la página.
 *  · `role="dialog"` con `aria-modal` y una lista con `aria-activedescendant`,
 *    que es como un lector de pantalla anuncia la opción resaltada sin que el
 *    foco salga del campo de texto.
 *
 * Los resultados se calculan en el cliente sobre una lista que ya viene
 * filtrada por rol desde el servidor: el buscador no puede encontrar lo que
 * la sesión no puede ver.
 */

export interface Resultado {
  id: string;
  titulo: string;
  detalle: string;
  href: string;
  glifo: string;
  grupo: "Expedientes" | "Pantallas";
}

export function Buscador({ resultados }: { resultados: Resultado[] }) {
  const [abierto, setAbierto] = React.useState(false);
  const [consulta, setConsulta] = React.useState("");
  const [indice, setIndice] = React.useState(0);
  const router = useRouter();
  const reduce = useReducedMotion();
  const campoRef = React.useRef<HTMLInputElement>(null);
  const antesRef = React.useRef<HTMLElement | null>(null);

  const filtrados = React.useMemo(() => {
    const q = normalizar(consulta);
    if (!q) return resultados.slice(0, 8);
    return resultados
      .map((r) => ({ r, p: puntuar(r, q) }))
      .filter((x) => x.p > 0)
      .sort((a, b) => b.p - a.p)
      .slice(0, 8)
      .map((x) => x.r);
  }, [consulta, resultados]);

  /**
   * El índice resaltado se recorta al leerlo, no al cambiar la consulta.
   *
   * Hacía falta recortarlo: si quedaban dos resultados y estabas en el
   * quinto, Enter navegaba a `undefined`. La primera versión lo corregía con
   * un `useEffect` que llamaba a `setIndice`, que es el patrón que avisa
   * `react-hooks/set-state-in-effect`: un render de más y un parpadeo del
   * resaltado. Derivarlo no tiene ninguna de las dos cosas.
   */
  const activo = Math.min(indice, Math.max(0, filtrados.length - 1));

  const abrir = React.useCallback(() => {
    antesRef.current = document.activeElement as HTMLElement;
    setConsulta("");
    setIndice(0);
    setAbierto(true);
  }, []);

  const cerrar = React.useCallback(() => {
    setAbierto(false);
    // Devolver el foco a quien lo tenía. Sin esto, quien navega con teclado
    // vuelve al principio del documento cada vez que cierra el buscador.
    antesRef.current?.focus?.();
  }, []);

  React.useEffect(() => {
    const atajo = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (abierto) cerrar();
        else abrir();
      }
      if (e.key === "Escape" && abierto) cerrar();
    };
    window.addEventListener("keydown", atajo);
    return () => window.removeEventListener("keydown", atajo);
  }, [abierto, abrir, cerrar]);

  React.useEffect(() => {
    if (abierto) campoRef.current?.focus();
  }, [abierto]);

  const ir = (r?: Resultado) => {
    if (!r) return;
    cerrar();
    router.push(r.href);
  };

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndice((activo + 1) % Math.max(1, filtrados.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndice((activo - 1 + filtrados.length) % Math.max(1, filtrados.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      ir(filtrados[activo]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label="Buscar expedientes y pantallas"
        className="text-ink-400 hover:text-ink-700 hover:bg-ink-50 flex h-9 items-center gap-2 rounded-[10px] px-2.5 transition-colors"
      >
        <Lupa />
        <span className="hidden text-[13px] lg:inline">Buscar</span>
        {/* El atajo, escrito. Un atajo que no se anuncia no lo usa nadie. */}
        <kbd className="bg-ink-50 text-ink-400 ring-ink-900/[.06] hidden rounded px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset lg:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 p-4 pt-[12vh] backdrop-blur-[2px]"
            onClick={(e) => e.target === e.currentTarget && cerrar()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Buscar en el panel"
              initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface w-full max-w-xl overflow-hidden rounded-lg shadow-[0_24px_60px_-12px_rgb(10_13_22_/_0.35)]"
            >
              <div className="border-ink-100 flex items-center gap-3 border-b px-4">
                <span className="text-ink-300 shrink-0">
                  <Lupa />
                </span>
                <input
                  ref={campoRef}
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  onKeyDown={teclas}
                  placeholder="Cliente, referencia, trámite o pantalla…"
                  aria-label="Buscar"
                  aria-controls="resultados-buscador"
                  aria-activedescendant={filtrados[activo] ? `r-${filtrados[activo].id}` : undefined}
                  className="text-ink-900 placeholder:text-ink-400 h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                />
                <kbd className="bg-ink-50 text-ink-400 shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-semibold">
                  Esc
                </kbd>
              </div>

              <ul id="resultados-buscador" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                {filtrados.map((r, i) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      id={`r-${r.id}`}
                      role="option"
                      aria-selected={i === activo}
                      onMouseEnter={() => setIndice(i)}
                      onClick={() => ir(r)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                        i === activo ? "bg-brand-50" : "hover:bg-canvas-deep",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-[10px]",
                          i === activo ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-500",
                        )}
                      >
                        <Glyph name={r.glifo} className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-ink-900 block truncate text-[14px] font-medium">
                          {r.titulo}
                        </span>
                        <span className="text-ink-400 block truncate text-[12.5px]">
                          {r.detalle}
                        </span>
                      </span>
                      <span className="text-ink-300 shrink-0 text-[11px] font-semibold tracking-[0.08em] uppercase">
                        {r.grupo}
                      </span>
                    </button>
                  </li>
                ))}

                {filtrados.length === 0 && (
                  <li className="text-ink-500 px-3 py-8 text-center text-[13.5px]">
                    Nada coincide con «{consulta}».
                    <span className="text-ink-400 mt-1 block text-[12.5px]">
                      El buscador solo alcanza lo que tu rol puede ver.
                    </span>
                  </li>
                )}
              </ul>

              <div className="border-ink-100 text-ink-400 flex items-center gap-4 border-t px-4 py-2.5 text-[11.5px]">
                <span>
                  <Tecla>↑</Tecla> <Tecla>↓</Tecla> moverse
                </span>
                <span>
                  <Tecla>↵</Tecla> abrir
                </span>
                <span>
                  <Tecla>esc</Tecla> cerrar
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-ink-50 text-ink-500 rounded px-1 py-0.5 text-[10.5px] font-semibold">
      {children}
    </kbd>
  );
}

function Lupa() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m13.6 13.6 3.4 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Sin tildes y en minúsculas.
 *
 * «Nadia» y «Nadía», «Nómada» y «nomada» tienen que encontrarse. Quien busca
 * a un cliente en un panel no va a escribir la tilde, y el trámite que busca
 * se llama «Nómada digital».
 */
function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/**
 * Puntúa una coincidencia.
 *
 * Empezar por lo buscado vale más que contenerlo: quien escribe «na» espera
 * «Nadia H.» antes que «Renovación». Y el título pesa más que el detalle,
 * porque es lo que la persona tenía en la cabeza.
 */
function puntuar(r: Resultado, q: string): number {
  const titulo = normalizar(r.titulo);
  const detalle = normalizar(r.detalle);

  if (titulo.startsWith(q)) return 100;
  if (titulo.includes(q)) return 60;
  if (detalle.startsWith(q)) return 40;
  if (detalle.includes(q)) return 20;

  // Coincidencia por palabras sueltas: «wei renov» encuentra a Wei L. con su
  // renovación, aunque ninguna cadena contenga las dos juntas.
  const palabras = q.split(/\s+/).filter(Boolean);
  if (palabras.length > 1 && palabras.every((p) => `${titulo} ${detalle}`.includes(p))) return 30;

  return 0;
}
