import Image from 'next/image';
import Link from 'next/link';
import { Accent, containerClass, type BlockProps } from './BlockRenderer';

export function TextImageBlock({ content, config }: BlockProps) {
  const side = content.image_side === 'left' ? 'left' : 'right';
  return (
    <div className={containerClass(config)}>
      <div className={`ti-grid ti-img-${side}`}>
        <div className="ti-text">
          {content.eyebrow ? <div className="eyebrow">{content.eyebrow}</div> : null}
          {content.heading ? (
            <h2 className="blk-heading">
              <Accent text={content.heading} />
            </h2>
          ) : null}
          <div
            className="richtext"
            dangerouslySetInnerHTML={{ __html: content.body || '' }}
          />
          {content.cta?.label ? (
            <Link href={content.cta.href || '#'} className="btn btn-ghost">
              {content.cta.label} <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
        {content.image ? (
          <div className="ti-media">
            <Image
              src={content.image}
              alt={content.image_alt || ''}
              width={1000}
              height={760}
              sizes="(max-width: 900px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
