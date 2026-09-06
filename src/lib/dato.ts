/**
 * ¿ESTA FRASE APORTA UN DATO?
 *
 * La regla del bloque «Lo esencial»: cada punto debe poder leerse fuera de
 * contexto y contener al menos una cifra o una referencia normativa. Un punto
 * sin ninguna de las dos no es esencial, es relleno, y compite por la atención
 * con los que sí lo son.
 *
 * Vive en un archivo propio porque la usan dos sitios que tienen que estar de
 * acuerdo: el generador de los bloques, que decide qué punto emitir, y la
 * auditoría, que comprueba lo publicado. La primera versión tenía la regla
 * duplicada —`/\d/` en uno y una expresión más rica en el otro— y el
 * desacuerdo se notó enseguida: el generador descartaba «el plazo legal es de
 * un año» por no llevar dígito mientras la auditoría lo daba por bueno.
 *
 * Las cantidades escritas con letra cuentan. «Tres meses» es tan concreto como
 * «3 meses», y en prosa jurídica española es la forma habitual de escribirlo.
 */

/** Cantidades escritas con letra, incluidas las que abren una frase. */
const CANTIDAD_ESCRITA =
  /\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|noventa)\s+(año|años|mes|meses|día|días|semana|semanas|hora|horas)\b/i;

/** Referencia a una norma concreta. */
const REFERENCIA_NORMATIVA =
  /\b(art\.|artículo|ley\s+\d|real\s+decreto|RD\s+\d|BOE|disposición\s+adicional|DA\s+\d)/i;

const CIFRA = /\d/;

export function tieneDato(frase: string): boolean {
  return CIFRA.test(frase) || CANTIDAD_ESCRITA.test(frase) || REFERENCIA_NORMATIVA.test(frase);
}
