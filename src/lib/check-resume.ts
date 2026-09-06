import type { Answers } from "@/content/check-questions";

/**
 * ENLACE DE REANUDACIÓN DEL DIAGNÓSTICO (A9).
 *
 * El abandono en cuestionarios de ocho pasos se concentra entre la tercera y
 * la quinta pregunta. Quien se va ahí se va entero: no hay forma de
 * recuperarlo, porque no ha dado ningún dato de contacto ni se le ha pedido.
 *
 * La solución habitual es pedir el correo para «enviarte el resultado». Aquí
 * no vale: este producto promete que las respuestas no salen del navegador, y
 * esas respuestas incluyen situación administrativa y antecedentes penales.
 * Pedir un correo para guardarlas rompería exactamente la promesa que hace que
 * alguien se atreva a responderlas.
 *
 * Así que las respuestas viajan en el **fragmento** de la URL, después de la
 * almohadilla. Un fragmento no se envía en la petición HTTP: no llega a
 * nuestro servidor, no aparece en los registros de acceso, no lo ve un
 * intermediario. El enlace funciona en cualquier dispositivo, se puede guardar
 * en marcadores o mandárselo uno mismo, y no requiere ni proveedor de correo
 * ni cuenta ni API.
 *
 * La codificación es compacta a propósito. Un `JSON.stringify` en base64 de
 * ocho respuestas da una URL de más de trescientos caracteres, que muchas
 * aplicaciones de mensajería parten en dos y dejan de funcionar. Con claves e
 * índices abreviados baja a unas decenas.
 */

/** Versión del formato. Si cambia el cuestionario, un enlace viejo se ignora
 *  en lugar de restaurar respuestas que ya no significan lo mismo. */
const VERSION = "1";

const SEPARADOR_CAMPO = "~";
const SEPARADOR_CLAVE = ".";
const SEPARADOR_FRAGMENTO = "!";

/** Codifica las respuestas en una cadena apta para un fragmento de URL. */
export function codificarRespuestas(answers: Answers): string {
  const partes = Object.entries(answers)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}${SEPARADOR_CLAVE}${String(v)}`);

  if (partes.length === 0) return "";
  return `${VERSION}${SEPARADOR_FRAGMENTO}${partes.join(SEPARADOR_CAMPO)}`;
}

/**
 * Decodifica un fragmento. Devuelve `null` ante cualquier cosa que no sea un
 * fragmento válido de esta versión: un enlace manipulado, truncado por una
 * aplicación de mensajería o de un formato anterior no debe producir un
 * cuestionario a medias con respuestas inventadas.
 */
export function decodificarRespuestas(fragmento: string): Answers | null {
  if (!fragmento) return null;

  const limpio = fragmento.startsWith("#") ? fragmento.slice(1) : fragmento;
  const marca = limpio.indexOf(SEPARADOR_FRAGMENTO);
  if (marca === -1) return null;

  if (limpio.slice(0, marca) !== VERSION) return null;

  const cuerpo = limpio.slice(marca + 1);
  if (!cuerpo) return null;

  const answers: Answers = {};
  for (const campo of cuerpo.split(SEPARADOR_CAMPO)) {
    const corte = campo.indexOf(SEPARADOR_CLAVE);
    if (corte <= 0) return null;
    const clave = campo.slice(0, corte);
    const valor = campo.slice(corte + 1);
    if (!clave || !valor) return null;
    // Solo claves alfanuméricas: el fragmento viene de fuera y se trata como
    // entrada no fiable, aunque el destino sea únicamente el propio navegador.
    if (!/^[a-z_]{1,32}$/.test(clave)) return null;
    if (!/^[a-z0-9_-]{1,48}$/i.test(valor)) return null;
    answers[clave] = valor;
  }

  return Object.keys(answers).length > 0 ? answers : null;
}

/** URL completa de reanudación, lista para copiar. */
export function enlaceReanudacion(answers: Answers, origen: string, ruta = "/diagnostico"): string {
  const codigo = codificarRespuestas(answers);
  if (!codigo) return `${origen}${ruta}`;
  return `${origen}${ruta}#${codigo}`;
}
