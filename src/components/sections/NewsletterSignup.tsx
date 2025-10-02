import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email },
      });

      if (error) throw error;

      if (data.error) {
        setStatus('error');
        toast({
          title: "Subscription failed",
          description: data.error,
          variant: "destructive",
        });
      } else {
        setStatus('success');
        setEmail('');
        toast({
          title: "Check your email!",
          description: data.message || "Please confirm your subscription",
        });
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-[hsl(var(--background))]">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 bg-[hsl(var(--card))] border-[hsl(var(--card-border))] border-[1.5px] rounded-[12px]">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-[hsl(var(--icon-container))] rounded-[12px]">
              <Mail className="w-6 h-6 text-[hsl(var(--icon))]" />
            </div>
            <div className="flex-1">
              <h2 className="font-manrope font-extrabold text-[22px] leading-[1.5] tracking-[-0.5px] text-[hsl(var(--heading))] mb-2">
                Stay Updated
              </h2>
              <p className="font-inter font-medium text-[16px] leading-[1.5] text-[hsl(var(--description))]">
                Subscribe to our newsletter for updates on programs, success stories, and opportunities to get involved.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 rounded-[10px] border-[1px] border-[hsl(var(--card-border))] 
                  bg-[hsl(var(--background))] text-[16px] h-12
                  focus:border-[hsl(var(--heading))] transition-colors duration-200"
                aria-label="Email address for newsletter"
              />
              <Button
                type="submit"
                disabled={isSubmitting || status === 'success'}
                className="font-manrope font-bold text-[15px] rounded-[10px] border-[1px] h-12 px-6
                  bg-[hsl(var(--primary-button-bg))] text-[hsl(var(--primary-button-text))] 
                  border-[hsl(var(--primary-button-border))]
                  hover:bg-[hsl(var(--primary-button-hover))]
                  transition-colors duration-200"
              >
                {isSubmitting ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <p className="text-sm">Check your email to confirm your subscription</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">Something went wrong. Please try again.</p>
              </div>
            )}

            <p className="text-xs text-[hsl(var(--description))] opacity-75">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
};
