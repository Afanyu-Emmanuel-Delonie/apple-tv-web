// Google Analytics 4 Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

let analytics = null;

// Initialize Google Analytics
export const initializeAnalytics = (firebaseApp) => {
  try {
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(firebaseApp);
      console.log('Google Analytics initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

// Track page views
export const trackPageView = (pageName, pageTitle = '') => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
};

// Track user engagement
export const trackEngagement = (action, category, label = '', value = 0) => {
  if (analytics) {
    logEvent(analytics, 'engagement', {
      action,
      category,
      label,
      value
    });
  }
};

// Track content interactions
export const trackContentInteraction = (contentType, contentId, action) => {
  if (analytics) {
    logEvent(analytics, 'content_interaction', {
      content_type: contentType,
      content_id: contentId,
      action
    });
  }
};

// Track search events
export const trackSearch = (searchTerm, category = '') => {
  if (analytics) {
    logEvent(analytics, 'search', {
      search_term: searchTerm,
      category
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName, success = true) => {
  if (analytics) {
    logEvent(analytics, 'form_submit', {
      form_name: formName,
      success
    });
  }
};

// Track user properties
export const setAnalyticsUserProperties = (properties) => {
  if (analytics) {
    setUserProperties(analytics, properties);
  }
};

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Track news article views
export const trackArticleView = (articleId, category, title) => {
  trackContentInteraction('article', articleId, 'view');
  trackCustomEvent('article_view', {
    article_id: articleId,
    category,
    title: title.substring(0, 100) // Limit title length
  });
};

// Track event views
export const trackEventView = (eventId, title, eventDate) => {
  trackContentInteraction('event', eventId, 'view');
  trackCustomEvent('event_view', {
    event_id: eventId,
    title: title.substring(0, 100),
    event_date: eventDate
  });
};

// Track opportunity views
export const trackOpportunityView = (opportunityId, type, company) => {
  trackContentInteraction('opportunity', opportunityId, 'view');
  trackCustomEvent('opportunity_view', {
    opportunity_id: opportunityId,
    type,
    company
  });
};

// Track story submissions
export const trackStorySubmission = (submissionType) => {
  trackFormSubmission('story_submission', true);
  trackCustomEvent('story_submitted', {
    submission_type: submissionType
  });
};

// Track admin actions
export const trackAdminAction = (action, resourceType, resourceId = '') => {
  trackCustomEvent('admin_action', {
    action,
    resource_type: resourceType,
    resource_id: resourceId
  });
};

export default {
  initializeAnalytics,
  trackPageView,
  trackEngagement,
  trackContentInteraction,
  trackSearch,
  trackFormSubmission,
  setAnalyticsUserProperties,
  trackCustomEvent,
  trackArticleView,
  trackEventView,
  trackOpportunityView,
  trackStorySubmission,
  trackAdminAction
};