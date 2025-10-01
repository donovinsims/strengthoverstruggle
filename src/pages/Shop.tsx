import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import wristbandImage from "@/assets/sos-wristband.png";

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="py-24 md:py-28 px-6">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Support Our Mission
            </h1>
            <p className="subtitle mb-8 max-w-2xl mx-auto">
              Get your SOS Wristband and wear your strength while supporting our cause. Every purchase helps us continue empowering resilience in our community.
            </p>
          </div>

          {/* Product Section */}
          <div className="flex justify-center">
            <Card className="bg-card max-w-lg w-full hover-scale">
              <CardContent className="p-6">
                <div className="aspect-[4/3] mb-4 bg-muted rounded-lg overflow-hidden">
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
                  disabled
                >
                  Coming Soon
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;