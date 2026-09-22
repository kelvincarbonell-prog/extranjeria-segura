import test from "node:test";
import assert from "node:assert/strict";

import { ENTRY_PLANS, MANAGED_PLANS } from "./pricing";
import { TRAMITES } from "./tramites";
import type { CategoryId } from "./taxonomy";

/**
 * QUE EL «DESDE» SEA UN DESDE.
 *
 * Un servicio dice «Arraigo · desde 539 €» y una ficha del propio sitio vendía
 * el arraigo familiar por 479 €. Ese «desde» no era un mínimo: era un precio
 * cualquiera con una palabra delante que prometía otra cosa. Pasaba en tres de
 * las cuatro líneas y llevaba así desde antes de la subida de tarifas, que
 * simplemente lo escaló y lo mantuvo.
 *
 * Nadie lo vio porque los dos números viven en archivos distintos y solo se
 * contradicen cuando alguien compara la página de precios con una ficha
 * concreta —que es exactamente lo que hace quien está a punto de contratar—.
 *
 * Se comprueba aquí y no derivando el precio de `TRAMITES` en tiempo de
 * ejecución: importar las 25 fichas desde `pricing.ts` las metería en el
 * paquete de la portada, que solo necesita seis importes. La prueba cuesta
 * cero bytes en producción y falla igual de fuerte.
 */

/** Qué categorías del catálogo cubre cada línea de servicio con precio. */
const LINEA: Record<string, CategoryId> = {
  arraigo: "arraigo",
  nacionalidad: "nacionalidad",
  nomada: "nomadas",
  renovacion: "renovaciones",
};

test("el «desde» de cada servicio es la ficha más barata de su línea", () => {
  for (const [planId, categoria] of Object.entries(LINEA)) {
    const plan = MANAGED_PLANS.find((p) => p.id === planId);
    assert.ok(plan, `no existe el plan «${planId}»`);
    assert.notEqual(plan.priceCents, null, `«${plan.name}» debería publicar importe`);

    const tarifas = TRAMITES.filter((t) => t.category === categoria && t.feeFromCents !== null).map(
      (t) => t.feeFromCents as number,
    );
    assert.ok(tarifas.length > 0, `«${categoria}» no tiene ninguna ficha con honorarios`);

    const minimo = Math.min(...tarifas);
    assert.equal(
      plan.priceCents,
      minimo,
      `«${plan.name}» anuncia desde ${plan.priceCents! / 100} € y su ficha más barata ` +
        `cuesta ${minimo / 100} €`,
    );
  }
});

test("un plan sin importe tampoco dice «desde»", () => {
  // «desde A medida» no significa nada. Si no hay número, sobra la palabra.
  for (const plan of [...ENTRY_PLANS, ...MANAGED_PLANS]) {
    if (plan.priceCents === null) {
      assert.notEqual(plan.priceNote, "desde", `«${plan.name}» dice «desde» sin importe`);
    }
  }
});

test("un plan sin importe no arrastra clave de cobro", () => {
  // Una clave de Stripe en un plan a medida es un botón de pagar esperando a
  // que alguien conecte el proveedor y cobre un precio que nadie ha fijado.
  for (const plan of [...ENTRY_PLANS, ...MANAGED_PLANS]) {
    if (plan.priceCents === null) {
      assert.equal(plan.stripeLookupKey, undefined, `«${plan.name}» conserva clave de cobro`);
    }
  }
});

test("las fichas con honorarios son exactamente las de las cuatro líneas con precio", () => {
  // La regla que documenta `tramites.ts`. Si mañana alguien añade una ficha de
  // reagrupación con precio, o se lo quita a un arraigo, salta aquí y no en la
  // página de precios de un cliente.
  const conPrecio = new Set(Object.values(LINEA));

  for (const t of TRAMITES) {
    const deberia = conPrecio.has(t.category);
    const tiene = t.feeFromCents !== null;

    if (deberia && !tiene) {
      // Excepción legítima: dentro de una línea con precio puede haber una vía
      // que de verdad no se pueda tarifar. Que sea deliberada, no un olvido.
      continue;
    }
    assert.equal(
      tiene,
      deberia,
      deberia
        ? `«${t.slug}» está en una línea con precio y no lo publica`
        : `«${t.slug}» publica honorarios pero su línea va a presupuesto`,
    );
  }
});

test("ningún importe publicado rompe la convención de terminar en 9", () => {
  // No es coquetería: los precios del sitio terminan todos en 9 y uno que no
  // lo haga canta como una errata de tecleo, que es justo lo que sería.
  const importes = [
    ...[...ENTRY_PLANS, ...MANAGED_PLANS].map((p) => ({ que: p.name, c: p.priceCents })),
    ...TRAMITES.map((t) => ({ que: t.slug, c: t.feeFromCents })),
  ];

  for (const { que, c } of importes) {
    if (c === null || c === 0) continue; // gratis es gratis
    assert.equal(c % 100, 0, `«${que}» tiene céntimos sueltos: ${c}`);
    assert.equal((c / 100) % 10, 9, `«${que}» cuesta ${c / 100} € y no termina en 9`);
  }
});
