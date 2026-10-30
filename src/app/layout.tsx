import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/manrope";
import "@fontsource/caveat/700.css";
import "./globals.css";
import { brand } from "@/config/site";

export const metadata: Metadata = {
  title: `${brand.name} · Online stores, traffic and sales`,
  description: brand.description,
};
export const viewport: Viewport = { themeColor: "#F4EBD9", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#build" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-gold focus:px-4 focus:py-2">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
