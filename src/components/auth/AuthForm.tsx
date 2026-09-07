"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Divider, LegalNote } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Auth form.
 *
 * Validation runs client-side for feedback only — the Supabase client re-runs
 * it and the database enforces the real constraints. Password strength is
 * shown as a bar because "must contain a symbol" rules produce worse passwords
 * than length does.
 */

const signInSchema = z.object({
  email: z.string().email("Introduce un correo electrónico válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Dinos cómo te llamas"),
  password: z.string().min(10, "Usa al menos 10 caracteres. La longitud protege más que los símbolos."),
  terms: z.literal(true, { message: "Necesitamos tu aceptación para poder abrir tu expediente" }),
});

type Mode = "signin" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: "",
    terms: false,
    marketing: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "loading" | "unavailable">("idle");
  const [showPassword, setShowPassword] = React.useState(false);

  const strength = passwordStrength(values.password);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === "signup" ? signUpSchema : signInSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[String(issue.path[0])] = issue.message;
      }
      setErrors(map);
      return;
    }

    setErrors({});
    setStatus("loading");

    // Supabase auth is implemented in lib/supabase but not enabled in this
    // environment. We say so rather than faking a session.
    window.setTimeout(() => setStatus(site.features.supabase ? "idle" : "unavailable"), 700);
  };

  return (
    <div>
      <h1 className="text-ink-900 font-display text-[30px] leading-tight font-extrabold tracking-[-0.038em]">
        {mode === "signin" ? "Accede a tu expediente" : "Crea tu cuenta"}
      </h1>
      <p className="text-ink-500 mt-2.5 text-[15px] leading-relaxed">
        {mode === "signin"
          ? "Entra para ver en qué punto está tu expediente y qué falta."
          : "Abre tu expediente y guarda el resultado de tu diagnóstico."}
      </p>

      <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-4">
        {mode === "signup" && (
          <Field
            id="name"
            label="Nombre"
            autoComplete="given-name"
            value={values.name}
            error={errors.name}
            onChange={(v) => setValues((s) => ({ ...s, name: v }))}
          />
        )}

        <Field
          id="email"
          type="email"
          label="Correo electrónico"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        />

        <div>
          <Field
            id="password"
            type={showPassword ? "text" : "password"}
            label="Contraseña"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={values.password}
            error={errors.password}
            onChange={(v) => setValues((s) => ({ ...s, password: v }))}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-ink-400 hover:text-ink-700 tap inline-block text-[12.5px] font-medium transition-colors"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            }
          />

          {mode === "signup" && values.password.length > 0 && (
            <div className="mt-2.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300",
                      i < strength.score
                        ? strength.score <= 1
                          ? "bg-signal-risk"
                          : strength.score === 2
                            ? "bg-signal-warn"
                            : "bg-signal-ok"
                        : "bg-ink-100",
                    )}
                  />
                ))}
              </div>
              <p className="text-ink-400 mt-1.5 text-[12px]">{strength.label}</p>
            </div>
          )}
        </div>

        {mode === "signin" && (
          <div className="flex justify-end">
            <Link
              href="/recuperar"
              className="text-ink-500 hover:text-ink-900 tap inline-block text-[13px] transition-colors"
            >
              He olvidado mi contraseña
            </Link>
          </div>
        )}

        {mode === "signup" && (
          <div className="flex flex-col gap-3">
            <Checkbox
              id="terms"
              checked={values.terms}
              error={errors.terms}
              onChange={(v) => setValues((s) => ({ ...s, terms: v }))}
            >
              He leído y acepto el aviso legal, las condiciones de contratación y la política de
              privacidad.
            </Checkbox>
            <DocumentosLegales />
            <Checkbox
              id="marketing"
              checked={values.marketing}
              onChange={(v) => setValues((s) => ({ ...s, marketing: v }))}
            >
              Quiero recibir novedades sobre cambios normativos que puedan afectarme.{" "}
              <span className="text-ink-400">Opcional, y puedes retirarlo cuando quieras.</span>
            </Checkbox>
          </div>
        )}

        <Button type="submit" size="lg" block loading={status === "loading"} className="mt-1">
          {mode === "signin" ? "Entrar" : "Crear mi cuenta"}
        </Button>

        <AnimatePresence>
          {status === "unavailable" && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-signal-warn-soft ring-signal-warn/15 flex gap-3 rounded-sm p-4 ring-1 ring-inset">
                <Glyph name="alert" className="text-signal-warn mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-signal-warn text-[13.5px] font-semibold">
                    Autenticación no activada en este entorno
                  </p>
                  <p className="text-ink-600 mt-1 text-[13px] leading-relaxed">
                    El cliente de Supabase, el esquema de base de datos y las políticas de seguridad
                    están implementados. Falta configurar las variables de entorno del proyecto para
                    activarlo. Mientras tanto puedes recorrer el área privada en modo demostración.
                  </p>
                  <Link
                    href="/app"
                    className="text-brand-700 mt-2.5 inline-block text-[13px] font-semibold"
                  >
                    Ver el área privada en modo demostración →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <Divider label="o" className="my-7" />

      <p className="text-ink-500 text-center text-[14px]">
        {mode === "signin" ? (
          <>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/crear-cuenta" className="text-brand-600 tap inline-block font-semibold hover:underline">
              Créala aquí
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/entrar" className="text-brand-600 tap inline-block font-semibold hover:underline">
              Accede
            </Link>
          </>
        )}
      </p>

      <LegalNote className="mt-7">
        Tu cuenta da acceso a documentación de identidad. Usa una contraseña que no reutilices en
        ningún otro sitio y activa la verificación en dos pasos en cuanto entres.
      </LegalNote>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  type = "text",
  value,
  error,
  onChange,
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-ink-700 text-[13px] font-medium">
          {label}
        </label>
        {trailing}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-surface text-ink-900 h-12 w-full rounded-sm px-4 text-[15px] outline-none transition-shadow",
          error
            ? "shadow-[inset_0_0_0_1.5px_rgb(179_38_30_/_0.5)]"
            : "shadow-[inset_0_0_0_1px_rgb(10_13_22_/_0.09)] focus:shadow-[inset_0_0_0_1.5px_rgb(36_56_232_/_0.55)]",
        )}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-signal-risk mt-1.5 text-[12.5px]">
          {error}
        </p>
      )}
    </div>
  );
}

