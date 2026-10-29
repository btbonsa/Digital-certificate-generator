"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Loader2, RefreshCw, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monogram } from "@/components/monogram";
import { createCertificateSchema, type CreateCertificateFormData } from "@/features/certificates/schemas";
import { certificatesApi } from "@/features/certificates/api";
import { recipientsApi } from "@/features/recipients/api";
import type { Recipient } from "@/types/recipient";
import { brass, organization } from "@/lib/organization";

function formatDate(value: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!dateOnly) return "—";
  const parsed = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function IssueCertificatePage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [recipientLoadError, setRecipientLoadError] = useState<string | null>(null);

  const form = useForm<CreateCertificateFormData>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      recipient_id: 0,
      title: "",
      description: "",
      issue_date: new Date().toISOString().split("T")[0],
    },
  });
  const errors = form.formState.errors;

  const watchedRecipientId = form.watch("recipient_id");
  const watchedTitle = form.watch("title");
  const watchedDate = form.watch("issue_date");
  const selectedRecipient = recipients.find((recipient) => recipient.id === watchedRecipientId);

  const loadRecipients = useCallback(async () => {
    setRecipientLoadError(null);
    setLoadingRecipients(true);
    try {
      const response = await recipientsApi.list();
      setRecipients(response.recipients);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load recipients";
      setRecipientLoadError(message);
      toast.error(message);
    } finally {
      setLoadingRecipients(false);
    }
  }, []);

  useEffect(() => {
    void loadRecipients();
  }, [loadRecipients]);

  const onSubmit = async (data: CreateCertificateFormData) => {
    try {
      const certificate = await certificatesApi.create(data);
      toast.success(`Certificate ${certificate.certificate_number} issued successfully`);
      router.push(`/certificates/${certificate.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to issue certificate");
    }
  };

  if (loadingRecipients) {
    return (
      <div className="space-y-6" aria-label="Loading form" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="size-9 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-96 max-w-3xl animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Issue certificate</h1>
          <p className="mt-1 text-sm text-muted-foreground">Issue a new digital certificate. Fields marked * are required.</p>
        </div>
      </div>

      {recipientLoadError ? (
        <Card className="w-full max-w-3xl">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <p className="font-serif text-xl font-medium text-foreground">Recipients are unavailable</p>
            <p className="mt-2 text-sm text-muted-foreground">{recipientLoadError}</p>
            <Button className="mt-5" variant="outline" onClick={() => void loadRecipients()}>
              <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : recipients.length === 0 ? (
        <Card className="w-full max-w-3xl">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <span
              className="mb-4 flex size-12 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: brass }}
              aria-hidden="true"
            >
              <UserPlus className="size-6" />
            </span>
            <p className="font-serif text-xl font-medium text-foreground">No recipients found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You need to add recipients before you can issue certificates.
            </p>
            <Link href="/recipients/new" className={`${buttonVariants()} mt-5`}>
              <UserPlus className="mr-2 size-4" aria-hidden="true" /> Add recipient
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="font-serif text-xl font-medium tracking-tight">Certificate details</CardTitle>
              <CardDescription className="mt-1">
                The recipient, title and date appear on the PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="recipient_id">
                    Recipient{" "}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Select
                    value={watchedRecipientId ? watchedRecipientId.toString() : ""}
                    onValueChange={(value) =>
                      form.setValue("recipient_id", Number(value), { shouldValidate: form.formState.isSubmitted })
                    }
                  >
                    <SelectTrigger id="recipient_id" className="h-10 w-full" aria-invalid={!!errors.recipient_id}>
                      <SelectValue placeholder="Select a recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id.toString()}>
                          {recipient.full_name}
                          {recipient.email && ` (${recipient.email})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.recipient_id && <p className="text-sm text-destructive">{errors.recipient_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Certificate title{" "}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Certificate of Completion"
                    aria-invalid={!!errors.title}
                    {...form.register("title")}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe the program, achievement, or qualification."
                    className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...form.register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue_date">
                    Issue date{" "}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </Label>
                  <Input id="issue_date" type="date" aria-invalid={!!errors.issue_date} {...form.register("issue_date")} />
                  {errors.issue_date && <p className="text-sm text-destructive">{errors.issue_date.message}</p>}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                  <Link href="/certificates" className={buttonVariants({ variant: "outline" })}>
                    Cancel
                  </Link>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    {form.formState.isSubmitting ? "Issuing…" : "Issue certificate"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live preview */}
          <div className="hidden xl:sticky xl:top-6 xl:block" aria-hidden="true">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>
            <div className="rounded-2xl border border-border bg-card p-2.5 shadow-xl shadow-foreground/5">
              <div
                className="relative rounded-xl border px-6 pb-12 pt-7 text-center"
                style={{ borderColor: `color-mix(in srgb, ${brass} 45%, transparent)` }}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <Monogram className="size-7 text-[10px]" />
                  <p className="text-sm font-semibold tracking-tight">{organization.name}</p>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {watchedTitle.trim() || "Certificate title"}
                </p>
                <p className="mt-5 text-sm text-muted-foreground">This certifies that</p>
                <p className="mt-2 border-b border-border pb-3 font-serif text-3xl font-medium italic">
                  {selectedRecipient?.full_name || "Recipient name"}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">Issued on {formatDate(watchedDate)}</p>

                <span
                  className="absolute -bottom-6 left-1/2 flex size-14 -translate-x-1/2 -rotate-12 items-center justify-center rounded-full border-4 border-card text-white shadow-lg"
                  style={{ backgroundColor: brass }}
                >
                  <BadgeCheck className="size-7" />
                </span>
              </div>
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              A simplified preview. The PDF includes the certificate number and QR code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}