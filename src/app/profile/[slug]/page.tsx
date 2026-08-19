import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchetypeCardView } from '@/cards/ArchetypeCardView';
import { Arc } from '@/components/Arc';
import { Atmosphere } from '@/components/Atmosphere';
import { OrganicCapture } from '@/components/OrganicCapture';
import { PlanCta } from '@/components/PlanCta';
import { Personalised } from '@/components/Personalised';
import { archetypeColour, type ArchetypeSlug } from '@/design/tokens';
import { allSlugs, archetypes } from '@/quiz/archetypes';

/**
 * One page, two jobs.
 *
 * For someone who just finished the quiz, this is the result. For someone
 * arriving from a search or a pin, it's the archetype landing page. Making
 * them the same page is what the plan means by "the page *is* the funnel" —
 * there's no separate result screen to maintain, and every quiz result is a
 * URL that's already indexed and already shareable.
 *
 * This is the dashboard step of the funnel — recognition, explanation, then
 * the arc. The selling happens on /plan, deliberately not here: a page that
 * has to be generous enough to rank and to be shared can't also be
 * single-minded about a price.
 *
 * Someone arriving from the quiz has already given an email one screen ago.
 * Someone arriving from Google or a pin hasn't, so the capture below renders
 * only for them.
 */

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const archetype = archetypes[slug as ArchetypeSlug];
  if (!archetype) return {};

  return {
    title: `${archetype.name} — your energy profile`,
    description: archetype.line,
    openGraph: {
      title: archetype.name,
      description: archetype.line,
      images: [`/api/card/${slug}.png`],
    },
  };
}

export default async function Profile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const archetype = archetypes[slug as ArchetypeSlug];
  if (!archetype) notFound();

  const palette = archetypeColour[archetype.slug];

  return (
    <main className="shell">
      <Atmosphere slug={archetype.slug} />
      <div className="stack" style={{
          gap: 'var(--space-7)',
          ['--accent' as string]: palette.glow,
          ['--ground' as string]: palette.ground,
        }}>
        <div className="card-frame">
          <ArchetypeCardView slug={archetype.slug} showWordmark={false} />
        </div>

        {/* The card first, then the line that explains how to read it, then
            the personalised number. Explaining the picture before decorating
            it — the cutoff means nothing until the curve is legible. */}
        <section className="stack" style={{ gap: 'var(--space-3)' }}>
          <p className="section-label">This is your baseline</p>
          <p className="mechanism">
            The solid line is the shape your day takes now. The dashed one is
            where the protocol takes it.
          </p>
        </section>

        <Personalised slug={archetype.slug} />

        <section className="stack" style={{ gap: 'var(--space-4)' }}>
          <p className="section-label">Six signs</p>
          <ul className="signs">
            {archetype.signs.map((sign) => (
              <li key={sign}>{sign}</li>
            ))}
          </ul>
        </section>

        <section className="stack" style={{ gap: 'var(--space-4)' }}>
          <p className="section-label">What&apos;s actually happening</p>
          <p className="mechanism">{archetype.mechanism}</p>
        </section>

        <section className="first-change">
          <p className="section-label">Start here, today</p>
          <h3>{archetype.firstChange.action}</h3>
          <p className="why">{archetype.firstChange.why}</p>
        </section>

        <Arc slug={archetype.slug} />

        <PlanCta slug={archetype.slug} />

        <OrganicCapture slug={archetype.slug} />


      </div>
    </main>
  );
}
