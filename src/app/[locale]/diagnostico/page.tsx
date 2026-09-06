import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckWizard } from "@/components/check/CheckWizard";

export const metadata: Metadata = {
  title: "Diagnóstico de Extranjería — Immigration Check",
  description:
    "Responde unas preguntas y descubre qué vías de extranjería pueden encajar con tu situación, qué documentación necesitas y qué habría que verificar. Gratis y sin registro.",
  alternates: { canonical: "/diagnostico" },
  robots: { index: true, follow: true },
};

export default function DiagnosticoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <span className="skeleton h-2 w-40" />
        </div>
      }
    >
      <CheckWizard />
    </Suspense>
  );
}
