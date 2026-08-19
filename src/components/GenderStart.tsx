'use client';

import { useRouter } from 'next/navigation';
import { genderOptions, saveIntake, type Gender } from '@/quiz/intake';

/**
 * The landing call to action.
 *
 * This is a gender select doing the job of a "Start" button. Choosing is
 * easier than committing — the question costs nothing to answer, and having
 * answered it once, the next sixteen feel like continuing rather than
 * starting. Adding it as a screen *after* a Start button would be a pure
 * extra step; replacing the button with it is free.
 */
export function GenderStart() {
  const router = useRouter();

  function choose(gender: Gender) {
    saveIntake({ gender });
    router.push('/proof');
  }

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <p className="section-label">To personalise your read</p>
      <div className="gender">
        {genderOptions.map((option) => (
          <button
            key={option.id}
            className="gender-option"
            onClick={() => choose(option.id)}
          >
            {option.label}
            <span aria-hidden>→</span>
          </button>
        ))}
      </div>
      <p className="reassure">Free. No account. 16 questions.</p>
    </div>
  );
}
