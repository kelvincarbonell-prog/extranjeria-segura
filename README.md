# Extranjería Segura

Plataforma digital de extranjería. Next.js 16 · React 19 · TypeScript ·
Tailwind CSS v4 · Supabase.

> **Tu vida en España. Nosotros resolvemos los papeles.**

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local     # rellena lo que necesites
npm run dev
```

La aplicación funciona sin ninguna variable de entorno: el área privada y el
panel interno se sirven en **modo demostración**, identificado como tal en cada
pantalla. Al configurar Supabase, la autenticación real se activa sola.

```bash
npm run build      # compilación de producción
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

### Base de datos

```bash
supabase link --project-ref <ref>
supabase db push
```

Detalle en [`supabase/README.md`](supabase/README.md).

---

## Despliegue

Es automático y no requiere ningún paso manual.

| Rama | Qué ocurre | Dónde aparece |
| --- | --- | --- |
| `main` | Vercel construye y publica en producción | El dominio del proyecto |
| Cualquier otra | Vercel construye y publica un preview | Comentario de Vercel en el PR |

Delante del despliegue hay una puerta: `.github/workflows/ci.yml` ejecuta
`typecheck`, `lint` y `build` en cada PR y en cada push a `main`. El build es la
comprobación que más cosas atrapa, porque genera las 177 páginas estáticas: un
error en el contenido de un trámite o en una combinación de SEO programático
falla ahí y no en producción.

> **Para que la puerta cierre de verdad**, hay que activar la protección de rama
> en GitHub: *Settings → Branches → Add rule → `main`*, marcando **Require
> status checks to pass before merging** y seleccionando el check `verificar`.
> Sin eso, CI informa pero no impide fusionar.

### Variables de entorno

El proyecto compila y funciona sin ninguna. Las integraciones desactivadas lo
indican en pantalla en vez de fallar. Cuando quieras activar alguna, copia las
claves de [`.env.example`](.env.example) en *Vercel → Settings → Environment
Variables* y vuelve a desplegar.

La única que conviene fijar desde el principio es `NEXT_PUBLIC_SITE_URL`: se usa
para las URL canónicas, el sitemap y las etiquetas Open Graph.

---

## Estructura

```
src/
  app/
    (marketing)/          landing, trámites, precios, recursos, legal, SEO programático
    diagnostico/          Immigration Check (wizard + resultado)
    app/                  área privada del cliente
    admin/                panel interno y CRM
    entrar, crear-cuenta, bienvenida
  components/
    brand/                isotipo, lockups, set de glifos propio
    ui/                   Button, Card, Badge, Progress, Avatar, LegalNote…
    motion/               Reveal, TextReveal, Magnetic, Tilt, CountUp, CheckDraw
    marketing/ check/ app/ admin/ calculators/ auth/
  content/                capa de dominio: catálogo, motor, precios, roles, legal
  lib/                    utilidades, clientes Supabase, stores externos
supabase/migrations/      esquema, RLS, triggers y storage
```

`src/content/` es la capa de dominio y no importa React: el catálogo de
trámites, el grafo de preguntas, el motor de orientación y los precios son datos
que el equipo jurídico puede editar sin tocar componentes.

---

## Decisiones que explican el resto del código

### 1. Nada inventado, nunca

Es la regla que atraviesa todo el proyecto.

- `src/content/site.ts` contiene los datos de negocio. Las métricas no
  verificables están en `null` **a propósito**, y los componentes muestran el
  estado vacío honesto en vez de una cifra plausible.
- `src/content/reviews.ts` está vacío. `sourceUrl` es obligatorio: una reseña
  que nadie puede comprobar no se almacena.
- El diagnóstico devuelve un **encaje preliminar**, no un porcentaje de éxito.
  No hay modelo estadístico, así que no se imprime un número que lo aparente.
- Los textos legales son plantillas identificadas como tales, con los huecos
  resaltados en pantalla y `noindex` hasta que se firmen.
- Todo dato simulado lleva `<DemoTag/>`.

Lo pendiente está listado en
[`CONTENIDO-PENDIENTE-REVISION.md`](CONTENIDO-PENDIENTE-REVISION.md).

### 2. Orientación ≠ asesoramiento jurídico

La frontera es explícita en producto, no una nota al pie:

- El wizard la enuncia en el pie de cada pantalla.
- El resultado dedica dos tarjetas a «lo que acabas de recibir» frente a «lo que
  todavía no es».
- El asistente del chat escala al especialista en cuanto la consulta toca
  requisitos, plazos o validez, y la escalada es visible en el hilo.
- La lectura automática de documentos se presenta como asistencia; el veredicto
  lo firma un abogado colegiado y queda en una tabla append-only.

### 3. La seguridad la aplica la base de datos

