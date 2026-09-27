import test from "node:test";
import assert from "node:assert/strict";

import { prepararExpediente, ordenarPorEsfuerzo, type Preparacion } from "./preparacion";
import { expedientesDemo } from "@/content/demo";
import { TRAMITE_MAP } from "@/content/tramites";

/**
 * EL ORDEN QUE AHORRA TRABAJO.
 *
 * Lo que se fija aquí no es la aritmética —contar documentos no se rompe
 * solo— sino las dos decisiones que sí: qué cuenta como «listo» y en qué
 * orden salen las cosas. Si un expediente al que le falta un documento
 * apareciera como listo, el abogado lo firmaría.
 */

const SLUG = "arraigo-sociolaboral";
const REQUERIDOS = TRAMITE_MAP[SLUG].documents.filter((d) => !d.optional);

/** Todos los documentos del trámite con el mismo estado. */
function todos(estado: Parameters<typeof prepararExpediente>[0]["documentos"][number]["estado"]) {
  return REQUERIDOS.map((d) => ({ nombre: d.name, estado }));
}

test("con todo validado, el expediente está listo para presentar", () => {
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: todos("correcto") });
  assert.equal(p.estado, "listo");
  assert.equal(p.pelota, "nosotros");
  assert.equal(p.validados, p.requeridos);
  assert.match(p.siguiente, /Firmar y presentar/);
});

test("un solo documento de menos y ya no está listo", () => {
  // Es la comprobación que importa de verdad: «casi listo» no es listo, y la
  // diferencia la paga quien presenta un expediente incompleto.
  const docs = todos("correcto");
  docs[0].estado = "pendiente";
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: docs });

  assert.notEqual(p.estado, "listo");
  assert.equal(p.validados, p.requeridos - 1);
});

test("un documento caducado no cuenta como aportado", () => {
  // Caducado es el motivo más común de un requerimiento de subsanación.
  // Tratarlo como presente es exactamente cómo se pierde un expediente.
  const docs = todos("correcto");
  docs[0].estado = "caducado";
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: docs });

  assert.notEqual(p.estado, "listo");
  assert.equal(p.caducados.length, 1);
  assert.match(p.siguiente, /caducad/);
});

test("lo subido y sin revisar es trabajo del despacho, no del cliente", () => {
  const docs = todos("correcto");
  docs[0].estado = "revision";
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: docs });

  assert.equal(p.estado, "en-revision");
  assert.equal(p.pelota, "nosotros");
  assert.match(p.siguiente, /el cliente ya ha hecho su parte/);
});

test("lo que falta del cliente no reclama trabajo al abogado", () => {
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: [] });
  assert.equal(p.estado, "esperando-cliente");
  assert.equal(p.pelota, "cliente");
  assert.match(p.siguiente, /Recordatorio automático/);
});

test("presentado gana a cualquier otro estado", () => {
  // Un expediente en la Administración no se prepara; se vigila. Si apareciera
  // como «esperando al cliente» se le reclamarían documentos ya presentados.
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: [], presentado: true });
  assert.equal(p.estado, "presentado");
  assert.equal(p.pelota, "administracion");
});

test("un trámite fuera del catálogo se dice, no se finge", () => {
  // Devolver cero requeridos lo ordenaría como si estuviera listo.
  const p = prepararExpediente({ tramiteSlug: "no-existe", documentos: [] });
  assert.notEqual(p.estado, "listo");
  assert.match(p.siguiente, /no está en el catálogo/);
});

test("los documentos opcionales no impiden que un expediente esté listo", () => {
  const opcionales = TRAMITE_MAP[SLUG].documents.filter((d) => d.optional);
  const p = prepararExpediente({ tramiteSlug: SLUG, documentos: todos("correcto") });
  assert.equal(p.estado, "listo", `hay ${opcionales.length} opcionales y bloquean`);
});

/* ------------------------------------------------------------------ *
 * El orden
 * ------------------------------------------------------------------ */

test("primero lo que cierra una sola acción del despacho", () => {
  const casos = [
    { id: "espera", p: prepararExpediente({ tramiteSlug: SLUG, documentos: [] }) },
    { id: "presentado", p: prepararExpediente({ tramiteSlug: SLUG, documentos: [], presentado: true }) },
    { id: "listo", p: prepararExpediente({ tramiteSlug: SLUG, documentos: todos("correcto") }) },
    { id: "revision", p: prepararExpediente({ tramiteSlug: SLUG, documentos: todos("revision") }) },
  ];

  const orden = ordenarPorEsfuerzo(casos, (c) => c.p).map((c) => c.id);
  assert.deepEqual(orden, ["listo", "revision", "espera", "presentado"]);
});

test("a igualdad de estado, primero lo que menos pendientes tiene", () => {
  // Entre dos expedientes esperando al cliente, el que necesita un documento
  // se cierra antes que el que necesita seis.
  const casiListo = todos("correcto");
  casiListo[0].estado = "pendiente";

  const casos = [
    { id: "lejos", p: prepararExpediente({ tramiteSlug: SLUG, documentos: [] }) },
    { id: "cerca", p: prepararExpediente({ tramiteSlug: SLUG, documentos: casiListo }) },
  ];

  assert.deepEqual(ordenarPorEsfuerzo(casos, (c) => c.p).map((c) => c.id), ["cerca", "lejos"]);
});

/* ------------------------------------------------------------------ *
 * Los datos de demostración tienen que poder demostrarlo
 * ------------------------------------------------------------------ */

test("los expedientes de demostración cubren los cuatro estados", () => {
  // Si todos cayeran en el mismo, la pantalla no enseñaría nada del orden.
  const estados = new Set(
    expedientesDemo().map(
      (e) =>
        prepararExpediente({
          tramiteSlug: e.tramiteSlug,
          documentos: e.documentos ?? [],
          presentado: e.presentado,
        }).estado,
    ),
  );

  for (const esperado of ["listo", "en-revision", "esperando-cliente", "presentado"]) {
    assert.ok(estados.has(esperado as never), `ningún expediente de demostración está «${esperado}»`);
  }
});

test("cada expediente de demostración apunta a un trámite real del catálogo", () => {
  // Un slug mal escrito no falla: sale «sin plan documental» y pasa
  // desapercibido entre doce filas.
  for (const e of expedientesDemo()) {
    assert.ok(
      TRAMITE_MAP[e.tramiteSlug],
      `«${e.referencia}» apunta a «${e.tramiteSlug}», que no existe`,
    );
  }
});

test("los nombres de documento de los expedientes existen en su trámite", () => {
  // Es el error silencioso de este modelo: un nombre con una tilde de menos
  // deja el documento eternamente pendiente y nadie sabe por qué.
  for (const e of expedientesDemo()) {
    const validos = new Set(TRAMITE_MAP[e.tramiteSlug].documents.map((d) => d.name));
    for (const d of e.documentos ?? []) {
      assert.ok(
        validos.has(d.nombre),
        `«${e.referencia}»: «${d.nombre}» no es un documento de ${e.tramiteSlug}`,
      );
    }
  }
});

test("la frase de siguiente paso nunca sale vacía", () => {
  const vistos: Preparacion[] = expedientesDemo().map((e) =>
    prepararExpediente({
      tramiteSlug: e.tramiteSlug,
      documentos: e.documentos ?? [],
      presentado: e.presentado,
    }),
  );
  for (const p of vistos) assert.ok(p.siguiente.length > 10, "frase vacía o inútil");
});
