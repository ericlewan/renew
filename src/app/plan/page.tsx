'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Atmosphere } from '@/components/Atmosphere';
import { Evidence } from '@/components/Evidence';
import { Objections } from '@/components/Objections';
import { Pricing } from '@/components/Pricing';
import { ProtocolPreview } from '@/components/ProtocolPreview';
import { StickyCta } from '@/components/StickyCta';
import { Wordmark } from '@/components/Wordmark';
import { archetypeColour } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';
import { useStoredResult } from '@/quiz/useStoredResult';

/**
 * The selling page.
 *
 * Split out from the profile because they're different jobs. The profile
 * answers "what is going on with me" and has to be generous enough to share
 * and to rank. This page answers "what do I do about it, and what does it
 * cost" — and it gets to be single-minded about that.
 *
 * Splitting them also means the price can be tested without touching the page
 * that carries the SEO.
 */
export default function Plan() {
  const router = useRouter();
  const stored = useStoredResult();

  /* No result means the funnel was entered sideways — there is nothing to
     price. Send them to the start rather than showing a generic paywall. */
  useEffect(() => {
    if (stored === null) router.replace('/');
  }, [stored, router]);

  if (!stored) return null;
  const slug = stored.result.primary;

  const archetype = archetypes[slug];
  const palette = archetypeColour[slug];

  return (
    <main className="shell" style={{ ['--accent' as string]: palette.glow }}>
      <Atmosphere slug={slug} />

      <header className="masthead">
        <Wordmark height={24} />
      </header>

      <div className="stack" style={{ gap: 'var(--space-7)' }}>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <p className="section-label">{archetype.name}</p>
          <h1 className="proof-headline">{archetype.promise}</h1>
        </div>

        <ProtocolPreview slug={slug} />

        <Pricing id="pricing" />

        <Evidence />

        <Objections />

        <button className="back" onClick={() => router.back()}>
          &larr; Back to my baseline
        </button>
      </div>

      <StickyCta watch="pricing" />
    </main>
  );
}
