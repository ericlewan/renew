import { colour, font } from '@/design/tokens';

/**
 * Caffeine still in the system, from the last cup to bedtime.
 *
 * This is the diagram the decisions log calls the most linkable asset in the
 * product, and it earns that by being personal: the axis is built from the
 * wake time the person gave four questions ago, so it is *their* evening,
 * not a generic chart.
 *
 * Decay is modelled on a 5.5-hour half-life, which is mid-range for adults
 * and varies a lot between people. The copy around it has to keep saying
 * roughly — this is a shape, not a measurement of anyone in particular.
 */

const HALF_LIFE_H = 5.5;
const AWAKE_H = 16; // wake to bed, near enough for a diagram

const W = 320;
const H = 150;
const PAD = { l: 6, r: 6, t: 16, b: 26 };

export function CaffeineCurve({
  wakeTime,
  lastCoffeeH,
}: {
  /** "HH:MM". Falls back to a 07:00 day when the question was skipped. */
  wakeTime: string | null;
  /** Hours after waking that the last cup lands. */
  lastCoffeeH: number;
}) {
  const wake = parseTime(wakeTime) ?? 7 * 60;
  const bedMins = wake + AWAKE_H * 60;

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  /* x runs from the last cup to bedtime; y is the fraction remaining. */
  const span = AWAKE_H - lastCoffeeH;
  const points: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * span;
    const remaining = Math.pow(0.5, t / HALF_LIFE_H);
    const x = PAD.l + (i / 40) * plotW;
    const y = PAD.t + (1 - remaining) * plotH;
    points.push(`${i === 0 ? 'M' : 'L'} ${round(x)} ${round(y)}`);
  }

  const atBed = Math.pow(0.5, span / HALF_LIFE_H);
  const bedY = PAD.t + (1 - atBed) * plotH;
  const percentAtBed = Math.round(atBed * 100);

  return (
    <figure className="diagram">
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img"
        aria-label={`Roughly ${percentAtBed}% of your last coffee is still in your system at bedtime`}>
        <defs>
          <linearGradient id="caff-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colour.bright} stopOpacity="0.16" />
            <stop offset="100%" stopColor={colour.bright} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={`${points.join(' ')} L ${PAD.l + plotW} ${PAD.t + plotH} L ${PAD.l} ${PAD.t + plotH} Z`}
          fill="url(#caff-fill)"
        />
        <path d={points.join(' ')} fill="none" stroke={colour.bright} strokeWidth="2.5" strokeLinecap="round" />

        {/* bedtime, and what's left when you get there */}
        <line
          x1={PAD.l + plotW} y1={PAD.t} x2={PAD.l + plotW} y2={PAD.t + plotH}
          stroke={colour.muted} strokeWidth="1" strokeDasharray="3 4"
        />
        <circle cx={PAD.l + plotW} cy={bedY} r="4" fill={colour.bright} />
        <text
          x={PAD.l + plotW - 8} y={bedY - 12} textAnchor="end"
          fontFamily={font.mono} fontSize="13" fill={colour.bright}
        >
          ~{percentAtBed}% left
        </text>

        <line
          x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH}
          stroke={colour.rule} strokeWidth="1"
        />
        <text x={PAD.l} y={H - 8} fontFamily={font.mono} fontSize="12" fill={colour.faint}>
          last cup
        </text>
        <text x={PAD.l + plotW} y={H - 8} textAnchor="end" fontFamily={font.mono} fontSize="12" fill={colour.faint}>
          {formatTime(bedMins)} bed
        </text>
      </svg>
    </figure>
  );
}

function parseTime(value: string | null): number | null {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.round(mins % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const round = (n: number) => Math.round(n * 10) / 10;
