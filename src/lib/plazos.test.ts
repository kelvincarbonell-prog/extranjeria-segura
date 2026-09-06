import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aISO,
  cuentaAtras,
  diasEntre,
  fechaLarga,
  parseDia,
  sumarMeses,
  vencimientoPorMeses,
} from "./plazos";

/**
 * El cómputo de plazos es la única parte del producto donde un error de un día
 * cuesta un expediente. Por eso tiene pruebas y el resto de utilidades no.
 *
 * El caso que justifica el archivo entero es el primero: sumar un mes al 31 de
 * enero. `new Date(2026,0,31)` con `setMonth(+1)` devuelve el 3 de marzo,
 * porque JavaScript desborda. El art. 30.4 de la Ley 39/2015 dice que si el
 * día equivalente no existe, el plazo termina el último día del mes. Son tres
 * días de diferencia sobre un plazo de recurso.
 */

test("art. 30.4: si el día equivalente no existe, vence el último día del mes", () => {
  assert.equal(aISO(sumarMeses(parseDia("2026-01-31"), 1)), "2026-02-28");
  assert.equal(aISO(sumarMeses(parseDia("2028-01-31"), 1)), "2028-02-29", "año bisiesto");
  assert.equal(aISO(sumarMeses(parseDia("2026-03-31"), 1)), "2026-04-30");
  assert.equal(aISO(sumarMeses(parseDia("2026-08-31"), 6)), "2027-02-28");
});

test("de fecha a fecha cuando el día sí existe", () => {
  assert.equal(aISO(sumarMeses(parseDia("2026-03-15"), 1)), "2026-04-15");
  assert.equal(aISO(sumarMeses(parseDia("2026-03-15"), 2)), "2026-05-15");
  assert.equal(aISO(sumarMeses(parseDia("2026-11-15"), 3)), "2027-02-15", "cruza el año");
});

test("silencio de la regularización: tres meses desde la presentación", () => {
  // Presentada el último día del plazo: 30 de junio de 2026.
  assert.equal(aISO(vencimientoPorMeses("2026-06-30", 3)), "2026-09-30");
  // Presentada el primer día: 16 de abril.
  assert.equal(aISO(vencimientoPorMeses("2026-04-16", 3)), "2026-07-16");
  // Un 31 que no existe en el mes de destino.
  assert.equal(aISO(vencimientoPorMeses("2026-05-31", 3)), "2026-08-31");
  assert.equal(aISO(vencimientoPorMeses("2026-05-31", 9)), "2027-02-28");
});

test("contencioso frente a acto presunto: seis meses desde el silencio", () => {
  const silencio = vencimientoPorMeses("2026-06-30", 3); // 2026-09-30
  assert.equal(aISO(sumarMeses(silencio, 6)), "2027-03-30");
});

test("recurso frente a resolución expresa: un mes y dos meses", () => {
  assert.equal(aISO(vencimientoPorMeses("2026-09-15", 1)), "2026-10-15", "reposición");
  assert.equal(aISO(vencimientoPorMeses("2026-09-15", 2)), "2026-11-15", "contencioso");
});

test("diasEntre no se descuadra al cruzar el cambio de hora", () => {
  // El último domingo de marzo de 2026 hay cambio horario en España. Trabajar
  // en UTC evita que ese día "dure" 23 horas y se pierda un día en la cuenta.
  assert.equal(diasEntre(parseDia("2026-03-28"), parseDia("2026-03-30")), 2);
  assert.equal(diasEntre(parseDia("2026-10-24"), parseDia("2026-10-26")), 2);
});

test("cuentaAtras clasifica el estado del plazo", () => {
  const desde = parseDia("2026-09-06");

  const abierto = cuentaAtras(parseDia("2026-09-30"), desde);
  assert.equal(abierto.dias, 24);
  assert.equal(abierto.estado, "abierto");
  assert.equal(abierto.critico, false);

  const critico = cuentaAtras(parseDia("2026-09-11"), desde);
  assert.equal(critico.dias, 5);
  assert.equal(critico.critico, true, "siete días o menos");

  const ultimo = cuentaAtras(parseDia("2026-09-06"), desde);
  assert.equal(ultimo.estado, "ultimo-dia");

  const vencido = cuentaAtras(parseDia("2026-09-05"), desde);
  assert.equal(vencido.estado, "vencido");
  assert.equal(vencido.critico, false, "un plazo vencido no es crítico, es otra cosa");
});

test("fechaLarga escribe la fecha como se lee en español", () => {
  assert.equal(fechaLarga(parseDia("2026-09-30")), "30 de septiembre de 2026");
  assert.equal(fechaLarga(parseDia("2026-01-01")), "1 de enero de 2026");
});

test("parseDia no desplaza el día según la zona horaria del servidor", () => {
  // Con `new Date("2026-09-30")` en una zona al oeste de UTC, getDate() puede
  // devolver 29. Por eso se construye explícitamente en UTC.
  assert.equal(parseDia("2026-09-30").getUTCDate(), 30);
  assert.equal(aISO(parseDia("2026-09-30")), "2026-09-30");
});
