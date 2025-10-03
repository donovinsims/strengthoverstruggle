export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: "01",
    number: "01",
    question: "What is Strength Over Struggle?",
    answer: "Strength Over Struggle is a U.S.-based nonprofit organization dedicated to empowering individuals to build resilience through mental, physical, and financial wellness programs. We believe that everyone can overcome adversity with the right support and tools.",
  },
  {
    id: "02",
    number: "02",
    question: "How are donations used?",
    answer: "100% of donations go directly to program operations, including gym memberships, fitness equipment, and wellness workshops. We maintain full transparency in our operations and are committed to maximizing the impact of every dollar donated.",
  },
  {
    id: "03",
    number: "03",
    question: "Is my donation tax-deductible?",
    answer: "Yes! Strength Over Struggle is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. You will receive a receipt for your records after each contribution.",
  },
  {
    id: "04",
    number: "04",
    question: "Can I volunteer without donating?",
    answer: "Absolutely! We welcome volunteers who want to support our mission through their time and skills. Whether you're interested in mentoring, organizing events, or helping with programs, there are many ways to get involved.",
  },
  {
    id: "05",
    number: "05",
    question: "What programs do you offer?",
    answer: "We offer comprehensive wellness programs including physical fitness through gym memberships, community building activities that foster connections, and life skills training that teaches discipline, goal-setting, and confidence. Learn more in our Programs section above.",
  },
  {
    id: "06",
    number: "06",
    question: "How can I stay updated?",
    answer: "Follow us on Instagram @strengthoverstruggle to see real-time updates, success stories, and upcoming events. You can also reach out through our contact information in the footer to join our mailing list.",
  },
  {
    id: "07",
    number: "07",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure Stripe payment processing system. All transactions are encrypted and secure.",
  },
  {
    id: "08",
    number: "08",
    question: "Where are you located and who do you serve?",
    answer: "We're based in Beloit, Wisconsin and primarily serve youth and young adults in underserved communities. We partner with local schools, community centers, and organizations to reach those who can benefit most from our programs.",
  },
];
