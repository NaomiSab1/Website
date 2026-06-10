import { Accent, containerClass, type BlockProps } from './BlockRenderer';
import { ContactForm } from './ContactForm.client';

export function ContactFormBlock({ content, config }: BlockProps) {
  const interests: string[] = (content.interests ?? [])
    .map((it: { label?: string }) => it.label)
    .filter(Boolean);
  return (
    <div className={containerClass(config)}>
      <div className="contact-grid">
        <div>
          {content.eyebrow ? <div className="eyebrow">{content.eyebrow}</div> : null}
          {content.heading ? (
            <h2 className="blk-heading">
              <Accent text={content.heading} />
            </h2>
          ) : null}
          {content.intro ? <p className="contact-intro">{content.intro}</p> : null}
        </div>
        <ContactForm
          interests={interests}
          successMessage={content.success_message || 'Thank you — we will be in touch shortly.'}
        />
      </div>
    </div>
  );
}
