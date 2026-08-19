import type { ArchetypeSlug } from '@/design/tokens';

export type Archetype = {
  slug: ArchetypeSlug;
  name: string;
  /** The shareable one-liner. This is what goes big on the card. */
  line: string;
  signs: string[];
  /** Behavioural mechanism. Never physiological — see 04-archetypes.md. */
  mechanism: string;
  /** Given away free. One action isn't a protocol, and it proves the thing works. */
  firstChange: { action: string; why: string };
  /** Search cluster this page targets. */
  queries: string[];
  /** Sits under the name on the result card. */
  breaksAt: string;
  /**
   * The outcome, in the person's own terms. Not "you are a Delayed Crasher"
   * but what stops happening once the protocol is running.
   *
   * This is the line the funnel is actually selling. Keep it behavioural —
   * a shape of day, never a physiological or medical outcome.
   */
  promise: string;
};

export const archetypes: Record<ArchetypeSlug, Archetype> = {
  'delayed-crasher': {
    slug: 'delayed-crasher',
    name: 'The Delayed Crasher',
    breaksAt: 'Your day breaks in the afternoon',
    promise: 'An afternoon that doesn’t collapse — without a third coffee propping it up.',
    line: "You don't have an energy problem. You have a 1pm problem that shows up at 3.",
    signs: [
      'Mornings are genuinely fine — sometimes your best hours',
      'Between 2 and 4 you hit a wall that feels physical, not mental',
      'Afternoon coffee or sugar barely registers',
      'Lunch is fast, carb-heavy, and eaten at a desk',
      'You go from a screen at noon to a screen at 1 with nothing in between',
      "By 5 you're partly back — which is why you never fix it",
    ],
    mechanism:
      "Everyone has an afternoon dip. Yours isn't bigger — it's unbuffered. Three ordinary choices stack on top of it: what you ate at 1, that you didn't move or see daylight afterwards, and that your last coffee landed before the dip instead of ahead of it. The dip is normal. The crash is the stack.",
    firstChange: {
      action: 'Walk for ten minutes after lunch.',
      why: "Outdoors if you can. It's the highest-yield ten minutes in your day and it costs nothing.",
    },
    queries: ['why am I tired at 3pm', 'afternoon slump', 'tired after eating lunch'],
  },
  'slow-starter': {
    slug: 'slow-starter',
    name: 'The Slow Starter',
    breaksAt: 'Your day breaks in the first two hours',
    promise: 'A morning that starts when you do, instead of three hours later.',
    line: 'It takes you three hours to become yourself. It should take forty minutes.',
    signs: [
      'The first hour is a fog you push through rather than a start',
      'You snooze — usually more than once',
      'Coffee is the first thing that enters your body, often before water',
      "You don't eat until 11, or you skip to lunch",
      "You're sharpest late afternoon, and you've built your life around that",
      'With no alarm you feel fine — so you assume it’s a sleep problem',
    ],
    mechanism:
      "Your morning has no inputs. No light, no movement, no food — just caffeine on an empty tank, which doesn't create energy so much as borrow it against 3pm. The waking signal your body responds to is largely environmental, and you're not giving it any. The fix isn't more sleep. It's front-loading the three signals in the first 45 minutes.",
    firstChange: {
      action: 'Get outside within 45 minutes of waking.',
      why: 'Ten minutes is enough. Before the coffee, not instead of it.',
    },
    queries: ['why does it take me so long to wake up', 'morning brain fog', 'how to wake up faster'],
  },
  'wired-and-tired': {
    slug: 'wired-and-tired',
    name: 'Wired & Tired',
    breaksAt: 'Your day breaks after dark',
    promise: 'A day that runs forwards — awake while it’s light, finished when it’s dark.',
    line: 'Your body thinks the day starts at 6pm.',
    signs: [
      'Exhausted all day, then suddenly capable around 9 or 10',
      'In bed tired, then wide awake the moment the light goes off',
      'Evening is when you finally do what you meant to do at 2',
      "Caffeine after 2pm feels necessary and, you'd swear, harmless",
      'You train late, or work late, or both',
      "You wake around 3 or 4 more often than you'd like",
    ],
    mechanism:
      "Your day is back-loaded. Light, caffeine, stress and stimulation all arrive in the second half, so the go signal peaks exactly when it should be falling. Then you get a genuinely productive evening, which rewards the pattern and locks it in. The evening alertness isn't the problem — it's the receipt for how the earlier hours were spent.",
    firstChange: {
      action: 'Set your caffeine cutoff from your wake time, not the clock.',
      why: "It's the rule with the biggest gap between how small it feels and how much it does.",
    },
    queries: ['tired but cant sleep', 'second wind at night', 'why do I wake up at 3am'],
  },
  'weekend-reset': {
    slug: 'weekend-reset',
    name: 'The Weekend Reset',
    breaksAt: 'Your week breaks on Monday',
    promise: 'A week with no hole in it, and a Monday that feels like a Wednesday.',
    line: "You're not bad at Mondays. You changed time zones on Friday and flew back on Sunday.",
    signs: [
      'Tuesday to Thursday you’re fine — the week has a good middle',
      "Monday is reliably worst and you've stopped questioning it",
      'Weekend wake time is two or more hours later than weekday',
      "You catch up on sleep and don't feel caught up",
      'Friday and Saturday involve a drink more often than not',
      'Sunday evening is when you plan the fix Monday erases',
    ],
    mechanism:
      'Your schedule moves by hours between Friday and Monday. A body reads that as travel, because functionally it is: same shift, no flight. Catch-up sleep doesn’t repay it, because the cost is the schedule change, not the hours. Add a drink — which reliably degrades the second half of a night even when it starts one faster — and Monday is a jet-lag day you scheduled yourself.',
    firstChange: {
      action: 'Pick a wake time you can hold on a Saturday.',
      why: 'Not the weekday one. A real one, in the middle. Then hold it all seven days.',
    },
    queries: ['why is monday so hard', 'social jet lag', 'tired after the weekend'],
  },
};

export const allSlugs = Object.keys(archetypes) as ArchetypeSlug[];
