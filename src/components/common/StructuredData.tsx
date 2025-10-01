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
        "@type": "NGO",
        "name": "Strength Over Struggle",
        "alternateName": "SOS Empowerment",
        "url": "https://strength-over-struggle.com",
        "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/x7EeFRySlnOFmFxHHeksmS7IHhS2/uploads/1758597657699-sos_logo.jpeg",
        "description": "Empowering individuals to overcome life's challenges through resilience, fitness, and community support. We provide gym memberships, life skills programs, and mentorship to transform adversity into strength.",
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressRegion": "Wisconsin"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Donor Relations",
          "email": "strengthoverstruggle23@gmail.com"
        },
        "sameAs": [
          "https://www.instagram.com/strength_over_struggle_org/"
        ],
        "founder": [
          {
            "@type": "Person",
            "name": "Alex Limberg",
            "jobTitle": "Founder and President",
            "description": "Detective, SWAT Operator, and Fitness Advocate"
          },
          {
            "@type": "Person",
            "name": "Dylann Rauch",
            "jobTitle": "Co-Founder and Vice President",
            "description": "Former Professional Athlete and Child Maltreatment Investigator"
          },
          {
            "@type": "Person",
            "name": "Vanessa Tellez",
            "jobTitle": "Co-Founder and Treasurer",
            "description": "Registered Nurse and Youth Wellness Advocate"
          }
        ],
        "nonprofitStatus": "Nonprofit501c3",
        "mission": "Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.",
        "knowsAbout": ["Youth Empowerment", "Physical Fitness", "Mental Wellness", "Community Support", "Life Skills Development"],
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Wisconsin, United States"
        }
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
