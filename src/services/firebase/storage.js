import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './config';

export const storage = app ? getStorage(app) : null;

/**
 * Storage paths
 */
export const STORAGE_PATHS = {
  ARTICLES: 'articles',
  EVENTS: 'events',
  OPPORTUNITIES: 'opportunities',
  SUBMISSIONS: 'submissions',
  PROFILES: 'profiles'
};

/**
 * Upload file to storage
 * @param {File} file - File to upload
 * @param {string} path - Storage path
 * @param {string} filename - Custom filename (optional)
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path, filename = null) {
  if (!storage) throw new Error('Firebase Storage not configured');
  const name = filename || `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Upload image with compression
 * @param {File} file - Image file
 * @param {string} path - Storage path
 * @param {number} maxWidth - Maximum width (optional)
 * @returns {Promise<string>} Download URL
 */
export async function uploadImage(file, path, maxWidth = 1200) {
  if (!storage) throw new Error('Firebase Storage not configured');
  return await uploadFile(file, path);
}

/**
 * Delete file from storage
 * @param {string} fileUrl - File URL or path
 * @returns {Promise<void>}
 */
export async function deleteFile(fileUrl) {
  if (!storage) throw new Error('Firebase Storage not configured');
  const storageRef = ref(storage, fileUrl);
  return await deleteObject(storageRef);
}

/**
 * Get download URL for file
 * @param {string} path - File path
 * @returns {Promise<string>} Download URL
 */
export async function getFileURL(path) {
  if (!storage) throw new Error('Firebase Storage not configured');
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files
 * @param {string} path - Storage path
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMultipleFiles(files, path) {
  if (!storage) throw new Error('Firebase Storage not configured');
  const uploadPromises = files.map(file => uploadFile(file, path));
  return await Promise.all(uploadPromises);
}
