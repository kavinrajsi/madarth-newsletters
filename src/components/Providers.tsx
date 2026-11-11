'use client';

import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';

import {themes, defaultThemeSlug} from '../../astryx-themes';

export function Providers({children}: {children: ReactNode}) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode="dark">
      {children}
    </Theme>
  );
}
