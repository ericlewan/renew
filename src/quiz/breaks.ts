import type { Answers } from './types';

/**
 * Interstitials between questions.
 *
 * Sixteen questions with no beat is where quizzes bleed people. These are the
 * beats — but they only earn the extra tap if they say something specific
 * back. A generic "You're doing great!" screen is a tax on attention; a
 * screen that repeats your own answer to you buys attention.
 *
 * Rules for anything written here:
 *
 *   1. No statistics. We have no user base to draw them from, and an invented
 *      "78% of people like you" is a fabricated claim on a page whose whole
 *      job is being believed. Reassurance from a real mechanism reads better
 *      anyway.
 *   2. No diagnosis, no physiology, no conditions. Same line as everywhere.
 *   3. Never scold. The plan's principle is that a bad answer is a data
 *      point, and these screens are where that promise gets tested first.
 */

export type Break = {
  id: string;
  /** Appears immediately after the question with this id. */
  after: string;
  label: string;
  headline: (answers: Answers) => string;
  body: (answers: Answers) => string;
  /**
   * Optional diagram, keyed by name and rendered by the quiz.
   *
   * Deliberately only on interstitials, never on questions. A question screen
   * is a speed instrument — anything to look at is something to look at
   * instead of answering — and its options are already vivid scenes in text,
   * which a picture would only make literal. An interstitial has nothing to
   * answer, so a diagram has room to land.
   *
   * Diagrams come from the curve system, not an image model: they double as
   * pins, PDF pages and motion source, which is the rule the whole asset
   * pipeline runs on.
   */
  diagram?: 'caffeine';
  /**
   * Atmospheric band, chosen from the answer they just gave — so the picture
   * is of *their* moment rather than a generic one. Abstract and dark by
   * rule: light is the only subject, and nothing in these images could have
   * come from a stock library.
   */
  image?: (answers: Answers) => string;
};

export const breaks: Break[] = [
  {
    id: 'break-pattern',
    after: 'where-it-breaks',
    label: 'Noted',
    image: (answers) => {
      switch (answers['where-it-breaks']) {
        case 'first-hours':
          return 'dawn';
        case 'afternoon':
          return 'afternoon';
        case 'after-dinner':
          return 'night';
        case 'monday':
          return 'rhythm';
        default:
          return 'measure';
      }
    },
    headline: (answers) => {
      switch (answers['where-it-breaks']) {
        case 'first-hours':
          return "A slow morning isn't a character flaw.";
        case 'afternoon':
          return "The afternoon crash isn't about willpower.";
        case 'after-dinner':
          return "Being sharp at 10pm isn't a bonus.";
        case 'monday':
          return "Mondays aren't harder. They're a different time zone.";
        default:
          return "That's the part worth fixing first.";
      }
    },
    body: (answers) => {
      switch (answers['where-it-breaks']) {
        case 'first-hours':
          return 'It usually means the first hour has no inputs — no light, no movement, no food. That is a setup problem, and setup problems are the fixable kind.';
        case 'afternoon':
          return 'Everyone dips in the afternoon. What decides whether it is a dip or a wall is what happened in the two hours before it.';
        case 'after-dinner':
          return 'It usually means the day is running backwards — the signals that should arrive in the morning are arriving after dark instead.';
        case 'monday':
          return 'If your wake time moves by two hours at the weekend, Monday is functionally a flight you never took. The next few questions check for that.';
        default:
          return 'A few more questions and we can be specific about it.';
      }
    },
  },
  {
    id: 'break-caffeine',
    after: 'last-coffee',
    label: 'One thing already',
    diagram: 'caffeine',
    headline: (answers) => {
      if (answers['last-coffee'] === 'late' || answers['last-coffee'] === 'on-demand') {
        return 'A coffee at three is still working at nine.';
      }
      if (answers['first-coffee'] === 'immediate' || answers['first-coffee'] === 'need-it') {
        return 'Coffee before daylight is the most common swap we make.';
      }
      return 'Your caffeine timing is already in reasonable shape.';
    },
    body: (answers) => {
      if (answers['last-coffee'] === 'late' || answers['last-coffee'] === 'on-demand') {
        return "That's half-life, not tolerance — it applies whether or not you feel it. Which is why the cutoff we work out for you comes from your wake time rather than a fixed hour.";
      }
      if (answers['first-coffee'] === 'immediate' || answers['first-coffee'] === 'need-it') {
        return "Not less coffee. Later coffee, and light first. It's a small change and it tends to be the one people feel fastest.";
      }
      return "So we'll look elsewhere. The next few questions are about the parts of the week rather than the parts of the day.";
    },
  },
  {
    id: 'break-almost',
    after: 'training',
    label: 'Nearly there',
    image: () => 'measure',
    headline: () => 'Three questions left.',
    body: () =>
      'The last few are about context rather than habits — how long this has been going on, and what you have already tried. They change what we put in front of you first.',
  },
];

/** The break that follows a given question, if any. */
export function breakAfter(questionId: string): Break | undefined {
  return breaks.find((item) => item.after === questionId);
}
