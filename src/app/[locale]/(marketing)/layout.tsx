import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { getDictionary } from "@/i18n/get";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";

/**
 * El pie es un componente de servidor y recibe el diccionario por props en
 * lugar de leerlo del contexto. Convertirlo en cliente para usar el hook
 * habría metido en el paquete de JavaScript un componente que no interactúa
 * con nada: el pie solo pinta enlaces.
 */
export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return (
    <>
      <Header />
      <main id="contenido">{children}</main>
      <Footer t={t} />
    </>
  );
}
