'use client';

import { useState } from 'react';
import { annualSaving, includes, offer } from '@/lib/offer';

/**
 * The tariff block.
 *
 * Two tiers, annual preselected. The monthly option exists to be the
 * expensive one — it makes the annual price legible rather than arbitrary,
 * and the plan's own research is blunt about why annual matters: cheap annual
 * plans retain far better than high-priced monthly ones, and month one is
 * where a third of annual cancellations happen.
 *
 * Nothing here counts down, and nothing claims a place is running out. False
 * scarcity is cheap to add and expensive the first time someone checks.
 */
export function Pricing({ id }: { id?: string }) {
  const [tier, setTier] = useState<'annual' | 'monthly'>('annual');
  const chosen = offer[tier];

  return (
    <section className="pricing stack" id={id} style={{ gap: 'var(--space-5)' }}>
      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <p className="section-label">What it costs</p>
        <h2 className="pricing-title">Two ways to pay for it.</h2>
      </div>

      <div className="tiers">
        <button
          className="tier"
          data-selected={tier === 'annual'}
          onClick={() => setTier('annual')}
        >
          <span className="tier-name">Annual</span>
          <span className="tier-price">{offer.annual.label}</span>
          <span className="tier-period">a year, billed once</span>
          <span className="tier-flag">Saves {annualSaving}%</span>
        </button>

        <button
          className="tier"
          data-selected={tier === 'monthly'}
          onClick={() => setTier('monthly')}
        >
          <span className="tier-name">Monthly</span>
          <span className="tier-price">{offer.monthly.label}</span>
          <span className="tier-period">a month</span>
          <span className="tier-flag muted">Cancel any time</span>
        </button>
      </div>

      <ul className="includes">
        {includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <button className="cta price-annual">
          Start — {chosen.label} {chosen.period}
        </button>
        <p className="price-note">
          {offer.guarantee.text}
          {offer.founding.enabled && (
            <>
              {' '}Founding access: the daily app opens {offer.founding.shipDate},
              and your protocol pack arrives today.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
