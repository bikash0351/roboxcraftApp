"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
// Removed: import { RoboxcraftLogo } from "./roboxcraft-logo";

import { Input } from "./ui/input";

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/reels") {
    return null;
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Replaced RoboxcraftLogo with an <img> tag pointing to the new path */}
          <img
            src="/images/roboxcraft-logo.jpeg"
            alt="Roboxcraft Logo"
            className="h-10 w-10 text-primary object-contain"
          />
        </Link>

        <div className="flex-1">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search for products"
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}