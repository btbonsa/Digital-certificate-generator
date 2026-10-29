"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  CheckCircle2,
  FileText,
  Mail,
  Menu,
  QrCode,
  Search,
  SearchX,
  ShieldCheck,
  X,
} from "lucide-react";


import { Monogram } from "@/components/monogram";
import { brass, organization } from "@/lib/organization";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#results", label: "What you'll see" },
  { href: "#contact", label: "Contact" },
];

const steps = [
  {
    icon: FileText,
    title: "Find the code",
    description: "Every certificate carries a unique code and a QR code, printed together.",
  },
  {
    icon: QrCode,
    title: "Scan or enter it",
    description: "Scan the QR code with a phone camera, or type the code into the box at the top of this page.",
  },
  {
    icon: BadgeCheck,
    title: "Read the result",
    description: `We check it against ${organization.name}'s records and show who it was issued to and whether it is still valid.`,
  },
];

const results = [
  {
    icon: CheckCircle2,
    title: "Valid",
    description: "The certificate is genuine. You'll see the recipient, the course, and the date it was issued.",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  {
    icon: Ban,
    title: "Revoked",
    description: `${organization.name} issued this certificate but has since withdrawn it. It should not be accepted.`,
    tone: "bg-destructive/10 text-destructive",
  },
  {
    icon: SearchX,
    title: "Not found",
    description: "No certificate matches that code. Check it for typing mistakes, or contact us if you think it's an error.",
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
];




export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");

  const handleVerificationSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = verificationToken.trim();
    if (token) router.push(`/verify/${encodeURIComponent(token)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes cv-stamp {
          0% { opacity: 0; transform: scale(1.9) rotate(-26deg); }
          60% { opacity: 1; transform: scale(0.94) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .cv-seal { animation: cv-stamp 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) 450ms both; }
        }
      `}</style>

      {/* Organization strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6 lg:px-8">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
            <span>Official certificate portal of {organization.name}</span>
          </p>
          <a
            href={`mailto:${organization.contactEmail}`}
            className="hidden text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:inline"
          >
            {organization.contactEmail}
          </a>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Monogram />
            <span className="leading-tight">
              <span className="block text-base font-semibold tracking-tight">{organization.name}</span>
              <span className="block text-xs text-muted-foreground">Certificate portal</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>
              Staff login
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-navigation" className="space-y-1 border-t border-border bg-background px-4 py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`${buttonVariants({ variant: "outline" })} mt-2 w-full`}
            >
              Staff login
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Fine crossed lines, like the pattern printed on security paper */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-foreground/[0.045] [background-image:repeating-linear-gradient(45deg,currentColor_0,currentColor_1px,transparent_1px,transparent_16px),repeating-linear-gradient(-45deg,currentColor_0,currentColor_1px,transparent_1px,transparent_16px)] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-8 lg:py-24">
            <div className="space-y-8">
              <h1 className="max-w-xl text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Verify a {organization.name} certificate.
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Every certificate we issue has a unique code and QR code. Enter the code, or scan the QR, to confirm
                it against our records in seconds.
              </p>

              <form id="verify" onSubmit={handleVerificationSearch} className="max-w-xl scroll-mt-32 space-y-2.5">
                <label htmlFor="verification-token" className="text-sm font-medium">
                  Verification code
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
                  <Search className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="verification-token"
                    name="token"
                    autoComplete="off"
                    placeholder="Enter the code from the certificate"
                    value={verificationToken}
                    onChange={(event) => setVerificationToken(event.target.value)}
                    className="h-11 border-0 bg-transparent px-1 font-mono tracking-wide shadow-none focus-visible:ring-0"
                    required
                  />
                  <Button type="submit" size="lg" className="shrink-0 rounded-xl">
                    Verify
                    <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  The code is printed on the certificate next to the QR code. Scanning the QR code opens the result
                  directly.
                </p>
              </form>
            </div>

            {/* Certificate artwork */}
            <div className="relative mx-auto w-full max-w-lg pb-6 sm:pb-12">
              <div className="relative rounded-2xl border border-border bg-card p-2.5 shadow-xl shadow-foreground/5">
                <div
                  className="relative rounded-xl border px-6 pb-14 pt-8 text-center sm:px-10"
                  style={{ borderColor: `color-mix(in srgb, ${brass} 45%, transparent)` }}
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <Monogram className="size-8 text-xs" />
                    <p className="text-sm font-semibold tracking-tight">{organization.name}</p>
                  </div>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Certificate of completion
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">This certifies that</p>
                  <p className="mt-2 border-b border-border pb-4 font-serif text-4xl font-medium italic">Abebe Kebede</p>
                  <p className="mt-5 text-sm text-muted-foreground">has successfully completed</p>
                  <p className="mt-1 font-serif text-xl font-medium">Advanced Web Development</p>

                  <div className="mt-9 flex items-end justify-between text-left text-xs text-muted-foreground">
                    <div>
                      <p>Certificate no.</p>
                      <p className="mt-0.5 font-mono text-sm text-foreground">CERT-2024-001</p>
                    </div>
                    <QrCode className="size-12 text-foreground" aria-hidden="true" />
                  </div>

                  <span
                    className="cv-seal absolute -bottom-7 left-1/2 flex size-[76px] -translate-x-1/2 -rotate-12 items-center justify-center rounded-full border-4 border-card text-white shadow-lg"
                    style={{ backgroundColor: brass }}
                    aria-hidden="true"
                  >
                    <BadgeCheck className="size-9" />
                  </span>
                </div>
              </div>

              {/* Verification result */}
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg shadow-foreground/5 sm:absolute sm:-bottom-2 sm:-right-4 sm:mt-0 sm:w-72">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Certificate verified</p>
                  <p className="truncate text-xs text-muted-foreground">Issued by {organization.name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-border bg-muted/40 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">How verification works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you are an employer, a school, or the certificate holder, checking takes three steps.
              </p>
            </div>

            <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <li key={step.title} className="relative">
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-14 right-[-1rem] top-6 hidden h-px bg-border md:block"
                      />
                    )}
                    <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <StepIcon className="size-6" aria-hidden="true" />
                      <span
                        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-background text-xs font-semibold text-white"
                        style={{ backgroundColor: brass }}
                      >
                        {index + 1}
                      </span>
                    </span>
                    <h3 className="mt-6 text-2xl font-medium tracking-tight">{step.title}</h3>
                    <p className="mt-2 max-w-sm text-muted-foreground">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Results */}
        <section id="results" className="scroll-mt-20 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">What you&apos;ll see</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every check ends in one of three clear answers.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
              {results.map((result) => {
                const ResultIcon = result.icon;
              
                return (
                  <div key={result.title} className="bg-card p-8 sm:p-10">
                    <span className={`flex size-12 items-center justify-center rounded-xl ${result.tone}`}>
                      <ResultIcon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-2xl font-medium tracking-tight">{result.title}</h3>
                    <p className="mt-2 text-muted-foreground">{result.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About and contact */}
        <section id="contact" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-12 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-14">
            <div>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                Issued and managed by {organization.name}
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/80">
                This is the official certificate system of {organization.name}. Only certificates issued by our
                certificate office can be verified here. If a certificate will not verify, or you need help, get in
                touch.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${organization.contactEmail}`}
                className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3.5 transition-colors hover:bg-primary-foreground/15"
              >
                <Mail className="size-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 break-all text-sm font-medium">{organization.contactEmail}</span>
              </a>
              <Link
                href="/login"
                className={`${buttonVariants({ variant: "secondary", size: "lg" })} w-full justify-center`}
              >
                Staff login
                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <Monogram className="size-8 text-xs" />
            <span className="font-semibold tracking-tight">{organization.name}</span>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <Link href="#verify" className="transition-colors hover:text-foreground">Verify a certificate</Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="transition-colors hover:text-foreground">Staff login</Link>
          </nav>

          <div className="text-center text-sm text-muted-foreground md:text-right">
            <p>© {new Date().getFullYear()} {organization.name}</p>
            <p className="mt-0.5 text-xs">Powered by CertiVerify</p>
          </div>
        </div>
      </footer>
    </div>
  );
}