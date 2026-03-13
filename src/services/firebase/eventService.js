import { getAll, update, remove, create, COLLECTIONS } from './firestore';

/**
 * Check and process expired events
 * - Expires events past their date
 * - Deletes events 3 days after expiration (for extensions)
 * - Creates notifications for both actions
 */
export async function processExpiredEvents() {
  try {
    const events = await getAll(COLLECTIONS.EVENTS);
    const now = new Date();
    const notifications = [];

    for (const event of events) {
      const eventDate = new Date(event.date);
      
      // Check if event is active and past its date
      if (event.status === 'active' && eventDate < now) {
        // Expire the event
        await update(COLLECTIONS.EVENTS, event.id, {
          status: 'expired',
          expiryDate: new Date().toISOString()
        });

        // Create notification for expiration
        notifications.push({
          type: 'event_expired',
          title: 'Event Expired',
          message: `"${event.title}" has expired and will be auto-deleted in 3 days (in case of extensions).`,
          relatedId: event.id,
          relatedType: 'event',
          read: false,
          createdAt: new Date().toISOString()
        });

        console.log(`✅ Expired: ${event.title}`);
      }

      // Check if event should be deleted (3 days after expiration)
      if (event.status === 'expired' && event.expiryDate) {
        const expiryDate = new Date(event.expiryDate);
        const daysSinceExpiry = Math.floor((now - expiryDate) / (1000 * 60 * 60 * 24));

        if (daysSinceExpiry >= 3) {
          // Delete the event
          await remove(COLLECTIONS.EVENTS, event.id);

          // Create notification for deletion
          notifications.push({
            type: 'event_deleted',
            title: 'Event Auto-Deleted',
            message: `"${event.title}" was automatically deleted 3 days after expiration.`,
            relatedId: event.id,
            relatedType: 'event',
            read: false,
            createdAt: new Date().toISOString()
          });

          console.log(`🗑️ Deleted: ${event.title}`);
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
    console.error('Error processing expired events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get days until deletion for an expired event
 * @param {string} expiryDate - ISO date string
 * @returns {number} Days remaining until deletion
 */
export function getDaysUntilDeletion(expiryDate) {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const deleteDate = new Date(expiry.getTime() + 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

/**
 * Check if an event date is in the past
 * @param {string} eventDate - ISO date string
 * @returns {boolean}
 */
export function isEventDatePassed(eventDate) {
  if (!eventDate) return false;
  const date = new Date(eventDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day
  return date < now;
}

/**
 * Validate event date is not in the past
 * @param {string} eventDate - ISO date string
 * @returns {boolean}
 */
export function isValidEventDate(eventDate) {
  if (!eventDate) return false;
  const date = new Date(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}
