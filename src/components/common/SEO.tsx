import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEO = ({
  title = 'Strength Over Struggle – Transforming Adversity into Growth',
  description = 'Join Strength Over Struggle to find resources, support, and mentorship that help you overcome challenges and build resilience. Empower your journey today.',
  keywords = 'nonprofit, youth empowerment, gym memberships, mental wellness, physical fitness, resilience, community support, 501c3, strength over struggle',
  canonical,
  ogImage = 'https://i.postimg.cc/DyxDRNj3/Xnapper-2025-09-22-22-21-28-8-FDA45-A1-B44F-4-A3-F-8671-9-CE5-F90-C0-CD0.png',
  ogType = 'website'
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update meta description
    updateMetaTag('description', description, true);
    updateMetaTag('keywords', keywords, true);

    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:image', ogImage);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (linkElement) {
        linkElement.href = canonical;
      } else {
        linkElement = document.createElement('link');
        linkElement.rel = 'canonical';
        linkElement.href = canonical;
        document.head.appendChild(linkElement);
      }
    }
  }, [title, description, keywords, canonical, ogImage, ogType]);

  return null;
};
