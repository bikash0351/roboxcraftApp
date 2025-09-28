
"use client";

import Link from "next/link";
import { LogIn, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { Input } from "./ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const userImage = user?.photoURL;
  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?";

  if (pathname === "/reels") {
    return null;
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
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

        <div className="flex items-center gap-4">
          {loading ? (
             <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {userImage && <AvatarImage src={userImage} alt={user.displayName || "User"} />}
                    <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
