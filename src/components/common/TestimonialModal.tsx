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
        className="w-[90vw] max-w-lg mx-auto max-h-[85vh] bg-card border border-border animate-scale-in flex flex-col"
        aria-labelledby="testimonial-title"
        aria-describedby="testimonial-content"
      >
        <DialogHeader className="text-left flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle 
              id="testimonial-title"
              className="text-xl font-semibold text-primary"
            >
              {testimonial.name}'s Story
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
              aria-label="Close testimonial"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-primary text-lg sm:text-base">{testimonial.name}</h3>
                <p className="caption text-sm">{testimonial.role}</p>
              </div>
            </div>
            
            <div id="testimonial-content">
              <blockquote className="text-sm sm:text-base italic text-foreground leading-relaxed whitespace-pre-line">
                "{testimonial.fullQuote}"
              </blockquote>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};