const LEGALES = [
  { href: "/legal/aviso-legal", texto: "Aviso legal" },
  { href: "/legal/condiciones", texto: "Condiciones de contratación" },
  { href: "/legal/privacidad", texto: "Política de privacidad" },
] as const;

/**
 * LOS TRES DOCUMENTOS, FUERA DE LA ETIQUETA Y EN PESTAÑA NUEVA.
 *
 * Estos enlaces vivían dentro del texto de la casilla de consentimiento, y
 * eso rompía la pantalla de tres formas distintas a la vez:
 *
 * 1. LOS ENLACES ROBABAN EL TOQUE. Llevaban la utilidad `tap`, que en puntero
 *    grueso añade 8 px de relleno arriba y abajo, e `inline-block`, que
 *    convierte ese relleno en zona táctil real. Resultado medido en un móvil
 *    de 390 px: cajas de 37,1 px dentro de líneas de 24 px. «aviso legal»
 *    ocupaba de 511 a 548 y «condiciones de contratación» de 532 a 569 — se
 *    solapaban entre sí 16 px y ambos tapaban la línea vecina. Tocar las
 *    palabras «He leído y acepto el» activaba el enlace de la línea de abajo
 *    y te sacaba de la pantalla. No era un fallo teórico: es lo que le pasaba
 *    a cualquiera que intentase marcar la casilla.
 *
 *    WCAG 2.5.8 exime expresamente a los enlaces incrustados en un texto
 *    corrido del mínimo de 24×24 px. `tap` ahí no hacía falta y hacía daño.
 *
 * 2. ERAN CONTENIDO INTERACTIVO DENTRO DE UN `<label>`. La especificación de
 *    HTML lo prohíbe, y los navegadores hacen las dos cosas: navegan y de
 *    paso marcan la casilla. Nadie da un consentimiento a propósito así.
 *
 * 3. LEER LAS CONDICIONES COSTABA EL FORMULARIO. Al navegar se perdían el
 *    nombre, el correo y la contraseña ya escritos. Eso no es una molestia:
 *    es lo que enseña a la gente a aceptar sin leer, en el formulario que
 *    precede a subir un pasaporte.
 *
 * Por eso se abren en pestaña nueva y no se «guarda y restaura» el
 * formulario: guardarlo significaría escribir una contraseña en
 * `sessionStorage`, que es un fallo de seguridad de verdad a cambio de una
 * comodidad. La pestaña nueva deja la contraseña donde está, en memoria.
 */
function DocumentosLegales() {
  // Sin `tap` y con relleno propio: estos enlaces se ajustan a dos filas en una
  // pantalla estrecha, y el margen negativo de `tap` se comía la separación
  // entre ellas —7 px de solape medidos—. Aquí el alto sale de relleno de
  // verdad, que sí reserva su espacio.
  return (
    <ul className="ml-[30px] flex flex-wrap gap-x-4 gap-y-1.5">
      {LEGALES.map((d) => (
        <li key={d.href}>
          <Link
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-800 inline-flex items-center gap-1 py-1 text-[12.5px] underline underline-offset-2 transition-colors"
          >
            {d.texto}
            <svg viewBox="0 0 12 12" width="9" height="9" fill="none" aria-hidden="true">
              <path
                d="M4 2h6v6M10 2 2.5 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* WCAG 3.2.5: avisar de que se abre fuera. La flecha lo dice para
                quien ve; esto lo dice para quien escucha. */}
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * `children` debe ser texto, nunca enlaces ni botones: un `<label>` con
 * contenido interactivo dentro navega y marca la casilla en el mismo toque.
 * Es lo que rompía el consentimiento de alta —ver `DocumentosLegales`—.
 */
function Checkbox({
  id,
  checked,
  onChange,
  children,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex size-[18px] shrink-0">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={Boolean(error)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "flex size-[18px] items-center justify-center rounded-[5px] transition-colors",
              checked ? "bg-brand-600" : "bg-surface shadow-[inset_0_0_0_1.5px_rgb(10_13_22_/_0.16)]",
              error && !checked && "shadow-[inset_0_0_0_1.5px_rgb(179_38_30_/_0.5)]",
              "peer-focus-visible:ring-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
            )}
          >
            {checked && (
              <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden>
                <path
                  d="m3.5 8.4 3 3 6-6.6"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </span>
        <span className="text-ink-600 text-[13px] leading-relaxed">{children}</span>
      </label>
      {error && (
        <p role="alert" className="text-signal-risk mt-1.5 ml-[30px] text-[12.5px]">
          {error}
        </p>
      )}
    </div>
  );
}

function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 10) score++;
  if (pw.length >= 14) score++;
  if (/[^A-Za-z0-9]/.test(pw) || /\d/.test(pw)) score++;
  if (pw.length >= 20) score++;
  const labels = [
    "Demasiado corta. Diez caracteres es el mínimo.",
    "Justa. Una frase de varias palabras es más segura y más fácil de recordar.",
    "Aceptable.",
    "Buena.",
    "Excelente.",
  ];
  return { score, label: labels[score] };
}
