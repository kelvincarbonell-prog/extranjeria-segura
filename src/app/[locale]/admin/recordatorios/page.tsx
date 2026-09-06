import { Recordatorios } from "@/components/admin/Recordatorios";
import { DEMO_EXPEDIENTES } from "@/content/demo";
import { plazosDe } from "@/lib/vigilancia";
import { DemoTag } from "@/components/ui/primitives";
import type { Locale } from "@/i18n/config";

export const metadata = { title: "Recordatorios" };

/**
 * Datos de demostración para la reclamación de documentos.
 *
 * El idioma del cliente es un campo del expediente, no una preferencia de
 * interfaz: es en el que hay que escribirle aunque el despacho trabaje en
 * español. En el modelo real vive en la ficha del cliente.
 */
const PENDIENTES: {
  id: string;
  referencia: string;
  cliente: string;
  tramite: string;
  idioma: Locale;
  documentos: { nombre: string; nota?: string; desdeDias: number }[];
}[] = [
  {
    id: "c1",
    referencia: "ES-2048",
    cliente: "María G.",
    tramite: "Arraigo sociolaboral",
    idioma: "es",
    documentos: [
      {
        nombre: "Certificado de antecedentes penales del país de origen",
        nota: "Legalizado o apostillado y traducido",
        desdeDias: 11,
      },
    ],
  },
  {
    id: "c5",
    referencia: "ES-2033",
    cliente: "Wei L.",
    tramite: "Renovación de residencia",
    idioma: "zh",
    documentos: [
      { nombre: "Vida laboral actualizada", desdeDias: 6 },
      { nombre: "Últimas tres nóminas", desdeDias: 6 },
    ],
  },
  {
    id: "c2",
    referencia: "ES-2051",
    cliente: "Ibrahim K.",
    tramite: "Nacionalidad por residencia",
    idioma: "ar",
    documentos: [
      {
        nombre: "Certificado de nacimiento",
        nota: "Apostillado y traducido por traductor jurado",
        desdeDias: 19,
      },
      { nombre: "Certificado del examen CCSE", desdeDias: 4 },
    ],
  },
  {
    id: "c4",
    referencia: "ES-2039",
    cliente: "Carlos M.",
    tramite: "Reagrupación familiar",
    idioma: "pt",
    documentos: [
      { nombre: "Contrato de arrendamiento en vigor", desdeDias: 3 },
      { nombre: "Informe de vivienda adecuada", nota: "Lo emite el ayuntamiento", desdeDias: 3 },
    ],
  },
];

export default function RecordatoriosPage() {
  // El plazo vivo del expediente se calcula, no se guarda: es el mismo motor
  // que la torre de plazos, así que las dos pantallas no pueden discrepar.
  const conPlazo = PENDIENTES.map((p) => {
    const exp = DEMO_EXPEDIENTES.find((e) => e.id === p.id);
    const plazos = exp ? plazosDe(exp) : [];
    const vivo = plazos.find((x) => x.cuenta.estado !== "vencido");
    return { ...p, plazo: vivo };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-ink-950 font-display text-[26px] font-extrabold tracking-[-0.03em]">
            Recordatorios
          </h1>
          <p className="text-ink-600 mt-2 max-w-2xl text-[15px] leading-relaxed">
            Qué documento falta en cada expediente, desde cuándo, y el mensaje ya escrito en el
            idioma del cliente. El plazo que aparece es el mismo que calcula la torre de plazos.
          </p>
        </div>
        <DemoTag />
      </header>

      <Recordatorios expedientes={conPlazo} />
    </div>
  );
}
