import type { Question } from './types';

/**
 * Sixteen questions.
 *
 * Order is deliberate:
 *   Q1     age. A no-brainer on-ramp — gender was already answered on the
 *          landing page, so the first tap in here should cost nothing.
 *   Q2–Q3  the two most revealing. Vivid, specific, slightly uncomfortable.
 *          Drop-off should happen after investment, not before it.
 *   Q4     wake time. Cheap to answer and it powers the personalised
 *          caffeine cutoff shown free on the result page.
 *   Q5     the direct axis question, and the tiebreak authority for scoring.
 *   Q6–Q14 mechanism questions.
 *   Q15–Q17 commitment. These don't score. They exist so that by the time
 *          the paywall arrives the person has told a story about themselves.
 *
 * The back button is disabled from Q10 onward.
 */
export const questions: Question[] = [
  {
    id: 'age',
    prompt: 'How old are you?',
    note: 'Caffeine clearance and sleep timing both shift with age.',
    kind: 'single',
    profile: true,
    options: [
      { id: '18-24', label: '18–24' },
      { id: '25-34', label: '25–34' },
      { id: '35-44', label: '35–44' },
      { id: '45-54', label: '45–54' },
      { id: '55+', label: '55 or over' },
    ],
  },
  {
    id: 'morning-scene',
    prompt: "It's 7:40 on a Tuesday. Which one is you?",
    kind: 'single',
    options: [
      {
        id: 'fine',
        label: 'Up before the alarm, already fine',
        detail: 'Mornings are honestly my best hours',
        weights: { 'delayed-crasher': 3, 'weekend-reset': 1 },
      },
      {
        id: 'autopilot',
        label: 'Awake, but on autopilot for another two hours',
        detail: "I'm not really here yet",
        weights: { 'slow-starter': 3 },
      },
      {
        id: 'snooze',
        label: 'Third snooze. The alarm and I are in a fight',
        weights: { 'slow-starter': 3, 'weekend-reset': 1 },
      },
      {
        id: 'early-wake',
        label: "Been awake since 4:30 and pretending I haven't",
        weights: { 'wired-and-tired': 3 },
      },
    ],
  },
  {
    id: 'evening-scene',
    prompt: 'Same day, 10:30 at night.',
    kind: 'single',
    options: [
      {
        id: 'second-wind',
        label: 'Finally focused. This is when I get things done',
        weights: { 'wired-and-tired': 3 },
      },
      {
        id: 'sofa-then-awake',
        label: 'Asleep on the sofa — then wide awake the moment I get into bed',
        weights: { 'wired-and-tired': 3 },
      },
      {
        id: 'genuinely-tired',
        label: 'Properly tired. Out within ten minutes',
        weights: { 'delayed-crasher': 2, 'slow-starter': 1 },
      },
      {
        id: 'depends-on-day',
        label: 'Depends entirely which day of the week it is',
        weights: { 'weekend-reset': 3 },
      },
    ],
  },
  {
    id: 'wake-time',
    prompt: 'What time do you usually wake up on a workday?',
    note: "We'll use this to work out your actual caffeine cutoff.",
    kind: 'time',
    profile: true,
  },
  {
    id: 'where-it-breaks',
    prompt: 'Where does the day usually go wrong?',
    kind: 'single',
    options: [
      { id: 'first-hours', label: 'The first couple of hours', weights: { 'slow-starter': 3 } },
      { id: 'afternoon', label: 'Somewhere between 2 and 4', weights: { 'delayed-crasher': 3 } },
      { id: 'after-dinner', label: 'After dinner it flips and I come alive', weights: { 'wired-and-tired': 3 } },
      { id: 'monday', label: "It's a Monday thing, not a time-of-day thing", weights: { 'weekend-reset': 3 } },
    ],
  },
  {
    id: 'lunch',
    prompt: 'What did you eat for lunch yesterday? Honestly.',
    kind: 'single',
    options: [
      {
        id: 'fast-carbs',
        label: 'Sandwich, pasta, something fast',
        weights: { 'delayed-crasher': 3 },
      },
      { id: 'skipped', label: "Didn't really have lunch", weights: { 'slow-starter': 2, 'wired-and-tired': 1 } },
      { id: 'proper', label: 'A proper meal, sat down', weights: { 'weekend-reset': 1 } },
      { id: 'forgot', label: "Genuinely can't remember", weights: { 'delayed-crasher': 1, 'slow-starter': 1 } },
    ],
  },
  {
    id: 'after-lunch',
    prompt: 'And the thirty minutes after you eat?',
    kind: 'single',
    options: [
      { id: 'screen', label: 'Straight back to a screen', weights: { 'delayed-crasher': 3 } },
      { id: 'lie-down', label: 'I would lie down if I could', weights: { 'delayed-crasher': 3 } },
      { id: 'walk', label: 'I move, or get outside', weights: {} },
      { id: 'varies', label: 'Varies', weights: { 'delayed-crasher': 1 } },
    ],
  },
  {
    id: 'first-coffee',
    prompt: 'When is your first coffee?',
    kind: 'single',
    options: [
      { id: 'immediate', label: 'Within fifteen minutes of opening my eyes', weights: { 'slow-starter': 3 } },
      { id: 'need-it', label: "I don't really wake up until it happens", weights: { 'slow-starter': 3 } },
      { id: 'delayed', label: 'An hour or so in', weights: {} },
      { id: 'none', label: "I don't drink caffeine", weights: {} },
    ],
  },
  {
    id: 'last-coffee',
    prompt: 'And the last one?',
    kind: 'single',
    options: [
      { id: 'morning', label: 'Before eleven', weights: {} },
      { id: 'early-afternoon', label: 'Early afternoon', weights: { 'delayed-crasher': 1 } },
      { id: 'late', label: 'After three', weights: { 'wired-and-tired': 3 } },
      { id: 'on-demand', label: 'Whenever I hit a wall', weights: { 'delayed-crasher': 2, 'wired-and-tired': 1 } },
    ],
  },
  /* ---- back button disabled from here ---- */
  {
    id: 'daylight',
    prompt: 'How long after waking do you get outside?',
    kind: 'single',
    options: [
      { id: 'soon', label: 'Within half an hour', weights: {} },
      { id: 'couple-hours', label: 'A couple of hours', weights: { 'slow-starter': 2 } },
      { id: 'lunch', label: 'Not until lunch', weights: { 'slow-starter': 2, 'wired-and-tired': 2 } },
      { id: 'never', label: 'Some days, not at all', weights: { 'wired-and-tired': 2, 'slow-starter': 2 } },
    ],
  },
  {
    id: 'weekend-swing',
    prompt: 'Weekend wake-up versus weekday — how different?',
    kind: 'single',
    options: [
      { id: 'same', label: 'About the same', weights: {} },
      { id: 'hour', label: 'An hour or so later', weights: { 'weekend-reset': 1 } },
      { id: 'two-three', label: 'Two or three hours later', weights: { 'weekend-reset': 3 } },
      { id: 'no-alarm', label: 'No alarm, whenever I surface', weights: { 'weekend-reset': 3 } },
    ],
  },
  {
    id: 'monday',
    prompt: 'How is Monday, really?',
    kind: 'single',
    options: [
      { id: 'fine', label: 'Fine. Normal day', weights: {} },
      { id: 'worst', label: 'Reliably the worst day of the week', weights: { 'weekend-reset': 3 } },
      { id: 'all-hard', label: 'Hard — but so is every other day', weights: { 'slow-starter': 1, 'delayed-crasher': 1 } },
      { id: 'tuesday', label: "Tuesday's actually worse", weights: { 'weekend-reset': 1 } },
    ],
  },
  {
    id: 'alcohol',
    prompt: 'In a normal week, when do you drink?',
    note: 'No judgement here — it just changes the timing advice.',
    kind: 'single',
    options: [
      { id: 'rarely', label: 'Rarely or never', weights: {} },
      { id: 'weeknights', label: 'A couple of weeknights', weights: { 'wired-and-tired': 2 } },
      { id: 'weekend', label: 'Mostly Friday and Saturday', weights: { 'weekend-reset': 3 } },
      { id: 'most-nights', label: 'Most nights', weights: { 'wired-and-tired': 2, 'weekend-reset': 1 } },
    ],
  },
  {
    id: 'night-waking',
    prompt: 'What happens in the middle of the night?',
    kind: 'single',
    options: [
      { id: 'nothing', label: 'Nothing. I sleep through', weights: {} },
      { id: 'brief', label: 'Wake once, straight back off', weights: {} },
      { id: 'three-am', label: 'Awake around three or four, for a while', weights: { 'wired-and-tired': 3 } },
      { id: 'early', label: "Fall asleep fine, wake early, can't get back", weights: { 'wired-and-tired': 2, 'weekend-reset': 1 } },
    ],
  },
  {
    id: 'training',
    prompt: 'When do you train, if you train?',
    kind: 'single',
    options: [
      { id: 'morning', label: 'Morning', weights: {} },
      { id: 'midday', label: 'Lunchtime', weights: {} },
      { id: 'late', label: 'After seven in the evening', weights: { 'wired-and-tired': 3 } },
      { id: 'none', label: 'Not at the moment', weights: { 'slow-starter': 1, 'delayed-crasher': 1 } },
    ],
  },
  {
    id: 'duration',
    prompt: 'How long has it been like this?',
    kind: 'single',
    commitment: true,
    options: [
      { id: 'months', label: 'A few months' },
      { id: 'year-two', label: 'A year or two' },
      { id: 'always', label: 'As long as I can remember' },
      { id: 'worse', label: "It's got noticeably worse recently" },
    ],
  },
  {
    id: 'tried',
    prompt: "What have you already tried?",
    note: 'Pick any that apply.',
    kind: 'multi',
    commitment: true,
    options: [
      { id: 'more-sleep', label: 'Just sleeping more' },
      { id: 'cut-caffeine', label: 'Cutting caffeine' },
      { id: 'supplements', label: 'Supplements' },
      { id: 'tracker', label: 'A watch or a sleep tracker' },
      { id: 'diet', label: 'Changing how I eat' },
      { id: 'nothing-stuck', label: 'Plenty. None of it stuck' },
    ],
  },
];

/** Questions from this index onward have no back button. Shifts with the
    question list, so it's derived rather than a hand-maintained number. */
export const NO_BACK_FROM_INDEX =
  questions.findIndex((question) => question.id === 'daylight');
