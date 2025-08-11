/**
 * Supported file formats and their conversion options
 */
export const SUPPORTED_FORMATS = {
  // PDF files
  'pdf': [
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'jpg', label: 'JPEG Image', icon: '📸', category: 'image' },
    { value: 'txt', label: 'Text File', icon: '📝', category: 'text' }
  ],
  
  // Image files
  'png': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'jpg', label: 'JPEG Image', icon: '📸', category: 'image' },
    { value: 'webp', label: 'WebP Image', icon: '🌐', category: 'image' }
  ],
  
  'jpg': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'webp', label: 'WebP Image', icon: '🌐', category: 'image' }
  ],
  
  'jpeg': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'webp', label: 'WebP Image', icon: '🌐', category: 'image' }
  ],
  
  'gif': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'jpg', label: 'JPEG Image', icon: '📸', category: 'image' }
  ],
  
  'bmp': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'jpg', label: 'JPEG Image', icon: '📸', category: 'image' }
  ],
  
  'webp': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'png', label: 'PNG Image', icon: '🖼️', category: 'image' },
    { value: 'jpg', label: 'JPEG Image', icon: '📸', category: 'image' }
  ],
  
  // Text files
  'txt': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'html', label: 'HTML Document', icon: '🌐', category: 'web' },
    { value: 'md', label: 'Markdown', icon: '📝', category: 'text' }
  ],
  
  'csv': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'html', label: 'HTML Table', icon: '🌐', category: 'web' },
    { value: 'md', label: 'Markdown Table', icon: '📝', category: 'text' },
    { value: 'txt', label: 'Text File', icon: '📝', category: 'text' }
  ],
  
  'json': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'html', label: 'HTML Document', icon: '🌐', category: 'web' },
    { value: 'txt', label: 'Text File', icon: '📝', category: 'text' }
  ],
  
  'md': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'html', label: 'HTML Document', icon: '🌐', category: 'web' },
    { value: 'txt', label: 'Text File', icon: '📝', category: 'text' }
  ],
  
  'html': [
    { value: 'pdf', label: 'PDF Document', icon: '📄', category: 'document' },
    { value: 'md', label: 'Markdown', icon: '📝', category: 'text' },
    { value: 'txt', label: 'Text File', icon: '📝', category: 'text' }
  ]
};

/**
 * Format categories with descriptions
 */
export const FORMAT_CATEGORIES = {
  'document': {
    name: 'Documents',
    description: 'PDF and document formats',
    color: '#4c51bf'
  },
  'image': {
    name: 'Images',
    description: 'Image formats and pictures',
    color: '#059669'
  },
  'text': {
    name: 'Text',
    description: 'Plain text and markup',
    color: '#dc2626'
  },
  'web': {
    name: 'Web',
    description: 'Web-compatible formats',
    color: '#7c3aed'
  }
};

/**
 * File type detection patterns
 */
export const FILE_TYPE_PATTERNS = {
  'pdf': {
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
    signatures: [0x25, 0x50, 0x44, 0x46] // %PDF
  },
  'png': {
    extensions: ['png'],
    mimeTypes: ['image/png'],
    signatures: [0x89, 0x50, 0x4E, 0x47] // PNG
  },
  'jpg': {
    extensions: ['jpg', 'jpeg'],
    mimeTypes: ['image/jpeg'],
    signatures: [0xFF, 0xD8, 0xFF] // JPEG
  },
  'gif': {
    extensions: ['gif'],
    mimeTypes: ['image/gif'],
    signatures: [0x47, 0x49, 0x46, 0x38] // GIF8
  },
  'bmp': {
    extensions: ['bmp'],
    mimeTypes: ['image/bmp'],
    signatures: [0x42, 0x4D] // BM
  },
  'webp': {
    extensions: ['webp'],
    mimeTypes: ['image/webp'],
    signatures: [0x52, 0x49, 0x46, 0x46] // RIFF
  }
};

/**
 * Quality presets for different output formats
 */
