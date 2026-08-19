import type { ArchetypeSlug } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';

/**
 * What happens after today.
 *
 * The result page used to end on a label, which meant the paywall had to
 * pivot from "here's what's wrong" straight to "now pay" — and that pivot is
 * where the funnel leaks. This section is the bridge: it turns a diagnosis
 * into an arc with a direction and a shape.
 *
 * Every line here describes what the *product* does over time, never what the
 * body will do. "Your protocol narrows to what works for you" is a claim
 * about software and is true. "You'll sleep better by week two" is a claim
 * about a person, and we don't make those.
 */

const stages = [
  {
    when: 'Tomorrow',
    what: 'Your first protocol',
    detail:
      'Three taps when you wake up, then three or four things to do, timed to the day you actually described.',
  },
  {
    when: 'Day 3',
    what: 'The first read',
    detail:
      "The earliest point there's a pattern worth showing you. It's small, and it's yours rather than an average.",
  },
  {
    when: 'Week 2',
    what: 'The weekly readout',
    detail:
      'What your best days had in common, and your worst. This is the part that a competitor cannot copy by looking at screens.',
  },
  {
    when: 'Ongoing',
    what: 'It narrows',
    detail:
      'The protocol drops what does nothing for you and keeps what moves the curve. There is no finish line, and nothing to break.',
  },
];

export function Arc({ slug }: { slug: ArchetypeSlug }) {
  const archetype = archetypes[slug];

  return (
    <section className="stack arc" style={{ gap: 'var(--space-5)' }}>
      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <p className="section-label">Where this goes</p>
        <h2 className="arc-promise">{archetype.promise}</h2>
      </div>

      <ol className="stages">
        {stages.map((stage) => (
          <li key={stage.when}>
            <p className="stage-when">{stage.when}</p>
            <div>
              <h3 className="stage-what">{stage.what}</h3>
              <p className="stage-detail">{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
