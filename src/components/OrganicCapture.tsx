'use client';

import { useState } from 'react';
import type { ArchetypeSlug } from '@/design/tokens';
import { useStoredResult } from '@/quiz/useStoredResult';

/**
 * Email capture for people who did NOT come through the quiz.
 *
 * Quiz-takers were asked one screen ago, on the dedicated email step, and
 * asking twice reads as nagging. But these pages are also the SEO surface and
 * the destination for every pin, so search and Pinterest traffic lands here
 * having never been asked at all — and that traffic is the entire point of
 * the channel.
 *
 * Renders nothing on the server, so the page stays static and indexable.
 */
export function OrganicCapture({ slug }: { slug: ArchetypeSlug }) {
  const stored = useStoredResult();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  /* Quiz-takers were asked one screen ago; only organic arrivals see this.
     Checking for an explicit null rather than falsiness matters — during
     hydration the value is undefined, and treating that as "no result" would
     flash the form at everyone who just gave their address. */
  if (stored !== null) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes('@')) return;

    setState('sending');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, archetype: slug, gender: null, age: null }),
      });
      setState(response.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="capture stack">
        <p className="section-label">On its way</p>
        <p>The six-page version is in your inbox.</p>
      </div>
    );
  }

  return (
    <form className="capture stack" onSubmit={submit}>
      <div>
        <p className="section-label">The full read</p>
        <h3 style={{ fontSize: 'var(--size-lg)', marginTop: 'var(--space-2)' }}>
          Get this as a six-page PDF.
        </h3>
      </div>

      <div className="field">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          required
        />
        <button className="cta" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Send it'}
        </button>
      </div>

      {state === 'error' && <p className="note">That didn&apos;t go through. Try once more?</p>}
    </form>
  );
}
