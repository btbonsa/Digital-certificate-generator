import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { steps } from "@/lib/landing-content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border bg-muted/40 py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="How verification works"
          description="Whether you are an employer, a school, or the certificate holder, it takes three steps from issuing to verifying."
        />

        <ol className="mt-10 grid gap-8 sm:mt-14 sm:gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-12 right-[-1rem] top-6 hidden h-px bg-border sm:left-14 md:block"
                />
              )}

              <span className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-12">
                <Icon className="size-5 sm:size-6" aria-hidden="true" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border-2 border-background bg-accent text-[11px] font-semibold text-accent-foreground sm:size-6 sm:text-xs">
                  {index + 1}
                </span>
              </span>

              <h3 className="mt-5 text-md font-medium tracking-tight sm:mt-6 sm:text-xl">{title}</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground sm:text-sm">{description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}