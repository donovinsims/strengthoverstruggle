import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FAQSection } from "@/components/sections/FAQSection";
import { useModalState } from "@/hooks/useModalState";
import { testimonials, Testimonial } from "@/data/testimonials";
import { founders, Founder } from "@/data/founders";
import { programs } from "@/data/programs";
import { APP_CONFIG } from "@/config/app.config";
import { hasDonationUrl, openDonationLink } from "@/lib/donations";

const TestimonialModal = lazy(async () => ({
  default: (await import("@/components/common/TestimonialModal")).TestimonialModal
}));

const FounderModal = lazy(async () => ({
  default: (await import("@/components/common/FounderModal")).FounderModal
}));

const ExitIntentPopup = lazy(async () => ({
  default: (await import("@/components/common/ExitIntentPopup")).ExitIntentPopup
}));

const Index = () => {
  const testimonialModal = useModalState<Testimonial>();
  const founderModal = useModalState<Founder>();
  const [shouldRenderExitIntent, setShouldRenderExitIntent] = useState(false);
  const donationAvailable = hasDonationUrl();

  // Smooth scroll function with offset for sticky header
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - APP_CONFIG.ui.headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (!donationAvailable) {
      setShouldRenderExitIntent(false);
      return;
    }

    if (shouldRenderExitIntent) return;

    const win = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const idleHandle = win.requestIdleCallback?.(
      () => setShouldRenderExitIntent(true),
      { timeout: 2000 }
    );

    const timeoutHandle = window.setTimeout(() => setShouldRenderExitIntent(true), 1800);

    return () => {
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
      window.clearTimeout(timeoutHandle);
    };
  }, [donationAvailable, shouldRenderExitIntent]);

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="max-w-[1920px] mx-auto">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pb-32 md:pb-40 bg-background"
          aria-labelledby="hero-heading"
        >
          <div className="container relative z-10 text-center animate-fade-in pt-20">
            <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Strength Over Struggle</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Building stronger communities through mental, physical, and financial wellness programs that transform challenges
              into opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {donationAvailable && (
                <Button
                  className="px-8 py-6 text-lg font-semibold"
                  onClick={() => openDonationLink()}
                >
                  Donate Now
                </Button>
              )}
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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-16 md:py-20 px-6 bg-background" aria-labelledby="impact-heading">
          <div className="container mx-auto text-center">
            <h2 id="impact-heading" className="text-5xl md:text-6xl font-extrabold mb-10 md:mb-12 text-primary">
              Our Impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{APP_CONFIG.impact.gymMemberships}</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">Months of Gym Memberships Donated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{APP_CONFIG.impact.communityPartners}</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">Community Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{APP_CONFIG.impact.livesTransformed}</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">Lives Transformed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-24 md:py-28 px-6" aria-labelledby="mission-heading">
          <div className="container mx-auto text-center">
            <h2 id="mission-heading" className="text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 text-primary">
              Our Story
            </h2>
            <div className="text-base leading-relaxed max-w-4xl mx-auto mb-8 text-muted-foreground">
              <p>
                SOS Empowers individuals to overcome life's challenges through resilience, fitness, and community support. We are
                dedicated to turning adversity into strength by providing resources, education, and opportunities that inspire
                personal growth and healthier lifestyles.
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
        <section id="programs" className="py-20 md:py-24 px-6 bg-background" aria-labelledby="programs-heading">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 id="programs-heading" className="text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 text-primary">
                Our Programs
              </h2>
              <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
                Comprehensive wellness programs designed to strengthen mind, body, and financial security.
              </p>
            </div>

            {/* Programs grid: Intentionally 2-column on desktop to match testimonial card width and visual weight */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {programs.map((program, index) => (
                <Card key={index} className="bg-card text-left">
                  <CardContent className="p-6 md:p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[hsl(var(--icon-container))] hover:bg-[hsl(var(--icon-container-hover))] transition-colors duration-200 mb-4 md:mb-6">
                      <program.icon
                        className="w-6 h-6 text-[hsl(var(--icon-color))] group-hover:text-[hsl(var(--icon-color-hover))] transition-colors duration-200"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 md:mb-4 text-primary">{program.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 md:py-28 px-6" aria-labelledby="testimonials-heading">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 text-primary">
                Real Impact Stories
              </h2>
              <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
                See how access to fitness and mentorship is transforming lives in our communities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-card cursor-pointer transition-transform hover:scale-105 min-h-[280px]"
                  onClick={() => testimonialModal.openModal(testimonial)}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center mb-4 md:mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{testimonial.name}</h3>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">"{testimonial.quote}"</p>
                    <button className="mt-4 md:mt-6 story-link text-primary font-medium text-sm">
                      Read Full Story
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section id="founders" className="py-20 md:py-24 px-6 bg-background" aria-labelledby="founders-heading">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 id="founders-heading" className="text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 text-primary">
                Meet Our Founders
              </h2>
              <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
                Driven by personal experience and a shared vision of empowerment through fitness and community support.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {founders.map((founder) => (
                <Card
                  key={founder.id}
                  className="bg-card cursor-pointer transition-transform hover:scale-105 text-center"
                  onClick={() => founderModal.openModal(founder)}
                >
                  <CardContent className="p-8">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                    />
                    <h3 className="text-2xl font-semibold mb-2 text-primary">{founder.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{founder.role}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-6">"{founder.bio}"</p>
                    <button className="story-link text-primary font-medium text-sm">
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
        <section id="donate" className="py-20 md:py-28 px-6" aria-labelledby="donate-heading">
          <div className="container mx-auto text-center">
            <h2 id="donate-heading" className="text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 text-primary">
              Make a Difference Today.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Your donation directly funds gym memberships, equipment, and programs that transform young lives. Every dollar makes
              an impact.
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
                  {donationAvailable ? (
                    <>
                      <Button
                        size="lg"
                        className="w-[200px] h-[52px] rounded-[16px] text-[16px] font-semibold mb-3"
                        onClick={() => openDonationLink()}
                      >
                        Donate Now
                      </Button>
                      <p className="font-inter font-normal text-[13px] leading-[1.5] text-[#888888] dark:text-[#666666]">
                        Secure checkout powered by Stripe
                      </p>
                    </>
                  ) : (
                    <p className="font-inter font-normal text-[15px] leading-[1.5] text-[#666666] dark:text-[#888888] text-center">
                      Donation link coming soon. Update your environment configuration after remixing to enable online gifts.
                    </p>
                  )}
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
      </main>

      <Footer />

      {/* Modals */}
      <Suspense fallback={null}>
        {testimonialModal.selectedItem && (
          <TestimonialModal
            isOpen={testimonialModal.isOpen}
            onClose={testimonialModal.closeModal}
            testimonial={testimonialModal.selectedItem}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {founderModal.selectedItem && (
          <FounderModal
            isOpen={founderModal.isOpen}
            onClose={founderModal.closeModal}
            founder={founderModal.selectedItem}
          />
        )}
      </Suspense>

      {/* Exit Intent Popup */}
      {shouldRenderExitIntent && donationAvailable && (
        <Suspense fallback={null}>
          <ExitIntentPopup />
        </Suspense>
      )}
    </div>
  );
};

export default Index;