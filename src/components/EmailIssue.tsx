import {SignupForm} from './SignupForm';
import {formatDate, slugify} from '@/lib/format';
import type {Issue} from '@/lib/issues';
import {NEWSLETTER_NAME, SITE_URL, href} from '@/lib/site';

const COLUMN = 600; // standard email width

/**
 * Renders an issue the way it looked in the inbox: a 600px white column of
 * stacked images on a light grey page. Each image's alt text carries the text
 * baked into it, and the full text version sits below in a <details> block.
 */
export function EmailIssue({issue, related, embedded = false}: {issue: Issue; related: Issue[]; embedded?: boolean}) {
  return (
    <div className={embedded ? 'email-page embedded' : 'email-page'}>
      <header className="email-top">
        {!embedded && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={SITE_URL}>Home</a> › <a href={href()}>{NEWSLETTER_NAME}</a>
          </nav>
        )}
        <h1>{issue.title}</h1>
        <p className="byline">
          By {issue.author} · <time dateTime={issue.date}>{formatDate(issue.date)}</time>
        </p>
        <p className="summary">{issue.summary}</p>
      </header>

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

      <div className="email-below">
        <details className="email-text">
          <summary>Read this issue as text</summary>
          <div dangerouslySetInnerHTML={{__html: issue.html}} />
        </details>
        {issue.topics.length > 0 && (
          <ul className="chips">
            {issue.topics.map((t) => (
              <li key={t}>
                <a href={href(`/topics/${slugify(t)}`)}>{t}</a>
              </li>
            ))}
          </ul>
        )}
        <SignupForm />
        {related.length > 0 && (
          <section>
            <h2>Related issues</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <a href={r.path}>{r.title}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2>Work with Madarth®</h2>
          <p>
            Explore our <a href={`${SITE_URL}/service`}>branding and advertising services</a> or see{' '}
            <a href={`${SITE_URL}/work`}>our work</a>. <a href={`${SITE_URL}/contact-us`}>Get in touch</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
