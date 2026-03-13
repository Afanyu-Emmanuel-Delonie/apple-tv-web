// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dvmhx5kku';
const CLOUDINARY_UPLOAD_PRESET = 'apple-fam-tv'; // We'll create this
const CLOUDINARY_API_KEY = '155233366712278';

import { 
  compressImage as compressImageUtil, 
  generateImageVariants, 
  validateImage,
  IMAGE_CONFIG 
} from '../../utils/imageCompression';

/**
 * Storage paths (for organization in Cloudinary)
 */
export const STORAGE_PATHS = {
  ARTICLES: 'articles',
  EVENTS: 'events',
  OPPORTUNITIES: 'opportunities',
  SUBMISSIONS: 'submissions',
  PROFILES: 'profiles'
};

/**
 * Compress image before upload
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
function compressImage(file, maxWidth = 1200, quality = 0.8) {
  console.log('🖼️ Starting image compression...');
  console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      console.log('✅ File read complete, creating image...');
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        console.log('✅ Image loaded, original dimensions:', img.width, 'x', img.height);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        console.log('📐 New dimensions:', width, 'x', height);
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        console.log('🎨 Drawing to canvas complete, converting to blob...');
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('✅ Compression complete!');
              console.log('Compressed file size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
              console.log('Compression ratio:', ((1 - blob.size / file.size) * 100).toFixed(1), '% reduction');
              resolve(blob);
            } else {
              console.error('❌ Canvas to Blob conversion failed');
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => {
        console.error('❌ Image load error:', error);
        reject(error);
      };
    };
    reader.onerror = (error) => {
      console.error('❌ File read error:', error);
      reject(error);
    };
  });
}

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @param {string} path - Storage path (folder)
 * @param {string} filename - Custom filename (optional)
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path, filename = null) {
  console.log('📤 Starting file upload to Cloudinary...');
  console.log('Path:', path);
  console.log('File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', path);
  formData.append('api_key', CLOUDINARY_API_KEY);
  
  if (filename) {
    formData.append('public_id', filename.replace(/\.[^/.]+$/, '')); // Remove extension
  }
  
  console.log('⏳ Uploading to Cloudinary...');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Upload failed:', error);
    throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  console.log('✅ Upload complete!');
  console.log('✅ Download URL obtained:', data.secure_url);
  
  return data.secure_url;
}

/**
 * Upload image with advanced compression and optimization
 * @param {File} file - Image file
 * @param {string} path - Storage path
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with compression info
 */
export async function uploadImage(file, path, options = {}) {
  console.log('🚀 Advanced uploadImage called');
  console.log('Original file:', file.name, '-', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  const {
    quality = IMAGE_CONFIG.QUALITY.FEATURED,
    maxWidth = IMAGE_CONFIG.DIMENSIONS.FEATURED.width,
    maxHeight = IMAGE_CONFIG.DIMENSIONS.FEATURED.height,
    filename = null,
    generateVariants = false
  } = options;
  
  if (generateVariants) {
    // Generate multiple variants for responsive images
    console.log('📸 Generating image variants...');
    const variants = await generateImageVariants(file);
    
    const uploadPromises = Object.entries(variants).map(async ([variantName, variantData]) => {
      const variantFilename = filename 
        ? `${filename}_${variantName}` 
        : `${file.name.split('.')[0]}_${variantName}`;
      
      const result = await uploadFile(variantData.file, path, variantFilename);
      return {
        [variantName]: {
          ...result,
          compressionInfo: variantData
        }
      };
    });
    
    const uploadResults = await Promise.all(uploadPromises);
    const combinedResults = uploadResults.reduce((acc, result) => ({ ...acc, ...result }), {});
    
    console.log('🎉 All variants uploaded successfully!');
    return {
      variants: combinedResults,
      primaryUrl: combinedResults.featured?.url || combinedResults.original?.url
    };
  } else {
    // Single image compression and upload
    console.log('🖼️ Compressing single image...');
    const compressionResult = await compressImageUtil(file, {
      quality,
      maxWidth,
      maxHeight
    });
    
    console.log('✅ Compression complete, uploading...');
    const uploadResult = await uploadFile(compressionResult.file, path, filename);
    
    console.log('🎉 Upload complete!');
    return {
      ...uploadResult,
      compressionInfo: compressionResult
    };
  }
}

/**
 * Delete file from Cloudinary
 * @param {string} fileUrl - File URL
 * @returns {Promise<void>}
 */
export async function deleteFile(fileUrl) {
  console.log('🗑️ Delete file called (Cloudinary deletion requires backend):', fileUrl);
  // Note: Cloudinary deletion requires API Secret, should be done from backend
  // For now, files will remain in Cloudinary (you can manually delete or set up backend endpoint)
}

/**
 * Get download URL for file (Cloudinary URLs are already public)
 * @param {string} path - File path or URL
 * @returns {Promise<string>} Download URL
 */
export async function getFileURL(path) {
  // Cloudinary URLs are already public and direct
  return path;
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files
 * @param {string} path - Storage path
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMultipleFiles(files, path) {
  const uploadPromises = files.map(file => uploadFile(file, path));
  return await Promise.all(uploadPromises);
}
