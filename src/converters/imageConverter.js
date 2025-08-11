import { BaseConverter } from './BaseConverter';

export class ImageConverter extends BaseConverter {
  constructor() {
    super();
    this.supportedInputs = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
    this.supportedOutputs = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
  }
  
  async convert(file, targetFormat, options = {}) {
    const { onProgress } = options;
    
    if (onProgress) onProgress(5);
    
    // Validate conversion
    const inputFormat = file.name.split('.').pop().toLowerCase();
    if (!this.canConvert(inputFormat, targetFormat)) {
      throw new Error(`Cannot convert ${inputFormat} to ${targetFormat}`);
    }
    
    if (onProgress) onProgress(10);
    
    switch (targetFormat) {
      case 'pdf':
        return await this.convertToPDF(file, onProgress);
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return await this.convertToImage(file, targetFormat, onProgress);
      default:
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }
  }
  
  async convertToPDF(file, onProgress) {
    // Check if PDF-lib is available
    if (!window.PDFLib) {
      throw new Error('PDF-lib library not loaded. Please refresh the page.');
    }
    
    try {
      const { PDFDocument } = window.PDFLib;
      
      // Create new PDF document
      const pdfDoc = await PDFDocument.create();
      if (onProgress) onProgress(25);
      
      // Read image file
      const imageBytes = await file.arrayBuffer();
      if (onProgress) onProgress(40);
      
      // Embed image based on type
      let image;
      const fileType = file.type.toLowerCase();
      
      if (fileType.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (fileType.includes('jpg') || fileType.includes('jpeg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        // For other formats, convert to PNG first
        const pngBytes = await this.convertImageToBytes(file, 'png');
        image = await pdfDoc.embedPng(pngBytes);
      }
      
      if (onProgress) onProgress(60);
      
      // Get image dimensions and scale to fit page
      const { width, height } = image;
      const maxWidth = 550;
      const maxHeight = 750;
      
      let scale = 1;
      if (width > maxWidth || height > maxHeight) {
        scale = Math.min(maxWidth / width, maxHeight / height);
      }
      
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      
      // Add page and draw image
      const page = pdfDoc.addPage([scaledWidth + 50, scaledHeight + 50]);
      page.drawImage(image, {
        x: 25,
        y: 25,
        width: scaledWidth,
        height: scaledHeight,
      });
      
      if (onProgress) onProgress(80);
      
      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      if (onProgress) onProgress(95);
      
      return {
        blob,
        filename: this.getOutputFilename(file.name, 'pdf'),
        type: 'application/pdf'
      };
      
    } catch (error) {
      console.error('Image to PDF conversion error:', error);
      throw new Error(`Failed to convert image to PDF: ${error.message}`);
    }
  }
  
  async convertToImage(file, targetFormat, onProgress) {
    try {
      // Create canvas and load image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (onProgress) onProgress(20);
      
      // Load image
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      
      await imageLoadPromise;
      if (onProgress) onProgress(40);
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      if (onProgress) onProgress(60);
      
      // Convert to target format
      const mimeType = this.getMimeType(targetFormat);
      const quality = (targetFormat === 'jpg' || targetFormat === 'jpeg') ? 0.9 : undefined;
      
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, mimeType, quality);
      });
      
      if (onProgress) onProgress(90);
      
      // Clean up
      URL.revokeObjectURL(img.src);
      
      return {
        blob,
        filename: this.getOutputFilename(file.name, targetFormat),
        type: mimeType
      };
      
    } catch (error) {
      console.error('Image conversion error:', error);
      throw new Error(`Failed to convert image: ${error.message}`);
    }
  }
  
  async convertImageToBytes(file, targetFormat) {
    const result = await this.convertToImage(file, targetFormat, () => {});
    return await result.blob.arrayBuffer();
  }
  
  getMimeType(format) {
    const mimeTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'bmp': 'image/bmp'
    };
    
    return mimeTypes[format.toLowerCase()] || 'image/png';
  }
  
  // Override to handle same-format "conversions" (useful for compression/optimization)
  canConvert(inputFormat, outputFormat) {
    const input = inputFormat.toLowerCase();
    const output = outputFormat.toLowerCase();
    
    // Allow same format conversions for optimization
    if (input === output) {
      return this.supportedInputs.includes(input);
    }
    
    return super.canConvert(inputFormat, outputFormat);
  }
}
