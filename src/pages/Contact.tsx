import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      content: "strengthoverstrugglenfp@gmail.com",
      link: "mailto:strengthoverstrugglenfp@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Roscoe, Illinois",
      link: null,
      description: "Serving the community locally"
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "Follow Us",
      link: "https://www.facebook.com/profile.php?id=61577091357646",
      description: "Connect with us on Facebook"
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@_strengthoverstruggle_",
      link: "https://www.instagram.com/_strengthoverstruggle_/",
      description: "Follow our journey on Instagram"
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
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our programs? Want to get involved? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="bg-card hover-scale">
                  <CardContent className="p-8">
                    <div className="flex items-start">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mr-4 flex-shrink-0">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2 text-primary">{method.title}</h2>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        {method.link ? (
                          <a
                            href={method.link}
                            target={method.link.startsWith('http') ? '_blank' : undefined}
                            rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-primary hover:underline font-medium break-words"
                          >
                            {method.content}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{method.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 px-6 bg-secondary">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary">Ways to Get Involved</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Donate</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Support our mission with a tax-deductible donation to fund programs and memberships.
                  </p>
                  <a
                    href="https://buy.stripe.com/dRm8wPdPX6lW48F0Esfbq00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Donate Now →
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Partner With Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Collaborate with us to expand our reach and impact in the community.
                  </p>
                  <a
                    href="mailto:strengthoverstrugglenfp@gmail.com?subject=Partnership Inquiry"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Email Us →
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Spread the Word</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Follow us on social media and help us reach more youth in need.
                  </p>
                  <a
                    href="https://www.instagram.com/_strengthoverstruggle_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Follow Us →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
