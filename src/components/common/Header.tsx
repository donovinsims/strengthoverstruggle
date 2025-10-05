import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import TallyPopupButton from "./TallyPopupButton";

interface HeaderProps {
  showDonateButton?: boolean;
  onDonateClick?: () => void;
}

export const Header = ({ 
  showDonateButton = true, 
  onDonateClick = () => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen
        ? 'bg-secondary border-b border-border backdrop-blur-md' 
        : 'bg-transparent border-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            SOS
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/story"
              className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
            >
              Our Story
            </Link>
            <Link 
              to="/shop"
              className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
            >
              Shop
            </Link>
            <TallyPopupButton
              formId="n9bWWE"
              buttonText="Contact"
              buttonVariant="secondary"
              className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              unstyled
            />
            <ThemeToggle />
            {showDonateButton && (
              <Button 
                onClick={onDonateClick}
                className="rounded-md px-6"
              >
                Donate Now
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/story"
                className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link 
                to="/shop"
                className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <TallyPopupButton
                formId="n9bWWE"
                buttonText="Contact"
                buttonVariant="secondary"
                className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90 w-full"
                unstyled
              />
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Theme</span>
                <ThemeToggle />
              </div>
              {showDonateButton && (
                <Button 
                  onClick={() => {
                    onDonateClick();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-md px-6 w-full"
                >
                  Donate Now
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};