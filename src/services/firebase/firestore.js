import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { app } from './config';

export const db = app ? getFirestore(app) : null;

/**
 * Collection names
 */
export const COLLECTIONS = {
  ARTICLES: 'articles',
  EVENTS: 'events',
  OPPORTUNITIES: 'opportunities',
  SUBMISSIONS: 'submissions',
  USERS: 'users',
  NOTIFICATIONS: 'notifications'
};

/**
 * Submission routing configuration
 */
export const SUBMISSION_ROUTING = {
  story: COLLECTIONS.ARTICLES,
  job: COLLECTIONS.OPPORTUNITIES,
  opportunity: COLLECTIONS.OPPORTUNITIES, // Can route to EVENTS based on category
  event: COLLECTIONS.EVENTS
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - Collection name
 * @returns {Promise<Array>} Array of documents
 */
export async function getAll(collectionName) {
  if (!db) throw new Error('Firestore not configured');
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get document by ID
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<object>} Document data
 */
export async function getById(collectionName, id) {
  if (!db) throw new Error('Firestore not configured');
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

/**
 * Create new document
 * @param {string} collectionName - Collection name
 * @param {object} data - Document data
 * @returns {Promise<string>} Document ID
 */
export async function create(collectionName, data) {
  if (!db) throw new Error('Firestore not configured');
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Update document
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @param {object} data - Updated data
 * @returns {Promise<void>}
 */
export async function update(collectionName, id, data) {
  if (!db) throw new Error('Firestore not configured');
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete document
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<void>}
 */
export async function remove(collectionName, id) {
  if (!db) throw new Error('Firestore not configured');
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
}

/**
 * Query documents with filters
 * @param {string} collectionName - Collection name
 * @param {Array} filters - Array of filter conditions
 * @returns {Promise<Array>} Filtered documents
 */
export async function queryDocuments(collectionName, filters = []) {
  if (!db) throw new Error('Firestore not configured');
  const q = query(collection(db, collectionName), ...filters);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Check if a document with similar content already exists
 * @param {string} collectionName - Collection name
 * @param {object} data - Document data to check
 * @param {string} excludeId - ID to exclude from duplicate check (for updates)
 * @returns {Promise<object|null>} Existing document if duplicate found, null otherwise
 */
export async function checkForDuplicate(collectionName, data, excludeId = null) {
  if (!db) throw new Error('Firestore not configured');
  
  try {
    // For articles, check title and content similarity
    if (collectionName === COLLECTIONS.ARTICLES) {
      const titleQuery = query(
        collection(db, collectionName),
        where("title", "==", data.title)
      );
      const titleSnapshot = await getDocs(titleQuery);
      
      for (const doc of titleSnapshot.docs) {
        if (excludeId && doc.id === excludeId) continue;
        const existingData = doc.data();
        
        // Check if content is also similar (first 200 characters)
        const contentSimilarity = data.content && existingData.content ? 
          data.content.substring(0, 200) === existingData.content.substring(0, 200) : false;
        
        if (contentSimilarity || data.title === existingData.title) {
          return { id: doc.id, ...existingData };
        }
      }
    }
    
    // For events, check title and date
    if (collectionName === COLLECTIONS.EVENTS) {
      const eventQuery = query(
        collection(db, collectionName),
        where("title", "==", data.title)
      );
      const eventSnapshot = await getDocs(eventQuery);
      
      for (const doc of eventSnapshot.docs) {
        if (excludeId && doc.id === excludeId) continue;
        const existingData = doc.data();
        
        if (data.date === existingData.date && data.location === existingData.location) {
          return { id: doc.id, ...existingData };
        }
      }
    }
    
    // For opportunities, check title and company
    if (collectionName === COLLECTIONS.OPPORTUNITIES) {
      const oppQuery = query(
        collection(db, collectionName),
        where("title", "==", data.title)
      );
      const oppSnapshot = await getDocs(oppQuery);
      
      for (const doc of oppSnapshot.docs) {
        if (excludeId && doc.id === excludeId) continue;
        const existingData = doc.data();
        
        if (data.company === existingData.company) {
          return { id: doc.id, ...existingData };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return null;
  }
}

/**
 * Create new document with duplicate check
 * @param {string} collectionName - Collection name
 * @param {object} data - Document data
 * @param {boolean} allowDuplicates - Whether to allow duplicates
 * @returns {Promise<string>} Document ID
 */
export async function createWithDuplicateCheck(collectionName, data, allowDuplicates = false) {
  if (!db) throw new Error('Firestore not configured');
  
  if (!allowDuplicates) {
    const duplicate = await checkForDuplicate(collectionName, data);
    if (duplicate) {
      throw new Error(`Duplicate ${collectionName.slice(0, -1)} found: "${duplicate.title}"`);
    }
  }
  
  return await create(collectionName, data);
}

/**
 * Update document with duplicate check
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @param {object} data - Updated data
 * @param {boolean} allowDuplicates - Whether to allow duplicates
 * @returns {Promise<void>}
 */
export async function updateWithDuplicateCheck(collectionName, id, data, allowDuplicates = false) {
  if (!db) throw new Error('Firestore not configured');
  
  if (!allowDuplicates) {
    const duplicate = await checkForDuplicate(collectionName, data, id);
    if (duplicate) {
      throw new Error(`Duplicate ${collectionName.slice(0, -1)} found: "${duplicate.title}"`);
    }
  }
  
  return await update(collectionName, id, data);
};

/**
 * Route approved submission to appropriate collection
 * @param {object} submission - Submission data
 * @returns {Promise<object>} Result with document ID and routing info
 */
export async function routeSubmission(submission) {
  if (!db) throw new Error('Firestore not configured');
  
  const { submissionType, type } = submission;
  let targetCollection;
  let processedData = { ...submission };
  
  // Remove submission-specific fields
  delete processedData.submissionType;
  delete processedData.status;
  delete processedData.actionTimestamp;
  delete processedData.email;
  delete processedData.phone;
  
  // Determine target collection and process data
  if (submissionType === 'story' || type === 'News Story') {
    targetCollection = COLLECTIONS.ARTICLES;
    processedData = {
      title: submission.title,
      content: submission.description,
      category: submission.category,
      author: submission.author,
      imageUrl: submission.imageUrl,
      status: 'published',
      featured: false,
      views: 0
    };
  } else if (submissionType === 'job' || type === 'Job Offer') {
    targetCollection = COLLECTIONS.OPPORTUNITIES;
    processedData = {
      title: submission.title,
      description: submission.description,
      company: submission.company || 'Not specified',
      location: submission.location || 'Remote',
      type: submission.category || 'Full-time',
      salary: submission.salary,
      deadline: submission.deadline,
      imageUrl: submission.imageUrl,
      status: 'active',
      featured: false,
      applications: 0
    };
  } else if (submissionType === 'opportunity' || type === 'Opportunity') {
    // Check if it's an event-type opportunity or general opportunity
    if (submission.category === 'Events' || submission.eventDate) {
      targetCollection = COLLECTIONS.EVENTS;
      processedData = {
        title: submission.title,
        description: submission.description,
        date: submission.eventDate || submission.deadline,
        location: submission.location || 'TBD',
        price: submission.price || 'Free',
        category: 'Conference',
        imageUrl: submission.imageUrl,
        status: 'upcoming',
        featured: false,
        registrations: 0
      };
    } else {
      targetCollection = COLLECTIONS.OPPORTUNITIES;
      processedData = {
        title: submission.title,
        description: submission.description,
        company: submission.company || 'Various',
        location: submission.location || 'Multiple',
        type: submission.category || 'Opportunity',
        deadline: submission.deadline,
        imageUrl: submission.imageUrl,
        status: 'active',
        featured: false,
        applications: 0
      };
    }
  } else {
    throw new Error('Unknown submission type');
  }
  
  // Create document in target collection with duplicate check
  const documentId = await createWithDuplicateCheck(targetCollection, processedData);
  
  // Create notification message for approved content
  const notificationMessage = {
    type: 'content_approved',
    title: `New ${targetCollection.slice(0, -1)} Published`,
    message: `"${submission.title}" by ${submission.author} has been approved and published to ${targetCollection}.`,
    contentId: documentId,
    contentType: targetCollection,
    submissionId: submission.id,
    submitterEmail: submission.email,
    submitterName: submission.author,
    category: submission.category,
    status: 'unread',
    priority: 'normal',
    metadata: {
      originalSubmission: {
        title: submission.title,
        author: submission.author,
        email: submission.email,
        type: submission.type,
        category: submission.category
      },
      routedTo: {
        collection: targetCollection,
        documentId: documentId
      }
    }
  };
  
  // Save notification
  const notificationId = await create(COLLECTIONS.NOTIFICATIONS, notificationMessage);
  
  return {
    documentId,
    targetCollection,
    notificationId,
    routingInfo: {
      collection: targetCollection,
      section: getCollectionDisplayName(targetCollection, submission.category)
    }
  };
}

/**
 * Create notification for admin actions
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} metadata - Additional metadata
 * @returns {Promise<string>} Notification ID
 */
export async function createNotification(type, title, message, metadata = {}) {
  if (!db) throw new Error('Firestore not configured');
  
  const notificationData = {
    type,
    title,
    message,
    status: 'unread',
    priority: metadata.priority || 'normal',
    metadata
  };
  
  return await create(COLLECTIONS.NOTIFICATIONS, notificationData);
}

/**
 * Create notification for content creation
 * @param {string} collection - Collection name
 * @param {object} content - Content data
 * @param {object} user - User who created the content
 * @returns {Promise<string>} Notification ID
 */
export async function createContentNotification(collection, content, user, action = 'created') {
  const contentType = collection.slice(0, -1); // Remove 's' from collection name
  const actionPast = action === 'created' ? 'created' : action === 'updated' ? 'updated' : action === 'deleted' ? 'deleted' : action;
  
  return await createNotification(
    contentType,
    `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${actionPast}`,
    `"${content.title}" has been ${actionPast} by ${user?.displayName || user?.name || 'Admin'}.`,
    {
      contentId: content.id,
      contentType: collection,
      action,
      user: {
        id: user?.uid,
        name: user?.displayName || user?.name || 'Admin',
        email: user?.email
      },
      content: {
        title: content.title,
        category: content.category,
        status: content.status
      }
    }
  );
}

/**
 * Create notification for submission actions
 * @param {object} submission - Submission data
 * @param {string} action - Action performed (approved, rejected)
 * @param {object} user - User who performed the action
 * @returns {Promise<string>} Notification ID
 */
export async function createSubmissionNotification(submission, action, user) {
  const actionTitle = action === 'approved' ? 'Submission Approved' : 'Submission Rejected';
  const actionMessage = action === 'approved' 
    ? `Submission "${submission.title}" by ${submission.author} has been approved and published.`
    : `Submission "${submission.title}" by ${submission.author} has been rejected.`;
  
  return await createNotification(
    'submission',
    actionTitle,
    actionMessage,
    {
      submissionId: submission.id,
      action,
      user: {
        id: user?.uid,
        name: user?.displayName || user?.name || 'Admin',
        email: user?.email
      },
      submission: {
        title: submission.title,
        author: submission.author,
        email: submission.email,
        type: submission.type,
        category: submission.category
      }
    }
  );
}

/**
 * Create notification for user actions
 * @param {object} targetUser - User being acted upon
 * @param {string} action - Action performed
 * @param {object} adminUser - Admin who performed the action
 * @returns {Promise<string>} Notification ID
 */
export async function createUserNotification(targetUser, action, adminUser) {
  const actionTitle = `User ${action.charAt(0).toUpperCase() + action.slice(1)}`;
  const actionMessage = `User "${targetUser.name || targetUser.email}" has been ${action} by ${adminUser?.displayName || adminUser?.name || 'Admin'}.`;
  
  return await createNotification(
    'user',
    actionTitle,
    actionMessage,
    {
      targetUserId: targetUser.id,
      action,
      adminUser: {
        id: adminUser?.uid,
        name: adminUser?.displayName || adminUser?.name || 'Admin',
        email: adminUser?.email
      },
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    }
  );
}

/**
 * Get display name for collection and category
 * @param {string} collection - Collection name
 * @param {string} category - Content category
 * @returns {string} Display name
 */
function getCollectionDisplayName(collection, category) {
  switch (collection) {
    case COLLECTIONS.ARTICLES:
      return `${category} News`;
    case COLLECTIONS.OPPORTUNITIES:
      return 'Job Opportunities';
    case COLLECTIONS.EVENTS:
      return 'Upcoming Events';
    default:
      return collection;
  }
}
