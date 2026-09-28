import type { DocState } from "@/content/demo";
import { TRAMITE_MAP } from "@/content/tramites";
import type { DocumentRequirement } from "@/content/taxonomy";
import { diasEntre, hoy, parseDia } from "./plazos";
import type { Expediente } from "./vigilancia";

/**
 * EL PLAN DOCUMENTAL DE UN EXPEDIENTE, AGRUPADO POR QUIÉN TIENE QUE MOVER.
 *
 * La lista de documentos de un trámite, tal cual, no le sirve a quien lleva
 * el caso: ocho filas con ocho estados obligan a leerlas todas para saber qué
 * hacer. La pregunta real es otra —¿qué es mío, qué espera al cliente y qué
 * ya está?— y la respuesta es una agrupación, no un orden.
 *
 * Los grupos salen de dos datos que ya existían y nadie cruzaba: el estado
 * del documento en el expediente y quién lo consigue según el trámite
 * (`source`). Un documento pendiente que prepara el despacho no se le reclama
 * al cliente, y uno subido esperando revisión no es culpa de nadie más que
 * nuestra.
 *
 * Es una función pura, sin sesión ni cookies, para que la misma agrupación la
 * usen la ficha, la reclamación de documentos y los tests.
 */

export type GrupoDocumento =
  /** Subido por el cliente y esperando que lo mire alguien del despacho. */
  | "revisar"
  /** Falta, está caducado o tiene una incidencia, y solo el cliente lo arregla. */
  | "cliente"
  /** Falta y lo prepara el despacho: impresos, tasas, escritos. */
  | "nosotros"
  /** Lo emite un organismo: informes municipales, certificados de oficio. */
  | "administracion"
  /** Validado: no requiere nada. */
  | "validado";

export interface FilaDocumento {
  nombre: string;
  nota?: string;
  source: DocumentRequirement["source"];
  opcional: boolean;
  estado: DocState;
  grupo: GrupoDocumento;
  /** Días que lleva pedido al cliente, si consta cuándo se pidió. */
  esperaDias?: number;
}

/** Orden de los grupos en pantalla: primero lo que depende de nosotros. */
export const ORDEN_GRUPOS: GrupoDocumento[] = [
  "revisar",
  "nosotros",
  "cliente",
  "administracion",
  "validado",
];

export const TITULO_GRUPO: Record<GrupoDocumento, { titulo: string; detalle: string }> = {
  revisar: {
    titulo: "Nos toca revisar",
    detalle: "El cliente ya lo ha subido. Cada día que espera aquí es un día nuestro.",
  },
  nosotros: {
    titulo: "Lo preparamos nosotros",
    detalle: "Impresos, tasas y escritos. No se le reclaman al cliente.",
  },
  cliente: {
    titulo: "Espera al cliente",
    detalle: "Falta, ha caducado o hay que corregirlo. Se reclama con un mensaje ya escrito.",
  },
  administracion: {
    titulo: "Lo emite un organismo",
    detalle: "Informes y certificados que pide el cliente o el despacho a la Administración.",
  },
  validado: {
    titulo: "Validado",
    detalle: "Revisado y correcto. No requiere nada más.",
  },
};

function grupoDe(estado: DocState, source: DocumentRequirement["source"]): GrupoDocumento {
  if (estado === "correcto") return "validado";
  if (estado === "subido" || estado === "revision") return "revisar";
  // Pendiente, con cambios o caducado: lo arregla quien lo consigue.
  if (source === "nosotros") return "nosotros";
  if (source === "administracion") return "administracion";
  return "cliente";
}

export function planDocumental(exp: Expediente, referencia: Date = hoy()): FilaDocumento[] {
  const tramite = TRAMITE_MAP[exp.tramiteSlug];
  if (!tramite) return [];

  const porNombre = new Map((exp.documentos ?? []).map((d) => [d.nombre, d]));

  return tramite.documents
    .map((req): FilaDocumento | null => {
      const doc = porNombre.get(req.name);
      const estado: DocState = doc?.estado ?? "pendiente";
      // Un opcional que nadie ha aportado no es trabajo pendiente: listarlo
      // como «falta» haría parecer incompleto un expediente que no lo está.
      if (req.optional && !doc) return null;
      return {
        nombre: req.name,
        nota: req.note,
        source: req.source,
        opcional: Boolean(req.optional),
        estado,
        grupo: grupoDe(estado, req.source),
        esperaDias: doc?.pedidoEl
          ? Math.max(0, diasEntre(parseDia(doc.pedidoEl), referencia))
          : undefined,
      };
    })
    .filter((f): f is FilaDocumento => f !== null);
}

/**
 * Lo que hay que reclamarle al cliente, con su nota y su espera.
 *
 * Es lo que alimenta «Reclamar documentos». Antes esa pantalla tenía su
 * propia lista escrita a mano, y no coincidía con el expediente: a Wei L. le
 * reclamaba «últimas tres nóminas», un documento que su trámite ni siquiera
 * pide, mientras la ficha decía que lo que faltaba era la vida laboral.
 */
export function pendientesDelCliente(exp: Expediente, referencia: Date = hoy()) {
  return planDocumental(exp, referencia)
    .filter((f) => f.grupo === "cliente")
    .map((f) => ({
      nombre: f.nombre,
      nota: f.nota,
      // El motivo viaja como dato, no como frase: la plantilla lo escribe en
      // el idioma del cliente.
      motivo:
        f.estado === "caducado"
          ? ("caducado" as const)
          : f.estado === "cambios"
            ? ("corregir" as const)
            : undefined,
      desdeDias: f.esperaDias,
    }));
}
