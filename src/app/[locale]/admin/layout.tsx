import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { rolDemo } from "@/lib/rol-demo";
import { sesionDemo } from "@/lib/sesion-demo";
import { navPermitida } from "@/content/nav-admin";
import { DEMO_PIPELINE } from "@/content/demo";
import { filtrarAsignadosPorOwner } from "@/lib/mis-expedientes";
import type { Resultado } from "@/components/admin/Buscador";

export const metadata: Metadata = {
  title: "Panel interno",
  robots: { index: false, follow: false },
};

/**
 * EL PANEL NO SE PRERENDERIZA. NUNCA.
 *
 * Todas las pantallas de /admin salían del build como HTML estático, y con
 * ellas los días que faltan para cada plazo. Un panel de vigilancia servido
 * desde una copia congelada en la fecha de compilación dice «quedan 6 días»
 * durante semanas: es exactamente el fallo que `vigilancia.ts` viene a
 * eliminar —un número que envejece solo—, colado por la puerta de atrás del
 * renderizado.
 *
 * `force-dynamic` obliga a renderizar en cada petición. El coste es
 * irrelevante aquí: son siete pantallas internas con un puñado de registros,
 * no las 1.374 páginas públicas, que siguen siendo estáticas porque esto está
 * declarado en el layout de /admin y no más arriba.
 *
 * El día que los datos vengan de la base de datos en lugar de `demo.ts`, esta
 * línea seguirá haciendo falta por la misma razón.
 */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // El rol se resuelve aquí, en el servidor, y baja como prop. Así cada
  // pantalla puede filtrar antes de renderizar en lugar de esconder después.
  const [rol, sesion] = await Promise.all([rolDemo(), sesionDemo()]);

  /**
   * Lo que el buscador puede encontrar se decide aquí, en el servidor, y ya
   * recortado al rol. Si se filtrara en el navegador, el HTML llevaría los
   * expedientes que esa sesión no debe ver y bastaría con abrir el
   * inspector: el buscador se habría convertido en la puerta de atrás del
   * modelo de permisos.
   */
  const buscables: Resultado[] = [
    ...filtrarAsignadosPorOwner(DEMO_PIPELINE, rol).map((c) => ({
      id: c.id,
      titulo: c.client,
      detalle: `${c.reference} · ${c.tramite}`,
      href: "/admin/expedientes",
      glifo: "doc",
      grupo: "Expedientes" as const,
    })),
    ...navPermitida(rol).map((n) => ({
      id: `nav-${n.href}`,
      titulo: n.label,
      detalle: n.href,
      href: n.href,
      glifo: n.glyph,
      grupo: "Pantallas" as const,
    })),
  ];

  return (
    <AdminShell
      rol={rol}
      sesion={sesion && { nombre: sesion.nombre, email: sesion.email }}
      buscables={buscables}
    >
      {children}
    </AdminShell>
  );
}
