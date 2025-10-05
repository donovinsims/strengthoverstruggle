import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TallyPopupButtonProps {
  formId?: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary";
  className?: string;
  unstyled?: boolean;
}

export default function TallyPopupButton({
  formId = "n9bWWE",
  buttonText = "Open Form",
  buttonVariant = "primary",
  className = "",
  unstyled = false,
}: TallyPopupButtonProps) {
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
    <button
      type="button"
      data-tally-open={formId}
      data-tally-layout="modal"
      data-tally-width="600"
      data-tally-align-left="1"
      data-tally-hide-title="1"
      data-tally-auto-close="500"
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        unstyled ? "bg-transparent p-0" : "inline-flex items-center gap-2 font-medium",
        triggerClassName
      )}
    >
      {buttonText}
    </button>
  );
}
