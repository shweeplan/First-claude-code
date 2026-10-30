/** Stylised chart with no data. Labelled Example. */
export default function ChartExample() {
  return (
    <figure data-reveal className="grain relative overflow-hidden rounded-3xl bg-papyrus/92 p-6 backdrop-blur-sm">
      <figcaption className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-brown">
        <span>Monthly report</span>
        <span className="rounded-full border-2 border-gold px-3 py-1">Example</span>
      </figcaption>
      <svg viewBox="0 0 320 160" role="img" aria-label="Illustrative chart with rising bars and a line. Example only, no real numbers." className="w-full">
        <path d="M10 140h300" stroke="#5a3a22" strokeWidth="2" />
        {[30, 48, 40, 70, 62, 92].map((h, i) => (
          <rect key={i} x={24 + i * 50} y={140 - h} width="28" height={h} rx="3" fill={i === 5 ? "#c9973e" : "#1e3a72"} />
        ))}
        <path d="M38 100l50-12 50 6 50-28 50 8 50-34" fill="none" stroke="#b2432d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <ul className="mt-3 flex flex-wrap gap-4 text-sm">
        <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-lapis" />Sales</li>
        <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-carnelian" />Return on ad spend</li>
      </ul>
      <p className="mt-2 text-xs">Illustration only. These are not real results.</p>
    </figure>
  );
}
