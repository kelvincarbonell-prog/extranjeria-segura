import type { Metadata } from "next";
import { Link } from "@/components/ui/Link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { CuentasDemo } from "@/components/auth/CuentasDemo";
import { Glyph } from "@/components/brand/Glyph";
import { LegalNote } from "@/components/ui/primitives";
import { demoDisponible } from "@/lib/sesion-demo";

export const metadata: Metadata = {
  title: "Recuperar el acceso",
  description: "Cómo recuperar el acceso a tu expediente de Extranjería Segura.",
  robots: { index: false, follow: false },
};

/**
 * RECUPERAR EL ACCESO.
 *
 * Esta página no existía y la pantalla de acceso llevaba enlazándola desde el
 * principio: «He olvidado mi contraseña» devolvía un 404. Lo encontró la
 * auditoría de enlaces al ampliarla a las rutas privadas —antes solo recorría
 * las públicas—, no una revisión del código.
 *
 * ─── POR QUÉ NO HAY FORMULARIO ──────────────────────────────────────────
 *
 * Lo natural sería poner una caja de correo y un botón «Enviar enlace». Sería
 * mentira: no hay proveedor de correo conectado, así que ese botón no enviaría
 * nada y la persona se quedaría mirando su bandeja de entrada. Quien ha
 * perdido el acceso a un expediente de extranjería no necesita una pantalla
 * que le dé esperanza, necesita saber qué hacer ahora.
 *
 * Cuando la autenticación real esté conectada, aquí va el formulario de
 * verdad, con la respuesta neutra de siempre —«si existe una cuenta con ese
 * correo, te llega un enlace»— para no convertirlo en un comprobador de
 * correos registrados.
 */
export default function RecuperarPage() {
  const demo = demoDisponible();

  return (
    <AuthLayout
      side={{
        title: "Perder la contraseña no es perder el expediente.",
        points: [
          "Tus documentos siguen donde estaban, validados y con su historial.",
          "Los plazos de tu expediente siguen corriendo y vigilados.",
          "Tu especialista sigue siendo el mismo y conserva el hilo.",
        ],
      }}
    >
      <h1 className="text-ink-900 font-display text-[30px] leading-tight font-extrabold tracking-[-0.038em]">
        Recuperar el acceso
      </h1>

      <div className="bg-signal-warn-soft ring-signal-warn/15 mt-6 flex gap-3 rounded-sm p-4 ring-1 ring-inset">
        <Glyph name="alert" className="text-signal-warn mt-0.5 size-4 shrink-0" />
        <div>
          <p className="text-signal-warn text-[13.5px] font-semibold">
            El envío de correos todavía no está conectado
          </p>
          <p className="text-ink-600 mt-1 text-[13px] leading-relaxed">
            No hay aquí un formulario que diga «te hemos enviado un enlace», porque no lo enviaría.
            Cuando la autenticación esté activa, este será el sitio donde pedirlo.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-ink-900 text-[15px] font-semibold">Mientras tanto</h2>
        <ul className="mt-2.5 flex flex-col gap-2.5">
          <Paso n={1}>
            Escribe a{" "}
            <a
              href="mailto:hola@extranjeriasegura.es"
              className="text-brand-600 hover:text-brand-800 underline underline-offset-2"
            >
              hola@extranjeriasegura.es
            </a>{" "}
            desde el correo con el que abriste el expediente. Te confirmamos la identidad antes de
            devolver ningún acceso.
          </Paso>
          <Paso n={2}>
            No mandes documentos ni tu número de pasaporte en ese correo. No hacen falta para
            recuperar el acceso, y un correo no es un sitio seguro para mandarlos.
          </Paso>
          <Paso n={3}>
            Si tienes un plazo corriendo, dilo en el asunto. Un requerimiento no espera a que se
            resuelva un problema de contraseña.
          </Paso>
        </ul>
      </div>

      {demo && <CuentasDemo />}

      <p className="text-ink-500 mt-7 text-center text-[14px]">
        <Link
          href="/entrar"
          className="text-brand-600 hover:text-brand-800 inline-block py-1 font-semibold"
        >
          Volver a la pantalla de acceso
        </Link>
      </p>

      <LegalNote className="mt-7">
        Nunca te pediremos la contraseña por teléfono, por correo ni por mensaje. Si alguien lo
        hace en nuestro nombre, no es nuestro.
      </LegalNote>
    </AuthLayout>
  );
}

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="bg-ink-950 data mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
        {n}
      </span>
      <span className="text-ink-600 text-[13.5px] leading-relaxed">{children}</span>
    </li>
  );
}
