import { useEffect, useMemo, useState } from "react";

import { Loader2, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
      openPopup: (formId: string, options?: Record<string, unknown>) => void;
    };
  }
}

interface TallyModalProps {
  formId?: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary";
  className?: string;
  unstyled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function TallyModal({
  formId = "n9bWWE",
  buttonText = "Open Form",
  buttonVariant = "primary",
  className = "",
  unstyled = false,
  onOpenChange,
}: TallyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Ensure the Tally embed script is available once on the page.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://tally.so/widgets/embed.js"]'
    );

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);

    document.body.appendChild(script);

    return () => {
      if (!scriptLoaded && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptLoaded]);

  useEffect(() => {
    if (!isOpen || !scriptLoaded) return;
    window.Tally?.loadEmbeds();
  }, [isOpen, scriptLoaded]);

  useEffect(() => {
    if (!isOpen) {
      setIframeLoaded(false);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const tallyUrl = useMemo(
    () =>
      `https://tally.so/embed/${formId}?transparentBackground=1&hideTitle=1&hideFooter=1&alignLeft=1`,
    [formId]
  );

  const triggerClassName = unstyled
    ? className
    : cn(
        buttonVariants({
          variant: buttonVariant === "primary" ? "default" : "secondary",
          size: "lg",
        }),
        "transition-opacity hover:opacity-90",
        className
      );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            unstyled ? "bg-transparent p-0" : "inline-flex items-center gap-2 font-medium",
            triggerClassName
          )}
        >
          {buttonText}
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "w-[95vw] max-w-[420px] sm:max-w-2xl lg:max-w-3xl mx-auto max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-border bg-card shadow-[0_18px_40px_rgba(0,0,0,0.35)] dark:shadow-[0_22px_54px_rgba(0,0,0,0.65)]",
          "flex flex-col rounded-[18px] p-0"
        )}
        aria-label="Contact form"
      >
        <div className="relative h-full bg-background flex-1">
          {!iframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              <span>Loading contact form…</span>
            </div>
          )}

          {isOpen && (
            <iframe
              key={tallyUrl}
              src={tallyUrl}
              data-tally-src={tallyUrl}
              className={cn(
                "h-full w-full border-0 transition-opacity duration-300",
                !iframeLoaded && "opacity-0"
              )}
              style={{
                minHeight: "70vh",
                background: "transparent",
              }}
              title={`${buttonText} Form`}
              loading="lazy"
              allow="fullscreen; encrypted-media"
              onLoad={() => setIframeLoaded(true)}
            />
          )}

          <DialogClose
            type="button"
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Close contact form"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
