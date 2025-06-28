import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Showcase - 3D Interactive Experience',
  description:
    'An immersive 3D portfolio showcasing innovative projects across fashion, technology, events, and digital art. Navigate through projects with stunning visual effects.',
  keywords: 'portfolio, 3D, interactive, fashion, technology, events, NFT, AI, digital art',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://zerograv.xyz" />
        <link rel="preconnect" href="https://opensea.io" />
        <link rel="dns-prefetch" href="https://ai-instructor.com" />
        <link rel="dns-prefetch" href="https://queer-alliance.com" />
        <link rel="dns-prefetch" href="https://raw-fiction.com" />
      </head>
      <body className={`${inter.className} bg-[var(--brand-bg)] text-[var(--brand-fg)]`}>
        {children}
      </body>
    </html>
  );
}
