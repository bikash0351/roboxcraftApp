"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoboxcraftLogo } from "./roboxcraft-logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

const aboutLinks = [
    { href: "#", label: "About Us" },
    { href: "#", label: "Our Team" },
    { href: "#", label: "Careers" },
]

const contactLinks = [
    { href: "#", label: "Contact Us" },
    { href: "#", label: "Support" },
    { href: "#", label: "FAQs" },
]


export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="hidden h-10 items-center justify-center bg-primary px-4 text-sm font-medium text-primary-foreground md:flex">
        Crafting Imagination Into Reality
      </div>

      {/* Main Header */}
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <RoboxcraftLogo className="h-10 w-10 text-primary" />
          <span className="hidden font-headline text-2xl font-bold md:inline-block">RoboXCraft</span>
        </Link>

        {/* Desktop Search and Nav */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative w-full max-w-lg">
            <Input
              type="search"
              placeholder="Search for products"
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
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
                {label.toUpperCase()}
              </Link>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn("flex items-center gap-1 transition-colors hover:text-primary text-foreground/60 focus:outline-none")}>
              ABOUT
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {aboutLinks.map(link => (
                    <DropdownMenuItem key={link.label} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn("flex items-center gap-1 transition-colors hover:text-primary text-foreground/60 focus:outline-none")}>
              CONTACT
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                 {contactLinks.map(link => (
                    <DropdownMenuItem key={link.label} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>


        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="relative h-10 w-10">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                    <RoboxcraftLogo className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl font-bold">RoboXCraft</span>
                </Link>
                <div className="relative">
                    <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <nav className="flex flex-col gap-4">
                    {navLinks.map(({ href, label }) => (
                    <Link key={label} href={href} className="text-lg font-medium text-foreground/80 hover:text-primary">
                        {label}
                    </Link>
                    ))}
                    <div className="text-lg font-medium text-foreground/80">About</div>
                    <div className="flex flex-col gap-2 pl-4">
                         {aboutLinks.map(link => (
                            <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-primary">{link.label}</Link>
                        ))}
                    </div>
                     <div className="text-lg font-medium text-foreground/80">Contact</div>
                    <div className="flex flex-col gap-2 pl-4">
                        {contactLinks.map(link => (
                            <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-primary">{link.label}</Link>
                        ))}
                    </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
