import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Mail, Linkedin } from "lucide-react";
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
    email: string;
    linkedin: string;
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
            <div className="flex flex-col items-center space-y-4 text-center">
              <img 
                src={founder.image} 
                alt={founder.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">{founder.name}</h3>
                <p className="caption mb-4 text-sm sm:text-base">{founder.role}</p>
                
                <div className="flex justify-center space-x-4 sm:space-x-6">
                  <a
                    href={`mailto:${founder.email}`}
                    className="inline-flex items-center space-x-1 sm:space-x-2 text-primary hover:text-primary/80 transition-colors"
                    aria-label={`Email ${founder.name}`}
                  >
                    <Mail size={14} strokeWidth={1.5} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Email</span>
                  </a>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 sm:space-x-2 text-primary hover:text-primary/80 transition-colors"
                    aria-label={`${founder.name}'s LinkedIn profile`}
                  >
                    <Linkedin size={14} strokeWidth={1.5} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div id="founder-content">
              <p className="body-text leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {founder.fullBio}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};