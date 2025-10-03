import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqData } from "@/data/faq";

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
          <p className="text-base md:text-lg max-w-3xl text-muted-foreground">
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
