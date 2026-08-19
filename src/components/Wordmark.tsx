import { brand } from '@/design/brand';
import { colour, font } from '@/design/tokens';

/**
 * The wordmark.
 *
 * Solid type, nothing else. An earlier version ran the product's energy curve
 * through the letters — it read as a strikethrough at every size, and the
 * knockout needed to fix that chopped visible gaps between characters. A
 * logo that needs a trick to stay legible isn't finished.
 *
 * So the mark is the word, set heavy and wide in Archivo Expanded Bold with
 * tight tracking: solid, geometric, squared-off, and unmistakable at 20px in
 * a browser tab. The letterforms carry it.
 *
 * It's set as SVG text rather than HTML so the mark scales as one object and
 * exports cleanly into cards, PDFs and favicons.
 */

type Props = {
  /** Rendered height in px. Everything scales from this. */
  height?: number;
  /** Defaults to the bright ink. Pass an archetype glow to tint it. */
  colour?: string;
};

export function Wordmark({ height = 28, colour: tint = colour.bright }: Props) {
  /* Authored at 100 tall and scaled, so tracking stays proportional.
     The box is sized for the widest letterform in the word — expanded bold
     advances run far wider than they look, and a W will clip a box that
     seemed generous. A little slack on the right is deliberate. */
  const H = 100;
  const W = 480;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={brand.name}
      style={{ height, width: 'auto', display: 'block' }}
    >
      <text
        x="0"
        y="76"
        fontFamily={font.wordmark}
        fontSize="88"
        fontWeight="700"
        /* Tight, not touching. Heavy expanded caps need the counters to
           breathe or the word turns into a single dark block. */
        letterSpacing="-0.005em"
        fill={tint}
      >
        {brand.name}
      </text>
    </svg>
  );
}
