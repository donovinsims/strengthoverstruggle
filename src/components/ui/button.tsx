import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-manrope font-bold text-[15px] leading-[1.5] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: White bg + black text with light border
        default: "bg-primary text-primary-foreground border border-[hsl(var(--primary-border))] hover:bg-[hsl(var(--primary-hover))] rounded-[10px]",
        
        // Secondary: Dark bg + white text with dark border
        secondary: "bg-secondary text-secondary-foreground border border-[hsl(var(--secondary-border))] hover:bg-[hsl(var(--secondary-hover))] rounded-[10px]",
        
        destructive: "bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/90 rounded-[10px]",
        
        outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground rounded-[10px]",
        
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[10px]",
        
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
