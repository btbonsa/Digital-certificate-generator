type SectionHeadingProps = {
  title: string;
  description: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      <p className="mt-3 sm:mt-4 text-md sm:text-md text-muted-foreground">{description}</p>
    </div>
  );
}