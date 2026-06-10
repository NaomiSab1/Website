import Image from 'next/image';
import Link from 'next/link';
import { getProjects } from '@/lib/queries';
import type { Project } from '@/lib/types';
import { Accent, containerClass, type BlockProps } from './BlockRenderer';

const STATUS_LABEL: Record<string, string> = {
  for_sale: 'For Sale',
  sold: 'Sold Prior to Completion',
  completed: 'Completed',
  coming_soon: 'Coming Soon',
};

function specsLine(p: Project): string {
  const s = p.specs ?? {};
  return [
    s.beds ? `${s.beds} Bed` : null,
    s.baths ? `${s.baths} Bath` : null,
    s.garage ? `${s.garage} Garage` : null,
    s.land || null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export async function ProjectShowcaseBlock({ content, config }: BlockProps) {
  const projects = await getProjects(content.source || 'all', Number(content.limit) || 0);
  return (
    <div className={containerClass(config)}>
      <div className="showcase-header">
        <div>
          {content.eyebrow ? <div className="eyebrow">{content.eyebrow}</div> : null}
          {content.heading ? (
            <h2 className="blk-heading">
              <Accent text={content.heading} />
            </h2>
          ) : null}
        </div>
        {content.cta?.label ? (
          <Link href={content.cta.href || '#'} className="btn btn-ghost">
            {content.cta.label} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
      <div className="showcase-grid">
        {projects.map((p) => (
          <article key={p.id} className="project-card">
            {p.cover_image ? (
              <Image
                src={p.cover_image}
                alt={`${p.name} — ${p.location ?? ''}`}
                width={900}
                height={640}
                sizes="(max-width: 760px) 100vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="project-card-placeholder" />
            )}
            <div className="project-card-ov" />
            <div className="project-card-info">
              <div className="project-card-status">
                <span className="dot" /> {STATUS_LABEL[p.status] ?? p.status}
              </div>
              <div className="project-card-name">{p.name}</div>
              {p.location ? <div className="project-card-loc">{p.location}</div> : null}
              {specsLine(p) ? <div className="project-card-specs">{specsLine(p)}</div> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
