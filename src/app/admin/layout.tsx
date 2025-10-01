
"use client";
import { AdminAuthProvider } from "@/components/admin-auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
          'font-body antialiased',
        )}>
        <AdminAuthProvider>
            <div className="relative flex min-h-dvh flex-col bg-muted/20">
                {children}
            </div>
            <Toaster />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
