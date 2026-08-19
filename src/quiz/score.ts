import type { ArchetypeSlug } from '@/design/tokens';
import { archetypeColour } from '@/design/tokens';
import { questions } from './questions';
import type { Answers, Result, Weights } from './types';

const SLUGS = Object.keys(archetypeColour) as ArchetypeSlug[];

/** A secondary archetype is named only if it lands within this of the primary. */
const SECONDARY_THRESHOLD = 0.75;

/**
 * Scores are normalised against the maximum each archetype could possibly
 * score, rather than compared raw.
 *
 * This matters more than it looks. Raw sums quietly favour whichever
 * archetype happens to appear in the most options, so adding one question
 * later could skew every result without anyone noticing. Normalising makes
 * the question set safe to edit.
 */
function maxAttainable(): Record<ArchetypeSlug, number> {
  const max = blankScores();

  for (const question of questions) {
    if (!question.options) continue;

    for (const slug of SLUGS) {
      if (question.kind === 'multi') {
        // every option can be picked at once
        max[slug] += question.options.reduce(
          (sum, option) => sum + (option.weights?.[slug] ?? 0),
          0,
        );
      } else {
        max[slug] += Math.max(
          0,
          ...question.options.map((option) => option.weights?.[slug] ?? 0),
        );
      }
    }
  }

  return max;
}

function blankScores(): Record<ArchetypeSlug, number> {
  return SLUGS.reduce(
    (acc, slug) => ({ ...acc, [slug]: 0 }),
    {} as Record<ArchetypeSlug, number>,
  );
}

function addWeights(into: Record<ArchetypeSlug, number>, weights?: Weights) {
  if (!weights) return;
  for (const slug of SLUGS) into[slug] += weights[slug] ?? 0;
}

export function score(answers: Answers): Result {
  const raw = blankScores();

  for (const question of questions) {
    if (!question.options) continue;
    const answer = answers[question.id];
    if (answer === undefined) continue;

    const chosen = Array.isArray(answer) ? answer : [answer];
    for (const id of chosen) {
      addWeights(raw, question.options.find((o) => o.id === id)?.weights);
    }
  }

  const max = maxAttainable();
  const scores = blankScores();
  for (const slug of SLUGS) {
    scores[slug] = max[slug] > 0 ? raw[slug] / max[slug] : 0;
  }

  const ranked = [...SLUGS].sort((a, b) => scores[b] - scores[a]);
  const primary = resolvePrimary(ranked, scores, answers);

  const runnerUp = ranked.find((slug) => slug !== primary)!;
  const secondary =
    scores[primary] > 0 && scores[runnerUp] / scores[primary] >= SECONDARY_THRESHOLD
      ? runnerUp
      : null;

  return { primary, secondary, scores, wakeTime: readWakeTime(answers) };
}

/**
 * Ties are broken by what the person said themselves in "where does the day
 * go wrong" — their own answer outranks our arithmetic. Only if that's
 * missing or unhelpful do we fall back to a fixed order.
 */
function resolvePrimary(
  ranked: ArchetypeSlug[],
  scores: Record<ArchetypeSlug, number>,
  answers: Answers,
): ArchetypeSlug {
  const top = ranked[0];
  const tied = ranked.filter((slug) => Math.abs(scores[slug] - scores[top]) < 0.001);
  if (tied.length === 1) return top;

  const stated = statedArchetype(answers);
  if (stated && tied.includes(stated)) return stated;

  const fallback: ArchetypeSlug[] = [
    'delayed-crasher',
    'wired-and-tired',
    'slow-starter',
    'weekend-reset',
  ];
  return fallback.find((slug) => tied.includes(slug)) ?? top;
}

function statedArchetype(answers: Answers): ArchetypeSlug | null {
  const answer = answers['where-it-breaks'];
  if (typeof answer !== 'string') return null;

  const map: Record<string, ArchetypeSlug> = {
    'first-hours': 'slow-starter',
    afternoon: 'delayed-crasher',
    'after-dinner': 'wired-and-tired',
    monday: 'weekend-reset',
  };
  return map[answer] ?? null;
}

function readWakeTime(answers: Answers): string | null {
  const answer = answers['wake-time'];
  return typeof answer === 'string' && /^\d{1,2}:\d{2}$/.test(answer) ? answer : null;
}

/**
 * Hours after waking at which caffeine should stop, per archetype.
 *
 * PLACEHOLDER CONSTANTS. These are reasonable and internally consistent, but
 * they are not researched values — they're here so the result page can show
 * something real-looking end to end. Replace them from the rules spreadsheet
 * before this is in front of a paying customer.
 */
const CAFFEINE_CUTOFF_HOURS: Record<ArchetypeSlug, number> = {
  'wired-and-tired': 5.5, // tightest — this is the archetype's core rule
  'delayed-crasher': 7,
  'slow-starter': 7,
  'weekend-reset': 7,
};

/**
 * The personalised number shown free on the result page. It's the cheapest
 * possible proof that the thing computes something specific to you.
 */
export function caffeineCutoff(wakeTime: string | null, archetype: ArchetypeSlug): string | null {
  if (!wakeTime) return null;

  const [hours, minutes] = wakeTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  const offset = CAFFEINE_CUTOFF_HOURS[archetype];
  const total = hours * 60 + minutes + offset * 60;

  const h = Math.floor(total / 60) % 24;
  const m = Math.round(total % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
