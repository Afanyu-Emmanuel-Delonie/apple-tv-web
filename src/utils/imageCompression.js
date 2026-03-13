// Image compression and processing utilities

// Configuration for different image types and use cases
export const IMAGE_CONFIG = {
  // Quality settings (0.1 to 1.0)
  QUALITY: {
    THUMBNAIL: 0.7,
    CARD: 0.8,
    FEATURED: 0.85,
    HERO: 0.9,
    ORIGINAL: 0.95
  },
  
  // Maximum dimensions
  DIMENSIONS: {
    THUMBNAIL: { width: 150, height: 150 },
    CARD: { width: 400, height: 300 },
    FEATURED: { width: 800, height: 600 },
    HERO: { width: 1200, height: 800 },
    ORIGINAL: { width: 1920, height: 1080 }
  },
  
  // File size limits (in bytes)
  MAX_SIZE: {
    THUMBNAIL: 50 * 1024,      // 50KB
    CARD: 150 * 1024,          // 150KB
    FEATURED: 300 * 1024,      // 300KB
    HERO: 500 * 1024,          // 500KB
    ORIGINAL: 2 * 1024 * 1024  // 2MB
  },
  
  // Supported formats
  FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  OUTPUT_FORMAT: 'image/jpeg', // Default output format
  
  // Progressive JPEG settings
  PROGRESSIVE: true
};

// Compress image with specified quality and dimensions
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      quality = IMAGE_CONFIG.QUALITY.FEATURED,
      maxWidth = IMAGE_CONFIG.DIMENSIONS.FEATURED.width,
      maxHeight = IMAGE_CONFIG.DIMENSIONS.FEATURED.height,
      outputFormat = IMAGE_CONFIG.OUTPUT_FORMAT,
      maintainAspectRatio = true
    } = options;

    // Validate file type
    if (!IMAGE_CONFIG.FORMATS.includes(file.type)) {
      reject(new Error('Unsupported image format. Please use JPEG, PNG, or WebP.'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
          maintainAspectRatio
        );

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Add metadata
              const compressedFile = new File([blob], file.name, {
                type: outputFormat,
                lastModified: Date.now()
              });

              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                dimensions: { width: newWidth, height: newHeight },
                originalDimensions: { width: img.width, height: img.height }
              });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          outputFormat,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
};

// Generate multiple image variants for different use cases
export const generateImageVariants = async (file) => {
  const variants = {};
  
  try {
    // Generate thumbnail
    variants.thumbnail = await compressImage(file, {
      quality: IMAGE_CONFIG.QUALITY.THUMBNAIL,
      maxWidth: IMAGE_CONFIG.DIMENSIONS.THUMBNAIL.width,
      maxHeight: IMAGE_CONFIG.DIMENSIONS.THUMBNAIL.height
    });

    // Generate card image
    variants.card = await compressImage(file, {
      quality: IMAGE_CONFIG.QUALITY.CARD,
      maxWidth: IMAGE_CONFIG.DIMENSIONS.CARD.width,
      maxHeight: IMAGE_CONFIG.DIMENSIONS.CARD.height
    });

    // Generate featured image
    variants.featured = await compressImage(file, {
      quality: IMAGE_CONFIG.QUALITY.FEATURED,
      maxWidth: IMAGE_CONFIG.DIMENSIONS.FEATURED.width,
      maxHeight: IMAGE_CONFIG.DIMENSIONS.FEATURED.height
    });

    // Generate hero image (if original is large enough)
    if (file.size > IMAGE_CONFIG.MAX_SIZE.FEATURED) {
      variants.hero = await compressImage(file, {
        quality: IMAGE_CONFIG.QUALITY.HERO,
        maxWidth: IMAGE_CONFIG.DIMENSIONS.HERO.width,
        maxHeight: IMAGE_CONFIG.DIMENSIONS.HERO.height
      });
    }

    // Keep original if it's within size limits, otherwise compress
    if (file.size <= IMAGE_CONFIG.MAX_SIZE.ORIGINAL) {
      variants.original = {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: '0.0',
        dimensions: await getImageDimensions(file),
        originalDimensions: await getImageDimensions(file)
      };
    } else {
      variants.original = await compressImage(file, {
        quality: IMAGE_CONFIG.QUALITY.ORIGINAL,
        maxWidth: IMAGE_CONFIG.DIMENSIONS.ORIGINAL.width,
        maxHeight: IMAGE_CONFIG.DIMENSIONS.ORIGINAL.height
      });
    }

    return variants;
  } catch (error) {
    throw new Error(`Failed to generate image variants: ${error.message}`);
  }
};

