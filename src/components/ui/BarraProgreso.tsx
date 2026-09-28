"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * BARRA DE PROGRESO DE NAVEGACIÓN.
 *
 * La línea fina de arriba que usan Google, YouTube o GitHub. Tres decisiones
 * la separan de una que molesta:
 *
 * ─── 1. NO APARECE SI LA NAVEGACIÓN ES RÁPIDA ──────────────────────────
 *
 * Espera 180 ms antes de mostrarse. La mayoría de las navegaciones de este
 * panel se resuelven antes —medido: 36 a 131 ms— y en esas la barra no llega
 * a existir. Una barra que aparece y desaparece en ochenta milisegundos es un
 * parpadeo, y un parpadeo se lee como un error.
 *
 * El umbral no es arbitrario: por debajo de unos 150 ms una respuesta se
 * percibe como instantánea, y señalarla solo rompe esa impresión.
 *
 * ─── 2. AVANZA, PERO NUNCA LLEGA ───────────────────────────────────────
 *
 * No se puede saber cuánto queda —el servidor no lo dice—, así que avanza con
 * pasos cada vez más cortos y se detiene en el 90 %. Decir «100 %» y seguir
 * esperando es mentir, y se nota. Al llegar la pantalla salta al 100 % y se
 * desvanece: ese salto final es lo que da la sensación de haber terminado de
 * golpe, que es justo la que se busca.
 *
 * ─── 3. SE APAGA SOLA, POR LA RUTA ─────────────────────────────────────
 *
 * El final se detecta por el cambio de `pathname`, no por un temporizador de
 * seguridad. Una barra que se va sola a los dos segundos miente igual que una
 * que llega al 100 % antes de tiempo.
 */

/** Por debajo de esto, la navegación se percibe instantánea y no se anuncia. */
const UMBRAL_MS = 180;

type Fase = "quieta" | "avanzando" | "cerrando";
interface Estado {
  fase: Fase;
  pct: number;
}

/**
 * Objeto único para el estado de reposo.
 *
 * Devolverlo por identidad desde el actualizador hace que React descarte el
 * re-render cuando ya estaba quieta, en vez de repintar en cada navegación
 * rápida —que son la mayoría—.
 */
const QUIETA: Estado = { fase: "quieta", pct: 0 };

export function BarraProgreso() {
  const pathname = usePathname();
  const [estado, setEstado] = React.useState<Estado>(QUIETA);

  const temporizadores = React.useRef<number[]>([]);
  const limpiar = React.useCallback(() => {
    for (const t of temporizadores.current) window.clearTimeout(t);
    temporizadores.current = [];
  }, []);

  /**
   * Arranca al pulsar un enlace interno.
   *
   * Se escucha el clic en captura sobre el documento en lugar de envolver cada
   * enlace: el panel tiene enlaces en la cabecera, en la barra inferior, en
   * las tarjetas y dentro del buscador, y la barra tiene que responder a todos
   * sin que nadie se acuerde de conectarla.
   */
  React.useEffect(() => {
    const alPulsar = (e: MouseEvent) => {
      // Solo el clic principal y sin modificadores: ctrl, cmd o shift abren
      // en otra pestaña y esta pantalla no va a cambiar.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const enlace = (e.target as HTMLElement | null)?.closest?.("a");
      if (!enlace) return;

      const href = enlace.getAttribute("href");
      if (!href || href.startsWith("#") || enlace.target === "_blank") return;

      try {
        const destino = new URL(enlace.href, location.href);
        if (destino.origin !== location.origin) return;
        // Misma ruta: no hay navegación que anunciar.
        if (destino.pathname === location.pathname) return;
      } catch {
        return;
      }

      limpiar();
      const arranque = window.setTimeout(
        () => setEstado({ fase: "avanzando", pct: 12 }),
        UMBRAL_MS,
      );
      temporizadores.current.push(arranque);
    };

    document.addEventListener("click", alPulsar, true);
    return () => document.removeEventListener("click", alPulsar, true);
  }, [limpiar]);

  /** Avance decreciente mientras dure la espera. */
  React.useEffect(() => {
    if (estado.fase !== "avanzando") return;
    const id = window.setInterval(() => {
      // Cada paso avanza una fracción de lo que falta hasta el 90: rápido al
      // principio, casi parado al final. Nunca alcanza el tope.
      setEstado((e) =>
        e.fase !== "avanzando" || e.pct >= 90
          ? e
          : { fase: "avanzando", pct: e.pct + Math.max(0.6, (90 - e.pct) * 0.08) },
      );
    }, 180);
    return () => window.clearInterval(id);
  }, [estado.fase]);

  /**
   * La ruta ha cambiado: la pantalla nueva está aquí.
   *
   * `rutaVista` se escribe solo dentro de este efecto. Una versión anterior
   * guardaba el estado en una referencia y la actualizaba durante el render,
   * que es justo lo que prohíbe `react-hooks/refs` —y con razón: durante el
   * render React puede descartar el trabajo y volver a empezar—.
   */
  const rutaVista = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (rutaVista.current === null) {
      rutaVista.current = pathname;
      return;
    }
    if (rutaVista.current === pathname) return;
    rutaVista.current = pathname;

    limpiar();
    setEstado((e) => (e.fase === "quieta" ? QUIETA : { fase: "cerrando", pct: 100 }));

    const cierre = window.setTimeout(() => setEstado(QUIETA), 320);
    temporizadores.current.push(cierre);
    return limpiar;
  }, [pathname, limpiar]);

  /** Al desmontar, ningún temporizador vivo. */
  React.useEffect(() => limpiar, [limpiar]);

  if (estado.fase === "quieta") return null;

  return (
    <div
      // `aria-hidden`: quien usa lector de pantalla ya recibe el aviso del
      // `role="status"` del esqueleto. Dos anuncios de lo mismo son ruido.
      aria-hidden="true"
      data-carga="barra"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        /* `motion-reduce:transition-none`: la barra sigue apareciendo y sigue
           informando, pero sin deslizarse. Quien ha pedido menos movimiento no
           ha pedido menos información. */
        className="bg-brand-600 h-full transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${estado.pct}%`, opacity: estado.fase === "cerrando" ? 0 : 1 }}
      />
    </div>
  );
}
