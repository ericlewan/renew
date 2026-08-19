import type { Metadata, Viewport } from 'next';
import { brand } from '@/design/brand';
import { cssVariables } from '@/design/tokens';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: `${brand.prose} — stop crashing at 3pm`,
  description:
    'Find your baseline in two minutes, then a daily protocol that changes it. Three or four small things, timed to your day.',
};

/**
 * viewport-fit=cover is load-bearing, not cosmetic.
 *
 * Without it every `env(safe-area-inset-*)` resolves to 0, which silently
 * turns all safe-area padding into dead code — that's why the sticky bar sat
 * underneath Safari's bottom toolbar on iOS while looking correct
 * everywhere else.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1019',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Tokens are generated from src/design/tokens.ts so CSS and TS
            can never drift apart. There is no build step. */}
        <style dangerouslySetInnerHTML={{ __html: cssVariables() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
