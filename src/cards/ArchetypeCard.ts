import {
  archetypeColour,
  card,
  colour,
  font,
  horizon,
  tracking,
  weight,
  type ArchetypeSlug,
} from '@/design/tokens';
import { brand } from '@/design/brand';
import { archetypes } from '@/quiz/archetypes';
import {
  axis,
  breakMarker,
  breakPoint,
  curveArea,
  curvePath,
  curves,
  targetPath,
} from './curve';

/**
 * The card, as an SVG string.
 *
 * One geometry (1000x1500, 2:3) serving every surface: quiz result,
 * Pinterest pin, PDF page, in-app share asset.
 *
 * This is a string builder rather than a React component on purpose. The SVG
 * *is* the artifact — it gets rasterised for pins, embedded in the page, and
 * opened in a vector editor — so it shouldn't need React to exist.
 *
 * Every <g> carries an id. That's not decoration: it's what lets the motion
 * channel address and animate individual layers later, and what keeps the
 * file navigable when it's opened in Figma or Illustrator.
 *
 * ---------------------------------------------------------------------------
 * THE COMPOSITION
 *
 * The plot baseline is a horizon. Everything above it is sky — a deep field
 * hue-mapped to when this archetype's day breaks — and the energy curve is
 * the only luminous object in it. Below the horizon the ground darkens and
 * carries the axis and the one action.
 *
 * That's why the diagram isn't decorative: the card *is* a picture of a day,
 * and the curve is the light in it.
 *
 * Print mode inverts the whole thing to ink on paper. A glow can't exist on
 * paper, so the curve becomes a weighted line and the sky becomes white
 * space. Same geometry, same layers, same file.
 */

export type CardOptions = {
  slug: ArchetypeSlug;
  /** Personalised line, e.g. a computed caffeine cutoff. */
  footnote?: string;
  /** Pins carry the wordmark; the in-app version doesn't need it. */
  showWordmark?: boolean;
  /** 'print' inverts to ink on paper and drops the glow. */
  mode?: 'screen' | 'print';
  /**
   * 'diagnosis' draws the day as it is. 'transformation' draws the target
   * shape alongside it.
   *
   * The second is the one that sells: a diagnosis is a label, and two curves
   * are a before and an after. The result page uses transformation; a pin
   * that only needs to state the problem can use diagnosis.
   */
  variant?: 'diagnosis' | 'transformation';
};

const PLOT = {
  x: card.margin,
  y: horizon.y - horizon.height,
  width: card.width - card.margin * 2,
  height: horizon.height,
};

