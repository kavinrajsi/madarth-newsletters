import type {Metadata} from 'next';
import type {ReactNode} from 'react';

import './globals.css';
import {Providers} from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Newsletters | Madarth®',
  description: 'Madarth® newsletter inbox.',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
