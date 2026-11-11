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
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {Divider} from '@astryxdesign/core/Divider';

import {NEWSLETTERS} from '@/data/newsletters';

// Inline sidebar-toggle glyph (no icon package dependency).
function SidebarGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

export default function InboxPage() {
  const [query, setQuery] = useState('');
  const [unreadsOnly, setUnreadsOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NEWSLETTERS.filter(
      (n) =>
        (!unreadsOnly || n.unread) &&
        (!q || `${n.sender} ${n.subject} ${n.preview}`.toLowerCase().includes(q)),
    );
  }, [query, unreadsOnly]);

  const selected = NEWSLETTERS.find((n) => n.id === selectedId) ?? null;

  const sidebar = (
    <LayoutPanel width={380} hasDivider>
      <VStack gap={3} style={{height: '100%', minHeight: 0}}>
        <VStack gap={3} style={{padding: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)'}}>
          <HStack justify="between" align="center">
            <Heading level={2}>Inbox</Heading>
            <Switch label="Unreads" value={unreadsOnly} onChange={setUnreadsOnly} />
          </HStack>
          <TextInput
            label="Search newsletters"
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
              <Text color="secondary">No newsletters found.</Text>
            </div>
          ) : (
            <List>
              {items.map((n) => (
                <ListItem
                  key={n.id}
                  isSelected={n.id === selectedId}
                  onClick={() => setSelectedId(n.id)}
                  label={
                    <VStack gap={1}>
                      <HStack justify="between" align="center">
                        <Text weight={n.unread ? 'semibold' : undefined}>{n.sender}</Text>
                        <Text type="supporting" color="secondary">{n.time}</Text>
                      </HStack>
                      <Text weight="semibold">{n.subject}</Text>
                    </VStack>
                  }
                  description={n.preview}
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
                label={sidebarOpen ? 'Hide inbox' : 'Show inbox'}
                variant="ghost"
                icon={<Icon icon={SidebarGlyph} />}
                onClick={() => setSidebarOpen((o) => !o)}
              />
              <Breadcrumbs separator="›">
                <BreadcrumbItem onClick={() => setSelectedId(null)}>All Inboxes</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Inbox</BreadcrumbItem>
              </Breadcrumbs>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            {selected ? (
              <VStack gap={3} style={{padding: 'var(--spacing-4)', maxWidth: 720}}>
                <Text type="supporting" color="secondary">{selected.sender} · {selected.time}</Text>
                <Heading level={1}>{selected.subject}</Heading>
                <Text>{selected.preview}</Text>
              </VStack>
            ) : (
              <VStack gap={3} style={{padding: 'var(--spacing-4)'}}>
                {Array.from({length: 8}, (_, i) => (
                  <Skeleton key={i} index={i} height={76} radius={4} />
                ))}
              </VStack>
            )}
          </LayoutContent>
        }
      />
    </div>
  );
}
