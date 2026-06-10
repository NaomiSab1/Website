import Image from 'next/image';
import Link from 'next/link';
import { Accent, type BlockProps } from './BlockRenderer';

export function HeroBlock({ content }: BlockProps) {
  const { eyebrow, heading, subheading, image, image_alt, overlay, primary_cta, secondary_cta, height } = content;
  return (
    <div className={`hero hero-${height || 'full'}`}>
      {image ? (
        <Image
          src={image}
          alt={image_alt || ''}
          fill
          priority
          sizes="100vw"
          className="hero-img"
        />
      ) : null}
      {overlay !== false && <div className="hero-overlay" />}
      <div className="hero-content container">
        {eyebrow ? <div className="eyebrow eyebrow-light">{eyebrow}</div> : null}
        <h1 className="hero-title">
          {String(heading ?? '')
            .split('\n')
            .map((line, i) => (
              <span key={i} className="hero-line">
                <Accent text={line} />
              </span>
            ))}
        </h1>
        {subheading ? <p className="hero-sub">{subheading}</p> : null}
        <div className="hero-actions">
          {primary_cta?.label ? (
            <Link href={primary_cta.href || '#'} className="btn btn-primary">
              {primary_cta.label} <span aria-hidden>→</span>
            </Link>
          ) : null}
          {secondary_cta?.label ? (
            <Link href={secondary_cta.href || '#'} className="btn btn-ghost btn-ghost-light">
              {secondary_cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
