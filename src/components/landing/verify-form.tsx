"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) return;
    router.push(`/verify/${encodeURIComponent(trimmedCode)}`);
  };

  return (
    <form id="verify" onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <Input
        id="verification-code"
        name="code"
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="Enter verification code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        className="h-10 border-border bg-background text-base"
        required
      />
      <Button type="submit" size="lg" className="h-10 px-6 text-base">
        Verify
        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}