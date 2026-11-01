import Link from "next/link";
import { Container } from "@/components/landing/container";
import { Monogram } from "@/components/monogram";
import { navLinks } from "@/lib/landing-content";
import { organization } from "@/lib/organization";

const footerLinks = [
  { href: "#verify", label: "Verify a certificate" },
  ...navLinks,
  { href: "/login", label: "Staff login" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:gap-6 sm:py-10 md:flex-row">
        <div className="flex items-center gap-2 sm:gap-3">
          <Monogram className="size-6 sm:size-8 text-xs" />
          <span className="text-sm sm:text-base font-semibold tracking-tight">{organization.name}</span>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground"
        >
          {footerLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="transition-colors hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>

        <div className="text-center text-xs sm:text-sm text-muted-foreground md:text-right">
          <p>
            © {new Date().getFullYear()} {organization.name}
          </p>
          <p className="mt-0.5 text-[10px] sm:text-xs">Powered by CertiVerify</p>
        </div>
      </Container>
    </footer>
  );
}