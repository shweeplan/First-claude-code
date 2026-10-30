/**
 * Invented chapter numerals 1 to 7: angular, carved-stone digits with hieroglyph-style
 * flared ends. Decorative design, not a real Egyptian number system.
 */
const D: Record<number, string> = {
  1: "M5 8l5-5v24",
  2: "M4 8l4-4h5l3 4v5L4 27h13",
  3: "M4 4h12l-7 10h3l4 4v5l-4 4H4",
  4: "M14 27V3L3 19h15",
  5: "M16 4H5l-1 10h8l4 4v5l-4 4H4",
  6: "M15 4L6 12l-2 8v3l4 4h4l4-4v-5l-4-4H5",
  7: "M3 4h14L8 27",
};

export default function ChapterNumeral({ n, className = "h-7" }: { n: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 35" className={`w-auto ${className}`} role="img" aria-label={`Chapter ${n}`} fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="miter" strokeLinecap="square">
      <path d={D[n] ?? D[1]} />
      {/* carved baseline with end notches */}
      <path d="M2 32.5h16M2 30.5v4M18 30.5v4" strokeWidth="1.5" strokeLinecap="butt" />
    </svg>
  );
}
