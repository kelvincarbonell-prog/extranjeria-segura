/**
 * AUDITORÍA MÓVIL
 *
 *   npm run audit:movil     (con el servidor levantado en :3000)
 *
 * Comprueba dos cosas en cada ruta, a 360 y 390 px:
 *
 *  1. DESBORDAMIENTO HORIZONTAL. En un móvil, un solo elemento que se salga
 *     ensancha el viewport de maquetación y el navegador renderiza la página
 *     entera reducida. Antes de esta auditoría, /admin se servía a 619px en un
 *     dispositivo de 360: un 58 % de zoom, ilegible. No se ve en una captura
 *     de escritorio, por eso se mide en vez de mirarse.
 *
 *  2. ZONAS TÁCTILES. WCAG 2.2 AA (2.5.8) exige 24×24 px CSS como mínimo.
 *     Este script avisa por debajo de 40 para dejar margen sobre el mínimo.
 *
 * Salida vacía = correcto. Sale con código 1 si encuentra desbordamientos,
 * de modo que puede añadirse al CI cuando interese.
 */

import { lanzarNavegador, esperarServidor } from "./navegador.mjs";

const B = process.env.BASE ?? "http://localhost:3000";
const PAGES = [
  "/", "/diagnostico", "/tramites", "/tramites/arraigo-sociolaboral",
  "/regularizacion-2026", "/regularizacion-2026/subsanacion",
  "/regularizacion-2026/silencio-administrativo", "/calculadoras/plazos-regularizacion",
  "/tramites/categoria/arraigo", "/precios", "/recursos", "/calculadoras",
  "/calculadoras/schengen-90-180", "/como-funciona", "/opiniones", "/seguridad",
  "/contacto", "/empresa", "/citas", "/legal/privacidad",
  "/arraigo-sociolaboral-valencia", "/entrar", "/crear-cuenta", "/bienvenida",
  "/app", "/app/expediente", "/app/documentos", "/app/mensajes", "/app/citas",
  "/app/pagos", "/app/notificaciones", "/app/perfil",
  "/admin", "/admin/pipeline", "/admin/expedientes", "/admin/equipo",
];

// 360 is the narrowest phone worth supporting (Galaxy A-series, older iPhones
// in zoomed display mode). If it works there it works everywhere above.
const WIDTHS = [360, 390];

