import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Target, Mail, Phone, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Strength</span> Over{" "}
            <span className="text-foreground">Struggle</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Empowering individuals and communities to overcome life's challenges through 
            support, resources, and unwavering hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="animate-float">
              Get Support Now
            </Button>
            <Button variant="glass" size="xl">
              Learn Our Story
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We believe that everyone has the strength to overcome their struggles. 
              Our mission is to provide the tools, community, and support needed to transform challenges into triumphs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassionate Support",
                description: "Providing emotional and practical support to those facing life's toughest moments."
              },
              {
                icon: Users,
                title: "Strong Community",
                description: "Building connections between individuals who share similar struggles and victories."
              },
              {
                icon: Target,
                title: "Focused Impact",
                description: "Targeting resources where they're needed most to create lasting positive change."
              }
            ].map((item, index) => (
              <Card key={index} className="glass-card hover:glow-effect transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 gradient-text">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Making a <span className="gradient-text">Difference</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { number: "500+", label: "Lives Changed" },
              { number: "50+", label: "Community Partners" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Every day, we witness the incredible transformation that happens when people 
            are given the right support and resources to overcome their challenges.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your <span className="gradient-text">Strength</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you're seeking support or want to help others, we're here to guide you 
            on your journey from struggle to strength.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl">
              Get Help Today
            </Button>
            <Button variant="outline" size="xl">
              Become a Volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Connect</span> With Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Phone,
                title: "Call Us",
                content: "(555) 123-HOPE",
                subtitle: "Available 24/7 for emergencies"
              },
              {
                icon: Mail,
                title: "Email Us",
                content: "support@strengthoverstruggle.org",
                subtitle: "We respond within 24 hours"
              },
              {
                icon: MapPin,
                title: "Visit Us",
                content: "123 Hope Street, Community Center",
                subtitle: "Open Monday - Friday, 9AM - 6PM"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent mb-4">
                  <contact.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2 gradient-text">{contact.title}</h3>
                <p className="font-medium mb-1">{contact.content}</p>
                <p className="text-sm text-muted-foreground">{contact.subtitle}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-border/30">
            <p className="text-muted-foreground">
              © 2024 Strength Over Struggle. Together, we rise above our challenges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;