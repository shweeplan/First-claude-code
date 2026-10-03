import type { Metadata } from "next";
import { LocationsMap } from "@/components/pages/LocationsMap";
import { LocationsHero } from "@/components/pages/Heroes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "locations", "/locations");
}

export default function LocationsPage() {
  return (
    <>
      <LocationsHero />
      <LocationsMap />
    </>
  );
}
