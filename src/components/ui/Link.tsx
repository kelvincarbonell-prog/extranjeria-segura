"use client";

import * as React from "react";
import NextLink from "next/link";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { useOptionalLocale } from "@/i18n/LocaleProvider";

/**
 * ENLACE CONSCIENTE DEL IDIOMA.
 *
 * Sustituye a `next/link` en todo el producto. El motivo es un fallo concreto
 * y silencioso: con `next/link` a secas, un usuario que está leyendo en árabe
 * y pulsa «Empezar» aterriza en `/diagnostico` —la versión española— y pierde
 * el idioma sin que nada se lo advierta. Hay 97 enlaces internos en el código;
 * arreglarlos uno a uno garantiza olvidar alguno, así que se arregla el
 * componente por el que pasan todos.
 *
 * Se deja intacto lo que no es navegación interna: URL absolutas, `mailto:`,
 * `tel:`, anclas de la misma página y rutas que ya llevan prefijo de idioma.
 *
 * Es un componente de cliente porque necesita el contexto de idioma, pero
 * puede renderizarse desde un componente de servidor con normalidad: los
 * hijos ya vienen resueltos. `next/link` tampoco es de servidor.
 */

/** Rutas que nunca llevan prefijo de idioma: no son páginas del sitio. */
function isExternalOrSpecial(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("/api/")
  );
}

export function localizeHref(href: string, locale: Locale): string {
  if (!href || isExternalOrSpecial(href)) return href;
  if (!href.startsWith("/")) return href;
  if (locale === DEFAULT_LOCALE) return href;

  // Si ya viene con prefijo —lo construyó `href()` a mano— no se toca.
  const first = href.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return href;

  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

type Props = Omit<React.ComponentProps<typeof NextLink>, "href"> & { href: string };

export const Link = React.forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, ...rest },
  ref,
) {
  // `useOptionalLocale` y no `useLocale`: hay superficies (páginas de error de
  // Next, que se renderizan fuera del proveedor) donde el contexto no existe.
  // Ahí el enlace debe seguir funcionando en español, no reventar.
  const locale = useOptionalLocale()?.locale ?? DEFAULT_LOCALE;
  return <NextLink ref={ref} href={localizeHref(href, locale)} {...rest} />;
});

export default Link;
