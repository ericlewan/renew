/**
 * The questions someone asks themselves right before they don't buy.
 *
 * Answering them on the page costs nothing and removes the reasons to leave
 * and "think about it". Every answer here is one the product actually keeps —
 * these are commitments, not copy.
 */

const objections = [
  {
    q: 'What if I miss a day?',
    a: 'Nothing happens. There are no streaks to break and no score to lose. A missed day is a gap in the data, and the protocol carries on from wherever you pick it up.',
  },
  {
    q: 'Do I need a watch or a tracker?',
    a: 'No. The whole thing runs on a 20-second check-in you do yourself. No wearable, no sensors, no permissions — which is also why it works the same on any phone.',
  },
  {
    q: 'Is this an app I have to install?',
    a: 'It runs in your browser. You can add it to your home screen so it opens like an app, but there is nothing to download and no app store involved.',
  },
  {
    q: 'Is this medical advice?',
    a: 'No, and it never will be. It does not diagnose anything and does not treat anything. It changes when you do ordinary things — light, food, caffeine, movement. If something feels genuinely wrong, that is a conversation for a doctor, not an app.',
  },
  {
    q: 'How is this different from what I already tried?',
    a: 'Most things in this category tell you how you did yesterday. This one tells you what to do today, and the instruction changes based on the night you actually had.',
  },
];

export function Objections() {
  return (
    <section className="stack" style={{ gap: 'var(--space-5)' }}>
      <p className="section-label">Before you decide</p>
      <dl className="objections">
        {objections.map((item) => (
          <div key={item.q}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
