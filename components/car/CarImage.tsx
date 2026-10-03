import Image from "next/image";
import type { Car } from "@/data/fleet";
import { carName } from "@/data/fleet";
import { CarArt, type ArtView } from "./CarArt";

/**
 * Renders the car's real photo when `car.images[index]` is set,
 * otherwise a generated studio illustration. Swap photos in data/fleet.ts.
 */
export function CarImage({
  car, index = 0, view = "side", sizes = "(min-width:1024px) 33vw, 100vw", priority = false, className = "",
}: { car: Car; index?: number; view?: ArtView; sizes?: string; priority?: boolean; className?: string }) {
  const src = car.images?.[index];
  return (
    <div className={`relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#2a2824_0%,#121214_62%,#0c0c0d_100%)] ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      {src ? (
        <Image src={src} alt={carName(car)} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[6%]">
          <CarArt body={car.body} color={car.color} view={view} label={carName(car)} className="h-full w-full drop-shadow-[0_20px_30px_rgba(0,0,0,.5)]" />
        </div>
      )}
    </div>
  );
}