export function archetypeCardSvg({
  slug,
  footnote,
  showWordmark = true,
  mode = 'screen',
  variant = 'transformation',
}: CardOptions): string {
  const archetype = archetypes[slug];
  const palette = archetypeColour[slug];
  const print = mode === 'print';

  const ground = print ? colour.paper : palette.ground;
  const accent = print ? palette.print : palette.glow;
  const bright = print ? colour.ink : colour.bright;
  const body = print ? colour.ink : colour.body;
  const muted = print ? colour.inkMuted : colour.muted;
  const faint = print ? colour.inkFaint : colour.faint;
  const rule = print ? colour.ruleLight : colour.rule;

  const marker = breakMarker(slug, PLOT);
  const ticks = axis[slug].ticks;

  /* The display face has no metrics available here, so the name is fitted by
     character count. Approximate, but it only has to stop the longest name
     running off a 1000px card. */
  const available = card.width - card.margin * 2;
  const nameSize = Math.min(96, Math.round(available / (archetype.name.length * 0.56)));

  /* Label placement: outside the curve — above a peak, below a trough —
     except near either end of the plot, where "below" collides with the axis
     sitting directly underneath. Those go above regardless. */
  const labelHalfWidth = marker.label.length * 26 * 0.28;
  const nearLeft = marker.x - labelHalfWidth < PLOT.x;
  const nearRight = marker.x + labelHalfWidth > PLOT.x + PLOT.width;
  const atEdge = nearLeft || nearRight;

  const below = markerIsTrough(slug) && !atEdge;
  const labelSide = below ? 1 : -1;

  /* Asymmetric on purpose. Above a peak there is open sky, so the label can
     stand well clear. Below a trough it only has the gap between the marker
     and the horizon to work with, and the same generous offset drops it
     straight onto the axis. */
  const labelY = marker.y + (below ? 50 : -76);
  const labelAnchor = nearLeft ? 'start' : nearRight ? 'end' : 'middle';

  const lineRows = wrap(archetype.line, 32)
    .map(
      (row, i) =>
        `<text x="${card.margin}" y="${470 + i * 56}" font-family="${font.text}" font-size="40" font-weight="${weight.medium}" fill="${body}">${esc(row)}</text>`,
    )
    .join('\n    ');

  const actionRows = wrap(archetype.firstChange.action, 34)
    .map(
      (row, i) =>
        `<text x="${card.margin}" y="${1268 + i * 52}" font-family="${font.display}" font-size="44" font-weight="${weight.semibold}" letter-spacing="${tracking.display}" fill="${bright}">${esc(row)}</text>`,
    )
    .join('\n    ');

  const axisTicks = ticks
    .map((tick, i) => {
      const anchor = i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle';
      const x = PLOT.x + (PLOT.width / (ticks.length - 1)) * i;
      return `<text x="${round(x)}" y="${horizon.y + 52}" font-family="${font.mono}" font-size="24" fill="${faint}" text-anchor="${anchor}">${esc(tick)}</text>`;
    })
    .join('\n    ');

  /* Faint horizontal rules across the sky. Observatory-chart quality, and
     they give the curve something to be measured against. */
  const skyLines = [0.25, 0.5, 0.75]
    .map((fraction) => {
      const y = round(PLOT.y + PLOT.height * fraction);
      return `<line x1="${PLOT.x}" y1="${y}" x2="${PLOT.x + PLOT.width}" y2="${y}" stroke="${rule}" stroke-width="1.5"/>`;
    })
    .join('\n    ');

  /* Three passes: a wide soft halo, a tighter one, then the crisp core.
     A single blurred stroke reads as a blurry line; the stack reads as light.
     On paper there's no such thing, so print gets one weighted line. */
  const curveGlow = print
    ? `<path d="${curvePath(slug, PLOT)}" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>`
    : `<path d="${curvePath(slug, PLOT)}" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round" opacity="0.30" filter="url(#halo-wide)"/>
    <path d="${curvePath(slug, PLOT)}" fill="none" stroke="${accent}" stroke-width="9" stroke-linecap="round" opacity="0.65" filter="url(#halo-tight)"/>
    <path d="${curvePath(slug, PLOT)}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;

  const markerGlow = print
    ? `<circle cx="${marker.x}" cy="${marker.y}" r="11" fill="${accent}"/>`
    : `<circle cx="${marker.x}" cy="${marker.y}" r="26" fill="${accent}" opacity="0.28" filter="url(#halo-tight)"/>
    <circle cx="${marker.x}" cy="${marker.y}" r="9" fill="${accent}"/>`;

  /* The target is deliberately quiet: dashed, unlit, no fill. It reads as a
     line someone drew over your day rather than a second measurement, which
     is exactly what it is. If it glowed too it would compete with the thing
     it's meant to be improving. */
  const showTarget = variant === 'transformation';
  const targetLayer = showTarget
    ? `<path d="${targetPath(slug, PLOT)}" fill="none" stroke="${print ? colour.inkFaint : colour.muted}" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 12" opacity="${print ? 0.8 : 0.7}"/>`
    : '';

  const legend = showTarget
    ? `
  <g id="legend">
    <line x1="${card.margin}" y1="${horizon.y + 92}" x2="${card.margin + 34}" y2="${horizon.y + 92}" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
    <text x="${card.margin + 48}" y="${horizon.y + 99}" font-family="${font.mono}" font-size="22" fill="${muted}">your day now</text>
    <line x1="${card.margin + 300}" y1="${horizon.y + 92}" x2="${card.margin + 334}" y2="${horizon.y + 92}" stroke="${print ? colour.inkFaint : colour.muted}" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 9"/>
    <text x="${card.margin + 348}" y="${horizon.y + 99}" font-family="${font.mono}" font-size="22" fill="${muted}">where we take it</text>
  </g>`
    : '';

  const footer =
    footnote || showWordmark
      ? `
  <g id="footer">
    ${footnote ? `<text x="${card.margin}" y="1420" font-family="${font.mono}" font-size="24" fill="${muted}">${esc(footnote)}</text>` : ''}
    ${showWordmark ? `<text x="${card.width - card.margin}" y="1420" font-family="${font.text}" font-size="22" font-weight="${weight.semibold}" letter-spacing="${tracking.label}" fill="${faint}" text-anchor="end">${esc(brand.name)}</text>` : ''}
  </g>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${card.width} ${card.height}" role="img" aria-label="${esc(`${archetype.name} — ${archetype.line}`)}">
  <defs>
    <filter id="halo-wide" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    <filter id="halo-tight" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <!-- Atmosphere. A flat hex ground is the single biggest tell that a dark
         UI was specified rather than designed: real night has depth and
         grain. Two turbulence layers give it both — a slow one for cloud,
         a fine one for film grain — kept far below the threshold where
         anyone would name it as texture. Vector, so it costs nothing and
         survives to print. -->
    <filter id="cloud-${slug}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0016" numOctaves="4" seed="${seedFor(slug)}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <linearGradient id="sky-${slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="${print ? 0 : 0.14}"/>
    </linearGradient>
    <linearGradient id="under-${slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="${print ? 0.12 : 0.20}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <!-- The area fill closes to the horizon with vertical edges at the plot
         bounds. Unmasked, that reads as a box someone forgot to remove; this
         dissolves the two ends so it reads as light instead. -->
    <linearGradient id="edge-fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="7%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="93%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="fade-ends">
      <rect x="${PLOT.x}" y="${PLOT.y - 40}" width="${PLOT.width}" height="${PLOT.height + 60}" fill="url(#edge-fade)"/>
    </mask>
  </defs>

  <g id="ground">
    <rect width="${card.width}" height="${card.height}" fill="${ground}"/>
    ${print ? '' : `<rect width="${card.width}" height="${card.height}" filter="url(#cloud-${slug})" opacity="0.16" style="mix-blend-mode:screen"/>
    <rect width="${card.width}" height="${card.height}" fill="${accent}" opacity="0.05"/>`}
    <rect x="0" y="${PLOT.y - 120}" width="${card.width}" height="${horizon.y - PLOT.y + 120}" fill="url(#sky-${slug})"/>
    ${print ? '' : `<rect x="0" y="${horizon.y}" width="${card.width}" height="${card.height - horizon.y}" fill="#000000" opacity="0.28"/>`}
  </g>

  <g id="eyebrow">
    <text x="${card.margin}" y="180" font-family="${font.text}" font-size="24" font-weight="${weight.semibold}" letter-spacing="${tracking.label}" fill="${accent}">${esc(archetype.breaksAt.toUpperCase())}</text>
  </g>

  <g id="name">
    <text x="${card.margin}" y="330" font-family="${font.display}" font-size="${nameSize}" font-weight="${weight.bold}" letter-spacing="${tracking.display}" fill="${bright}">${esc(archetype.name)}</text>
  </g>

  <g id="line">
    ${lineRows}
  </g>

  <g id="sky-grid">
    ${skyLines}
  </g>

  <g id="target-curve">
    ${targetLayer}
  </g>

  <g id="curve">
    <path d="${curveArea(slug, PLOT)}" fill="url(#under-${slug})" mask="url(#fade-ends)"/>
    ${curveGlow}
  </g>

  <g id="break-marker">
    <line x1="${marker.x}" y1="${marker.y + labelSide * 20}" x2="${marker.x}" y2="${marker.y + (below ? 32 : 50)}" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    ${markerGlow}
    <text x="${marker.x}" y="${labelY}" font-family="${font.mono}" font-size="26" fill="${bright}" text-anchor="${labelAnchor}" stroke="${ground}" stroke-width="7" paint-order="stroke fill">${esc(marker.label)}</text>
  </g>

  <g id="horizon">
    <line x1="${card.margin}" y1="${horizon.y}" x2="${card.width - card.margin}" y2="${horizon.y}" stroke="${print ? colour.ink : accent}" stroke-width="2" opacity="${print ? 0.5 : 0.55}"/>
  </g>

  <g id="axis">
    ${axisTicks}
  </g>
${legend}

  <g id="first-change">
    <text x="${card.margin}" y="1200" font-family="${font.text}" font-size="22" font-weight="${weight.semibold}" letter-spacing="${tracking.label}" fill="${muted}">${showTarget ? 'START HERE' : 'CHANGE ONE THING FIRST'}</text>
    ${actionRows}
  </g>
${footer}

  <!-- Grain sits above everything, including the glow, or it reads as a
       texture behind glass rather than film. -->
  ${print ? '' : `<rect id="grain-layer" width="${card.width}" height="${card.height}" filter="url(#grain)" opacity="0.035" style="mix-blend-mode:overlay" pointer-events="none"/>`}
</svg>`;
}

