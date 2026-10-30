/** Dark stone cartouche with a gold inlay border and tie bar, holding a numeral or label. */
export default function Cartouche({ children, size = "sm", className = "" }: { children: React.ReactNode; size?: "sm" | "lg"; className?: string }) {
  const pad = size === "lg" ? "px-9 py-5" : "px-5 py-2";
  return (
    <span className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#3b2415] to-[#1c110a] text-gold shadow-[inset_0_0_0_3px_#1c110a,inset_0_0_0_4.5px_#c9973e,0_8px_18px_rgba(0,0,0,0.35)] ${pad} ${className}`}>
      {children}
      <span className="pointer-events-none absolute -right-3 top-1/2 h-[70%] w-1.5 -translate-y-1/2 rounded bg-gradient-to-b from-gold-light to-gold shadow" aria-hidden="true" />
    </span>
  );
}
