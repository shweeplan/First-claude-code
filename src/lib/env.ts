export type Tier = "full" | "lite" | "static";

export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Decide render tier once on the client. `?tier=` overrides for testing. */
export function detectTier(): { tier: Tier; reduced: boolean } {
  const q = new URLSearchParams(window.location.search).get("tier");
  const reduced = prefersReducedMotion() || q === "reduced";
  if (q === "static" || !hasWebGL()) return { tier: "static", reduced };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 820;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  if (q === "lite" || coarse || small || lowCores) return { tier: "lite", reduced };
  return { tier: "full", reduced };
}
