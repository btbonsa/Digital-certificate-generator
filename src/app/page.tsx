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
  CheckCircle2,
  Clock,
  FileText,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#verify", label: "Verify a certificate" },
];

const previewTabs = ["Certificate", "Recipients", "Verification"];

const features = [
  {
    title: "Easy certificate generation",
    description: "Create professional certificates in minutes with our intuitive interface.",
    icon: FileText,
    wide: true,
  },
  {
    title: "QR code verification",
    description: "Instant verification with a unique QR code on every certificate.",
    icon: QrCode,
    wide: false,
  },
  {
    title: "Recipient management",
    description: "Organize and manage all your certificate recipients in one place.",
    icon: Users,
    wide: false,
  },
  {
    title: "Secure certificate records",
    description: "Blockchain-backed records keep every certificate tamper-proof.",
    icon: ShieldCheck,
    wide: true,
  },
];

const steps = [
  {
    title: "Add your recipients",
    description: "Add people one by one or in bulk. Each recipient gets their own record.",
  },
  {
    title: "Issue the certificates",
    description: "Every certificate is issued with a unique code and a QR code.",
  },
  {
    title: "Anyone can verify",
    description: "Scan the QR code or enter the code on this page to confirm a certificate is real.",
  },
];

const recipients = [
  { initials: "JD", name: "Jane Doe", email: "jane@example.com", issued: true },
  { initials: "MK", name: "Michael Kim", email: "michael@example.com", issued: true },
  { initials: "SA", name: "Sofia Alvarez", email: "sofia@example.com", issued: false },
];

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleVerificationSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = verificationToken.trim();
    if (token) router.push(`/verify/${encodeURIComponent(token)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* One orchestrated moment: the seal stamps onto the certificate. */}
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

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">CertiVerify</span>
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
              Admin login
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
              Admin login
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-foreground/[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
            <div className="space-y-8">
              <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Certificates you can trust. Verification you can rely on.
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Issue professional digital certificates, manage recipients, and give every certificate a unique
                verification link and QR code.
              </p>

              <form id="verify" onSubmit={handleVerificationSearch} className="max-w-xl scroll-mt-24 space-y-2.5">
                <label htmlFor="verification-token" className="text-sm font-medium">
                  Verify a certificate
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
                  <Search className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="verification-token"
                    name="token"
                    autoComplete="off"
                    placeholder="Enter the verification code"
                    value={verificationToken}
                    onChange={(event) => setVerificationToken(event.target.value)}
                    className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                    required
                  />
                  <Button type="submit" size="lg" className="shrink-0 rounded-xl">
                    Verify
                    <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll find the code printed on the certificate, next to the QR code.
                </p>
              </form>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Unique code on every certificate", "QR code verification", "Tamper-proof records"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product preview */}
            <div className="mx-auto w-full max-w-xl">
              <div
                role="tablist"
                aria-label="Product previews"
                className="mb-4 inline-flex rounded-full border border-border bg-card p-1 shadow-sm"
              >
                {previewTabs.map((tab, index) => (
                  <button
                    key={tab}
                    id={`preview-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === index}
                    aria-controls="preview-panel"
                    onClick={() => setActiveTab(index)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      activeTab === index
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div
                id="preview-panel"
                role="tabpanel"
                aria-labelledby={`preview-tab-${activeTab}`}
                className="min-h-[400px]"
              >
                {activeTab === 0 && (
                  <div className="relative rounded-2xl border border-border bg-card p-2.5 shadow-xl shadow-foreground/5">
                    <div className="relative rounded-xl border border-border px-6 pb-12 pt-9 text-center sm:px-10">
                      <ShieldCheck className="mx-auto size-7 text-primary" aria-hidden="true" />
                      <p className="mt-3 text-sm tracking-wide text-muted-foreground">Certificate of completion</p>
                      <p className="mt-7 text-sm text-muted-foreground">This certifies that</p>
                      <p className="mt-2 border-b border-border pb-4 font-serif text-4xl italic">Jane Doe</p>
                      <p className="mt-5 text-sm text-muted-foreground">has successfully completed</p>
                      <p className="mt-1 text-lg font-semibold">Advanced Web Development</p>

                      <div className="mt-10 flex items-end justify-between text-left text-xs text-muted-foreground">
                        <div>
                          <p>Certificate no.</p>
                          <p className="mt-0.5 font-mono text-sm text-foreground">CERT-2024-001</p>
                        </div>
                        <QrCode className="size-12 text-foreground" aria-hidden="true" />
                      </div>

                      <span
                        className="cv-seal absolute -bottom-6 left-1/2 flex size-[76px] -translate-x-1/2 -rotate-12 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-lg"
                        aria-hidden="true"
                      >
                        <BadgeCheck className="size-9" />
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/5">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <p className="font-semibold">Recipients</p>
                      <p className="text-sm text-muted-foreground">24 ready for certificates</p>
                    </div>
                    <ul className="divide-y divide-border">
                      {recipients.map((person) => (
                        <li key={person.email} className="flex items-center gap-3 px-5 py-4">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {person.initials}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{person.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{person.email}</p>
                          </div>
                          {person.issued ? (
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              <CheckCircle2 className="size-3.5" aria-hidden="true" /> Issued
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              <Clock className="size-3.5" aria-hidden="true" /> Pending
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/5">
                    <div className="flex items-center gap-4 border-b border-border bg-emerald-50 px-6 py-5 dark:bg-emerald-950/30">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 className="size-7" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold">Certificate verified</p>
                        <p className="text-sm text-muted-foreground">
                          This certificate is authentic and matches the issuer&apos;s record.
                        </p>
                      </div>
                    </div>
                    <dl className="divide-y divide-border text-sm">
                      {[
                        ["Recipient", "Jane Doe"],
                        ["Course", "Advanced Web Development"],
                        ["Issued on", "12 March 2024"],
                        ["Code", "CV-2024-001-8F2A"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 px-6 py-3.5">
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className={`font-medium ${label === "Code" ? "font-mono" : ""}`}>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-t border-border bg-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to issue and verify certificates
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From the first recipient to the final check, every step lives in one place.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-3">
              {features.map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`bg-background p-8 sm:p-10 ${feature.wide ? "lg:col-span-2" : ""}`}
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FeatureIcon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-16 py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Three steps from a list of names to certificates anyone can check.
              </p>
            </div>

            <ol className="relative space-y-10 border-l border-border pl-10">
              {steps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[3.7rem] flex size-9 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 max-w-md text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-12 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to issue your first certificate?</h2>
              <p className="mt-2 text-primary-foreground/80">Sign in to the admin dashboard to add recipients and start issuing.</p>
            </div>
            <Link href="/login" className={`${buttonVariants({ variant: "secondary", size: "lg" })} shrink-0`}>
              Admin login
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-tight">CertiVerify</span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
            <Link href="#verify" className="transition-colors hover:text-foreground">Verify a certificate</Link>
            <Link href="/login" className="transition-colors hover:text-foreground">Admin login</Link>
          </nav>

          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CertiVerify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}