export const QUALITY_PRESETS = {
  'high': {
    name: 'High Quality',
    description: 'Best quality, larger file size',
    settings: {
      imageQuality: 0.95,
      pdfScale: 2.0,
      textDPI: 300
    }
  },
  'medium': {
    name: 'Balanced',
    description: 'Good quality, moderate file size',
    settings: {
      imageQuality: 0.85,
      pdfScale: 1.5,
      textDPI: 200
    }
  },
  'low': {
    name: 'Compressed',
    description: 'Smaller file size, lower quality',
    settings: {
      imageQuality: 0.7,
      pdfScale: 1.0,
      textDPI: 150
    }
  }
};

/**
 * Maximum file sizes by format (in bytes)
 */
export const MAX_FILE_SIZES = {
  'pdf': 100 * 1024 * 1024,    // 100MB
  'image': 50 * 1024 * 1024,   // 50MB
  'text': 10 * 1024 * 1024,    // 10MB
  'default': 100 * 1024 * 1024  // 100MB
};

/**
 * Processing time estimates (in seconds)
 */
export const PROCESSING_ESTIMATES = {
  'pdf-to-image': {
    base: 2,
    perPage: 1,
    perMB: 0.5
  },
  'image-to-pdf': {
    base: 1,
    perImage: 0.5,
    perMB: 0.3
  },
  'text-to-pdf': {
    base: 1,
    perPage: 0.2,
    perMB: 0.1
  }
};

/**
 * Get supported output formats for input format
 * @param {string} inputFormat - Input file extension
 * @returns {Array} - Array of supported output formats
 */
export function getSupportedFormats(inputFormat) {
  return SUPPORTED_FORMATS[inputFormat.toLowerCase()] || [];
}

/**
 * Check if conversion is supported
 * @param {string} inputFormat - Input format
 * @param {string} outputFormat - Output format
 * @returns {boolean}
 */
export function isConversionSupported(inputFormat, outputFormat) {
  const supportedFormats = getSupportedFormats(inputFormat);
  return supportedFormats.some(format => format.value === outputFormat.toLowerCase());
}

/**
 * Get format information
 * @param {string} format - Format extension
 * @returns {Object|null}
 */
export function getFormatInfo(format) {
  // Search through all supported formats
  for (const [inputFormat, outputs] of Object.entries(SUPPORTED_FORMATS)) {
    const found = outputs.find(output => output.value === format.toLowerCase());
    if (found) return found;
  }
  return null;
}

/**
 * Get file type category
 * @param {string} extension - File extension
 * @returns {string}
 */
export function getFileCategory(extension) {
  const ext = extension.toLowerCase();
  
  if (['pdf', 'docx', 'doc'].includes(ext)) return 'document';
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  if (['txt', 'csv', 'json', 'md'].includes(ext)) return 'text';
  if (['html', 'htm'].includes(ext)) return 'web';
  
  return 'other';
}

/**
 * Get all supported input formats
 * @returns {Array<string>}
 */
export function getAllSupportedFormats() {
  return Object.keys(SUPPORTED_FORMATS);
}

/**
 * Estimate processing time for conversion
 * @param {string} conversionType - Type of conversion
 * @param {number} fileSize - File size in bytes
 * @param {Object} options - Additional options
 * @returns {number} - Estimated time in seconds
 */
export function estimateProcessingTime(conversionType, fileSize, options = {}) {
  const estimate = PROCESSING_ESTIMATES[conversionType];
  if (!estimate) return 5; // Default 5 seconds
  
  const fileSizeMB = fileSize / (1024 * 1024);
  let time = estimate.base;
  
  if (estimate.perMB) {
    time += estimate.perMB * fileSizeMB;
  }
  
  if (estimate.perPage && options.pageCount) {
    time += estimate.perPage * options.pageCount;
  }
  
  if (estimate.perImage && options.imageCount) {
    time += estimate.perImage * options.imageCount;
  }
  
  return Math.max(1, Math.ceil(time));
}
