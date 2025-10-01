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
        className="w-[95vw] sm:w-[90vw] max-w-2xl mx-auto max-h-[90vh] sm:max-h-[85vh] bg-card border-none shadow-[0px_8px_24px_rgba(0,0,0,0.18)] dark:shadow-[0px_8px_32px_rgba(0,0,0,0.4)] animate-scale-in flex flex-col rounded-[16px] overflow-hidden p-8 sm:p-10"
        aria-labelledby="founder-title"
        aria-describedby="founder-content"
      >
        {/* Close Button - Top Right, More Prominent */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full w-10 h-10 flex items-center justify-center bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Close founder profile"
        >
          <X size={20} />
        </button>

        <ScrollArea className="flex-1 overflow-y-auto -mr-4 pr-4">
          <div className="space-y-8">
            {/* Avatar Section - Centered, Larger */}
            <div className="flex flex-col items-center text-center space-y-4">
              <img 
                src={founder.image} 
                alt={founder.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-background shadow-lg"
              />
              
              {/* Name and Role */}
              <div className="space-y-2">
                <h3 
                  id="founder-title"
                  className="text-2xl sm:text-3xl font-bold text-primary"
                >
                  {founder.name}
                </h3>
                
                {/* Accent Line */}
                <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
                
                <p className="text-base text-muted-foreground font-medium">{founder.role}</p>
              </div>

              {/* Social Link Button */}
              {founder.instagram && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(founder.instagram, '_blank', 'noopener,noreferrer')}
                  aria-label={`Visit ${founder.name}'s Instagram profile`}
                >
                  <Instagram size={16} />
                  <span>Follow on Instagram</span>
                </Button>
              )}
            </div>
            
            {/* Biography Content */}
            <div id="founder-content" className="pt-4">
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