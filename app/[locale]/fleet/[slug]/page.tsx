import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetail } from "@/components/car/CarDetail";
import { carName, fleet, getCar } from "@/data/fleet";
import { locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) => fleet.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const car = getCar(slug);
  if (!car) return {};
  return pageMetadata(locale, "car", `/fleet/${slug}`, { car: carName(car), year: car.year, price: car.daily.toLocaleString("en-US") });
}

export default async function CarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();
  return <CarDetail car={car} />;
}
