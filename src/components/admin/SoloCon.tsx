import { Link } from "@/components/ui/Link";
import { Glyph } from "@/components/brand/Glyph";
import { Card } from "@/components/ui/primitives";
import { ROLE_MAP, ROLES, puede, type Permiso } from "@/content/roles";
import { USUARIOS_DEMO } from "@/content/demo-sesion";
import { rolDemo } from "@/lib/rol-demo";
import type { Role } from "@/content/roles";

/**
 * PUERTA DE PANTALLA POR PERMISO, EN EL SERVIDOR.
 *
 * Filtrar la navegación no basta: la entrada del menú desaparece pero la URL
 * sigue respondiendo, y en un panel interno la gente comparte URLs.
 *
 * Es un componente de servidor a propósito. Como puerta de cliente habría
 * quedado un telón: el servidor mandaba los expedientes en el HTML y React
 * pintaba una tarjeta por encima. Aquí los hijos ni se renderizan, así que el
 * dato no sale del servidor.
 *
 * ─── LO QUE SIGUE SIN SER ───────────────────────────────────────────────
 *
 * Un control de acceso. El rol vive en una cookie que escribe el propio
 * navegador, así que cambiarla es trivial. Lo que de verdad impedirá que un
 * perfil comercial lea un pasaporte son las políticas de seguridad a nivel de
 * fila, que están escritas y todavía no conectadas. Esto demuestra el modelo
 * con la *forma* correcta —la decisión en el servidor, el dato sin viajar—
 * para que el día que haya sesión real solo cambie de dónde sale el rol.
 *
 * El aviso de la cabecera lo dice en todas las pantallas, y no en un pie que
 * nadie lee.
 */
export async function SoloCon({
  permiso,
  children,
}: {
  permiso: Permiso;
  children: React.ReactNode;
}) {
  const rol = await rolDemo();
  if (puede(rol, permiso)) return <>{children}</>;
  return <SinPermiso rol={rol} permiso={permiso} />;
}

function SinPermiso({ rol, permiso }: { rol: Role; permiso: Permiso }) {
  const usuario = USUARIOS_DEMO[rol as Exclude<Role, "cliente">];
  const mio = ROLE_MAP[rol];
  const quienes = ROLES.filter((r) => r.permisos.includes(permiso));

  return (
    <div className="mx-auto max-w-2xl">
      <Card padding="lg">
        <span className="bg-ink-50 text-ink-500 flex size-11 items-center justify-center rounded-[13px]">
          <Glyph name="shield" className="size-5" />
        </span>

        <h1 className="text-ink-900 font-display mt-4 text-[20px] font-extrabold tracking-[-0.03em]">
          Esta pantalla no corresponde a tu rol
        </h1>

        {/* Una explicación, no un «acceso denegado». Un panel interno lo usan
            compañeros, y un compañero que se topa con un muro sin salida
            escribe a alguien para que se lo abra: eso es una interrupción que
            se evita diciéndole qué rol hace falta y qué sí puede hacer él. */}
        <p className="text-ink-600 mt-2 text-[14px] leading-relaxed">
          Estás viendo el panel como <strong>{usuario.nombre}</strong>, con el rol{" "}
          <strong>{mio.label.toLowerCase()}</strong>. {mio.description}
        </p>

        <div className="border-ink-100 mt-5 border-t pt-5">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Quién sí entra aquí
          </p>
          <p className="text-ink-700 mt-1.5 text-[13.5px]">
            {quienes.length > 0
              ? quienes.map((r) => r.label).join(", ")
              : "Ningún rol tiene este permiso todavía."}
          </p>
        </div>

        <div className="border-ink-100 mt-5 border-t pt-5">
          <p className="text-ink-400 text-[11px] font-bold tracking-[0.11em] uppercase">
            Lo que sí puedes hacer
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {mio.can.map((c) => (
              <li key={c} className="text-ink-600 flex gap-2.5 text-[13.5px] leading-snug">
                <span className="bg-signal-ok mt-1.5 size-1 shrink-0 rounded-full" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-ink-400 mt-5 text-[12.5px] leading-relaxed">
          Para ver esta pantalla, cambia el rol en «Ver como», arriba a la derecha. En la
          demostración el selector está abierto; con la sesión real conectada, el rol lo asigna
          quien administra la cuenta y no se cambia desde aquí.
        </p>

        <Link
          href="/admin"
          // `py-1` y no `tap`: es el único enlace de la tarjeta, así que
          // nada hay encima ni debajo que pueda pisarse, y el relleno de
          // verdad reserva su espacio. Sin él medía 21 px de alto —por debajo
          // del mínimo de 24×24 de WCAG 2.5.8— y lo cazó `audit:movil`.
          className="text-brand-600 hover:text-brand-800 mt-5 inline-flex items-center gap-1.5 py-1 text-[14px] font-semibold"
        >
          Volver al panel
          <span aria-hidden="true">→</span>
        </Link>
      </Card>
    </div>
  );
}
