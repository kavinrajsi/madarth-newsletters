import {getIssues, getTopics} from '@/lib/issues';
import {NEWSLETTER_DESCRIPTION, NEWSLETTER_NAME, url} from '@/lib/site';

export function GET() {
  const issues = getIssues();
  const body = `# ${NEWSLETTER_NAME}

> ${NEWSLETTER_DESCRIPTION}

Archive: ${url()}
RSS: ${url('/rss.xml')}
Sitemap: ${url('/sitemap.xml')}

## Issues
${issues.map((i) => `- [${i.title}](${i.url}): ${i.summary}`).join('\n') || '- (no issues published yet)'}

## Topics
${getTopics().map((t) => `- [${t.name}](${url(`/topics/${t.slug}`)})`).join('\n') || '- (none yet)'}
`;
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
