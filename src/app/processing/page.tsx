'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ArchetypeSlug } from '@/design/tokens';
import { archetypeColour } from '@/design/tokens';
import { archetypes } from '@/quiz/archetypes';
import type { Answers, Result } from '@/quiz/types';
import { patchStoredAnswers, useStoredResult } from '@/quiz/useStoredResult';

/**
 * The processing screen.
 *
 * Scoring is instant — this screen isn't waiting on it. It's here because a
 * result that lands the moment you tap feels guessed, while the same result
 * after visible work feels computed. That perception carries the profile.
 *
 * Two honesty rules, since this is the one screen built on perception:
 *
 *   1. Every label is something the scorer genuinely does. It really does
 *      read the wake time against the caffeine answer, and really does rank
 *      all four archetypes. Pacing true statements is fine; inventing
 *      impressive ones is not, and would be worse copy anyway.
 *   2. The mid-flight question is a real question whose answer is really
 *      kept and really feeds a protocol rule. It is not a device for
 *      stretching the wait — it's the last input, asked where attention is
 *      highest.
 */

const RUN_MS = 4200;   // 0% up to the question
const FINISH_MS = 3000; // question to 100%
const PAUSE_AT = 0.56;

export default function Processing() {
  const router = useRouter();
  const stored = useStoredResult();

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'running' | 'asking' | 'finishing'>('running');
  const frame = useRef<number>(0);

  const steps = useMemo(
    () => (stored ? buildSteps(stored.answers, stored.result) : []),
    [stored],
  );
  const slug = stored?.result.primary;
  /* Don't re-ask on a second visit — coming back through the funnel and
     being asked something you already answered reads as a broken loop. */
  const candidate = slug ? midFlight[slug] : null;
  const question =
    candidate && stored && stored.answers[candidate.id] === undefined ? candidate : null;

  useEffect(() => {
    if (stored === null) router.replace('/');
  }, [stored, router]);

  /* One animation loop for both legs of the run. */
  const animate = useCallback((from: number, to: number, ms: number, onDone: () => void) => {
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      /* ease-out: fast at first, then slows — reads as work getting harder
         rather than a constant-rate bar, which reads as a fake one. */
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(from + (to - from) * eased);

      if (t < 1) frame.current = requestAnimationFrame(tick);
      else onDone();
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  useEffect(() => {
    if (steps.length === 0 || phase !== 'running') return;
    return animate(0, PAUSE_AT, RUN_MS, () => setPhase(question ? 'asking' : 'finishing'));
  }, [steps.length, phase, question, animate]);

  useEffect(() => {
    if (phase !== 'finishing') return;
    return animate(PAUSE_AT, 1, FINISH_MS, () => {
      setTimeout(() => router.replace('/email'), 600);
    });
  }, [phase, animate, router]);

  if (!stored || steps.length === 0 || !slug) return null;

  const percent = Math.round(progress * 100);
  const accent = archetypeColour[slug].glow;
  const activeStep = steps[Math.min(steps.length - 1, Math.floor(progress * steps.length))];

  function answer(value: string) {
    if (!question) return;
    patchStoredAnswers({ [question.id]: value });
    setPhase('finishing');
  }

  return (
    <main className="shell processing">
      <div className="stack" style={{ gap: 'var(--space-6)', ['--accent' as string]: accent }}>
        <Ring percent={percent} accent={accent} />

        {phase === 'asking' && question ? (
          <div className="stack midflight" style={{ gap: 'var(--space-4)' }}>
            <p className="section-label">One more thing</p>
            <h2 className="midflight-question">{question.prompt}</h2>
            <p className="note" style={{ marginTop: 0 }}>{question.why}</p>
            <div className="options">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  className="option"
                  onClick={() => answer(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="processing-step">{activeStep}</p>
        )}
      </div>
    </main>
  );
}

function Ring({ percent, accent }: { percent: number; accent: string }) {
  const R = 84;
  const circumference = 2 * Math.PI * R;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg viewBox="0 0 200 200" className="ring" role="img" aria-label={`${percent}% complete`}>
      <defs>
        <filter id="ring-halo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <circle cx="100" cy="100" r={R} fill="none" stroke="var(--c-rule)" strokeWidth="6" />

      {/* drawn twice: a soft halo under a crisp arc, same as the cards */}
      <g transform="rotate(-90 100 100)">
        <circle
          cx="100" cy="100" r={R} fill="none" stroke={accent} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" opacity="0.4" filter="url(#ring-halo)"
        />
        <circle
          cx="100" cy="100" r={R} fill="none" stroke={accent} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </g>

      <text
        x="100" y="100" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-mono)" fontSize="42" fill="var(--c-bright)"
      >
        {percent}%
      </text>
    </svg>
  );
}

/**
 * The last input, asked at the point of highest attention — and different per
 * archetype, because the rule it feeds is different. Each answer is stored
 * and used; none of these is decoration.
 */
const midFlight: Record<ArchetypeSlug, {
  id: string;
  prompt: string;
  why: string;
  options: { id: string; label: string }[];
}> = {
  'delayed-crasher': {
    id: 'afternoon-sitting',
    prompt: 'Is your afternoon mostly sitting?',
    why: 'It decides whether your post-lunch action is a walk or something shorter.',
    options: [
      { id: 'yes', label: 'Almost entirely' },
      { id: 'some', label: 'I move around a bit' },
      { id: 'no', label: "No, I'm on my feet" },
    ],
  },
  'slow-starter': {
    id: 'morning-food',
    prompt: 'Do you eat within an hour of waking?',
    why: 'It changes where the first protein action lands in your morning.',
    options: [
      { id: 'yes', label: 'Usually' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'no', label: 'Almost never' },
    ],
  },
  'wired-and-tired': {
    id: 'screen-in-bed',
    prompt: 'Do you look at a screen in bed?',
    why: 'It sets where your wind-down ramp starts, and how long it needs to be.',
    options: [
      { id: 'yes', label: 'Every night' },
      { id: 'sometimes', label: 'Some nights' },
      { id: 'no', label: 'No' },
    ],
  },
  'weekend-reset': {
    id: 'weekend-nap',
    prompt: 'Do you nap at the weekend?',
    why: 'Naps can repay a bad night or push Monday further out. Timing decides which.',
    options: [
      { id: 'yes', label: 'Most weekends' },
      { id: 'sometimes', label: 'Now and then' },
      { id: 'no', label: 'Never' },
    ],
  },
};

/** Steps reference the person's own answers wherever they can. */
function buildSteps(answers: Answers, result: Result | null): string[] {
  const steps: string[] = ['Reading your answers'];

  const wake = typeof answers['wake-time'] === 'string' ? answers['wake-time'] : null;
  const lastCoffee = answers['last-coffee'];

  if (wake && lastCoffee && lastCoffee !== 'none') {
    steps.push(`Checking your caffeine against a ${wake} start`);
  } else if (wake) {
    steps.push(`Anchoring the day to a ${wake} start`);
  }

  if (answers['weekend-swing'] === 'two-three' || answers['weekend-swing'] === 'no-alarm') {
    steps.push('Measuring your weekday-to-weekend swing');
  }

  steps.push('Scoring all four energy patterns');
  steps.push('Plotting the shape of your day');

  if (result) steps.push(`Matched: ${archetypes[result.primary].name}`);

  return steps;
}
