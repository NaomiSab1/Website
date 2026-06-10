import Image from 'next/image';
import { containerClass, type BlockProps } from './BlockRenderer';

export function GalleryBlock({ content, config }: BlockProps) {
  const items: { image?: string; alt?: string; caption?: string }[] = content.items ?? [];
  const cols = config.columns && config.columns >= 1 && config.columns <= 4 ? config.columns : 3;
  return (
    <div className={containerClass(config)}>
      {content.heading ? <h2 className="blk-heading">{content.heading}</h2> : null}
      <div className="gallery-grid" style={{ ['--cols' as string]: cols }}>
        {items
          .filter((it) => it.image)
          .map((it, i) => (
            <figure key={i} className="gallery-item">
              <Image
                src={it.image!}
                alt={it.alt || ''}
                width={900}
                height={640}
                sizes={`(max-width: 760px) 100vw, ${Math.round(100 / cols)}vw`}
                loading="lazy"
              />
              {it.caption ? <figcaption>{it.caption}</figcaption> : null}
            </figure>
          ))}
      </div>
    </div>
  );
}
