import { Recordatorios } from "@/components/admin/Recordatorios";
import { SoloCon } from "@/components/admin/SoloCon";
import { expedientesDemo } from "@/content/demo";
import { filtrarAsignados } from "@/lib/mis-expedientes";
import { rolDemo } from "@/lib/rol-demo";
import { plazosDe } from "@/lib/vigilancia";
import { pendientesDelCliente } from "@/lib/ficha-expediente";

export const metadata = { title: "Avisos" };

async function RecordatoriosPageInterior({ inicial }: { inicial?: string }) {
  const mios = filtrarAsignados(expedientesDemo(), await rolDemo());

  /**
   * Lo que se reclama sale del expediente, no de una lista aparte.
   *
   * Esta pantalla tenía su propia tabla escrita a mano y no coincidía con
   * nada: a Wei L. le reclamaba «últimas tres nóminas», que su trámite ni
   * pide, mientras la ficha decía que faltaba la vida laboral. Dos fuentes
   * para el mismo dato son dos respuestas, y la que llega al cliente era la
   * equivocada.
   *
   * El recorte por rol va sobre la propia lista —solo `mios`—, así que el
   * abogado no ve lo que se le pide al cliente de una compañera.
   */
  const conPendientes = mios
    // Solo expedientes con la fase documental abierta. A un lead que todavía
    // no ha contratado no se le reclaman seis documentos: se le contesta, que
    // es otra conversación y la lleva otra persona.
    .filter((exp) => exp.documentos !== undefined)
    .map((exp) => {
      const plazos = plazosDe(exp);
      // Del plazo se usa el que sigue abierto: al cliente no se le escribe
      // «tienes 0 días», se le escribe cuándo es la próxima fecha que importa.
      const vivo = plazos.find((x) => x.cuenta.estado !== "vencido");
      return {
        id: exp.id,
        referencia: exp.referencia,
        cliente: exp.cliente,
        tramite: exp.tramite,
        idioma: exp.idioma ?? "es",
        documentos: pendientesDelCliente(exp),
        plazo: vivo,
      };
    })
    .filter((e) => e.documentos.length > 0)
    // Primero quien más lleva esperando: es a quien más urge escribir.
    .sort((a, b) => espera(b.documentos) - espera(a.documentos));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-ink-950 font-display text-[26px] font-extrabold tracking-[-0.03em]">
            Avisos
          </h1>
          <p className="text-ink-600 mt-2 max-w-2xl text-[15px] leading-relaxed">
            Qué documento falta en cada expediente, desde cuándo, y el mensaje ya escrito en el
            idioma del cliente. El plazo que aparece es el mismo que calcula la torre de plazos.
          </p>
        </div>
      </header>

      <Recordatorios key={inicial ?? ""} expedientes={conPendientes} inicial={inicial} />
    </div>
  );
}

/** La pantalla solo se renderiza si el rol activo tiene «documentos». */
export default async function RecordatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ exp?: string }>;
}) {
  const { exp } = await searchParams;
  return (
    <SoloCon permiso="documentos">
      <RecordatoriosPageInterior inicial={exp} />
    </SoloCon>
  );
}

function espera(docs: { desdeDias?: number }[]): number {
  return Math.max(0, ...docs.map((d) => d.desdeDias ?? 0));
}
