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
          "w-[95vw] max-w-[640px] mx-auto max-h-[90vh] overflow-hidden border border-border bg-card",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_22px_54px_rgba(0,0,0,0.65)]",
          "flex flex-col rounded-[20px] p-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-96 data-[state=open]:zoom-in-96",
          "duration-200"
        )}
        aria-label="Contact form"
      >
        <div className="relative h-full bg-background flex-1 p-4 sm:p-6">
          {!iframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6">
              <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">Getting things ready...</span>
            </div>
          )}

          {isOpen && (
            <div className={cn(
              "h-full w-full rounded-[12px] overflow-hidden transition-opacity duration-300",
              "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
              !iframeLoaded && "opacity-0"
            )}>
              <iframe
                key={tallyUrl}
                src={tallyUrl}
                data-tally-src={tallyUrl}
                className="h-full w-full border-0"
                style={{
                  minHeight: "70vh",
                  background: "transparent",
                }}
                title={`${buttonText} Form`}
                loading="lazy"
                allow="fullscreen; encrypted-media"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          )}

          <DialogClose
            type="button"
            className={cn(
              "absolute -right-2 -top-2 z-20",
              "inline-flex h-10 w-10 items-center justify-center",
              "rounded-[12px] border border-border",
              "bg-background/95 backdrop-blur-sm",
              "text-muted-foreground shadow-lg",
              "transition-all duration-200",
              "hover:text-foreground hover:scale-105 hover:shadow-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
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
