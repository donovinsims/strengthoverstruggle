import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Story = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Our Story
            </h1>
            <p className="subtitle text-lg">
              The journey that led to Strength Over Struggle
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="body-text leading-relaxed space-y-8">
              <p>
                Strength Over Struggle was born from personal experience and a shared vision of transforming adversity into opportunity. Our founders, each having faced their own challenges, recognized the powerful impact that fitness, community support, and mentorship can have on overcoming life's obstacles.
              </p>

              <p>
                The organization emerged from the understanding that many young people in our community lack access to the resources and support systems necessary to build resilience and thrive. Through their professional and personal journeys, our founders witnessed firsthand how physical wellness, combined with strong community connections, could be transformative.
              </p>

              <p>
                What started as informal mentorship and support evolved into a structured mission to provide comprehensive wellness programs. We recognized that true strength comes not from avoiding struggle, but from developing the tools, support, and mindset to overcome challenges and emerge stronger.
              </p>

              <p>
                Today, Strength Over Struggle continues to grow, driven by the belief that every individual has the potential to transform their challenges into strength. Our programs are designed to meet people where they are, providing the resources, community, and guidance needed to build lasting resilience.
              </p>

              <p>
                Our story is still being written, with each person we serve adding new chapters of growth, transformation, and hope. We invite you to be part of this continuing story of strength over struggle.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/">
              <Button className="rounded-md px-8">
                Learn About Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Story;