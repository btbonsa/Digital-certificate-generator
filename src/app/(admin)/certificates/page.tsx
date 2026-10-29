"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Plus,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { certificatesApi } from "@/features/certificates/api";
import type { Certificate } from "@/types/certificate";
import { brass } from "@/lib/organization";
import { toast } from "sonner";

const PAGE_SIZE = 20;

function formatDate(value: string) {
  // Date-only strings (YYYY-MM-DD) are read as local dates so they never shift a day.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // The search that is actually applied to the list. Pagination uses this, not the text being typed.
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searching, setSearching] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const loadCertificates = useCallback(async (search?: string, status?: string, requestedPage = 1) => {
    try {
      const response = await certificatesApi.list(search, status, requestedPage, PAGE_SIZE);
      setCertificates(response.certificates);
      setPage(response.page);
      setTotal(response.total);
      setLimit(response.limit || PAGE_SIZE);
      setLoadError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load certificates";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  const runLoad = (search: string, status: string, requestedPage: number) => {
    setSearching(true);
    setLoadError(null);
    void loadCertificates(search || undefined, status === "all" ? undefined : status, requestedPage);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setAppliedSearch(query);
    setPage(1);
    runLoad(query, statusFilter, 1);
  };

  const handleStatusFilter = (value: string | null) => {
    const status = value || "all";
    setStatusFilter(status);
    setPage(1);
    runLoad(appliedSearch, status, 1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setAppliedSearch("");
    setStatusFilter("all");
    setPage(1);
    runLoad("", "all", 1);
  };

  const handleDownloadPdf = async (id: number, certificateNumber: string) => {
    try {
      const blob = await certificatesApi.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certificateNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      document.body.removeChild(a);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download PDF");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isFiltered = appliedSearch.length > 0 || statusFilter !== "all";

  if (loading) {
    return (
      <div className="space-y-8" aria-label="Loading certificates" aria-busy="true">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-60 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="h-16 animate-pulse border-b border-border bg-muted/40" />
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-0">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: brass }} aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Certificates</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage issued certificates
            {total > 0 && <span> ({total.toLocaleString()} total)</span>}.
          </p>
        </div>
        <Link href="/certificates/issue" className={buttonVariants()}>
          <Plus className="mr-2 size-4" aria-hidden="true" /> Issue certificate
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <form
            onSubmit={handleSearch}
            role="search"
            className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label="Search certificates"
                placeholder="Search by number, title, or recipient"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-[180px]" aria-label="Filter by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="submit" disabled={searching} className="flex-1 sm:flex-none">
                {searching ? (
                  <RefreshCw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="mr-2 size-4" aria-hidden="true" />
                )}
                Search
              </Button>
              {(isFiltered || searchQuery) && (
                <Button type="button" variant="outline" onClick={handleReset} disabled={searching}>
                  <X className="mr-2 size-4" aria-hidden="true" /> Clear
                </Button>
              )}
            </div>
          </form>

          {certificates.length === 0 && loadError ? (
            <div role="alert" className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <XCircle className="size-6" aria-hidden="true" />
              </span>
              <p className="font-serif text-xl font-medium text-foreground">Could not load certificates</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button className="mt-5" variant="outline" onClick={() => runLoad(appliedSearch, statusFilter, page)}>
                <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Try again
              </Button>
            </div>
          ) : certificates.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              {isFiltered ? (
                <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="size-6" aria-hidden="true" />
                </span>
              ) : (
                <span
                  className="mb-4 flex size-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brass }}
                  aria-hidden="true"
                >
                  <FileText className="size-6" />
                </span>
              )}
              <p className="font-serif text-xl font-medium text-foreground">
                {isFiltered ? "No certificates found" : "No certificates yet"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {isFiltered
                  ? "Nothing matches your search or filter. Check the spelling or clear the filters."
                  : "Issued certificates will appear here. Start by creating one for a registered recipient."}
              </p>
              {isFiltered ? (
                <Button className="mt-5" variant="outline" onClick={handleReset}>
                  <X className="mr-2 size-4" aria-hidden="true" /> Clear filters
                </Button>
              ) : (
                <Link href="/certificates/issue" className={`${buttonVariants()} mt-5`}>
                  <Plus className="mr-2 size-4" aria-hidden="true" /> Issue first certificate
                </Link>
              )}
            </div>
          ) : (
            <>
              {loadError && (
                <p
                  role="status"
                  className="mx-4 mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-muted-foreground"
                >
                  Refresh failed: {loadError}
                </p>
              )}

              <div aria-busy={searching} className={searching ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider">Number</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Certificate</TableHead>
                      <TableHead className="hidden text-xs font-semibold uppercase tracking-wider lg:table-cell">
                        Issued
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="pr-5 text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((certificate) => (
                      <TableRow key={certificate.id}>
                        <TableCell className="pl-5">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                            {certificate.certificate_number}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/certificates/${certificate.id}`}
                            className="block truncate font-medium text-foreground hover:underline"
                          >
                            {certificate.title}
                          </Link>
                          <p className="truncate text-xs text-muted-foreground">
                            {certificate.recipient_name || "Unknown recipient"}
                          </p>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                          {formatDate(certificate.issue_date)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={certificate.status} />
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <div className="flex justify-end gap-1">
                            <Link
                              href={`/certificates/${certificate.id}`}
                              aria-label={`View certificate ${certificate.certificate_number}`}
                              className={buttonVariants({ variant: "ghost", size: "icon" })}
                            >
                              <Eye className="size-4" aria-hidden="true" />
                            </Link>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Download certificate ${certificate.certificate_number}`}
                              onClick={() => handleDownloadPdf(certificate.id, certificate.certificate_number)}
                            >
                              <Download className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {total > limit && (
                <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}{" "}
                    certificates
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={searching || page <= 1}
                      onClick={() => runLoad(appliedSearch, statusFilter, page - 1)}
                    >
                      <ChevronLeft className="mr-1 size-4" aria-hidden="true" /> Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={searching || page * limit >= total}
                      onClick={() => runLoad(appliedSearch, statusFilter, page + 1)}
                    >
                      Next <ChevronRight className="ml-1 size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}