"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Avatar } from "@/components/ui/primitives";
import { ROLES, puede, type Permiso, type Role } from "@/content/roles";
import { USUARIOS_DEMO, ROL_DEMO_INICIAL, COOKIE_ROL } from "@/content/demo-sesion";
import { accionSalir } from "@/lib/acciones-sesion";
import { cn } from "@/lib/utils";

/**
 * Cada entrada declara qué permiso hace falta para verla. `null` = todos los
 * roles del panel. Antes la lista era fija y un comercial veía «Expedientes»
 * y «Equipo» igual que la dirección.
 */
const NAV: { href: string; label: string; glyph: string; exact?: boolean; permiso: Permiso | null }[] =
  [
    { href: "/admin", label: "Panel", glyph: "door", exact: true, permiso: null },
    { href: "/admin/plazos", label: "Plazos", glyph: "clock", permiso: "documentos" },
    { href: "/admin/recordatorios", label: "Avisos", glyph: "help", permiso: "documentos" },
    { href: "/admin/pipeline", label: "Pipeline", glyph: "path", permiso: null },
    { href: "/admin/expedientes", label: "Expedientes", glyph: "doc", permiso: "documentos" },
    { href: "/admin/contenido", label: "Verificación", glyph: "stamp", permiso: "verificacion" },
    { href: "/admin/equipo", label: "Equipo", glyph: "family", permiso: "equipo" },
  ];

export function navPermitida(role: Role) {
  return NAV.filter((i) => i.permiso === null || puede(role, i.permiso));
}

/**
 * CÁSCARA DEL PANEL INTERNO, CON LA SESIÓN DE DEMOSTRACIÓN.
 *
 * Se entra como A. Ruiz, abogada, porque un panel interno sin nadie detrás no
 * se puede evaluar: la pregunta que importa en esta pantalla no es «qué hay»
 * sino «qué me toca a mí hoy».
 *
 * El selector «Ver como» llevaba un comentario que prometía que cambiar a
 * «comercial» retiraba de la vista los documentos migratorios, «porque es lo
 * que hará la base de datos». No lo hacía: nadie consumía el contexto que
 * publicaba. Ahora sí —la navegación se filtra, las pantallas se cierran y
 * los expedientes se recortan a los asignados—, y se puede comprobar de un
 * vistazo cambiando el selector.
 *
 * Sigue sin ser un control de acceso, y el aviso de debajo lo dice en cada
 * pantalla. Ocultar un botón no protege un pasaporte.
 */
