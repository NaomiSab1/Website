import Link from 'next/link';
import { Accent, containerClass, type BlockProps } from './BlockRenderer';

export function CtaBlock({ content, config }: BlockProps) {
  return (
    <div className={containerClass(config)}>
      <div className="cta-band">
        <div>
          {content.heading ? (
            <h2 className="blk-heading">
              <Accent text={content.heading} />
            </h2>
          ) : null}
          {content.body ? <p className="cta-body">{content.body}</p> : null}
        </div>
        {content.cta?.label ? (
          <Link href={content.cta.href || '#'} className="btn btn-primary">
            {content.cta.label} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
