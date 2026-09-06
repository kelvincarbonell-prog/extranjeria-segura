"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Answers } from "@/content/check-questions";
import { enlaceReanudacion } from "@/lib/check-resume";
import { registrar } from "@/lib/embudo";

/**
 * PUNTO DE GUARDADO DEL DIAGNÓSTICO (A9).
 *
 * Aparece en la tercera pregunta, no en la quinta. El abandono en
 * cuestionarios de ocho pasos se concentra entre la tercera y la quinta: el
 * punto de guardado va **antes** de la caída, no después, porque después ya no
 * queda nadie a quien ofrecérselo.
 *
 * No pide correo. El enlace lleva las respuestas en el fragmento de la URL,
 * que no se envía en la petición HTTP: no llega a nuestro servidor ni queda en
 * ningún registro. Es la única forma de ofrecer «guarda tu progreso» sin
 * romper la promesa de que las respuestas no salen del navegador —y esas
 * respuestas incluyen situación administrativa y antecedentes penales—.
 *
 * Es discreto a propósito. Un modal a mitad de cuestionario interrumpe a quien
 * iba a terminar, que es la mayoría, para rescatar a quien iba a irse.
 */
export function GuardarProgreso({ answers }: { answers: Answers }) {
  const [estado, setEstado] = React.useState<"reposo" | "copiado" | "fallo">("reposo");

  const copiar = async () => {
    const url = enlaceReanudacion(answers, window.location.origin);
    try {
      await navigator.clipboard.writeText(url);
      registrar("check:guardado");
      setEstado("copiado");
      window.setTimeout(() => setEstado("reposo"), 2600);
    } catch {
      // Sin permiso de portapapeles —o en un contexto no seguro— se deja la
      // URL en la barra de direcciones: el usuario puede guardarla en
      // marcadores, que es lo mismo que queríamos conseguir.
      window.location.hash = enlaceReanudacion(answers, "").split("#")[1] ?? "";
      setEstado("fallo");
      window.setTimeout(() => setEstado("reposo"), 5000);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={copiar}
        className="text-ink-400 hover:text-ink-700 tap inline-flex items-center gap-1.5 text-[13px] transition-colors"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
          <path
            d="M6.5 9.5a2.5 2.5 0 0 0 3.6.1l2-2a2.55 2.55 0 0 0-3.6-3.6l-.5.5M9.5 6.5a2.5 2.5 0 0 0-3.6-.1l-2 2a2.55 2.55 0 0 0 3.6 3.6l.5-.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Guardar mi progreso y seguir después
      </button>

      <AnimatePresence mode="wait">
        {estado === "copiado" && (
          <motion.p
            key="copiado"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="text-signal-ok text-center text-[12.5px]"
          >
            Enlace copiado. Ábrelo cuando quieras y seguirás donde lo dejaste.
            <span className="text-ink-400 mt-0.5 block">
              Tus respuestas viajan dentro del enlace, no en nuestros servidores.
            </span>
          </motion.p>
        )}
        {estado === "fallo" && (
          <motion.p
            key="fallo"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="text-ink-500 max-w-xs text-center text-[12.5px]"
          >
            No hemos podido copiarlo solos. La dirección de arriba ya lleva tu progreso: guárdala en
            marcadores.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
