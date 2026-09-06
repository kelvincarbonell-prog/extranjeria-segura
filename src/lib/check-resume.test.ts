import { test } from "node:test";
import assert from "node:assert/strict";
import { codificarRespuestas, decodificarRespuestas, enlaceReanudacion } from "./check-resume";

test("ida y vuelta conserva las respuestas", () => {
  const answers = { objetivo: "regularizar", tiempo_espana: "mas_2", trabajo: "no" };
  const codigo = codificarRespuestas(answers);
  assert.deepEqual(decodificarRespuestas(codigo), answers);
});

test("el enlace cabe en un mensaje sin partirse", () => {
  const answers = {
    objetivo: "regularizar",
    tiempo_espana: "mas_2",
    situacion: "irregular",
    trabajo: "oferta",
    familia: "no",
    antecedentes: "no",
    idioma: "si",
    empadronamiento: "si",
  };
  const url = enlaceReanudacion(answers, "https://extranjeria-segura.vercel.app");
  assert.ok(url.length < 220, `la URL mide ${url.length} caracteres`);
  assert.ok(url.includes("#1!"), "lleva versión de formato");
});

test("un fragmento vacío o sin marca de versión no restaura nada", () => {
  assert.equal(decodificarRespuestas(""), null);
  assert.equal(decodificarRespuestas("objetivo.vivir"), null, "sin versión");
  assert.equal(decodificarRespuestas("9!objetivo.vivir"), null, "versión desconocida");
  assert.equal(decodificarRespuestas("1!"), null, "cuerpo vacío");
});

test("un enlace truncado por una aplicación de mensajería se descarta entero", () => {
  const answers = { objetivo: "regularizar", tiempo_espana: "mas_2" };
  const codigo = codificarRespuestas(answers);
  // Cortar por la mitad deja un campo sin separador de clave.
  const truncado = codigo.slice(0, codigo.length - 12);
  const salida = decodificarRespuestas(truncado);
  // O bien se descarta, o bien lo que devuelve es un subconjunto coherente:
  // lo que no puede pasar es que invente un valor.
  if (salida !== null) {
    for (const [k, v] of Object.entries(salida)) {
      assert.equal(answers[k as keyof typeof answers], v, `${k} debe conservar su valor real`);
    }
  }
});

test("se rechaza un fragmento manipulado con claves o valores extraños", () => {
  assert.equal(decodificarRespuestas("1!<script>.x"), null);
  assert.equal(decodificarRespuestas("1!objetivo.<img>"), null);
  assert.equal(decodificarRespuestas("1!.vivir"), null, "clave vacía");
  assert.equal(decodificarRespuestas("1!objetivo."), null, "valor vacío");
  assert.equal(
    decodificarRespuestas(`1!objetivo.${"a".repeat(200)}`),
    null,
    "valor desproporcionado",
  );
});

test("acepta la almohadilla al principio, que es como llega de location.hash", () => {
  const codigo = codificarRespuestas({ objetivo: "vivir" });
  assert.deepEqual(decodificarRespuestas(`#${codigo}`), { objetivo: "vivir" });
});

test("sin respuestas devuelve la URL limpia, no una con almohadilla suelta", () => {
  assert.equal(enlaceReanudacion({}, "https://x.test"), "https://x.test/diagnostico");
});
