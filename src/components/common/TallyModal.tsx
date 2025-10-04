import { useState, useEffect, useRef, startTransition, type CSSProperties } from "react";

// Extend Window interface to include Tally
declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

interface TallyModalProps {
  formId?: string;
  buttonText?: string;
  modalWidth?: number;
  overlayDim?: number;
  enterAnimation?: "scaleFadeIn" | "slideUp";
  exitAnimation?: "scaleFadeOut" | "slideDown";
  buttonVariant?: "primary" | "secondary";
  className?: string;
}

export default function TallyModal({
  formId = "n9bWWE",
  buttonText = "Open Form",
  modalWidth = 768,
  overlayDim = 0.6,
  enterAnimation = "scaleFadeIn",
  exitAnimation = "scaleFadeOut",
  buttonVariant = "primary",
  className = "",
}: TallyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Detect color scheme preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    startTransition(() => setIsDarkMode(mediaQuery.matches));

    const handleChange = (e: MediaQueryListEvent) => {
      startTransition(() => setIsDarkMode(e.matches));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Load Tally widget script
  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector(
      'script[src="https://tally.so/widgets/embed.js"]'
    );

    if (existingScript) {
      startTransition(() => setScriptLoaded(true));
      if (window.Tally) {
        window.Tally.loadEmbeds();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      startTransition(() => setScriptLoaded(true));
      if (window.Tally) {
        window.Tally.loadEmbeds();
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Reload embeds when modal opens
  useEffect(() => {
    if (isOpen && scriptLoaded && typeof window !== "undefined" && window.Tally) {
      window.Tally.loadEmbeds();
    }
  }, [isOpen, scriptLoaded]);

  const handleOpen = () => {
    if (typeof window === "undefined") return;
    previousActiveElement.current = document.activeElement as HTMLElement;
    startTransition(() => setIsOpen(true));
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    startTransition(() => setIsOpen(false));
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
    }
    setTimeout(() => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }, 100);
  };

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Design system colors
  const colors = isDarkMode
    ? {
        // Dark mode
        modalBg: "#121212",
        modalBorder: "#262626",
        textPrimary: "#FFFFFF",
        primaryBg: "#FFFFFF",
        primaryText: "#121212",
        primaryBorder: "#DBDBDB",
        primaryHover: "#F0F0F0",
        secondaryBg: "#171717",
        secondaryText: "#FFFFFF",
        secondaryBorder: "#262626",
        secondaryHover: "#262626",
        closeBtnBg: "rgba(255, 255, 255, 0.1)",
        closeBtnHover: "rgba(255, 255, 255, 0.2)",
      }
    : {
        // Light mode
        modalBg: "#FFFFFF",
        modalBorder: "#E0E0E0",
        textPrimary: "#000000",
        primaryBg: "#121212",
        primaryText: "#FFFFFF",
        primaryBorder: "#121212",
        primaryHover: "#262626",
        secondaryBg: "#FFFFFF",
        secondaryText: "#121212",
        secondaryBorder: "#DBDBDB",
        secondaryHover: "#F0F0F0",
        closeBtnBg: "rgba(0, 0, 0, 0.1)",
        closeBtnHover: "rgba(0, 0, 0, 0.15)",
      };

  // Button styles based on variant
  const buttonStyles: CSSProperties =
    buttonVariant === "primary"
      ? {
          backgroundColor: colors.primaryBg,
          color: colors.primaryText,
          border: `1.5px solid ${colors.primaryBorder}`,
          transition: "all 200ms ease",
        }
      : {
          backgroundColor: colors.secondaryBg,
          color: colors.secondaryText,
          border: `1.5px solid ${colors.secondaryBorder}`,
          transition: "all 200ms ease",
        };

  // Animation styles
  const getAnimationStyle = (isEntering: boolean): CSSProperties => {
    const animation = isEntering ? enterAnimation : exitAnimation;
    const isVisible = isOpen;

    const baseTransition = "all 300ms ease";

    if (animation === "slideUp" || animation === "slideDown") {
      return {
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        opacity: isVisible ? 1 : 0,
        transition: baseTransition,
      };
    }

    return {
      transform: isVisible ? "scale(1)" : "scale(0.95)",
      opacity: isVisible ? 1 : 0,
      transition: baseTransition,
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@800&family=Inter:wght@500&display=swap');
        
        .tally-modal-button {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 15px;
          line-height: 1.5;
          border-radius: 10px;
          padding: 12px 24px;
          cursor: pointer;
          letter-spacing: -0.01em;
        }
        
        .tally-modal-button:hover {
          background-color: ${buttonVariant === "primary" ? colors.primaryHover : colors.secondaryHover} !important;
        }
        
        .tally-modal-button:focus-visible {
          outline: 2px solid ${isDarkMode ? "#FFFFFF" : "#000000"};
          outline-offset: 2px;
        }
        
        .tally-close-button {
          transition: all 200ms ease;
        }
        
        .tally-close-button:hover {
          background-color: ${colors.closeBtnHover} !important;
          transform: scale(1.05);
        }
        
        .tally-close-button:focus-visible {
          outline: 2px solid ${isDarkMode ? "#FFFFFF" : "#000000"};
          outline-offset: 2px;
        }
      `}</style>

      <button
        ref={triggerButtonRef}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`tally-modal-button ${className}`}
        style={buttonStyles}
      >
        {buttonText}
      </button>

      {isOpen && (
        <div
          onClick={handleClose}
          role="presentation"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(0, 0, 0, ${overlayDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "24px",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{
              width: "100%",
              maxWidth: modalWidth,
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: "16px",
              position: "relative",
              backgroundColor: colors.modalBg,
              border: `1.5px solid ${colors.modalBorder}`,
              padding: "32px",
              boxShadow: isDarkMode
                ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                : "0 20px 60px rgba(0, 0, 0, 0.15)",
              ...getAnimationStyle(true),
            }}
          >
            <div
              id="modal-title"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {buttonText} Form
            </div>
            <div
              id="modal-description"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              Press Escape to close this dialog. Use Tab to navigate between form fields.
            </div>

            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label="Close dialog"
              className="tally-close-button"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: colors.closeBtnBg,
                border: "none",
                borderRadius: "8px",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 400,
                color: colors.textPrimary,
                zIndex: 10,
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
            <iframe
              src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
              width="100%"
              height="500"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title={`${buttonText} - Tally Form`}
              style={{ border: "none", minHeight: "500px" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
