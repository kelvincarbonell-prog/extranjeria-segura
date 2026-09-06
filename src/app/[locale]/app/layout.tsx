import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { DemoBanner } from "@/components/app/DemoBanner";

export const metadata: Metadata = {
  title: "Mi expediente",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <DemoBanner />
      <div id="contenido">{children}</div>
    </AppShell>
  );
}
