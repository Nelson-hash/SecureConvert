/**
 * Validate a file for processing
 * @param {File} file - File to validate
 * @returns {Object} - {isValid, error, warnings}
 */
export function validateFile(file) {
  const result = {
    isValid: true,
    error: null,
    warnings: []
  };
  
  // Check if file exists
  if (!file) {
    result.isValid = false;
    result.error = 'No file provided';
    return result;
  }
  
  // Check file size
  if (file.size === 0) {
    result.isValid = false;
    result.error = 'File is empty';
    return result;
  }
  
  // Check maximum file size (100MB)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    result.isValid = false;
    result.error = `File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(maxSize)}`;
    return result;
  }
  
  // Warn about large files
  const warnSize = 50 * 1024 * 1024; // 50MB
  if (file.size > warnSize) {
    result.warnings.push(`Large file (${formatFileSize(file.size)}) may take longer to process`);
  }
  
  // Check file extension
  const extension = getFileExtension(file.name);
  if (!extension) {
    result.warnings.push('File has no extension - type detection may be unreliable');
  }
  
  // Check supported formats
  const supportedExtensions = [
    'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp',
    'txt', 'csv', 'json', 'md', 'html'
  ];
  
  if (extension && !supportedExtensions.includes(extension.toLowerCase())) {
    result.isValid = false;
    result.error = `Unsupported file type: .${extension}. Supported formats: ${supportedExtensions.join(', ')}`;
    return result;
  }
  
  return result;
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string|null} - File extension (lowercase) or null
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return null;
  }
  
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return null;
  }
  
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Get MIME type from file extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
export function getMimeType(extension) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'json': 'application/json',
    'md': 'text/markdown',
    'html': 'text/html',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @param {string} encoding - Text encoding (default: UTF-8)
 * @returns {Promise<string>} - File content as text
 */
export function readFileAsText(file, encoding = 'UTF-8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file as text'));
    
    reader.readAsText(file, encoding);
  });
}

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} - File content as array buffer
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file as array buffer'));
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} - File content as data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    
    reader.readAsDataURL(file);
  });
}

/**
 * Check if file is an image
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isImageFile(file) {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];
  const extension = getFileExtension(file.name);
  
  return extension && imageExtensions.includes(extension.toLowerCase());
}

/**
 * Check if file is a PDF
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isPDFFile(file) {
  const extension = getFileExtension(file.name);
  return extension && extension.toLowerCase() === 'pdf';
}

/**
 * Check if file is a text file
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isTextFile(file) {
  const textExtensions = ['txt', 'csv', 'json', 'md', 'html', 'xml', 'css', 'js'];
  const extension = getFileExtension(file.name);
  
  return extension && textExtensions.includes(extension.toLowerCase());
}

/**
 * Generate a safe filename
 * @param {string} filename - Original filename
 * @returns {string} - Safe filename
 */
export function sanitizeFilename(filename) {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Get file info object
 * @param {File} file - File to analyze
 * @returns {Object} - File information
 */
export function getFileInfo(file) {
  const extension = getFileExtension(file.name);
  
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    extension: extension,
    mimeType: getMimeType(extension || ''),
    lastModified: new Date(file.lastModified),
    isImage: isImageFile(file),
    isPDF: isPDFFile(file),
    isText: isTextFile(file)
  };
}

/**
 * Create a thumbnail for image files
 * @param {File} file - Image file
 * @param {number} maxSize - Maximum thumbnail size
 * @returns {Promise<string>} - Data URL of thumbnail
 */
export function createImageThumbnail(file, maxSize = 200) {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate thumbnail dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw thumbnail
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.8));
      
      // Clean up
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(file);
  });
}
