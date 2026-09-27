import { puede, type Permiso, type Role } from "./roles";

/**
 * NAVEGACIÓN DEL PANEL, CON SU PERMISO Y SU FRECUENCIA.
 *
 * Vive aquí y no en `AdminShell.tsx` porque aquel módulo es de cliente, y una
 * función exportada desde un módulo de cliente no se puede llamar desde el
 * servidor: Next lanza «Attempted to call navPermitida() from the server».
 * La página de cuenta la necesita para enseñar a qué pantallas entra cada
 * rol, y reventaba con un 500 en cuanto se abría.
 *
 * Ninguna auditoría lo cazó porque la ruta era nueva y no estaba en ninguna
 * de sus listas. Está añadida ahora: una pantalla que no recorre nadie es una
 * pantalla que puede estar rota sin que se note.
 *
 * `permiso: null` = la ven todos los roles del panel.
 *
 * ─── EL ORDEN ES POR FRECUENCIA, NO POR JERARQUÍA ───────────────────────
 *
 * Estaba en el orden en que se fueron construyendo las pantallas, y eso dejaba
 * «Expedientes» —la lista de trabajo, ordenada por prioridad— en la quinta
 * posición. Medido en la fila de pestañas de un móvil de 360 px: se veían tres
 * de ocho, y Expedientes no era ninguna de las tres. La herramienta principal
 * del día estaba detrás de un desplazamiento horizontal que no se anuncia.
 *
 * Ahora van por lo que alguien abre de verdad en una mañana: qué toca hoy, la
 * lista completa, los vencimientos, lo que hay que reclamar. Lo comercial y lo
 * de configuración, después.
 *
 * `principal` marca las cuatro que caben en la barra inferior del móvil. El
 * resto viven en «Más», que es explícito: lo que está en un menú se sabe que
 * está; lo que está fuera de pantalla en un carrusel, no.
 */
export interface EntradaNav {
  href: string;
  label: string;
  glyph: string;
  exact?: boolean;
  permiso: Permiso | null;
  /** Entra en la barra inferior del móvil. Máximo cuatro. */
  principal?: boolean;
}

export const NAV_ADMIN: EntradaNav[] = [
  // Lo que se abre cada día.
  { href: "/admin", label: "Panel", glyph: "door", exact: true, permiso: null, principal: true },
  { href: "/admin/expedientes", label: "Expedientes", glyph: "doc", permiso: "documentos", principal: true },
  { href: "/admin/plazos", label: "Plazos", glyph: "clock", permiso: "documentos", principal: true },
  { href: "/admin/recordatorios", label: "Avisos", glyph: "help", permiso: "documentos", principal: true },

  // Lo que se abre algunas veces por semana.
  { href: "/admin/pipeline", label: "Pipeline", glyph: "path", permiso: null },
  { href: "/admin/contenido", label: "Verificación", glyph: "stamp", permiso: "verificacion" },

  // Configuración. Y la cuenta, que además está en el avatar.
  { href: "/admin/equipo", label: "Equipo", glyph: "family", permiso: "equipo" },
  { href: "/admin/cuenta", label: "Tu cuenta", glyph: "lock", permiso: null },
];

export function navPermitida(rol: Role): EntradaNav[] {
  return NAV_ADMIN.filter((i) => i.permiso === null || puede(rol, i.permiso));
}

/**
 * Las que van en la barra inferior del móvil y las que van en «Más».
 *
 * Un rol sin `documentos` —el comercial, el colaborador— se queda con muy
 * pocas principales; entonces se rellena con las siguientes que sí puede ver,
 * para no dejar una barra de dos iconos y un hueco.
 */
export function navMovil(rol: Role): { barra: EntradaNav[]; mas: EntradaNav[] } {
  const permitidas = navPermitida(rol);
  const principales = permitidas.filter((i) => i.principal);
  const resto = permitidas.filter((i) => !i.principal);

  const barra = [...principales, ...resto].slice(0, 4);
  const mas = permitidas.filter((i) => !barra.includes(i));
  return { barra, mas };
}
