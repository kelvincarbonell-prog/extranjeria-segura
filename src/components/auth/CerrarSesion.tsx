import { Glyph } from "@/components/brand/Glyph";
import { accionSalir } from "@/lib/acciones-sesion";
import { cn } from "@/lib/utils";

/**
 * CERRAR SESIÓN.
 *
 * Un `<form>` con acción de servidor y no un enlace, porque cerrar sesión
 * cambia estado: borra dos cookies. Un `<a href="/salir">` lo dispararía
 * cualquier precarga del navegador o del propio Next, y la gente se
 * encontraría deslogueada por pasar el ratón por encima.
 *
 * ─── LO QUE ESTABA MAL ──────────────────────────────────────────────────
 *
 * En el área de cliente el control vivía solo en la barra lateral, que se
 * oculta por debajo de `lg`. Medido: en un teléfono de 360 px el botón
 * existía en el DOM y no era visible, así que **un cliente no podía cerrar
 * sesión desde el móvil** —que es desde donde entra la mayoría—. En
 * escritorio medía 16×16, por debajo del mínimo de 24×24 de WCAG 2.5.8.
 *
 * Aquí hay una sola forma de salir, con dos presentaciones, y las dos
 * cumplen el tamaño mínimo.
 */
export function CerrarSesion({
  variante = "boton",
  className,
}: {
  /** `icono` para una barra apretada; `boton` para una página de cuenta. */
  variante?: "icono" | "boton";
  className?: string;
}) {
  if (variante === "icono") {
    return (
      <form action={accionSalir} className={className}>
        <button
          type="submit"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="text-ink-400 hover:text-ink-900 hover:bg-ink-50 flex size-9 items-center justify-center rounded-[10px] transition-colors"
        >
          <IconoSalida />
        </button>
      </form>
    );
  }

  return (
    <form action={accionSalir} className={className}>
      <button
        type="submit"
        className={cn(
          "text-ink-700 hover:text-ink-950 hover:bg-ink-50 flex w-full items-center gap-2.5 rounded-sm px-4 py-3 text-[14px] font-semibold transition-colors",
          "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.1)]",
        )}
      >
        <IconoSalida />
        Cerrar sesión
      </button>
    </form>
  );
}

function IconoSalida() {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
      <path
        d="M12.5 6.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h6a1.5 1.5 0 0 0 1.5-1.5v-1.5M8 10h8.5m0 0-2.5-2.5M16.5 10 14 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * La misma acción, pero diciendo que no hay sesión que cerrar.
 *
 * Quien abre /admin escribiendo la URL no ha entrado con ninguna cuenta.
 * Enseñarle «Cerrar sesión» le haría creer que la hay.
 */
export function SinSesion({ className }: { className?: string }) {
  return (
    <p className={cn("text-ink-400 flex items-center gap-2 text-[12.5px]", className)}>
      <Glyph name="alert" className="size-3.5 shrink-0" />
      No has entrado con ninguna cuenta: estás viendo la demostración abierta.
    </p>
  );
}
