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
      <ModalContent className="max-w-sm mx-4 sm:max-w-md sm:mx-auto w-[calc(100vw-2rem)] max-h-[90vh] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 rounded-full hover:bg-secondary transition-colors touch-manipulation"
          aria-label="Close popup"
        >
          <X size={18} className="sm:w-4 sm:h-4" />
        </button>
        
        <ModalHeader className="text-center pb-3 sm:pb-4 pt-2 px-2 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <ModalTitle className="text-lg sm:text-xl font-bold leading-tight">Before You Go...</ModalTitle>
          <ModalDescription className="text-sm sm:text-base mt-2 leading-relaxed px-2">
            Help us continue empowering youth through fitness and community support. 
            Every donation makes a difference in someone's life.
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-3 pt-2 px-2 sm:px-6 pb-2">
          <Button 
            onClick={handleDonate}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 py-3 text-sm sm:text-base min-h-[48px] touch-manipulation"
          >
            Make a Donation
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="w-full text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Maybe Later
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};