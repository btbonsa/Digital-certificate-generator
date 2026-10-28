"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { adminNavItems } from "@/components/layout/nav-items";

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <Link href="/dashboard" className="font-semibold tracking-tight text-sidebar-foreground">CertiVerify</Link>
          <p className="text-xs text-muted-foreground">Certificate workspace</p>
        </div>
      </div>

      <div className="px-4 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("size-4", isActive && "text-sidebar-primary")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-xl border border-sidebar-border bg-background/60 p-4">
        <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-4" />
        </div>
        <p className="text-sm font-medium">Secure by design</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Issue and verify credentials from one place.</p>
      </div>
    </aside>
  );
}
