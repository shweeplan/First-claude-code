/**
 * Ancient Egyptian numeral for 1 to 9: tally strokes, grouped in rows
 * the way scribes wrote them (e.g. 4 = 2 over 2, 7 = 4 over 3).
 */
const ROWS: Record<number, number[]> = {
  1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4], 9: [3, 3, 3],
};

export default function EgyptianNumeral({ n, className = "h-6" }: { n: number; className?: string }) {
  const rows = ROWS[n] ?? [1];
  const widest = Math.max(...rows);
  const w = widest * 7 + 2, rowH = 14, h = rows.length * rowH;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-auto ${className}`} role="img" aria-label={`Chapter ${n}`} fill="currentColor">
      {rows.map((count, r) =>
        Array.from({ length: count }, (_, i) => {
          const x = 1 + (widest - count) * 3.5 + i * 7;
          const y = r * rowH + 1;
          // slightly tapered stroke
          return <path key={`${r}-${i}`} d={`M${x} ${y}h3.6l-.5 ${rowH - 2}h-2.6z`} />;
        }),
      )}
    </svg>
  );
}
