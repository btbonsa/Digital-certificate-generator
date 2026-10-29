"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createRecipientSchema, type CreateRecipientFormData } from "@/features/recipients/schemas";
import { recipientsApi } from "@/features/recipients/api";
import { brass } from "@/lib/organization";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 py-8 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
      <div>
        <span className="block h-0.5 w-6 rounded-full" style={{ backgroundColor: brass }} aria-hidden="true" />
        <h2 className="mt-3 font-serif text-xl font-medium tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default function NewRecipientPage() {
  const router = useRouter();
  const form = useForm<CreateRecipientFormData>({
    resolver: zodResolver(createRecipientSchema),
    defaultValues: {
      full_name: "",
      sex: "",
      date_of_birth: "",
      email: "",
      phone: "",
      profile_image_url: "",
    },
  });
  const errors = form.formState.errors;
  const watchedName = form.watch("full_name");
  const watchedImage = form.watch("profile_image_url");

  const onSubmit = async (data: CreateRecipientFormData) => {
    try {
      const cleanedData = {
        ...data,
        full_name: data.full_name.trim(),
        email: data.email || undefined,
        phone: data.phone.trim(),
        date_of_birth: data.date_of_birth || undefined,
        profile_image_url: data.profile_image_url || undefined,
      };

      await recipientsApi.create(cleanedData);
      toast.success("Recipient created successfully");
      router.push("/recipients");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create recipient");
    }
  };

  const describedBy = (id: string, hasHint = false, hasError = false) =>
    hasError ? `${id}-error` : hasHint ? `${id}-hint` : undefined;

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
          <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Add recipient</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new certificate recipient. Fields marked * are required.
          </p>
        </div>
      </div>

      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="divide-y divide-border" noValidate>
            <Section title="Personal details" description="How the recipient's name appears on their certificates.">
              <Field id="full_name" label="Full name" required error={errors.full_name?.message}>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={!!errors.full_name}
                  aria-describedby={describedBy("full_name", false, !!errors.full_name)}
                  {...form.register("full_name")}
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="sex" label="Sex" required error={errors.sex?.message}>
                  <Input
                    id="sex"
                    list="sex-options"
                    placeholder="Female, male, or other"
                    autoComplete="off"
                    aria-required="true"
                    aria-invalid={!!errors.sex}
                    aria-describedby={describedBy("sex", false, !!errors.sex)}
                    {...form.register("sex")}
                  />
                  <datalist id="sex-options">
                    <option value="Female" />
                    <option value="Male" />
                    <option value="Other" />
                  </datalist>
                </Field>

                <Field id="date_of_birth" label="Date of birth" error={errors.date_of_birth?.message}>
                  <Input
                    id="date_of_birth"
                    type="date"
                    aria-invalid={!!errors.date_of_birth}
                    aria-describedby={describedBy("date_of_birth", false, !!errors.date_of_birth)}
                    {...form.register("date_of_birth")}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Contact" description="Used to reach the recipient about their certificates.">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="phone" label="Phone" required error={errors.phone?.message}>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    autoComplete="off"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={describedBy("phone", false, !!errors.phone)}
                    {...form.register("phone")}
                  />
                </Field>

                <Field id="email" label="Email" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="off"
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy("email", false, !!errors.email)}
                    {...form.register("email")}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Photo" description="Shown on the recipient's profile. Initials are used if there's no image.">
              <div className="flex items-start gap-4">
                <Avatar className="size-16 shrink-0 ring-4 ring-primary/10">
                  {watchedImage && <AvatarImage src={watchedImage} alt="Profile image preview" />}
                  <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                    {getInitials(watchedName) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Field
                    id="profile_image_url"
                    label="Profile image URL"
                    hint="Link to a hosted image, such as https://example.com/image.jpg"
                    error={errors.profile_image_url?.message}
                  >
                    <Input
                      id="profile_image_url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      autoComplete="off"
                      aria-invalid={!!errors.profile_image_url}
                      aria-describedby={describedBy("profile_image_url", true, !!errors.profile_image_url)}
                      {...form.register("profile_image_url")}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:justify-end">
              <Link href="/recipients" className={buttonVariants({ variant: "outline" })}>
                Cancel
              </Link>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                {form.formState.isSubmitting ? "Creating…" : "Create recipient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}