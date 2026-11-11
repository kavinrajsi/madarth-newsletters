import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {JsonLd} from '@/components/JsonLd';
import {SignupForm} from '@/components/SignupForm';
import {formatDate, getIssue, getIssues, getRelated, slugify} from '@/lib/issues';
import {ARCHIVE_CRUMB, HOME_CRUMB, breadcrumbJsonLd, buildMetadata, organizationRef} from '@/lib/seo';
import {NEWSLETTER_NAME, SITE_URL, href} from '@/lib/site';

type Params = Promise<{year: string; month: string; slug: string}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getIssues().map(({year, month, slug}) => ({year, month, slug}));
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {year, month, slug} = await params;
  const issue = getIssue(year, month, slug);
  if (!issue) return {};
  return buildMetadata({
    title: `${issue.title} | ${NEWSLETTER_NAME}`,
    description: issue.description,
    path: `/${year}/${month}/${slug}`,
    image: issue.imageUrl,
    imageAlt: issue.imageAlt,
    type: 'article',
    publishedTime: issue.date,
    modifiedTime: issue.modified,
    authors: [issue.author],
  });
}

export default async function IssuePage({params}: {params: Params}) {
  const {year, month, slug} = await params;
  const issue = getIssue(year, month, slug);
  if (!issue) notFound();
  const related = getRelated(issue);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: issue.title,
          description: issue.description,
          datePublished: issue.date,
          dateModified: issue.modified,
          author: {'@type': 'Person', name: issue.author},
          publisher: organizationRef(),
          mainEntityOfPage: issue.url,
          url: issue.url,
          ...(issue.imageUrl ? {image: issue.imageUrl} : {}),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([HOME_CRUMB, ARCHIVE_CRUMB, {name: issue.title, path: issue.url}])}
      />
      <main className="page">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={SITE_URL}>Home</a> › <a href={href()}>{NEWSLETTER_NAME}</a>
        </nav>
        <article>
          <h1>{issue.title}</h1>
          <p className="byline">
            By {issue.author} · <time dateTime={issue.date}>{formatDate(issue.date)}</time>
          </p>
          <p className="summary">{issue.summary}</p>
          {issue.image && <img src={issue.image} alt={issue.imageAlt ?? ''} />}
          <div dangerouslySetInnerHTML={{__html: issue.html}} />
        </article>
        {issue.topics.length > 0 && (
          <ul className="chips">
            {issue.topics.map((t) => (
              <li key={t}><a href={href(`/topics/${slugify(t)}`)}>{t}</a></li>
            ))}
          </ul>
        )}
        <SignupForm />
        {related.length > 0 && (
          <section>
            <h2>Related issues</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}><a href={r.path}>{r.title}</a></li>
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
      </main>
    </>
  );
}
