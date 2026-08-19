'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * A pinned call to action.
 *
 * It is always visible. An earlier version hid itself above the fold and
 * again whenever the pricing block scrolled into view — the reasoning being
 * that two competing buttons is worse than one. In practice that reads as a
 * bar that keeps vanishing, and a call to action you have to hunt for is
 * worth less than a redundant one. Persistent wins.
 *
 * Two things keep it out of trouble on a real phone:
 *
 *   1. `env(safe-area-inset-bottom)` via `max()`, so it clears the iOS home
 *      indicator and Safari's bottom toolbar. This only works because the
 *      root layout sets `viewport-fit=cover` — without that the inset is 0
 *      and the padding does nothing.
 *   2. A spacer of the same height in normal flow, so the bar can never
 *      cover the end of the page. Its height is *measured*, not guessed —
 *      the bar grows and shrinks with the price row, a wrapped label and the
 *      safe-area inset, and a hardcoded value was already 10px short.
 */

type Props = {
  /** Button label. Kept short — it shares a row with the price. */
  label: string;
  /** Optional price shown to the left. */
  price?: string;
  priceSuffix?: string;
} & (
  | { href: string; scrollTo?: never; onClick?: never }
  /** id of an element to scroll to instead of navigating. */
  | { scrollTo: string; href?: never; onClick?: never }
  /** an action to run — used by the quiz, which advances in place. */
  | { onClick: () => void; href?: never; scrollTo?: never }
);

export function StickyCta({ label, price, priceSuffix, href, scrollTo, onClick }: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.target.getBoundingClientRect().height),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* reserves exactly the bar's height so it never covers the last
          element, whatever the bar currently measures */}
      <div
        aria-hidden
        className="sticky-cta-spacer"
        style={height ? { height } : undefined}
      />

      <div className="sticky-cta" ref={bar}>
        <div className="sticky-cta-inner">
          {price && (
            <div className="sticky-cta-price">
              <span className="sticky-cta-amount">{price}</span>
              {priceSuffix && <span className="sticky-cta-period">{priceSuffix}</span>}
            </div>
          )}

          {href ? (
            <Link className="cta sticky-cta-button" href={href}>
              {label}
            </Link>
          ) : (
            <button
              className="cta sticky-cta-button"
              onClick={
                onClick ??
                (() =>
                  document
                    .getElementById(scrollTo!)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
              }
            >
              {label}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