// Calculate optimal dimensions while maintaining aspect ratio
export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight, maintainAspectRatio = true) => {
  if (!maintainAspectRatio) {
    return { width: maxWidth, height: maxHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // Scale down if image is larger than max dimensions
  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    if (aspectRatio > 1) {
      // Landscape
      newWidth = maxWidth;
      newHeight = maxWidth / aspectRatio;
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
      }
    } else {
      // Portrait or square
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      }
    }
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
};

// Get image dimensions from file
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Validate image file
export const validateImage = async (file) => {
  const errors = [];
  
  // Check file type
  if (!IMAGE_CONFIG.FORMATS.includes(file.type)) {
    errors.push('Invalid file format. Please use JPEG, PNG, or WebP.');
  }
  
  // Check file size (10MB max for original upload)
  const maxUploadSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxUploadSize) {
    errors.push(`File too large. Maximum size is ${formatFileSize(maxUploadSize)}.`);
  }
  
  // Check minimum dimensions
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width < 100 || dimensions.height < 100) {
      errors.push('Image too small. Minimum dimensions are 100x100 pixels.');
    }
  } catch (error) {
    errors.push('Invalid image file.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Convert image to WebP format (if supported)
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Check WebP support
    const canvas = document.createElement('canvas');
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (!webpSupported) {
      resolve(null); // WebP not supported
      return;
    }
    
    const img = new Image();
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          } else {
            reject(new Error('Failed to convert to WebP'));
          }
        },
        'image/webp',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Batch compress multiple images
export const batchCompressImages = async (files, options = {}) => {
  const results = [];
  
  for (const file of files) {
    try {
      const validation = await validateImage(file);
      if (!validation.isValid) {
        results.push({
          file,
          success: false,
          errors: validation.errors
        });
        continue;
      }
      
      const compressed = await compressImage(file, options);
      results.push({
        file,
        success: true,
        result: compressed
      });
    } catch (error) {
      results.push({
        file,
        success: false,
        errors: [error.message]
      });
    }
  }
  
  return results;
};

// Create responsive image srcset
export const createResponsiveSrcSet = (baseUrl, variants) => {
  const srcSet = [];
  
  if (variants.thumbnail) {
    srcSet.push(`${baseUrl}_thumbnail.jpg 150w`);
  }
  
  if (variants.card) {
    srcSet.push(`${baseUrl}_card.jpg 400w`);
  }
  
  if (variants.featured) {
    srcSet.push(`${baseUrl}_featured.jpg 800w`);
  }
  
  if (variants.hero) {
    srcSet.push(`${baseUrl}_hero.jpg 1200w`);
  }
  
  if (variants.original) {
    srcSet.push(`${baseUrl}_original.jpg 1920w`);
  }
  
  return srcSet.join(', ');
};

// Get optimal image variant for specific use case
export const getOptimalImage = (variants, useCase = 'featured') => {
  const priority = {
    thumbnail: ['thumbnail', 'card', 'featured', 'original'],
    card: ['card', 'featured', 'thumbnail', 'original'],
    featured: ['featured', 'hero', 'card', 'original'],
    hero: ['hero', 'original', 'featured', 'card']
  };
  
  const fallbackOrder = priority[useCase] || priority.featured;
  
  for (const variant of fallbackOrder) {
    if (variants[variant]) {
      return variants[variant];
    }
  }
  
  return null;
};