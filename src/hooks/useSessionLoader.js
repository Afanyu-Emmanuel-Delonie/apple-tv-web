import { useState, useEffect } from 'react';

// Session storage key to track if the app has been loaded in this session
const SESSION_LOADED_KEY = 'apple_fam_tv_session_loaded';

export function useSessionLoader(minLoadTime = 1500) {
  const [showLoader, setShowLoader] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  useEffect(() => {
    // Check if this is a fresh page load (reload or first visit)
    const isSessionLoaded = sessionStorage.getItem(SESSION_LOADED_KEY);
    const isPageReload = performance.navigation?.type === 1 || 
                        performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    // Show loader if:
    // 1. No session storage (first visit)
    // 2. Page was reloaded
    // 3. Navigation type indicates a fresh load
    if (!isSessionLoaded || isPageReload) {
      setShowLoader(true);
      setIsInitialLoad(true);
      
      // Set session storage to indicate app has been loaded
      sessionStorage.setItem(SESSION_LOADED_KEY, 'true');
      
      // Hide loader after minimum time
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, minLoadTime);

      return () => clearTimeout(timer);
    }
  }, [minLoadTime]);

  return { showLoader, isInitialLoad };
}

export function usePageReloadLoader(dependencies = [], minLoadTime = 1200) {
  const [loading, setLoading] = useState(true);
  const { showLoader, isInitialLoad } = useSessionLoader(minLoadTime);

  useEffect(() => {
    // Only show loading for data if this is an initial load
    if (isInitialLoad) {
      // Check if all dependencies are loaded
      const allLoaded = dependencies.every(dep => {
        if (Array.isArray(dep)) return dep.length >= 0;
        if (typeof dep === 'boolean') return dep === false;
        return dep !== null && dep !== undefined;
      });

      if (allLoaded) {
        setLoading(false);
      }
    } else {
      // If not initial load, don't show loading
      setLoading(false);
    }
  }, [...dependencies, isInitialLoad]);

  // Return true if we should show the session loader OR if we're loading data on initial load
  return showLoader || (isInitialLoad && loading);
}