import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Background } from '@/components/Background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Showcase - 3D Interactive Experience',
  description: 'An immersive 3D portfolio showcasing innovative projects across fashion, technology, events, and digital art. Navigate through projects with stunning visual effects.',
  keywords: 'portfolio, 3D, interactive, fashion, technology, events, NFT, AI, digital art',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} bg-[var(--brand-bg)] text-[var(--brand-fg)]`}>
        <Background />
        {children}
      </body>
    </html>
  );
}
