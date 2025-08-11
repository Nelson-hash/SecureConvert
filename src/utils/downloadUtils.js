/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 * @param {string} mimeType - The MIME type of the file
 */
export function downloadFile(blob, filename, mimeType) {
  try {
    // Create blob URL
    const url = URL.createObjectURL(blob);
    
    // Create temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    // Clean up blob URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Download text content as a file
 * @param {string} content - Text content to download
 * @param {string} filename - The filename for the download
 * @param {string} mimeType - The MIME type (default: text/plain)
 */
export function downloadText(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  return downloadFile(blob, filename, mimeType);
}

/**
 * Download JSON data as a file
 * @param {Object} data - Data to convert to JSON and download
 * @param {string} filename - The filename for the download
 */
export function downloadJSON(data, filename) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return downloadFile(blob, filename, 'application/json');
}

/**
 * Download canvas as image
 * @param {HTMLCanvasElement} canvas - Canvas element to download
 * @param {string} filename - The filename for the download
 * @param {string} format - Image format (png, jpg, webp)
 * @param {number} quality - Image quality (0-1, for JPEG/WebP)
 */
export function downloadCanvas(canvas, filename, format = 'png', quality = 0.9) {
  return new Promise((resolve, reject) => {
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
    
    canvas.toBlob((blob) => {
      if (blob) {
        try {
          downloadFile(blob, filename, mimeType);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Failed to create image blob'));
      }
    }, mimeType, quality);
  });
}

/**
 * Create a download URL for a blob (for preview purposes)
 * @param {Blob} blob - The blob to create URL for
 * @returns {string} - Object URL that should be revoked after use
 */
export function createDownloadURL(blob) {
  return URL.createObjectURL(blob);
}

/**
 * Revoke a download URL
 * @param {string} url - The object URL to revoke
 */
export function revokeDownloadURL(url) {
  URL.revokeObjectURL(url);
}

/**
 * Check if download is supported in current browser
 * @returns {boolean}
 */
export function isDownloadSupported() {
  const anchor = document.createElement('a');
  return typeof anchor.download !== 'undefined';
}

/**
 * Get appropriate file extension for MIME type
 * @param {string} mimeType - MIME type
 * @returns {string} - File extension
 */
export function getFileExtension(mimeType) {
  const mimeToExt = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'text/markdown': 'md',
    'text/html': 'html',
    'application/json': 'json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
  };
  
  return mimeToExt[mimeType] || 'bin';
}

/**
 * Estimate download time based on file size
 * @param {number} fileSize - File size in bytes
 * @param {number} connectionSpeed - Connection speed in Mbps (default: 10)
 * @returns {string} - Estimated download time
 */
export function estimateDownloadTime(fileSize, connectionSpeed = 10) {
  const fileSizeMb = fileSize / (1024 * 1024);
  const timeSeconds = fileSizeMb / connectionSpeed;
  
  if (timeSeconds < 1) {
    return 'Less than 1 second';
  } else if (timeSeconds < 60) {
    return `${Math.ceil(timeSeconds)} seconds`;
  } else {
    const minutes = Math.ceil(timeSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}
