"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/reels", label: "Reels" },
  { href: "/account", label: "My Account" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 z-40 hidden w-full border-b bg-background/95 backdrop-blur-sm md:block">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">RoboMart</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/60"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Button asChild variant="ghost" className="relative">
          <Link href="/cart">
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
