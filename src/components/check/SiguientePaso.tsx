"use client";

import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/brand/Glyph";
import { registrar } from "@/lib/embudo";

/**
 * SIGUIENTE PASO, RAMIFICADO (A10).
 *
 * Antes, el diagnóstico desembocaba siempre en lo mismo: dos botones del mismo
 * peso, «revisar mi caso» y «guardar mi resultado». Dos acciones primarias en
 * la misma pantalla se reparten el clic y bajan la conversión total, y además
 * daban la misma respuesta a tres situaciones que no se parecen en nada.
 *
 * Ahora hay una sola acción dominante por rama:
 *
 *  · Con plazo corriendo — un requerimiento, una denegación, un silencio— la
 *    urgencia manda. La acción es que alguien lo mire hoy, y va por una ruta
 *    distinta de la del flujo normal, porque el problema tampoco es el mismo:
 *    aquí no se está eligiendo una vía, se está evitando perder un plazo.
 *
 *  · Con una vía clara y sin prisa, la acción es la consulta con especialista.
 *
 *  · Sin recorrido hoy, prometer una consulta sería venderle a alguien una
 *    hora que no le va a resolver nada. La acción útil es enseñarle qué
 *    tendría que cambiar y darle la forma de volver cuando cambie.
 */
export function SiguientePaso({
  urgente,
  hayVia,
}: {
  urgente: boolean;
  /** ¿El motor ha encontrado alguna vía, aunque sea para explorar? */
  hayVia: boolean;
}) {
  if (urgente) {
    return (
      <Marco
        tono="urgente"
        titulo="Tu plazo ya está corriendo. Esto no espera al lunes."
        cuerpo="Los requerimientos, las denegaciones y el silencio administrativo tienen plazos cortos que empiezan el día de la notificación. Súbenos el documento y te decimos hoy qué es, cuántos días te quedan y qué cabe hacer."
        accion={{ href: "/precios#revision", etiqueta: "Que lo revisen hoy · 79 €" }}
        apoyo={{
          href: "/calculadoras/plazos-regularizacion",
          etiqueta: "Calcular mi plazo exacto ahora, gratis",
        }}
      />
    );
  }

  if (!hayVia) {
    return (
      <Marco
        tono="explorar"
        titulo="Hoy no vemos una vía clara, y preferimos decírtelo."
        cuerpo="Con lo que nos has contado no hay una figura que encaje todavía. Casi siempre es cuestión de tiempo o de un requisito concreto que aún no se cumple. Lo útil ahora no es una consulta, sino saber qué tendría que cambiar."
        accion={{ href: "/tramites/categoria/arraigo", etiqueta: "Ver qué exige cada vía" }}
        apoyo={{
          href: "/recursos",
          etiqueta: "Guardar este enlace y volver cuando cambie mi situación",
        }}
      />
    );
  }

  return (
    <Marco
      tono="normal"
      titulo="El siguiente paso es que alguien lo mire de verdad."
      cuerpo="45 minutos con un especialista que revisa tu documentación, confirma la estrategia y te entrega el plan documental por escrito. Si después contratas la gestión, se te descuenta."
      accion={{ href: "/citas", etiqueta: "Reservar consulta de 45 min" }}
      apoyo={{ href: "/precios", etiqueta: "Ver antes qué incluye y qué no" }}
    />
  );
}

function Marco({
  tono,
  titulo,
  cuerpo,
  accion,
  apoyo,
}: {
  tono: "urgente" | "normal" | "explorar";
  titulo: string;
  cuerpo: string;
  accion: { href: string; etiqueta: string };
  /** Enlace de texto, nunca un segundo botón: repartiría el clic. */
  apoyo: { href: string; etiqueta: string };
}) {
  return (
    <div className="bg-ink-950 relative isolate overflow-hidden rounded-xl p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            tono === "urgente"
              ? "radial-gradient(560px 280px at 15% 0%, rgba(220,110,60,.42), transparent 62%)"
              : "radial-gradient(560px 280px at 15% 0%, rgba(65,89,250,.38), transparent 62%)",
        }}
      />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          {tono === "urgente" && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white/85">
              <Glyph name="alert" className="size-3.5" />
              Plazo corriendo
            </span>
          )}
          <h2 className="font-display text-[21px] leading-tight font-extrabold tracking-[-0.03em] text-balance text-white">
            {titulo}
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed text-white/55">{cuerpo}</p>
        </div>

        {/* Una sola acción primaria. El apoyo es un enlace, no un botón. */}
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          {/* El clic se registra con la rama, que es lo que dice si la
              ramificación acierta con la intención. */}
          <Button
            href={accion.href}
            size="lg"
            variant="inverse"
            arrow
            onClick={() => registrar("check:cta", tono)}
          >
            {accion.etiqueta}
          </Button>
          <Link
            href={apoyo.href}
            className="text-[13px] text-white/55 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/85"
          >
            {apoyo.etiqueta}
          </Link>
        </div>
      </div>
    </div>
  );
}
