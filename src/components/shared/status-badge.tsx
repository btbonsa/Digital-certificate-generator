import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "valid" | "revoked" | "unknown";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    valid: "border-emerald-600/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    revoked: "border-rose-600/15 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    unknown: "border-border bg-muted text-muted-foreground",
  };

  const labels = {
    valid: "Valid",
    revoked: "Revoked",
    unknown: "Unknown",
  };

  return (
    <Badge className={cn(variants[status], className)}>
      {labels[status]}
    </Badge>
  );
}
