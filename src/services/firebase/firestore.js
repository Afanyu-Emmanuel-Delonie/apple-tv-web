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
 * Listen to real-time updates
 * @param {string} collectionName - Collection name
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function onSnapshot(collectionName, callback) {
  // TODO: Implement real-time listener
  // return onSnapshot(collection(db, collectionName), (snapshot) => {
  //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   callback(data);
  // });
  return () => {};
}
