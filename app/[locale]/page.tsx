import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CTA, Featured, ServicesOverview, Testimonials, Why } from "@/components/home/Sections";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <Why />
      <ServicesOverview />
      <Testimonials />
      <CTA />
    </>
  );
}
