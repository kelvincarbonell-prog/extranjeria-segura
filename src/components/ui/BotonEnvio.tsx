"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * BOTÓN DE ENVÍO CON ESTADO DE ESPERA.
 *
 * `useFormStatus` lee el estado del `<form>` que tiene encima sin que el
 * formulario tenga que ser un componente de cliente. Eso importa aquí: los
 * formularios de acción de servidor —cerrar sesión, sobre todo— se renderizan
 * en el servidor, y convertirlos enteros en cliente para poder enseñar un
 * girador sería pagar JavaScript por un detalle de presentación.
 *
 * ─── POR QUÉ ESTE BOTÓN EXISTE ──────────────────────────────────────────
 *
 * «Cerrar sesión» era un `<button type="submit">` pelado. Al pulsarlo no
 * pasaba nada visible hasta que el servidor borraba las cookies y redirigía.
 * En una red lenta eso es medio segundo de pantalla idéntica, y lo que hace
 * cualquiera con una pantalla idéntica es volver a pulsar.
 *
 * Volver a pulsar «Cerrar sesión» no rompe nada —es idempotente—, pero la
 * duda sí: en el botón que cierra la sesión sobre un expediente de extranjería
 * hace falta saber que se ha enterado. Por eso el botón se desactiva, se
 * anuncia con `aria-busy` y el icono cede el sitio al girador.
 *
 * Aquí sí hay girador y no esqueleto, y la diferencia no es un capricho: un
 * esqueleto sustituye contenido que va a llegar; esto es un control que ya
 * está en pantalla y solo tiene que decir «te he oído». Son dos preguntas
 * distintas y se responden distinto.
 */
export function BotonEnvio({
  children,
  icono,
  className,
  etiqueta,
  titulo,
}: {
  children?: React.ReactNode;
  /** Se muestra en reposo y lo sustituye el girador mientras se envía. */
  icono?: React.ReactNode;
  className?: string;
  /** `aria-label` cuando el botón es solo un icono. */
  etiqueta?: string;
  titulo?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      aria-label={etiqueta}
      title={titulo}
      className={cn("transition-colors disabled:cursor-wait", className)}
    >
      {pending ? <Girador /> : icono}
      {children}
    </button>
  );
}

/**
 * El girador ocupa exactamente lo mismo que el icono al que sustituye
 * —17×17—, para que el botón no cambie de tamaño al pulsarlo. Un control que
 * se encoge bajo el dedo parece un fallo.
 */
function Girador() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="17"
      height="17"
      fill="none"
      aria-hidden="true"
      className="shrink-0 motion-safe:animate-spin"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="2" opacity="0.22" />
      <path
        d="M17.5 10a7.5 7.5 0 0 0-7.5-7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
