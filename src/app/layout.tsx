import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/components/cart-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'RoboXCraft',
  description: 'Crafting Imagination into Reality',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <CartProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 pb-20 pt-36 md:pt-32 md:pb-0">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
