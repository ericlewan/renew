import Image from 'next/image';

/**
 * A full-bleed atmospheric band.
 *
 * The point of these is craft, not information — commissioned-looking
 * photography signals investment, and generic stock signals the opposite, so
 * every one of them is abstract, dark, and has light as its only subject. No
 * people, no objects, nothing that could have come from a stock library.
 *
 * Two details do most of the work:
 *
 *   1. The image bleeds past the reading column. A photograph boxed inside
 *      the text measure reads as an illustration dropped into a document.
 *   2. Its edges are masked into the ground, so it emerges from the dark
 *      rather than sitting on it as a rectangle. Hard edges are the single
 *      clearest tell that an image was pasted in.
 *
 * Decorative by intent: the adjacent copy carries the meaning, so alt is
 * empty and screen readers skip it rather than hearing a description of mood.
 */
export function Figure({ src, tall = false }: { src: string; tall?: boolean }) {
  return (
    <div className="figure" data-tall={tall}>
      <Image
        src={`/img/${src}.webp`}
        alt=""
        /* Intrinsic size of the source; CSS crops it to the band height.
           Declaring it lets the browser reserve space, so the band never
           shifts the copy below it while loading. */
        width={1200}
        height={655}
        sizes="100vw"
        priority={false}
      />
    </div>
  );
}
