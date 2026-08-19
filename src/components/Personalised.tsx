'use client';

import type { ArchetypeSlug } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';
import { caffeineCutoff } from '@/quiz/score';
import { useStoredResult } from '@/quiz/useStoredResult';

/**
 * The only part of the archetype page that differs between "someone who just
 * took the quiz" and "someone who arrived from Google".
 *
 * It renders nothing on the server, so the page stays statically indexable,
 * then fills in on hydration if there's a result in this session. That's why
 * one page can be both the SEO asset and the quiz result.
 */
export function Personalised({ slug }: { slug: ArchetypeSlug }) {
  const stored = useStoredResult();
  if (!stored || stored.result.primary !== slug) return null;

  const { secondary, wakeTime } = stored.result;
  const cutoff = caffeineCutoff(wakeTime, slug);
  if (!cutoff && !secondary) return null;

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      {secondary && (
        <p className="note" style={{ marginTop: 0 }}>
          With a {archetypes[secondary].name.replace(/^The /, '')} streak.
        </p>
      )}

      {cutoff && (
        <div className="first-change">
          <p className="section-label">Your caffeine cutoff</p>
          <p className="cutoff">{cutoff}</p>
          <p className="why">
            Calculated from the time you actually wake up, not a generic rule.
            After this, it&apos;s still in your system when you&apos;re trying
            to sleep.
          </p>
        </div>
      )}
    </div>
  );
}
