import type { Section, SectionConfig } from '@/lib/types';
import { HeroBlock } from './HeroBlock';
import { GalleryBlock } from './GalleryBlock';
import { ProjectShowcaseBlock } from './ProjectShowcaseBlock';
import { TextImageBlock } from './TextImageBlock';
import { TestimonialsBlock } from './TestimonialsBlock';
import { StatsBlock } from './StatsBlock';
import { ContactFormBlock } from './ContactFormBlock';
import { FaqBlock } from './FaqBlock';
import { CtaBlock } from './CtaBlock';
import { MapBlock } from './MapBlock';
import { VideoBlock } from './VideoBlock';
import { CustomHtmlBlock } from './CustomHtmlBlock';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BlockProps {
  content: any;
  config: SectionConfig;
}

const RENDERERS: Record<string, React.ComponentType<BlockProps>> = {
  hero: HeroBlock,
  gallery: GalleryBlock,
  project_showcase: ProjectShowcaseBlock as any,
  text_image: TextImageBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  contact_form: ContactFormBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  map: MapBlock,
  video: VideoBlock,
  custom_html: CustomHtmlBlock,
};

export function sectionClass(config: SectionConfig, type: string): string {
  const cls = ['blk', `blk-${type}`];
  cls.push(`bg-${config.background ?? 'default'}`);
  cls.push(`sp-${config.spacing ?? 'normal'}`);
  if (config.align === 'center') cls.push('align-center');
  return cls.join(' ');
}

export function containerClass(config: SectionConfig): string {
  return `container container-${config.container ?? 'normal'}`;
}

export function BlockRenderer({ sections }: { sections: Section[] }) {
  const ordered = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <>
      {ordered.map((section) => {
        const Renderer = RENDERERS[section.type];
        if (!Renderer) return null;
        const config = section.config ?? {};
        return (
          <section
            key={section.id}
            id={config.anchor || undefined}
            className={sectionClass(config, section.type)}
          >
            <Renderer content={section.content ?? {}} config={config} />
          </section>
        );
      })}
    </>
  );
}

/** Renders `*accent*` markers as italic <em> for display headings. */
export function Accent({ text }: { text: string }) {
  const parts = String(text ?? '').split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>
      )}
    </>
  );
}
