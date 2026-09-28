import { Cargando, HuesoCabecera, HuesoLista } from "@/components/ui/Esqueleto";

export default function Cargandocuenta() {
  return (
    <Cargando etiqueta="Cargando" className="mx-auto flex max-w-7xl flex-col gap-5">
      <HuesoCabecera />
      <HuesoLista filas={5} />
      <HuesoLista filas={3} />
    </Cargando>
  );
}
