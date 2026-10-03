import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BookingHero } from "@/components/pages/Heroes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "booking", "/booking");
}

export default function BookingPage() {
  return (
    <>
      <BookingHero />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <BookingFlow />
      </Suspense>
    </>
  );
}
