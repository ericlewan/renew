/**
 * Pricing, in one place.
 *
 * The plan's number is $49/year billed upfront, with monthly shown as the
 * expensive option. Traffic — not conversion — is the binding constraint on
 * this business, so the annual price is the first thing worth A/B testing;
 * change it here and it changes on the paywall, the post-purchase page and
 * the Stripe call in one edit.
 */
export const offer = {
  annual: { price: 49, currency: 'USD', label: '$49', period: 'a year' },
  monthly: { price: 9.99, currency: 'USD', label: '$9.99', period: 'a month' },

  /** Phase 1 sells access before the app exists. Be honest about the date. */
  founding: {
    enabled: true,
    shipDate: 'October 2026',
  },

  /**
   * A real policy, not a badge. Whatever is written here has to be honoured
   * without argument — the plan targets a refund rate under 5%, and the way
   * to keep it there is a paywall that doesn't overpromise, not a refund
   * process that wears people down.
   */
  guarantee: {
    days: 30,
    text: 'If it is not doing anything for you, email once within 30 days and you get the money back. No form, no questions.',
  },
} as const;

/** What each tier actually includes. Ordered as shown on the page. */
export const includes = [
  'A 20-second check-in, and today’s 3–5 actions',
  'Recalculated every morning against how you actually slept',
  'Your caffeine cutoff, light window and last-food time, by the clock',
  'A weekly readout of what moves your energy and what does nothing',
  'Your archetype protocol pack as a print-quality PDF',
  'Works in the browser — nothing to download, no wearable needed',
] as const;

/** Rough annual-vs-monthly saving, for the anchor line. */
export const annualSaving = Math.round(
  (1 - offer.annual.price / (offer.monthly.price * 12)) * 100,
);
