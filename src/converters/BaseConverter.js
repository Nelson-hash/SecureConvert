export class BaseConverter {
  constructor() {
    this.supportedInputs = [];
    this.supportedOutputs = [];
  }
  
  /**
   * Convert a file to target format
   * @param {File} file - Input file
   * @param {string} targetFormat - Target format extension
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} - {blob, filename, type}
   */
  async convert(file, targetFormat, options = {}) {
    throw new Error('Convert method must be implemented by subclass');
  }
  
  /**
   * Check if conversion is supported
   * @param {string} inputFormat - Input format extension
   * @param {string} outputFormat - Output format extension
   * @returns {boolean}
   */
  canConvert(inputFormat, outputFormat) {
    return this.supportedInputs.includes(inputFormat.toLowerCase()) &&
           this.supportedOutputs.includes(outputFormat.toLowerCase());
  }
  
  /**
   * Get supported input formats
   * @returns {Array<string>}
   */
  getSupportedInputs() {
    return [...this.supportedInputs];
  }
  
  /**
   * Get supported output formats for given input
   * @param {string} inputFormat - Input format extension
   * @returns {Array<string>}
   */
  getSupportedOutputs(inputFormat) {
    if (this.supportedInputs.includes(inputFormat.toLowerCase())) {
      return [...this.supportedOutputs];
    }
    return [];
  }
  
  /**
   * Validate input file
   * @param {File} file - File to validate
   * @returns {Object} - {isValid, error}
   */
  validateFile(file) {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }
    
    if (file.size === 0) {
      return { isValid: false, error: 'File is empty' };
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return { isValid: false, error: 'File too large (max 100MB)' };
    }
    
    const extension = file.name.split('.').pop().toLowerCase();
    if (!this.supportedInputs.includes(extension)) {
      return { 
        isValid: false, 
        error: `Unsupported file type: .${extension}` 
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * Generate output filename
   * @param {string} originalName - Original filename
   * @param {string} targetFormat - Target format extension
   * @returns {string}
   */
  getOutputFilename(originalName, targetFormat) {
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    return `${baseName}.${targetFormat}`;
  }
  
  /**
   * Sleep utility for simulating progress
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
