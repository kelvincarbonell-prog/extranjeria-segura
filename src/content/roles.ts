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

export type Role = "admin" | "abogado" | "gestor" | "paralegal" | "comercial" | "cliente";

export interface RoleDefinition {
  id: Role;
  label: string;
  description: string;
  /** Capabilities, matching the policy names in the SQL migrations. */
  can: string[];
  cannot: string[];
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
  },
];

export const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<
  Role,
  RoleDefinition
>;
