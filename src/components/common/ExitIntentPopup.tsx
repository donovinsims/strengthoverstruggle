import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to top of viewport (exit intent)
      if (e.clientY <= 5 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Add event listener
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleDonate = () => {
    window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="max-w-md mx-4">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors"
          aria-label="Close popup"
        >
          <X size={16} />
        </button>
        
        <ModalHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <ModalTitle className="text-xl font-bold">Before You Go...</ModalTitle>
          <ModalDescription className="text-base mt-2">
            Help us continue empowering youth through fitness and community support. 
            Every donation makes a difference in someone's life.
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={handleDonate}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 py-3"
          >
            Make a Donation
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};