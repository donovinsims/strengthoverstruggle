import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { APP_CONFIG } from "@/config/app.config";

interface UseExitIntentReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * Custom hook for exit intent detection
 * Handles both desktop (mouse leave) and mobile (scroll/time) triggers
 */
export function useExitIntent(): UseExitIntentReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const isMobile = useIsMobile();

  const { exitIntent } = APP_CONFIG.ui;

  useEffect(() => {
    if (hasShown) return;

    // Desktop: Mouse leave detection
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= exitIntent.desktopMouseLeaveY && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Mobile: Scroll and time-based triggers
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let timeTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollY = window.scrollY;

    const handleMobileExitIntent = () => {
      if (!hasShown && isMobile) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    const handleScroll = () => {
      if (!isMobile) return;

      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
      const rawDocumentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const documentHeight = Math.max(rawDocumentHeight, 1);
      const scrollPercent = (currentScrollY / documentHeight) * 100;

      // Trigger if user scrolls up rapidly after being threshold% down the page
      if (
        scrollDirection === "up" &&
        scrollPercent > exitIntent.mobileScrollThreshold &&
        currentScrollY < lastScrollY - 50
      ) {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleMobileExitIntent, 500);
      }

      // Trigger when user reaches bottom 20% of page
      if (scrollPercent >= 80) {
        handleMobileExitIntent();
      }

      lastScrollY = currentScrollY;
    };

    if (isMobile) {
      // Mobile triggers
      document.addEventListener("scroll", handleScroll, { passive: true });
      timeTimeout = setTimeout(handleMobileExitIntent, exitIntent.mobileTimeThreshold);
    } else {
      // Desktop trigger
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (timeTimeout) {
        clearTimeout(timeTimeout);
      }
    };
  }, [hasShown, isMobile, exitIntent]);

  return { isOpen, setIsOpen };
}
