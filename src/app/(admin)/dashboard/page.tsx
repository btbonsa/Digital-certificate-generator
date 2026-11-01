"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  FileCheck2,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { dashboardApi, type DashboardData } from "@/features/dashboard/api";
import { brass, organization } from "@/lib/organization";

const numberFormatter = new Intl.NumberFormat();

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "—"
    : parsedDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getStatus(status: string): "valid" | "revoked" | "unknown" {
  if (status === "valid") return "valid";
  if (status === "revoked") return "revoked";
  return "unknown";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const quickActions = [
  { href: "/recipients/new", title: "Add recipient", description: "Register a new learner", icon: Users },
  { href: "/certificates/issue", title: "Issue certificate", description: "Create a verifiable record", icon: FileCheck2 },
  { href: "/", title: "Public verification", description: "Open the public certificate page", icon: ShieldCheck },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const result = await dashboardApi.getData();
        if (active) setData(result);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Could not load dashboard data.";
        if (active) {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const refreshDashboard = useCallback(() => {
    setError(null);
    setRefreshing(true);
    setReloadKey((key) => key + 1);
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-8" aria-label="Loading dashboard" aria-busy="true">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="hidden h-9 w-48 animate-pulse rounded-md bg-muted sm:block" />
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
          <div className="h-96 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
          <div className="h-96 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <XCircle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-medium tracking-tight">Dashboard couldn&apos;t load</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {error || "We couldn’t reach the dashboard service. Check your connection and try again."}
        </p>
        <Button className="mt-6" onClick={refreshDashboard}>
          <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Try again
        </Button>
      </div>
    );
  }

  const { total_recipients, total_certificates, valid_certificates, revoked_certificates } = data.stats;

  const stats = [
    {
      label: "Recipients",
      value: total_recipients,
      icon: Users,
      note: "Registered people",
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Certificates",
      value: total_certificates,
      icon: FileText,
      note: "Issued records",
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Valid",
      value: valid_certificates,
      icon: BadgeCheck,
      note: "Currently verifiable",
      tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    {
      label: "Revoked",
      value: revoked_certificates,
      icon: XCircle,
      note: "No longer valid",
      tone: "bg-destructive/10 text-destructive",
    },
  ];

  const recentCertificates = data.recent_certificates ?? [];
  const validShare = total_certificates > 0 ? (valid_certificates / total_certificates) * 100 : 0;
  const revokedShare = total_certificates > 0 ? (revoked_certificates / total_certificates) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: brass }} aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Monitor recipients and certificate activity at {organization.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refreshDashboard} disabled={refreshing}>
            <RefreshCw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh
          </Button>
          <Link href="/certificates/issue" className={buttonVariants()}>
            <Plus className="mr-2 size-4" aria-hidden="true" /> Issue certificate
          </Link>
        </div>
      </section>

      {error && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-foreground">
            Dashboard refresh failed: <span className="text-muted-foreground">{error}</span>
          </p>
          <Button type="button" variant="outline" size="sm" onClick={refreshDashboard}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats: one connected strip instead of four separate cards */}
<section
  aria-label="Certificate statistics"
  className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
>
  {stats.map(({ label, value, icon: Icon, note, tone }) => (
    <div
      key={label}
      className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-3 font-serif text-4xl font-medium tracking-tight tabular-nums text-foreground sm:text-5xl">
          {numberFormatter.format(value)}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
      </div>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </div>
  ))}
</section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border/70 pb-4">
            <div>
              <CardTitle className="font-serif text-xl font-medium tracking-tight">Recent certificates</CardTitle>
              <CardDescription className="mt-1">The latest credentials issued by {organization.name}.</CardDescription>
            </div>
            <Link
              href="/certificates"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              View all <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentCertificates.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <span
                  className="mb-4 flex size-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brass }}
                  aria-hidden="true"
                >
                  <FileCheck2 className="size-6" />
                </span>
                <p className="font-serif text-xl font-medium">No certificates yet</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Issued certificates will appear here. Start by creating one for a registered recipient.
                </p>
                <Link
                  href="/certificates/issue"
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-5`}
                >
                  <Plus className="mr-2 size-4" aria-hidden="true" /> Issue first certificate
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border/70">
                {recentCertificates.slice(0, 6).map((certificate) => (
                  <li key={certificate.id}>
                    <Link
                      href={`/certificates/${certificate.id}`}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(certificate.recipient_name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{certificate.title}</p>
                          <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
                            <span className="truncate">{certificate.recipient_name}</span>
                            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                              {certificate.certificate_number}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pl-[3.375rem] sm:justify-end sm:pl-0">
                        <span className="text-xs text-muted-foreground">{formatDate(certificate.issue_date)}</span>
                        <StatusBadge status={getStatus(certificate.status)} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Share of valid vs revoked certificates */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-medium tracking-tight">Certificate health</CardTitle>
              <CardDescription className="mt-1">
                {total_certificates === 0
                  ? "Nothing to measure yet."
                  : `${Math.round(validShare)}% of issued certificates are currently valid.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                role="img"
                aria-label={`${valid_certificates} valid and ${revoked_certificates} revoked out of ${total_certificates} certificates`}
                className="flex h-2.5 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full bg-emerald-500" style={{ width: `${validShare}%` }} />
                <div className="h-full bg-destructive" style={{ width: `${revokedShare}%` }} />
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> Valid
                  </dt>
                  <dd className="font-medium tabular-nums">{numberFormatter.format(valid_certificates)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-destructive" aria-hidden="true" /> Revoked
                  </dt>
                  <dd className="font-medium tabular-nums">{numberFormatter.format(revoked_certificates)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="font-serif text-xl font-medium tracking-tight">Quick actions</CardTitle>
              <CardDescription className="mt-1">Common tasks for your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ul>
                {quickActions.map(({ href, title, description, icon: Icon }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{title}</span>
                          <span className="block truncate text-xs text-muted-foreground">{description}</span>
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}