import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, BookOpen, Heart } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      icon: Dumbbell,
      title: "Physical Wellness Programs",
      description: "Providing access to quality gym facilities and fitness programs that promote health, strength, and physical confidence.",
      benefits: [
        "Free gym memberships for qualifying youth",
        "Personal training and fitness coaching",
        "Strength training and cardio programs",
        "Nutrition guidance and education"
      ]
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating supportive environments where youth can connect, build friendships, and develop positive peer relationships.",
      benefits: [
        "Group fitness classes and activities",
        "Community events and workshops",
        "Peer mentorship programs",
        "Social support networks"
      ]
    },
    {
      icon: BookOpen,
      title: "Life Skills Development",
      description: "Teaching discipline, goal-setting, perseverance, and self-confidence through structured fitness programs and mentorship.",
      benefits: [
        "Goal-setting workshops",
        "Leadership development",
        "Conflict resolution training",
        "Career guidance and planning"
      ]
    },
    {
      icon: Heart,
      title: "Mental Wellness Support",
      description: "Promoting mental health through physical activity, mindfulness, and access to supportive resources.",
      benefits: [
        "Stress management techniques",
        "Mindfulness and meditation",
        "Mental health awareness",
        "Crisis support resources"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Our Programs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive wellness programs designed to strengthen mind, body, and community connections.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <Card key={index} className="bg-card">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-muted mb-6">
                      <program.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-primary">{program.title}</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {program.description}
                    </p>
                    <h3 className="font-semibold text-primary mb-3">Program Benefits:</h3>
                    <ul className="space-y-2">
                      {program.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-muted-foreground">
                          <span className="mr-2 text-primary">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary">Get Involved</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Interested in participating in our programs or partnering with us? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:strengthoverstrugglenfp@gmail.com"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Support Our Programs
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Programs;
