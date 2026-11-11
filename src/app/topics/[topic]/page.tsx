import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

import {JsonLd} from '@/components/JsonLd';
import {formatDate, getIssues, getTopics} from '@/lib/issues';
import {ARCHIVE_CRUMB, HOME_CRUMB, breadcrumbJsonLd, buildMetadata} from '@/lib/seo';
import {NEWSLETTER_NAME, SITE_URL, href, url} from '@/lib/site';

type Params = Promise<{topic: string}>;

export const dynamicParams = false;

export const generateStaticParams = () => getTopics().map((t) => ({topic: t.slug}));

const find = (slug: string) => getTopics().find((t) => t.slug === slug);

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const t = find((await params).topic);
  if (!t) return {};
  return buildMetadata({
    title: `${t.name} | ${NEWSLETTER_NAME}`,
    description: `Every Madarth® Musings issue about ${t.name}.`,
    path: `/topics/${t.slug}`,
  });
}

export default async function TopicPage({params}: {params: Params}) {
  const topic = find((await params).topic);
  if (!topic) notFound();
  const issues = getIssues().filter((i) => i.topics.includes(topic.name));
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          HOME_CRUMB,
          ARCHIVE_CRUMB,
          {name: topic.name, path: url(`/topics/${topic.slug}`)},
        ])}
      />
      <main className="page">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={SITE_URL}>Home</a> › <a href={href()}>{NEWSLETTER_NAME}</a>
        </nav>
        <h1>{topic.name}</h1>
        <ul>
          {issues.map((i) => (
            <li key={i.slug}>
              <a href={i.path}>{i.title}</a> <span className="byline">· {formatDate(i.date)}</span>
              <br />
              {i.summary}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
