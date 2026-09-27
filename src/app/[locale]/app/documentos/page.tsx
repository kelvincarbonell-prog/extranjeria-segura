import { DocumentManager } from "@/components/app/DocumentManager";
import { PlanDocumental } from "@/components/app/PlanDocumental";

export const metadata = { title: "Documentos" };

/**
 * El plan va antes que el gestor, y no al revés.
 *
 * El gestor enseña los archivos que ya existen; el plan, los que harán falta.
 * Quien acaba de abrir expediente no tiene ninguno, así que empezar por el
 * gestor era empezar por una lista de ocho casillas vacías sin explicar de
 * dónde salen ni cuáles le tocan a él.
 */
export default function DocumentosPage() {
  return (
    <>
      <PlanDocumental />
      <DocumentManager />
    </>
  );
}