await esperarServidor(B);
const browser = await lanzarNavegador();
const problems = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    try {
      await page.goto(B + path, { waitUntil: "load", timeout: 25000 });
      await page.waitForTimeout(900);

      const report = await page.evaluate((vw) => {
        const out = { overflow: 0, offenders: [], tiny: [], overlap: [] };

        // 1. Horizontal overflow — the single most common mobile defect.
        const doc = document.documentElement;
        out.overflow = Math.max(0, doc.scrollWidth - vw);

        if (out.overflow > 1) {
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;

            // Ignorar lo que va dentro de un scroller horizontal deliberado
            // —un tablero, una tabla ancha—: ahí desbordar es la intención.
            //
            // Con una excepción que costó encontrar. Un elemento
            // `position: absolute` SIN ancestro posicionado tiene como bloque
            // contenedor el elemento raíz, y entonces el `overflow` del
            // scroller no lo recorta: se coloca donde le toque —a 2.900 px, en
            // el caso real— y ensancha el documento entero. Estar dentro del
            // scroller por parentesco en el DOM no basta para estar dentro de
            // él a efectos de recorte.
            //
            // Sin esta distinción, la auditoría avisaba de 2.347 px de
            // desbordamiento y no señalaba ni un solo culpable, porque el
            // culpable era justo uno de los que se saltaban. Un aviso sin
            // culpable es media auditoría: dice que hay un problema y deja el
            // trabajo entero a quien lo lea.
            let p = el.parentElement;
            let scroller = null;
            let hayAncestroPosicionado = false;
            const posicion = getComputedStyle(el).position;

            while (p && p !== document.body) {
              const s = getComputedStyle(p);
              if (!scroller && (s.overflowX === "auto" || s.overflowX === "scroll")) scroller = p;
              // Lo que crea bloque contenedor para un absoluto: estar
              // posicionado, o llevar transform o filter —que es lo que aplica
              // una animación de layout y por eso conviene contarlo—.
              if (
                !scroller &&
                (s.position !== "static" || s.transform !== "none" || s.filter !== "none")
              ) {
                hayAncestroPosicionado = true;
              }
              if (scroller) break;
              p = p.parentElement;
            }

            const escapaDelScroller =
              scroller && posicion === "absolute" && !hayAncestroPosicionado;

            if (scroller && !escapaDelScroller) continue;
            if (r.right > vw + 1 || r.left < -1) {
              out.offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className?.toString?.() ?? "").slice(0, 110),
                left: Math.round(r.left),
                right: Math.round(r.right),
                text: (el.textContent ?? "").trim().slice(0, 45),
              });
            }
          }
        }

        // 2. Tap targets below the 44px WCAG 2.2 / Apple HIG minimum.
        for (const el of document.querySelectorAll(
          'a, button, [role="button"], input, select, textarea',
        )) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (getComputedStyle(el).display === "none") continue;
          // El enlace de salto es sr-only por diseño y sólo se muestra al
          // recibir foco de teclado; no es una zona táctil.
          if (el.classList.contains("sr-only") || el.closest(".sr-only")) continue;
          // WCAG 2.2 AA (2.5.8) exige 24×24 px CSS. Avisar por debajo de 40
          // marcaba cada botón pequeño que sí cumple y volvía la salida
          // ilegible: el umbral es el requisito, no una preferencia.
          if (r.height < 24 || r.width < 24) {
            out.tiny.push({
              tag: el.tagName.toLowerCase(),
              w: Math.round(r.width),
              h: Math.round(r.height),
              label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40),
            });
          }
        }

        return out;
      }, width);

      // Dedupe offenders: one deep chain reports the same box many times.
      const seen = new Set();
      const offenders = report.offenders.filter((o) => {
        const k = `${o.tag}|${o.cls}|${o.right}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      const tinySeen = new Set();
      const tiny = report.tiny.filter((t) => {
        const k = `${t.tag}|${t.label}|${t.w}x${t.h}`;
        if (tinySeen.has(k)) return false;
        tinySeen.add(k);
        return true;
      });

      if (report.overflow > 1 || tiny.length) {
        problems.push({ width, path, overflow: report.overflow, offenders: offenders.slice(0, 5), tiny: tiny.slice(0, 6) });
      }
    } catch (e) {
      problems.push({ width, path, error: String(e).split("\n")[0].slice(0, 120) });
    }
  }
  await ctx.close();
}

await browser.close();

const overflowing = problems.filter((p) => (p.overflow ?? 0) > 1 || p.error);

if (!problems.length) {
  console.log("Sin problemas detectados en 360 y 390 px.");
} else {
  for (const p of problems) {
    console.log(`\n━━ ${p.width}px  ${p.path}`);
    if (p.error) { console.log("   ERROR:", p.error); continue; }
    if (p.overflow > 1) {
      console.log(`   DESBORDA ${p.overflow}px`);
      for (const o of p.offenders) {
        console.log(`     <${o.tag}> L${o.left} R${o.right}  "${o.text}"`);
        console.log(`        ${o.cls}`);
      }
    }
    if (p.tiny.length) {
      console.log(`   ZONAS TÁCTILES POR DEBAJO DE 24×24 (${p.tiny.length}):`);
      for (const t of p.tiny) console.log(`     <${t.tag}> ${t.w}x${t.h}  "${t.label}"`);
    }
  }
}

if (overflowing.length) {
  console.log(`\n${overflowing.length} ruta(s) con desbordamiento horizontal.`);
  process.exit(1);
}
