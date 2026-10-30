import type { GlyphName } from "@/config/site";

/** Hieroglyph-inspired decorative icons. They do not spell words. */
const P: Record<GlyphName, React.ReactNode> = {
  obelisk: <><path d="M13 4l3-3 3 3 2 24H11z" /><path d="M9 28h14" /></>,
  pyramid: <><path d="M3 27L16 5l13 22z" /><path d="M16 5v22" /></>,
  column: <><path d="M10 6h12M12 6v20M20 6v20M9 26h14" /><path d="M10 6c0-3 12-3 12 0" /></>,
  ankh: <><ellipse cx="16" cy="9" rx="5" ry="6" /><path d="M16 15v14M8 19h16" /></>,
  scarab: <><ellipse cx="16" cy="18" rx="8" ry="9" /><path d="M16 9v18M8 18h16M12 9l-3-5M20 9l3-5M8 13l-5-2M24 13l5-2" /></>,
  sun: <><circle cx="16" cy="16" r="5" /><circle cx="16" cy="16" r="1" /><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5L26 26M26 6l-3.5 3.5M9.5 22.5L6 26" /></>,
  eye: <><path d="M2 15c5-8 23-8 28 0-5 8-23 8-28 0z" /><circle cx="16" cy="15" r="3" /><path d="M16 22v5l-4 3" /></>,
  lotus: <><path d="M16 26c-6-2-9-8-8-14 4 2 7 6 8 14zM16 26c6-2 9-8 8-14-4 2-7 6-8 14zM16 26c-4-5-4-13 0-20 4 7 4 15 0 20z" /><path d="M6 28h20" /></>,
  reed: <><path d="M10 29c0-9 0-17 2-25M16 29c0-9 0-15 0-23M22 29c0-9 0-17-2-25" /><path d="M10 10c-2-2-4-1-4-1M22 10c2-2 4-1 4-1" /></>,
  scale: <><path d="M16 4v24M6 28h20M5 9h22" /><path d="M5 9l-3 9h6zM27 9l-3 9h6z" /></>,
  scroll: <><rect x="6" y="5" width="20" height="22" rx="3" /><path d="M10 11h12M10 16h12M10 21h7" /></>,
  gate: <><path d="M4 28V10h6v18M22 28V10h6v18M2 10h28M4 6h24" /><circle cx="16" cy="18" r="3" /></>,
  bird: <><path d="M4 22c6 0 8-6 14-6l4-6 2 5 6 1-5 3c-1 5-8 8-14 4z" /><path d="M4 28h10" /></>,
  water: <><path d="M3 10c3-3 5 3 8 0s5 3 8 0 5 3 8 0M3 17c3-3 5 3 8 0s5 3 8 0 5 3 8 0M3 24c3-3 5 3 8 0s5 3 8 0 5 3 8 0" /></>,
  star: <><path d="M16 3l3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5z" /></>,
  cartouche: <><rect x="8" y="3" width="16" height="26" rx="8" /><path d="M5 26h22" /><path d="M13 11v10M19 11v10" /></>,
};

export default function Glyph({ name, className = "h-8 w-8" }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name]}
    </svg>
  );
}
