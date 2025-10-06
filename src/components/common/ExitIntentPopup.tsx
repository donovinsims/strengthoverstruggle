import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useExitIntent } from "@/hooks/useExitIntent";
import { getDonationUrl, openDonationLink } from "@/lib/donations";

export const ExitIntentPopup = () => {
  const donationUrl = getDonationUrl();
  const donationAvailable = Boolean(donationUrl);
  const { isOpen, setIsOpen } = useExitIntent(donationAvailable);

  if (!donationAvailable) {
    return null;
  }

  const handleDonate = () => {
    if (openDonationLink()) {
      setIsOpen(false);
    }
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