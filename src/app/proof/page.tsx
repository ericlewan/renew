'use client';

import Link from 'next/link';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Figure } from '@/components/Figure';
import { StickyCta } from '@/components/StickyCta';
import { hasSocialProof, proof } from '@/lib/proof';
import { intakeServerSnapshot, intakeSnapshot, subscribeIntake } from '@/quiz/intake';

/**
 * The screen between the landing and the quiz.
 *
 * It exists to spend the micro-commitment that the gender tap just created —
 * someone who has tapped once is far more likely to tap sixteen more times,
 * but only if the next screen gives them a reason rather than another form.
 *
 * At zero users this shows the method. It switches to counts and quotes on
 * its own once those are real. See src/lib/proof.ts.
 */
export default function Proof() {
  const router = useRouter();
  const intake = useSyncExternalStore(subscribeIntake, intakeSnapshot, intakeServerSnapshot);

  /* Landing on this page cold, without having chosen on the landing page,
     means the funnel was entered sideways — send them to the start. */
  useEffect(() => {
    if (intake === null) router.replace('/');
  }, [intake, router]);

  if (!intake) return null;

  return (
    <main className="shell">
      <div className="stack" style={{ gap: 'var(--space-7)' }}>
        <div className="stack" style={{ gap: 'var(--space-4)' }}>
          <p className="section-label">Before we start</p>
          <h1 className="proof-headline">
            You&apos;ll have your baseline in two minutes. Your first protocol
            runs tomorrow morning.
          </h1>
        </div>

        {/* First light arriving — the headline above promises tomorrow
            morning, so the image is the same moment. */}
        <Figure src="dawn" />

        {hasSocialProof() ? (
          <div className="stack" style={{ gap: 'var(--space-5)' }}>
            {proof.memberCount !== null && (
              <p className="proof-stat">
                <strong>{proof.memberCount.toLocaleString()}</strong> people have
                taken it
              </p>
            )}
            {proof.rating !== null && (
              <p className="proof-stat">
                <strong>{proof.rating.score.toFixed(1)}</strong> from{' '}
                {proof.rating.count.toLocaleString()} ratings
              </p>
            )}
            {proof.testimonials.map((testimonial) => (
              <figure key={testimonial.attribution} className="quote">
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>{testimonial.attribution}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <ol className="method">
            {proof.method.map((item, index) => (
              <li key={item.title}>
                <span className="method-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="method-title">{item.title}</h2>
                  <p className="method-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'stretch' }}>
          <Link href="/quiz" className="cta" style={{ textAlign: 'center' }}>
            Start the read
          </Link>
          <p className="reassure" style={{ textAlign: 'center' }}>
            16 questions. About two minutes.
          </p>
        </div>
      </div>

      {/* Three method blocks make this long enough that the inline button
          below the fold is easy to never reach. */}
      <StickyCta href="/quiz" label="Start the read" />
    </main>
  );
}
