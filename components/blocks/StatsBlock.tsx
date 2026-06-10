import { containerClass, type BlockProps } from './BlockRenderer';

export function StatsBlock({ content, config }: BlockProps) {
  const items: { value?: string; suffix?: string; label?: string }[] = content.items ?? [];
  return (
    <div className={containerClass(config)}>
      <div className="stats-grid">
        {items.map((it, i) => (
          <div key={i} className="stat">
            <span className="stat-n">
              {it.value}
              {it.suffix ? <span className="stat-u">{it.suffix}</span> : null}
            </span>
            <span className="stat-l">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
