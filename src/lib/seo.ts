import type {Metadata} from 'next';

import {NEWSLETTER_NAME, ORGANIZATION_ID, SITE_NAME, SITE_URL, url} from './site';

export function buildMetadata(o: {
  title: string;
  description: string;
  path: string; // under the archive, '' for home
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): Metadata {
  const canonical = url(o.path);
  return {
    title: o.title,
    description: o.description,
    robots: {index: true, follow: true},
    alternates: {
      canonical,
      types: {'application/rss+xml': url('/rss.xml')},
    },
    openGraph: {
      title: o.title,
      description: o.description,
      url: canonical,
      siteName: SITE_NAME,
      type: o.type ?? 'website',
      ...(o.image ? {images: [{url: o.image, alt: o.imageAlt ?? o.title}]} : {}),
      ...(o.type === 'article'
        ? {publishedTime: o.publishedTime, modifiedTime: o.modifiedTime, authors: o.authors}
        : {}),
    },
    twitter: {
      card: o.image ? 'summary_large_image' : 'summary',
      title: o.title,
      description: o.description,
      ...(o.image ? {images: [o.image]} : {}),
    },
  };
}

export const organizationRef = () => ({'@id': ORGANIZATION_ID});

export const breadcrumbJsonLd = (items: {name: string; path: string}[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.path.startsWith('http') ? it.path : `${SITE_URL}${it.path}`,
  })),
});

export const HOME_CRUMB = {name: 'Home', path: '/'};
export const ARCHIVE_CRUMB = {name: NEWSLETTER_NAME, path: '/newsletters'};
