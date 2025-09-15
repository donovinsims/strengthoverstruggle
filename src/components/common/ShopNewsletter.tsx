import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const ShopNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.convertkit.com/v3/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          api_key: '5qhRShC1VPSMmKrk53oi4Q'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to subscribe`);
      }

      const data = await response.json();
      console.log("Shop newsletter subscription successful:", data);
      setIsSubmitted(true);
      setEmail("");
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Shop newsletter signup error:', error);
      // You could add error state handling here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 text-center">
      <Card className="bg-muted/50 max-w-lg mx-auto">
        <CardContent className="p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-primary">
            New Products Coming Soon
          </h3>
          <p className="body-text mb-6">
            Be the first to know when we launch new items! Join our email list to stay updated on fresh merchandise and never miss when new products are back in stock.
          </p>
          
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-green-500 mb-2">Thanks for subscribing!</h4>
              <p className="text-sm text-muted-foreground">
                We'll keep you updated on new products.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border border-border"
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="sm:w-auto py-6 text-lg font-medium"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? "Joining..." : "Stay Updated"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};