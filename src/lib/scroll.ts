/**
 * Mutable scroll state shared by DOM and canvas.
 * Plain object so per-frame reads never trigger React renders.
 */
export const scrollState = {
  /** 0..1 over the whole page */
  progress: 0,
  /** pixels */
  y: 0,
  velocity: 0,
  /** chapter anchors, normalized 0..1, filled by <Experience/> */
  anchors: {} as Record<string, { start: number; end: number }>,
  pointer: { x: 0, y: 0 },
};

export function chapterProgress(id: string): number {
  const a = scrollState.anchors[id];
  if (!a) return 0;
  const t = (scrollState.progress - a.start) / Math.max(1e-4, a.end - a.start);
  return Math.min(1, Math.max(0, t));
}
