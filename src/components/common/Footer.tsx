import { Facebook, Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const contactInfo = [
    {
      icon: Facebook,
      title: "Facebook",
      content: "Follow Us",
      link: "https://www.facebook.com/profile.php?id=61577091357646"
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@_strengthoverstruggle_",
      link: "https://www.instagram.com/_strengthoverstruggle_/"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "strengthoverstrugglenfp@gmail.com",
      link: "mailto:strengthoverstrugglenfp@gmail.com"
    },
    {
      icon: MapPin,
      title: "Find Us",
      content: "Roscoe, Illinois",
      link: null
    }
  ];

  return (
    <footer className="bg-secondary py-16 md:py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Connect With Us
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            Ready to join the movement? Reach out to learn more about our programs or get involved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="text-center group hover-scale"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 group-hover:bg-primary/10 transition-colors">
                <info.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
              {info.link ? (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-text hover:text-primary transition-colors break-words block"
                >
                  {info.title === "Email Us" ? (
                    <>
                      <span className="lg:hidden">{info.content}</span>
                      <span className="hidden lg:inline">Email</span>
                    </>
                  ) : (
                    info.content
                  )}
                </a>
              ) : (
                <p className="body-text break-words">{info.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8" aria-label="Footer navigation">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/programs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Programs
          </Link>
          <Link to="/story" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Our Story
          </Link>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Shop
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="text-center pt-8 border-t border-border">
          <p className="body-text mb-2">
            © 2024 Strength Over Struggle. Empowering resilience, one person at a time.
          </p>
          <p className="text-sm text-muted-foreground">
            501(c)(3) Nonprofit Organization • Tax-Deductible Donations
          </p>
        </div>
      </div>
    </footer>
  );
};