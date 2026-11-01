
import { QrCode } from "lucide-react";
import { Monogram } from "@/components/monogram";
import { organization } from "@/lib/organization";

const sample = {
  recipient: "Abebe Kebede",
  course: "Advanced Web Development",
  number: "CERT-2024-001",
};

export function CertificatePreview() {
  return (
    <div
      role="img"
      aria-label="Example certificate with a QR code and a verified badge"
      className="group relative mx-auto w-full max-w-[540px] px-2 pb-10 sm:px-4 sm:pb-14"
    >
      {/* Certificate outer frame */}
      <div className="aspect-[1.42/1] w-full rounded-xl border border-border bg-green-900/20 p-1.5 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-md sm:rounded-2xl sm:p-2">
        {/* Certificate inner content */}
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-brass/50 bg-yellow-100/30 px-3 py-3 text-center sm:rounded-xl sm:px-6 sm:py-5 md:px-8">

          {/* Decorative corners */}
          <div className="pointer-events-none absolute inset-2 rounded-md border border-brass/15 sm:inset-3" />

          {/* Organization */}
          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2">
            <Monogram className="size-5 text-xs sm:size-7 sm:text-sm" />
            <p className="max-w-[75%] truncate text-[10px] font-bold tracking-tight sm:text-sm">
              {organization.name}
            </p>
          </div>

          {/* Certificate heading */}
          <p className="relative mt-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mt-3 sm:text-[11px] sm:tracking-[0.25em]">
            Certificate of Completion
          </p>

          {/* Recipient introduction */}
          <p className="relative mt-2 text-[9px] text-muted-foreground sm:mt-3 sm:text-xs">
            This certifies that
          </p>

          {/* Recipient name */}
          <p className="relative mt-1 w-full max-w-full truncate border-b border-border px-2 pb-1 font-serif text-base font-medium italic sm:mt-2 sm:pb-2 sm:text-2xl md:text-3xl">
            {sample.recipient}
          </p>

          {/* Course description */}
          <p className="relative mt-2 text-[9px] text-muted-foreground sm:mt-3 sm:text-xs">
            has successfully completed
          </p>

          {/* Course name */}
          <p className="relative mt-1 max-w-full px-2 font-serif text-xs font-semibold sm:mt-2 sm:text-base md:text-lg">
            {sample.course}
          </p>

          {/* Certificate metadata */}
          <div className="relative mt-auto flex w-full items-end justify-between gap-2 pt-3 text-left sm:pt-5">
            <div className="min-w-0">
              <p className="text-[8px] text-muted-foreground sm:text-[10px]">
                Certificate No.
              </p>
              <p className="mt-0.5 truncate font-mono text-[9px] font-medium text-foreground sm:text-xs">
                {sample.number}
              </p>
            </div>

            <QrCode className="size-5 shrink-0 text-foreground transition-transform duration-300 group-hover:scale-110 sm:size-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
