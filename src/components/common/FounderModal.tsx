import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Instagram } from "lucide-react";
import { useEffect } from "react";

interface FounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: {
    id: string;
    name: string;
    role: string;
    bio: string;
    fullBio: string;
    instagram: string;
    image: string;
  } | null;
}

export const FounderModal = ({ isOpen, onClose, founder }: FounderModalProps) => {
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

  if (!founder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] max-w-[400px] sm:max-w-2xl mx-auto max-h-[90vh] sm:max-h-[85vh] bg-card border border-border shadow-[0px_8px_24px_rgba(0,0,0,0.18)] dark:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] flex flex-col rounded-[16px] overflow-hidden p-4 sm:p-10"
        aria-labelledby="founder-title"
        aria-describedby="founder-content"
      >
        {/* Close Button - Sticky Header on Mobile, More Prominent */}
        <div className="sticky top-0 z-[120] -mx-4 -mt-4 sm:mx-0 sm:mt-0 sm:absolute sm:top-4 sm:right-4 flex justify-end p-4 sm:p-0 bg-card sm:bg-transparent">
          <button
            onClick={onClose}
            className="rounded-full w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close founder profile"
          >
            <X size={20} />
          </button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto -mr-2 pr-2 sm:-mr-4 sm:pr-4">
          <div className="space-y-6 sm:space-y-8 pb-4">
            {/* Avatar Section - Centered, Responsive Size */}
            <div className="flex flex-col items-center text-center space-y-4 sm:space-y-4 pt-2 sm:pt-0">
              <img 
                src={founder.image} 
                alt={founder.name}
                className="w-[110px] h-[110px] sm:w-40 sm:h-40 rounded-full object-cover border-4 border-background shadow-lg"
              />
              
              {/* Name and Role */}
              <div className="space-y-3 sm:space-y-2">
                <h3 
                  id="founder-title"
                  className="text-[22px] sm:text-2xl md:text-3xl font-bold text-primary leading-tight"
                >
                  {founder.name}
                </h3>
                
                {/* Accent Line */}
                <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
                
                <p className="text-base text-muted-foreground font-medium px-4">{founder.role}</p>
              </div>

              {/* Social Link Button - Full Width on Mobile */}
              {founder.instagram && (
                <div className="w-full px-4 sm:px-0 sm:w-auto pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 min-h-[44px] px-4"
                    onClick={() => window.open(founder.instagram, '_blank', 'noopener,noreferrer')}
                    aria-label={`Visit ${founder.name}'s Instagram profile`}
                  >
                    <Instagram size={18} />
                    <span>Follow on Instagram</span>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Biography Content */}
            <div id="founder-content" className="pt-4 px-2 sm:px-0">
              <p className="text-base text-foreground leading-[1.6] whitespace-pre-line">
                {founder.fullBio}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};