/**
 * Intake — the two things asked before the quiz proper.
 *
 * Gender is asked on the landing page itself, as the call to action. Tapping
 * an option *is* starting the quiz, so it adds a micro-commitment without
 * adding a step. Age is the first question inside the quiz, where it works as
 * the easy on-ramp before the two revealing ones.
 *
 * Both are stored with the answers and passed through to analytics.
 *
 * A note on what these are allowed to do. Age can legitimately drive protocol
 * rules later — caffeine sensitivity and sleep timing both shift with it.
 * Gender is here for segmentation and copy, and deliberately NOT wired to
 * anything physiological: gender-specific bodily advice is exactly the
 * "no hormones, no conditions" line in the plan, and crossing it is how this
 * becomes a medical product by accident.
 */

/* Storage keys are intentionally NOT derived from the brand token. Renaming
   the product shouldn't invalidate the session of everyone mid-quiz. */
export const INTAKE_KEY = 'baseline:intake';

export type Gender = 'woman' | 'man' | 'other';

export type Intake = {
  gender: Gender;
};

export const genderOptions: { id: Gender; label: string }[] = [
  { id: 'woman', label: 'Woman' },
  { id: 'man', label: 'Man' },
  { id: 'other', label: 'Other' },
];

export function saveIntake(intake: Intake): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(INTAKE_KEY, JSON.stringify(intake));
  cachedRaw = null; // force a re-parse on next read
}

export function readIntake(): Intake | null {
  if (typeof window === 'undefined') return null;
  return parseIntake(sessionStorage.getItem(INTAKE_KEY));
}

function parseIntake(raw: string | null): Intake | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.gender ? (parsed as Intake) : null;
  } catch {
    return null;
  }
}

/* Cached so getSnapshot returns a stable reference — see useStoredResult. */
let cachedRaw: string | null = null;
let cachedValue: Intake | null = null;

export function intakeSnapshot(): Intake | null {
  const raw = sessionStorage.getItem(INTAKE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parseIntake(raw);
  return cachedValue;
}

/** undefined until hydrated — see the note in useStoredResult. */
export function intakeServerSnapshot(): undefined {
  return undefined;
}

export function subscribeIntake(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}
