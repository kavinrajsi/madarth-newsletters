import type {MetadataRoute} from 'next';

import {getIssues, getTopics} from '@/lib/issues';
import {url} from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const issues = getIssues();
  return [
    {url: url(), lastModified: issues[0]?.modified, changeFrequency: 'weekly', priority: 0.7},
    ...issues.map((i) => ({url: i.url, lastModified: i.modified, changeFrequency: 'yearly' as const, priority: 0.6})),
    ...getTopics().map((t) => ({url: url(`/topics/${t.slug}`), changeFrequency: 'weekly' as const, priority: 0.4})),
  ];
}
