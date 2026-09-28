import { test } from "node:test";
import assert from "node:assert/strict";

import { planDocumental, pendientesDelCliente } from "./ficha-expediente";
import { prepararExpediente } from "./preparacion";
import { plazosDe, type Expediente } from "./vigilancia";
import {
  expedientesDemo,
  DEMO_CASE,
  DEMO_DOCUMENTS,
  DEMO_APPOINTMENTS,
  DEMO_PIPELINE,
  PIPELINE_STAGES,
  pendientesDelClienteDemo,
  proximaCita,
} from "@/content/demo";
import { componerRecordatorio } from "@/content/recordatorios";

/**
 * FICHA DE EXPEDIENTE Y COHERENCIA DE LA DEMOSTRACIÓN.
 *
 * Cada caso de aquí es un fallo que llegó a verse en pantalla. Están escritos
 * para que no vuelvan, no para cubrir líneas.
 */

const HOY = new Date(Date.UTC(2026, 8, 28));

function exp(documentos: Expediente["documentos"], extra: Partial<Expediente> = {}): Expediente {
  return {
    id: "x",
    referencia: "ES-0000",
    cliente: "Prueba",
    tramite: "Arraigo sociolaboral",
    tramiteSlug: "arraigo-sociolaboral",
    responsable: "A. Ruiz",
    hechos: [],
    documentos,
    ...extra,
  };
}

test("lo que prepara el despacho nunca se le reclama al cliente", () => {
  const plan = planDocumental(exp([]), HOY);
  const nuestros = plan.filter((f) => f.source === "nosotros");
  assert.ok(nuestros.length > 0, "el trámite tiene documentos que prepara el despacho");
  for (const f of nuestros) assert.equal(f.grupo, "nosotros", f.nombre);

  const reclamados = pendientesDelCliente(exp([]), HOY).map((d) => d.nombre);
  for (const f of nuestros) assert.ok(!reclamados.includes(f.nombre), f.nombre);
});

test("un documento subido espera al despacho, no al cliente", () => {
  const plan = planDocumental(
    exp([{ nombre: "Pasaporte completo en vigor", estado: "revision" }]),
    HOY,
  );
  assert.equal(plan.find((f) => f.nombre === "Pasaporte completo en vigor")?.grupo, "revisar");
});

test("la espera se calcula desde la fecha en que se pidió", () => {
  const plan = planDocumental(
    exp([
      {
        nombre: "Certificado de antecedentes penales del país de origen",
        estado: "pendiente",
        pedidoEl: "2026-09-17",
      },
    ]),
    HOY,
  );
  const f = plan.find((x) => x.nombre.startsWith("Certificado de antecedentes"));
  assert.equal(f?.esperaDias, 11);
});

test("el motivo de la reclamación sale en el idioma del cliente, no en español", () => {
  const [doc] = pendientesDelCliente(
    exp([{ nombre: "Contrato u oferta de trabajo firmada", estado: "cambios" }]),
    HOY,
  ).filter((d) => d.nombre === "Contrato u oferta de trabajo firmada");
  assert.equal(doc.motivo, "corregir");

  const mensaje = componerRecordatorio({
    cliente: "Wei L.",
    tramite: "Arraigo",
    documentos: [doc],
    locale: "zh",
  });
  assert.ok(mensaje.includes("需要更正"), "el motivo va traducido");
  assert.ok(!mensaje.includes("Hay que corregirlo"), "sin frases en español dentro del chino");
});

test("un expediente presentado no aparece con cero documentos", () => {
  for (const e of expedientesDemo().filter((x) => x.presentado)) {
    const p = prepararExpediente({
      tramiteSlug: e.tramiteSlug,
      documentos: e.documentos ?? [],
      presentado: true,
    });
    assert.equal(p.validados, p.requeridos, `${e.referencia} se presentó con todo validado`);
  }
});

test("no se vigila la caducidad de un documento que el cliente no ha entregado", () => {
  for (const e of expedientesDemo()) {
    for (const h of e.hechos.filter((x) => x.tipo === "caducidad-documento")) {
      const entregado = (e.documentos ?? []).some(
        (d) => d.nombre.startsWith(h.etiqueta ?? "") && d.estado !== "pendiente",
      );
      assert.ok(entregado, `${e.referencia}: «${h.etiqueta}» no está entregado`);
    }
  }
});

test("un expediente presentado no lleva la etiqueta de archivado", () => {
  const cerrado = PIPELINE_STAGES.find((s) => s.id === "archivado");
  assert.notEqual(cerrado?.label, "Archivado");
  for (const e of expedientesDemo().filter((x) => x.presentado)) {
    const c = DEMO_PIPELINE.find((x) => x.id === e.id);
    assert.notEqual(c?.stage, "archivado", e.referencia);
  }
});

test("«presentado» significa que hay algo que vigilar", () => {
  for (const e of expedientesDemo().filter((x) => x.presentado)) {
    assert.ok(plazosDe(e).length > 0, `${e.referencia}: presentado sin ningún plazo vivo`);
  }
});

/* ---------------- Área de cliente ---------------- */

test("la frase, el contador y la lista del cliente cuentan lo mismo", () => {
  const pendientes = pendientesDelClienteDemo(DEMO_DOCUMENTS);
  assert.ok(pendientes.every((d) => d.owner === "cliente"), "solo lo que depende del cliente");
  assert.equal(pendientes.length, 2);

  // La frase nombra cada documento pendiente, y no dice «el último» si hay más.
  const frase = `${DEMO_CASE.nextStep.title} ${DEMO_CASE.nextStep.detail}`.toLowerCase();
  for (const d of pendientes) assert.ok(frase.includes(d.name.toLowerCase()), d.name);
  assert.ok(!frase.includes("último"));
});

test("la próxima cita está por delante y no cae en fin de semana", () => {
  const cita = proximaCita(DEMO_APPOINTMENTS);
  assert.ok(cita, "hay una cita futura");
  const d = new Date(cita.at);
  assert.ok(d.getTime() > Date.now());
  assert.ok(![0, 6].includes(d.getUTCDay()), "no es sábado ni domingo");
});

test("el avance del expediente sale de sus fases, no de un número escrito", () => {
  const hechas = DEMO_CASE.timeline.filter((t) => t.state === "done").length;
  const esperado = Math.round(((hechas + 0.5) / DEMO_CASE.timeline.length) * 100);
  assert.equal(DEMO_CASE.progress, esperado);
});
