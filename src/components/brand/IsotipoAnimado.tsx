"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * EXTRANJERÍA SEGURA — «El Umbral» con volumen y luz.
 *
 * La geometría no cambia ni un punto respecto al isotipo plano. Una marca que
 * se dibuja distinta cuando se anima deja de ser una marca y pasa a ser dos.
 *
 * ─── LA REGLA QUE MANDA SOBRE TODO LO DEMÁS ─────────────────────────────
 *
 * El logotipo es reconocible en TODOS los fotogramas. No hay ni uno solo en el
 * que se esté formando, deformando o completando.
 *
 * Esto no es una preferencia estética. La primera versión de este componente
 * tallaba el camino con un `stroke-dashoffset`, que sobre el papel narra
 * perfectamente lo que hace el producto: el camino abriéndose paso y rompiendo
 * el arco. Al capturarlo fotograma a fotograma con `scripts/captura-logo.mjs`
 * se vio el problema: durante unos ciento sesenta milisegundos, el brazo corto
 * del check —trazo grueso, extremos redondeados, todavía sin el brazo largo—
 * formaba un bulto que se leía como un corazón dentro de una silueta. Ciento
 * sesenta milisegundos en los que la marca de una empresa de extranjería
 * parecía otra cosa. Y esos milisegundos son justo los del primer vistazo.
 *
 * Por eso la animación no toca la forma. Mueve la luz y el volumen alrededor
 * de una silueta que está entera desde el primer fotograma. Es también lo que
 * hacen las marcas que uno querría imitar aquí: ninguna se deforma al aparecer.
 *
 * ─── QUÉ SE MUEVE ───────────────────────────────────────────────────────
 *
 *  1. El objeto se asienta. Entra ligeramente girado en el eje Y y con menos
 *     escala, y aterriza. Con dos planos separados en Z, se lee como un sólido
 *     posándose, no como una imagen apareciendo.
 *  2. Un reflejo especular recorre la cara siguiendo la diagonal exacta del
 *     camino. La dirección no es decorativa: es la del gesto de la marca.
 *  3. Al llegar arriba a la derecha —el punto donde el camino rompe el arco—
 *     florece un destello. La luz sale por la brecha.
 *
 * Y termina. Eso es lo que separa una firma de motion de un banner parpadeando.
 *
 * ─── LA PROFUNDIDAD ─────────────────────────────────────────────────────
 *
 * Dos planos en una escena 3D real, separados en el eje Z, no un degradado que
 * finge volumen. Con `perspective` en el contenedor, el navegador calcula el
 * paralaje solo: al mover el puntero, la cara frontal y la trasera se desplazan
 * a ritmos distintos y el canal tallado deja ver el grosor por dentro.
 *
 * Sin WebGL, sin three.js, sin una imagen: dos SVG y una transformación.
 *
 * ─── LOS LÍMITES ────────────────────────────────────────────────────────
 *
 * · `prefers-reduced-motion` deja el estado final. No es una versión
 *   degradada: es exactamente la misma marca, quieta.
 * · El paralaje solo con puntero de ratón. En táctil no hay hover, y un efecto
 *   que dependa de él es código muerto que además estorba.
 * · Por debajo de 40 px la profundidad se desactiva sola. Un objeto extruido a
 *   16 px es una mancha; ahí manda la silueta, que es para lo que se diseñó la
 *   geometría original.
 */

const ARCH =
  "M8 32.5 V20 A12 12 0 0 1 32 20 V32.5 A3.5 3.5 0 0 1 28.5 36 H11.5 A3.5 3.5 0 0 1 8 32.5 Z";

const PATH_CUT = "M13.6 22.4 L18.4 27.2 L34.5 11.1";

/** Punto exacto por el que el camino rompe el arco. La luz sale por aquí. */
const BRECHA = { x: 34.5, y: 11.1 };

/** Ángulo del brazo largo del camino: 45° hacia arriba y a la derecha. */
const ANGULO_CAMINO = -45;

