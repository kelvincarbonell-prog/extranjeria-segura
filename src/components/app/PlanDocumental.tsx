import { Link } from "@/components/ui/Link";
import { Card, Badge } from "@/components/ui/primitives";
import { Glyph } from "@/components/brand/Glyph";
import { TRAMITE_MAP } from "@/content/tramites";
import { DEMO_CASE } from "@/content/demo";
import { cn } from "@/lib/utils";

/**
 * QUÉ TE TOCA A TI, Y QUÉ NOS TOCA A NOSOTROS.
 *
 * El gestor de documentos de abajo enseña los archivos que ya existen. Esto
 * enseña la lista completa del trámite antes de que exista ninguno, que es lo
 * que de verdad ahorra trabajo a las dos partes:
 *
 *  · Al cliente, porque puede ir al registro civil una vez con la lista
 *    entera en lugar de tres veces según se la vayan pidiendo.
 *  · Al abogado, porque cada documento que llega completo y a la primera es
 *    un correo de reclamación que no hay que escribir.
 *
 * ─── DE DÓNDE SALE LA LISTA ─────────────────────────────────────────────
 *
 * Del catálogo de trámites, no de una copia. Es donde vive el contenido
 * jurídico y donde se revisa; una lista duplicada aquí seguiría pidiendo la
 * documentación del año pasado cuando cambie un requisito.
 *
 * ─── LO QUE SEPARA ESTO DE UN CHECKLIST ─────────────────────────────────
 *
 * Cada documento dice **quién lo consigue**. Casi todas las listas de
 * extranjería que circulan mezclan lo que tiene que traer el solicitante con
 * lo que prepara el despacho, y el resultado es alguien intentando conseguir
 * un impreso oficial que no le corresponde. Separarlo cuesta una cabecera y
 * ahorra una llamada.
 */
export function PlanDocumental() {
  const tramite = TRAMITE_MAP[DEMO_CASE.tramiteSlug];
  if (!tramite) return null;

  const mios = tramite.documents.filter((d) => d.source === "cliente");
  const nuestros = tramite.documents.filter((d) => d.source === "nosotros");
  const administracion = tramite.documents.filter((d) => d.source === "administracion");

  return (
    <section aria-labelledby="plan-documental" className="mb-6">
      <div className="mb-4">
        <h2
          id="plan-documental"
          className="text-ink-900 font-display text-[19px] font-extrabold tracking-[-0.03em]"
        >
          Todo lo que hace falta para tu {tramite.name.toLowerCase()}
        </h2>
        <p className="text-ink-500 mt-1.5 text-[13.5px] leading-relaxed">
          La lista entera desde el primer día, para que puedas pedir los certificados de una sola
          vez. Lo que prepara el despacho aparece aquí para que sepas que no tienes que buscarlo.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Grupo
          titulo="Lo consigues tú"
          detalle={`${mios.length} documento${mios.length === 1 ? "" : "s"}`}
          glifo="doc"
          tono="cliente"
          documentos={mios}
        />
        <div className="flex flex-col gap-3">
          <Grupo
            titulo="Lo preparamos nosotros"
            detalle="No tienes que hacer nada"
            glifo="shield"
            tono="nosotros"
            documentos={nuestros}
          />
          {administracion.length > 0 && (
            <Grupo
              titulo="Lo emite la Administración"
              detalle="Lo solicitamos y te avisamos"
              glifo="stamp"
              tono="nosotros"
              documentos={administracion}
            />
          )}
        </div>
      </div>

      {/* El aviso de revisión jurídica acompaña a la lista, no al pie de la
          página: quien imprime esto para ir al registro se lleva la lista, y
          tiene que llevarse también la reserva. */}
      <p className="text-ink-400 mt-4 text-[12px] leading-relaxed">
        Esta lista es orientativa y depende de tu caso concreto. Tu especialista la ajusta al
        revisar el expediente.{" "}
        <Link
          href={`/tramites/${tramite.slug}`}
          className="text-brand-600 hover:text-brand-800 underline underline-offset-2"
        >
          Ver los requisitos completos del trámite
        </Link>
        .
      </p>
    </section>
  );
}

function Grupo({
  titulo,
  detalle,
  glifo,
  tono,
  documentos,
}: {
  titulo: string;
  detalle: string;
  glifo: string;
  tono: "cliente" | "nosotros";
  documentos: { name: string; note?: string; optional?: boolean }[];
}) {
  if (documentos.length === 0) return null;

  return (
    <Card padding="none" className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[11px]",
            tono === "cliente" ? "bg-brand-50 text-brand-700" : "bg-ink-50 text-ink-500",
          )}
        >
          <Glyph name={glifo} className="size-[17px]" />
        </span>
        <div className="min-w-0">
          <h3 className="text-ink-900 text-[14.5px] font-semibold">{titulo}</h3>
          <p className="text-ink-400 text-[12px]">{detalle}</p>
        </div>
      </div>

      <ul className="border-ink-100 mt-4 border-t">
        {documentos.map((d) => (
          <li key={d.name} className="border-ink-100 border-b py-2.5 last:border-b-0">
            <p className="text-ink-800 text-[13.5px] leading-snug font-medium">
              {d.name}
              {d.optional && (
                <Badge tone="neutral" className="ml-2 align-middle">
                  Si aplica
                </Badge>
              )}
            </p>
            {/* La nota es la diferencia entre traer el documento bueno y
                volver otra vez: «apostillado y traducido» no es un detalle. */}
            {d.note && (
              <p className="text-ink-500 mt-0.5 text-[12.5px] leading-relaxed">{d.note}</p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
