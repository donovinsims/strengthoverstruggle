import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { TestimonialModal } from "@/components/common/TestimonialModal";
import { FounderModal } from "@/components/common/FounderModal";
import { ExitIntentPopup } from "@/components/common/ExitIntentPopup";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FAQSection } from "@/components/sections/FAQSection";

import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import dylannFounderImage from "@/assets/dylann-founder-new.jpg";
import alexFounderImage from "@/assets/alex-founder.jpg";
import vanessaFounderImage from "@/assets/vanessa-founder.jpg";
import markhiThompsonImage from "@/assets/markhi-thompson.png";
import elenaHenryImage from "@/assets/elena-henry.png";
import ivanHernandezImage from "@/assets/ivan-hernandez.png";

const Index = () => {
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
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pb-32 md:pb-40 bg-background"
      >
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              Strength Over Struggle
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-8 py-6 text-lg font-semibold"
              onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
            >
              Donate Now
            </Button>
            <Button 
              variant="secondary" 
              className="px-8 py-6 text-lg"
              onClick={() => scrollToSection('mission')}
            >
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

      {/* Impact Section */}
      <section id="impact" className="py-16 md:py-20 px-6 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">540+</div>
              <div className="body-text font-medium text-lg">Months of Gym Memberships Donated</div>
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
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
            Our Story
          </h2>
          <div className="body-text leading-relaxed max-w-4xl mx-auto mb-8">
            <p>
              SOS Empowers individuals to overcome life's challenges through resilience, fitness, and community support. We are dedicated to turning adversity into strength by providing resources, education, and opportunities that inspire personal growth and healthier lifestyles.
            </p>
          </div>
          <div className="text-center">
            <Link to="/story" className="story-link text-primary font-medium hover:text-primary/80 transition-colors">
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 md:py-24 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
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
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[hsl(var(--icon-container))] hover:bg-[hsl(var(--icon-container-hover))] transition-colors duration-200 mb-4 md:mb-6">
                    <program.icon className="w-6 h-6 text-[hsl(var(--icon-color))] group-hover:text-[hsl(var(--icon-color-hover))] transition-colors duration-200" strokeWidth={1.5} />
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
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
              Real Impact Stories
            </h2>
            <p className="subtitle max-w-3xl mx-auto">
              See how access to fitness and mentorship is transforming lives in our communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
               {
                 id: "ivan",
                 name: "Ivan Hernandez",
                 role: "NCAA Powerlifter - Greenville University, 2025 graduate and gym membership recipient Beloit Fresh Start",
                 quote: "Through the Beloit Fresh Start program, I connected with Detective Limberg and many other awesome officers. The program taught me responsibility, accountability and collaboration...",
                 fullQuote: "Through the Beloit Fresh Start program, I connected with Detective Limberg and many other awesome officers. The program taught me responsibility, accountability and collaboration through the fun task and events we had with these officers.\n\nWhen it came to my down time, I found comfort in the gym and sports. Growing up I was inside a lot as I was bullied for being a bigger kid. I picked up a football when I was 9 and the rest turned into history because I excelled as an athlete and did everything I could to make myself better, so I started lifting.\n\nThe gym is like an escape from reality for me. I fall into depressive states here and there to the point where I just feel like laying in bed and throwing my day away. The gym has helped me pushed through those times and my new passion of powerlifting.\n\nI was blessed to receive a free membership from the help of Detective Limberg and the kind souls at ICONIQ. The local YMCA was my original stomping grounds when I first started lifting and that's when I found out what powerlifting was, so it was nostalgic and fun to be able to go back.\n\nUltimately, the gym is truly a treasure for those who want to better themselves. Many of us young adults and youth need more outlets for our anger, fear, and frustration as society bombards us from all directions. If it weren't for the gym then there's no telling what events could have led me to be a top Collegiate Powerlifter in the nation.",
                 image: ivanHernandezImage
               },
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
      <section id="founders" className="py-20 md:py-24 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
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
                instagram: "https://www.instagram.com/alex__limberg/",
                image: alexFounderImage
              },
              {
                id: "vanessa",
                name: "Vanessa Tellez",
                role: "Co-Founder/Treasurer",
                bio: "Registered Nurse, athlete, and youth wellness advocate pursuing a Doctorate of Nursing Practice.",
                fullBio: "Vanessa Tellez, a Registered Nurse, athlete, and youth wellness advocate, is an experienced emergency room nurse pursuing a Doctorate of Nursing Practice to become a Nurse Practitioner. With a strong background in clinical care and community service, she emphasizes the vital link between physical health, mental wellness, and accessible support.\n\nFitness has been transformative in Vanessa's life, inspiring her to run local 5Ks and participate in community events that support homeless youth and raise awareness for meaningful causes. Her passion for health extends beyond the hospital, as she works to create opportunities for young people to thrive physically, mentally, and emotionally.",
                instagram: "https://www.instagram.com/vanessa49x/",
                image: vanessaFounderImage
              },
              {
                id: "dylann",
                name: "Dylann Rauch",
                role: "Co-Founder/Vice President",
                bio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist.",
                fullBio: "Prior Professional Athlete, Child Maltreatment investigator, and Community Activist. Dylann Rauch is a prior professional quarterback, barber, and now Child Maltreatment Investigator. Dylann Rauch has multiple years of experience serving underserved youth and partnering with local schools, providing new opportunities for opportunistic youth. These activities include but are not limited to holiday community events, and sports like ice skating, self-defense classes, weight lifting, and football.",
                instagram: "",
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

      {/* FAQ Section */}
      <FAQSection />

      {/* Donate Section */}
      <section id="donate" className="py-20 md:py-28 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-primary">
            Make a Difference Today.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Your donation directly funds gym memberships, equipment, and programs that transform young lives. Every dollar makes an impact.
          </p>
          
          {/* Donation Card */}
          <div className="max-w-[600px] mx-auto">
            <Card className="rounded-[16px] pt-9 pb-7 px-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] bg-[#FAFAFA] dark:bg-card border-[1.5px]">
              <div className="flex flex-col items-center">
                <h3 className="font-manrope font-bold text-[32px] md:text-[48px] leading-[1.2] text-[hsl(var(--text-primary))] mb-3 md:mb-4">
                  One-Time Donation
                </h3>
                <p className="font-inter font-normal text-[18px] leading-[1.5] text-[#545454] dark:text-[#888888] mb-6">
                  Custom amount for immediate impact
                </p>
                <Button
                  size="lg"
                  className="w-[200px] h-[52px] rounded-[16px] text-[16px] font-semibold mb-3" 
                  onClick={() => window.open('https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00', '_blank', 'noopener,noreferrer')}
                >
                  Donate Now
                </Button>
                <p className="font-inter font-normal text-[13px] leading-[1.5] text-[#888888] dark:text-[#666666]">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-6 md:mt-8 px-4">
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Strength Over Struggle is a 501(c)(3) nonprofit organization. Your donations are tax-deductible.
            </p>
          </div>
        </div>
      </section>


      <Footer />
       
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

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

     </div>
  );
};

export default Index;