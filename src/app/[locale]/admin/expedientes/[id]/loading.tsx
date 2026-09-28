import { Cargando, Hueso, HuesoLista } from "@/components/ui/Esqueleto";

/**
 * La ficha tiene su propio esqueleto. Sin él heredaría el de la lista —una
 * tabla— y al llegar la ficha la pantalla entera cambiaría de forma, que es
 * justo el salto que un esqueleto existe para evitar.
 */
export default function CargandoFicha() {
  return (
    <Cargando etiqueta="Cargando el expediente" className="mx-auto flex max-w-6xl flex-col gap-5">
      <Hueso className="h-4 w-24" />
      <div className="flex flex-col gap-2">
        <Hueso className="h-3.5 w-28" />
        <Hueso className="h-8 w-56" />
        <Hueso className="h-4 w-44" />
      </div>
      <div className="bg-ink-100 rounded-lg p-5 md:p-6">
        <Hueso className="h-3 w-24" />
        <Hueso className="mt-3 h-5 w-full max-w-lg" />
        <Hueso className="mt-2 h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <HuesoLista filas={2} />
          <HuesoLista filas={5} />
        </div>
        <HuesoLista filas={4} />
      </div>
    </Cargando>
  );
}
