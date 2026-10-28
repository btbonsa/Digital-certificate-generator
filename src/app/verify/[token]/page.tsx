"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, XCircle, AlertCircle, Home, Loader2 } from "lucide-react";
import { verificationApi } from "@/features/verification/api";
import { ApiError } from "@/lib/api-client";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import type { CertificateVerification } from "@/types/certificate";

type VerificationState = "loading" | "valid" | "revoked" | "not_found" | "error";

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<VerificationState>("loading");
  const [data, setData] = useState<CertificateVerification | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = params.token as string;

    if (!token) {
      setState("not_found");
      setError("Invalid verification token");
      return;
    }

    verifyCertificate(token);
  }, [params.token]);

  const verifyCertificate = async (token: string) => {
    try {
      const result = await verificationApi.verify(token);
      setData(result);
      setState(result.is_valid ? "valid" : "revoked");
    } catch (error) {
      if (error instanceof Error) {
        if ((error instanceof ApiError && error.status === 404) || error.message.toLowerCase().includes("not found") || error.message.includes("404")) {
          setState("not_found");
          setError("Certificate not found");
        } else {
          setState("error");
          setError(error.message);
        }
      } else {
        setState("error");
        setError("An unexpected error occurred");
      }
    }
  };

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verifying certificate...</p>
          </div>
        );

      case "valid":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ShieldCheck className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-foreground">
                Certificate Verified
              </h1>
            </div>

            <StatusBadge status="valid" className="self-center" />

            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-2xl">{data?.certificate.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-semibold text-foreground">
                      {data?.recipient.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate Number</p>
                    <p className="font-semibold text-foreground">
                      {data?.certificate.certificate_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(data?.certificate.issue_date || "").toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status="valid" />
                  </div>
                </div>

                {data?.certificate.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{data.certificate.description}</p>
                  </div>
                )}

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    ✓ This certificate record exists and is currently valid. The verification confirms
                    the authenticity of the certificate issued by the organization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "revoked":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-foreground">
                Certificate Revoked
              </h1>
            </div>

            <StatusBadge status="revoked" className="self-center" />

            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-2xl">{data?.certificate.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-semibold text-foreground">
                      {data?.recipient.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate Number</p>
                    <p className="font-semibold text-foreground">
                      {data?.certificate.certificate_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(data?.certificate.issue_date || "").toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status="revoked" />
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    ⚠ This certificate has been revoked by the issuing organization and is no longer valid.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "not_found":
        return (
          <div className="text-center space-y-6 py-20">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Certificate Not Found
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                The certificate associated with this verification link could not be found. The link may be incorrect or the certificate record may not exist.
              </p>
            </div>
            <Button onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6 py-20">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Verification Error
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                {error || "An error occurred while verifying the certificate. Please try again later."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => verifyCertificate(params.token as string)}>Try again</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-background px-4 py-6 sm:px-6 sm:py-10">
      <header className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <ShieldCheck className="size-6 text-primary" /> CertiVerify
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-3xl">{renderContent()}</main>
    </div>
  );
}
