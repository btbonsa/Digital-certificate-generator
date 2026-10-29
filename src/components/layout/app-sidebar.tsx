"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { cn } from "cn";
import { Monogram } from "@/components/monogram";
import { adminNavItems } from "@/components/layout/nav-items";
import { brass, organization } from "@/lib/organization";

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <Monogram />
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-serif text-lg font-medium tracking-tight text-sidebar-foreground">
            {organization.name}
          </span>
          <span className="block text-xs text-muted-foreground">Certificate workspace</span>
        </span>
      </Link>

      <div className="px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Workspace
      </div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                  style={{ backgroundColor: brass }}
                />
              )}
              <Icon className={cn("size-4", isActive && "text-sidebar-primary")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-xl border border-sidebar-border bg-background/60 p-4">
        <span
          className="mb-3 flex size-8 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: brass }}
          aria-hidden="true"
        >
          <BadgeCheck className="size-4" />
        </span>
        <p className="font-serif text-base font-medium">Secure by design</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Every certificate gets a unique code that anyone can verify.
        </p>
      </div>
    </aside>
  );
}