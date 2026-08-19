# Renew — funnel

Landing → quiz → processing → email → dashboard → plan. Next.js on Vercel,
Supabase for data, SVG-first card rendering.

```bash
npm run dev      # http://localhost:3000
npm run check    # quiz routing, scoring and cutoff checks
npm run build
```

Nothing needs configuring to run. Without Supabase keys the email capture logs
to the console instead of persisting, so the whole funnel works on a laptop
with no accounts set up.

## The funnel

| Route | Job |
|---|---|
| `/` | Hook + the four curves. The CTA *is* a gender select — choosing is easier than committing, and one tap in makes the next sixteen feel like continuing. |
| `/proof` | Spends that micro-commitment. Shows the method until there is real social proof to show instead. |
| `/quiz` | 16 questions with three personalised interstitials woven in. |
| `/processing` | Animated ring, paced true statements, and one last archetype-specific question at the point of highest attention. |
| `/email` | Its own screen, at peak intent. Skippable on purpose. |
| `/profile/[slug]` | The dashboard. Also the SEO landing page for organic traffic. |
| `/plan` | The selling page. Split out so the price can be tested without touching the page that carries the SEO. |

## Where things are

| Path | What |
|---|---|
| `src/design/tokens.ts` | Every colour, size and rhythm. CSS custom properties are generated from it at render time, so they cannot drift. |
| `src/design/brand.ts` | The product name. One edit renames everything. |
| `src/quiz/questions.ts` | The 16 questions and their archetype weights. |
| `src/quiz/breaks.ts` | The interstitials, and the rules for writing them. |
| `src/quiz/score.ts` | Scoring, tiebreak, caffeine cutoff. |
| `src/quiz/useStoredResult.ts` | The three-state session store. Read the comment before touching it. |
| `src/cards/ArchetypeCard.ts` | The card, as an SVG string. The artifact everything else derives from. |
| `src/cards/curve.ts` | The parametric curves — current and target. |
| `src/lib/offer.ts` | Pricing and guarantee. |
| `src/lib/evidence.ts` | The studies behind the rules. Rules for adding to it are in the file. |
| `src/lib/proof.ts` | Social proof. Degrades honestly at zero users. |

## The design system

Nocturne. Every card is a deep field with one luminous curve, and the ground's
*hue* encodes when that archetype's day breaks — all four sit at the same very
low value and differ only in colour, the way a long exposure renders noon and
midnight at the same brightness.

Two rules that came out of testing at Pinterest thumbnail size:

1. **Optical weight goes up on dark, not down.** Light type on a dark ground
   bleeds; anything under medium weight disappears at 236px.
2. **The curve is the only bright object.** If a second thing glows, the card
   stops reading at a glance.

## The card

One geometry — 1000×1500, 2:3 — serves the quiz result, the Pinterest pin, the
PDF page and the share asset. Adding a second geometry is how this becomes four
renderers instead of one.

```
/api/card/delayed-crasher.svg              vector, for editing and animating
/api/card/delayed-crasher.png              1000x1500 nocturne
/api/card/delayed-crasher.png?scale=3      3000x4500, ~300dpi
/api/card/delayed-crasher.png?mode=print   ink on paper, for PDF pages
```

Resolution and colour mode are independent axes. Every `<g>` carries an id so
the motion channel can address individual layers.

## Honesty constraints

These are product decisions, not preferences. Each is documented at the point
it is enforced.

- **No invented social proof.** `proof.ts` shows the method at zero users and
  switches to counts and quotes only when they are real.
- **No invented statistics** in the quiz interstitials. See `breaks.ts`.
- **Real, linked studies only**, each stating its own limitation on the page.
  See `evidence.ts`.
- **No medical claims anywhere.** Timing patterns in behaviour, never
  physiology, diagnosis or outcome promises.
- **The processing screen paces true statements.** Every label is something
  the scorer genuinely does, and the mid-flight question is really kept and
  really used.

## Known gaps

1. **The protocol actions are illustrative.** `ProtocolPreview` holds a
   hand-written shape per archetype so the paywall shows something real. The
   rules engine (`02-plan.md` §7) replaces it. Spreadsheet first.
2. **Caffeine cutoff constants are placeholders.** See `CAFFEINE_CUTOFF_HOURS`
   in `src/quiz/score.ts`. Internally consistent, not researched.
3. **No Stripe.** The prices, tiers and guarantee copy are real; the checkout
   is not wired.
4. **No Supabase schema yet.** `store.ts` expects a `subscribers` table with
   `email` (unique), `archetype`, `gender`, `age`.
5. **The name is unverified.** "Renew" is a common word in this category —
   trademark and domain need checking before it goes on anything printed.
