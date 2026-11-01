import { CertificatePreview } from "@/components/landing/certificate-preview";
import { Container } from "@/components/landing/container";
import { VerifyForm } from "@/components/landing/verify-form";
import { organization } from "@/lib/organization";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
  

      <Container className="relative flex flex-col items-center py-6 text-center py-20">
        <h1
          id="hero-heading"
          className="max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl pt-1"
        >
          Certificates issued and verified in seconds.
        </h1>

        <p className="mt-1 max-w-xl text-pretty text-md leading-relaxed text-muted-foreground sm:text-md">
          Enter the code printed on a {organization.name} certificate, or scan its QR code, to check it against our
          official records.
        </p>

        <div className="mt-2 w-full max-w-xl text-left">
          <VerifyForm />
        </div>


        <div className="mt-8 w-full lg:mt-20">
          <CertificatePreview />
        </div>
      </Container>
    </section>
  );
}