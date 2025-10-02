import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputMask from "react-input-mask";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" }),
  business_name: z.string().trim().max(150, { message: "Business name must be less than 150 characters" }).optional(),
  phone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, { message: "Please enter a valid US phone number" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .transform(val => val.toLowerCase()),
  reason: z.enum(["Donation Inquiry", "Gym Partnership", "Corporate Sponsorship", "Payment/Technical Issues", "General Questions", "Other"], {
    required_error: "Please select a reason for contact",
  }),
  message: z.string().trim().max(1000, { message: "Message must be less than 1000 characters" }).optional(),
  website_url: z.string().max(0, { message: "This field should be empty" }).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

type BannerState = {
  type: 'success' | 'error' | 'rate-limit' | null;
  message: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<BannerState>({ type: null, message: '' });
  const [messageLength, setMessageLength] = useState(0);
  const [formRenderTime] = useState(Date.now());

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      business_name: '',
      phone: '',
      email: '',
      reason: undefined,
      message: '',
      website_url: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setBanner({ type: null, message: '' });

    // Time-based validation (bot protection)
    const submissionTime = Date.now();
    const timeDiff = (submissionTime - formRenderTime) / 1000;
    
    if (timeDiff < 3) {
      setIsSubmitting(false);
      return; // Silent rejection for suspected bot
    }

    try {
      const { data: result, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message || '',
        },
      });

      if (error) {
        throw error;
      }

      // Success
      setBanner({
        type: 'success',
        message: "Thank you! We've received your message and will respond within 24-48 hours.",
      });
      form.reset();
      setMessageLength(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Contact form submission error:', error);

      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        setBanner({
          type: 'rate-limit',
          message: "You've submitted too many requests. Please try again in 1 hour.",
        });
      } else {
        setBanner({
          type: 'error',
          message: "Something went wrong. Please try again or email us directly at contact@strengthoverstruggle.org.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-[600px]">
          {/* Banner */}
          {banner.type && (
            <div
              role="alert"
              aria-live="polite"
              className={`mb-6 p-4 rounded-[12px] flex items-start gap-3 animate-fade-in ${
                banner.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                  : banner.type === 'rate-limit'
                  ? 'bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800'
                  : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              }`}
            >
              {banner.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  banner.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : banner.type === 'rate-limit'
                    ? 'text-orange-800 dark:text-orange-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {banner.message}
              </p>
            </div>
          )}

          {/* Page Title and Description - Outside Card */}
          <div className="text-center mb-8">
            <h1 className="font-manrope font-extrabold text-[32px] md:text-[48px] leading-[1.1] tracking-[-2px] md:tracking-[-2.5px] text-[hsl(var(--text-primary))] mb-4">
              Connect With Us
            </h1>
            <p className="font-inter font-normal text-[18px] leading-[1.6] text-[#545454] dark:text-[#888888] max-w-[800px] mx-auto mb-8">
              Whether you're interested in partnering with us, making a donation, or have questions about our mission, we'd love to hear from you. Fill out the form below and we'll get back to you within 24-48 hours.
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-md">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Smith"
                          className="font-inter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.name && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.name.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="If applicable"
                          className="font-inter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.business_name && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.business_name.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <InputMask
                          mask="(999) 999-9999"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        >
                          {/* @ts-ignore */}
                          {(inputProps: any) => (
                            <Input
                              {...inputProps}
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="font-inter"
                            />
                          )}
                        </InputMask>
                      </FormControl>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.phone && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.phone.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="font-inter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.email && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.email.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Reason for Contact */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Reason for Contact *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-inter">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Donation Inquiry">Donation Inquiry</SelectItem>
                          <SelectItem value="Gym Partnership">Gym Partnership</SelectItem>
                          <SelectItem value="Corporate Sponsorship">Corporate Sponsorship</SelectItem>
                          <SelectItem value="Payment/Technical Issues">Payment/Technical Issues</SelectItem>
                          <SelectItem value="General Questions">General Questions</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.reason && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.reason.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-manrope font-bold text-[14px] text-[hsl(var(--text-primary))]">
                        Message
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Tell us more about your inquiry..."
                            className="font-inter text-[14px] md:text-[15px] min-h-[120px] resize-y"
                            maxLength={1000}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setMessageLength(e.target.value.length);
                            }}
                          />
                          <p className="absolute bottom-3 right-4 text-xs text-[hsl(var(--text-secondary))] font-inter pointer-events-none">
                            {messageLength}/1000
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage className="flex items-center gap-1 text-red-500">
                        {form.formState.errors.message && (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>{form.formState.errors.message.message}</span>
                          </>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Honeypot field (hidden) */}
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem className="absolute left-[-9999px]">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} tabIndex={-1} autoComplete="off" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-[200px] md:mx-auto md:block rounded-[16px] h-[48px] font-manrope font-bold text-[15px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
