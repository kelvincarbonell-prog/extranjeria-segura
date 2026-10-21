import test from "node:test";
import assert from "node:assert/strict";

import { BLOQUEOS } from "./bloqueos";
import { TRAMITES, TRAMITES_BLOQUEADOS, TRAMITE_MAP, TODAS_LAS_FICHAS, getTramite } from "./tramites";
import { CATEGORIES, TODAS_LAS_CATEGORIAS } from "./taxonomy";
import { MANAGED_PLANS, TODOS_LOS_PLANES, ENTRY_PLANS, THIRD_PARTY_COSTS } from "./pricing";
import { CALCULATORS, TODAS_LAS_CALCULADORAS } from "./calculators";
import { QUESTIONS } from "./check-questions";
import { evaluate } from "./check-engine";
import { allLandings } from "./seo-landings";
import { footerNav } from "./site";

/**
 * LA OTRA MITAD DEL CANDADO.
 *
 * `bloqueos.ts` dice qué no se publica. Esto comprueba que de verdad no se
 * publica en ninguna de las superficies que leen el contenido, y que la lista
 * no tiene erratas: un slug mal escrito en la lista de bloqueos no bloquea
 * nada y no da ningún error, que es justo el fallo que nadie ve.
 */

const FICHAS = new Set<string>(BLOQUEOS.tramites);
const CATEGORIAS = new Set<string>(BLOQUEOS.categorias);

test("cada cosa bloqueada existe: la lista no tiene erratas", () => {
  for (const s of BLOQUEOS.tramites) assert.ok(TRAMITE_MAP[s], `ficha «${s}» no existe`);
  for (const c of BLOQUEOS.categorias)
    assert.ok(TODAS_LAS_CATEGORIAS.some((x) => x.id === c), `categoría «${c}» no existe`);
  for (const p of BLOQUEOS.planes)
    assert.ok(TODOS_LOS_PLANES.some((x) => x.id === p), `tarifa «${p}» no existe`);
  for (const c of BLOQUEOS.calculadoras)
    assert.ok(TODAS_LAS_CALCULADORAS.some((x) => x.slug === c), `calculadora «${c}» no existe`);
});

test("las fichas bloqueadas no se publican, pero no se pierden", () => {
  assert.equal(TRAMITES.length + TRAMITES_BLOQUEADOS.length, TODAS_LAS_FICHAS.length);
  for (const t of TRAMITES) assert.ok(!FICHAS.has(t.slug), `«${t.slug}» está bloqueada y se publica`);
  for (const s of FICHAS) {
    assert.equal(getTramite(s), undefined, `getTramite resuelve «${s}»`);
    assert.ok(TRAMITE_MAP[s], `el panel interno ha perdido «${s}»`);
  }
});

test("ninguna ficha publicada enlaza a una bloqueada", () => {
  for (const t of TRAMITES) {
    for (const r of t.related) assert.ok(!FICHAS.has(r), `«${t.slug}» enlaza a «${r}», bloqueada`);
  }
});

test("las categorías bloqueadas no se publican y no les queda ninguna ficha publicada", () => {
  for (const c of CATEGORIES) assert.ok(!CATEGORIAS.has(c.id), `«${c.id}» está bloqueada y se publica`);
  for (const t of TRAMITES) {
    for (const c of [t.category, ...(t.alsoIn ?? [])]) {
      assert.ok(!CATEGORIAS.has(c), `«${t.slug}» se publica dentro de «${c}», que está bloqueada`);
    }
  }
});

test("las tarifas y calculadoras bloqueadas no se publican", () => {
  for (const p of MANAGED_PLANS) assert.ok(!(BLOQUEOS.planes as readonly string[]).includes(p.id), p.id);
  for (const c of CALCULATORS) assert.ok(!(BLOQUEOS.calculadoras as readonly string[]).includes(c.slug), c.slug);
  for (const c of THIRD_PARTY_COSTS) assert.ok(!/nacionalidad/i.test(c.detail), c.label);
});

test("el diagnóstico no ofrece objetivos bloqueados ni recomienda fichas bloqueadas", () => {
  const objetivo = QUESTIONS.find((q) => q.id === "objetivo")!;
  for (const o of objetivo.options) {
    assert.ok(!(BLOQUEOS.objetivos as readonly string[]).includes(o.value), `objetivo «${o.value}»`);
  }

  // Las combinaciones que antes llevaban a nacionalidad, comunitario y recursos.
  const casos = [
    { objetivo: "nacionalidad", situacion: "autorizacion_vigente" },
    { objetivo: "requerimiento", situacion: "autorizacion_caducada" },
    { objetivo: "familia", nacionalidad_region: "ue" },
    { objetivo: "vivir", nacionalidad_region: "ue" },
    { objetivo: "renovar", situacion: "autorizacion_vigente" },
  ];
  for (const respuestas of casos) {
    for (const p of evaluate(respuestas).pathways) {
      assert.ok(!FICHAS.has(p.slug), `${JSON.stringify(respuestas)} recomienda «${p.slug}»`);
    }
  }
});

test("ni el SEO programático, ni el pie, ni las tarifas apuntan a nada bloqueado", () => {
  for (const l of allLandings()) assert.ok(!FICHAS.has(l.tramite.slug), l.slug);

  const hrefs = [
    ...Object.values(footerNav).flatMap((grupo) => grupo.map((l) => l.href)),
    ...[...ENTRY_PLANS, ...MANAGED_PLANS].map((p) => p.cta.href),
  ];
  const prohibidos = [
    ...BLOQUEOS.tramites.map((s) => `/tramites/${s}`),
    ...BLOQUEOS.categorias.map((c) => `/tramites/categoria/${c}`),
    ...BLOQUEOS.calculadoras.map((c) => `/calculadoras/${c}`),
  ];
  for (const h of hrefs) {
    const ruta = h.split(/[?#]/)[0];
    assert.ok(!prohibidos.includes(ruta), `enlace a «${h}», bloqueado`);
  }
});
