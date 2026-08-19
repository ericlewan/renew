/**
 * Social proof, in one place.
 *
 * ---------------------------------------------------------------------------
 * READ THIS BEFORE EDITING.
 *
 * Every number in here must be real. Invented member counts, star ratings and
 * testimonials are the single fastest way to turn a trust product into a
 * refund problem, and in this category they're also a regulatory tripwire.
 *
 * So the screen is built to degrade honestly. At zero users it shows the
 * method — which is true today — and it switches to counts and quotes
 * automatically as soon as you fill them in. You never have to remember to
 * turn anything on, and you never have to ship a lie to have a proof screen.
 * ---------------------------------------------------------------------------
 */

export type Testimonial = {
  quote: string;
  /** First name and archetype is enough. Never invent one. */
  attribution: string;
};

export const proof = {
  /** Set once real. Both null pre-launch — the screen adapts. */
  memberCount: null as number | null,
  rating: null as { score: number; count: number } | null,

  /** Real quotes only, gathered with permission. Empty until then. */
  testimonials: [] as Testimonial[],

  /** The founding cohort cap. Real because you decide it. */
  founding: {
    cap: 500,
    /** Keep this current, or drop the line entirely. Don't fake scarcity. */
    remaining: null as number | null,
  },

  /**
   * True at zero users, and still true at fifty thousand. This is what the
   * screen leads with until there's something better to lead with.
   */
  method: [
    {
      title: 'It tells you what to do, not how you did',
      body: 'Most tools hand you a number and leave you to work out the rest. This one asks three questions each morning and answers the only one that matters: what do I actually do today?',
    },
    {
      title: 'It gets sharper the longer you use it',
      body: 'The first week is a starting point. After that the protocol narrows to what demonstrably works for you — your best days, your worst ones, and what they had in common.',
    },
    {
      title: 'Nothing to finish, nothing to break',
      body: 'No streaks, no score out of a hundred, no thirty-day challenge that ends and leaves you where you were. A missed day is a data point, not a failure.',
    },
  ],
} as const;

/** True when there's genuine third-party proof to show instead of method. */
export function hasSocialProof(): boolean {
  return (
    proof.memberCount !== null ||
    proof.rating !== null ||
    proof.testimonials.length > 0
  );
}
