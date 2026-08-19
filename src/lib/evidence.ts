/**
 * What the protocol rules are built on.
 *
 * ---------------------------------------------------------------------------
 * RULES FOR THIS FILE
 *
 * 1. Every entry is a real, checkable paper. Both of the ones here were
 *    verified against the published record, not recalled.
 * 2. `caveat` is not optional and is not marketing. If a study is small, it
 *    says so on the page. A health-adjacent product that oversells its
 *    evidence is one screenshot away from being the story.
 * 3. This is NOT customer case studies. There are no customers yet, and
 *    invented transformation stories are fabricated testimony. When real
 *    ones exist with permission, they go in proof.ts, not here.
 * 4. Nothing here is a medical claim. These describe mechanisms behind
 *    timing rules — never a diagnosis, a treatment, or an outcome promise.
 * ---------------------------------------------------------------------------
 */

export type Study = {
  /** The rule this supports, in the user's language. */
  supports: string;
  finding: string;
  /** Stated plainly on the page. Small studies are described as small. */
  caveat: string;
  citation: string;
  url: string;
};

export const evidence: Study[] = [
  {
    supports: 'Why your caffeine cutoff is earlier than you think',
    finding:
      'A dose of caffeine six hours before bed cut measured total sleep time by more than an hour — and the people it happened to could not tell. Their own reports showed no disturbance while the monitors did.',
    caveat:
      'Small study: 12 healthy sleepers, one fixed 400mg dose. It is the reason the rule exists, not proof of what will happen to you.',
    citation:
      'Drake, Roehrs, Shambroom & Roth (2013), Journal of Clinical Sleep Medicine 9(11):1195–1200',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24235903/',
  },
  {
    supports: 'Why the weekend lie-in costs you Monday',
    finding:
      'The mismatch between body clock and social schedule was named and measured here — the gap between when you sleep on work days and free days. It is the basis for anchoring one wake time across all seven.',
    caveat:
      'Questionnaire-based and observational. It describes and measures the pattern; it does not prove that fixing it fixes your Monday.',
    citation:
      'Wittmann, Dinich, Merrow & Roenneberg (2006), Chronobiology International 23(1–2):497–509',
    url: 'https://www.tandfonline.com/doi/full/10.1080/07420520500545979',
  },
];

/**
 * Shown alongside the evidence. Says the quiet part out loud, which in a
 * category full of overclaiming is itself a conversion argument.
 */
export const evidenceDisclaimer =
  'Renew is not a medical product and does not diagnose or treat anything. It changes the timing of ordinary things — light, food, caffeine, movement — and tells you which ones to move today.';
