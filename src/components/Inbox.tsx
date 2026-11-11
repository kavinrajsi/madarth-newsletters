'use client';

import {useMemo, useState} from 'react';

import {Layout, LayoutContent, LayoutHeader, LayoutPanel, HStack, VStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {List, ListItem} from '@astryxdesign/core/List';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Switch} from '@astryxdesign/core/Switch';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {Breadcrumbs, BreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {Divider} from '@astryxdesign/core/Divider';

import type {IssueListItem} from '@/lib/issues';
import {SignupForm} from './SignupForm';

function SidebarGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'});

export function Inbox({
  issues,
  name,
  description,
  topics,
}: {
  issues: IssueListItem[];
  name: string;
  description: string;
  topics: {slug: string; name: string; count: number}[];
}) {
  const [query, setQuery] = useState('');
  const [recentOnly, setRecentOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 60;
    return issues.filter(
      (n) =>
        (!recentOnly || new Date(n.date).getTime() > cutoff) &&
        (!q || `${n.title} ${n.summary} ${n.topics.join(' ')}`.toLowerCase().includes(q)),
    );
  }, [issues, query, recentOnly]);

  const sidebar = (
    <LayoutPanel width={380} hasDivider>
      <VStack gap={3} style={{height: '100%', minHeight: 0}}>
        <VStack gap={3} style={{padding: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)'}}>
          <HStack justify="between" align="center">
            <Heading level={2}>Issues</Heading>
            <Switch label="Last 60 days" value={recentOnly} onChange={setRecentOnly} />
          </HStack>
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
        <div style={{overflowY: 'auto', minHeight: 0, flex: 1}}>
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
        start={sidebarOpen ? sidebar : undefined}
        header={
          <LayoutHeader hasDivider>
            <HStack gap={3} align="center">
              <IconButton
                label={sidebarOpen ? 'Hide issues' : 'Show issues'}
                variant="ghost"
                icon={<Icon icon={SidebarGlyph} />}
                onClick={() => setSidebarOpen((o) => !o)}
              />
              <Breadcrumbs separator="›">
                <BreadcrumbItem href="https://www.madarth.com/">Madarth®</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Newsletters</BreadcrumbItem>
              </Breadcrumbs>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <VStack gap={4} style={{padding: 'var(--spacing-5)', maxWidth: 640}}>
              <Heading level={1}>{name}</Heading>
              <Text>{description}</Text>
              <SignupForm />
              {topics.length > 0 && (
                <VStack gap={2}>
                  <Heading level={2}>Topics</Heading>
                  <ul className="chips" style={{padding: 0}}>
                    {topics.map((t) => (
                      <li key={t.slug}>
                        <a href={`/newsletters/topics/${t.slug}`}>{t.name} ({t.count})</a>
                      </li>
                    ))}
                  </ul>
                </VStack>
              )}
              <Text type="supporting" color="secondary">
                <a href="/newsletters/rss.xml">RSS feed</a>
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </div>
  );
}
