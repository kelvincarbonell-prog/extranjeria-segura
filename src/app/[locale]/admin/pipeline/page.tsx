import { Pipeline } from "@/components/admin/Pipeline";
import { DEMO_EXPEDIENTES } from "@/content/demo";
import { plazoPrincipal } from "@/lib/vigilancia";

export const metadata = { title: "Pipeline" };

export default function PipelinePage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-ink-900 font-display text-[24px] leading-tight font-extrabold tracking-[-0.035em] md:text-[28px]">
          Pipeline
        </h1>
        <p className="text-ink-500 mt-1.5 text-[14.5px]">
          Del primer contacto a la resolución. Los plazos vencidos suben al principio.
        </p>
      </div>
      {/* El plazo se deriva aquí, en el servidor, y baja ya calculado. El
          tablero es un componente de cliente: si llamara él a `hoy()`, el
          servidor y el navegador podrían estar en días distintos durante la
          hidratación —y aunque `hoy()` trabaja en UTC y la ventana es de
          milisegundos, un panel de plazos no es sitio para esa apuesta. */}
      <Pipeline plazos={plazoPrincipal(DEMO_EXPEDIENTES)} />
    </div>
  );
}
