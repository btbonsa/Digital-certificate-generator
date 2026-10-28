"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus, Search, RefreshCw, Loader2, FileText, Download, Eye } from "lucide-react";
import { certificatesApi } from "@/features/certificates/api";
import type { Certificate } from "@/types/certificate";
import { toast } from "sonner";

const PAGE_SIZE = 20;

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searching, setSearching] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setLoadError(null);
    setSearching(true);
    void loadCertificates(searchQuery || undefined, statusFilter === "all" ? undefined : statusFilter, 1);
  };

  const handleStatusFilter = (value: string | null) => {
    const status = value || "all";
    setStatusFilter(status);
    setPage(1);
    setLoadError(null);
    setSearching(true);
    void loadCertificates(searchQuery || undefined, status === "all" ? undefined : status, 1);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground">Manage issued certificates</p>
        </div>
        <Button onClick={() => router.push("/certificates/issue")}>
          <Plus className="mr-2 h-4 w-4" />
          Issue Certificate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="min-w-0 flex-1">
              <Input
                placeholder="Search by number, title, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={searching} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPage(1);
                setLoadError(null);
                setSearching(true);
                void loadCertificates(undefined, undefined, 1);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </form>

          {certificates.length === 0 && loadError ? (
            <div role="alert" className="mx-auto max-w-lg py-12 text-center">
              <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">Could not load certificates</p>
              <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
              <Button className="mt-5" variant="outline" onClick={() => { setLoadError(null); setSearching(true); void loadCertificates(searchQuery || undefined, statusFilter === "all" ? undefined : statusFilter, page); }}>
                <RefreshCw className="mr-2 h-4 w-4" /> Try again
              </Button>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No certificates found"
                  : "No certificates issued yet"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={() => router.push("/certificates/issue")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Issue First Certificate
                </Button>
              )}
            </div>
          ) : (
            <>
              {loadError && <p role="status" className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-muted-foreground">Refresh failed: {loadError}</p>}
              <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-medium">
                        {certificate.certificate_number}
                      </TableCell>
                      <TableCell>{certificate.title}</TableCell>
                      <TableCell>{certificate.recipient_name || "-"}</TableCell>
                      <TableCell>
                        {new Date(certificate.issue_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={certificate.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`View certificate ${certificate.certificate_number}`}
                            onClick={() => router.push(`/certificates/${certificate.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Download certificate ${certificate.certificate_number}`}
                            onClick={() =>
                              handleDownloadPdf(certificate.id, certificate.certificate_number)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              {total > limit && (
                <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} certificates</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" disabled={searching || page <= 1} onClick={() => { setSearching(true); setLoadError(null); void loadCertificates(searchQuery || undefined, statusFilter === "all" ? undefined : statusFilter, page - 1); }}>Previous</Button>
                    <Button type="button" variant="outline" size="sm" disabled={searching || page * limit >= total} onClick={() => { setSearching(true); setLoadError(null); void loadCertificates(searchQuery || undefined, statusFilter === "all" ? undefined : statusFilter, page + 1); }}>Next</Button>
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
