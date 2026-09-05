import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Abre tu expediente en Extranjería Segura y guarda el resultado de tu diagnóstico.",
  robots: { index: false, follow: false },
};

export default function CrearCuentaPage() {
  return (
    <AuthLayout
      side={{
        title: "Abre tu expediente en dos minutos.",
        points: [
          "Guardas el resultado de tu diagnóstico y lo retomas cuando quieras.",
          "Recibes la lista exacta de documentos para tu caso.",
          "Te avisamos antes de cada caducidad y de cada plazo.",
          "Crear la cuenta es gratis y no te compromete a contratar nada.",
        ],
      }}
    >
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
