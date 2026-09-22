import type { Role } from "./roles";

/**
 * QUIÉN ERES CUANDO ENTRAS AL PANEL DE DEMOSTRACIÓN.
 *
 * El panel enseñaba los mismos doce expedientes a cualquiera que abriese la
 * URL, con un selector de rol que solo cambiaba el nombre del avatar. Faltaba
 * lo primero que necesita un panel interno: alguien detrás de la pantalla.
 *
 * Aquí está ese alguien, uno por rol. El del abogado es **A. Ruiz**, que no
 * es un nombre elegido ahora: ya figuraba como responsable de cuatro de los
 * doce expedientes de demostración. Entrar como A. Ruiz enseña justo esos
 * cuatro, porque el rol `abogado` no tiene `expedientes-todos` —«ver los
 * expedientes que tiene asignados», dice su ficha— y ahora el panel lo
 * cumple en vez de solo describirlo.
 *
 * ─── ESTO NO ES UNA SESIÓN, Y NO DEBE PARECERLO ─────────────────────────
 *
 * No hay contraseña, no hay comprobación y no hay nada que impida a nadie
 * abrir /admin directamente: hoy esa ruta está abierta. Poner un formulario
 * de acceso delante sería peor que no ponerlo, porque crearía la apariencia
 * de una protección que no existe.
 *
 * Así que esto se llama demostración en todas partes donde aparece: en el
 * botón que entra, en la cabecera del panel y en cada pantalla. El control de
 * acceso de verdad son las políticas de seguridad a nivel de fila de la base
 * de datos, que están escritas y no conectadas. Cuando lo estén, este archivo
 * se sustituye por la sesión real y `puede()` seguirá diciendo lo mismo.
 *
 * Los nombres son iniciales —«A. Ruiz»— y no identidades completas, igual que
 * el resto de datos de demostración y por el mismo motivo: no se inventan
 * profesionales con nombre y apellidos que parezcan reales.
 */

export interface UsuarioDemo {
  rol: Role;
  /** Coincide con el campo `responsable` de los expedientes de demostración. */
  nombre: string;
  puesto: string;
  /** Qué ve esta persona nada más entrar, en una frase. */
  resumen: string;
}

export const USUARIOS_DEMO: Record<Exclude<Role, "cliente">, UsuarioDemo> = {
  abogado: {
    rol: "abogado",
    nombre: "A. Ruiz",
    puesto: "Abogada de extranjería",
    resumen: "Sus cuatro expedientes asignados, con los plazos que corren en cada uno.",
  },
  gestor: {
    rol: "gestor",
    nombre: "L. Ortega",
    puesto: "Gestora de expedientes",
    resumen: "Todos los expedientes y su documentación, sin poder validar ni presentar.",
  },
  admin: {
    rol: "admin",
    nombre: "Dirección",
    puesto: "Administración de la cuenta",
    resumen: "Todo el despacho, salvo firmar: eso es del colegiado.",
  },
  paralegal: {
    rol: "paralegal",
    nombre: "Apoyo documental",
    puesto: "Paralegal",
    resumen: "Documentación y borradores de escritos, sin validación definitiva.",
  },
  comercial: {
    rol: "comercial",
    nombre: "Comercial",
    puesto: "Captación y consultas",
    resumen: "Leads y diagnósticos. Ni un solo documento migratorio.",
  },
};

/** El rol con el que se entra por defecto a la demostración del panel. */
export const ROL_DEMO_INICIAL: Role = "abogado";

/**
 * Nombre de la cookie que guarda el rol.
 *
 * Vive aquí y no en `lib/rol-demo.ts` porque aquel módulo importa
 * `next/headers`, que no existe en el navegador: la cabecera del panel es
 * un componente de cliente y necesita esta constante para escribirla. Con
 * la constante allí, el build entero fallaba al empaquetar el cliente.
 */
export const COOKIE_ROL = "es-rol-demo";
