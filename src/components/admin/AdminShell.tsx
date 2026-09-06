"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Avatar, DemoTag } from "@/components/ui/primitives";
import { ROLES, type Role } from "@/content/roles";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Panel", glyph: "door", exact: true },
  { href: "/admin/pipeline", label: "Pipeline", glyph: "path" },
  { href: "/admin/expedientes", label: "Expedientes", glyph: "doc" },
  { href: "/admin/equipo", label: "Equipo y roles", glyph: "family" },
];

/**
 * Internal panel shell with a role switcher.
 *
 * The switcher is not a demo toy: it is how the team verifies that the UI is
 * consistent with the RLS policies. Switching to "comercial" must visibly
 * remove immigration documents from view, because that is what the database
 * will do.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = React.useState<Role>("admin");

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

          <nav aria-label="Panel interno" className="ml-2 hidden flex-1 md:block">
            <ul className="flex gap-1">
              {NAV.map((item) => {
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

          <div className="ml-auto flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <DemoTag className="hidden sm:inline-flex" />
            <label className="flex items-center gap-2">
              <span className="text-ink-400 hidden text-[12px] sm:inline">Ver como</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
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
            <Avatar name={ROLES.find((r) => r.id === role)?.label ?? "Equipo"} size={32} />
          </div>
        </div>

        {/* Mobile nav */}
        <nav aria-label="Panel interno" className="no-scrollbar border-ink-100 flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
          {NAV.map((item) => {
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

      <RoleContext.Provider value={role}>
        <main id="contenido" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </RoleContext.Provider>
    </div>
  );
}

export const RoleContext = React.createContext<Role>("admin");
export const useRole = () => React.useContext(RoleContext);
