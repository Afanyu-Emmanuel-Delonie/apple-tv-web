import { useEffect } from 'react';
import { processExpiredEvents } from '../services/firebase/eventService';

/**
 * Background job component that runs periodically to check for expired events
 * Place this component in your main App or AdminLayout
 */
export default function EventExpirationJob() {
  useEffect(() => {
    // Run immediately on mount
    checkExpiredEvents();

    // Run every hour (3600000 ms)
    const interval = setInterval(() => {
      checkExpiredEvents();
    }, 3600000); // 1 hour

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const checkExpiredEvents = async () => {
    try {
      const result = await processExpiredEvents();
      if (result.success && result.processedCount > 0) {
        console.log(`✅ Processed ${result.processedCount} expired events`);
      }
    } catch (error) {
      console.error('❌ Error in event expiration job:', error);
    }
  };

  // This component doesn't render anything
  return null;
}
