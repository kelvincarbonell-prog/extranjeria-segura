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
 * ─── HAY CONTRASEÑA, Y AUN ASÍ NO ES UNA SESIÓN ─────────────────────────
 *
 * Hay cuatro cuentas con contraseña y se comprueban en el servidor, pero eso
 * no las convierte en autenticación: /admin y /app siguen respondiendo a
 * cualquiera que escriba la URL sin entrar, y la contraseña está impresa en
 * la propia pantalla de acceso. La puerta existe para elegir con qué ojos se
 * mira el producto, no para guardar nada.
 *
 * Por eso se llama demostración en todas partes donde aparece: en la tarjeta
 * de credenciales, en la cabecera del panel y en cada pantalla. El control de
 * acceso de verdad son las políticas de seguridad a nivel de fila de la base
 * de datos, que están escritas y no conectadas. Cuando lo estén, estas
 * cuentas dejan de funcionar solas y `puede()` seguirá diciendo lo mismo.
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
  colaborador: {
    rol: "colaborador",
    // Nombre propio y distinto del comercial interno: comparten permisos pero
    // no son la misma persona, y el recorte a «lo mío» los separa por nombre.
    nombre: "Bufete asociado",
    puesto: "Colaborador externo",
    resumen: "Solo sus derivaciones, y nunca la documentación de ninguna.",
  },
};

/** El rol con el que se entra por defecto a la demostración del panel. */
export const ROL_DEMO_INICIAL: Role = "abogado";

/* ------------------------------------------------------------------ *
 * CUENTAS DE PRUEBA
 * ------------------------------------------------------------------ */

/**
 * LAS CUATRO CUENTAS CON LAS QUE SE PRUEBA EL PRODUCTO.
 *
 * Misma contraseña para las cuatro y escrita aquí en claro, a la vista de
 * cualquiera que abra el repositorio. Es deliberado, y conviene entender por
 * qué antes de tocarlo.
 *
 * ─── ESTO NO ES AUTENTICACIÓN ───────────────────────────────────────────
 *
 * Detrás no hay nada que proteger: los expedientes son inventados y /admin y
 * /app ya responden hoy a cualquiera que escriba la URL, sin entrar. Esta
 * puerta no guarda nada; sirve para elegir con qué ojos se mira el producto.
 *
 * Por eso la contraseña se **imprime en la propia pantalla de acceso**. Una
 * credencial de demostración escondida finge ser un secreto; una impresa al
 * lado del formulario no engaña a nadie, y esa diferencia es todo lo que
 * separa una demo honesta de un teatro de seguridad.
 *
 * ─── Y NO PUEDE CONVERTIRSE EN LA DE VERDAD ─────────────────────────────
 *
 * `sesion-demo.ts` solo acepta estas cuentas mientras `site.features.supabase`
 * es falso. En cuanto se configuren las variables de entorno de Supabase,
 * estas credenciales dejan de funcionar solas, sin que nadie tenga que
 * acordarse de borrarlas. Ese es el único mecanismo que evita que una
 * contraseña de juguete sobreviva hasta producción: no confiar en la memoria
 * de nadie.
 *
 * Las contraseñas no se comparan con `===` sino en tiempo constante, no
 * porque aquí importe —no hay secreto— sino para que el día que este archivo
 * se sustituya por cuentas reales, la forma que se copie sea la correcta.
 */
export interface CuentaDemo {
  email: string;
  contrasena: string;
  rol: Role;
  /** Nombre de la persona, no la etiqueta del rol. */
  nombre: string;
  puesto: string;
  /** A dónde se entra: el panel del despacho o el área del cliente. */
  destino: "/admin" | "/app";
  /** Qué se ve con esta cuenta, en una frase, para la pantalla de acceso. */
  queVe: string;
}

/** Igual en las cuatro. Se muestra en pantalla junto al formulario. */
export const CONTRASENA_DEMO = "password123";

export const CUENTAS_DEMO: CuentaDemo[] = [
  {
    email: "abogado@demo.es",
    contrasena: CONTRASENA_DEMO,
    rol: "abogado",
    nombre: "A. Ruiz",
    puesto: "Abogada de extranjería",
    destino: "/admin",
    queVe: "Sus cuatro expedientes asignados y los plazos que corren en cada uno. Firma y valida.",
  },
  {
    email: "admin@demo.es",
    contrasena: CONTRASENA_DEMO,
    rol: "admin",
    nombre: "Dirección",
    puesto: "Administración de la cuenta",
    destino: "/admin",
    queVe: "El despacho entero, el equipo y la cola de verificación. No firma: eso es del colegiado.",
  },
  {
    email: "colaborador@demo.es",
    contrasena: CONTRASENA_DEMO,
    rol: "colaborador",
    nombre: "Bufete asociado",
    puesto: "Colaborador externo",
    destino: "/admin",
    queVe: "Solo sus derivaciones. Ni un documento migratorio, ni un expediente de otro.",
  },
  {
    email: "cliente@demo.es",
    contrasena: CONTRASENA_DEMO,
    rol: "cliente",
    nombre: "María G.",
    puesto: "Arraigo sociolaboral · ES-2048",
    destino: "/app",
    queVe: "Su propio expediente: qué falta, en qué punto está y qué toca ahora.",
  },
];

/** Nombre de la cookie de sesión de demostración. */
export const COOKIE_SESION = "es-sesion-demo";

/**
 * Nombre de la cookie que guarda el rol.
 *
 * Vive aquí y no en `lib/rol-demo.ts` porque aquel módulo importa
 * `next/headers`, que no existe en el navegador: la cabecera del panel es
 * un componente de cliente y necesita esta constante para escribirla. Con
 * la constante allí, el build entero fallaba al empaquetar el cliente.
 */
export const COOKIE_ROL = "es-rol-demo";
