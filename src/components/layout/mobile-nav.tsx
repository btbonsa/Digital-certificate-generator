"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Monogram } from "@/components/monogram";
import { adminNavItems } from "@/components/layout/nav-items";
import { brass, organization } from "@/lib/organization";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex h-full w-72 max-w-72 flex-col p-0">
        <Link
          href="/dashboard"
          onClick={() => onOpenChange(false)}
          className="flex h-16 items-center gap-3 border-b border-border px-5"
        >
          <Monogram />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-lg font-medium tracking-tight text-foreground">
              {organization.name}
            </span>
            <span className="block text-xs text-muted-foreground">Certificate workspace</span>
          </span>
        </Link>

        <nav aria-label="Admin navigation" className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </p>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                    style={{ backgroundColor: brass }}
                  />
                )}
                <Icon className={cn("size-4", isActive && "text-primary")} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}