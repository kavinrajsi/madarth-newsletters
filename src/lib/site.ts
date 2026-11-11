export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madarth.com';
export const BASE = '/newsletters';
export const SITE_NAME = 'Madarth®';
export const NEWSLETTER_NAME = 'Musings by Madarth®';
export const NEWSLETTER_DESCRIPTION =
  'Branding and advertising notes from Madarth®, a Chennai branding agency: what works, with real campaign data.';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.madarth.com';

/** Absolute public URL for a path under the archive, e.g. url('/2026/11/x'). */
export const url = (p = '') => `${SITE_URL}${BASE}${p}`;
/** Path (with base) for in-page links rendered as raw anchors. */
export const href = (p = '') => `${BASE}${p}`;
