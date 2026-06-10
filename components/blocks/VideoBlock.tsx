import { containerClass, type BlockProps } from './BlockRenderer';

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoBlock({ content, config }: BlockProps) {
  const embed = content.url ? toEmbedUrl(String(content.url)) : null;
  if (!embed) return null;
  return (
    <div className={containerClass(config)}>
      <div className="video-frame">
        <iframe
          src={embed}
          title={content.caption || 'Video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {content.caption ? <p className="video-caption">{content.caption}</p> : null}
    </div>
  );
}
