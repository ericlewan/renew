'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoredResult } from '@/quiz/useStoredResult';

/**
 * The email step.
 *
 * Its own screen, between the processing animation and the result. This is
 * the highest-intent moment in the entire funnel — the answer exists, it's
 * about them, and it's one tap away — and it's the only point where asking
 * for an email costs nothing in momentum.
 *
 * It is not a wall. Skipping is visible and works, because a blocked result
 * produces a bounce and a bad taste, and the profile pages have to stay
 * indexable for organic traffic anyway. The trade is honest: give an address,
 * get the thing you'd get regardless, plus the PDF.
 */
export default function EmailStep() {
  const router = useRouter();
  const stored = useStoredResult();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');

  useEffect(() => {
    if (stored === null) router.replace('/');
  }, [stored, router]);

  if (!stored) return null;

  const { result, answers } = stored;
  const next = `/profile/${result.primary}`;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes('@')) return;

    setState('sending');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          archetype: result.primary,
          gender: answers.gender ?? null,
          age: answers.age ?? null,
        }),
      });

      if (!response.ok) {
        setState('error');
        return;
      }
      router.push(next);
    } catch {
      setState('error');
    }
  }

  return (
    <main className="shell">
      <form className="stack" style={{ gap: 'var(--space-6)' }} onSubmit={submit}>
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <p className="section-label">Your read is ready</p>
          <h1 className="proof-headline">Where should we send it?</h1>
          <p className="sub" style={{ marginTop: 0 }}>
            You&apos;ll see it on the next screen either way. The email gets you
            the six-page version, and the protocol when it opens.
          </p>
        </div>

        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <input
            className="email-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            autoComplete="email"
            required
          />
          <button className="cta" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send it and continue'}
          </button>
          <button
            type="button"
            className="back"
            style={{ textAlign: 'center' }}
            onClick={() => router.push(next)}
          >
            Skip — just show me the result
          </button>
        </div>

        {state === 'error' && (
          <p className="note">That didn&apos;t go through. Try once more?</p>
        )}
      </form>
    </main>
  );
}
