import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { results } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

export function Results() {
  return (
    <section id="results" className="scroll-mt-20 py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading title="What you'll see" description="Every check ends in one of three clear answers." />

        <ul className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {results.map(({ icon: Icon, title, description, tone }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
            >
              <span className={cn("flex size-10 items-center justify-center rounded-xl sm:size-12", tone)}>
                <Icon className="size-5 sm:size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-medium tracking-tight sm:mt-6 sm:text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}