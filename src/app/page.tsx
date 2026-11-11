import {JsonLd} from '@/components/JsonLd';
import {Inbox} from '@/components/Inbox';
import {getIssues} from '@/lib/issues';
import {ARCHIVE_CRUMB, HOME_CRUMB, breadcrumbJsonLd, buildMetadata, organizationRef} from '@/lib/seo';
import {NEWSLETTER_DESCRIPTION, NEWSLETTER_NAME, url} from '@/lib/site';

export const metadata = buildMetadata({
  title: `${NEWSLETTER_NAME} | Newsletter Archive`,
  description: NEWSLETTER_DESCRIPTION,
  path: '',
});

export default function ArchiveHome() {
  const issues = getIssues();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: NEWSLETTER_NAME,
          description: NEWSLETTER_DESCRIPTION,
          url: url(),
          publisher: organizationRef(),
          hasPart: issues.slice(0, 20).map((i) => ({'@type': 'Article', headline: i.title, url: i.url, datePublished: i.date})),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, ARCHIVE_CRUMB])} />
      <Inbox
        issues={issues}
        name={NEWSLETTER_NAME}
      />
    </>
  );
}
