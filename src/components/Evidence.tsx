import { evidence, evidenceDisclaimer } from '@/lib/evidence';

/**
 * What the rules are built on.
 *
 * Two things make this convert rather than decorate. First, every study is
 * real and linked, so anyone who checks finds what we said they would.
 * Second, each one states its own limitation on the page — a twelve-person
 * study is described as a twelve-person study.
 *
 * That reads as confidence rather than weakness, and in a category where
 * everything claims to be clinically proven, being the one page that admits
 * what it doesn't know is a genuine differentiator.
 */
export function Evidence() {
  return (
    <section className="stack evidence" style={{ gap: 'var(--space-5)' }}>
      <div className="stack" style={{ gap: 'var(--space-2)' }}>
        <p className="section-label">What this is built on</p>
        <h2 className="pricing-title">The rules come from somewhere.</h2>
      </div>

      <ol className="studies">
        {evidence.map((study) => (
          <li key={study.citation}>
            <h3 className="study-supports">{study.supports}</h3>
            <p className="study-finding">{study.finding}</p>
            <p className="study-caveat">{study.caveat}</p>
            <a
              className="study-cite"
              href={study.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {study.citation} ↗
            </a>
          </li>
        ))}
      </ol>

      <p className="disclaimer">{evidenceDisclaimer}</p>
    </section>
  );
}
