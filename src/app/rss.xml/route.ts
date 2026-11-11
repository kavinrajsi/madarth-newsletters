import {getIssues} from '@/lib/issues';
import {NEWSLETTER_DESCRIPTION, NEWSLETTER_NAME, url} from '@/lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const issues = getIssues();
  const items = issues
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <author>business@madarth.com (${esc(i.author)})</author>
      <description>${esc(i.summary)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(NEWSLETTER_NAME)}</title>
    <link>${url()}</link>
    <description>${esc(NEWSLETTER_DESCRIPTION)}</description>
    <language>en-IN</language>
    <atom:link href="${url('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, {headers: {'Content-Type': 'application/rss+xml; charset=utf-8'}});
}
