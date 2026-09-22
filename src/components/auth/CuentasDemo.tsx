import { CUENTAS_DEMO, CONTRASENA_DEMO } from "@/content/demo-sesion";
import { ROLE_MAP } from "@/content/roles";
import { Glyph } from "@/components/brand/Glyph";

/**
 * LAS CREDENCIALES, IMPRESAS AL LADO DEL FORMULARIO.
 *
 * Una contraseña de demostración escondida finge ser un secreto. Escrita aquí
 * no engaña a nadie, y esa es exactamente la diferencia entre una demo
 * honesta y un teatro de seguridad: detrás de esta puerta no hay nada que
 * proteger —expedientes inventados— y /admin y /app ya responden hoy sin
 * entrar. Sirve para elegir con qué ojos se mira el producto, no para guardar
 * nada.
 *
 * Y dice qué ve cada cuenta, porque sin eso hay que entrar cuatro veces para
 * descubrir en qué se diferencian.
 */
export function CuentasDemo() {
  return (
    <section
      aria-labelledby="cuentas-demo"
      className="bg-canvas-deep ring-ink-900/[.06] mt-8 rounded-lg p-5 ring-1 ring-inset"
    >
      <div className="flex gap-3">
        <Glyph name="door" className="text-ink-400 mt-0.5 size-4 shrink-0" />
        <div className="min-w-0">
          <h2 id="cuentas-demo" className="text-ink-900 text-[14px] font-semibold">
            Cuentas de prueba
          </h2>
          <p className="text-ink-500 mt-1 text-[12.5px] leading-relaxed">
            Contraseña <code className="data text-ink-800 font-semibold">{CONTRASENA_DEMO}</code> en
            las cuatro. Los datos son inventados y no hay nada real detrás; estas credenciales
            dejan de funcionar solas en cuanto se configure la autenticación de verdad.
          </p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {CUENTAS_DEMO.map((c) => (
          <li
            key={c.email}
            className="bg-surface ring-ink-900/[.06] rounded-md p-3.5 ring-1 ring-inset"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <code className="data text-ink-900 text-[12.5px] font-semibold">{c.email}</code>
              <span className="text-ink-400 text-[11.5px]">
                {ROLE_MAP[c.rol].label} · {c.nombre}
              </span>
            </div>
            <p className="text-ink-500 mt-1 text-[12px] leading-relaxed">{c.queVe}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
