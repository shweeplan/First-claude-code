import { hero } from "@/config/site";
import MagneticButton from "../ui/MagneticButton";
import Wordmark from "../ui/Wordmark";

export default function Hero() {
  return (
    <section id="hero" data-chapter="hero" aria-labelledby="hero-h" className="relative flex min-h-[110vh] flex-col justify-end px-5 pb-28 pt-32 lg:pl-40 lg:pr-12">
      <div className="max-w-4xl">
        <p data-hero className="mb-4 font-display text-sm tracking-[0.35em] text-brown">{hero.eyebrow.toUpperCase()}</p>
        <div data-hero><Wordmark className="mb-4 block text-8xl sm:text-9xl" /></div>
        <h1 id="hero-h" data-hero-lines className="font-display text-5xl font-semibold leading-[1.02] text-ink sm:text-7xl lg:text-8xl">
          {hero.headline.map((l) => (
            <span key={l} className="reveal-line"><span>{l}</span></span>
          ))}
        </h1>
        <p data-hero className="mt-6 max-w-xl text-lg font-medium text-ink sm:text-xl">{hero.pitch}</p>
        <div data-hero className="mt-8 flex flex-wrap gap-4">
          <MagneticButton href="#start">{hero.primary}</MagneticButton>
          <MagneticButton href="#build" variant="ghost">{hero.secondary}</MagneticButton>
        </div>
      </div>
    </section>
  );
}