Ocultar un botón no protege un pasaporte.

- RLS en todas las tablas; `FORCE ROW LEVEL SECURITY` en `cases`, `documents`,
  `messages` y `audit_logs`.
- Un único predicado de acceso, `has_case_access()`, gobierna el sistema.
- El perfil comercial queda excluido de la documentación migratoria por
  política, aunque haya originado el lead.
- No existe ningún bucket público en el proyecto. El acceso es por URL firmada
  de 60 segundos y cada descarga escribe un evento de expediente.
- Los objetos son inmutables: una versión nueva es un objeto nuevo.
- El registro de consentimientos y el de auditoría no admiten `UPDATE` ni
  `DELETE`. Retirar un consentimiento escribe una fila nueva.
- Un cliente no puede marcar su propio documento como validado: la política lo
  limita a `pendiente` y `subido`.

### 4. 3D sin WebGL

El objeto del hero y el globo son 3D reales, pero no cargan ninguna librería:

- El **hero** es una escena CSS 3D: cada elemento es un nodo DOM en su propio
  plano Z dentro de un `perspective`. Es seleccionable, traducible y accesible;
  el fallback de `prefers-reduced-motion` es el mismo marcado con las
  transformaciones neutralizadas, no un componente peor.
- El **globo** proyecta una esfera y arcos de círculo máximo sobre un canvas 2D
  con trigonometría propia (~150 líneas), y deja de pintar cuando sale de
  pantalla.

Un `three.js` habría añadido cientos de KB a una página de marketing que debe
mantenerse por encima de 90 en Lighthouse.

### 5. Movimiento con freno

Todas las primitivas de `components/motion` consultan `useReducedMotion()`. El
confeti no se renderiza en absoluto con movimiento reducido: un destello
celebratorio es un riesgo de accesibilidad, y esa pantalla se alcanza con la
ansiedad de quien se juega su situación administrativa.

### 6. Móvil diseñado, no recortado

El área privada tiene una barra inferior propia con los cinco destinos que
importan en un teléfono y un botón flotante contextual que cambia con el estado
del expediente. Ambas versiones comparten el mismo árbol de rutas: nada queda
inalcanzable en ninguna de las dos.

### 7. SEO programático sin páginas basura

Las 98 páginas de `/{trámite}-{ciudad}` y `/{trámite}-{nacionalidad}` solo se
generan cuando **ambos lados aportan datos propios**: qué administración emite
el informe de arraigo en ese territorio, qué ruta de legalización sigue ese país,
qué plazo de nacionalidad le corresponde. Con `dynamicParams = false`, cualquier
otra combinación es un 404 real en lugar de una página de relleno.

---

## Sistema de diseño

Todo vive en `src/app/globals.css` como tokens de Tailwind v4. Ningún
componente codifica un color, un radio o una sombra a mano.

- **Color:** rampa de tintas neutras frías, azul de marca con el tono fijado en
  228°, y tres colores de señal que se usan **solo** para estado, nunca para
  decorar.
- **Tipografía:** Manrope para display, Inter para texto, JetBrains Mono para
  datos (referencias, importes, porcentajes), siempre tabular.
- **Movimiento:** un único vocabulario de curvas (`--ease-out-expo`,
  `--ease-out-quart`, `--ease-spring`).
- **Marca:** isotipo «El Umbral» — un arco (puerta y escudo) con un camino
  calado que sube como un check y **atraviesa** el borde superior derecho. Una
  silueta cerrada con un solo canal sustractivo, legible a 16 px y en un color.
- **Iconografía:** set geométrico propio en `components/brand/Glyph.tsx`,
  dibujado sobre la misma retícula de 24. Sin emoji, sin mazos de juez, sin
  balanzas cliché.

---

## Estado de las integraciones

| Integración | Estado |
| --- | --- |
| Supabase | Esquema, RLS, triggers y storage completos. Falta configurar el proyecto. |
| Stripe | Modelo de datos y claves de producto listos. Sin activar. |
| Resend | Sin activar. |
| OCR documental | Interfaz y estados listos. Sin proveedor. |
| Videollamada y calendario | Interfaz lista. Sin proveedor. |
| PWA | Manifest, iconos y accesos directos listos. Instalable. |

Cada integración inactiva lo **dice en pantalla**. Ninguna se simula.

---

## Accesibilidad

WCAG 2.2 AA como objetivo: navegación completa por teclado (incluido el tablero
CRM, que se opera con flechas), foco visible siempre, `aria-live` en el wizard,
`prefers-reduced-motion` y `prefers-contrast` respetados, y contraste verificado
en el texto de gran tamaño.

---

## El proyecto anterior

Los dos prototipos HTML originales se conservan en [`legacy/`](legacy/) como
referencia funcional. No se sirven.
