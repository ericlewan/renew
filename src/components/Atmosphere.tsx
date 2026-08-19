import type { ArchetypeSlug } from '@/design/tokens';

/**
 * The photographic ground for a given archetype.
 *
 * The cards carry their atmosphere procedurally, in SVG, so they stay
 * standalone files that rasterise anywhere. The web pages can afford a real
 * image, and a photographed night field has a depth that feTurbulence does
 * not — so the two surfaces use different means to the same end rather than
 * sharing one compromise.
 *
 * Each is a 3–5KB WebP. Smooth gradients compress to almost nothing, which is
 * the only reason a full-bleed background image is defensible on a
 * mobile-first funnel.
 */
export function Atmosphere({ slug }: { slug: ArchetypeSlug }) {
  return (
    <div
      className="atmosphere"
      aria-hidden
      style={{ backgroundImage: `url(/atmosphere/${slug}.webp)` }}
    />
  );
}
