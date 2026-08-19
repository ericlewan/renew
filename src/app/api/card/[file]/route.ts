import path from 'node:path';
import { archetypeCardSvg } from '@/cards/ArchetypeCard';
import { card, type ArchetypeSlug } from '@/design/tokens';
import { brand } from '@/design/brand';
import { archetypes } from '@/quiz/archetypes';

/**
 * Card export.
 *
 * Two independent axes — resolution and colour mode. They were one flag at
 * first, which quietly made it impossible to get a large screen-mode card or
 * a small proof of the print version.
 *
 *   /api/card/delayed-crasher.svg              vector, for editing/animating
 *   /api/card/delayed-crasher.png              1000x1500 nocturne
 *   /api/card/delayed-crasher.png?scale=3      3000x4500 nocturne
 *   /api/card/delayed-crasher.png?mode=print   ink on paper, for PDF pages
 *   ...?mode=print&scale=3                     ~300dpi print artwork
 *
 * The pipeline is SVG-first on purpose. The same markup that renders in the
 * page is the thing that gets rasterised, so a pin, a PDF page and the
 * on-screen card can never drift apart, and the vector stays available as
 * animation source.
 */

export const runtime = 'nodejs';

/** 1x for the web, 3x (~300dpi at 10in) for print. Bounded so a stray query
    parameter can't ask the server for a 40-megapixel render. */
function clampScale(raw: string | null): number {
  const value = Number(raw ?? 1);
  if (!Number.isFinite(value)) return 1;
  return Math.min(card.printScale, Math.max(1, Math.round(value)));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const match = /^([a-z-]+)\.(svg|png)$/.exec(file);
  if (!match) return new Response('Not found', { status: 404 });

  const [, slug, format] = match;
  if (!(slug in archetypes)) return new Response('Not found', { status: 404 });

  const query = new URL(request.url).searchParams;
  const mode = query.get('mode') === 'print' ? 'print' : 'screen';

  const svg = archetypeCardSvg({ slug: slug as ArchetypeSlug, mode });

  if (format === 'svg') {
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  }

  const scale = clampScale(query.get('scale'));
  const width = card.width * scale;

  const { Resvg } = await import('@resvg/resvg-js');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: {
      fontDirs: [path.join(process.cwd(), 'public/fonts')],
      /* Only our own fonts. System fonts would make the exported pin depend
         on whatever machine rendered it, which is unacceptable for print. */
      loadSystemFonts: false,
      defaultFontFamily: 'Archivo',
    },
  });

  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="${brand.slug}-${slug}-${mode}@${scale}x.png"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
