/** Rounded cartouche frame holding a Roman numeral or short label. */
export default function Cartouche({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center rounded-full border-2 px-6 py-1.5 font-display text-lg font-semibold tracking-widest ${dark ? "border-gold-light text-gold-light" : "border-gold text-brown"} ${className}`}>
      <span className={`pointer-events-none absolute -right-2.5 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded ${dark ? "bg-gold-light" : "bg-gold"}`} aria-hidden="true" />
      {children}
    </span>
  );
}
