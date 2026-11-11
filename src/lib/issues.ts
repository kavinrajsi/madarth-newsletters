import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {marked} from 'marked';

import {SITE_URL, href, url} from './site';

const DIR = path.join(process.cwd(), 'content', 'issues');

export interface Issue {
  slug: string;
  year: string;
  month: string;
  path: string; // with base path, for anchors
  url: string; // absolute canonical
  title: string;
  description: string;
  summary: string;
  date: string; // ISO
  modified: string; // ISO
  author: string;
  topics: string[];
  image?: string; // path, for <img>
  imageUrl?: string; // absolute, for OG / JSON-LD
  imageAlt?: string;
  layout?: 'email';
  emailImages?: {src: string; alt: string; w: number; h: number; href?: string}[];
  html: string;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Drafts are visible in dev/preview but never published to production.
const hideDrafts = process.env.VERCEL_ENV === 'production';

let cache: Issue[] | null = null;

export function getIssues(): Issue[] {
  if (cache) return cache;
  const out: Issue[] = [];
  if (fs.existsSync(DIR)) {
    for (const year of fs.readdirSync(DIR)) {
      for (const month of fs.readdirSync(path.join(DIR, year))) {
        const monthDir = path.join(DIR, year, month);
        if (!fs.statSync(monthDir).isDirectory()) continue;
        for (const file of fs.readdirSync(monthDir)) {
          if (!file.endsWith('.md')) continue;
          const slug = file.replace(/\.md$/, '');
          const {data, content} = matter(fs.readFileSync(path.join(monthDir, file), 'utf8'));
          if (data.draft && hideDrafts) continue;
          const date = new Date(data.date).toISOString();
          out.push({
            slug,
            year,
            month,
            path: href(`/${year}/${month}/${slug}`),
            url: url(`/${year}/${month}/${slug}`),
            title: data.title,
            description: data.description,
            summary: data.summary,
            date,
            modified: data.modified ? new Date(data.modified).toISOString() : date,
            author: data.author || 'Madarth® Team',
            topics: data.topics || [],
            image: data.image,
            imageUrl: data.image ? (String(data.image).startsWith('/') ? `${SITE_URL}${data.image}` : data.image) : undefined,
            imageAlt: data.imageAlt,
            layout: data.layout,
            emailImages: data.emailImages,
            html: marked.parse(content, {async: false}) as string,
          });
        }
      }
    }
  }
  cache = out.sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export const getIssue = (year: string, month: string, slug: string) =>
  getIssues().find((i) => i.year === year && i.month === month && i.slug === slug);

export function getTopics() {
  const map = new Map<string, {slug: string; name: string; count: number}>();
  for (const i of getIssues())
    for (const name of i.topics) {
      const slug = slugify(name);
      const t = map.get(slug) ?? {slug, name, count: 0};
      t.count++;
      map.set(slug, t);
    }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const getRelated = (issue: Issue, limit = 3) =>
  getIssues()
    .filter((i) => i.slug !== issue.slug)
    .map((i) => ({i, score: i.topics.filter((t) => issue.topics.includes(t)).length}))
    .sort((a, b) => b.score - a.score || b.i.date.localeCompare(a.i.date))
    .slice(0, limit)
    .map((x) => x.i);

export const toListItem = ({html: _html, ...rest}: Issue) => rest;
export type IssueListItem = ReturnType<typeof toListItem>;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'});
