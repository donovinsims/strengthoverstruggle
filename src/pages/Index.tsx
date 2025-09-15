import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Zap, Mail, Phone, MapPin, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { TestimonialModal } from "@/components/common/TestimonialModal";
import { FounderModal } from "@/components/common/FounderModal";
import { StarButton } from "@/components/ui/star-button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import dylannFounderImage from "@/assets/dylann-founder.png";
import alexFounderImage from "@/assets/alex-founder.jpg";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-secondary border-b border-border backdrop-blur-md' 
          : 'bg-transparent border-transparent'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-primary">
              SOS
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
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{
          background: 'radial-gradient(125% 125% at 50% 90%, #000000 40%, rgba(255,255,255,0.15) 100%)',
        }}
      >
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Resilience.<br />
            <span className="gradient-text">Overcoming Adversity.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <StarButton 
              className="bg-white text-black hover:bg-white/90 font-semibold"
              onClick={() => scrollToSection('donate')}
            >
              Donate Now
            </StarButton>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 rounded-md px-6 py-3 text-base"
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

          {/* Programs grid: Intentionally 2-column on desktop to match testimonial card width and visual weight */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                <CardContent className="p-6 md:p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4 md:mb-6">
                    <program.icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 md:mb-4 text-primary">{program.title}</h3>
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
              Real Impact Stories
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              See how access to fitness and mentorship is transforming lives in our communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
               {
                 id: "markhi",
                 name: "Markhi Thompson",
                 role: "2024 Class President and Gym Membership Recipient, Beloit Fresh Start",
                 quote: "I received a donated gym and boxing membership that truly impacted us students. I saw classmates bonding and working hard together at the gym—people I'd never seen outside of school...",
                 fullQuote: "I received a donated gym and boxing membership that truly impacted us students. I saw classmates bonding and working hard together at the gym—people I'd never seen outside of school.\n\nI was already into boxing and the gym, but memberships get expensive. This program motivates youth to stay healthy, teaches discipline, character, confidence, and gives kids a safe place off the streets.\n\nFor me, it wasn't just a free membership—it sparked a lifestyle. I'm still in the gym today, now paying for my own membership. This should happen more for all Beloit youth.",
                 image: "/placeholder.svg"
               },
               {
                 id: "elena",
                 name: "Elena Henry",
                 role: "Youth Development Program Manager, Beloit Fresh Start", 
                 quote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space...",
                 fullQuote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space to exercise, relieve stress, and build confidence.\n\nFor many, it was their first gym experience—opening their eyes to healthy routines. This program fills a crucial gap for students without resources or support and deserves strong backing for youth health and community engagement.",
                 image: "/placeholder.svg"
               }
            ].map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="bg-card cursor-pointer hover-scale min-h-[280px]"
                onClick={() => openTestimonialModal(testimonial)}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-4 md:mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                      <p className="caption">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="body-text italic">"{testimonial.quote}"</p>
                  <button className="mt-4 md:mt-6 story-link text-primary font-medium">
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
              Driven by personal experience and a shared vision of empowerment through fitness and community support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[
              {
                id: "alex",
                name: "Alex Limberg",
                role: "Founder/President",
                bio: "Detective, Swat Operator, and Fitness Fanatic. Alex Limberg is an athlete and law enforcement officer.",
                fullBio: "Detective, Swat Operator, and Fitness Fanatic. Alex Limberg is an athlete and law enforcement officer. Through personal and professional experiences, Alex understands the impact and need for youth and young-adults to have positive support systems and healthy coping opportunities. He founded SOS to promote physical and mental health in deserving and opportunistic youth.",
                email: "alex@strengthoverstruggle.org",
                linkedin: "https://linkedin.com/in/alexlimberg",
                image: alexFounderImage
              },
              {
                id: "dylann",
                name: "Dylann Rauch",
                role: "Co-Founder/Vice President",
                bio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist.",
                fullBio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist. Dylann Rauch is a prior professional quarterback, barber, and now Child Maltreatment Investigator. Dylann Rauch has multiple years of experience serving underserved youth and partnering with local schools, providing new opportunities for opportunistic youth. These activities include but are not limited to holiday community events, and sports like ice skating, self-defense classes, weight lifting, and football.",
                email: "dylann@strengthoverstruggle.org",
                linkedin: "https://linkedin.com/in/dylannrauch",
                image: dylannFounderImage
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
            <StarButton className="bg-primary text-primary-foreground hover:opacity-90">
              Make a Donation
            </StarButton>
            <Button variant="outline" className="rounded-md px-6 py-3 text-base">
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