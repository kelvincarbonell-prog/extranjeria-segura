/**
 * CANDADO: LO QUE EXISTE PERO NO SE PUBLICA.
 *
 * En octubre de 2026 el despacho entregó su catálogo de trámites recurrentes
 * y decidió que lo que no está en él no se ofrece en la web: nacionalidad,
 * régimen comunitario, protección internacional y recursos. Sus fichas no se
 * borran —están revisadas, enlazadas y con sus documentos, y el día que
 * vuelvan a ofrecerse basta con sacarlas de aquí—, pero quedan bajo llave.
 *
 * Qué significa «bloqueado», en todas las superficies a la vez:
 *
 *   · No aparece en ningún listado, menú, pie, buscador, sitemap ni llms.txt.
 *   · Su URL no se genera: con `dynamicParams = false`, es un 404 real.
 *   · No genera páginas de SEO programático ni sale en el diagnóstico.
 *   · El panel interno sí lo ve, con candado: los expedientes que ya existen
 *     de estos trámites siguen teniendo su plan documental.
 *
 * Es una lista y no un campo en cada ficha a propósito. Una decisión de
 * negocio que afecta a ocho fichas, cuatro categorías, dos tarifas y una
 * calculadora se toma en un sitio y se deshace en un sitio; repartida en
 * catorce `oculto: true` por cuatro archivos, alguien se dejaría uno.
 *
 * `bloqueos.test.ts` es la otra mitad del candado: falla si algo de esta
 * lista asoma en cualquier superficie pública.
 */
export const BLOQUEOS = {
  tramites: [
    "nacionalidad-por-residencia",
    "nacionalidad-por-opcion",
    "tarjeta-familiar-comunitario",
    "certificado-registro-ue",
    "proteccion-internacional",
    "requerimiento-subsanacion",
    "recurso-alzada",
    "recurso-contencioso",
  ],
  /** Categorías que solo contenían fichas bloqueadas. */
  categorias: ["nacionalidad", "comunitarios", "recursos", "requerimientos"],
  /** Tarifas de `pricing.ts` cuya única razón de ser eran esas fichas. */
  planes: ["nacionalidad", "recursos"],
  /** La calculadora de nacionalidad vende un servicio que no se ofrece. */
  calculadoras: ["tiempo-nacionalidad"],
  /** Objetivos del diagnóstico que solo llevaban a fichas bloqueadas. */
  objetivos: ["nacionalidad"],
} as const;

export type TipoBloqueo = keyof typeof BLOQUEOS;

export function bloqueado(tipo: TipoBloqueo, id: string): boolean {
  return (BLOQUEOS[tipo] as readonly string[]).includes(id);
}
