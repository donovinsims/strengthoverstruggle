import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Zap, Mail, Phone, MapPin, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { TestimonialModal } from "@/components/common/TestimonialModal";
import { FounderModal } from "@/components/common/FounderModal";
import { Link } from "react-router-dom";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);

  const openTestimonialModal = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsTestimonialModalOpen(true);
  };

  const openFounderModal = (founder: any) => {
    setSelectedFounder(founder);
    setIsFounderModalOpen(true);
  };

  // Smooth scroll function with offset for sticky header
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-secondary border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-primary">
              Strength Over Struggle
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              >
                Impact
              </button>
              <button 
                onClick={() => scrollToSection('mission')}
                className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              >
                Mission
              </button>
              <button 
                onClick={() => scrollToSection('programs')}
                className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              >
                Programs
              </button>
              <Link 
                to="/shop"
                className="text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
              >
                Shop
              </Link>
              <Button 
                onClick={() => scrollToSection('donate')}
                className="rounded-md px-6"
              >
                Donate Now
              </Button>
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
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-4 pt-4">
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('impact')}
                  className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                >
                  Impact
                </button>
                <button 
                  onClick={() => scrollToSection('mission')}
                  className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                >
                  Mission
                </button>
                <button 
                  onClick={() => scrollToSection('programs')}
                  className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                >
                  Programs
                </button>
                <Link 
                  to="/shop"
                  className="text-left text-secondary-foreground hover:text-primary transition-opacity hover:opacity-90"
                >
                  Shop
                </Link>
                <Button 
                  onClick={() => scrollToSection('donate')}
                  className="rounded-md px-6 w-full"
                >
                  Donate Now
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-background">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Resilience.<br />
            <span className="gradient-text">Overcoming Adversity.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
              onClick={() => scrollToSection('donate')}
            >
              Donate Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
              onClick={() => scrollToSection('mission')}
            >
              Learn Our Story
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-6 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">540+</div>
              <div className="body-text font-medium text-lg">Gym Membership Months Donated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4</div>
              <div className="body-text font-medium text-lg">Community Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">Growing</div>
              <div className="body-text font-medium text-lg">Lives Transformed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
            Our Mission
          </h2>
          <div className="space-y-8 body-text leading-relaxed max-w-4xl mx-auto">
            <p>
              At Strength Over Struggle, we believe that resilience is not just about surviving life's challenges—it's about thriving through them. Our mission is to empower individuals and families with the tools, resources, and community support they need to transform adversity into strength.
            </p>
            <p>
              We focus on three core pillars of wellness: mental health support that builds emotional resilience, physical wellness programs that strengthen the body and spirit, and financial literacy that creates pathways to stability and independence.
            </p>
            <p>
              Every person deserves the opportunity to overcome their struggles and discover their inherent strength. Through comprehensive programs, community partnerships, and unwavering support, we're building a movement where no one faces their challenges alone.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Our Programs
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              Comprehensive wellness programs designed to strengthen mind, body, and financial security.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Physical Wellness",
                description: "Gym memberships, fitness programs, and wellness coaching to build physical strength and mental resilience through movement and healthy habits."
              },
              {
                icon: Heart,
                title: "Community Building",
                description: "Support groups, mentorship programs, and community events that create lasting connections and shared experiences of growth and healing."
              },
              {
                icon: Zap,
                title: "Life Skills",
                description: "Financial literacy workshops, career development, and practical life skills training that create pathways to independence and stability."
              }
            ].map((program, index) => (
              <Card key={index} className="bg-card text-left">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-6">
                    <program.icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">{program.title}</h3>
                  <p className="body-text">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Stories of Transformation
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              Real stories from real people whose lives have been transformed through our programs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: "sarah",
                name: "Sarah M.",
                role: "Program Graduate",
                quote: "This program gave me the strength I never knew I had...",
                fullQuote: "This program gave me the strength I never knew I had. After struggling with anxiety and financial stress for years, the combination of physical wellness and life skills training helped me rebuild my confidence. The gym membership kept me active while the financial literacy workshops gave me the tools to take control of my finances. Today, I'm debt-free and stronger than ever.",
                image: "/placeholder.svg"
              },
              {
                id: "marcus",
                name: "Marcus T.",
                role: "Community Member",
                quote: "The community support changed everything for me...",
                fullQuote: "The community support changed everything for me. Coming from a difficult background, I never thought I'd find a place where people truly cared about my success. The mentorship program connected me with someone who believed in me when I didn't believe in myself. Through the life skills training, I learned how to manage money, find stable employment, and build healthy relationships.",
                image: "/placeholder.svg"
              },
              {
                id: "jennifer",
                name: "Jennifer K.",
                role: "Volunteer & Former Participant",
                quote: "I went from struggling single mom to community leader...",
                fullQuote: "I went from struggling single mom to community leader through this incredible organization. The physical wellness programs helped me manage stress and build confidence, while the financial literacy courses taught me how to budget and save for my family's future. Now I volunteer to help other families find their strength, just like I found mine.",
                image: "/placeholder.svg"
              }
            ].map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="bg-card cursor-pointer hover-scale"
                onClick={() => openTestimonialModal(testimonial)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                      <p className="caption">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="body-text italic">"{testimonial.quote}"</p>
                  <button className="mt-4 story-link text-primary font-medium">
                    Read Full Story
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Meet Our Founders
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              The passionate leaders behind Strength Over Struggle, dedicated to empowering resilience in our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[
              {
                id: "alex",
                name: "Alex Limberg",
                role: "Co-Founder & Executive Director",
                bio: "Passionate advocate for community wellness and resilience...",
                fullBio: "Alex Limberg brings over a decade of experience in community development and nonprofit leadership to Strength Over Struggle. After witnessing firsthand how financial stress and lack of resources can devastate families, Alex dedicated his career to creating comprehensive support systems that address the root causes of struggle. With a background in social work and business administration, Alex has successfully launched multiple community programs that have served thousands of individuals and families. His vision for holistic wellness - combining mental, physical, and financial health - forms the foundation of our organization's approach. Alex believes that everyone deserves the opportunity to transform their challenges into strengths, and his leadership continues to inspire both our team and the communities we serve.",
                email: "alex@strengthoverstruggle.org",
                linkedin: "https://linkedin.com/in/alexlimberg",
                image: "/placeholder.svg"
              },
              {
                id: "dylann",
                name: "Dylann Rauch",
                role: "Co-Founder & Program Director",
                bio: "Expert in wellness programming and community engagement...",
                fullBio: "Dylann Rauch's journey to co-founding Strength Over Struggle began with her own transformation through fitness and community support. As a certified wellness coach and former program participant in similar initiatives, Dylann understands the power of combining physical activity with emotional and financial support. Her expertise in program development has been instrumental in creating our comprehensive wellness curricula that address the whole person. Dylann holds certifications in personal training, mental health first aid, and financial counseling, allowing her to bridge the gap between different aspects of wellness. Her empathetic leadership style and deep understanding of the challenges our participants face make her an invaluable advocate and mentor. Under her guidance, our programs have achieved remarkable success rates in helping individuals build lasting, positive change in their lives.",
                email: "dylann@strengthoverstruggle.org",
                linkedin: "https://linkedin.com/in/dylannrauch",
                image: "/placeholder.svg"
              }
            ].map((founder) => (
              <Card 
                key={founder.id} 
                className="bg-card cursor-pointer hover-scale text-center"
                onClick={() => openFounderModal(founder)}
              >
                <CardContent className="p-8">
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-primary">{founder.name}</h3>
                  <p className="caption mb-4">{founder.role}</p>
                  <p className="body-text mb-6">"{founder.bio}"</p>
                  <button className="story-link text-primary font-medium">
                    Read Full Biography
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Section Placeholder */}
      <section id="donate" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Join the Movement. Make a Difference Today.
          </h2>
          <p className="subtitle mb-8 max-w-2xl mx-auto">
            Your support helps us provide essential resources and programs to those who need them most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="rounded-md px-8 py-6 text-lg font-medium">
              Make a Donation
            </Button>
            <Button variant="outline" className="rounded-md px-8 py-6 text-lg">
              Become a Volunteer
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-primary">
            Connect With Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            {[
              {
                icon: Phone,
                title: "Call Us",
                content: "(555) 123-HOPE",
                subtitle: "Available for support"
              },
              {
                icon: Mail,
                title: "Email Us",
                content: "info@strengthoverstruggle.org",
                subtitle: "We respond within 24 hours"
              },
              {
                icon: MapPin,
                title: "Find Us",
                content: "Community Center",
                subtitle: "Serving our local area"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4">
                  <contact.icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold mb-2 text-primary">{contact.title}</h3>
                <p className="font-medium mb-1 text-primary">{contact.content}</p>
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
       
       {/* Modals */}
       <TestimonialModal
         isOpen={isTestimonialModalOpen}
         onClose={() => setIsTestimonialModalOpen(false)}
         testimonial={selectedTestimonial}
       />
       
       <FounderModal
         isOpen={isFounderModalOpen}
         onClose={() => setIsFounderModalOpen(false)}
         founder={selectedFounder}
       />
     </div>
  );
};

export default Index;