"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/landing/container";
import { Monogram } from "@/components/monogram";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks } from "@/lib/landing-content";
import { organization } from "@/lib/organization";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Monogram className="size-8" />
          <span className="text-lg font-semibold tracking-tight">{organization.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Staff login
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-border bg-background md:hidden">
          <Container className="space-y-1 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3">
        
              <Link
                href="/login"
                onClick={closeMenu}
                className={cn(buttonVariants({ size: "sm" }), "flex-1")}
              >
                Staff login
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}