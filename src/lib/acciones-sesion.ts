"use server";

import { redirect } from "next/navigation";
import { entrarDemo, salirDemo } from "./sesion-demo";

/**
 * LAS DOS ÚNICAS ACCIONES QUE EL NAVEGADOR PUEDE INVOCAR.
 *
 * Están solas en su archivo a propósito. `"use server"` publica como endpoint
 * RPC *todo* lo que el módulo exporte, así que meter aquí una función de
 * lectura la convierte en superficie accesible desde fuera sin que nadie lo
 * haya decidido. Aquí solo entran cosas que deben poder llamarse desde un
 * formulario.
 */

export type EstadoAcceso = { error?: string };

export async function accionEntrar(
  _previo: EstadoAcceso,
  datos: FormData,
): Promise<EstadoAcceso> {
  const email = String(datos.get("email") ?? "");
  const contrasena = String(datos.get("password") ?? "");

  const resultado = await entrarDemo(email, contrasena);

  if (!resultado.ok) {
    return {
      error:
        resultado.motivo === "desactivado"
          ? "Las cuentas de prueba están desactivadas porque la autenticación real ya está configurada."
          : "Ese correo y esa contraseña no coinciden con ninguna cuenta de prueba.",
    };
  }

  redirect(resultado.destino);
}

export async function accionSalir(): Promise<void> {
  await salirDemo();
  redirect("/entrar");
}
