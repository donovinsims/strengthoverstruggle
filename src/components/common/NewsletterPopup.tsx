import { useState } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterPopup = ({ isOpen, onClose }: NewsletterPopupProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { email }
      });

      if (error) {
        throw error;
      }
      
      console.log("Newsletter subscription successful:", data);
      setIsSubmitted(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setEmail("");
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      // You could add error state handling here if needed
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
                    Be the first to know about new programs, upcoming events, and ways to get involved in our mission of empowering resilience.
                  </p>

                  {isSubmitted ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-green-500 mb-2">Success!</h3>
                      <p className="text-sm text-muted-foreground">
                        Thank you for subscribing. We'll keep you updated!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input 
                        type="email" 
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-border"
                        aria-label="Email address"
                      />
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-lg font-medium"
                        disabled={isSubmitting || !email}
                      >
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