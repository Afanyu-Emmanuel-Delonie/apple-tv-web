import { useState, useEffect } from 'react';

export function usePageLoader(dependencies = [], minLoadTime = 1000) {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Check if all dependencies are loaded
    const allLoaded = dependencies.every(dep => {
      if (Array.isArray(dep)) return dep.length >= 0; // Arrays are loaded when they exist
      if (typeof dep === 'boolean') return dep === false; // Boolean loading states
      return dep !== null && dep !== undefined; // Other values are loaded when not null/undefined
    });

    if (allLoaded && initialLoad) {
      // Ensure minimum load time for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
        setInitialLoad(false);
      }, minLoadTime);

      return () => clearTimeout(timer);
    } else if (allLoaded) {
      setIsLoading(false);
    }
  }, [...dependencies, initialLoad, minLoadTime]);

  return isLoading;
}

export function useInitialLoader(loadingStates = [], minLoadTime = 1500) {
  const [showLoader, setShowLoader] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Check if all loading states are false (meaning loading is complete)
    const allLoaded = loadingStates.every(state => state === false);
    
    if (allLoaded) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
      }, remainingTime);
    }
  }, [loadingStates, minLoadTime, startTime]);

  return showLoader;
}