/**
 * ROLES AND PERMISSIONS.
 *
 * This is the source of truth for what each role can see, and it mirrors the
 * Row Level Security policies in supabase/migrations. The UI hides what a role
 * cannot access, but the database is what actually enforces it — hiding a
 * button is not a security control.
 *
 * The design principle is least privilege on immigration documents: a
 * commercial profile can work a lead without ever seeing a passport.
 */

export type Role =
  | "admin"
  | "abogado"
  | "gestor"
  | "paralegal"
  | "comercial"
  | "colaborador"
  | "cliente";

/**
 * PERMISOS, EN FORMA DE DATO.
 *
 * `can` y `cannot` son prosa: sirven para que una persona entienda el rol en
 * /admin/equipo, y no hay forma de preguntarle a una frase si autoriza algo.
 * Por eso el panel no comprobaba nada. El selector «Ver como» llevaba desde
 * el principio un comentario que prometía que cambiar a «comercial» retiraba
 * los documentos migratorios de la vista, y no lo hacía: nadie consumía el
 * contexto. Cambiaba el nombre del avatar.
 *
 * Estos permisos son la misma lista, en un formato que el código puede
 * comprobar. Las dos versiones tienen que decir lo mismo, y de eso se ocupa
 * `roles.test.ts`.
 */
export type Permiso =
  /** Gestionar el equipo y los roles. */
  | "equipo"
  /** Precios, plantillas y automatizaciones. */
  | "configuracion"
  /** Ver todos los expedientes, no solo los asignados. */
  | "expedientes-todos"
  /** Ver documentación migratoria: pasaportes, antecedentes, salud. */
  | "documentos"
  /** Dar un documento por válido de forma definitiva. */
  | "validar-documentos"
  /** Firmar y presentar el expediente. */
  | "firmar"
  /** Redactar recursos y escritos. */
  | "escritos"
  /** Comunicarse con la Administración. */
  | "administracion"
  /** Trabajar leads, diagnósticos y presupuestos. */
  | "leads"
  /** Cola de revisión jurídica del contenido publicado. */
  | "verificacion";

export interface RoleDefinition {
  id: Role;
  label: string;
  description: string;
  /** Capabilities, matching the policy names in the SQL migrations. */
  can: string[];
  cannot: string[];
  /** La misma lista que `can`, comprobable. Vacía en `cliente`: no entra al panel. */
  permisos: Permiso[];
}

export const ROLES: RoleDefinition[] = [
  {
    id: "admin",
    label: "Administrador",
    description: "Configuración, equipo, facturación y acceso completo.",
    can: [
      "Gestionar el equipo y los roles",
      "Ver todos los expedientes y documentos",
      "Configurar precios, plantillas y automatizaciones",
      "Consultar el registro de auditoría completo",
    ],
    cannot: ["Firmar expedientes: eso corresponde al profesional responsable"],
    // Lo ve y lo configura todo, pero no firma ni valida: esa
    // responsabilidad es del colegiado, no de quien administra la cuenta.
    permisos: ["equipo", "configuracion", "expedientes-todos", "documentos", "leads", "verificacion"],
  },
  {
    id: "abogado",
    label: "Abogado",
    description: "Responsable jurídico. Valida documentos y firma expedientes.",
    can: [
      "Validar o rechazar documentos",
      "Firmar y presentar expedientes",
      "Redactar recursos y escritos",
      "Ver los expedientes que tiene asignados",
    ],
    cannot: ["Modificar precios o configuración de la plataforma"],
    // Sin `expedientes-todos`: ve los que tiene asignados. Es el único rol
    // que firma y el único que valida un documento de forma definitiva.
    permisos: [
      "documentos",
      "validar-documentos",
      "firmar",
      "escritos",
      "administracion",
      "verificacion",
    ],
  },
  {
    id: "gestor",
    label: "Gestor",
    description: "Lleva el día a día del expediente y la relación con el cliente.",
    can: [
      "Gestionar la documentación del expediente",
      "Comunicarse con el cliente",
      "Preparar el expediente para la firma del abogado",
      "Gestionar citas y plazos",
    ],
    cannot: ["Dar por validado un documento sin revisión del abogado", "Presentar expedientes"],
    // Se comunica con el cliente, no con la Administración: eso último lo
    // hace quien firma.
    permisos: ["expedientes-todos", "documentos"],
  },
  {
    id: "paralegal",
    label: "Paralegal",
    description: "Apoyo documental y preparación de expedientes.",
    can: [
      "Revisar documentación en primera instancia",
      "Preparar borradores de escritos",
      "Marcar incidencias en documentos",
    ],
    cannot: ["Validar documentos definitivamente", "Comunicarse con la Administración"],
    // Prepara borradores; el escrito sale con la firma del abogado.
    permisos: ["documentos", "escritos"],
  },
  {
    id: "comercial",
    label: "Comercial",
    description: "Trabaja leads y consultas hasta la contratación.",
    can: [
      "Ver y trabajar leads y diagnósticos",
      "Agendar consultas iniciales",
      "Enviar presupuestos",
    ],
    cannot: [
      "Acceder a documentación migratoria de expedientes contratados",
      "Ver pasaportes, antecedentes ni datos de salud",
    ],
    // Sin `documentos`, y ese es el permiso que más importa de esta tabla:
    // un perfil comercial trabaja un lead entero sin ver un pasaporte.
    permisos: ["leads"],
  },
  {
    id: "colaborador",
    label: "Colaborador externo",
    description: "Profesional o despacho de fuera que deriva clientes y sigue sus derivaciones.",
    can: [
      "Ver y trabajar sus propias derivaciones",
      "Consultar en qué fase está cada caso que ha derivado",
      "Agendar consultas iniciales",
    ],
    cannot: [
      "Ver derivaciones de otros colaboradores",
      "Acceder a documentación migratoria de ningún expediente",
      "Ver pasaportes, antecedentes ni datos de salud",
    ],
    // Mismos permisos que el comercial, y a propósito: la diferencia no es de
    // capacidades sino de a quién responde. Un comercial es del despacho; un
    // colaborador está fuera de él, así que el criterio de mínimo privilegio
    // pesa todavía más. Sin `documentos` no ve un solo pasaporte, y sin
    // `expedientes-todos` solo alcanza lo que él mismo ha derivado.
    permisos: ["leads"],
  },
  {
    id: "cliente",
    label: "Cliente",
    description: "Acceso exclusivo a su propio expediente.",
    can: [
      "Ver y gestionar su expediente",
      "Subir y descargar sus documentos",
      "Comunicarse con su especialista",
      "Ejercer sus derechos RGPD",
    ],
    cannot: ["Acceder a ningún dato de otro cliente"],
    // El cliente no entra al panel interno: su sitio es /app.
    permisos: [],
  },
];

export const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<
  Role,
  RoleDefinition
>;

/**
 * ¿Este rol tiene este permiso?
 *
 * Con una advertencia que no es retórica: esto decide qué se **enseña**, no
 * qué se puede hacer. Ocultar una pantalla no protege un pasaporte; lo
 * protege la política de seguridad a nivel de fila, que vive en la base de
 * datos y hoy no está conectada. Mientras no lo esté, el panel es una
 * demostración del modelo de permisos, no un control de acceso, y así se dice
 * en pantalla en lugar de dejar creer lo contrario.
 */
export function puede(role: Role, permiso: Permiso): boolean {
  return ROLE_MAP[role].permisos.includes(permiso);
}
