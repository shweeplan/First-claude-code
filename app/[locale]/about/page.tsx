import type { Metadata } from "next";
import { AboutBody } from "@/components/pages/About";
import { AboutHero } from "@/components/pages/Heroes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/about");
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutBody />
    </>
  );
}
