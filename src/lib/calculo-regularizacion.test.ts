import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular, validarEntrada } from "./calculo-regularizacion";
import { parseDia } from "./plazos";

/**
 * La calculadora dice a alguien cuántos días le quedan para recurrir. Si se
 * equivoca en un día y ese alguien la cree, pierde el recurso. Por eso cada
 * rama tiene su prueba, incluidas las que no producen ningún plazo.
 */

test("dentro del plazo de resolución no se abre ninguna vía de recurso", () => {
  const r = calcular(
    { fechaPresentacion: "2026-06-30", tipoResolucion: "sin-resolucion" },
    parseDia("2026-09-06"),
  );
  assert.equal(r.silencio, "2026-09-30");
  assert.equal(r.silencioProducido, false);
  assert.equal(r.estado, "en-plazo-de-resolucion");
  assert.equal(r.vias.length, 0, "no hay acto que recurrir todavía");
  assert.equal(r.cuentaSilencio.dias, 24);
});

test("producido el silencio, la reposición no tiene cierre y el contencioso sí", () => {
  const r = calcular(
    { fechaPresentacion: "2026-06-30", tipoResolucion: "sin-resolucion" },
    parseDia("2026-10-15"),
  );
  assert.equal(r.estado, "silencio-producido");
  assert.equal(r.silencio, "2026-09-30");

  const reposicion = r.vias.find((v) => v.id === "reposicion-presunto");
  assert.ok(reposicion);
  assert.equal(reposicion.vence, null, "sin plazo de cierre (art. 124)");

  const contencioso = r.vias.find((v) => v.id === "contencioso-presunto");
  assert.ok(contencioso);
  assert.equal(contencioso.vence, "2027-03-30", "seis meses desde el acto presunto");
});

test("con resolución expresa los plazos cuentan desde la notificación", () => {
  const r = calcular(
    {
      fechaPresentacion: "2026-05-20",
      tipoResolucion: "denegada",
      fechaNotificacion: "2026-09-15",
    },
    parseDia("2026-09-20"),
  );
  assert.equal(r.estado, "resolucion-expresa");
  assert.equal(r.vias.find((v) => v.id === "reposicion")?.vence, "2026-10-15");
  assert.equal(r.vias.find((v) => v.id === "contencioso")?.vence, "2026-11-15");
});

test("la inadmisión avisa de que el recurso combate otra cosa", () => {
  const r = calcular(
    {
      fechaPresentacion: "2026-05-20",
      tipoResolucion: "inadmitida",
      fechaNotificacion: "2026-09-15",
    },
    parseDia("2026-09-20"),
  );
  assert.ok(
    r.avisos.some((a) => a.includes("no es una denegación")),
    "debe distinguir inadmisión de denegación",
  );
});

test("una concesión no genera plazos de recurso", () => {
  const r = calcular(
    {
      fechaPresentacion: "2026-05-20",
      tipoResolucion: "concedida",
      fechaNotificacion: "2026-09-15",
    },
    parseDia("2026-09-20"),
  );
  assert.equal(r.estado, "concedida");
  assert.equal(r.vias.length, 0);
});

test("presentación en un 31 que no existe tres meses después", () => {
  // 31 de mayo + 3 meses = 31 de agosto (sí existe).
  const r1 = calcular(
    { fechaPresentacion: "2026-05-31", tipoResolucion: "sin-resolucion" },
    parseDia("2026-09-06"),
  );
  assert.equal(r1.silencio, "2026-08-31");
  // Y el contencioso, seis meses más: 28 de febrero de 2027, no el 31.
  const contencioso = r1.vias.find((v) => v.id === "contencioso-presunto");
  assert.equal(contencioso?.vence, "2027-02-28");
});

test("validarEntrada rechaza fechas fuera del plazo del procedimiento", () => {
  assert.equal(validarEntrada({ fechaPresentacion: "2026-05-01" }), null);
  assert.match(
    validarEntrada({ fechaPresentacion: "2026-07-15" }) ?? "",
    /16 de abril al 30 de junio/,
  );
  assert.match(
    validarEntrada({ fechaPresentacion: "2026-01-10" }) ?? "",
    /16 de abril al 30 de junio/,
  );
});

test("validarEntrada exige la notificación cuando hay resolución", () => {
  assert.match(
    validarEntrada({ fechaPresentacion: "2026-05-01", tipoResolucion: "denegada" }) ?? "",
    /notificaron/,
  );
});

test("validarEntrada detecta una notificación anterior a la presentación", () => {
  assert.match(
    validarEntrada({
      fechaPresentacion: "2026-05-20",
      tipoResolucion: "denegada",
      fechaNotificacion: "2026-05-01",
    }) ?? "",
    /no puede ser anterior/,
  );
});
