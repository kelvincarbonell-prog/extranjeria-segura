"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DEMO_MESSAGES, type DemoMessage } from "@/content/demo";
import { Avatar, Badge, LegalNote } from "@/components/ui/primitives";
import { Button, IconButton } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { cn } from "@/lib/utils";

/**
 * Case chat.
 *
 * The assistant answers first-line questions about status, documents and next
 * steps. The moment a question touches whether something is legally valid, it
 * hands over rather than guessing — the escalation is visible in the thread so
 * the client can see a human is now involved. That handover is the product's
 * safety boundary, not a UX nicety.
 */

const HANDOVER_TRIGGERS = [
  "requisito", "cumplo", "deniegan", "denegar", "recurso", "plazo", "legal",
  "apostilla", "válido", "valido", "puedo", "antecedente", "expulsión", "multa",
];

/** Kept out of the component so the clock is never read during render. */
const nowIso = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 10)}`;

const QUICK = [
  "¿En qué punto está mi expediente?",
  "¿Qué documentos me faltan?",
  "¿Cuál es el siguiente paso?",
  "¿Cuándo tengo que pagar el segundo plazo?",
];

export function Chat() {
  const [messages, setMessages] = React.useState<DemoMessage[]>(DEMO_MESSAGES);
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, typing, reduce]);

  const send = (text: string) => {
    const body = text.trim();
    if (!body) return;

    const mine: DemoMessage = {
      id: newId("u"),
      from: "cliente",
      authorName: "Tú",
      body,
      at: nowIso(),
    };
    setMessages((m) => [...m, mine]);
    setDraft("");
    setTyping(true);

    const needsHuman = HANDOVER_TRIGGERS.some((t) => body.toLowerCase().includes(t));

    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: newId("a"),
            from: "asistente",
            authorName: "Asistente de Extranjería Segura",
            body: needsHuman
              ? "Esto afecta a los requisitos de tu expediente, así que no te lo voy a responder yo. Voy a trasladar tu consulta a tu especialista, que te contesta en horario laboral."
              : "Tu expediente está en la fase de documentación, con 4 de 8 documentos validados. Lo que nos falta de tu parte es el certificado de antecedentes penales y la nueva versión del contrato firmada por la empresa. En cuanto los tengamos, tu especialista cierra la revisión.",
            at: nowIso(),
          },
        ]);
      },
      reduce ? 200 : 1300,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-900 font-display text-[26px] leading-tight font-extrabold tracking-[-0.035em] md:text-[32px]">
            Mensajes
          </h1>
          <p className="text-ink-500 mt-1.5 text-[15px]">
            Todo lo relacionado con tu expediente, en un solo hilo.
          </p>
        </div>
        <Badge tone="ok" dot>
          Tu especialista está disponible
        </Badge>
      </div>

      <div className="bg-surface flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.07)]">
        {/* ---- Header ---- */}
        <div className="border-ink-100 flex items-center gap-3 border-b px-4 py-3.5">
          <Avatar name="Tu especialista" size={36} />
          <div className="min-w-0 flex-1">
            <p className="text-ink-900 text-[14px] font-semibold">Tu especialista</p>
            <p className="text-ink-400 text-[12px]">Expediente #ES-2048 · Arraigo sociolaboral</p>
          </div>
          <IconButton label="Adjuntar documento">
            <Glyph name="doc" className="size-[18px]" />
          </IconButton>
        </div>

        {/* ---- Thread ---- */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="flex flex-col gap-3.5">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} reduce={reduce} />
            ))}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <span className="bg-ink-50 ring-ink-900/[.05] flex items-center gap-1.5 rounded-lg px-4 py-3 ring-1 ring-inset">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="bg-ink-300 size-1.5 rounded-full"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        </div>

        {/* ---- Quick prompts ---- */}
        <div className="border-ink-100 no-scrollbar flex gap-2 overflow-x-auto border-t px-4 py-2.5">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="text-ink-600 bg-canvas-deep hover:text-ink-900 hover:bg-ink-100 shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* ---- Composer ---- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="border-ink-100 bg-canvas-deep flex items-end gap-2.5 border-t p-3"
        >
          <label htmlFor="chat-input" className="sr-only">
            Escribe un mensaje
          </label>
          <textarea
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={1}
            placeholder="Escribe tu mensaje…"
            className="bg-surface text-ink-900 placeholder:text-ink-300 max-h-32 min-h-[46px] flex-1 resize-none rounded-sm px-4 py-3 text-[14.5px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
          />
          <Button type="submit" size="md" disabled={!draft.trim()}>
            Enviar
          </Button>
        </form>
      </div>

      <LegalNote variant="framed">
        El asistente responde sobre el estado de tu expediente, tu documentación y los siguientes
        pasos. <strong className="text-ink-600">No emite asesoramiento jurídico</strong>: cuando la
        consulta afecta a requisitos, plazos o validez de documentos, la traslada a tu especialista.
      </LegalNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Bubble({ message: m, reduce }: { message: DemoMessage; reduce: boolean | null }) {
  const mine = m.from === "cliente";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-lg px-4 py-3 sm:max-w-[72%]",
          mine
            ? "bg-brand-600 text-white"
            : m.from === "asistente"
              ? "bg-ink-50 text-ink-700 ring-ink-900/[.05] ring-1 ring-inset"
              : "bg-canvas-deep text-ink-800 ring-ink-900/[.05] ring-1 ring-inset",
        )}
      >
        {!mine && (
          <p
            className={cn(
              "mb-1 flex items-center gap-1.5 text-[11px] font-semibold",
              m.from === "asistente" ? "text-ink-400" : "text-brand-700",
            )}
          >
            {m.from === "asistente" && <Glyph name="signal" className="size-3" />}
            {m.authorName}
          </p>
        )}
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{m.body}</p>
        {m.attachment && (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-ink-700 mt-2.5 flex items-center gap-2 rounded-sm bg-white/80 px-3 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-white"
          >
            <Glyph name="doc" className="text-ink-400 size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{m.attachment.name}</span>
            <span className="text-brand-600 shrink-0">Abrir</span>
          </a>
        )}
        <p
          className={cn(
            "data mt-1.5 text-[10.5px]",
            mine ? "text-white/50" : "text-ink-300",
          )}
        >
          {new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(
            new Date(m.at),
          )}
        </p>
      </div>
    </motion.div>
  );
}
