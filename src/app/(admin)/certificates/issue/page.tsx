"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, RefreshCw, UserPlus } from "lucide-react";
import Link from "next/link";
import { createCertificateSchema, type CreateCertificateFormData } from "@/features/certificates/schemas";
import { certificatesApi } from "@/features/certificates/api";
import { recipientsApi } from "@/features/recipients/api";
import type { Recipient } from "@/types/recipient";

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

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
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
  };

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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <h1 className="text-3xl font-bold text-foreground">Issue Certificate</h1>
          <p className="text-muted-foreground">Issue a new digital certificate</p>
        </div>
      </div>

      {recipientLoadError ? (
        <Card className="w-full max-w-3xl">
          <CardContent className="py-12 text-center">
            <p className="font-medium text-foreground">Recipients are unavailable</p>
            <p className="mt-2 text-sm text-muted-foreground">{recipientLoadError}</p>
            <Button className="mt-5" variant="outline" onClick={loadRecipients}>
              <RefreshCw className="mr-2 size-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : recipients.length === 0 ? (
        <Card className="w-full max-w-3xl">
          <CardContent className="py-12 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recipients Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to add recipients before you can issue certificates.
            </p>
            <Link href="/recipients/new" className={buttonVariants()}>
              <UserPlus className="mr-2 h-4 w-4" /> Add recipient
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
            <CardDescription>
              Fill in the certificate details. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient_id">Recipient *</Label>
                <Select
                  value={form.watch("recipient_id").toString()}
                  onValueChange={(value) => form.setValue("recipient_id", Number(value))}
                >
                  <SelectTrigger className="w-full">
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
                {form.formState.errors.recipient_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.recipient_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title *</Label>
                <Input
                  id="title"
                  placeholder="Certificate of Completion"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the program, achievement, or qualification."
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  {...form.register("issue_date")}
                />
                {form.formState.errors.issue_date && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.issue_date.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex-1"
                >
                  {form.formState.isSubmitting ? "Issuing..." : "Issue Certificate"}
                </Button>
                <Link href="/certificates" className={`${buttonVariants({ variant: "outline" })} flex-1`}>Cancel</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
