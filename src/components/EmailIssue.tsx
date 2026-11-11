import type {Issue} from '@/lib/issues';

const COLUMN = 600; // standard email width

/**
 * Renders an issue exactly as it looked in the inbox: a 600px white column of
 * stacked images on a light grey page, and nothing else. Each image's alt text
 * carries the text baked into it, and the title is a visually-hidden <h1>.
 */
export function EmailIssue({issue}: {issue: Issue}) {
  return (
    <div className="email-page embedded">
      <h1 className="sr-only">{issue.title}</h1>
      <article className="email-col" aria-label={issue.title}>
        {issue.emailImages?.map((img, i) => {
          const tag = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.src}
              alt={img.alt}
              width={COLUMN}
              height={Math.round((img.h * COLUMN) / img.w)}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
            />
          );
          return img.href ? (
            <a key={img.src} href={img.href} target="_blank" rel="noopener">
              {tag}
            </a>
          ) : (
            <div key={img.src}>{tag}</div>
          );
        })}
      </article>
    </div>
  );
}
