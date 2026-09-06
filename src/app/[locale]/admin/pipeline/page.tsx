import { Pipeline } from "@/components/admin/Pipeline";

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
      <Pipeline />
    </div>
  );
}
