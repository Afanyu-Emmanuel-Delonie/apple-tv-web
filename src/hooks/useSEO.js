import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageMeta, insertStructuredData } from '../utils/seo';
import { formatMetaDescription } from '../utils/textUtils';

export const useSEO = ({ 
  title, 
  description, 
  keywords, 
  image,
  structuredData,
  type = 'website'
}) => {
  const location = useLocation();
  
  useEffect(() => {
    const canonical = `https://applefamtv.com${location.pathname}`;
    
    // Update meta tags
    updatePageMeta({
      title,
      description: description ? formatMetaDescription(description) : description,
      keywords,
      canonical,
      image
    });
    
    // Insert structured data if provided
    if (structuredData) {
      insertStructuredData(structuredData);
    }
    
    // Update Open Graph type
    let meta = document.querySelector('meta[property="og:type"]');
    if (meta) {
      meta.content = type;
    }
    
    // Cleanup function to reset to default on unmount
    return () => {
      if (location.pathname !== '/') {
        updatePageMeta({
          title: 'Apple Fam TV - Cameroon News, Opportunities & Community Stories',
          description: 'Your trusted digital media platform for Cameroon news, international updates, job opportunities, events, and community stories.',
          keywords: 'Cameroon news, African news, job opportunities, events, community stories, regional news, international news, business news, Apple Fam TV',
          canonical: 'https://applefamtv.com'
        });
      }
    };
  }, [title, description, keywords, image, structuredData, type, location.pathname]);
};