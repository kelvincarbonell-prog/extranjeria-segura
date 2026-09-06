import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
