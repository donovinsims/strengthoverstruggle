import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        className="max-w-3xl w-full mx-4 md:mx-auto bg-card border border-border animate-scale-in max-h-[90vh] overflow-y-auto"
        aria-labelledby="founder-title"
        aria-describedby="founder-content"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle 
              id="founder-title"
              className="text-xl font-semibold text-primary"
            >
              About {founder.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Close biography"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img 
              src={founder.image} 
              alt={founder.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-primary mb-2">{founder.name}</h3>
              <p className="caption mb-4">{founder.role}</p>
              
              <div className="flex justify-center sm:justify-start space-x-4">
                <a
                  href={`mailto:${founder.email}`}
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Email ${founder.name}`}
                >
                  <Mail size={16} strokeWidth={1.5} />
                  <span className="text-sm">Email</span>
                </a>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  aria-label={`${founder.name}'s LinkedIn profile`}
                >
                  <Linkedin size={16} strokeWidth={1.5} />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          <div id="founder-content">
            <p className="body-text leading-relaxed">
              {founder.fullBio}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};