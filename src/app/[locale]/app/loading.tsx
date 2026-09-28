import { Cargando, HuesoCabecera, HuesoTarjeta, HuesoLista } from "@/components/ui/Esqueleto";

/**
 * CAPA DE CARGA DEL ÁREA DE CLIENTE.
 *
 * Hoy solo `/app/perfil` es dinámica —lee la sesión—; las demás pantallas se
 * prerenderizan y llegan sin espera. Aun así la capa va en el segmento padre,
 * no en `perfil/`, por una razón concreta: en cuanto haya una sesión de
 * verdad, TODAS estas pantallas pasan a ser dinámicas a la vez. Ponerla aquí
 * es escribir hoy lo que hará falta el día que se conecte la base de datos, y
 * no cuesta nada mientras tanto: una capa de carga de una ruta estática
 * sencillamente no se usa.
 *
 * La forma es la del panel del cliente: cabecera, el estado del expediente y
 * la lista de lo que le toca hacer.
 */
export default function Cargar() {
  return (
    <Cargando etiqueta="Cargando tu expediente" className="flex flex-col gap-5">
      <HuesoCabecera />
      <HuesoTarjeta />
      <HuesoLista filas={3} />
    </Cargando>
  );
}
