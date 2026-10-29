"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Monogram } from "@/components/monogram";
import { auth } from "@/lib/auth";
import { brass, organization } from "@/lib/organization";
import { LoaderCircle } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div role="status" className="flex flex-col items-center gap-6 text-center">
          <Monogram className="size-14 text-lg shadow-lg shadow-primary/20" />
          <div className="space-y-3">
            <p className="font-serif text-2xl font-medium tracking-tight">{organization.name}</p>
            <span
              aria-hidden="true"
              className="mx-auto block h-0.5 w-10 rounded-full"
              style={{ backgroundColor: brass }}
            />
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Preparing your workspace…
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to main content
      </a>

      <div className="hidden shrink-0 lg:block">
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        <AppHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto bg-muted/40 px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-10"
        >
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}