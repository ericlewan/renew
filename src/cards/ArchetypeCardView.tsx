import { archetypeCardSvg, type CardOptions } from './ArchetypeCard';

/**
 * Thin React wrapper. The SVG string is the artifact; this just puts it on
 * the page so the on-screen card and the exported pin are literally the same
 * bytes.
 */
export function ArchetypeCardView(options: CardOptions) {
  return (
    <div
      style={{ display: 'block', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: archetypeCardSvg(options) }}
    />
  );
}
