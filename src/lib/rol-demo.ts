import { cookies } from "next/headers";
import { COOKIE_ROL, ROL_DEMO_INICIAL } from "@/content/demo-sesion";
import { ROLE_MAP, type Role } from "@/content/roles";

/**
 * EL ROL CON EL QUE SE MIRA EL PANEL, EN UNA COOKIE.
 *
 * La primera versión guardaba el rol en el estado de React, y con eso el
 * filtrado solo podía ocurrir en el navegador: la pantalla se ocultaba pero
 * el servidor ya había mandado los doce expedientes en el HTML. Esconder un
 * dato que ya has enviado no es esconderlo.
 *
 * En una cookie, el servidor sabe con qué rol se está mirando antes de
 * renderizar, así que un perfil comercial simplemente no recibe la
 * documentación migratoria. Sigue sin ser seguridad —la cookie la escribe el
 * propio navegador y cualquiera puede cambiarla— pero la *forma* es la
 * correcta: la decisión se toma en el servidor y el dato no viaja. El día que
 * haya sesión de verdad, el rol sale de ella en lugar de la cookie y el resto
 * del código no se entera.
 *
 * El panel ya es `force-dynamic` por los plazos, así que leer una cookie aquí
 * no cuesta nada: no había nada que prerenderizar.
 */

export { COOKIE_ROL };

function esRolDePanel(v: string): v is Role {
  return v in ROLE_MAP && v !== "cliente";
}

/** Rol activo en el servidor. Por defecto, el abogado. */
export async function rolDemo(): Promise<Role> {
  const valor = (await cookies()).get(COOKIE_ROL)?.value;
  return valor && esRolDePanel(valor) ? valor : ROL_DEMO_INICIAL;
}
