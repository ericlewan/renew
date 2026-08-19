/**
 * The brand, in one place.
 *
 * Deliberately a token rather than a string typed into eight files. Names
 * change late and often, and the wordmark appears on every card, every pin
 * and every PDF page — so renaming should be one edit, not a search.
 */
export const brand = {
  /** Display form. The wordmark is always set in caps. */
  name: 'RENEW',
  /** Sentence form, for running copy. */
  prose: 'Renew',
  /** Used in filenames for exported cards and pins. */
  slug: 'renew',
} as const;
