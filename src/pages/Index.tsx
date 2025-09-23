import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Zap, Mail, MapPin, Menu, X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { TestimonialModal } from "@/components/common/TestimonialModal";
import { FounderModal } from "@/components/common/FounderModal";

import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import dylannFounderImage from "@/assets/dylann-founder-new.jpg";
import alexFounderImage from "@/assets/alex-founder.jpg";
import vanessaFounderImage from "@/assets/vanessa-founder.jpg";
import markhiThompsonImage from "@/assets/markhi-thompson.png";
import elenaHenryImage from "@/assets/elena-henry.png";

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
                onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
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
                  onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
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
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pb-32 md:pb-40"
        style={{
          background: 'radial-gradient(125% 125% at 50% 90%, #000000 40%, rgba(255,255,255,0.15) 100%)',
        }}
      >
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              Building Strength<br className="md:hidden" />
              <span className="md:inline"> Over Struggle</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-md px-8 py-6 text-lg font-semibold animate-pulse hover:scale-105 transition-transform"
              onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
            >
              Donate Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 rounded-md px-8 py-6 text-lg"
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
      <section id="impact" className="py-16 md:py-20 px-6 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">
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
      <section id="mission" className="py-24 md:py-28 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">
            Our Mission
          </h2>
          <div className="body-text leading-relaxed max-w-4xl mx-auto">
            <p>
              SOS Empowers individuals to overcome life's challenges through resilience, fitness, and community support. We are dedicated to turning adversity into strength by providing resources, education, and opportunities that inspire personal growth and healthier lifestyles.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 md:py-24 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">
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
                description: "Providing access to quality gym facilities and fitness programs that promote health, strength, and physical confidence."
              },
              {
                icon: Heart,
                title: "Community Building",
                description: "Creating supportive environments where youth can connect, build friendships, and develop positive peer relationships."
              },
              {
                icon: Zap,
                title: "Life Skills",
                description: "Teaching discipline, goal-setting, perseverance, and self-confidence through structured fitness programs and mentorship."
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
      <section id="testimonials" className="py-24 md:py-28 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">
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
                 quote: "I would say it made a big impact in all areas of students' lives. I was seeing kids I never had seen outside of school at the gym, allowing students to bond more and get work in at the same time...",
                 fullQuote: "I would say it made a big impact in all areas of students' lives. I was seeing kids I never had seen outside of school at the gym, allowing students to bond more and get work in at the same time. I personally was doing boxing and in the gym prior to receiving the donated memberships but found that it can get expensive… very expensive.\n\nIt would be amazing if this could be an ongoing thing for all kids in Beloit instead of just Beloit Fresh Start students. It would make a big impact. I've seen it personally, and I think it will motivate the youth to take care of themselves and build themselves.\n\nThe gym teaches discipline, character, consistency, confidence, and many more things. That was one of the best experiences I had with boxing, teaching kids combat the right way and how to keep themselves safe.\n\nIt's not just a free membership it's a new way of living and meeting new people with the same mindset. …",
                  image: markhiThompsonImage
               },
               {
                 id: "elena",
                 name: "Elena Henry",
                 role: "Youth Development Program Manager, Beloit Fresh Start", 
                 quote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space...",
                 fullQuote: "As an educator, I've seen how Alex Limberg and Dylann Rauch's nonprofit gym memberships transformed my students. About 60 joined over the last couple years and loved the safe, structured space to exercise, relieve stress, and build confidence.\n\nFor many, it was their first gym experience—opening their eyes to healthy routines. This program fills a crucial gap for students without resources or support and deserves strong backing for youth health and community engagement.",
                 image: elenaHenryImage
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
      <section id="founders" className="py-20 md:py-24 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">
              Meet Our Founders
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              Driven by personal experience and a shared vision of empowerment through fitness and community support.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                id: "vanessa",
                name: "Vanessa Tellez",
                role: "Co-Founder/Treasurer",
                bio: "Registered Nurse, athlete, and youth wellness advocate pursuing a Doctorate of Nursing Practice.",
                fullBio: "Vanessa Tellez, a Registered Nurse, athlete, and youth wellness advocate, is an experienced emergency room nurse pursuing a Doctorate of Nursing Practice to become a Nurse Practitioner. With a strong background in clinical care and community service, she emphasizes the vital link between physical health, mental wellness, and accessible support.\n\nFitness has been transformative in Vanessa's life, inspiring her to run local 5Ks and participate in community events that support homeless youth and raise awareness for meaningful causes. Her passion for health extends beyond the hospital, as she works to create opportunities for young people to thrive physically, mentally, and emotionally.",
                email: "vanessa@strengthoverstruggle.org",
                linkedin: "https://linkedin.com/in/vanessatellez",
                image: vanessaFounderImage
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
      <section id="donate" className="py-28 md:py-32 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-primary">
            Make a Difference Today.
          </h2>
          <p className="subtitle mb-12 max-w-2xl mx-auto">
            Your donation directly funds gym memberships, equipment, and programs that transform young lives. Every dollar makes an impact.
          </p>
          
          {/* Donation Cards - 5 card layout */}
          <div className="max-w-6xl mx-auto">
            {/* Top row - 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <Card className="rounded-md p-6 hover-scale transition-transform">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">One-Time</h3>
                  <p className="text-sm text-muted-foreground mb-3">donation</p>
                  <p className="text-sm mb-4">Custom amount for immediate impact</p>
                  <Button
                    className="rounded-md w-full" 
                    onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
                  >
                    Donate Now
                  </Button>
                </div>
              </Card>

              <Card className="rounded-md p-6 hover-scale transition-transform">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">$25</h3>
                  <p className="text-sm text-muted-foreground mb-3">per month</p>
                  <p className="text-sm mb-4">Half of average gym membership</p>
                  <Button
                    className="rounded-md w-full" 
                    onClick={() => window.open('https://buy.stripe.com/test_5kQ7sM8xIfxoe6T8Epa3u07', '_blank', 'noopener,noreferrer')}
                  >
                    Subscribe Monthly
                  </Button>
                </div>
              </Card>

              <Card className="rounded-md p-6 hover-scale transition-transform">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">$50</h3>
                  <p className="text-sm text-muted-foreground mb-3">per month</p>
                  <p className="text-sm mb-4">U.S Average monthly gym membership (2025)</p>
                  <Button 
                    className="rounded-md w-full" 
                    onClick={() => window.open('https://buy.stripe.com/test_4gMaEYcNYad4bYL1bXa3u06', '_blank', 'noopener,noreferrer')}
                  >
                    Subscribe Monthly
                  </Button>
                </div>
              </Card>
            </div>

            {/* Bottom row - 1 card */}
            <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
              <Card className="rounded-md p-6 hover-scale transition-transform">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">$100</h3>
                  <p className="text-sm text-muted-foreground mb-3">per month</p>
                  <p className="text-sm mb-4">Helps 2 kids access monthly wellness programs</p>
                  <Button
                    className="rounded-md w-full" 
                    onClick={() => window.open('https://buy.stripe.com/test_00w3cw29kad40g307Ta3u08', '_blank', 'noopener,noreferrer')}
                  >
                    Subscribe Monthly
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>


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