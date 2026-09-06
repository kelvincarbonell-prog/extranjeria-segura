import test from "node:test";
import assert from "node:assert/strict";

import { QUESTIONS } from "@/content/check-questions";
import { LOCALES, type Locale } from "@/i18n/config";
import { traduccionPreguntas, resolverPregunta } from "./index";

/**
 * COMPROBACIONES DEL CUESTIONARIO TRADUCIDO.
 *
 * El tipo `TraduccionPreguntas` se deriva del grafo y ya obliga a que estén
 * las doce preguntas. Lo que el tipo *no* puede comprobar es lo de dentro:
 * `options` es un `Record<string, …>`, así que una clave mal escrita
 * (`conyeuge_espanol` en lugar de `conyuge_espanol`) tipa perfectamente y se
 * traduce en una opción que sale en español sin que nadie se entere. Pasó de
 * verdad en el ruso. Estas pruebas cubren ese hueco.
 */

const NO_ESPANOL = LOCALES.filter((l): l is Exclude<Locale, "es"> => l !== "es");

test("los ocho idiomas del sitio tienen el cuestionario traducido", () => {
  // Añadir un idioma a LOCALES no rompe ningún tipo: serviría español sin
  // aviso. Este es el único sitio donde eso falla.
  for (const locale of NO_ESPANOL) {
    assert.ok(
      traduccionPreguntas(locale),
      `falta src/i18n/preguntas/${locale}.ts — el idioma está en LOCALES pero el cuestionario caería al español`,
    );
  }
});

test("cada traducción cubre todas las opciones de cada pregunta", () => {
  for (const locale of NO_ESPANOL) {
    const trad = traduccionPreguntas(locale);
    assert.ok(trad);

    for (const q of QUESTIONS) {
      const t = trad[q.id];
      assert.ok(t, `${locale}: falta la pregunta «${q.id}»`);

      for (const o of q.options) {
        assert.ok(
          t.options[o.value]?.label,
          `${locale}: falta la opción «${o.value}» de «${q.id}»`,
        );
      }
    }
  }
});

test("ninguna traducción inventa opciones que el grafo no tiene", () => {
  // El fallo real: una clave con una letra de más traduce una opción
  // inexistente y deja la de verdad en español. Sin esta comprobación es
  // invisible hasta que un usuario ve la mezcla.
  for (const locale of NO_ESPANOL) {
    const trad = traduccionPreguntas(locale);
    assert.ok(trad);

    for (const q of QUESTIONS) {
      const validas = new Set(q.options.map((o) => o.value));
      for (const clave of Object.keys(trad[q.id].options)) {
        assert.ok(
          validas.has(clave),
          `${locale}: «${clave}» no es una opción de «${q.id}» (¿errata?)`,
        );
      }
    }
  }
});

test("una pregunta resuelta en un idioma traducido no queda marcada como española", () => {
  for (const locale of NO_ESPANOL) {
    const trad = traduccionPreguntas(locale);
    for (const q of QUESTIONS) {
      const r = resolverPregunta(q, trad, locale);
      assert.equal(r.enEspanol, false, `${locale}: «${q.id}» sin traducir`);
      for (const o of r.options) {
        assert.equal(o.enEspanol, false, `${locale}: opción «${o.value}» de «${q.id}» sin traducir`);
      }
    }
  }
});

test("sin traducción se sirve español y se marca como español", () => {
  // El respaldo tiene que seguir marcando el idioma del fragmento: dentro de
  // una página en árabe, una frase española sin marcar la reordena el
  // algoritmo bidi y los signos de interrogación saltan al otro extremo.
  const q = QUESTIONS[0];
  const r = resolverPregunta(q, null, "ar");

  assert.equal(r.enEspanol, true);
  assert.equal(r.title, q.title);
  assert.ok(r.options.every((o) => o.enEspanol));
});

test("el español propiamente dicho nunca se marca", () => {
  const r = resolverPregunta(QUESTIONS[0], null, "es");
  assert.equal(r.enEspanol, false);
  assert.ok(r.options.every((o) => !o.enEspanol));
});

test("ninguna traducción deja el texto español tal cual", () => {
  // Un `label` idéntico al español en un idioma que no comparte raíz con él
  // es copia-pega, no traducción. Dos excepciones, ambas legítimas:
  //
  //  · «Padrón» se deja a propósito en español en los ocho idiomas: es la
  //    palabra que la persona va a ver escrita así en la ventanilla.
  //  · «No» se escribe igual en inglés y en español. Es coincidencia, no
  //    descuido, y no hay forma de distinguirlas salvo enumerarla.
  const COINCIDEN = new Set(["Padrón", "No"]);

  for (const locale of ["en", "ar", "ru", "zh"] as const) {
    const trad = traduccionPreguntas(locale);
    assert.ok(trad);

    for (const q of QUESTIONS) {
      const t = trad[q.id];
      assert.notEqual(t.title, q.title, `${locale}: «${q.id}» conserva el título español`);

      for (const o of q.options) {
        const to = t.options[o.value];
        if (to && !COINCIDEN.has(o.label)) {
          assert.notEqual(
            to.label,
            o.label,
            `${locale}: la opción «${o.value}» de «${q.id}» conserva el texto español`,
          );
        }
      }
    }
  }
});
