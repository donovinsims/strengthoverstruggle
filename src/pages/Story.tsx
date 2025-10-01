import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SEO } from "@/components/common/SEO";
import { StructuredData } from "@/components/common/StructuredData";

const Story = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Our Story – Strength Over Struggle | Why We Exist"
        description="Learn the powerful story behind Strength Over Struggle, from a tragic encounter to a mission that has provided 540+ months of gym access to youth in need."
        keywords="nonprofit story, youth empowerment mission, gym membership charity, community support, strength over struggle story, dylann rauch"
        canonical="https://strength-over-struggle.com/story"
        ogType="article"
      />
      <StructuredData 
        type="article"
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Our Story – Why Strength Over Struggle Exists",
          "author": {
            "@type": "Person",
            "name": "Dylann Rauch"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Strength Over Struggle",
            "logo": {
              "@type": "ImageObject",
              "url": "https://storage.googleapis.com/gpt-engineer-file-uploads/x7EeFRySlnOFmFxHHeksmS7IHhS2/uploads/1758597657699-sos_logo.jpeg"
            }
          },
          "datePublished": "2021-01-01",
          "description": "The journey from a tragic encounter to a nonprofit that has provided over 540 months of gym memberships to youth in need."
        }}
      />
      <Header showDonateButton={false} />

      {/* Main content */}
      <main className="py-24 md:py-28 px-6">
        <div className="container mx-auto max-w-4xl animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Our Story
            </h1>
            <p className="subtitle text-lg">
              The journey that led to Strength Over Struggle
            </p>
          </div>

          <div className="max-w-none">
            <div className="body-text leading-relaxed space-y-8">
              <p>
                In the winter of 2021, while serving as a new patrol officer, I was dispatched to what was supposed to be a routine family disturbance. A young man was struggling to manage his situation, and my partner and I were focused on preventing it from escalating into an arrest.
              </p>

              <p>
                After nearly half an hour of conversation, it became painfully clear that he had nowhere to turn. No guardians, no family to stay with, no friends to call. When I suggested cooling off at the local YMCA, he explained that it wasn't an option, he didn't have a membership.
              </p>

              <p>
                That moment has stayed with me. Growing up, I always had resources—family, friends, mentors, and even a gym where I could escape when life felt heavy. This young man had none of those. I felt as though I had failed him because I couldn't provide a safe place. His only options were to risk going back inside, where the situation could lead to his arrest, or to turn to the streets.
              </p>

              <p>
                Not long after, I learned he had tragically lost his life to gun violence.
              </p>

              <p>
                That experience changed me. It showed me that if we truly want to keep young men and women off the streets, we must create outlets, healthy, safe spaces where they can go when life feels overwhelming. I couldn't give someone more family or friends, but I could help provide an outlet. For me, and for many others, that outlet is the gym.
              </p>

              <p>
                With the support of friends, family, and the community, I launched a fundraiser to provide gym memberships for young adults in need. The response was overwhelming. In just two years, we provided over 540 months of gym memberships, 540 months of growth, safety, and belonging. Inspired by this impact, we knew it was time to build something bigger.
              </p>

              <p>
                That's why Strength Over Struggle was born.
              </p>

              <p>
                We exist to give youth and young adults the safe spaces and positive resources they may not otherwise have. A gym membership may seem small, but to someone without options, it can mean everything: a place to go, a place to grow, and even a chance to change the course of their future.
              </p>

              <p>
                This is our mission. This is our why.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/">
              <Button className="rounded-md px-8">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Story;