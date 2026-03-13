import { getAll, update, remove, create, COLLECTIONS } from './firestore';

/**
 * Check and process expired opportunities
 * - Expires opportunities past their deadline
 * - Deletes opportunities 5 days after expiration
 * - Creates notifications for both actions
 */
export async function processExpiredOpportunities() {
  try {
    const opportunities = await getAll(COLLECTIONS.OPPORTUNITIES);
    const now = new Date();
    const notifications = [];

    for (const opp of opportunities) {
      const deadline = new Date(opp.deadline);
      
      // Check if opportunity is active and past deadline
      if (opp.status === 'active' && deadline < now) {
        // Expire the opportunity
        await update(COLLECTIONS.OPPORTUNITIES, opp.id, {
          status: 'expired',
          expiryDate: new Date().toISOString()
        });

        // Create notification for expiration
        notifications.push({
          type: 'opportunity_expired',
          title: 'Opportunity Expired',
          message: `"${opp.title}" has expired and will be auto-deleted in 5 days.`,
          relatedId: opp.id,
          relatedType: 'opportunity',
          read: false,
          createdAt: new Date().toISOString()
        });

        console.log(`✅ Expired: ${opp.title}`);
      }

      // Check if opportunity should be deleted (5 days after expiration)
      if (opp.status === 'expired' && opp.expiryDate) {
        const expiryDate = new Date(opp.expiryDate);
        const daysSinceExpiry = Math.floor((now - expiryDate) / (1000 * 60 * 60 * 24));

        if (daysSinceExpiry >= 5) {
          // Delete the opportunity
          await remove(COLLECTIONS.OPPORTUNITIES, opp.id);

          // Create notification for deletion
          notifications.push({
            type: 'opportunity_deleted',
            title: 'Opportunity Auto-Deleted',
            message: `"${opp.title}" was automatically deleted 5 days after expiration.`,
            relatedId: opp.id,
            relatedType: 'opportunity',
            read: false,
            createdAt: new Date().toISOString()
          });

          console.log(`🗑️ Deleted: ${opp.title}`);
        }
      }
    }

    // Create all notifications
    for (const notification of notifications) {
      await create(COLLECTIONS.NOTIFICATIONS, notification);
    }

    return {
      success: true,
      processedCount: notifications.length
    };
  } catch (error) {
    console.error('Error processing expired opportunities:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get days until deletion for an expired opportunity
 * @param {string} expiryDate - ISO date string
 * @returns {number} Days remaining until deletion
 */
export function getDaysUntilDeletion(expiryDate) {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const deleteDate = new Date(expiry.getTime() + 5 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

/**
 * Check if a deadline is in the past
 * @param {string} deadline - ISO date string
 * @returns {boolean}
 */
export function isDeadlinePassed(deadline) {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day
  return deadlineDate < now;
}

/**
 * Validate deadline is not in the past
 * @param {string} deadline - ISO date string
 * @returns {boolean}
 */
export function isValidDeadline(deadline) {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadlineDate >= today;
}
