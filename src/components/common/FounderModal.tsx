import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
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
        className="w-[95vw] sm:w-[90vw] max-w-lg mx-auto max-h-[90vh] sm:max-h-[85vh] bg-card border border-border animate-scale-in flex flex-col rounded-md overflow-hidden"
        aria-labelledby="founder-title"
        aria-describedby="founder-content"
      >
        <DialogHeader className="text-left flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle 
              id="founder-title"
              className="text-xl font-semibold text-primary"
            >
              Meet {founder.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
              aria-label="Close founder profile"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <img 
                src={founder.image} 
                alt={founder.name}
                className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-primary text-lg sm:text-base">{founder.name}</h3>
                <p className="caption text-sm">{founder.role}</p>
                
                {founder.instagram && (
                  <a
                    href={founder.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-xs mt-1"
                    aria-label={`${founder.name}'s Instagram profile`}
                  >
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
            
            <div id="founder-content">
              <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line">
                {founder.fullBio}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};