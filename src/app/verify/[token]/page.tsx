"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Ban,
  Home,
  LoaderCircle,
  RefreshCw,
  Search,
  SearchX,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Monogram } from "@/components/monogram";
import { verificationApi } from "@/features/verification/api";
import { ApiError } from "@/lib/api-client";
import { brass, organization } from "@/lib/organization";
import type { CertificateVerification } from "@/types/certificate";

type VerificationState = "loading" | "valid" | "revoked" | "not_found" | "error";

function formatDate(value?: string | null) {
  if (!value) return "—";
  // Date-only strings (YYYY-MM-DD) are read as local dates so they never shift a day.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function CertificateRecord({ data, revoked }: { data: CertificateVerification; revoked: boolean }) {
  const { certificate, recipient } = data;

  return (
    <div className="relative rounded-2xl border border-border bg-card p-2.5 shadow-xl shadow-foreground/5">
      <div
        className="relative rounded-xl border px-6 pb-14 pt-8 text-center sm:px-10"
        style={{ borderColor: `color-mix(in srgb, ${revoked ? "var(--destructive)" : brass} 45%, transparent)` }}
      >
        <div className="flex items-center justify-center gap-2.5">
          <Monogram className="size-8 text-xs" />
          <p className="text-sm font-semibold tracking-tight">{organization.name}</p>
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {certificate.title}
        </p>
        <p className="mt-6 text-sm text-muted-foreground">This certifies that</p>
        <p
          className={`mt-2 border-b border-border pb-4 font-serif text-4xl font-medium italic sm:text-5xl ${
            revoked ? "text-muted-foreground line-through decoration-destructive/60" : ""
          }`}
        >
          {recipient.full_name}
        </p>

        {certificate.description && (
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {certificate.description}
          </p>
        )}

        <dl className="mt-8 grid gap-5 text-left sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Certificate no.</dt>
            <dd className="mt-1.5 break-all font-mono text-sm">{certificate.certificate_number}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issued on</dt>
            <dd className="mt-1.5 text-sm font-medium">{formatDate(certificate.issue_date)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</dt>
            <dd className="mt-1.5">
              <StatusBadge status={revoked ? "revoked" : "valid"} />
            </dd>
          </div>
        </dl>

        {!revoked && (
          <span
            className="cv-seal absolute -bottom-7 left-1/2 flex size-[76px] -translate-x-1/2 -rotate-12 items-center justify-center rounded-full border-4 border-card text-white shadow-lg"
            style={{ backgroundColor: brass }}
            aria-hidden="true"
          >
            <BadgeCheck className="size-9" />
          </span>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<VerificationState>("loading");
  const [data, setData] = useState<CertificateVerification | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [otherCode, setOtherCode] = useState("");

  useEffect(() => {
    let active = true;
    const rawToken = params.token;
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

    if (!token) {
      if (active) {
        setState("not_found");
        setError("Invalid verification token");
      }
      return;
    }

    const verifyCertificate = async () => {
      if (active) {
        setState("loading");
        setError("");
      }
      try {
        const result = await verificationApi.verify(token);
        if (!active) return;
        setData(result);
        setState(result.is_valid ? "valid" : "revoked");
      } catch (requestError) {
        if (!active) return;
        if (requestError instanceof Error) {
          const isNotFound =
            (requestError instanceof ApiError && requestError.status === 404) ||
            requestError.message.toLowerCase().includes("not found") ||
            requestError.message.includes("404");
          if (isNotFound) {
            setState("not_found");
            setError("Certificate not found");
          } else {
            setState("error");
            setError(requestError.message);
          }
        } else {
          setState("error");
          setError("An unexpected error occurred");
        }
      }
    };

    void verifyCertificate();
    return () => {
      active = false;
    };
  }, [params.token, reloadKey]);

  const handleTryAnotherCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = otherCode.trim();
    if (code) router.push(`/verify/${encodeURIComponent(code)}`);
  };

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <div role="status" className="flex flex-col items-center py-24 text-center">
            <Monogram className="size-14 text-lg shadow-lg shadow-primary/20" />
            <p className="mt-6 font-serif text-2xl font-medium tracking-tight">Checking the records</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Verifying certificate…
            </p>
          </div>
        );

      case "valid":
        return (
          <div className="space-y-8">
            <div
              role="status"
              className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <BadgeCheck className="size-7" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Certificate verified</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This certificate was issued by {organization.name} and is currently valid.
                </p>
              </div>
            </div>

            {data && <CertificateRecord data={data} revoked={false} />}

            <p className="pt-4 text-center text-sm text-muted-foreground">
              Checked against {organization.name}&apos;s records just now. If something looks wrong,{" "}
              <a
                href={`mailto:${organization.contactEmail}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                contact the certificate office
              </a>
              .
            </p>
          </div>
        );

      case "revoked":
        return (
          <div className="space-y-8">
            <div
              role="alert"
              className="flex items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
                <Ban className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Certificate revoked</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {organization.name} has withdrawn this certificate. It should not be accepted.
                </p>
              </div>
            </div>

            {data && <CertificateRecord data={data} revoked />}

            <p className="text-center text-sm text-muted-foreground">
              Questions about this result? Contact{" "}
              <a
                href={`mailto:${organization.contactEmail}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {organization.contactEmail}
              </a>
              .
            </p>
          </div>
        );

      case "not_found":
        return (
          <div role="alert" className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Certificate not found</h1>
            <p className="mt-3 text-muted-foreground">
              No certificate matches this link or code. Check it for typing mistakes, or try entering the code
              printed on the certificate.
            </p>

            <form onSubmit={handleTryAnotherCode} className="mt-8 w-full">
              <label htmlFor="other-code" className="sr-only">
                Verification code
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
                <Search className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="other-code"
                  autoComplete="off"
                  placeholder="Enter another code"
                  value={otherCode}
                  onChange={(event) => setOtherCode(event.target.value)}
                  className="h-11 border-0 bg-transparent px-1 font-mono tracking-wide shadow-none focus-visible:ring-0"
                  required
                />
                <Button type="submit" size="lg" className="shrink-0 rounded-xl">
                  Verify
                  <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                </Button>
              </div>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              Still stuck? Email{" "}
              <a
                href={`mailto:${organization.contactEmail}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {organization.contactEmail}
              </a>
              .
            </p>
          </div>
        );

      case "error":
        return (
          <div role="alert" className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <AlertCircle className="size-7" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Verification error</h1>
            <p className="mt-3 text-muted-foreground">
              {error || "An error occurred while verifying the certificate. Please try again later."}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setReloadKey((key) => key + 1)}>
                <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Try again
              </Button>
              <Link href="/" className={buttonVariants({ variant: "outline" })}>
                <Home className="mr-2 size-4" aria-hidden="true" /> Return to home
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <style>{`
        @keyframes cv-stamp {
          0% { opacity: 0; transform: scale(1.9) rotate(-26deg); }
          60% { opacity: 1; transform: scale(0.94) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .cv-seal { animation: cv-stamp 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) 300ms both; }
        }
      `}</style>

      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-4xl px-4 py-2 text-center text-sm sm:px-6">
          Official certificate verification of {organization.name}
        </p>
      </div>

      <header className="border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Monogram />
            <span className="leading-tight">
              <span className="block text-base font-semibold tracking-tight">{organization.name}</span>
              <span className="block text-xs text-muted-foreground">Certificate portal</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{renderContent()}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Link href="/" className="transition-colors hover:text-foreground">
            Verify another certificate
          </Link>
          <p className="text-xs">Powered by CertiVerify</p>
        </div>
      </footer>
    </div>
  );
}