import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { DemoBanner } from "@/components/app/DemoBanner";

export const metadata: Metadata = {
  title: "Mi expediente",
  robots: { index: false, follow: false },
};

/**
 * Dinámica por la misma razón que el panel: los datos de demostración se
 * sitúan respecto a hoy, y una página prerenderizada congela «hoy» en el día
 * del build. A las dos semanas, la «próxima cita» ya habría pasado.
 */
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <DemoBanner />
      <div id="contenido">{children}</div>
    </AppShell>
  );
}
