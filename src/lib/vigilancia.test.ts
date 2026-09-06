import { test } from "node:test";
import assert from "node:assert/strict";
import { aperturaRenovacion, plazosDe, vigilar, type Expediente } from "./vigilancia";
import { parseDia } from "./plazos";

const HOY = parseDia("2026-09-06");

function exp(hechos: Expediente["hechos"], id = "e1"): Expediente {
  return {
    id,
    referencia: "ES-0001",
    cliente: "Cliente de prueba",
    tramite: "Arraigo social",
    responsable: "A. Ruiz",
    hechos,
  };
}

test("un requerimiento genera su plazo de subsanación", () => {
  const p = plazosDe(exp([{ tipo: "requerimiento-notificado", fecha: "2026-09-02" }]), HOY);
  assert.equal(p.length, 1);
  assert.equal(p[0].origen, "requerimiento");
  assert.equal(p[0].vence, "2026-09-12", "diez días desde la notificación");
  assert.equal(p[0].cuenta.dias, 6);
  assert.equal(p[0].cuenta.critico, true, "quedan siete días o menos");
  assert.equal(p[0].verificado, false, "el art. 68 aún no está contrastado");
});

test("un requerimiento con días propios respeta los suyos", () => {
  const p = plazosDe(
    exp([{ tipo: "requerimiento-notificado", fecha: "2026-09-02", diasConcedidos: 15 }]),
    HOY,
  );
  assert.equal(p[0].vence, "2026-09-17");
});

test("la presentación genera el silencio a los tres meses", () => {
  const p = plazosDe(exp([{ tipo: "presentacion", fecha: "2026-06-30" }]), HOY);
  assert.equal(p[0].origen, "silencio");
  assert.equal(p[0].vence, "2026-09-30");
  assert.equal(p[0].verificado, true);
});

test("una denegación abre reposición y contencioso, en ese orden", () => {
  const p = plazosDe(
    exp([{ tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "denegatoria" }]),
    HOY,
  );
  assert.equal(p.length, 2);
  assert.equal(p[0].origen, "reposicion");
  assert.equal(p[0].vence, "2026-10-01");
  assert.equal(p[1].origen, "contencioso");
  assert.equal(p[1].vence, "2026-11-01");
});

test("una resolución favorable no abre ningún plazo de recurso", () => {
  const p = plazosDe(
    exp([{ tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "favorable" }]),
    HOY,
  );
  assert.equal(p.length, 0, "no hay nada que recurrir");
});

test("los plazos vencidos van los primeros, no se ocultan", () => {
  const p = plazosDe(
    exp([
      { tipo: "presentacion", fecha: "2026-06-30" },
      { tipo: "requerimiento-notificado", fecha: "2026-08-01" },
    ]),
    HOY,
  );
  assert.equal(p[0].origen, "requerimiento", "el vencido primero");
  assert.equal(p[0].cuenta.estado, "vencido");
  assert.equal(
    p[0].cuenta.critico,
    false,
    "un plazo vencido no es crítico: es otra cosa, y exige otra decisión",
  );
});

test("la ventana de renovación se abre 60 días antes y cierra 90 después", () => {
  assert.equal(aperturaRenovacion("2026-11-15"), "2026-09-16");
  const p = plazosDe(exp([{ tipo: "caducidad-tarjeta", fecha: "2026-11-15" }]), HOY);
  assert.equal(p[0].vence, "2027-02-13");
});

test("vigilar separa vencidos, críticos y próximos sin perder ninguno", () => {
  const expedientes = [
    exp([{ tipo: "requerimiento-notificado", fecha: "2026-08-01" }], "vencido"),
    exp([{ tipo: "requerimiento-notificado", fecha: "2026-09-03" }], "critico"),
    exp([{ tipo: "presentacion", fecha: "2026-06-30" }], "proximo"),
    exp([], "tranquilo"),
  ];
  const r = vigilar(expedientes, HOY);

  assert.equal(r.vencidos.length, 1);
  assert.equal(r.vencidos[0].expedienteId, "vencido");
  assert.equal(r.criticos.length, 1);
  assert.equal(r.criticos[0].expedienteId, "critico");
  assert.equal(r.proximos.length, 1);
  assert.equal(r.proximos[0].expedienteId, "proximo");
  assert.equal(r.sinPlazo.length, 1);
  assert.equal(r.sinPlazo[0].id, "tranquilo");
});

test("un expediente sin hechos no inventa plazos", () => {
  assert.equal(plazosDe(exp([]), HOY).length, 0);
});

test("cada plazo cita la norma que lo establece", () => {
  const p = plazosDe(
    exp([
      { tipo: "presentacion", fecha: "2026-06-30" },
      { tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "denegatoria" },
    ]),
    HOY,
  );
  for (const plazo of p) {
    assert.ok(plazo.norma, `${plazo.origen} debe citar su norma`);
    assert.ok(plazo.norma.norma.length > 10);
  }
});

test("una resolución notificada supera el silencio: no se avisa de los dos", () => {
  const p = plazosDe(
    exp([
      { tipo: "presentacion", fecha: "2026-05-20" },
      { tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "denegatoria" },
    ]),
    HOY,
  );
  assert.equal(
    p.some((x) => x.origen === "silencio"),
    false,
    "el silencio queda superado por la resolución expresa",
  );
  assert.deepEqual(
    p.map((x) => x.origen),
    ["reposicion", "contencioso"],
  );
});

test("sin resolución, el silencio sí se vigila", () => {
  const p = plazosDe(exp([{ tipo: "presentacion", fecha: "2026-05-20" }]), HOY);
  assert.equal(p[0].origen, "silencio");
});

test("una resolución favorable también supera el silencio y no abre recursos", () => {
  const p = plazosDe(
    exp([
      { tipo: "presentacion", fecha: "2026-05-20" },
      { tipo: "resolucion-notificada", fecha: "2026-09-01", sentido: "favorable" },
    ]),
    HOY,
  );
  assert.equal(p.length, 0, "ni silencio ni recursos: no hay nada que vigilar");
});
