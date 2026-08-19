/**
 * The single source of truth for every colour, size and rhythm.
 * The product's name lives separately, in ./brand.ts.
 *
 * Used by three things at once:
 *   1. the web UI, via CSS custom properties (see cssVariables() below)
 *   2. the SVG card/pin renderer, which imports these values directly
 *   3. anything exported for print
 *
 * There is no build step. Change a value here and it changes everywhere.
 *
 * ---------------------------------------------------------------------------
 * THE SYSTEM: NOCTURNE
 *
 * The product measures when your day breaks. So light and dark are semantic
 * here, not decorative: every card is a deep field with one luminous curve,
 * and the ground's *hue* encodes the time of day the archetype fails.
 *
 * All four grounds sit at roughly the same (very low) value and differ only
 * in hue — the way a long-exposure photograph renders noon and midnight at
 * the same brightness but different colour. That keeps the set coherent as a
 * system while making each card instantly identifiable in a Pinterest grid,
 * where the four glowing curve colours are what the eye actually catches.
 *
 * Two rules that came out of testing this at thumbnail size:
 *
 *   1. Optical weight goes UP on dark, not down. Light type on a dark ground
 *      bleeds; anything under medium weight disappears at 236px. This is why
 *      nothing here is "light" or "thin" despite the mood.
 *   2. The curve is the only bright object. If a second thing glows, the
 *      card stops reading at a glance.
 */

/* ---------------------------------------------------------------- colour */

/**
 * Text and structure. These sit on top of any of the four grounds, so they're
 * defined once and tuned for the darkest of them.
 *
 * There is no red in this file and there should never be one. When something
 * needs emphasis it gets size, mass or luminance — not alarm.
 */
export const colour = {
  /* type on a deep ground */
  bright: '#EDF1F7',  // headlines, the things that must land
  body: '#C3CBD9',    // running text
  muted: '#8C97A9',   // labels, captions
  faint: '#5C6577',   // axis ticks, the quietest layer

  /* structure */
  rule: '#242B3A',      // hairlines on dark
  surface: '#141A26',   // raised panels in the UI
  surfaceDeep: '#0B1019', // the UI's own ground

  /* print inversion — same geometry, ink on paper */
  paper: '#FAF8F4',
  ink: '#14161C',
  inkMuted: '#5E6470',
  inkFaint: '#9AA0AC',
  ruleLight: '#DFDCD5',
} as const;

/**
 * One ground and one luminous curve per archetype.
 *
 * ground — deep, hue-mapped to when the day breaks
 * glow   — the curve. The only bright object on the card.
 * print  — the curve colour when inverted onto paper, where a glow can't exist
 */
export const archetypeColour = {
  'slow-starter': {
    ground: '#1A1733', // pre-dawn violet
    glow: '#F5B841',   // first light
    print: '#B07A12',
  },
  'delayed-crasher': {
    ground: '#221410', // afternoon amber, at night value
    glow: '#FF6B4A',   // the crash
    print: '#C4442A',
  },
  'wired-and-tired': {
    ground: '#0C1222', // deepest. This one is literally night
    glow: '#4FD1E0',   // the second wind, cold and electric
    print: '#1B7F8E',
  },
  'weekend-reset': {
    ground: '#101F1C', // the week, in teal
    glow: '#6EE7A8',
    print: '#20825A',
  },
} as const;

export type ArchetypeSlug = keyof typeof archetypeColour;

/* ------------------------------------------------------------ typography */

/**
 * Two families, no serif.
 *
 * Dropping the serif entirely is the decisive break from where this started —
 * a display serif over a neutral sans is the single most over-used pairing in
 * this category. A grotesk set wide and a true monospace for time read as
 * instrumentation, which is what the product is.
 *
 * Times appear constantly, so the mono isn't decorative — it's what keeps
 * columns of times aligned on the card and in the app.
 */
export const font = {
  /* The wordmark only. Heavy and wide — geometric, squared, solid. Kept
     separate from `display` so the logo can never drift when the UI face
     changes. */
  wordmark: "'Archivo Expanded', 'Archivo', 'Helvetica Neue', sans-serif",
  display: "'Archivo', 'Helvetica Neue', Inter, sans-serif",
  text: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;

/** UI type scale, in rem. A 1.25 ratio, trimmed to the sizes actually used. */
export const size = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  md: 1.125,
  lg: 1.375,
  xl: 1.75,
  xxl: 2.25,
  display: 3,
  displayLarge: 4.25,
} as const;

/** Nothing below `medium` exists on a dark ground. See the note up top. */
export const weight = {
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const leading = {
  tight: 1.05,
  snug: 1.25,
  normal: 1.55,
} as const;

/** Wide tracking is the mood. It's applied to labels, never to running text. */
export const tracking = {
  label: '0.22em',
  display: '-0.02em',
} as const;

/* ---------------------------------------------------------------- rhythm */

/** A 4px base. Values are rem. */
export const space = {
  '1': 0.25,
  '2': 0.5,
  '3': 0.75,
  '4': 1,
  '5': 1.5,
  '6': 2,
  '7': 3,
  '8': 4,
  '9': 6,
} as const;

/** Corners are nearly square. Soft rounding is what made the last one generic. */
export const radius = {
  sm: 2,
  md: 4,
  lg: 6,
  card: 8,
} as const;

/* ------------------------------------------------------------------ card */

/**
 * ONE card geometry, used for the Pinterest pin, the in-app protocol card,
 * the PDF page and the shareable result. 2:3 at 1000x1500 is Pinterest's
 * preferred ratio, and it also sits well in a phone viewport.
 *
 * Keeping a single geometry is the reason one renderer can serve every
 * surface. Resist adding a second.
 */
export const card = {
  width: 1000,
  height: 1500,
  margin: 88,
  printScale: 3,
} as const;

/** Where the horizon sits. Everything above it is sky. */
export const horizon = {
  y: 1010,
  /** the plot rises this far above the horizon */
  height: 360,
} as const;

/* -------------------------------------------------------------- plumbing */

export function cssVariables(): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(colour)) {
    lines.push(`--c-${kebab(key)}: ${value};`);
  }
  for (const [slug, pair] of Object.entries(archetypeColour)) {
    lines.push(`--ground-${slug}: ${pair.ground};`);
    lines.push(`--glow-${slug}: ${pair.glow};`);
  }
  for (const [key, value] of Object.entries(font)) {
    lines.push(`--font-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(size)) {
    lines.push(`--size-${key}: ${value}rem;`);
  }
  for (const [key, value] of Object.entries(weight)) {
    lines.push(`--weight-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(leading)) {
    lines.push(`--leading-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tracking)) {
    lines.push(`--tracking-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(space)) {
    lines.push(`--space-${key}: ${value}rem;`);
  }
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`--radius-${key}: ${value}px;`);
  }

  return `:root {\n  ${lines.join('\n  ')}\n}`;
}

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
