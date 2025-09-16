import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import wristbandImage from "@/assets/sos-wristband.png";

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <main className="py-12 px-6">
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

        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 md:py-20 px-6 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-primary">
            Connect With Us
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center mb-12">
            {[
              {
                icon: Facebook,
                title: "Facebook",
                content: "Follow Us",
                subtitle: "Stay connected",
                link: "https://www.facebook.com/profile.php?id=61577091357646"
              },
              {
                icon: Instagram,
                title: "Instagram",
                content: "@_strengthoverstruggle_",
                subtitle: "Daily updates",
                link: "https://www.instagram.com/_strengthoverstruggle_/"
              },
              {
                icon: Mail,
                title: "Email Us",
                content: "strengthoverstrugglenfp@gmail.com",
                subtitle: "We respond within 24 hours",
                link: "mailto:strengthoverstrugglenfp@gmail.com"
              },
              {
                icon: MapPin,
                title: "Find Us",
                content: "Roscoe, Illinois",
                subtitle: "Serving our local area"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4">
                  <contact.icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold mb-2 text-primary">{contact.title}</h3>
                {contact.link ? (
                  <a 
                    href={contact.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium mb-1 text-primary hover:underline block"
                  >
                    {contact.content}
                  </a>
                ) : (
                  <p className="font-medium mb-1 text-primary">{contact.content}</p>
                )}
                <p className="caption">{contact.subtitle}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-8 border-t border-border">
            <p className="body-text">
              © 2024 Strength Over Struggle. Empowering resilience, one person at a time.
            </p>
          </div>
        </div>
       </footer>
    </div>
  );
};

export default Shop;