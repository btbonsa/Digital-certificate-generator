"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Calendar, Copy, Download, ExternalLink, QrCode, User, XCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { certificatesApi } from "@/features/certificates/api";
import type { Certificate } from "@/types/certificate";
import { brass, organization } from "@/lib/organization";

function formatDate(value: string) {
  // Date-only strings (YYYY-MM-DD) are read as local dates so they never shift a day.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function CertificateDetailPage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const loadCertificate = useCallback(async () => {
    setLoadError(null);
    try {
      const id = Number(params.id);
      if (!Number.isInteger(id) || id < 1) throw new Error("Invalid record ID");
      const data = await certificatesApi.get(id);
      if (isMounted.current) {
        setCertificate(data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load certificate";
      if (isMounted.current) {
        setLoadError(message);
        toast.error(message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [params.id]);

  useEffect(() => {
    void loadCertificate();
    return () => {
      isMounted.current = false;
    };
  }, [loadCertificate]);

  const getVerificationUrl = () => {
    if (!certificate) return "";
    return `${window.location.origin}/verify/${certificate.verification_token}`;
  };

  const handleDownloadPdf = async () => {
    if (!certificate) return;

    try {
      const blob = await certificatesApi.downloadPdf(certificate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certificate.certificate_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      document.body.removeChild(a);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download PDF");
    }
  };

  const handleCopyVerificationLink = () => {
    if (!certificate) return;

    if (!navigator.clipboard) {
      toast.error("Clipboard access is unavailable in this browser");
      return;
    }
    void navigator.clipboard
      .writeText(getVerificationUrl())
      .then(() => toast.success("Verification link copied to clipboard"))
      .catch(() => toast.error("Could not copy the verification link"));
  };

  if (loading) {
    return (
      <div className="space-y-6" aria-label="Loading certificate" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="size-9 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="h-96 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
          <div className="h-96 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div role="alert" className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <XCircle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-medium tracking-tight">Could not load certificate details</h1>
        <p className="mt-2 text-sm text-muted-foreground">{loadError || "The record may no longer be available."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => void loadCertificate()}>
            Try again
          </Button>
          <Link href="/certificates" className={buttonVariants()}>
            Back to certificates
          </Link>
        </div>
      </div>
    );
  }

  const verificationUrl = getVerificationUrl();

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <Link
          href="/certificates"
          aria-label="Back to certificates"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Certificate details</h1>
          <p className="mt-1 text-sm text-muted-foreground">View certificate information and download the PDF.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Certificate information */}
        <Card>
          <CardHeader className="border-b border-border/70 pb-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="block h-0.5 w-8 rounded-full" style={{ backgroundColor: brass }} aria-hidden="true" />
                <CardTitle className="mt-3 font-serif text-2xl font-medium tracking-tight sm:text-3xl">
                  {certificate.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  Certificate no.{" "}
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                    {certificate.certificate_number}
                  </span>
                </CardDescription>
              </div>
              <StatusBadge status={certificate.status} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recipient</dt>
                  <dd className="mt-1 font-medium">{certificate.recipient_name || "Unknown"}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issue date</dt>
                  <dd className="mt-1 font-medium">{formatDate(certificate.issue_date)}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issued by</dt>
                  <dd className="mt-1 font-medium">{organization.name}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</dt>
                  <dd className="mt-1 font-medium">{formatDate(certificate.created_at)}</dd>
                </div>
              </div>
            </dl>

            {certificate.description && (
              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</p>
                <p className="mt-2 leading-relaxed text-foreground">{certificate.description}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
              <Button onClick={handleDownloadPdf} className="flex-1">
                <Download className="mr-2 size-4" aria-hidden="true" /> Download PDF
              </Button>
              <Button variant="outline" onClick={handleCopyVerificationLink} className="flex-1">
                <Copy className="mr-2 size-4" aria-hidden="true" /> Copy verification link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification */}
        <Card className="self-start">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="font-serif text-xl font-medium tracking-tight">Verification</CardTitle>
            <CardDescription className="mt-1">Public verification information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="text-center">
              <div
                className="mx-auto flex size-32 items-center justify-center rounded-xl border bg-card"
                style={{ borderColor: `color-mix(in srgb, ${brass} 45%, transparent)` }}
              >
                <QrCode className="size-20 text-foreground" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">The QR code on the PDF opens this link.</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification URL</p>
              <div className="break-all rounded-lg bg-muted p-3 font-mono text-xs">{verificationUrl}</div>
            </div>

            <Link
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({ variant: "outline" })} w-full`}
            >
              <ExternalLink className="mr-2 size-4" aria-hidden="true" /> Open verification page
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}