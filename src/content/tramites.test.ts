import test from "node:test";
import assert from "node:assert/strict";

import { TRAMITES, TRAMITE_MAP } from "./tramites";
import { CATEGORY_MAP } from "./taxonomy";
import { OFFICIAL_SOURCES } from "./site";

/**
 * EL CATÁLOGO SE SOSTIENE SOLO.
 *
 * Con doce fichas nuevas enlazándose entre sí y con las antiguas, un slug mal
 * escrito en `related` no rompe nada: la página filtra el `undefined` y la
 * ficha relacionada simplemente no aparece. Nadie lo nota hasta que alguien
 * echa en falta el enlace. Aquí falla en el acto.
 */

test("no hay dos fichas con el mismo slug", () => {
  const vistos = new Set<string>();
  for (const t of TRAMITES) {
    assert.ok(!vistos.has(t.slug), `«${t.slug}» está repetido`);
    vistos.add(t.slug);
  }
});

test("cada ficha relacionada existe y no es la propia ficha", () => {
  for (const t of TRAMITES) {
    for (const r of t.related) {
      assert.ok(TRAMITE_MAP[r], `«${t.slug}» enlaza a «${r}», que no existe`);
      assert.notEqual(r, t.slug, `«${t.slug}» se enlaza a sí misma`);
    }
  }
});

test("categorías y fuentes citadas existen", () => {
  for (const t of TRAMITES) {
    for (const c of [t.category, ...(t.alsoIn ?? [])]) {
      assert.ok(CATEGORY_MAP[c], `«${t.slug}» usa la categoría «${c}», que no existe`);
    }
    for (const s of t.sources) {
      assert.ok(OFFICIAL_SOURCES[s], `«${t.slug}» cita la fuente «${s}», que no existe`);
    }
  }
});

test("ninguna categoría se queda vacía", () => {
  // Una categoría sin fichas es una página de listado en blanco enlazada desde
  // la portada, el menú y el pie.
  for (const id of Object.keys(CATEGORY_MAP)) {
    const n = TRAMITES.filter((t) => t.category === id || t.alsoIn?.includes(id as never)).length;
    assert.ok(n > 0, `la categoría «${id}» no tiene fichas`);
  }
});
