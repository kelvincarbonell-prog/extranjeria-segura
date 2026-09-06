import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Acceder",
  description: "Accede a tu expediente de Extranjería Segura.",
  robots: { index: false, follow: false },
};

export default function EntrarPage() {
  return (
    <AuthLayout
      side={{
        title: "Tu expediente, siempre en el mismo sitio.",
        points: [
          "Sabes en qué fase está y qué falta, sin tener que preguntar.",
          "Subes cada documento una sola vez y te decimos si sirve.",
          "Hablas con tu especialista en el mismo hilo del expediente.",
          "Descargas tus facturas y exportas tus datos cuando quieras.",
        ],
      }}
    >
      <AuthForm mode="signin" />
    </AuthLayout>
  );
}
