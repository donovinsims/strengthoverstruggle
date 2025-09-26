import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (hasShown) return;

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Mobile: Scroll and time-based triggers
    let scrollTimeout: NodeJS.Timeout;
    let timeTimeout: NodeJS.Timeout;
    let lastScrollY = 0;

    const handleMobileExitIntent = () => {
      if (!hasShown && isMobile) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    const handleScroll = () => {
      if (!isMobile) return;
      
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (currentScrollY / documentHeight) * 100;
      
      // Trigger if user scrolls up rapidly after being 50% down the page
      if (scrollDirection === 'up' && scrollPercent > 50 && currentScrollY < lastScrollY - 50) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleMobileExitIntent, 500);
      }
      
      // Trigger when user reaches bottom 20% of page
      if (scrollPercent >= 80) {
        handleMobileExitIntent();
      }
      
      lastScrollY = currentScrollY;
    };

    if (isMobile) {
      // Mobile triggers
      document.addEventListener('scroll', handleScroll, { passive: true });
      timeTimeout = setTimeout(handleMobileExitIntent, 30000); // 30 seconds
    } else {
      // Desktop trigger
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(timeTimeout);
    };
  }, [hasShown, isMobile]);

  const handleDonate = () => {
    window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="w-[95vw] sm:w-[90vw] max-w-lg mx-auto">        
        <ModalHeader className="text-center pb-4 pt-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <ModalTitle className="text-xl font-bold leading-tight">Before You Go...</ModalTitle>
          <ModalDescription className="text-base mt-2 leading-relaxed">
            Help us continue empowering youth through fitness and community support. 
            Every donation makes a difference in someone's life.
          </ModalDescription>
        </ModalHeader>

        <div className="flex flex-col gap-3 px-6 pb-6">
          <Button 
            onClick={handleDonate}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 py-3 text-base min-h-[48px] touch-manipulation"
          >
            Make a Donation
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full text-base min-h-[44px] touch-manipulation"
          >
            Maybe Later
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};