import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'organization' | 'nonprofit' | 'article' | 'faq' | 'breadcrumb';
  data?: any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    let structuredData: any = {};

    if (type === 'organization' || type === 'nonprofit') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Strength Over Struggle",
        "alternateName": "SOS",
        "url": "https://strength-over-struggle.com",
        "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/x7EeFRySlnOFmFxHHeksmS7IHhS2/uploads/1758597657699-sos_logo.jpeg",
        "description": "Empowering resilience through mental, physical, and financial wellness programs. A 501(c)(3) nonprofit organization transforming challenges into opportunities.",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "contact@strength-over-struggle.com",
          "contactType": "Customer Service"
        },
        "sameAs": [
          "https://www.instagram.com/strengthoverstruggle",
          "https://www.facebook.com/strengthoverstruggle"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "nonprofitStatus": "501(c)(3)",
        "foundingDate": "2021",
        "founder": [
          {
            "@type": "Person",
            "name": "Dylann Rauch"
          },
          {
            "@type": "Person",
            "name": "Alex Limberg"
          }
        ],
        "mission": "To empower youth and young adults through access to physical fitness, mental wellness resources, and life skills development programs."
      };
    } else if (type === 'article' && data) {
      structuredData = data;
    } else if (type === 'faq') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data || [
          {
            "@type": "Question",
            "name": "How does my donation help?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your donation directly funds gym memberships, mental wellness resources, and life skills programs for youth and young adults in need."
            }
          },
          {
            "@type": "Question",
            "name": "Is my donation tax-deductible?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Strength Over Struggle is a registered 501(c)(3) nonprofit organization, making all donations tax-deductible."
            }
          },
          {
            "@type": "Question",
            "name": "Can I set up a recurring donation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We offer monthly recurring donation options to provide sustained support for our programs."
            }
          }
        ]
      };
    } else if (type === 'breadcrumb' && data) {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'structured-data';
    
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
};
