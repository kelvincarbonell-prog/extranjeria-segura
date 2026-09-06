"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { Glyph } from "@/components/brand/Glyph";
import { Avatar, DemoTag, Progress } from "@/components/ui/primitives";
import { DEMO_CASE, DEMO_NOTIFICATIONS } from "@/content/demo";
import { cn } from "@/lib/utils";

/**
 * Client-area shell.
 *
 * Mobile is not a narrowed desktop: it gets a bottom tab bar with the five
 * destinations that matter on a phone, plus a contextual floating action that
 * changes with the case state. Desktop gets the full rail. Both share the same
 * route tree, so nothing is unreachable on either.
 */

const NAV = [
  { href: "/app", label: "Inicio", glyph: "door", exact: true },
  { href: "/app/expediente", label: "Mi expediente", glyph: "path" },
  { href: "/app/documentos", label: "Documentos", glyph: "doc" },
  { href: "/app/mensajes", label: "Mensajes", glyph: "family" },
  { href: "/app/citas", label: "Citas", glyph: "clock" },
  { href: "/app/pagos", label: "Pagos", glyph: "stamp" },
  { href: "/app/notificaciones", label: "Notificaciones", glyph: "alert" },
  { href: "/app/perfil", label: "Perfil", glyph: "shield" },
];

/** The five that survive on a 390px screen. */
const MOBILE_NAV = [
  { href: "/app", label: "Inicio", glyph: "door", exact: true },
  { href: "/app/expediente", label: "Expediente", glyph: "path" },
  { href: "/app/documentos", label: "Documentos", glyph: "doc" },
  { href: "/app/mensajes", label: "Mensajes", glyph: "family" },
  { href: "/app/perfil", label: "Perfil", glyph: "shield" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const unread = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="bg-canvas-deep min-h-dvh">
      {/* ================= Desktop rail ================= */}
      <aside className="bg-surface border-ink-100 fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r lg:flex">
        <div className="border-ink-100 flex h-16 items-center border-b px-5">
          <Logo size="sm" href="/app" />
        </div>

        {/* Case summary */}
        <div className="border-ink-100 border-b p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="data text-ink-400 text-[11px] font-medium">
              #{DEMO_CASE.reference}
            </span>
            <DemoTag />
          </div>
          <p className="text-ink-900 font-display text-[15px] leading-tight font-extrabold tracking-[-0.025em]">
            {DEMO_CASE.tramite}
          </p>
          <Progress value={DEMO_CASE.progress} size="xs" className="mt-3" />
          <p className="text-ink-400 mt-2 text-[12px]">
            <span className="data text-ink-700 font-semibold">{DEMO_CASE.progress}%</span> completado
          </p>
        </div>

        <nav aria-label="Navegación del área privada" className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[14px] font-medium transition-colors",
                      active ? "text-ink-900" : "text-ink-500 hover:text-ink-900 hover:bg-ink-50",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="app-nav"
                        className="bg-brand-50 absolute inset-0 rounded-[11px]"
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <Glyph
                      name={item.glyph}
                      className={cn(
                        "relative size-[18px] shrink-0 transition-colors",
                        active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-700",
                      )}
                    />
                    <span className="relative flex-1">{item.label}</span>
                    {item.href === "/app/notificaciones" && unread > 0 && (
                      <span className="bg-brand-600 relative flex size-[18px] items-center justify-center rounded-full text-[10.5px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-ink-100 border-t p-3">
          <div className="hover:bg-ink-50 flex items-center gap-3 rounded-[11px] p-2.5 transition-colors">
            <Avatar name={DEMO_CASE.clientFirstName} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-900 truncate text-[13px] font-semibold">
                {DEMO_CASE.clientFirstName}
              </p>
              <p className="text-ink-400 truncate text-[11.5px]">Cuenta de demostración</p>
            </div>
            <Link href="/" aria-label="Salir" className="text-ink-300 hover:text-ink-700">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden>
                <path
                  d="M12.5 6.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h6a1.5 1.5 0 0 0 1.5-1.5v-1.5M8 10h8.5m0 0-2.5-2.5M16.5 10 14 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* ================= Mobile top bar ================= */}
      <header className="glass border-ink-100 sticky top-0 z-40 border-b lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo size="sm" href="/app" showWordmark={false} />
          <div className="flex flex-col items-center">
            <span className="text-ink-900 text-[13px] font-semibold">{DEMO_CASE.tramite}</span>
            <span className="data text-ink-400 text-[10.5px]">#{DEMO_CASE.reference}</span>
          </div>
          <Link
            href="/app/notificaciones"
            aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ""}`}
            className="text-ink-500 relative flex size-9 items-center justify-center"
          >
            <Glyph name="alert" className="size-[19px]" />
            {unread > 0 && (
              <span className="bg-brand-600 absolute top-1.5 right-1.5 size-2 rounded-full ring-2 ring-white" />
            )}
          </Link>
        </div>
        <div className="bg-ink-100 h-0.5 w-full">
          <div
            className="bg-brand-600 h-full transition-[width] duration-700"
            style={{ width: `${DEMO_CASE.progress}%` }}
          />
        </div>
      </header>

      {/* ================= Content ================= */}
      <div className="lg:pl-[264px]">
        <main className="mx-auto max-w-5xl px-4 pt-5 pb-32 sm:px-6 lg:px-8 lg:pt-8 lg:pb-16">
          {children}
        </main>
      </div>

      {/* ================= Mobile bottom nav ================= */}
      <ContextualAction />
      <nav
        aria-label="Navegación principal"
        className="glass border-ink-100 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="flex">
          {MOBILE_NAV.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 transition-colors",
                    active ? "text-brand-600" : "text-ink-400",
                  )}
                >
                  <span className="relative">
                    <Glyph name={item.glyph} className="size-[21px]" />
                    {item.href === "/app/mensajes" && (
                      <span className="bg-brand-600 absolute -top-0.5 -right-1 size-1.5 rounded-full" />
                    )}
                  </span>
                  <span className="text-[10.5px] leading-none font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The floating action changes with what the case actually needs next —
 * upload a document while documents are pending, otherwise continue the case.
 */
function ContextualAction() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(true);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/app/documentos" || pathname.startsWith("/app/mensajes")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-[calc(74px+env(safe-area-inset-bottom))] z-40 lg:hidden"
        >
          <Link
            href="/app/documentos"
            className="bg-ink-950 flex items-center gap-2.5 rounded-full py-3.5 pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(10,13,22,.5)]"
          >
            <Glyph name="doc" className="size-[18px]" />
            Subir documento
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

