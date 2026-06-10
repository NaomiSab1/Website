import { containerClass, type BlockProps } from './BlockRenderer';

export function MapBlock({ content, config }: BlockProps) {
  if (!content.embed_url) return null;
  return (
    <div className={containerClass(config)}>
      {content.heading ? <h2 className="blk-heading">{content.heading}</h2> : null}
      <iframe
        src={content.embed_url}
        title={content.heading || 'Map'}
        style={{ width: '100%', height: Number(content.height) || 420, border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
