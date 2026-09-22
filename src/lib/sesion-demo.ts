import "server-only";

import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

import { site } from "@/content/site";
import {
  COOKIE_ROL,
  COOKIE_SESION,
  CUENTAS_DEMO,
  type CuentaDemo,
} from "@/content/demo-sesion";

/**
 * SESIÓN DE DEMOSTRACIÓN.
 *
 * Cuatro cuentas de prueba con la contraseña impresa en la propia pantalla de
 * acceso. Ver la nota larga de `demo-sesion.ts` sobre por qué eso es lo
 * correcto aquí y no un descuido.
 *
 * ─── EL INTERRUPTOR QUE LO APAGA SOLO ───────────────────────────────────
 *
 * Todo lo de este archivo comprueba primero `site.features.supabase`. En
 * cuanto existan las variables de entorno de Supabase, estas credenciales
 * dejan de funcionar y el formulario vuelve a la autenticación de verdad.
 *
 * Es la única defensa que vale para una contraseña de juguete: que se
 * desactive sola al aparecer la de verdad, en lugar de depender de que
 * alguien se acuerde de borrarla antes de publicar.
 *
 * ─── POR QUÉ ESTE ARCHIVO NO LLEVA «use server» ─────────────────────────
 *
 * Lo llevaba. Con esa directiva, *todas* las exportaciones del módulo se
 * convierten en acciones invocables por RPC desde el navegador: `sesionDemo`
 * y `cuentaPorEmail`, que solo tienen sentido dentro del servidor, quedaban
 * publicadas como endpoints. Aquí no hay secreto que se escape, pero es una
 * superficie que nadie pidió y que se hereda sin darse cuenta.
 *
 * Las dos cosas están separadas: la lectura aquí, marcada `server-only` para
 * que el empaquetador falle si alguien la importa desde un componente de
 * cliente, y las dos acciones que sí deben ser invocables en
 * `acciones-sesion.ts`.
 */

/** ¿Están activas las cuentas de prueba? Solo sin autenticación real. */
export function demoDisponible(): boolean {
  return !site.features.supabase;
}

/**
 * Comparación en tiempo constante.
 *
 * Aquí no hay secreto que proteger —la contraseña está impresa en pantalla—,
 * así que esto no defiende de nada hoy. Está por una razón distinta: este
 * archivo es la plantilla que alguien copiará el día que conecte cuentas de
 * verdad, y lo que se copia es la forma. Un `===` aquí es un `===` allí.
 */
function igual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export function cuentaPorEmail(email: string): CuentaDemo | null {
  const buscado = email.trim().toLowerCase();
  return CUENTAS_DEMO.find((c) => c.email === buscado) ?? null;
}

export type ResultadoAcceso =
  | { ok: true; destino: string }
  | { ok: false; motivo: "credenciales" | "desactivado" };

/**
 * Comprueba las credenciales y abre la sesión.
 *
 * El mensaje de error no distingue entre «ese correo no existe» y «esa
 * contraseña no es»: aunque aquí no haya nada que proteger, decir cuál de las
 * dos falla convierte el formulario en un comprobador de correos registrados.
 * Es otra de esas formas que conviene tener bien desde el principio.
 */
export async function entrarDemo(email: string, contrasena: string): Promise<ResultadoAcceso> {
  if (site.features.supabase) return { ok: false, motivo: "desactivado" };

  const cuenta = cuentaPorEmail(email);
  if (!cuenta || !igual(cuenta.contrasena, contrasena)) {
    return { ok: false, motivo: "credenciales" };
  }

  const tarro = await cookies();
  const opciones = {
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  // `httpOnly` en la sesión: no hay nada sensible dentro —un correo de
  // demostración— pero que el navegador no pueda reescribirla a mano es lo
  // que hace que el rol venga del servidor y no del cliente.
  tarro.set(COOKIE_SESION, cuenta.email, { ...opciones, httpOnly: true });

  // El rol va aparte y sin `httpOnly` porque el selector «Ver como» del panel
  // lo escribe desde el navegador: es una herramienta para comprobar el
  // modelo de permisos de un vistazo, y se mantiene.
  tarro.set(COOKIE_ROL, cuenta.rol, opciones);

  return { ok: true, destino: cuenta.destino };
}

/** La cuenta con la que se ha entrado, si hay sesión de demostración abierta. */
export async function sesionDemo(): Promise<CuentaDemo | null> {
  if (site.features.supabase) return null;
  const email = (await cookies()).get(COOKIE_SESION)?.value;
  return email ? cuentaPorEmail(email) : null;
}

export async function salirDemo(): Promise<void> {
  const tarro = await cookies();
  tarro.delete(COOKIE_SESION);
  tarro.delete(COOKIE_ROL);
}
