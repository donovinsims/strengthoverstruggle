import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues, contactReasons } from "@/schemas/contactFormSchema";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      reason: "",
      message: ""
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          fullName: values.fullName,
          email: values.email,
          reason: values.reason,
          message: values.message || ""
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24-48 hours."
      });
      form.reset();
      setCharCount(0);
      
      // Auto-close modal after 1.5s to give user time to read confirmation
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Form submission failed");
      toast.error("Failed to send message", {
        description: "Please try again or email us directly at contact@strengthoverstruggle.org"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] sm:max-w-[600px] p-0 gap-0 border-[1.5px] rounded-[16px]"
          aria-describedby="contact-form-description"
        >
          <div className="flex flex-col h-full max-h-[95vh]">
            {/* Header with close button - sticky on mobile */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4 shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-manrope font-extrabold text-foreground">
                  Get in Touch
                </h2>
                <p id="contact-form-description" className="text-sm text-muted-foreground mt-1">
                  We'll respond within 24-48 hours
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                aria-label="Close contact form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form content with scroll */}
            <ScrollArea className="flex-1 px-4 sm:px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-inter font-bold">
                          Full Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Smith"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-inter font-bold">
                          Email Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-inter font-bold">
                          Reason for Contact <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-input border-border text-foreground h-12 text-base">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border z-[120]">
                            {contactReasons.map((reason) => (
                              <SelectItem
                                key={reason}
                                value={reason}
                                className="text-popover-foreground hover:bg-accent focus:bg-accent cursor-pointer"
                              >
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-inter font-bold">
                          Message
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none text-base"
                              maxLength={1000}
                              disabled={isSubmitting}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setCharCount(e.target.value.length);
                              }}
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-muted-foreground pointer-events-none">
                              {charCount}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 sm:h-14 bg-primary text-primary-foreground hover:bg-primary-hover font-manrope font-bold text-base rounded-[10px] transition-colors mt-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">Sending...</span>
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
