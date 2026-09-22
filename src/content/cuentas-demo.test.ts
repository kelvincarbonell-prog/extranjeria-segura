import test from "node:test";
import assert from "node:assert/strict";

import { CUENTAS_DEMO, CONTRASENA_DEMO, USUARIOS_DEMO } from "./demo-sesion";
import { ROLE_MAP, puede } from "./roles";
import { expedientesDemo } from "./demo";
import { site } from "./site";

/**
 * LAS CUATRO CUENTAS DE PRUEBA.
 *
 * Lo que se fija aquí no es que funcionen —eso se comprueba en el navegador—
 * sino las dos cosas que, si se rompen, lo hacen en silencio: que cada cuenta
 * lleve a donde corresponde a su rol, y que el interruptor que las desactiva
 * siga existiendo.
 */

test("hay una cuenta por cada rol que se quiso probar", () => {
  const roles = CUENTAS_DEMO.map((c) => c.rol).sort();
  assert.deepEqual(roles, ["abogado", "admin", "cliente", "colaborador"].sort());
});

test("todas las cuentas comparten la contraseña documentada en pantalla", () => {
  // Si alguien cambia una y no la tarjeta de /entrar, la demostración deja de
  // funcionar para quien la lee. Son el mismo dato en dos sitios.
  for (const c of CUENTAS_DEMO) {
    assert.equal(c.contrasena, CONTRASENA_DEMO, `«${c.email}» no usa la contraseña común`);
  }
});

test("los correos son únicos y están en minúsculas", () => {
  // La búsqueda normaliza a minúsculas; una cuenta escrita con mayúsculas
  // nunca encontraría a su dueño.
  const vistos = new Set<string>();
  for (const c of CUENTAS_DEMO) {
    assert.equal(c.email, c.email.toLowerCase(), `«${c.email}» tiene mayúsculas`);
    assert.equal(vistos.has(c.email), false, `«${c.email}» está repetido`);
    vistos.add(c.email);
  }
});

test("el cliente entra al área de cliente y el resto al panel", () => {
  // Mandar al cliente a /admin sería enseñarle los expedientes de otros; y
  // mandar a un abogado a /app, dejarlo sin su herramienta.
  for (const c of CUENTAS_DEMO) {
    const esperado = c.rol === "cliente" ? "/app" : "/admin";
    assert.equal(c.destino, esperado, `«${c.email}» va a ${c.destino}`);
  }
});

test("ninguna cuenta del panel tiene el rol cliente, que no tiene permisos", () => {
  for (const c of CUENTAS_DEMO) {
    if (c.destino !== "/admin") continue;
    assert.ok(
      ROLE_MAP[c.rol].permisos.length > 0,
      `«${c.email}» entra al panel con un rol sin ningún permiso`,
    );
  }
});

test("el colaborador externo no puede ver documentación migratoria", () => {
  // Es la razón de ser del rol: alguien de fuera del despacho que deriva
  // clientes y no toca un pasaporte.
  assert.equal(puede("colaborador", "documentos"), false);
  assert.equal(puede("colaborador", "expedientes-todos"), false);
  assert.equal(puede("colaborador", "firmar"), false);
});

test("la cuenta de abogado corresponde a un responsable real de los datos", () => {
  // Si el nombre no coincide, entrar como abogada da un panel vacío sin
  // explicar por qué.
  const abogado = CUENTAS_DEMO.find((c) => c.rol === "abogado")!;
  const responsables = new Set(expedientesDemo().map((e) => e.responsable));
  assert.ok(
    responsables.has(abogado.nombre),
    `«${abogado.nombre}» no figura como responsable de ningún expediente`,
  );
});

test("cada cuenta del panel coincide con el usuario de demostración de su rol", () => {
  for (const c of CUENTAS_DEMO) {
    if (c.rol === "cliente") continue;
    assert.equal(
      USUARIOS_DEMO[c.rol as Exclude<typeof c.rol, "cliente">].nombre,
      c.nombre,
      `«${c.email}» y el perfil del rol usan nombres distintos: el recorte a «mis expedientes» fallaría`,
    );
  }
});

test("las cuentas de prueba se desactivan solas si hay autenticación real", () => {
  // La única defensa que vale para una contraseña de juguete es que deje de
  // funcionar al aparecer la de verdad, sin depender de que nadie la borre.
  // Si esta bandera desaparece, el interruptor desaparece con ella.
  assert.equal(
    typeof site.features.supabase,
    "boolean",
    "site.features.supabase es el interruptor que apaga las cuentas de prueba",
  );
});
