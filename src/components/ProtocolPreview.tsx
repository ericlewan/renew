'use client';

import type { ArchetypeSlug } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';
import { caffeineCutoff } from '@/quiz/score';
import { useStoredResult } from '@/quiz/useStoredResult';
import { annualSaving, offer } from '@/lib/offer';

/**
 * The cliff.
 *
 * The free page above this is a diagnosis, and a diagnosis feels complete —
 * which is exactly the problem. This section exists to make the gap between
 * "what's wrong" and "what to do today" visible rather than argued.
 *
 * It does that by showing a real protocol with the first action legible and
 * the rest locked, and by stating the thing a static page can't do: tomorrow
 * this is different, because last night was different.
 */

type Action = { time: string; text: string };

/** Illustrative shape only — the rules engine replaces this. See 02-plan.md §7. */
function todaysShape(slug: ArchetypeSlug, cutoff: string | null): Action[] {
  const shapes: Record<ArchetypeSlug, Action[]> = {
    'delayed-crasher': [
      { time: '13:10', text: 'Ten minutes outside, straight after you eat' },
      { time: cutoff ?? '13:45', text: 'Last caffeine of the day' },
      { time: '14:30', text: 'Put the shallow work here, not the hard thing' },
      { time: '20:00', text: 'Last food' },
    ],
    'slow-starter': [
      { time: '07:15', text: 'Outside for ten minutes, before the coffee' },
      { time: '08:30', text: 'First caffeine — not before this' },
      { time: '09:45', text: 'Protein, even something small' },
      { time: '21:30', text: 'Screens down' },
    ],
    'wired-and-tired': [
      { time: '07:30', text: 'Ten minutes of daylight, as early as you can' },
      { time: cutoff ?? '12:30', text: 'Last caffeine — this is the one that matters' },
      { time: '18:30', text: 'Move the hard task here, not to 21:00' },
      { time: '21:00', text: 'Start the wind-down ramp' },
    ],
    'weekend-reset': [
      { time: '07:15', text: 'Same wake time as Saturday. Hold the band' },
      { time: '08:00', text: 'Outside before the first meeting' },
      { time: cutoff ?? '14:15', text: 'Last caffeine' },
      { time: '22:30', text: 'Lights down — Monday starts tonight' },
    ],
  };
  return shapes[slug];
}

export function ProtocolPreview({ slug }: { slug: ArchetypeSlug }) {
  const stored = useStoredResult();
  const cutoff =
    stored?.result.primary === slug
      ? caffeineCutoff(stored.result.wakeTime, slug)
      : null;

  const actions = todaysShape(slug, cutoff);
  const archetype = archetypes[slug];

  return (
    <section className="protocol">
      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <p className="section-label">Today&apos;s protocol</p>
        <h3 className="protocol-title">Tomorrow morning, it looks like this.</h3>
        <p className="why" style={{ color: 'var(--c-ink-muted)' }}>
          Not a plan you finish. Tomorrow this is different, because last night
          was different.
        </p>
      </div>

      <ol className="actions">
        {actions.map((action, index) => (
          <li key={action.time} className="action" data-locked={index > 0}>
            <span className="action-time">{index > 0 ? '••:••' : action.time}</span>
            <span className="action-text">
              {index > 0 ? <span className="redacted" aria-hidden /> : action.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        Three further actions are available with a subscription.
      </p>

      <div className="paywall">
        {/* The page above already leads with the promise — repeating it here
            reads as a page that ran out of things to say. This beat closes
            instead: what it costs you daily, and what it does with that. */}
        <p className="paywall-lead">
          Twenty seconds each morning. The protocol does the rest.
        </p>

        <ul className="includes">
          <li>A 20-second check-in, and today&apos;s 3–5 actions</li>
          <li>Recalculated daily against how you actually slept</li>
          <li>A weekly readout of what actually moves your energy</li>
          <li>The {archetype.name} protocol pack as a PDF</li>
        </ul>

        <div className="prices">
          <button className="cta price-annual">
            Get the protocol — {offer.annual.label} {offer.annual.period}
          </button>
          <p className="price-note">
            Or {offer.monthly.label} {offer.monthly.period}. Annual saves{' '}
            {annualSaving}%.
            {offer.founding.enabled && (
              <>
                {' '}
                Founding access — the daily app opens {offer.founding.shipDate},
                and your pack arrives today.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
