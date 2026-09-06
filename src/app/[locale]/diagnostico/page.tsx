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
    // El destino del enlace «saltar al contenido» va aquí y no dentro del
    // asistente. El asistente lee sus respuestas de `sessionStorage`, que el
    // servidor no ve, así que en el HTML servido todavía está la puerta de
    // carga: un id declarado dentro solo existiría después de hidratar, y
    // quien navega con teclado pulsa el enlace antes de eso.
    <div id="contenido">
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center">
            <span className="skeleton h-2 w-40" />
          </div>
        }
      >
        <CheckWizard />
      </Suspense>
    </div>
  );
}
