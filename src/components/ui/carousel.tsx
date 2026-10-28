"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CarouselApi = NonNullable<UseEmblaCarouselType[1]>;

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0];
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used inside Carousel.");
  }
  return context;
}

type CarouselProps = React.ComponentProps<"div"> & {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
};

function Carousel({ className, children, opts, plugins, ...props }: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(opts, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  React.useEffect(() => {
    if (!api) return;

    const updateScrollState = (emblaApi: CarouselApi) => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateScrollState(api);
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  const contextValue = React.useMemo(
    () => ({ carouselRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext }),
    [carouselRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        onKeyDownCapture={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollNext();
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={cn("flex touch-pan-y -ml-4", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  );
}

function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      className={cn(
        "absolute left-0 top-1/2 z-10 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md",
        className,
      )}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft aria-hidden="true" />
    </Button>
  );
}

function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { canScrollNext, scrollNext } = useCarousel();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Next slide"
      disabled={!canScrollNext}
      className={cn(
        "absolute right-0 top-1/2 z-10 size-9 translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md",
        className,
      )}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight aria-hidden="true" />
    </Button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };
