import { useState } from "react";
import { X, Bell, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONVERTKIT_FORM_ID = "8554123";
// Prefer env var; will fall back to your provided key for now.
const CONVERTKIT_API_KEY =
  process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY || "5qhRShC1VPSMmKrk53oi4Q";

export const NewsletterPopup = ({ isOpen, onClose }: NewsletterPopupProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setHasError(false);

    try {
      // Debugging
      console.log("Attempting newsletter signup with email:", trimmed);

      // Correct ConvertKit endpoint: form id goes in the URL
      const url = `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          api_key: CONVERTKIT_API_KEY,
          // Optional extras if you ever want them:
          // first_name: "Donny",
          // tags: ["newsletter"]
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("API Error Response:", data);
        // ConvertKit sometimes responds with { message } or { error: { message } }
        const errMsg =
          (data && (data.message || data?.error?.message)) ||
          `HTTP ${response.status}: Failed to subscribe`;
        throw new Error(errMsg);
      }

      console.log("Newsletter subscription successful:", data);
      setIsSubmitted(true);

      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });

      // Auto close after success
      setTimeout(() => {
        onClose();
        setEmail("");
        setIsSubmitted(false);
        setHasError(false);
      }, 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Please try again in a moment.";
      console.error("Newsletter signup error:", error);
      setHasError(true);

      toast({
        title: "Subscription Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-40 bg-black/80" />
        <DialogContent
          className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] bg-card border border-border animate-scale-in p-0"
          aria-labelledby="newsletter-title"
          aria-describedby="newsletter-description"
        >
          <ScrollArea className="max-h-[90vh]">
            <Card className="border-0 shadow-none">
              <CardContent className="p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Close newsletter popup"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <Bell className="w-8 h-8 text-primary" />
                  </div>

                  <h2 id="newsletter-title" className="text-2xl font-bold mb-4 text-primary">
                    Stay Connected with SOS
                  </h2>

                  <p id="newsletter-description" className="body-text mb-6">
                    Be the first to know about new programs, upcoming events, and ways to get involved in our mission of
                    empowering resilience.
                  </p>

                  {isSubmitted ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-green-500 mb-2">Success!</h3>
                      <p className="text-sm text-muted-foreground">
                        Thank you for subscribing. We'll keep you updated!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      {hasError && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Subscription failed. Please try again.</span>
                        </div>
                      )}

                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setHasError(false);
                        }}
                        required
                        inputMode="email"
                        autoComplete="email"
                        className="border border-border"
                        aria-label="Email address"
                        disabled={isSubmitting}
                      />

                      <Button type="submit" className="w-full py-6 text-lg font-medium" disabled={isSubmitting || !email.trim()}>
                        {isSubmitting ? "Joining..." : "Join Our Mission"}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};