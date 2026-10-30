import { brand } from "@/config/site";

/** Hand-drawn lowercase wordmark with a gold underline stroke. */
export default function Wordmark({ className = "text-5xl", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`relative inline-block font-hand font-bold leading-none ${light ? "text-papyrus" : "text-brown"} ${className}`}>
      {brand.wordmark}
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="absolute -bottom-[0.18em] left-0 h-[0.22em] w-full text-gold" aria-hidden="true">
        <path d="M2 8c20-6 50-7 96-3" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
