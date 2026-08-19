'use client';

import { useSyncExternalStore } from 'react';
import type { Answers, Result } from './types';

/**
 * Reads the quiz result out of sessionStorage.
 *
 * Six components need this — the profile, the plan, the email step, the
 * processing screen, the paywall preview and the organic capture — and each
 * had grown its own useEffect-plus-parse-plus-setState. That pattern is both
 * duplicated and wrong: setting state from an effect on mount causes an extra
 * render pass, and React now flags it.
 *
 * useSyncExternalStore is the right tool. The pages stay static and
 * indexable, and the value fills in on hydration.
 *
 * The three-state return is load-bearing, not fussiness:
 *
 *   undefined  not read yet — the server render and the hydration pass
 *   null       read, and there genuinely is no result
 *   object     read, result present
 *
 * Collapsing the first two into `null` looks harmless and isn't: the funnel
 * steps redirect home when there's no result, and during hydration that
 * condition is briefly true for *everyone*. Client-side navigation hides it
 * completely; a refresh or a pasted link bounces the user to the homepage.
 */

const KEY = 'baseline:result';

export type StoredResult = {
  answers: Answers;
  result: Result;
};

/* getSnapshot must return a referentially stable value or React re-renders
   forever, so the parsed object is cached against the raw string. */
let cachedRaw: string | null = null;
let cachedValue: StoredResult | null = null;

function getSnapshot(): StoredResult | null {
  const raw = sessionStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedValue;

  cachedRaw = raw;
  cachedValue = parse(raw);
  return cachedValue;
}

function parse(raw: string | null): StoredResult | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.result?.primary ? (parsed as StoredResult) : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

/** undefined until hydrated, then null or the stored result. */
export function useStoredResult(): StoredResult | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function getServerSnapshot(): undefined {
  return undefined;
}

/** Merge extra answers in without re-running the quiz. */
export function patchStoredAnswers(patch: Answers): void {
  const current = getSnapshot();
  if (!current) return;
  saveStoredResult({ ...current, answers: { ...current.answers, ...patch } });
}

export function saveStoredResult(value: StoredResult): void {
  sessionStorage.setItem(KEY, JSON.stringify(value));
  cachedRaw = null; // force a re-parse on next read
}
