import { organization } from "@/lib/organization";

export function OrganizationStrip() {
  return (
    <div className="border-b border-border bg-muted/40 px-4 py-1.5 text-center text-[8px] sm:text-xs text-muted-foreground sm:px-6 lg:px-8 sm:py-2">
      Official certificate verification system for {organization.name}
    </div>
  );
}
