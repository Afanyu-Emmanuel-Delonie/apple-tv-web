import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useImageCompression, useImageDropzone } from '../hooks/useImageCompression';
import { formatFileSize } from '../utils/imageCompression';

export default function ImageUploadComponent({ 
  onImageSelect, 
  onImageRemove,
  currentImage = null,
  maxFiles = 1,
  compressionOptions = {},
  className = '',
  label = 'Upload Image',
  description = 'Drag and drop an image here, or click to select',
  showPreview = true,
  showCompressionInfo = true,
  generateVariants = false
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const { 
    isCompressing, 
    compressionProgress, 
    compressionResults,
    compressSingleImage,
    generateVariants: generateImageVariants,
    resetCompression 
  } = useImageCompression();

  const handleImageDrop = async (files) => {
    await processImages(files);
  };

  const { isDragOver, dragError, dropzoneProps, clearError } = useImageDropzone(
    handleImageDrop, 
    { maxFiles }
  );

  const processImages = async (files) => {
    try {
      clearError();
      resetCompression();

      const file = files[0]; // Handle single file for now
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls([previewUrl]);
      setSelectedImages([file]);

      // Compress or generate variants
      let result;
      if (generateVariants) {
        result = await generateImageVariants(file);
      } else {
        result = await compressSingleImage(file, compressionOptions);
      }

      // Notify parent component
      if (onImageSelect) {
        onImageSelect(result);
      }

    } catch (error) {
      console.error('Image processing failed:', error);
      // Handle error - could show toast notification
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processImages(files);
    }
  };

  const handleRemoveImage = (index) => {
    // Revoke preview URL to prevent memory leaks
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setPreviewUrls(newPreviews);
    
    if (onImageRemove) {
      onImageRemove(index);
    }

    resetCompression();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...dropzoneProps}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${dragError ? 'border-red-400 bg-red-50' : ''}
          ${isCompressing ? 'pointer-events-none opacity-75' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          multiple={maxFiles > 1}
        />

        {isCompressing ? (
          <div className="space-y-3">
            <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {generateVariants ? 'Generating image variants...' : 'Compressing image...'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{compressionProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {isDragOver ? (
                <Upload className="w-8 h-8 text-blue-500" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        )}

        {dragError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
            <div className="text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{dragError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {showPreview && previewUrls.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Preview</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* File Info */}
                <div className="mt-2 text-xs text-gray-500">
                  <p className="truncate">{selectedImages[index]?.name}</p>
                  <p>{formatFileSize(selectedImages[index]?.size || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compression Results */}
      {showCompressionInfo && compressionResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-800">
                {generateVariants ? 'Image variants generated successfully!' : 'Image compressed successfully!'}
              </h4>
              
              {!generateVariants && compressionResults.compressionRatio && (
                <div className="text-xs text-green-700 space-y-1">
                  <p>Original size: {formatFileSize(compressionResults.originalSize)}</p>
                  <p>Compressed size: {formatFileSize(compressionResults.compressedSize)}</p>
                  <p>Space saved: {compressionResults.compressionRatio}%</p>
                  <p>
                    Dimensions: {compressionResults.dimensions.width} × {compressionResults.dimensions.height}
                    {compressionResults.originalDimensions && (
                      <span className="text-gray-500">
                        {' '}(from {compressionResults.originalDimensions.width} × {compressionResults.originalDimensions.height})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {generateVariants && compressionResults && (
                <div className="text-xs text-green-700 space-y-1">
                  <p>Generated variants:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {Object.entries(compressionResults).map(([variant, data]) => (
                      <li key={variant}>
                        <span className="capitalize">{variant}</span>: {' '}
                        {data.dimensions.width} × {data.dimensions.height} ({formatFileSize(data.compressedSize)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Image Display */}
      {currentImage && !previewUrls.length && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Current Image</h4>
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Current"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
            {onImageRemove && (
              <button
                onClick={() => onImageRemove()}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized components for different use cases
export function ArticleImageUpload(props) {
  return (
    <ImageUploadComponent
      compressionOptions={{
        quality: 0.85,
        maxWidth: 800,
        maxHeight: 600
      }}
      label="Upload Article Image"
      description="Recommended: 800×600px, JPEG/PNG format"
      {...props}
    />
  );
}

export function EventImageUpload(props) {
  return (
    <ImageUploadComponent
      compressionOptions={{
        quality: 0.8,
        maxWidth: 600,
        maxHeight: 400
      }}
      label="Upload Event Image"
      description="Recommended: 600×400px, JPEG/PNG format"
      {...props}
    />
  );
}

export function HeroImageUpload(props) {
  return (
    <ImageUploadComponent
      compressionOptions={{
        quality: 0.9,
        maxWidth: 1200,
        maxHeight: 800
      }}
      label="Upload Hero Image"
      description="Recommended: 1200×800px, high quality JPEG/PNG"
      generateVariants={true}
      {...props}
    />
  );
}