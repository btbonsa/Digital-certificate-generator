"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ArrowLeft, Download, Copy, QrCode, Loader2, FileText, User, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { certificatesApi } from "@/features/certificates/api";
import type { Certificate } from "@/types/certificate";

export default function CertificateDetailPage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadCertificate();
  }, [params.id]);

  const loadCertificate = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const id = Number(params.id);
      if (!Number.isInteger(id) || id < 1) throw new Error("Invalid record ID");
      const data = await certificatesApi.get(id);
      setCertificate(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load certificate";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

    const verificationUrl = `${window.location.origin}/verify/${certificate.verification_token}`;
    if (!navigator.clipboard) {
      toast.error("Clipboard access is unavailable in this browser");
      return;
    }
    void navigator.clipboard.writeText(verificationUrl).then(() => toast.success("Verification link copied to clipboard")).catch(() => toast.error("Could not copy the verification link"));
  };

  const getVerificationUrl = () => {
    if (!certificate) return "";
    return `${window.location.origin}/verify/${certificate.verification_token}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div role="alert" className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Could not load certificate details</h1>
        <p className="mt-2 text-sm text-muted-foreground">{loadError || "The record may no longer be available."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={loadCertificate}>Try again</Button>
          <Link href="/certificates" className={buttonVariants()}>Back to certificates</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/certificates" aria-label="Back to certificates" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificate Details</h1>
          <p className="text-muted-foreground">View certificate information and download PDF</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Certificate Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{certificate.title}</span>
              <StatusBadge status={certificate.status} />
            </CardTitle>
            <CardDescription>
              Certificate number: {certificate.certificate_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                  <p className="font-medium">{certificate.recipient_name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={certificate.status} />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(certificate.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {certificate.description && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{certificate.description}</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <div className="flex gap-4">
                <Button onClick={handleDownloadPdf} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handleCopyVerificationLink} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Verification Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>
              Public verification information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <QrCode className="h-24 w-24 text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Scan to verify certificate
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Verification URL</p>
              <div className="bg-muted p-3 rounded-md text-xs break-all">
                {getVerificationUrl()}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link href={getVerificationUrl()} target="_blank" rel="noopener noreferrer" className={`${buttonVariants({ variant: "outline" })} w-full`}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Open verification page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
