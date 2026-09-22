import { puede, type Role } from "@/content/roles";
import { USUARIOS_DEMO } from "@/content/demo-sesion";

/**
 * QUÉ EXPEDIENTES VE ESTE ROL.
 *
 * La ficha del abogado dice «ver los expedientes que tiene asignados», y
 * hasta ahora eso era una frase en una tarjeta: el panel enseñaba los doce a
 * todo el mundo. El permiso `expedientes-todos` es lo que separa a quien ve
 * el despacho entero —dirección y gestoría— de quien ve su mesa.
 *
 * No es un detalle de permisos, es lo que hace útil la pantalla. Un panel de
 * plazos que enseña los plazos de otro obliga a filtrar mentalmente cada
 * mañana, y filtrar mentalmente es exactamente lo que se le pierde a alguien
 * que lleva veinte casos.
 */
export function filtrarAsignados<T extends { responsable: string }>(
  registros: T[],
  rol: Role,
): T[] {
  if (puede(rol, "expedientes-todos")) return registros;
  const yo = USUARIOS_DEMO[rol as Exclude<Role, "cliente">]?.nombre;
  return yo ? registros.filter((r) => r.responsable === yo) : [];
}

/**
 * La misma regla sobre las tarjetas del pipeline, que llaman `owner` a lo que
 * el expediente llama `responsable`.
 *
 * La primera versión reetiquetaba el campo y delegaba en la función de
 * arriba, lo que exigía una doble aserción de tipo para devolver el original:
 * eso es una forma cara de decir «confía en mí». La regla son dos líneas;
 * repetirlas cuesta menos que esconderlas detrás de un `as unknown as`. Que
 * las dos den el mismo resultado lo comprueba `roles.test.ts`.
 */
export function filtrarAsignadosPorOwner<T extends { owner: string }>(
  registros: T[],
  rol: Role,
): T[] {
  if (puede(rol, "expedientes-todos")) return registros;
  const yo = USUARIOS_DEMO[rol as Exclude<Role, "cliente">]?.nombre;
  return yo ? registros.filter((r) => r.owner === yo) : [];
}
