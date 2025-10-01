import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useEffect } from "react";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: {
    id: string;
    name: string;
    role: string;
    quote: string;
    fullQuote: string;
    image: string;
  } | null;
}

export const TestimonialModal = ({ isOpen, onClose, testimonial }: TestimonialModalProps) => {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!testimonial) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] sm:w-[90vw] max-w-2xl mx-auto max-h-[90vh] sm:max-h-[85vh] bg-card border-none shadow-[0px_8px_24px_rgba(0,0,0,0.18)] dark:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] animate-scale-in flex flex-col rounded-[16px] overflow-hidden p-8 sm:p-10"
        aria-labelledby="testimonial-title"
        aria-describedby="testimonial-content"
      >
        {/* Close Button - Top Right, More Prominent */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Close testimonial"
        >
          <X size={20} />
        </button>

        <ScrollArea className="flex-1 overflow-y-auto -mr-4 pr-4">
          <div className="space-y-8">
            {/* Avatar Section - Centered, Larger */}
            <div className="flex flex-col items-center text-center space-y-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-background shadow-lg"
              />
              
              {/* Name and Role */}
              <div className="space-y-2">
                <h3 
                  id="testimonial-title"
                  className="text-2xl sm:text-3xl font-bold text-primary"
                >
                  {testimonial.name}
                </h3>
                
                {/* Accent Line */}
                <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
                
                <p className="text-base text-muted-foreground font-medium">{testimonial.role}</p>
              </div>
            </div>
            
            {/* Testimonial Content */}
            <div id="testimonial-content" className="pt-4">
              <blockquote className="text-base text-foreground leading-[1.6] italic whitespace-pre-line">
                "{testimonial.fullQuote}"
              </blockquote>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};