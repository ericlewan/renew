'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CaffeineCurve } from '@/cards/CaffeineCurve';
import { breakAfter } from '@/quiz/breaks';
import { readIntake } from '@/quiz/intake';
import { NO_BACK_FROM_INDEX, questions } from '@/quiz/questions';
import { score } from '@/quiz/score';
import { saveStoredResult } from '@/quiz/useStoredResult';
import type { Answers } from '@/quiz/types';

/**
 * The quiz.
 *
 * Answers live in component state and are handed onward through
 * sessionStorage rather than the URL — the archetype pages are indexable and
 * shouldn't carry a stranger's answers in a shareable link.
 *
 * Completion goes to /processing, not straight to the result. The funnel from
 * here is: processing → email → dashboard → plan.
 *
 * Interstitials are interleaved between questions rather than being their own
 * route, so a break never adds an entry to browser history — hitting back
 * from question ten shouldn't land you on a reassurance screen.
 */
export default function Quiz() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  /* An interstitial is a state of the current question, not a step of its
     own — which keeps indexing simple and keeps history clean. */
  const [onBreak, setOnBreak] = useState(false);

  const question = questions[index];
  const interstitial = breakAfter(question.id);
  const progress = ((index + 1) / questions.length) * 100;
  const canGoBack = index > 0 && index < NO_BACK_FROM_INDEX && !onBreak;

  function commit(next: Answers) {
    setAnswers(next);

    if (breakAfter(question.id)) {
      setOnBreak(true);
      return;
    }

    advance(next);
  }

  function advance(next: Answers) {
    setOnBreak(false);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }

    /* Gender was answered on the landing page, so it's folded back in here
       rather than living in a second store. Neither it nor age carries any
       scoring weight — they're for segmentation and, later, protocol rules. */
    const intake = readIntake();
    const complete: Answers = intake ? { ...next, gender: intake.gender } : next;

    saveStoredResult({ answers: complete, result: score(complete) });
    router.push('/processing');
  }

  function choose(optionId: string) {
    if (question.kind === 'multi') {
      const current = (answers[question.id] as string[]) ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [question.id]: next });
      return;
    }

    commit({ ...answers, [question.id]: optionId });
  }

  const selected = answers[question.id];

  if (onBreak && interstitial) {
    return (
      <main className="shell">
        <div className="stack" style={{ gap: 'var(--space-6)' }}>
          <div className="progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="stack interstitial" style={{ gap: 'var(--space-4)' }}>
            <p className="section-label">{interstitial.label}</p>
            <h2 className="interstitial-headline">
              {interstitial.headline(answers)}
            </h2>
            <p className="interstitial-body">{interstitial.body(answers)}</p>

            {interstitial.diagram === 'caffeine' && (
              <CaffeineCurve
                wakeTime={typeof answers['wake-time'] === 'string' ? answers['wake-time'] : null}
                lastCoffeeH={lastCoffeeHours(answers['last-coffee'])}
              />
            )}
          </div>

          <button className="cta" onClick={() => advance(answers)}>
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="stack">
        <div className="progress" aria-hidden>
          <span style={{ width: `${progress}%` }} />
        </div>

        <div>
          <h2 className="question">{question.prompt}</h2>
          {question.note && <p className="note">{question.note}</p>}
        </div>

        {question.kind === 'time' ? (
          <TimeQuestion
            value={(selected as string) ?? ''}
            onSubmit={(value) => commit({ ...answers, [question.id]: value })}
          />
        ) : (
          <div className="options">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(selected)
                ? selected.includes(option.id)
                : selected === option.id;

              return (
                <button
                  key={option.id}
                  className="option"
                  data-selected={isSelected}
                  onClick={() => choose(option.id)}
                >
                  {option.label}
                  {option.detail && <span className="detail">{option.detail}</span>}
                </button>
              );
            })}
          </div>
        )}

        {question.kind === 'multi' && (
          <button
            className="cta"
            onClick={() => commit({ ...answers, [question.id]: (selected as string[]) ?? [] })}
          >
            {index + 1 === questions.length ? 'See my profile' : 'Continue'}
          </button>
        )}

        {canGoBack && (
          <button className="back" onClick={() => setIndex(index - 1)}>
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}

/** Hours after waking that the last cup lands, from their own answer. */
function lastCoffeeHours(answer: unknown): number {
  switch (answer) {
    case 'morning': return 3.5;
    case 'early-afternoon': return 6;
    case 'late': return 9;
    case 'on-demand': return 8;
    default: return 6;
  }
}

function TimeQuestion({ value, onSubmit }: { value: string; onSubmit: (v: string) => void }) {
  const [time, setTime] = useState(value || '07:00');

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <input
        className="time-input"
        type="time"
        value={time}
        onChange={(event) => setTime(event.target.value)}
      />
      <button className="cta" onClick={() => onSubmit(time)}>
        Continue
      </button>
    </div>
  );
}