type Variante = "gradient" | "inverse" | "mono";

export function IsotipoAnimado({
  size = 96,
  variante = "gradient",
  className,
  title,
  id,
  /** Repite el reflejo al pasar el puntero. Útil en el encabezado. */
  repetirEnHover = false,
}: {
  size?: number;
  variante?: Variante;
  className?: string;
  title?: string;
  id?: string;
  repetirEnHover?: boolean;
}) {
  const reduce = useReducedMotion();
  const autoId = React.useId().replace(/:/g, "");
  const uid = id ?? autoId;

  const profundidad = size >= 40;
  const [ciclo, setCiclo] = React.useState(0);

  // El paralaje vive fuera del estado de React: mover el puntero no debe
  // provocar un renderizado por fotograma.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 170, damping: 17 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-13, 13]), { stiffness: 170, damping: 17 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !profundidad || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const gradId = `${uid}-g`;
  const deepId = `${uid}-d`;
  const shineId = `${uid}-s`;
  const sweepId = `${uid}-w`;
  const beamId = `${uid}-b`;
  const maskFront = `${uid}-mf`;
  const maskBack = `${uid}-mb`;

  const relleno =
    variante === "inverse" ? "#FFFFFF" : variante === "mono" ? "currentColor" : `url(#${gradId})`;

  /** El reflejo es blanco sobre azul e ink sobre blanco: en la variante
   *  inversa un brillo blanco sobre blanco no se vería. */
  const colorReflejo = variante === "inverse" ? "#2438E8" : "#FFFFFF";

  const desplazamientoZ = Math.round(size * 0.075);

  return (
    <div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: size, height: size, perspective: profundidad ? size * 4.5 : undefined }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={repetirEnHover && !reduce ? () => setCiclo((c) => c + 1) : undefined}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <motion.div
        className="relative size-full"
        style={{
          transformStyle: profundidad ? "preserve-3d" : undefined,
          rotateX: profundidad ? rx : undefined,
          rotateY: profundidad ? ry : undefined,
        }}
        // El objeto se posa: entra girado y con menos escala, y aterriza.
        initial={reduce ? false : { opacity: 0, scale: 0.94, rotateY: -14 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Cara trasera: el grosor del umbral ──────────────────────
            Va detrás en Z, no desplazada en el plano. Por eso al girar se ve
            el canto por dentro del canal tallado. */}
        {profundidad && variante !== "mono" && (
          <svg
            viewBox="0 0 40 40"
            className="absolute inset-0 size-full"
            style={{ transform: `translateZ(-${desplazamientoZ}px)` }}
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient
                id={deepId}
                x1="8"
                y1="4"
                x2="34"
                y2="38"
                gradientUnits="userSpaceOnUse"
              >
                {variante === "inverse" ? (
                  <>
                    <stop stopColor="#B9C2D6" />
                    <stop offset="1" stopColor="#77839B" />
                  </>
                ) : (
                  <>
                    <stop stopColor="#1B2470" />
                    <stop offset="1" stopColor="#0A1040" />
                  </>
                )}
              </linearGradient>
              <mask id={maskBack} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" fill="#000" />
                <path d={ARCH} fill="#fff" />
                <path
                  d={PATH_CUT}
                  stroke="#000"
                  strokeWidth="5.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </mask>
            </defs>
            <g mask={`url(#${maskBack})`}>
              <rect width="40" height="40" fill={`url(#${deepId})`} />
            </g>
          </svg>
        )}

        {/* ── Cara frontal ─────────────────────────────────────────── */}
        <svg viewBox="0 0 40 40" className="relative size-full" fill="none" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="8" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4159FA" />
              <stop offset="0.55" stopColor="#2438E8" />
              <stop offset="1" stopColor="#18259B" />
            </linearGradient>

            <linearGradient id={shineId} x1="10" y1="4" x2="24" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.34" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Banda del reflejo. En unidades del propio objeto para que el
                degradado viaje con la banda en lugar de quedarse fijo. */}
            <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
              <stop stopColor={colorReflejo} stopOpacity="0" />
              <stop offset="0.5" stopColor={colorReflejo} stopOpacity="0.55" />
              <stop offset="1" stopColor={colorReflejo} stopOpacity="0" />
            </linearGradient>

            <radialGradient
              id={beamId}
              cx={BRECHA.x}
              cy={BRECHA.y}
              r="13"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="0.45" stopColor="#AFC0FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* El canal sustractivo: blanco conserva, negro quita. Estático:
                la silueta está completa desde el primer fotograma. */}
            <mask id={maskFront} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
              <rect width="40" height="40" fill="#000" />
              <path d={ARCH} fill="#fff" />
              <path
                d={PATH_CUT}
                stroke="#000"
                strokeWidth="5.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>

          <g mask={`url(#${maskFront})`}>
            <rect width="40" height="40" fill={relleno} />
            {variante === "gradient" && <rect width="40" height="40" fill={`url(#${shineId})`} />}

            {/* Reflejo especular. Va dentro de la máscara, así que recorre
                solo la cara del objeto y respeta el canal tallado. El grupo
                está girado 45°, de modo que mover la banda en su eje x la
                desplaza en perpendicular al camino. */}
            {!reduce && (
              <g transform={`rotate(${ANGULO_CAMINO} 20 20)`}>
                <motion.rect
                  key={`sweep-${ciclo}`}
                  y="-24"
                  width="11"
                  height="88"
                  fill={`url(#${sweepId})`}
                  initial={{ x: -34, opacity: 0 }}
                  animate={{ x: [-34, 46], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 0.95,
                    delay: 0.28,
                    ease: [0.4, 0, 0.2, 1],
                    times: [0, 0.15, 0.8, 1],
                  }}
                />
              </g>
            )}
          </g>

          {/* El destello de la brecha, cuando el reflejo llega al punto por el
              que el camino sale del arco. Fuera de la máscara: la luz escapa
              del sólido, no se queda dentro. */}
          {!reduce && variante === "gradient" && (
            <motion.circle
              key={`beam-${ciclo}`}
              cx={BRECHA.x}
              cy={BRECHA.y}
              r="13"
              fill={`url(#${beamId})`}
              initial={{ opacity: 0, scale: 0.45 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.45, 1, 1.3] }}
              transition={{ duration: 0.7, delay: 0.82, ease: "easeOut", times: [0, 0.35, 1] }}
              style={{ transformOrigin: `${BRECHA.x}px ${BRECHA.y}px` }}
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Bloque de marca completo: isotipo animado y logotipo.
 *
 * El texto entra después de que el objeto se haya posado, no a la vez. Si
 * entran juntos compiten y no se lee ninguno de los dos; escalonados, la
 * mirada va al gesto y aterriza en el nombre.
 */
export function LogoAnimado({
  size = 64,
  className,
  tono = "ink",
}: {
  size?: number;
  className?: string;
  tono?: "ink" | "inverse";
}) {
  const reduce = useReducedMotion();
  const inverso = tono === "inverse";

  return (
    <div className={cn("inline-flex items-center gap-3.5", className)}>
      <IsotipoAnimado
        size={size}
        variante={inverso ? "inverse" : "gradient"}
        title="Extranjería Segura"
      />
      <motion.span
        className={cn(
          "font-display leading-none tracking-[-0.035em] whitespace-nowrap",
          inverso ? "text-white" : "text-ink-900",
        )}
        style={{ fontSize: size * 0.44 }}
        initial={reduce ? false : { opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-extrabold">Extranjería</span>
        <span className={cn("font-medium", inverso ? "text-white/70" : "text-ink-500")}>
          {" "}
          Segura
        </span>
      </motion.span>
    </div>
  );
}
