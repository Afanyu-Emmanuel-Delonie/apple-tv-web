// SEO utility functions for dynamic meta tags and structured data

export const updatePageMeta = ({ title, description, keywords, canonical, image }) => {
  // Update title
  if (title) {
    document.title = `${title} | Apple Fam TV`;
  }
  
  // Update meta description
  if (description) {
    updateMetaTag('description', description);
  }
  
  // Update keywords
  if (keywords) {
    updateMetaTag('keywords', keywords);
  }
  
  // Update canonical URL
  if (canonical) {
    updateCanonicalLink(canonical);
  }
  
  // Update Open Graph tags
  if (title) {
    updateMetaProperty('og:title', `${title} | Apple Fam TV`);
    updateMetaProperty('twitter:title', `${title} | Apple Fam TV`);
  }
  
  if (description) {
    updateMetaProperty('og:description', description);
    updateMetaProperty('twitter:description', description);
  }
  
  if (canonical) {
    updateMetaProperty('og:url', canonical);
    updateMetaProperty('twitter:url', canonical);
  }
  
  if (image) {
    updateMetaProperty('og:image', image);
    updateMetaProperty('twitter:image', image);
  }
};

const updateMetaTag = (name, content) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property, content) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateCanonicalLink = (href) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

// Generate structured data for articles
export const generateArticleStructuredData = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || article.content?.substring(0, 160),
    "image": article.imageUrl || "https://applefamtv.com/assets/apple-tv-logo.png",
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": {
      "@type": "Organization",
      "name": "Apple Fam TV"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Apple Fam TV",
      "logo": {
        "@type": "ImageObject",
        "url": "https://applefamtv.com/assets/apple-tv-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://applefamtv.com/article/${article.id}`
    },
    "articleSection": article.category,
    "keywords": article.tags?.join(', ') || article.category
  };
};

// Generate structured data for events
export const generateEventStructuredData = (event) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "image": event.imageUrl || "https://applefamtv.com/assets/apple-tv-logo.png",
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": event.location
    },
    "organizer": {
      "@type": "Organization",
      "name": "Apple Fam TV"
    },
    "offers": event.price ? {
      "@type": "Offer",
      "price": event.price,
      "priceCurrency": "XAF"
    } : undefined
  };
};

// Generate structured data for job opportunities
export const generateJobStructuredData = (job) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.createdAt,
    "validThrough": job.deadline,
    "employmentType": job.type || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company
    },
    "jobLocation": {
      "@type": "Place",
      "address": job.location
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "XAF",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary
      }
    } : undefined
  };
};

// Insert structured data into page
export const insertStructuredData = (data) => {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"][data-dynamic]');
  if (existing) {
    existing.remove();
  }
  
  // Insert new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// SEO-friendly URL slugs
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Extract keywords from content
export const extractKeywords = (content, category) => {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
  
  return [category, 'Cameroon', 'Apple Fam TV', ...topWords].join(', ');
};