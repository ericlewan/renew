'use client';

import Link from 'next/link';
import type { ArchetypeSlug } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';
import { useStoredResult } from '@/quiz/useStoredResult';

/**
 * The step off the dashboard and onto the selling page.
 *
 * The wording differs by where the person came from. Someone who took the
 * quiz has a baseline and is being asked what to do with it. Someone who
 * arrived from a search hasn't answered anything, so sending them to a price
 * would be asking for money before asking a single question — they get
 * pointed at the quiz instead.
 */
export function PlanCta({ slug }: { slug: ArchetypeSlug }) {
  const stored = useStoredResult();

  /* undefined means not read yet. Rendering either branch now would show the
     wrong call to action for a frame and then swap it. */
  if (stored === undefined) return null;

  const fromQuiz = stored?.result.primary === slug;

  return (
    <section className="plan-cta stack" style={{ gap: 'var(--space-4)' }}>
      {fromQuiz ? (
        <>
          <p className="plan-cta-lead">{archetypes[slug].promise}</p>
          <Link href="/plan" className="cta" style={{ textAlign: 'center' }}>
            See my protocol
          </Link>
          <p className="reassure" style={{ textAlign: 'center' }}>
            Starts tomorrow morning.
          </p>
        </>
      ) : (
        <>
          <p className="plan-cta-lead">
            This is one of four patterns. Two minutes of questions will tell you
            whether it&apos;s yours.
          </p>
          <Link href="/" className="cta" style={{ textAlign: 'center' }}>
            Find my baseline
          </Link>
          <p className="reassure" style={{ textAlign: 'center' }}>
            Free. No account.
          </p>
        </>
      )}
    </section>
  );
}
