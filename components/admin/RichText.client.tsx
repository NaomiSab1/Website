'use client';

import { useEffect, useRef } from 'react';

/** Minimal WYSIWYG built on contentEditable — stores sanitised-ish HTML. */
export function RichText({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Only set innerHTML when the external value differs (avoids caret jumps).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function addLink() {
    const url = prompt('Link URL (e.g. /contact or https://…)');
    if (url) exec('createLink', url);
  }

  return (
    <div className="rt">
      <div className="rt-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onClick={() => exec('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => exec('formatBlock', '<h3>')} title="Heading">H</button>
        <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} title="Quote">“”</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet list">•</button>
        <button type="button" onClick={addLink} title="Link">🔗</button>
        <button type="button" onClick={() => exec('formatBlock', '<p>')} title="Paragraph">¶</button>
        <button type="button" onClick={() => exec('removeFormat')} title="Clear formatting">⨯</button>
      </div>
      <div
        ref={ref}
        className="rt-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        onBlur={() => ref.current && onChange(ref.current.innerHTML)}
      />
    </div>
  );
}
