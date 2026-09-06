import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, negotiateLocale } from "@/i18n/config";

/**
 * Enrutado por idioma.
 *
 * El español vive en la raíz. Una petición a `/tramites` se **reescribe**
 * internamente a `/es/tramites`: el árbol de rutas es uniforme para el código,
 * pero la URL que ve el usuario —y que Google ya tiene indexada— no se mueve.
 * Reescribir, no redirigir: un 307 en cada visita rompería enlaces compartidos
 * y añadiría un salto a cada carga.
 *
 * El idioma del navegador se negocia solo para *sugerirlo* mediante la
 * cabecera `x-suggested-locale`, nunca para redirigir. Quien pide una URL en
 * español recibe español, venga de donde venga.
 */

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest|json)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que no son páginas: no llevan idioma.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const hasPrefix = Boolean(first && isLocale(first));

  // `/es/...` no debe existir: sería contenido duplicado con la raíz.
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + segments.slice(1).join("/");
    return NextResponse.redirect(url, 308);
  }

  const locale = hasPrefix ? first! : DEFAULT_LOCALE;
  const suggested = negotiateLocale(request.headers.get("accept-language"));

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", pathname);
  // La sugerencia se usa para ofrecer un cambio de idioma, no para forzarlo.
  headers.set("x-suggested-locale", suggested);

  if (hasPrefix) {
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    // Todo menos assets estáticos y rutas internas de Next.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};

