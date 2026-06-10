import { containerClass, type BlockProps } from './BlockRenderer';

export function FaqBlock({ content, config }: BlockProps) {
  const items: { question?: string; answer?: string }[] = (content.items ?? []).filter(
    (it: { question?: string }) => it.question
  );
  return (
    <div className={containerClass(config)}>
      {content.heading ? <h2 className="blk-heading">{content.heading}</h2> : null}
      <div className="faq-list">
        {items.map((it, i) => (
          <details key={i} className="faq-item">
            <summary>{it.question}</summary>
            <div
              className="richtext"
              dangerouslySetInnerHTML={{ __html: it.answer || '' }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}
