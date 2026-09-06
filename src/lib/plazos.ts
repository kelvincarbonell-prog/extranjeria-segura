/**
 * CÓMPUTO DE PLAZOS ADMINISTRATIVOS.
 *
 * Toda la aritmética de fechas del producto vive aquí, y se ejecuta en el
 * cliente: ninguna fecha que introduce un usuario sale de su dispositivo.
 *
 * Dos reglas que parecen detalles y deciden expedientes:
 *
 * 1. Los plazos por meses se cuentan **de fecha a fecha**, a partir del día
 *    siguiente al de la notificación o la presentación. Si el día equivalente
 *    no existe en el mes de vencimiento —el 31 de enero más un mes—, el plazo
 *    termina el último día de ese mes. Es lo que dice el art. 30 de la Ley
 *    39/2015, y es exactamente lo que `new Date()` hace mal: sumar un mes al
 *    31 de enero en JavaScript da el 3 de marzo.
 *
 * 2. El día inicial no cuenta. Se cuenta desde el siguiente.
 *
 * Se trabaja en UTC a propósito. Estas fechas son días de calendario, no
 * instantes: convertirlas a hora local hace que un usuario en Lima vea un día
 * menos que uno en Madrid sobre el mismo plazo.
 */

/** Parsea una fecha ISO (YYYY-MM-DD) como día de calendario en UTC. */
export function parseDia(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function aISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Suma meses respetando el criterio de fecha a fecha del art. 30.4.
 * Enero 31 + 1 mes = febrero 28 (o 29), no marzo 3.
 */
export function sumarMeses(date: Date, meses: number): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const destino = new Date(Date.UTC(y, m + meses, 1));
  // Último día del mes de destino: día 0 del mes siguiente.
  const ultimoDia = new Date(
    Date.UTC(destino.getUTCFullYear(), destino.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return new Date(Date.UTC(destino.getUTCFullYear(), destino.getUTCMonth(), Math.min(d, ultimoDia)));
}

export function sumarDias(date: Date, dias: number): Date {
  return new Date(date.getTime() + dias * 86_400_000);
}

/**
 * Vencimiento de un plazo por meses contado desde el día siguiente al inicial.
 *
 * El criterio consolidado es que el plazo vence el día equivalente del mes
 * correspondiente: notificado el 15 de marzo, un mes vence el 15 de abril.
 */
export function vencimientoPorMeses(inicioISO: string, meses: number): Date {
  return sumarMeses(parseDia(inicioISO), meses);
}

/** Días naturales entre dos fechas. Positivo si `hasta` es posterior. */
export function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((hasta.getTime() - desde.getTime()) / 86_400_000);
}

/** Hoy, como día de calendario en UTC. */
export function hoy(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

export type EstadoPlazo = "abierto" | "ultimo-dia" | "vencido";

export interface Cuenta {
  vencimiento: Date;
  dias: number;
  estado: EstadoPlazo;
  /** `true` cuando quedan 7 días o menos. Cambia el tratamiento visual. */
  critico: boolean;
}

export function cuentaAtras(vencimiento: Date, desde: Date = hoy()): Cuenta {
  const dias = diasEntre(desde, vencimiento);
  const estado: EstadoPlazo = dias < 0 ? "vencido" : dias === 0 ? "ultimo-dia" : "abierto";
  return { vencimiento, dias, estado, critico: dias >= 0 && dias <= 7 };
}

const MESES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** «30 de septiembre de 2026». Se formatea a mano para no depender de `Intl`
 *  en el servidor, donde la configuración regional puede no estar instalada. */
export function fechaLarga(date: Date): string {
  return `${date.getUTCDate()} de ${MESES_ES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}
