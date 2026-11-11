'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * Renders a coded HTML email in an iframe so its own CSS stays contained and it
 * looks exactly as sent. Same-origin, so the frame can be sized to its content
 * and re-measured when the pane width (and so the email's layout) changes.
 */
export function EmailFrame({src, title}: {src: string; title: string}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1600);

  const measure = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    setHeight(Math.ceil(doc.documentElement.scrollHeight));
  }, []);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let ro: ResizeObserver | undefined;
    const attach = () => {
      measure();
      const body = frame.contentDocument?.body;
      if (body && typeof ResizeObserver !== 'undefined') {
        ro?.disconnect();
        ro = new ResizeObserver(measure);
        ro.observe(body);
      }
    };
    frame.addEventListener('load', attach);
    if (frame.contentDocument?.readyState === 'complete') attach();
    return () => {
      frame.removeEventListener('load', attach);
      ro?.disconnect();
    };
  }, [measure, src]);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      style={{display: 'block', width: '100%', height, border: 0, background: '#efefef'}}
    />
  );
}