/**
 * SVG has no text wrapping, so lines are broken here. Crude on purpose — the
 * copy on these cards is written to length, not poured in.
 */
function wrap(text: string, maxChars: number): string[] {
  const rows: string[] = [];
  let row = '';

  for (const word of text.split(' ')) {
    if (row && `${row} ${word}`.length > maxChars) {
      rows.push(row);
      row = word;
    } else {
      row = row ? `${row} ${word}` : word;
    }
  }
  if (row) rows.push(row);

  return rows;
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Each archetype gets its own cloud, so the four cards aren't one image
    recoloured four times. Stable per slug so exports are reproducible. */
function seedFor(slug: ArchetypeSlug): number {
  return { 'delayed-crasher': 3, 'slow-starter': 11, 'wired-and-tired': 19, 'weekend-reset': 27 }[slug];
}

/** True when the break lands in a dip rather than on a rise. */
function markerIsTrough(slug: ArchetypeSlug): boolean {
  const { x } = breakPoint[slug];
  const points = curves[slug];

  let before = points[0][1];
  let after = points[points.length - 1][1];
  for (let i = 0; i < points.length - 1; i++) {
    if (x >= points[i][0] && x <= points[i + 1][0]) {
      before = points[i][1];
      after = points[i + 1][1];
      break;
    }
  }
  return (before + after) / 2 < 0.5;
}

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
