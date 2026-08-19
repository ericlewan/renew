/**
 * Scoring check.
 *
 * Runs four "textbook" answer sets — one written to look exactly like each
 * archetype — plus a deliberately mixed one, and asserts the routing.
 *
 *   npm run check
 *
 * This is the test worth having. If the quiz stops routing correctly, every
 * downstream thing (result page, protocol, email sequence) is wrong too, and
 * nothing else in the funnel would tell you.
 */
import type { ArchetypeSlug } from '@/design/tokens';
import { questions } from './questions';
import { caffeineCutoff, score } from './score';
import type { Answers } from './types';

const textbook: Record<ArchetypeSlug, Answers> = {
  'delayed-crasher': {
    'morning-scene': 'fine',
    'evening-scene': 'genuinely-tired',
    'wake-time': '06:45',
    'where-it-breaks': 'afternoon',
    lunch: 'fast-carbs',
    'after-lunch': 'lie-down',
    'first-coffee': 'delayed',
    'last-coffee': 'on-demand',
    daylight: 'soon',
    'weekend-swing': 'hour',
    monday: 'all-hard',
    alcohol: 'rarely',
    'night-waking': 'brief',
    training: 'none',
  },
  'slow-starter': {
    'morning-scene': 'autopilot',
    'evening-scene': 'genuinely-tired',
    'wake-time': '07:30',
    'where-it-breaks': 'first-hours',
    lunch: 'skipped',
    'after-lunch': 'walk',
    'first-coffee': 'immediate',
    'last-coffee': 'morning',
    daylight: 'couple-hours',
    'weekend-swing': 'same',
    monday: 'fine',
    alcohol: 'rarely',
    'night-waking': 'nothing',
    training: 'none',
  },
  'wired-and-tired': {
    'morning-scene': 'early-wake',
    'evening-scene': 'second-wind',
    'wake-time': '07:00',
    'where-it-breaks': 'after-dinner',
    lunch: 'skipped',
    'after-lunch': 'varies',
    'first-coffee': 'delayed',
    'last-coffee': 'late',
    daylight: 'never',
    'weekend-swing': 'same',
    monday: 'fine',
    alcohol: 'weeknights',
    'night-waking': 'three-am',
    training: 'late',
  },
  'weekend-reset': {
    'morning-scene': 'snooze',
    'evening-scene': 'depends-on-day',
    'wake-time': '07:15',
    'where-it-breaks': 'monday',
    lunch: 'proper',
    'after-lunch': 'walk',
    'first-coffee': 'delayed',
    'last-coffee': 'morning',
    daylight: 'soon',
    'weekend-swing': 'no-alarm',
    monday: 'worst',
    alcohol: 'weekend',
    'night-waking': 'early',
    training: 'morning',
  },
};

let failures = 0;

function assert(label: string, condition: boolean, detail = '') {
  const mark = condition ? '  ok  ' : 'FAIL  ';
  if (!condition) failures++;
  console.log(`${mark}${label}${detail ? `  — ${detail}` : ''}`);
}

console.log('\nRouting\n');

for (const [expected, answers] of Object.entries(textbook) as [ArchetypeSlug, Answers][]) {
  const result = score(answers);
  const ranked = (Object.entries(result.scores) as [ArchetypeSlug, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([slug, value]) => `${slug} ${(value * 100).toFixed(0)}%`)
    .join('  ');

  assert(`${expected.padEnd(17)} → ${result.primary}`, result.primary === expected, ranked);
}

console.log('\nEvery question is reachable and every option scores something\n');

const orphaned = questions.filter(
  (question) =>
    !question.commitment &&
    !question.profile &&
    question.options?.every((option) => !option.weights || Object.keys(option.weights).length === 0),
);
assert('no question is entirely weightless', orphaned.length === 0, orphaned.map((q) => q.id).join(', '));

const ids = questions.map((q) => q.id);
assert('question ids are unique', new Set(ids).size === ids.length);

for (const question of questions) {
  const optionIds = question.options?.map((o) => o.id) ?? [];
  assert(
    `${question.id}: option ids unique`,
    new Set(optionIds).size === optionIds.length,
  );
}

console.log('\nCaffeine cutoff\n');

assert('07:00 wake, Wired & Tired  → 12:30', caffeineCutoff('07:00', 'wired-and-tired') === '12:30');
assert('06:45 wake, Delayed Crasher → 13:45', caffeineCutoff('06:45', 'delayed-crasher') === '13:45');
assert('missing wake time returns null', caffeineCutoff(null, 'slow-starter') === null);
assert('garbage wake time returns null', caffeineCutoff('nonsense', 'slow-starter') === null);

console.log('\nPartial answers must not crash\n');

const partial = score({ 'morning-scene': 'snooze' });
assert('a one-answer quiz still returns a primary', Boolean(partial.primary), partial.primary);
assert('an empty quiz still returns a primary', Boolean(score({}).primary));

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
