import { Figure } from '@/components/Figure';
import { GenderStart } from '@/components/GenderStart';
import { Wordmark } from '@/components/Wordmark';

/**
 * Landing.
 *
 * The hook stays specific — "3pm" is a pain people already search for, which
 * is what makes it work as a Pinterest destination — but it points at the
 * outcome rather than the reveal. "Find out why" sells a diagnosis, and a
 * diagnosis is free; the thing being sold is the change.
 *
 * One visual moment below the hook, not two. The four curves used to sit
 * here as well; stacked with a photograph they competed, and the curves
 * argue a point that the proof screen is already built to make — so they
 * moved there and the landing kept the atmosphere.
 *
 * The call to action is a gender select rather than a Start button. Answering
 * is easier than committing, and one tap in makes the next sixteen feel like
 * continuing. The page stays a server component so it remains indexable;
 * only the selector is client-side.
 */
export default function Landing() {
  return (
    <main className="shell">
      <header className="masthead">
        <Wordmark height={26} />
      </header>

      <div className="stack hero" style={{ gap: 'var(--space-6)' }}>
        <h1>Stop crashing at 3pm.</h1>

        <p className="sub">
          Two minutes of questions gets you your baseline — the shape your day
          actually takes, and where it breaks. Then a daily protocol that
          changes it, three or four small things at a time.
        </p>

        <GenderStart />
      </div>

      {/* Cool-cast and self-contained, so it sits in the ground rather than
          on it. An earlier warm frame fought the blue-black background and
          its subject ran off both edges, which read as a crop rather than a
          composition. */}
      <Figure src="drift" tall />
    </main>
  );
}
