import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { organization } from "@/lib/organization";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8 sm:pb-20 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:gap-10 sm:px-8 sm:py-12 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-14 lg:px-12">
        <div>
          <h2 className="text-xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
            Issued and managed by {organization.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm sm:text-md text-primary-foreground/90">
            This is the official certificate system of {organization.name}. Only certificates issued by our
            certificate office can be verified here. If a certificate will not verify, or you need help, get in touch.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={`mailto:${organization.contactEmail}`}
            className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3 transition-colors hover:bg-primary-foreground/15 sm:py-3.5"
          >
            <Mail className="size-4 sm:size-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-all text-xs sm:text-sm font-medium">{organization.contactEmail}</span>
          </a>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full justify-center text-sm sm:text-base")}
          >
            Staff login
            <ArrowRight className="ml-1.5 size-3.5 sm:size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}