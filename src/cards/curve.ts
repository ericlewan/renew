import type { ArchetypeSlug } from '@/design/tokens';

/**
 * The energy curve is the one diagram the whole product is built around.
 *
 * It appears on the result card, on the archetype page, as a Pinterest pin,
 * as a PDF page, and — because it's a single parametric path — as the source
 * for the animated version. Nothing here is hand-drawn, so a curve can be
 * tweened to another curve for the motion channel.
 *
 * Points are [hoursAfterWaking, energy 0-1]. Weekend Reset is the exception:
 * it works at week scale, so its x axis is days.
 */
export type CurvePoint = [number, number];

export const curves: Record<ArchetypeSlug, CurvePoint[]> = {
  'delayed-crasher': [
    [0, 0.55], [2, 0.86], [4, 0.82], [6, 0.55], [7.5, 0.22],
    [9, 0.44], [12, 0.5], [16, 0.2],
  ],
  'slow-starter': [
    [0, 0.12], [1.5, 0.18], [3, 0.42], [5, 0.62], [8, 0.8],
    [11, 0.86], [13, 0.7], [16, 0.34],
  ],
  'wired-and-tired': [
    [0, 0.3], [2, 0.42], [5, 0.34], [8, 0.4], [11, 0.62],
    [13.5, 0.88], [15, 0.9], [16, 0.78],
  ],
  'weekend-reset': [
    [0, 0.24], [1, 0.62], [2, 0.78], [3, 0.8], [4, 0.66],
    [5, 0.5], [6, 0.42], [7, 0.24],
  ],
};

/**
 * The same day with the protocol running.
 *
 * This is the single most important addition to the system. The diagnosis
 * curve says "here is the shape of your day"; drawn next to it, the target
 * curve says "and here is the shape we're aiming for" — which is the thing
 * anyone is actually buying.
 *
 * These are targets, not promises, and the copy around them has to keep
 * saying so. Nothing here claims an outcome; it describes the shape a day
 * takes when the timing stops working against you.
 */
export const targetCurves: Record<ArchetypeSlug, CurvePoint[]> = {
  /* the dip stays — everyone has one — but it stops being a hole */
  'delayed-crasher': [
    [0, 0.58], [2, 0.86], [4, 0.84], [6, 0.72], [7.5, 0.62],
    [9, 0.7], [12, 0.6], [16, 0.24],
  ],
  /* the morning arrives on time instead of three hours late */
  'slow-starter': [
    [0, 0.34], [1.5, 0.6], [3, 0.76], [5, 0.82], [8, 0.8],
    [11, 0.7], [13, 0.56], [16, 0.24],
  ],
  /* front-loaded: the day peaks in daylight and lets go after dark */
  'wired-and-tired': [
    [0, 0.5], [2, 0.76], [5, 0.8], [8, 0.72], [11, 0.56],
    [13.5, 0.4], [15, 0.28], [16, 0.18],
  ],
  /* the week stops having a hole in it */
  'weekend-reset': [
    [0, 0.66], [1, 0.72], [2, 0.76], [3, 0.76], [4, 0.72],
    [5, 0.68], [6, 0.66], [7, 0.62],
  ],
};

/** Where the day (or week) actually breaks. Marked on the curve. */
export const breakPoint: Record<ArchetypeSlug, { x: number; label: string }> = {
  'delayed-crasher': { x: 7.5, label: 'the crash' },
  'slow-starter': { x: 0.6, label: 'the fog' },
  'wired-and-tired': { x: 14.2, label: 'the second wind' },
  'weekend-reset': { x: 0, label: 'Monday' },
};

/** Axis labels differ because Weekend Reset runs on a different clock. */
export const axis: Record<ArchetypeSlug, { min: number; max: number; ticks: string[] }> = {
  'delayed-crasher': { min: 0, max: 16, ticks: ['wake', 'noon', 'evening'] },
  'slow-starter': { min: 0, max: 16, ticks: ['wake', 'noon', 'evening'] },
  'wired-and-tired': { min: 0, max: 16, ticks: ['wake', 'noon', 'evening'] },
  'weekend-reset': { min: 0, max: 7, ticks: ['Mon', 'Thu', 'Sun'] },
};

type Box = { x: number; y: number; width: number; height: number };

function project(points: CurvePoint[], box: Box, domain: { min: number; max: number }) {
  const span = domain.max - domain.min;
  return points.map(([hour, energy]) => ({
    x: box.x + ((hour - domain.min) / span) * box.width,
    y: box.y + (1 - energy) * box.height,
  }));
}

/**
 * Catmull-Rom through the points, converted to cubic beziers. Gives a soft,
 * hand-drawn-feeling line without anyone having to draw one.
 */
function smooth(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';

  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };

    d += ` C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(p2.x)} ${round(p2.y)}`;
  }

  return d;
}

const round = (n: number) => Math.round(n * 100) / 100;

/** The stroked energy line as it is now. */
export function curvePath(slug: ArchetypeSlug, box: Box): string {
  return smooth(project(curves[slug], box, axis[slug]));
}

/** The shape the protocol aims for. Drawn as a ghost behind the real one. */
export function targetPath(slug: ArchetypeSlug, box: Box): string {
  return smooth(project(targetCurves[slug], box, axis[slug]));
}

/** The same line closed to the baseline, for the tinted fill underneath. */
export function curveArea(slug: ArchetypeSlug, box: Box): string {
  const line = curvePath(slug, box);
  const baseline = box.y + box.height;
  return `${line} L ${round(box.x + box.width)} ${round(baseline)} L ${round(box.x)} ${round(baseline)} Z`;
}

/** Screen position of the break marker, so the dot and label can be placed. */
export function breakMarker(slug: ArchetypeSlug, box: Box) {
  const { min, max } = axis[slug];
  const { x: hour, label } = breakPoint[slug];

  // linear read of the curve at that hour is close enough for a marker
  const points = curves[slug];
  let energy = points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    if (hour >= x0 && hour <= x1) {
      const t = x1 === x0 ? 0 : (hour - x0) / (x1 - x0);
      energy = y0 + (y1 - y0) * t;
      break;
    }
  }

  return {
    x: round(box.x + ((hour - min) / (max - min)) * box.width),
    y: round(box.y + (1 - energy) * box.height),
    label,
  };
}
