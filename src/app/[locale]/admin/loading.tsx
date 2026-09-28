import { Cargando, HuesoCabecera, HuesoMetricas, HuesoLista } from "@/components/ui/Esqueleto";

/**
 * LO QUE SE VE MIENTRAS LLEGA EL PANEL.
 *
 * Esto no es decoración: es la razón por la que la navegación se va a sentir
 * instantánea.
 *
 * El panel entero es `force-dynamic` —los plazos se calculan en cada
 * petición—, y de una ruta dinámica Next no puede precargar el contenido,
 * solo su capa de carga. Sin un `loading.tsx` no hay capa que precargar, así
 * que al pulsar un enlace **no pasa absolutamente nada** hasta que el
 * servidor responde: la pantalla anterior se queda quieta y parece que el
 * clic no ha funcionado. Medido antes de esto: durante la espera seguía el
 * H1 de la pantalla anterior y no había ninguna señal de carga en el DOM.
 *
 * Con este archivo, Next se trae el esqueleto al pasar el ratón o al entrar
 * el enlace en pantalla, y al pulsar lo pinta en el mismo fotograma. El
 * tiempo del servidor no cambia ni un milisegundo; lo que cambia es que deja
 * de ser tiempo en blanco.
 */
export default function CargandoPanel() {
  return (
    <Cargando etiqueta="Cargando el panel" className="mx-auto flex max-w-7xl flex-col gap-5">
      <HuesoCabecera />
      <HuesoMetricas />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <HuesoLista filas={5} />
        <HuesoLista filas={4} />
      </div>
    </Cargando>
  );
}
