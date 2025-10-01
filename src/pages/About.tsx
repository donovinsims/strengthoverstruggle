import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              About Strength Over Struggle
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              A 501(c)(3) nonprofit dedicated to empowering youth through fitness, community, and mentorship programs.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-primary text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Strength Over Struggle empowers individuals to overcome life's challenges through resilience, fitness, and community support. We are dedicated to turning adversity into strength by providing resources, education, and opportunities that inspire personal growth and healthier lifestyles.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Compassion</h3>
                  <p className="text-muted-foreground">Supporting those facing adversity with empathy and understanding</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Community</h3>
                  <p className="text-muted-foreground">Building strong networks of support and encouragement</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-primary">Growth</h3>
                  <p className="text-muted-foreground">Fostering personal development through wellness programs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">Our Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">540+</div>
                <p className="text-muted-foreground">Gym Membership Months Donated</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">4</div>
                <p className="text-muted-foreground">Community Partners</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">Growing</div>
                <p className="text-muted-foreground">Lives Transformed</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
