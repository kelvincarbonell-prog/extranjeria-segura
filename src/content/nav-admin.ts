import { puede, type Permiso, type Role } from "./roles";

/**
 * NAVEGACIÓN DEL PANEL, CON SU PERMISO.
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
 */
export interface EntradaNav {
  href: string;
  label: string;
  glyph: string;
  exact?: boolean;
  permiso: Permiso | null;
}

export const NAV_ADMIN: EntradaNav[] = [
  { href: "/admin", label: "Panel", glyph: "door", exact: true, permiso: null },
  { href: "/admin/plazos", label: "Plazos", glyph: "clock", permiso: "documentos" },
  { href: "/admin/recordatorios", label: "Avisos", glyph: "help", permiso: "documentos" },
  { href: "/admin/pipeline", label: "Pipeline", glyph: "path", permiso: null },
  { href: "/admin/expedientes", label: "Expedientes", glyph: "doc", permiso: "documentos" },
  { href: "/admin/contenido", label: "Verificación", glyph: "stamp", permiso: "verificacion" },
  { href: "/admin/equipo", label: "Equipo", glyph: "family", permiso: "equipo" },
  { href: "/admin/cuenta", label: "Tu cuenta", glyph: "lock", permiso: null },
];

export function navPermitida(rol: Role): EntradaNav[] {
  return NAV_ADMIN.filter((i) => i.permiso === null || puede(rol, i.permiso));
}
