import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import { Suspense } from "react";
import { CheckWizard } from "@/components/check/CheckWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/diagnostico",
    title: "Diagnóstico de Extranjería — Immigration Check",
    description:
      "Responde unas preguntas y descubre qué vías de extranjería pueden encajar con tu situación, qué documentación necesitas y qué habría que verificar. Gratis y sin registro.",
  });
}

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
