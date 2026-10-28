"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminNavItems } from "@/components/layout/nav-items";
import { auth } from "@/lib/auth";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = auth.getUser();
  const currentPage = adminNavItems.find((item) => item.href !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`)))?.title ?? "Workspace";
  const initials = (user?.name || "Admin")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const handleLogout = () => {
    auth.logout();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <ShieldCheck className="size-5 text-primary" />
          <span className="font-semibold tracking-tight text-foreground">CertiVerify</span>
        </Link>
        <div className="hidden min-w-0 sm:block">
          <p className="text-xs text-muted-foreground">Admin workspace</p>
          <h1 className="truncate text-sm font-semibold text-foreground">{currentPage}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="ghost" className="h-10 gap-2 rounded-full px-1.5 sm:px-2" aria-label="Open account menu" />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials || "A"}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-36 truncate text-sm font-medium sm:inline">{user?.name || "Administrator"}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{user?.name || "Administrator"}</span>
                  <span className="truncate text-xs text-muted-foreground">Administrator account</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
