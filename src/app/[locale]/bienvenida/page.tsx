import type { Metadata } from "next";
import { Onboarding } from "@/components/app/Onboarding";

export const metadata: Metadata = {
  title: "Bienvenido",
  robots: { index: false, follow: false },
};

export default function BienvenidaPage() {
  return <Onboarding />;
}
