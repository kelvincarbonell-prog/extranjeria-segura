"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { DEMO_NOTIFICATIONS, type DemoNotification } from "@/content/demo";
import { Card, Badge, LegalNote } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { relativeES, cn } from "@/lib/utils";

/**
 * Notification centre.
 *
 * Grouped by day, newest first, with the unread state carried visually rather
 * than by a lone dot. Channel preferences sit on the same screen because the
 * question "why did I get a WhatsApp about this?" should be answerable in one
 * click, and because consent per channel is an RGPD requirement, not a setting.
 */

const GLYPHS: Record<DemoNotification["kind"], string> = {
  documento: "doc",
  cita: "clock",
  expediente: "path",
  mensaje: "family",
  pago: "stamp",
};

const KIND_LABEL: Record<DemoNotification["kind"], string> = {
  documento: "Documento",
  cita: "Cita",
  expediente: "Expediente",
  mensaje: "Mensaje",
  pago: "Pago",
};

const CHANNELS = [
  { id: "email", label: "Correo electrónico", detail: "Resúmenes y avisos importantes", on: true, locked: true, lockNote: "Obligatorio: es el canal en el que te comunicamos los plazos." },
  { id: "push", label: "Notificaciones push", detail: "Solo si instalas la aplicación", on: true, locked: false },
  { id: "sms", label: "SMS", detail: "Reservado para plazos urgentes", on: false, locked: false },
  { id: "whatsapp", label: "WhatsApp", detail: "Requiere tu consentimiento expreso", on: false, locked: false },
];

export function NotificationCentre() {
  const [items, setItems] = React.useState(DEMO_NOTIFICATIONS);
  const [channels, setChannels] = React.useState(CHANNELS);
  const unread = items.filter((n) => !n.read).length;

  const groups = React.useMemo(() => {
    const map = new Map<string, DemoNotification[]>();
    for (const n of items) {
      const key = new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(n.at));
      map.set(key, [...(map.get(key) ?? []), n]);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
            Notificaciones
          </h1>
          <p className="text-ink-500 mt-1.5 text-[15px]">
            {unread > 0
              ? `Tienes ${unread} ${unread === 1 ? "notificación sin leer" : "notificaciones sin leer"}.`
              : "Estás al día."}
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {groups.map(([day, list]) => (
        <section key={day}>
          <h2 className="text-ink-400 mb-2.5 text-[11px] font-bold tracking-[0.11em] uppercase">
            {day}
          </h2>
          <Card padding="none" className="overflow-hidden">
            <ul className="divide-ink-100 divide-y">
              <AnimatePresence initial={false}>
                {list.map((n) => (
                  <motion.li key={n.id} layout>
                    <Link
                      href={n.href ?? "/app"}
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                        )
                      }
                      className={cn(
                        "hover:bg-canvas-deep flex items-start gap-3.5 px-4 py-4 transition-colors sm:px-5",
                        !n.read && "bg-brand-50/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
                          n.read ? "bg-ink-50 text-ink-400" : "bg-brand-600 text-white",
                        )}
                      >
                        <Glyph name={GLYPHS[n.kind]} className="size-[17px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-ink-900 text-[14.5px] font-medium">{n.title}</span>
                          {!n.read && <Badge tone="brand">Nuevo</Badge>}
                        </span>
                        {n.body && (
                          <span className="text-ink-500 mt-0.5 block text-[13px] leading-snug">
                            {n.body}
                          </span>
                        )}
                        <span className="text-ink-300 mt-1 block text-[11.5px]">
                          {KIND_LABEL[n.kind]}
                        </span>
                      </span>
                      <span className="data text-ink-300 shrink-0 text-[11.5px]">
                        {relativeES(n.at)}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </Card>
        </section>
      ))}

      {/* ---------------- Channel preferences ---------------- */}
      <Card padding="md">
        <h2 className="text-ink-900 mb-1 text-[15px] font-semibold">Cómo quieres que te avisemos</h2>
        <p className="text-ink-500 mb-4 text-[13px] leading-relaxed">
          Puedes cambiar esto cuando quieras. Retirar un consentimiento no afecta a la gestión de tu
          expediente.
        </p>
        <ul className="divide-ink-100 divide-y">
          {channels.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-ink-900 text-[14px] font-medium">{c.label}</p>
                <p className="text-ink-400 text-[12.5px]">{c.locked ? c.lockNote : c.detail}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={c.on}
                aria-label={`${c.label}: ${c.on ? "activado" : "desactivado"}`}
                disabled={c.locked}
                onClick={() =>
                  setChannels((prev) =>
                    prev.map((x) => (x.id === c.id ? { ...x, on: !x.on } : x)),
                  )
                }
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-250",
                  c.on ? "bg-brand-600" : "bg-ink-200",
                  c.locked && "opacity-45",
                )}
              >
                <motion.span
                  className="absolute top-0.5 size-5 rounded-full bg-white shadow-sm"
                  animate={{ left: c.on ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              </button>
            </li>
          ))}
        </ul>

        <LegalNote className="mt-4">
          Los avisos de plazos administrativos se envían siempre por correo, porque su pérdida puede
          suponer el archivo de tu expediente. El resto de canales son opcionales y requieren tu
          consentimiento expreso.
        </LegalNote>
      </Card>
    </div>
  );
}
