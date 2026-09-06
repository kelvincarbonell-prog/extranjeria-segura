"use client";

import * as React from "react";
import { componerRecordatorio, IDIOMAS_RECORDATORIO } from "@/content/recordatorios";
import { LOCALE_META, type Locale } from "@/i18n/config";
import { fechaLarga, parseDia } from "@/lib/plazos";
import type { PlazoVivo } from "@/lib/vigilancia";
import { Card, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * RECLAMACIÓN DE DOCUMENTOS EN EL IDIOMA DEL CLIENTE.
 *
 * Perseguir documentos es la tarea más repetitiva del despacho y la que más
 * retrasa expedientes: el escrito está listo y falta un certificado que el
 * cliente no sabía que tenía que pedir.
 *
 * Aquí el responsable elige el expediente, ve qué falta y desde cuándo, y se
 * lleva el mensaje escrito. En la lengua del cliente, que es donde el trabajo
 * multilingüe deja de ser decoración: un despacho español que reclama en
 * español a un cliente marroquí recibe el documento equivocado dos semanas
 * después.
 *
 * ─── LO QUE NO HACE, A PROPÓSITO ────────────────────────────────────────
 *
 * No lo envía. Componer el texto y enviarlo son dos cosas distintas: la
 * primera ahorra quince minutos de escritura, la segunda exige elegir
 * proveedor, guardar consentimientos y responder de lo que sale del sistema.
 * Un botón de «enviar» que no existe es mejor que uno que manda mensajes sin
 * que nadie los haya leído antes.
 *
 * Y el texto siempre pasa por delante de una persona antes de salir. Un
 * mensaje sobre el expediente de alguien que se juega su residencia no se
 * manda a ciegas porque una plantilla lo haya generado bien otras veces.
 */
export function Recordatorios({
  expedientes,
}: {
  expedientes: {
    id: string;
    referencia: string;
    cliente: string;
    tramite: string;
    idioma: Locale;
    documentos: { nombre: string; nota?: string; desdeDias: number }[];
    plazo?: PlazoVivo;
  }[];
}) {
  const [activo, setActivo] = React.useState(expedientes[0]?.id ?? "");
  const [idioma, setIdioma] = React.useState<Locale | null>(null);
  const [copiado, setCopiado] = React.useState(false);

  const exp = expedientes.find((e) => e.id === activo) ?? expedientes[0];
  // Por defecto, el idioma que consta en el expediente. El selector permite
  // cambiarlo sin tocar la ficha del cliente.
  const idiomaElegido = idioma ?? exp?.idioma ?? "es";

  const mensaje = exp
    ? componerRecordatorio({
        cliente: exp.cliente,
        tramite: exp.tramite,
        documentos: exp.documentos.map((d) => ({ nombre: d.nombre, nota: d.nota })),
        plazo: exp.plazo
          ? {
              dias: Math.max(0, exp.plazo.cuenta.dias),
              fecha: fechaLarga(parseDia(exp.plazo.vence)),
            }
          : undefined,
        locale: idiomaElegido,
      })
    : "";

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2400);
    } catch {
      /* sin portapapeles: el texto está a la vista y se puede seleccionar */
    }
  };

  if (!exp) {
    return (
      <Card className="p-6">
        <p className="text-ink-600 text-[15px]">No hay expedientes con documentación pendiente.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* ── Expedientes con documentación pendiente ───────────────────── */}
      <div>
        <p className="text-ink-400 mb-3 text-[11px] font-bold tracking-[0.11em] uppercase">
          Con documentación pendiente
        </p>
        <ul className="space-y-2">
          {expedientes.map((e) => {
            const esActivo = e.id === exp.id;
            const masAntiguo = Math.max(...e.documentos.map((d) => d.desdeDias));
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActivo(e.id);
                    setIdioma(null);
                  }}
                  className={cn(
                    "w-full rounded-md px-3.5 py-3 text-left transition-colors",
                    esActivo
                      ? "bg-brand-50 shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.4)]"
                      : "bg-surface shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] hover:bg-ink-50",
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="data text-ink-400 text-[12px]">{e.referencia}</span>
                    <span
                      className={cn(
                        "text-[14px] font-semibold",
                        esActivo ? "text-brand-800" : "text-ink-800",
                      )}
                    >
                      {e.cliente}
                    </span>
                  </span>
                  <span className="text-ink-500 mt-0.5 block text-[12.5px]">
                    {e.documentos.length}{" "}
                    {e.documentos.length === 1 ? "documento" : "documentos"} · el más antiguo lleva{" "}
                    {masAntiguo} {masAntiguo === 1 ? "día" : "días"}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-ink-400 text-[11.5px]">
                      {LOCALE_META[e.idioma].native}
                    </span>
                    {e.plazo && (
                      <Badge tone={e.plazo.cuenta.critico ? "risk" : "warn"} className="text-[10.5px]">
                        {e.plazo.cuenta.dias} d
                      </Badge>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Qué falta y el mensaje ────────────────────────────────────── */}
      <div className="min-w-0">
        <Card className="p-5">
          <h2 className="text-ink-900 text-[16px] font-semibold tracking-[-0.015em]">
            {exp.cliente} · {exp.tramite}
          </h2>

          <ul className="border-ink-100 mt-4 border-t">
            {exp.documentos.map((d) => (
              <li
                key={d.nombre}
                className="border-ink-100 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5"
              >
                <span className="text-ink-700 text-[14px]">
                  {d.nombre}
                  {d.nota && <span className="text-ink-400"> — {d.nota}</span>}
                </span>
                <span className="data text-ink-400 shrink-0 text-[12px]">
                  {d.desdeDias} {d.desdeDias === 1 ? "día" : "días"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <label
              htmlFor="idioma-recordatorio"
              className="text-ink-600 mb-1.5 block text-[12.5px] font-medium"
            >
              Idioma del mensaje
            </label>
            <select
              id="idioma-recordatorio"
              value={idiomaElegido}
              onChange={(e) => setIdioma(e.target.value as Locale)}
              className="bg-surface text-ink-900 h-10 rounded-sm px-3 text-[14px] shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.08)] outline-none focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.5)]"
            >
              {IDIOMAS_RECORDATORIO.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_META[l].native}
                  {l === exp.idioma ? " · idioma del cliente" : ""}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="mt-4 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-ink-900 text-[15px] font-semibold">Mensaje</h3>
            <button
              type="button"
              onClick={copiar}
              className="bg-ink-950 tap inline-flex items-center gap-2 rounded-sm px-3.5 py-2 text-[13.5px] font-medium text-white"
            >
              {copiado ? "Copiado" : "Copiar"}
            </button>
          </div>

          <pre
            dir={LOCALE_META[idiomaElegido].dir}
            lang={LOCALE_META[idiomaElegido].bcp47}
            className="bg-canvas-deep text-ink-700 max-h-[380px] overflow-auto rounded-md p-4 font-sans text-[13.5px] leading-relaxed whitespace-pre-wrap"
          >
            {mensaje}
          </pre>

          <p className="text-ink-400 mt-3 text-[12.5px] leading-relaxed">
            El mensaje no se envía desde aquí: se copia y sale por el canal que uses. Léelo antes.
            Un aviso sobre el expediente de alguien que se juega su residencia no se manda a ciegas
            porque una plantilla lo haya generado bien otras veces.
          </p>
        </Card>
      </div>
    </div>
  );
}
