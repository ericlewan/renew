import type { ArchetypeSlug } from '@/design/tokens';

/** How much an answer pulls toward each archetype. Absent slug means zero. */
export type Weights = Partial<Record<ArchetypeSlug, number>>;

export type Option = {
  id: string;
  label: string;
  /** Optional second line. Used where the vivid detail is the point. */
  detail?: string;
  weights?: Weights;
};

export type Question = {
  id: string;
  /** The question itself. Short — it's read on a phone, at speed. */
  prompt: string;
  /** Optional framing line above the options. */
  note?: string;
  kind: 'single' | 'multi' | 'time';
  options?: Option[];
  /**
   * Questions marked `commitment` exist to increase investment, not to score.
   * Their answers are stored (they're useful for email copy) but weightless.
   */
  commitment?: boolean;
  /**
   * Questions marked `profile` collect data the protocol engine needs later,
   * such as wake time. Also weightless.
   */
  profile?: boolean;
};

export type Answers = Record<string, string | string[]>;

export type Result = {
  primary: ArchetypeSlug;
  /** Named only when it scores within 25% of the primary. */
  secondary: ArchetypeSlug | null;
  /** 0–1, normalised per archetype. Diagnostic — never shown as a score. */
  scores: Record<ArchetypeSlug, number>;
  /** Parsed from the wake-time question, for the caffeine cutoff. */
  wakeTime: string | null;
};
