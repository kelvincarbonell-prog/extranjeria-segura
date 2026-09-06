import { test } from "node:test";
import assert from "node:assert/strict";
import { componerRecordatorio, RECORDATORIOS } from "./recordatorios";
import { LOCALES } from "@/i18n/config";

const BASE = {
  cliente: "María",
  tramite: "Arraigo sociolaboral",
  documentos: [
    { nombre: "Certificado de antecedentes penales", nota: "Apostillado y traducido" },
    { nombre: "Vida laboral actualizada" },
  ],
};

test("los ocho idiomas tienen plantilla completa", () => {
  // Se comprueba que no falta nada, no cuántos caracteres ocupa. La primera
  // versión exigía más de diez caracteres y falló con el chino: «还缺的材料：»
  // son seis y está completo. Contar caracteres no mide completitud en una
  // lengua donde cada uno es una palabra.
  for (const l of LOCALES) {
    const p = RECORDATORIOS[l];
    assert.ok(p, `falta la plantilla de ${l}`);
    for (const clave of ["listaTitulo", "comoEnviar", "cierre"] as const) {
      assert.ok(p[clave].trim().length > 0, `${l}.${clave} está vacío`);
    }
    assert.ok(p.saludo("X").includes("X"), `${l}.saludo no usa el nombre`);
    assert.ok(p.intro("Y").includes("Y"), `${l}.intro no usa el trámite`);
    assert.ok(p.item("Z").includes("Z"), `${l}.item no usa el documento`);
    assert.ok(p.plazo(3, "F").includes("F"), `${l}.plazo no usa la fecha`);
  }
});

test("el mensaje incluye el nombre, el trámite y todos los documentos", () => {
  for (const l of LOCALES) {
    const m = componerRecordatorio({ ...BASE, locale: l });
    assert.ok(m.includes("María"), `${l}: falta el nombre`);
    assert.ok(m.includes("Arraigo sociolaboral"), `${l}: falta el trámite`);
    for (const d of BASE.documentos) {
      assert.ok(m.includes(d.nombre), `${l}: falta el documento «${d.nombre}»`);
    }
  }
});

test("los nombres de documento se mantienen en español en todos los idiomas", () => {
  // Es deliberado: así aparecen en la lista que le van a pedir en la oficina.
  // Traducirlos haría que el cliente buscara un documento cuyo nombre real no
  // reconoce.
  const zh = componerRecordatorio({ ...BASE, locale: "zh" });
  assert.ok(zh.includes("Certificado de antecedentes penales"));
  const ar = componerRecordatorio({ ...BASE, locale: "ar" });
  assert.ok(ar.includes("Vida laboral actualizada"));
});

test("el plazo aparece solo cuando lo hay", () => {
  const sin = componerRecordatorio({ ...BASE, locale: "es" });
  const con = componerRecordatorio({
    ...BASE,
    locale: "es",
    plazo: { dias: 6, fecha: "12 de septiembre de 2026" },
  });
  assert.ok(!sin.includes("12 de septiembre"));
  assert.ok(con.includes("12 de septiembre"));
  assert.ok(con.includes("6 días"));
});

test("un solo día se escribe en singular", () => {
  const m = componerRecordatorio({
    ...BASE,
    locale: "es",
    plazo: { dias: 1, fecha: "7 de septiembre de 2026" },
  });
  assert.ok(m.includes("1 día"), "debe decir «1 día», no «1 días»");
  assert.ok(!m.includes("1 días"));
});

test("la nota de un documento se incluye cuando existe", () => {
  const m = componerRecordatorio({ ...BASE, locale: "es" });
  assert.ok(m.includes("Apostillado y traducido"));
});

test("ninguna plantilla promete un resultado", () => {
  // Un mensaje automático no puede afirmar cómo va a salir el expediente.
  const prohibidas = /garantiz|asegur|seguro que|con éxito|aprobad|guarantee|approved/i;
  for (const l of LOCALES) {
    const m = componerRecordatorio({
      ...BASE,
      locale: l,
      plazo: { dias: 5, fecha: "x" },
    });
    assert.ok(!prohibidas.test(m), `${l} contiene una promesa de resultado`);
  }
});

test("el español no repite el aviso de idioma", () => {
  // «Puedes responder en español» sobra escribiendo desde un despacho español.
  assert.equal(RECORDATORIOS.es.idioma, "");
  assert.ok(RECORDATORIOS.ar.idioma.length > 0, "el resto sí lo lleva");
});

test("sin documentos pendientes el mensaje sigue siendo coherente", () => {
  const m = componerRecordatorio({ ...BASE, documentos: [], locale: "es" });
  assert.ok(m.includes("María"));
  assert.ok(m.includes("Lo que falta:"));
});
