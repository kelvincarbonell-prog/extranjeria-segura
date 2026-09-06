import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aperturaRenovacion,
  plazoPrincipal,
  plazosDe,
  vigilar,
  type Expediente,
} from "./vigilancia";
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

/* ------------------------------------------------------------------ *
 * plazoPrincipal: el reloj que manda en cada expediente
 * ------------------------------------------------------------------ */

test("el plazo principal es el que menos margen deja", () => {
  const mapa = plazoPrincipal(
    [
      exp(
        [
          { tipo: "caducidad-tarjeta", fecha: "2026-11-15" },
          { tipo: "requerimiento-notificado", fecha: "2026-09-02" },
        ],
        "e1",
      ),
    ],
    HOY,
  );

  assert.equal(mapa.get("e1")?.origen, "requerimiento", "el requerimiento vence mucho antes");
});

test("un plazo vencido manda sobre uno abierto", () => {
  // Es la parte que se hace mal por instinto: lo vencido parece pasado y se
  // manda al final. Es al revés — exige una decisión hoy.
  const mapa = plazoPrincipal(
    [
      exp(
        [
          { tipo: "requerimiento-notificado", fecha: "2026-08-01" },
          { tipo: "caducidad-documento", fecha: "2026-09-20", etiqueta: "Antecedentes penales" },
        ],
        "e1",
      ),
    ],
    HOY,
  );

  const p = mapa.get("e1");
  assert.equal(p?.origen, "requerimiento");
  assert.equal(p?.cuenta.estado, "vencido");
});

test("un expediente sin hechos no aparece en el mapa", () => {
  // Ausente y «cero días» no son lo mismo. La tabla ordena por este número y
  // un cero colaría un expediente tranquilo en cabeza de la lista de urgentes.
  const mapa = plazoPrincipal([exp([], "e1")], HOY);
  assert.equal(mapa.has("e1"), false);
  assert.equal(mapa.size, 0);
});

test("cada expediente tiene su propio reloj, no el del vecino", () => {
  const mapa = plazoPrincipal(
    [
      exp([{ tipo: "requerimiento-notificado", fecha: "2026-09-02" }], "e1"),
      exp([{ tipo: "presentacion", fecha: "2026-06-30" }], "e2"),
      exp([], "e3"),
    ],
    HOY,
  );

  assert.equal(mapa.size, 2);
  assert.equal(mapa.get("e1")?.origen, "requerimiento");
  assert.equal(mapa.get("e2")?.origen, "silencio");
  assert.equal(mapa.get("e1")?.expedienteId, "e1");
  assert.equal(mapa.get("e2")?.expedienteId, "e2");
});

test("el plazo principal coincide con lo que vigilar() considera urgente", () => {
  // Las dos funciones alimentan pantallas distintas del mismo panel. Si
  // discreparan, la alerta de inicio y la lista de plazos dirían cosas
  // distintas sobre el mismo expediente, que es justo lo que se venía a
  // arreglar.
  const expedientes = [
    exp([{ tipo: "requerimiento-notificado", fecha: "2026-08-01" }], "e1"),
    exp([{ tipo: "presentacion", fecha: "2026-06-30" }], "e2"),
    exp([], "e3"),
  ];

  const mapa = plazoPrincipal(expedientes, HOY);
  const { vencidos, sinPlazo } = vigilar(expedientes, HOY);

  const vencidosSegunMapa = [...mapa.values()]
    .filter((p) => p.cuenta.estado === "vencido")
    .map((p) => p.expedienteId);

  assert.deepEqual(
    vencidosSegunMapa,
    [...new Set(vencidos.map((p) => p.expedienteId))],
    "los expedientes vencidos son los mismos por las dos vías",
  );
  assert.deepEqual(
    sinPlazo.map((e) => e.id),
    expedientes.filter((e) => !mapa.has(e.id)).map((e) => e.id),
  );
});
