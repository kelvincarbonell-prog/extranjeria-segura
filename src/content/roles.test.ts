import test from "node:test";
import assert from "node:assert/strict";

import { ROLES, ROLE_MAP, puede, type Permiso } from "./roles";
import { USUARIOS_DEMO, ROL_DEMO_INICIAL } from "./demo-sesion";
import { expedientesDemo, DEMO_PIPELINE } from "./demo";
import { filtrarAsignados, filtrarAsignadosPorOwner } from "@/lib/mis-expedientes";

/**
 * QUE LOS PERMISOS DIGAN LO MISMO QUE LA FICHA DEL ROL.
 *
 * /admin/equipo enseña `can` y `cannot` en prosa, y el panel decide con
 * `permisos`. Son dos copias de la misma verdad en formatos distintos, y dos
 * copias divergen: basta con que alguien añada una capacidad al texto y se
 * olvide del array para que la pantalla prometa algo que el código no da.
 *
 * Aquí se fija lo que no puede contradecirse, sin pretender comparar frases
 * con identificadores: las promesas concretas que el texto hace y el código
 * tiene que cumplir.
 */

/** Frases de `cannot` que deben corresponderse con un permiso ausente. */
const PROHIBICIONES: { rol: string; frase: RegExp; permiso: Permiso }[] = [
  { rol: "admin", frase: /Firmar expedientes/i, permiso: "firmar" },
  { rol: "abogado", frase: /Modificar precios o configuración/i, permiso: "configuracion" },
  { rol: "gestor", frase: /Presentar expedientes/i, permiso: "firmar" },
  { rol: "gestor", frase: /Dar por validado un documento/i, permiso: "validar-documentos" },
  { rol: "paralegal", frase: /Validar documentos definitivamente/i, permiso: "validar-documentos" },
  { rol: "paralegal", frase: /Comunicarse con la Administración/i, permiso: "administracion" },
  { rol: "comercial", frase: /documentación migratoria/i, permiso: "documentos" },
  { rol: "comercial", frase: /pasaportes, antecedentes/i, permiso: "documentos" },
];

test("cada prohibición escrita en la ficha es un permiso que el rol no tiene", () => {
  for (const { rol, frase, permiso } of PROHIBICIONES) {
    const def = ROLES.find((r) => r.id === rol);
    assert.ok(def, `no existe el rol «${rol}»`);
    assert.ok(
      def.cannot.some((c) => frase.test(c)),
      `«${rol}» ya no dice «${frase.source}»: revisa si la prohibición sigue vigente`,
    );
    assert.equal(
      puede(def.id, permiso),
      false,
      `«${rol}» dice que no puede «${frase.source}» y tiene el permiso «${permiso}»`,
    );
  }
});

test("solo el abogado firma y valida", () => {
  // Es la regla que sostiene el producto entero: el responsable jurídico es
  // quien responde del expediente. Si algún día otro rol la hereda, que sea
  // una decisión y no un descuido de tecleo.
  for (const permiso of ["firmar", "validar-documentos"] as const) {
    const quienes = ROLES.filter((r) => r.permisos.includes(permiso)).map((r) => r.id);
    assert.deepEqual(quienes, ["abogado"], `«${permiso}» lo tiene: ${quienes.join(", ")}`);
  }
});

test("el comercial no ve ni un documento migratorio", () => {
  assert.equal(puede("comercial", "documentos"), false);
  // Y sin `expedientes-todos`, para que tampoco los alcance por la lista.
  assert.equal(puede("comercial", "expedientes-todos"), false);
});

test("el cliente no tiene ningún permiso del panel interno", () => {
  assert.deepEqual(ROLE_MAP.cliente.permisos, []);
});

/* ------------------------------------------------------------------ *
 * El recorte a «mis expedientes»
 * ------------------------------------------------------------------ */

test("quien no tiene expedientes-todos ve solo los suyos", () => {
  const mios = filtrarAsignados(expedientesDemo(), "abogado");
  const yo = USUARIOS_DEMO.abogado.nombre;

  assert.ok(mios.length > 0, "el abogado de demostración debe tener expedientes asignados");
  assert.ok(mios.length < expedientesDemo().length, "no puede verlos todos");
  assert.ok(
    mios.every((e) => e.responsable === yo),
    "se ha colado un expediente de otra persona",
  );
});

test("quien sí lo tiene los ve todos", () => {
  for (const rol of ["admin", "gestor"] as const) {
    assert.equal(filtrarAsignados(expedientesDemo(), rol).length, expedientesDemo().length);
  }
});

test("el recorte por `owner` da el mismo resultado que por `responsable`", () => {
  // Las tarjetas del pipeline llaman `owner` a lo que el expediente llama
  // `responsable`. Si los dos nombres se desincronizaran, una pantalla
  // enseñaría expedientes que la otra oculta, que es la peor forma de fallar:
  // en silencio y solo en una de las dos.
  const porResponsable = filtrarAsignados(expedientesDemo(), "abogado").map((e) => e.id).sort();
  const porOwner = filtrarAsignadosPorOwner(DEMO_PIPELINE, "abogado")
    .map((c) => c.id)
    .filter((id) => expedientesDemo().some((e) => e.id === id))
    .sort();

  assert.deepEqual(porOwner, porResponsable);
});

test("el usuario de demostración de cada rol existe y tiene nombre", () => {
  for (const rol of ROLES) {
    if (rol.id === "cliente") continue;
    const u = USUARIOS_DEMO[rol.id];
    assert.ok(u, `falta el usuario de demostración de «${rol.id}»`);
    assert.equal(u.rol, rol.id);
    assert.ok(u.nombre.length > 0 && u.puesto.length > 0);
  }
});

test("el abogado de demostración coincide con un responsable real de los datos", () => {
  // Si el nombre no coincide, `filtrarAsignados` devuelve cero y el panel sale
  // vacío sin decir por qué. Es el fallo más fácil de introducir aquí.
  const responsables = new Set(expedientesDemo().map((e) => e.responsable));
  assert.ok(
    responsables.has(USUARIOS_DEMO[ROL_DEMO_INICIAL as "abogado"].nombre),
    `«${USUARIOS_DEMO.abogado.nombre}» no figura como responsable de ningún expediente`,
  );
});
