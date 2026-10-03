import type { Metadata } from "next";
import { Suspense } from "react";
import { FleetBrowser } from "@/components/pages/FleetBrowser";
import { FleetHero } from "@/components/pages/Heroes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "fleet", "/fleet");
}

export default function FleetPage() {
  return (
    <>
      <FleetHero />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <FleetBrowser />
      </Suspense>
    </>
  );
}
