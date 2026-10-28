import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border-border",
        },
      }}
    />
  );
}
