import { archetypeColour } from '@/design/tokens';
import { allSlugs } from '@/quiz/archetypes';
import { curvePath } from './curve';

/**
 * The landing hero: all four energy curves at once.
 *
 * It's the question the quiz answers, asked without words — four shapes a day
 * can take, four different colours of light, and you don't yet know which one
 * is yours. It also does the work of showing what the product's output looks
 * like before anyone commits two minutes to a quiz.
 *
 * Reuses the same curve module the cards do, so it can never drift from them.
 */

const BOX = { x: 0, y: 24, width: 1000, height: 300 };

export function HeroCurves() {
  return (
    <svg
      viewBox="0 0 1000 360"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <filter id="hero-halo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        {/* The curves run off both edges rather than stopping — a day doesn't
            begin and end at the margin. */}
        <linearGradient id="hero-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="18%" stopColor="#fff" stopOpacity="1" />
          <stop offset="82%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-mask">
          <rect x="0" y="0" width="1000" height="360" fill="url(#hero-fade)" />
        </mask>
      </defs>

      <g id="hero-curves" mask="url(#hero-mask)">
        {allSlugs.map((slug) => {
          const path = curvePath(slug, BOX);
          const { glow } = archetypeColour[slug];

          return (
            <g key={slug} id={slug}>
              <path
                d={path}
                fill="none"
                stroke={glow}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.28"
                filter="url(#hero-halo)"
              />
              <path
                d={path}
                fill="none"
                stroke={glow}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
