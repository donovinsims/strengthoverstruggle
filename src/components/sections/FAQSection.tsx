import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "01",
    number: "01",
    question: "What is Strength Over Struggle?",
    answer: "Strength Over Struggle is a U.S.-based nonprofit organization dedicated to empowering individuals to build resilience through mental, physical, and financial wellness programs. We believe that everyone can overcome adversity with the right support and tools."
  },
  {
    id: "02",
    number: "02",
    question: "How are donations used?",
    answer: "100% of donations go directly to program operations, including gym memberships, fitness equipment, and wellness workshops. We maintain full transparency in our operations and are committed to maximizing the impact of every dollar donated."
  },
  {
    id: "03",
    number: "03",
    question: "Is my donation tax-deductible?",
    answer: "Yes! Strength Over Struggle is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. You will receive a receipt for your records after each contribution."
  },
  {
    id: "04",
    number: "04",
    question: "Can I volunteer without donating?",
    answer: "Absolutely! We welcome volunteers who want to support our mission through their time and skills. Whether you're interested in mentoring, organizing events, or helping with programs, there are many ways to get involved."
  },
  {
    id: "05",
    number: "05",
    question: "What programs do you offer?",
    answer: "We offer comprehensive wellness programs including physical fitness through gym memberships, community building activities that foster connections, and life skills training that teaches discipline, goal-setting, and confidence. Learn more in our Programs section above."
  },
  {
    id: "06",
    number: "06",
    question: "How can I stay updated?",
    answer: "Follow us on Instagram @strengthoverstruggle to see real-time updates, success stories, and upcoming events. You can also reach out through our contact information in the footer to join our mailing list."
  },
  {
    id: "07",
    number: "07",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure Stripe payment processing system. All transactions are encrypted and secure."
  },
  {
    id: "08",
    number: "08",
    question: "Where are you located and who do you serve?",
    answer: "We're based in the United States and primarily serve youth and young adults in underserved communities. We partner with local schools, community centers, and organizations to reach those who can benefit most from our programs."
  }
];

export const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(id);
    }
  };

  return (
    <section id="faq" className="py-20 md:py-24 px-6 bg-background">
      <div className="container mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-primary">
            Got questions? We've got answers.
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
            Everything you need to know about supporting our mission
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            
            return (
              <div
                key={faq.id}
                className="bg-card border-[1.5px] border-[hsl(var(--card-border))] rounded-[12px] overflow-hidden transition-all duration-300 ease-in-out"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  onKeyDown={(e) => handleKeyDown(e, faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[hsl(var(--card-hover))] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-h-[44px]"
                >
                  {/* Numbered Badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center">
                    <span className="font-manrope font-bold text-[14px] text-primary">
                      {faq.number}
                    </span>
                  </div>

                  {/* Question Text */}
                  <span className="flex-1 font-manrope font-bold text-[16px] md:text-[18px] leading-[1.5] tracking-[-0.2px] text-[hsl(var(--text-primary))]">
                    {faq.question}
                  </span>

                  {/* Plus/X Icon */}
                  <div className="flex-shrink-0">
                    <Plus
                      className={cn(
                        "w-6 h-6 text-primary transition-transform duration-300 ease-in-out",
                        isOpen && "rotate-45"
                      )}
                      strokeWidth={2}
                    />
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-6 pb-5 pt-0">
                    <div className="pl-14">
                      <p className="font-inter font-medium text-[15px] md:text-[16px] leading-[1.6] text-[hsl(var(--text-secondary))]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
