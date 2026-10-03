import type { Metadata } from "next";
import { ServicesList } from "@/components/pages/Services";
import { ServicesHero } from "@/components/pages/Heroes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
    </>
  );
}
