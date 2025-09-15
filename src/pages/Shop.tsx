import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import wristbandImage from "@/assets/sos-wristband.png";

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-primary hover:opacity-90 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-primary">SOS Shop</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Support Our Mission
            </h1>
            <p className="subtitle mb-8 max-w-2xl mx-auto">
              Get your SOS Wristband and wear your strength while supporting our cause. Every purchase helps us continue empowering resilience in our community.
            </p>
          </div>

          {/* Product Section */}
          <div className="flex justify-center">
            <Card className="bg-card max-w-lg w-full">
              <CardContent className="p-8">
                <div className="aspect-square mb-6 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={wristbandImage} 
                    alt="SOS Wristband - White silicone wristband with 'I GET TO' text"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-3xl font-bold mb-4 text-primary text-center">
                  SOS Wristband
                </h2>
                
                <p className="body-text text-center mb-6 text-lg">
                  Wear your strength. Support the mission. This comfortable silicone wristband reminds you of your resilience every day while supporting our programs that empower others to overcome adversity.
                </p>
                
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-primary">$4.56</span>
                  <span className="body-text ml-2 text-lg">USD</span>
                </div>
                
                <Button 
                  className="w-full rounded-md py-6 text-lg font-medium"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'https://buy.stripe.com/test_7sYfZi6pAbh85Anf2Na3u01';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.click();
                  }}
                >
                  Buy Now
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Message */}
          <div className="mt-16 text-center">
            <Card className="bg-muted/50 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Your Purchase Makes a Difference
                </h3>
                <p className="body-text">
                  Every wristband sold directly supports our mission to empower resilience through mental, physical, and financial wellness programs. Thank you for being part of the strength over struggle movement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;