export function AdminShell({
  rol,
  sesion,
  children,
}: {
  rol: Role;
  /** Cuenta con la que se ha entrado, si hay sesión de demostración. */
  sesion?: { nombre: string; email: string } | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // El nombre sale de la sesión cuando la hay; si no, del usuario de
  // demostración del rol. Así «mis expedientes» significa lo mismo por las
  // dos vías.
  const perfil = USUARIOS_DEMO[rol as Exclude<Role, "cliente">];
  const usuario = { ...perfil, nombre: sesion?.nombre ?? perfil.nombre };

  // Cambiar de rol solo tiene sentido sin sesión —para recorrer el modelo— o
  // siendo administrador, que es quien gestiona el equipo. Un abogado que
  // entra con su cuenta no puede mirarse a sí mismo como comercial.
  const puedeCambiarRol = !sesion || sesion.email.startsWith("admin@");
  const nav = navPermitida(rol);

  /**
   * Cambiar de rol escribe la cookie y pide al servidor que vuelva a
   * renderizar. Es un viaje de ida y vuelta en lugar de un `setState`, y es
   * deliberado: si el rol solo viviera en el navegador, el servidor habría
   * mandado ya los expedientes que este rol no debe ver y el filtrado sería
   * un telón por delante del dato.
   *
   * `SameSite=Lax` y sin `Secure` en local; no lleva nada sensible —el nombre
   * de un rol— y su único efecto es qué se pinta.
   */
  const cambiarRol = (nuevo: Role) => {
    document.cookie = `${COOKIE_ROL}=${nuevo}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
    router.refresh();
  };

  return (
    <div className="bg-canvas min-h-dvh">
      <header className="bg-surface border-ink-100 sticky top-0 z-40 border-b">
        <div className="flex h-14 min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6">
          {/* On a phone the wordmark costs 130px that the role switcher needs. */}
          <Logo size="sm" href="/admin" showWordmark={false} className="sm:hidden" />
          <Logo size="sm" href="/admin" className="hidden sm:inline-flex" />
          <span className="bg-ink-950 hidden rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.08em] text-white uppercase sm:inline">
            Interno
          </span>

          <nav aria-label="Panel interno" className="ml-2 hidden min-w-0 flex-1 md:block">
            <ul className="flex gap-1">
              {nav.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                        active ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="admin-nav"
                          className="bg-ink-50 absolute inset-0 rounded-[10px]"
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                      <Glyph name={item.glyph} className="relative size-4" />
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* `shrink-0`: este grupo lleva la identidad y la salida, y encogerlo
              recortaba sus hijos en lugar de ceder espacio. Con la cuenta de
              administrador —la única que suma el selector de rol— la fila
              pedía 1.628 px y el botón «Salir» caía en 1.585: fuera de la
              pantalla incluso a 1.536 px de ancho, es decir, inalcanzable.
              Quien entraba como administrador no podía salir. */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {puedeCambiarRol && (
            <label className="flex items-center gap-2">
              <span className="text-ink-400 hidden text-[12px] whitespace-nowrap xl:inline">Ver como</span>
              <select
                value={rol}
                onChange={(e) => cambiarRol(e.target.value as Role)}
                aria-label="Cambiar el rol con el que se visualiza el panel"
                className="bg-surface text-ink-800 h-9 min-w-0 max-w-[140px] rounded-[10px] px-2.5 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none sm:max-w-none"
              >
                {ROLES.filter((r) => r.id !== "cliente").map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            )}
            {/* La persona, no la etiqueta del rol. Antes el avatar decía
                «Administrador»; ahora dice quién eres, que es lo que hace que
                «mis expedientes» signifique algo. */}
            <span className="hidden text-right whitespace-nowrap 2xl:block">
              <span className="text-ink-800 block text-[13px] leading-tight font-semibold">
                {usuario.nombre}
              </span>
              <span className="text-ink-400 block text-[11.5px] leading-tight">
                {usuario.puesto}
              </span>
            </span>
            <Avatar name={usuario.nombre} size={32} />
            {sesion && (
              <form action={accionSalir}>
                <button
                  type="submit"
                  className="text-ink-500 hover:text-ink-900 rounded-[10px] px-2 py-2 text-[12.5px] font-medium whitespace-nowrap transition-colors"
                >
                  Salir
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <nav aria-label="Panel interno" className="no-scrollbar border-ink-100 flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium",
                  active ? "bg-ink-950 text-white" : "text-ink-500 bg-ink-50",
                )}
              >
                <Glyph name={item.glyph} className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <RoleContext.Provider value={rol}>
        <main id="contenido" className="px-4 py-6 sm:px-6 lg:px-8">
          <AvisoDemostracion usuario={usuario.nombre} puesto={usuario.puesto} />
          {children}
        </main>
      </RoleContext.Provider>
    </div>
  );
}

/**
 * Lo que este panel no es.
 *
 * Va arriba de cada pantalla y no en un pie que nadie lee, porque la
 * confusión que evita es cara: alguien podría enseñar esto a un cliente o a
 * un inversor creyendo que hay una sesión detrás. No la hay. /admin responde
 * a cualquiera que escriba la URL.
 */
function AvisoDemostracion({ usuario, puesto }: { usuario: string; puesto: string }) {
  return (
    <div className="bg-signal-warn-soft ring-signal-warn/15 mx-auto mb-5 flex max-w-7xl gap-3 rounded-sm p-3.5 ring-1 ring-inset">
      <Glyph name="alert" className="text-signal-warn mt-0.5 size-4 shrink-0" />
      <p className="text-ink-700 text-[12.5px] leading-relaxed">
        <span className="font-semibold">
          Demostración: estás viendo el panel como {usuario}, {puesto.toLowerCase()}.
        </span>{" "}
        Los expedientes son inventados y no hay sesión iniciada: esta dirección responde a
        cualquiera que la escriba. Los permisos de abajo enseñan el modelo —qué ve cada rol— pero
        no lo imponen; eso corresponde a las políticas de la base de datos, que están escritas y
        todavía no conectadas.
      </p>
    </div>
  );
}

export const RoleContext = React.createContext<Role>(ROL_DEMO_INICIAL);
export const useRole = () => React.useContext(RoleContext);

/** ¿El rol con el que se está mirando el panel tiene este permiso? */
export function usePuede(permiso: Permiso): boolean {
  return puede(useRole(), permiso);
}

/** El usuario de demostración con el que se está mirando el panel. */
export function useUsuario() {
  return USUARIOS_DEMO[useRole() as Exclude<Role, "cliente">];
}
