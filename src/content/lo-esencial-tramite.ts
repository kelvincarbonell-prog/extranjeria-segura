import type { Tramite } from "./taxonomy";
import { eur, formatDateES } from "@/lib/utils";
import { tieneDato } from "@/lib/dato";

/**
 * «LO ESENCIAL» DE UNA FICHA DE TRÁMITE (A4 + A13).
 *
 * La regla del bloque es que cada punto pueda leerse fuera de contexto y
 * contenga al menos una cifra o una norma. Si un punto no tiene ni número ni
 * artículo, sobra: compite por la atención con los que sí lo tienen.
 *
 * ─── POR QUÉ ESTE ARCHIVO EXISTE EN LUGAR DE ESCRIBIR LOS PUNTOS A MANO ──
 *
 * La auditoría pide llenar de cifras lo que hoy está lleno de adjetivos, y
 * avisa en la misma página de que el riesgo no es dar números sino darlos
 * equivocados. Las cifras normativas —dos años de permanencia, 200% del SMI,
 * art. 130.5— no las puedo escribir sin verificarlas contra el texto
 * consolidado, y están en la cola de `/admin/contenido` esperando a que
 * alguien lo haga.
 *
 * Pero hay una segunda clase de cifras que la ficha YA publica y que nadie ha
 * subido arriba: cuántos documentos son, cuántos aporta el cliente, cuántos
 * preparamos nosotros, cuántos pasos tiene el proceso, cuántos dependen de él,
 * qué honorarios, qué plazo orientativo, cuántos puntos hay que verificar.
 * Todas ciertas, todas comprobables abriendo la propia página, y todas
 * respondiendo a lo que la persona quiere saber antes de leer nada: cuánto
 * papeleo es esto, cuánto me va a costar y cuánto va a tardar.
 *
 * Se generan en lugar de escribirse porque así no pueden desincronizarse: si
 * mañana se añade un documento a la ficha, el bloque lo cuenta solo. Un
 * resumen escrito a mano al principio de un documento que cambia es un resumen
 * que acabará mintiendo.
 *
 * Cuando el revisor firme las cifras normativas, se añaden a este bloque como
 * puntos adicionales y pasan delante: una norma concreta pesa más que un
 * recuento de documentos.
 */
export function loEsencialTramite(t: Tramite): string[] {
  const puntos: string[] = [];

  // ── Papeleo: la primera pregunta real de quien llega ──────────────────
  const total = t.documents.length;
  const mios = t.documents.filter((d) => d.source === "cliente").length;
  const nuestros = t.documents.filter((d) => d.source === "nosotros").length;

  if (total > 0) {
    const partes = [`${mios} los aportas tú`];
    if (nuestros > 0) partes.push(`${nuestros} los preparamos nosotros`);
    const administracion = total - mios - nuestros;
    if (administracion > 0) partes.push(`${administracion} salen de la Administración`);
    puntos.push(`Son ${total} documentos: ${partes.join(", ")}.`);
  }

  // ── Coste, con lo que no incluye pegado al número ─────────────────────
  //
  // La nota de tasas se usa tal cual, sin `toLowerCase()` ni prefijo propio.
  // La primera versión hacía las dos cosas y salía «van aparte: las tasas
  // administrativas (modelo 790) no están incluidas… a la administración.
  // tampoco se incluyen…»: la nota ya dice qué queda fuera, así que añadirle
  // un preámbulo lo duplicaba, y minusculizarla rompía la segunda frase.
  puntos.push(
    t.feeFromCents !== null
      ? `Honorarios desde ${eur(t.feeFromCents)}. ${t.adminFeesNote}`
      : `Los honorarios se presupuestan tras el diagnóstico, según el alcance real del expediente. ${t.adminFeesNote}`,
  );

  // ── Plazo, siempre marcado como orientativo ───────────────────────────
  //
  // Solo si el plazo declarado lleva una cifra. Varios trámites tienen hoy un
  // `timeframe` escrito en prosa —«tiene su propio plazo», «según la unidad
  // que lo tramite»— que es exactamente el tipo de frase sin dato que este
  // bloque existe para desterrar. Un punto así incumpliría la regla del propio
  // bloque, así que no se emite: el trámite aparece en la cola de verificación
  // hasta que alguien ponga el número real.
  if (tieneDato(t.timeframe)) {
    puntos.push(`Plazo orientativo de la Administración: ${t.timeframe}`);
  }

  // ── Reparto del trabajo ───────────────────────────────────────────────
  const pasos = t.process.length;
  const pasosTuyos = t.process.filter((p) => p.actor === "cliente").length;
  if (pasos > 0) {
    puntos.push(
      pasosTuyos === 0
        ? `El proceso tiene ${pasos} pasos y ninguno depende de que hagas gestiones tú.`
        : `El proceso tiene ${pasos} pasos, de los que ${pasosTuyos} ${pasosTuyos === 1 ? "depende" : "dependen"} de ti.`,
    );
  }

  // ── Lo que no se puede saber sin ver la documentación real ────────────
  // Va el último a propósito: es el punto que justifica que exista el
  // servicio, y el que impide que el bloque se lea como una promesa.
  if (t.needsVerification.length > 0) {
    puntos.push(
      `Hay ${t.needsVerification.length} puntos que solo se pueden confirmar viendo tu documentación real. Están listados más abajo.`,
    );
  }

  return puntos;
}

/** Fecha de revisión, para la cabecera del bloque. */
export function revisadoEl(t: Tramite): string {
  return formatDateES(t.updatedAt);
}
