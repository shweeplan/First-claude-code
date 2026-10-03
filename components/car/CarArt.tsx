import { useId } from "react";

/** Mix a hex colour toward white (amt>0) or black (amt<0). */
function mix(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round((t - v) * p + v));
  return `rgb(${c.join(",")})`;
}

const BODY = {
  sedan: {
    body: "M50 218 L46 192 C46 178 56 170 74 167 L214 160 C252 134 292 108 352 100 L470 98 C520 98 562 120 606 150 L700 168 C736 172 754 186 756 206 L756 220 Z",
    glass: "M230 157 C260 133 296 114 354 109 L470 108 C514 108 548 125 586 152 L590 157 Z",
    pillars: [{ x1: 412, y1: 108, x2: 410, y2: 157 }],
    wheels: [{ cx: 172, r: 49 }, { cx: 632, r: 49 }],
    cy: 211, sy: 1.3, vb: "20 55 760 215",
    shoulder: "M62 184 C220 172 440 168 744 192",
    head: "M722 184 L750 192 L748 199 L716 193 Z",
    tail: "M52 188 L66 186 L68 194 L50 198 Z",
    mirror: "M590 150 L604 150 L600 158 L588 157 Z",
  },
  suv: {
    body: "M48 222 L44 194 C44 178 52 162 72 152 C112 134 152 102 196 80 C208 74 222 70 242 70 L440 70 C500 70 548 84 584 112 L612 138 L708 150 C740 154 758 170 760 196 L760 222 Z",
    glass: "M152 128 C178 108 198 94 224 88 L438 86 C486 86 526 98 558 122 L576 134 Z",
    pillars: [{ x1: 330, y1: 88, x2: 330, y2: 132 }, { x1: 456, y1: 87, x2: 462, y2: 132 }],
    wheels: [{ cx: 168, r: 54 }, { cx: 636, r: 54 }],
    cy: 206, sy: 1.3, vb: "20 12 760 258",
    shoulder: "M66 148 C240 140 440 136 604 138 L722 160",
    head: "M728 160 L755 174 L754 184 L722 170 Z",
    tail: "M46 194 L52 164 L61 166 L57 196 Z",
    mirror: "M580 128 L598 128 L594 138 L578 137 Z",
  },
} as const;

export type ArtView = "side" | "rear" | "detail";

export function CarArt({
  body, color, view = "side", label, className = "",
}: { body: "sedan" | "suv"; color: string; view?: ArtView; label?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const s = BODY[body];
  const vb = view === "detail" ? (body === "suv" ? "440 60 330 210" : "440 100 330 170") : s.vb;
  const flip = view === "rear";
  return (
    <svg
      viewBox={vb}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(color, 0.32)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={mix(color, -0.55)} />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b3138" />
          <stop offset="0.5" stopColor="#0d0f12" />
          <stop offset="1" stopColor="#1b2026" />
        </linearGradient>
        <radialGradient id={`r${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e9e6df" />
          <stop offset="0.6" stopColor="#8d8f94" />
          <stop offset="1" stopColor="#3b3d42" />
        </radialGradient>
        <radialGradient id={`sh${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`c${id}`}><path d={s.body} /></clipPath>
      </defs>

      <g transform={flip ? "translate(800 0) scale(-1 1)" : undefined}>
        <ellipse cx="400" cy="256" rx="380" ry="16" fill={`url(#sh${id})`} />
        <g transform={`translate(0 ${222 * (1 - s.sy)}) scale(1 ${s.sy})`}>
        <path d={s.body} fill={`url(#b${id})`} />
        <path d={s.body} fill={`url(#s${id})`} />
        {/* wheel arches */}
        <g clipPath={`url(#c${id})`}>
          {s.wheels.map((w) => (
            <circle key={w.cx} cx={w.cx} cy={s.cy} r={w.r + 9} fill="#050506" />
          ))}
          {/* sill */}
          <rect x="40" y="208" width="730" height="14" fill="#000" opacity="0.28" />
        </g>
        <path d={s.shoulder} stroke="#fff" strokeOpacity="0.28" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
        <path d={s.glass} fill={`url(#g${id})`} />
        <path d={s.glass} fill="none" stroke={mix(color, -0.5)} strokeWidth="2" />
        {s.pillars.map((p, i) => (
          <line key={i} {...p} stroke={mix(color, -0.25)} strokeWidth="7" />
        ))}
        <path d={s.mirror} fill={mix(color, -0.3)} />
        <path d={s.head} fill="#fff6dc" opacity="0.95" />
        <path d={s.tail} fill="#c0392b" opacity="0.9" />
        </g>
        {/* wheels */}
        {s.wheels.map((w) => (
          <g key={w.cx}>
            <circle cx={w.cx} cy={s.cy} r={w.r} fill="#0a0a0b" />
            <circle cx={w.cx} cy={s.cy} r={w.r * 0.68} fill={`url(#r${id})`} />
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={i}
                x1={w.cx} y1={s.cy}
                x2={w.cx + Math.cos((i * 2 * Math.PI) / 5) * w.r * 0.66}
                y2={s.cy + Math.sin((i * 2 * Math.PI) / 5) * w.r * 0.66}
                stroke="#2a2b2e" strokeWidth="5" strokeLinecap="round"
              />
            ))}
            <circle cx={w.cx} cy={s.cy} r={w.r * 0.2} fill="#18191b" />
          </g>
        ))}
      </g>
    </svg>
  );
}
