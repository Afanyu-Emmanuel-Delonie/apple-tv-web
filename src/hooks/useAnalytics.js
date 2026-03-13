import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackEngagement,
  trackContentInteraction,
  trackSearch,
  trackFormSubmission,
  trackCustomEvent,
  trackArticleView,
  trackEventView,
  trackOpportunityView,
  trackStorySubmission,
  trackAdminAction
} from '../utils/analytics';

// Hook for automatic page view tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pageName = location.pathname;
    const pageTitle = document.title;
    trackPageView(pageName, pageTitle);
  }, [location]);
};

// Hook for content tracking
export const useContentTracking = () => {
  const trackArticle = (articleId, category, title) => {
    trackArticleView(articleId, category, title);
  };

  const trackEvent = (eventId, title, eventDate) => {
    trackEventView(eventId, title, eventDate);
  };

  const trackOpportunity = (opportunityId, type, company) => {
    trackOpportunityView(opportunityId, type, company);
  };

  return {
    trackArticle,
    trackEvent,
    trackOpportunity
  };
};

// Hook for form tracking
export const useFormTracking = () => {
  const trackSubmission = (formName, success = true) => {
    trackFormSubmission(formName, success);
  };

  const trackStorySubmit = (submissionType) => {
    trackStorySubmission(submissionType);
  };

  return {
    trackSubmission,
    trackStorySubmit
  };
};

// Hook for engagement tracking
export const useEngagementTracking = () => {
  const trackClick = (element, category = 'UI') => {
    trackEngagement('click', category, element);
  };

  const trackScroll = (percentage) => {
    trackEngagement('scroll', 'page', `${percentage}%`, percentage);
  };

  const trackTimeOnPage = (seconds) => {
    trackEngagement('time_on_page', 'engagement', '', seconds);
  };

  const trackSearch = (searchTerm, category = '') => {
    trackSearch(searchTerm, category);
  };

  return {
    trackClick,
    trackScroll,
    trackTimeOnPage,
    trackSearch
  };
};

// Hook for admin tracking
export const useAdminTracking = () => {
  const trackAction = (action, resourceType, resourceId = '') => {
    trackAdminAction(action, resourceType, resourceId);
  };

  return {
    trackAction
  };
};

// Hook for custom event tracking
export const useCustomTracking = () => {
  const trackEvent = (eventName, parameters = {}) => {
    trackCustomEvent(eventName, parameters);
  };

  const trackInteraction = (contentType, contentId, action) => {
    trackContentInteraction(contentType, contentId, action);
  };

  return {
    trackEvent,
    trackInteraction
  };
};

// Main analytics hook that combines all tracking capabilities
export const useAnalytics = () => {
  const contentTracking = useContentTracking();
  const formTracking = useFormTracking();
  const engagementTracking = useEngagementTracking();
  const adminTracking = useAdminTracking();
  const customTracking = useCustomTracking();

  return {
    ...contentTracking,
    ...formTracking,
    ...engagementTracking,
    ...adminTracking,
    ...customTracking
  };
};

export default useAnalytics;