import { useState, useCallback } from 'react';
import { 
  compressImage, 
  generateImageVariants, 
  validateImage, 
  batchCompressImages,
  formatFileSize 
} from '../utils/imageCompression';

export const useImageCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionResults, setCompressionResults] = useState(null);

  // Compress single image
  const compressSingleImage = useCallback(async (file, options = {}) => {
    setIsCompressing(true);
    setCompressionProgress(0);
    
    try {
      // Validate image first
      const validation = await validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setCompressionProgress(25);
      
      // Compress image
      const result = await compressImage(file, options);
      
      setCompressionProgress(100);
      setCompressionResults(result);
      
      return result;
    } catch (error) {
      console.error('Image compression failed:', error);
      throw error;
    } finally {
      setIsCompressing(false);
      setTimeout(() => setCompressionProgress(0), 1000);
    }
  }, []);

  // Generate multiple variants
  const generateVariants = useCallback(async (file) => {
    setIsCompressing(true);
    setCompressionProgress(0);
    
    try {
      // Validate image first
      const validation = await validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setCompressionProgress(20);
      
      // Generate variants
      const variants = await generateImageVariants(file);
      
      setCompressionProgress(100);
      setCompressionResults(variants);
      
      return variants;
    } catch (error) {
      console.error('Image variant generation failed:', error);
      throw error;
    } finally {
      setIsCompressing(false);
      setTimeout(() => setCompressionProgress(0), 1000);
    }
  }, []);

  // Batch compress multiple images
  const compressMultipleImages = useCallback(async (files, options = {}) => {
    setIsCompressing(true);
    setCompressionProgress(0);
    
    try {
      const results = await batchCompressImages(files, options);
      
      setCompressionProgress(100);
      setCompressionResults(results);
      
      return results;
    } catch (error) {
      console.error('Batch compression failed:', error);
      throw error;
    } finally {
      setIsCompressing(false);
      setTimeout(() => setCompressionProgress(0), 1000);
    }
  }, []);

  // Reset compression state
  const resetCompression = useCallback(() => {
    setIsCompressing(false);
    setCompressionProgress(0);
    setCompressionResults(null);
  }, []);

  return {
    isCompressing,
    compressionProgress,
    compressionResults,
    compressSingleImage,
    generateVariants,
    compressMultipleImages,
    resetCompression
  };
};

// Hook for image upload with compression
export const useImageUpload = (onUpload) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const { compressSingleImage, generateVariants } = useImageCompression();

  const uploadWithCompression = useCallback(async (file, options = {}) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Step 1: Validate and compress image
      setUploadProgress(10);
      const compressed = await compressSingleImage(file, options);
      
      // Step 2: Upload compressed image
      setUploadProgress(50);
      const uploadResult = await onUpload(compressed.file);
      
      setUploadProgress(100);
      
      return {
        ...uploadResult,
        compressionInfo: compressed
      };
    } catch (error) {
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadError(null);
      }, 2000);
    }
  }, [compressSingleImage, onUpload]);

  const uploadWithVariants = useCallback(async (file, uploadFunction) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Step 1: Generate variants
      setUploadProgress(20);
      const variants = await generateVariants(file);
      
      // Step 2: Upload all variants
      const uploadPromises = Object.entries(variants).map(async ([key, variant]) => {
        const result = await uploadFunction(variant.file, key);
        return { [key]: result };
      });
      
      setUploadProgress(80);
      const uploadResults = await Promise.all(uploadPromises);
      
      // Combine results
      const combinedResults = uploadResults.reduce((acc, result) => ({ ...acc, ...result }), {});
      
      setUploadProgress(100);
      
      return {
        variants: combinedResults,
        compressionInfo: variants
      };
    } catch (error) {
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadError(null);
      }, 2000);
    }
  }, [generateVariants]);

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadWithCompression,
    uploadWithVariants
  };
};

// Hook for drag and drop image upload
export const useImageDropzone = (onDrop, options = {}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError(null);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setDragError('Please drop image files only');
      return;
    }

    if (options.maxFiles && imageFiles.length > options.maxFiles) {
      setDragError(`Maximum ${options.maxFiles} files allowed`);
      return;
    }

    try {
      await onDrop(imageFiles);
    } catch (error) {
      setDragError(error.message);
    }
  }, [onDrop, options.maxFiles]);

  const dropzoneProps = {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    className: `dropzone ${isDragOver ? 'drag-over' : ''} ${dragError ? 'drag-error' : ''}`
  };

  return {
    isDragOver,
    dragError,
    dropzoneProps,
    clearError: () => setDragError(null)
  };
};