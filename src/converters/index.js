import { PDFConverter } from './pdfConverter';
import { ImageConverter } from './imageConverter';
import { TextConverter } from './textConverter';
// import { DocxConverter } from './docxConverter'; // Future implementation

export class ConverterFactory {
  static converters = new Map();
  
  // Initialize converters
  static {
    this.registerConverter('pdf', new PDFConverter());
    this.registerConverter('image', new ImageConverter());
    this.registerConverter('text', new TextConverter());
    // this.registerConverter('docx', new DocxConverter()); // Future
  }
  
  /**
   * Register a converter for specific file types
   * @param {string} type - Converter type identifier
   * @param {BaseConverter} converter - Converter instance
   */
  static registerConverter(type, converter) {
    this.converters.set(type, converter);
  }
  
  /**
   * Get appropriate converter for input/output format combination
   * @param {string} inputFormat - Input file extension
   * @param {string} outputFormat - Target format extension
   * @returns {BaseConverter|null}
   */
  static getConverter(inputFormat, outputFormat) {
    const input = inputFormat.toLowerCase();
    const output = outputFormat.toLowerCase();
    
    // Try each converter to see if it can handle the conversion
    for (const [type, converter] of this.converters) {
      if (converter.canConvert(input, output)) {
        return converter;
      }
    }
    
    return null;
  }
  
  /**
   * Get all supported input formats
   * @returns {Array<string>}
   */
  static getSupportedInputFormats() {
    const formats = new Set();
    
    for (const [type, converter] of this.converters) {
      converter.getSupportedInputs().forEach(format => formats.add(format));
    }
    
    return Array.from(formats).sort();
  }
  
  /**
   * Get supported output formats for a given input format
   * @param {string} inputFormat - Input format extension
   * @returns {Array<Object>} Array of {value, label, icon} objects
   */
  static getSupportedOutputFormats(inputFormat) {
    const input = inputFormat.toLowerCase();
    const outputs = new Set();
    
    for (const [type, converter] of this.converters) {
      if (converter.getSupportedInputs().includes(input)) {
        converter.getSupportedOutputs(input).forEach(format => outputs.add(format));
      }
    }
    
    // Convert to format objects with metadata
    return Array.from(outputs)
      .filter(format => format !== input) // Don't include same format
      .map(format => this.getFormatInfo(format))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  
  /**
   * Get format information including label and icon
   * @param {string} format - Format extension
   * @returns {Object} - {value, label, icon}
   */
  static getFormatInfo(format) {
    const formatInfo = {
      'pdf': { label: 'PDF Document', icon: '📄' },
      'png': { label: 'PNG Image', icon: '🖼️' },
      'jpg': { label: 'JPEG Image', icon: '📸' },
      'jpeg': { label: 'JPEG Image', icon: '📸' },
      'webp': { label: 'WebP Image', icon: '🌐' },
      'gif': { label: 'GIF Image', icon: '🎞️' },
      'bmp': { label: 'BMP Image', icon: '🖼️' },
      'txt': { label: 'Text File', icon: '📝' },
      'docx': { label: 'Word Document', icon: '📝' },
      'xlsx': { label: 'Excel Spreadsheet', icon: '📊' },
      'csv': { label: 'CSV File', icon: '📈' }
    };
    
    const info = formatInfo[format.toLowerCase()] || { 
      label: format.toUpperCase(), 
      icon: '📄' 
    };
    
    return {
      value: format,
      label: info.label,
      icon: info.icon
    };
  }
  
  /**
   * Check if a specific conversion is supported
   * @param {string} inputFormat - Input format extension
   * @param {string} outputFormat - Output format extension
   * @returns {boolean}
   */
  static isConversionSupported(inputFormat, outputFormat) {
    return this.getConverter(inputFormat, outputFormat) !== null;
  }
  
  /**
   * Get conversion capabilities matrix
   * @returns {Object} - Format conversion matrix
   */
  static getConversionMatrix() {
    const matrix = {};
    const inputFormats = this.getSupportedInputFormats();
    
    inputFormats.forEach(input => {
      matrix[input] = this.getSupportedOutputFormats(input);
    });
    
    return matrix;
  }
  
  /**
   * Validate if a file can be processed
   * @param {File} file - File to validate
   * @returns {Object} - {isValid, error, supportedOutputs}
   */
  static validateFile(file) {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }
    
    const extension = file.name.split('.').pop().toLowerCase();
    const supportedInputs = this.getSupportedInputFormats();
    
    if (!supportedInputs.includes(extension)) {
      return {
        isValid: false,
        error: `Unsupported file type: .${extension}. Supported: ${supportedInputs.join(', ')}`
      };
    }
    
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'File too large (maximum 100MB)'
      };
    }
    
    // Get supported outputs for this input
    const supportedOutputs = this.getSupportedOutputFormats(extension);
    
    if (supportedOutputs.length === 0) {
      return {
        isValid: false,
        error: `No conversion options available for .${extension} files`
      };
    }
    
    return {
      isValid: true,
      supportedOutputs
    };
  }
}
