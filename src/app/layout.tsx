
'use client';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartProvider } from '@/components/cart-provider';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isReelsPage = pathname === '/reels';

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
            <main className={cn(
              "flex-1",
              isReelsPage ? "pt-0" : "pt-24",
              isReelsPage ? "pb-0" : "pb-20",
            )}>
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
