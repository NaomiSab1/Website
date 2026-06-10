import { containerClass, type BlockProps } from './BlockRenderer';

/**
 * Raw HTML escape hatch. Only role=admin can create/edit these sections
 * (enforced in the editor and by the publish action).
 */
export function CustomHtmlBlock({ content, config }: BlockProps) {
  if (!content.html) return null;
  return (
    <div
      className={containerClass(config)}
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}
