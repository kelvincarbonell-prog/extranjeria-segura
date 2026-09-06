"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ÍNDICE LATERAL CON SECCIÓN ACTIVA (A18).
 *
 * En un documento de dos mil palabras, el abandono no se produce al principio
 * —quien llega ya quería leer— sino a mitad, cuando se pierde la noción de
 * cuánto queda. Un índice fijo que marca dónde estás convierte «esto no se
 * acaba nunca» en «voy por la tercera de seis».
 *
 * La sección activa se detecta con `IntersectionObserver` y no escuchando el
 * scroll: el observador solo despierta cuando una sección cruza el umbral, en
 * lugar de ejecutar código en cada fotograma de cada scroll de la página. En
 * un móvil de gama media —el dispositivo de este público— esa diferencia se
 * nota en el INP.
 *
 * El margen superior del observador descuenta la altura del encabezado fijo.
 * Sin eso, una sección se marca activa cuando su título todavía está tapado
 * por el encabezado, y el índice va siempre un paso por delante de lo que la
 * persona está leyendo.
 *
 * En móvil el índice no se pinta: no hay espacio lateral, y una versión
 * plegable en la parte superior compite con el bloque «Lo esencial», que hace
 * mejor ese trabajo. Ahí la orientación la da la barra de progreso de lectura.
 */

export interface Seccion {
  id: string;
  etiqueta: string;
}

export function IndiceLateral({
  secciones,
  titulo = "En esta página",
  className,
}: {
  secciones: Seccion[];
  titulo?: string;
  className?: string;
}) {
  const [activa, setActiva] = React.useState<string | null>(secciones[0]?.id ?? null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const nodos = secciones
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodos.length === 0) return;

    // Se guarda qué secciones están visibles y se elige la primera en orden
    // de documento. Sin esto, al desplazarse hacia arriba se marca activa la
    // última que entró en pantalla, que es la de abajo.
    const visibles = new Set<string>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.add(e.target.id);
          else visibles.delete(e.target.id);
        }
        const primera = secciones.find((s) => visibles.has(s.id));
        if (primera) setActiva(primera.id);
      },
      {
        // El encabezado fijo mide unos 96 px; el margen inferior deja activa
        // la sección mientras ocupa la mitad superior de la ventana.
        rootMargin: "-96px 0px -55% 0px",
        threshold: 0,
      },
    );

    nodos.forEach((n) => observador.observe(n));
    return () => observador.disconnect();
  }, [secciones]);

  return (
    <nav aria-label={titulo} className={className}>
      <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
        {titulo}
      </p>
      <ul className="border-ink-900/[.07] space-y-0.5 border-s ps-0">
        {secciones.map((s) => {
          const esActiva = s.id === activa;
          return (
            <li key={s.id} className="relative">
              {/* El indicador se desplaza entre elementos con `layoutId` en
                  lugar de aparecer y desaparecer: el movimiento es lo que
                  comunica «te has movido», no el cambio de color. */}
              {esActiva && !reduce && (
                <motion.span
                  layoutId="indice-activo"
                  className="bg-brand-600 absolute inset-y-0 -start-px w-[2px]"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {esActiva && reduce && (
                <span className="bg-brand-600 absolute inset-y-0 -start-px w-[2px]" />
              )}
              <a
                href={`#${s.id}`}
                aria-current={esActiva ? "location" : undefined}
                className={cn(
                  "tap block py-1.5 ps-3.5 text-[13.5px] leading-snug transition-colors",
                  esActiva ? "text-ink-900 font-medium" : "text-ink-500 hover:text-ink-800",
                )}
              >
                {s.etiqueta}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Barra de progreso de lectura.
 *
 * En móvil es la única señal de «cuánto queda», así que ahí es donde importa.
 * Se calcula con `scrollY` sobre la altura del documento, leído dentro de un
 * `requestAnimationFrame` para no forzar un reflujo por evento de scroll.
 */
export function ProgresoLectura({ className }: { className?: string }) {
  const [progreso, setProgreso] = React.useState(0);

  React.useEffect(() => {
    let pendiente = false;

    const medir = () => {
      pendiente = false;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(alto <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / alto)));
    };

    const onScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn("bg-ink-900/[.07] pointer-events-none h-[2px] w-full lg:hidden", className)}
      // No es un `progressbar` para lectores de pantalla: no informa de nada
      // que no sepa ya quien navega por encabezados, y anunciar un porcentaje
      // cambiante en cada scroll sería ruido constante.
      aria-hidden
    >
      <div
        className="bg-brand-600 h-full origin-left"
        style={{ transform: `scaleX(${progreso})` }}
      />
    </div>
  );
}
