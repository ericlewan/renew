'use client';

import { useStoredResult } from '@/quiz/useStoredResult';
import { StickyCta } from './StickyCta';

/**
 * The dashboard's pinned action.
 *
 * Branches the same way the inline call to action does: someone who took the
 * quiz is offered their protocol, someone who arrived from a search or a pin
 * is offered the quiz — sending them to a price before they've answered
 * anything is asking for money from a stranger.
 *
 * Renders nothing until the session is known, so neither version flashes.
 */
export function DashboardCta() {
  const stored = useStoredResult();
  if (stored === undefined) return null;

  return stored
    ? <StickyCta href="/plan" label="See my protocol" />
    : <StickyCta href="/" label="Find my baseline" />;
}
