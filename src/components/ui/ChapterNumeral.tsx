import { useId } from "react";

/**
 * Invented chapter numerals 1 to 7: angular carved digits with a gold inlay, shadowed groove,
 * highlight edge, and a notched baseline with studs. Decorative, not a real Egyptian number system.
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

export default function ChapterNumeral({ n, className = "h-7", compact = false }: { n: number; className?: string; compact?: boolean }) {
  const id = useId();
  const d = D[n] ?? D[1];
  return (
    <svg viewBox={compact ? "0 0 24 34" : "0 0 24 39"} className={`w-auto ${className}`} role="img" aria-label={`Chapter ${n}`} fill="none" strokeLinejoin="miter" strokeLinecap="square">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7ad" />
          <stop offset="0.45" stopColor="#d8a746" />
          <stop offset="1" stopColor="#8a5a1a" />
        </linearGradient>
      </defs>
      <g transform="translate(2 2)">
        <path d={d} stroke="#000" strokeOpacity="0.5" strokeWidth="5.6" transform="translate(0.8 1)" />
        <path d={d} stroke="#1c110a" strokeWidth="5.8" />
        <path d={d} stroke={`url(#${id}g)`} strokeWidth="3.4" />
        <path d={d} stroke="#fff6d8" strokeOpacity="0.75" strokeWidth="0.8" transform="translate(-0.7 -0.7)" />
        {!compact && (<>
        <g strokeLinecap="butt">
          <path d="M1 32.5h18" stroke="#1c110a" strokeWidth="3" />
          <path d="M1 32.5h18" stroke={`url(#${id}g)`} strokeWidth="1.5" />
        </g>
        <circle cx="1" cy="32.5" r="1.3" fill="#fbe7ad" />
        <circle cx="19" cy="32.5" r="1.3" fill="#fbe7ad" />
        </>)}
      </g>
    </svg>
  );
}
