import { brass, organization } from "@/lib/organization";

export function Monogram({ className = "size-9 text-sm" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-primary font-semibold tracking-tight text-primary-foreground ${className}`}
      style={{ boxShadow: `inset 0 -3px 0 ${brass}` }}
      aria-hidden="true"
    >
      {organization.shortName}
    </span>
  );
}