"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Calendar, FileCheck2, Loader2, Mail, Pencil, Phone, XCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateRecipientSchema, type UpdateRecipientFormData } from "@/features/recipients/schemas";
import { recipientsApi } from "@/features/recipients/api";
import type { Recipient } from "@/types/recipient";

function formatDate(value?: string | null) {
  if (!value) return null;
  // Date-only strings (YYYY-MM-DD) are read as local dates so they never shift a day.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={`mt-1 font-medium ${value ? "" : "text-muted-foreground"}`}>{value || "Not provided"}</dd>
    </div>
  );
}

export default function RecipientDetailPage() {
  const params = useParams();
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateRecipientFormData>({
    resolver: zodResolver(updateRecipientSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      profile_image_url: "",
    },
  });
  const { reset } = form;
  const errors = form.formState.errors;

  const loadRecipient = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      setLoadError(null);
      try {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id < 1) throw new Error("Invalid record ID");
        const data = await recipientsApi.get(id);
        setRecipient(data);
        reset({
          full_name: data.full_name,
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          profile_image_url: data.profile_image_url || "",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load recipient";
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [params.id, reset],
  );

  useEffect(() => {
    void loadRecipient();
  }, [loadRecipient]);

  const onSubmit = async (data: UpdateRecipientFormData) => {
    try {
      const id = Number(params.id);
      const cleanedData = {
        ...data,
        full_name: data.full_name?.trim(),
        email: data.email || undefined,
        phone: data.phone || undefined,
        date_of_birth: data.date_of_birth || undefined,
        profile_image_url: data.profile_image_url || undefined,
      };

      await recipientsApi.update(id, cleanedData);
      toast.success("Recipient updated successfully");
      setIsEditing(false);
      void loadRecipient(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update recipient");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" aria-label="Loading recipient" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="size-9 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10" />
          <div className="h-80 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!recipient) {
    return (
      <div role="alert" className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <XCircle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Could not load recipient details</h1>
        <p className="mt-2 text-sm text-muted-foreground">{loadError || "The record may no longer be available."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => void loadRecipient()}>
            Try again
          </Button>
          <Link href="/recipients" className={buttonVariants()}>
            Back to recipients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <Link
          href="/recipients"
          aria-label="Back to recipients"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Recipient details</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and manage recipient information.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Profile */}
        <Card className="self-start">
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-24 ring-4 ring-primary/10">
                {recipient.profile_image_url && (
                  <AvatarImage src={recipient.profile_image_url} alt={`${recipient.full_name} profile photo`} />
                )}
                <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                  {getInitials(recipient.full_name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{recipient.full_name}</h2>
              {recipient.email && <p className="mt-1 break-all text-sm text-muted-foreground">{recipient.email}</p>}
            </div>

            <Link
              href="/certificates/issue"
              className={`${buttonVariants({ variant: "default" })} w-full`}
            >
              <FileCheck2 className="mr-2 size-4" aria-hidden="true" /> Issue certificate
            </Link>

            <dl className="space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium">{formatDate(recipient.created_at) ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="font-medium">{formatDate(recipient.updated_at) ?? "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Contact information */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border/70 pb-4">
            <div>
              <CardTitle>Contact information</CardTitle>
              <CardDescription className="mt-1">
                {isEditing ? "Update recipient information." : "Recipient contact details."}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 size-4" aria-hidden="true" /> Edit
              </Button>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            {isEditing ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Field id="full_name" label="Full name" error={errors.full_name?.message}>
                  <Input
                    id="full_name"
                    autoComplete="name"
                    aria-invalid={!!errors.full_name}
                    aria-describedby={errors.full_name ? "full_name-error" : undefined}
                    {...form.register("full_name")}
                  />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="email" label="Email" error={errors.email?.message}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...form.register("email")}
                    />
                  </Field>
                  <Field id="phone" label="Phone" error={errors.phone?.message}>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      {...form.register("phone")}
                    />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="date_of_birth" label="Date of birth" error={errors.date_of_birth?.message}>
                    <Input
                      id="date_of_birth"
                      type="date"
                      aria-invalid={!!errors.date_of_birth}
                      aria-describedby={errors.date_of_birth ? "date_of_birth-error" : undefined}
                      {...form.register("date_of_birth")}
                    />
                  </Field>
                  <Field id="profile_image_url" label="Profile image URL" error={errors.profile_image_url?.message}>
                    <Input
                      id="profile_image_url"
                      type="url"
                      placeholder="https://"
                      aria-invalid={!!errors.profile_image_url}
                      aria-describedby={errors.profile_image_url ? "profile_image_url-error" : undefined}
                      {...form.register("profile_image_url")}
                    />
                  </Field>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    {form.formState.isSubmitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <DetailItem label="Full name" value={recipient.full_name} />
                <DetailItem label="Email" value={recipient.email} />
                <DetailItem label="Phone" value={recipient.phone} />
                <DetailItem label="Date of birth" value={formatDate(recipient.date_of_birth)} />
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}