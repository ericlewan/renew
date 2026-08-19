'use client';

import { useEffect, useRef, useState } from 'react';
import { offer } from '@/lib/offer';

/**
 * A pinned call to action for long pages.
 *
 * Long selling pages lose people who never scroll far enough to find the
 * button. This keeps one in reach at all times.
 *
 * Two details that keep it from being irritating:
 *
 *   1. It hides itself whenever the real pricing block is on screen. Two
 *      competing buttons is worse than one that's out of sight.
 *   2. It doesn't appear until you've scrolled past the top of the page, so
 *      the first screen stays clean.
 *
 * It also reserves its own height at the bottom of the document, so it can
 * never cover the last paragraph — the usual failure of pinned bars.
 */
export function StickyCta({ watch }: { watch: string }) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(watch);

    let pricingOnScreen = false;
    let scrolledIn = window.scrollY > 320;

    const update = () => setVisible(scrolledIn && !pricingOnScreen);

    const observer = target
      ? new IntersectionObserver(
          ([entry]) => {
            pricingOnScreen = entry.isIntersecting;
            update();
          },
          { threshold: 0.25 },
        )
      : null;
    if (target && observer) observer.observe(target);

    const onScroll = () => {
      scrolledIn = window.scrollY > 320;
      update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [watch]);

  function goToPricing() {
    document.getElementById(watch)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <>
      {/* keeps the bar from ever covering the end of the page */}
      <div aria-hidden style={{ height: '5.5rem' }} />
      <div ref={barRef} className="sticky-cta" data-visible={visible}>
        <div className="sticky-cta-inner">
          <div className="sticky-cta-price">
            <span className="sticky-cta-amount">{offer.annual.label}</span>
            <span className="sticky-cta-period">a year</span>
          </div>
          <button className="cta" onClick={goToPricing}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}
