import { useEffect } from 'react';
import { processExpiredOpportunities } from '../services/firebase/opportunityService';

/**
 * Background job component that runs periodically to check for expired opportunities
 * Place this component in your main App or AdminLayout
 */
export default function OpportunityExpirationJob() {
  useEffect(() => {
    // Run immediately on mount
    checkExpiredOpportunities();

    // Run every hour (3600000 ms)
    const interval = setInterval(() => {
      checkExpiredOpportunities();
    }, 3600000); // 1 hour

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const checkExpiredOpportunities = async () => {
    try {
      const result = await processExpiredOpportunities();
      if (result.success && result.processedCount > 0) {
        console.log(`✅ Processed ${result.processedCount} expired opportunities`);
      }
    } catch (error) {
      console.error('❌ Error in expiration job:', error);
    }
  };

  // This component doesn't render anything
  return null;
}
