'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

import {Layout, LayoutContent, LayoutHeader, LayoutPanel, HStack, VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {List, ListItem} from '@astryxdesign/core/List';
import {TextInput} from '@astryxdesign/core/TextInput';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {Divider} from '@astryxdesign/core/Divider';

import type {Issue} from '@/lib/issues';
import {href} from '@/lib/site';
import {EmailIssue} from './EmailIssue';

function SidebarGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

function BackGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'});

export function Inbox({
  issues,
  name,
  initialPath = null,
}: {
  issues: Issue[];
  name: string;
  initialPath?: string | null;
}) {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(initialPath);

  // Below 768px show one pane at a time: the list, or the open email.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const selected = issues.find((i) => i.path === selectedPath) ?? null;
  const homeTitle = `${name} | Newsletter Archive`;

  // Open an issue in the right pane without a page load; keep a shareable URL.
  const open = useCallback(
    (issue: Issue | null) => {
      setSelectedPath(issue ? issue.path : null);
      window.history.pushState({}, '', issue ? issue.path : href());
      document.title = issue ? `${issue.title} | ${name}` : homeTitle;
      document.querySelector('.astryx-layout-content')?.scrollTo({top: 0});
    },
    [name, homeTitle],
  );

  // Browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.replace(/\/$/, '');
      const match = issues.find((i) => i.path === p) ?? null;
      setSelectedPath(match ? match.path : null);
      document.title = match ? `${match.title} | ${name}` : homeTitle;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [issues, name, homeTitle]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues.filter((n) => !q || `${n.title} ${n.summary} ${n.topics.join(' ')}`.toLowerCase().includes(q));
  }, [issues, query]);

  const sidebar = (
    <LayoutPanel width={isMobile ? '100%' : 380} hasDivider>
      <VStack gap={3} style={{height: '100%', minHeight: 0}}>
        <VStack gap={3} style={{padding: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)'}}>
          <Heading level={2}>Issues</Heading>
          <TextInput
            label="Search issues"
            isLabelHidden
            type="search"
            placeholder="Type to search…"
            value={query}
            onChange={setQuery}
          />
        </VStack>
        <Divider />
        <div
          style={{overflowY: 'auto', minHeight: 0, flex: 1}}
          // Capture clicks on the issue links: plain clicks open the issue in the
          // right pane (no page load); modified clicks keep normal link behaviour.
          onClickCapture={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            const a = (e.target as HTMLElement).closest('a[href]');
            const issue = a && issues.find((i) => i.path === a.getAttribute('href'));
            if (!issue) return;
            e.preventDefault();
            e.stopPropagation();
            open(issue);
          }}
        >
          {items.length === 0 ? (
            <div style={{padding: 'var(--spacing-4)'}}>
              <Text color="secondary">No issues found.</Text>
            </div>
          ) : (
            <List>
              {items.map((n) => (
                <ListItem
                  key={n.slug}
                  href={n.path}
                  isSelected={n.path === selectedPath}
                  label={
                    <VStack gap={1}>
                      <HStack justify="between" align="center">
                        <Text type="supporting" color="secondary">{n.author}</Text>
                        <Text type="supporting" color="secondary">{fmt(n.date)}</Text>
                      </HStack>
                      <Text weight="semibold">{n.title}</Text>
                    </VStack>
                  }
                  description={n.summary}
                />
              ))}
            </List>
          )}
        </div>
      </VStack>
    </LayoutPanel>
  );

  return (
    <div style={{height: '100dvh', width: '100%'}}>
      <Layout
        start={(isMobile ? !selected : sidebarOpen) ? sidebar : undefined}
        header={
          <LayoutHeader hasDivider>
            <HStack gap={3} align="center" justify="between" style={{width: '100%'}}>
              <HStack gap={3} align="center">
              {isMobile ? (
                selected && (
                  <IconButton
                    label="Back to issues"
                    variant="ghost"
                    icon={<Icon icon={BackGlyph} />}
                    onClick={() => open(null)}
                  />
                )
              ) : (
                <IconButton
                  label={sidebarOpen ? 'Hide issues' : 'Show issues'}
                  variant="ghost"
                  icon={<Icon icon={SidebarGlyph} />}
                  onClick={() => setSidebarOpen((o) => !o)}
                />
              )}
              <Breadcrumbs separator="›">
                <BreadcrumbItem href="https://www.madarth.com/">Madarth®</BreadcrumbItem>
                {selected ? (
                  <>
                    <BreadcrumbItem href={href()} onClick={(e) => { e.preventDefault(); open(null); }}>
                      Newsletters
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrent>{selected.title.split(':')[0]}</BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem isCurrent>Newsletters</BreadcrumbItem>
                )}
              </Breadcrumbs>
              </HStack>
              <a className="rss-link" href={href('/rss.xml')}>RSS feed</a>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            {selected ? (
              <EmailIssue key={selected.slug} issue={selected} />
            ) : (
              <h1 className="sr-only">{name}</h1>
            )}
          </LayoutContent>
        }
      />
    </div>
  );
}
