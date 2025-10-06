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
export function useExitIntent(enabled = true): UseExitIntentReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const isMobile = useIsMobile();

  const { exitIntent } = APP_CONFIG.ui;

  useEffect(() => {
    if (!enabled) {
      setIsOpen(false);
      setHasShown(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (hasShown || !enabled) return;

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= exitIntent.desktopMouseLeaveY && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Mobile: Scroll and time-based triggers
    let scrollTimeout: NodeJS.Timeout;
    let timeTimeout: NodeJS.Timeout;
    let lastScrollY = 0;

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
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (currentScrollY / documentHeight) * 100;

      // Trigger if user scrolls up rapidly after being threshold% down the page
      if (
        scrollDirection === "up" &&
        scrollPercent > exitIntent.mobileScrollThreshold &&
        currentScrollY < lastScrollY - 100
      ) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleMobileExitIntent, 800);
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
      clearTimeout(scrollTimeout);
      clearTimeout(timeTimeout);
    };
  }, [enabled, hasShown, isMobile, exitIntent]);

  return { isOpen, setIsOpen };
}
