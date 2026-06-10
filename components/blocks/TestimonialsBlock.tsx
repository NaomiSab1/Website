import { containerClass, type BlockProps } from './BlockRenderer';

export function TestimonialsBlock({ content, config }: BlockProps) {
  const items: { quote?: string; author?: string }[] = (content.items ?? []).filter(
    (it: { quote?: string }) => it.quote
  );
  return (
    <div className={containerClass(config)}>
      {content.heading ? <h2 className="blk-heading">{content.heading}</h2> : null}
      <div className="testi-list">
        {items.map((it, i) => (
          <figure key={i} className="testi">
            <span className="testi-mark" aria-hidden>
              “
            </span>
            <blockquote>{it.quote}</blockquote>
            {it.author ? <figcaption>{it.author}</figcaption> : null}
          </figure>
        ))}
      </div>
    </div>
  );
}
