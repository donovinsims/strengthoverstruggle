import { useState, useEffect, useRef, startTransition } from "react";

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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
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

  // Detect small screen
  useEffect(() => {
    if (typeof window === "undefined") return;

    const smallScreenQuery = window.matchMedia("(max-width: 480px)");

    const handleScreenChange = (event: MediaQueryListEvent | MediaQueryList) => {
      startTransition(() => setIsSmallScreen(event.matches));
    };

    handleScreenChange(smallScreenQuery);

    const listener = (event: MediaQueryListEvent) => handleScreenChange(event);

    if (typeof smallScreenQuery.addEventListener === "function") {
      smallScreenQuery.addEventListener("change", listener);
    } else if (typeof smallScreenQuery.addListener === "function") {
      smallScreenQuery.addListener(listener);
    }

    return () => {
      if (typeof smallScreenQuery.removeEventListener === "function") {
        smallScreenQuery.removeEventListener("change", listener);
      } else if (typeof smallScreenQuery.removeListener === "function") {
        smallScreenQuery.removeListener(listener);
      }
    };
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

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Keyboard escape handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const colors = {
    modalBg: isDarkMode ? "#121212" : "#FFFFFF",
    modalBorder: isDarkMode ? "#262626" : "#E0E0E0",
    textColor: isDarkMode ? "#FFFFFF" : "#000000",
    buttonPrimaryBg: isDarkMode ? "#FFFFFF" : "#121212",
    buttonPrimaryText: isDarkMode ? "#121212" : "#FFFFFF",
    buttonSecondaryBg: isDarkMode ? "#171717" : "#FFFFFF",
    buttonSecondaryText: isDarkMode ? "#FFFFFF" : "#121212",
    buttonSecondaryBorder: isDarkMode ? "#262626" : "#DBDBDB",
  };

  const getAnimationStyle = (isEntering: boolean) => {
    const animation = isEntering ? enterAnimation : exitAnimation;
    
    if (animation === "scaleFadeIn" || animation === "scaleFadeOut") {
      return {
        transform: isEntering ? "scale(1)" : "scale(0.95)",
        transition: "transform 300ms ease, opacity 300ms ease",
      };
    } else {
      return {
        transform: isEntering ? "translateY(0)" : "translateY(20px)",
        transition: "transform 300ms ease, opacity 300ms ease",
      };
    }
  };

  const buttonStyles = {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: "15px",
    lineHeight: 1.5,
    padding: "12px 24px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: buttonVariant === "primary" ? colors.buttonPrimaryBg : colors.buttonSecondaryBg,
    color: buttonVariant === "primary" ? colors.buttonPrimaryText : colors.buttonSecondaryText,
    borderColor: buttonVariant === "primary" ? colors.buttonPrimaryBg : colors.buttonSecondaryBorder,
  };

  const closeButtonStyles = {
    position: "absolute" as const,
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: colors.textColor,
    padding: "4px 8px",
    lineHeight: 1,
  };

  return (
    <>
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
            padding: isSmallScreen ? "12px" : "24px",
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
              padding: isSmallScreen ? "16px" : "32px",
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
              Fill out the form below
            </div>

            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label="Close modal"
              style={closeButtonStyles}
            >
              ×
            </button>

            {scriptLoaded && (
              <iframe
                data-tally-src={`https://tally.so/r/${formId}?transparentBackground=1`}
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title={`${buttonText} Form`}
                style={{
                  border: "none",
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
