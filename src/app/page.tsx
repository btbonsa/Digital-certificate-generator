import type { Metadata } from "next";
import { Contact } from "@/components/landing/contact";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Results } from "@/components/landing/results";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { organization } from "@/lib/organization";

export const metadata: Metadata = {
  title: `Verify a certificate | ${organization.name}`,
  description: `Check a certificate issued by ${organization.name}. Enter the code or scan the QR code to see the official record.`,
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <Hero />
        <HowItWorks />
        <Results />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}