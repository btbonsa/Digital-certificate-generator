"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ArrowLeft, BadgeCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/features/auth/schemas";
import { authApi } from "@/features/auth/api";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Monogram } from "@/components/monogram";
import { brass, organization } from "@/lib/organization";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const errors = form.formState.errors;

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data);
      auth.setToken(response.token);
      auth.setUser(response.admin);
      toast.success("Login successful");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <style>{`
        @keyframes cv-stamp {
          0% { opacity: 0; transform: scale(1.9) rotate(-26deg); }
          60% { opacity: 1; transform: scale(0.94) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .cv-seal { animation: cv-stamp 700ms cubic-bezier(0.2, 0.9, 0.3, 1.2) 450ms both; }
        }
      `}</style>

      {/* Sign-in column */}
      <div className="flex flex-col bg-background">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Monogram />
            <span className="leading-tight">
              <span className="block text-base font-semibold tracking-tight">{organization.name}</span>
              <span className="block text-xs text-muted-foreground">Certificate portal</span>
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-sm">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Staff sign-in</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">Admin login</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your credentials to issue and manage certificates.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="h-11"
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? "username-error" : undefined}
                  {...form.register("username")}
                />
                {errors.username && (
                  <p id="username-error" className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 pr-11"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-11 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              Need access? Contact{" "}
              <a
                href={`mailto:${organization.contactEmail}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {organization.contactEmail}
              </a>
              .
            </p>
          </div>
        </main>

        <footer className="px-4 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
        </footer>
      </div>

      {/* Brand panel (decorative, desktop only) */}
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:items-center lg:justify-center"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative w-full max-w-md px-10">
          <span className="block h-1 w-12 rounded-full" style={{ backgroundColor: brass }} />
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.12] tracking-tight">
            Every certificate you issue can be checked by anyone, in seconds.
          </h2>

          <div className="relative mt-12">
            <div className="overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl shadow-black/25">
              <div className="flex items-center gap-4 border-b border-border bg-emerald-50 px-5 py-4 dark:bg-emerald-950/30">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <BadgeCheck className="size-6" />
                </span>
                <div>
                  <p className="font-semibold">Certificate verified</p>
                  <p className="text-xs text-muted-foreground">Matches {organization.name}&apos;s record.</p>
                </div>
              </div>
              <dl className="divide-y divide-border text-sm">
                {[
                  ["Recipient", "Jane Doe"],
                  ["Course", "Advanced Web Development"],
                  ["Code", "CV-2024-001-8F2A"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 px-5 py-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className={`font-medium ${label === "Code" ? "font-mono" : ""}`}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <span
              className="cv-seal absolute -right-5 -top-7 flex size-16 -rotate-12 items-center justify-center rounded-full border-4 border-primary text-white shadow-lg"
              style={{ backgroundColor: brass }}
            >
              <BadgeCheck className="size-7" />
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}