import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { siteConfig } from "@/config/site";
import { dictionaries, dirOf, isLocale, locales, brandName } from "@/lib/i18n";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "../globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600"], variable: "--f-arabic", display: "swap" });

export const viewport: Viewport = { themeColor: "#0b0b0c", width: "device-width", initialScale: 1 };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: brandName(locale),
    icons: { icon: "/icon.svg" },
    openGraph: { siteName: brandName(locale), type: "website", locale: locale === "ar" ? "ar_EG" : "en_US" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${display.variable} ${body.variable} ${arabic.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers locale={locale} dict={dictionaries[locale]}>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
