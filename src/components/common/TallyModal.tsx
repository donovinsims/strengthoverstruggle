(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/components/common/TallyModal.tsx b/src/components/common/TallyModal.tsx
index 2801a85d1bbaed2abb6a9d98862f5df3e6708911..d4a94fce27cc140ed9c967a204785133ba0fc0e7 100644
--- a/src/components/common/TallyModal.tsx
+++ b/src/components/common/TallyModal.tsx
@@ -11,70 +11,99 @@ declare global {
 
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
+  const [isSmallScreen, setIsSmallScreen] = useState(false);
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
 
+  useEffect(() => {
+    if (typeof window === "undefined") return;
+
+    const smallScreenQuery = window.matchMedia("(max-width: 480px)");
+
+    const handleScreenChange = (event: MediaQueryListEvent | MediaQueryList) => {
+      startTransition(() => setIsSmallScreen(event.matches));
+    };
+
+    handleScreenChange(smallScreenQuery);
+
+    const listener = (event: MediaQueryListEvent) => handleScreenChange(event);
+
+    if (typeof smallScreenQuery.addEventListener === "function") {
+      smallScreenQuery.addEventListener("change", listener);
+    } else if (typeof smallScreenQuery.addListener === "function") {
+      smallScreenQuery.addListener(listener);
+    }
+
+    return () => {
+      if (typeof smallScreenQuery.removeEventListener === "function") {
+        smallScreenQuery.removeEventListener("change", listener);
+      } else if (typeof smallScreenQuery.removeListener === "function") {
+        smallScreenQuery.removeListener(listener);
+      }
+    };
+  }, []);
+
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
diff --git a/src/components/common/TallyModal.tsx b/src/components/common/TallyModal.tsx
index 2801a85d1bbaed2abb6a9d98862f5df3e6708911..d4a94fce27cc140ed9c967a204785133ba0fc0e7 100644
--- a/src/components/common/TallyModal.tsx
+++ b/src/components/common/TallyModal.tsx
@@ -284,72 +313,72 @@ export default function TallyModal({
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
-            padding: "24px",
+            padding: isSmallScreen ? "12px" : "24px",
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
-              padding: "32px",
+              padding: isSmallScreen ? "16px" : "32px",
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
 
EOF
)