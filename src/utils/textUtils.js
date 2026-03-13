// Text utility functions for consistent truncation and length limits

// Text length limits configuration
export const TEXT_LIMITS = {
  // Headlines
  HEADLINE_SHORT: 60,      // For card titles
  HEADLINE_MEDIUM: 80,     // For featured articles
  HEADLINE_LONG: 120,      // For hero sections
  
  // Excerpts/Descriptions
  EXCERPT_SHORT: 100,      // For small cards
  EXCERPT_MEDIUM: 160,     // For article cards
  EXCERPT_LONG: 200,       // For featured sections
  
  // Meta descriptions
  META_DESCRIPTION: 160,   // For SEO meta tags
  
  // Author names
  AUTHOR_NAME: 30,
  
  // Category names
  CATEGORY_NAME: 20,
  
  // Event/Opportunity titles
  EVENT_TITLE: 70,
  OPPORTUNITY_TITLE: 80,
  
  // Company names
  COMPANY_NAME: 40,
  
  // Location names
  LOCATION_NAME: 50
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  // Find the last space before the limit to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If there's a space within reasonable distance, cut there
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + suffix;
  }
  
  return truncated + suffix;
};

// Truncate text by words instead of characters
export const truncateByWords = (text, maxWords, suffix = '...') => {
  if (!text) return '';
  
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  
  return words.slice(0, maxWords).join(' ') + suffix;
};

// Smart truncation that preserves sentence structure
export const smartTruncate = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  // Try to end at a sentence
  const truncated = text.substring(0, maxLength);
  const lastSentence = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  // If we found a sentence end within reasonable distance
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  // Otherwise, truncate at word boundary
  return truncateText(text, maxLength, suffix);
};

// Format text for specific use cases
export const formatHeadline = (text, context = 'default') => {
  const limits = {
    card: TEXT_LIMITS.HEADLINE_SHORT,
    featured: TEXT_LIMITS.HEADLINE_MEDIUM,
    hero: TEXT_LIMITS.HEADLINE_LONG,
    default: TEXT_LIMITS.HEADLINE_MEDIUM
  };
  
  return truncateText(text, limits[context] || limits.default);
};

export const formatExcerpt = (text, context = 'default') => {
  const limits = {
    card: TEXT_LIMITS.EXCERPT_SHORT,
    featured: TEXT_LIMITS.EXCERPT_MEDIUM,
    hero: TEXT_LIMITS.EXCERPT_LONG,
    default: TEXT_LIMITS.EXCERPT_MEDIUM
  };
  
  return smartTruncate(text, limits[context] || limits.default);
};

export const formatAuthor = (text) => {
  return truncateText(text, TEXT_LIMITS.AUTHOR_NAME);
};

export const formatCategory = (text) => {
  return truncateText(text, TEXT_LIMITS.CATEGORY_NAME, '');
};

export const formatEventTitle = (text) => {
  return truncateText(text, TEXT_LIMITS.EVENT_TITLE);
};

export const formatOpportunityTitle = (text) => {
  return truncateText(text, TEXT_LIMITS.OPPORTUNITY_TITLE);
};

export const formatCompanyName = (text) => {
  return truncateText(text, TEXT_LIMITS.COMPANY_NAME);
};

export const formatLocation = (text) => {
  return truncateText(text, TEXT_LIMITS.LOCATION_NAME);
};

export const formatMetaDescription = (text) => {
  return smartTruncate(text, TEXT_LIMITS.META_DESCRIPTION);
};

// Count words in text
export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

// Count characters in text
export const countCharacters = (text) => {
  if (!text) return 0;
  return text.length;
};

// Check if text exceeds limit
export const exceedsLimit = (text, limit) => {
  if (!text) return false;
  return text.length > limit;
};

// Get reading time estimate
export const getReadingTime = (text, wordsPerMinute = 200) => {
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
};

// Clean text for display (remove extra whitespace, line breaks)
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n+/g, ' ')  // Replace line breaks with spaces
    .trim();
};

// Extract first sentence from text
export const getFirstSentence = (text) => {
  if (!text) return '';
  
  const match = text.match(/^[^.!?]*[.!?]/);
  return match ? match[0].trim() : truncateText(text, 100);
};