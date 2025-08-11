import { BaseConverter } from './BaseConverter';

export class PDFConverter extends BaseConverter {
  constructor() {
    super();
    this.supportedInputs = ['pdf'];
    this.supportedOutputs = ['png', 'jpg', 'jpeg', 'txt'];
  }
  
  async convert(file, targetFormat, options = {}) {
    const { onProgress } = options;
    
    if (onProgress) onProgress(5);
    
    // Validate conversion
    if (!this.canConvert('pdf', targetFormat)) {
      throw new Error(`Cannot convert PDF to ${targetFormat}`);
    }
    
    if (onProgress) onProgress(10);
    
    switch (targetFormat) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return await this.convertToImage(file, targetFormat, onProgress);
      case 'txt':
        return await this.convertToText(file, onProgress);
      default:
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }
  }
  
  async convertToImage(file, format, onProgress) {
    // Check if PDF.js is available
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library not loaded. Please refresh the page.');
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (onProgress) onProgress(20);
      
      // Configure PDF.js
      const loadingTask = window.pdfjsLib.getDocument({
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true,
        disableFontFace: false
      });
      
      const pdf = await loadingTask.promise;
      if (onProgress) onProgress(35);
      
      // Get first page (could be extended to handle multiple pages)
      const page = await pdf.getPage(1);
      if (onProgress) onProgress(50);
      
      // Set up canvas with high resolution
      const scale = 2.0;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      if (onProgress) onProgress(60);
      
      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        enableWebGL: false
      };
      
      await page.render(renderContext).promise;
      if (onProgress) onProgress(80);
      
      // Convert to blob
      const blob = await new Promise((resolve, reject) => {
        const mimeType = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
        const quality = format === 'jpg' || format === 'jpeg' ? 0.95 : undefined;
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, mimeType, quality);
      });
      
      if (onProgress) onProgress(95);
      
      return {
        blob,
        filename: this.getOutputFilename(file.name, format),
        type: blob.type
      };
      
    } catch (error) {
      console.error('PDF to image conversion error:', error);
      throw new Error(`Failed to convert PDF to image: ${error.message}`);
    }
  }
  
  async convertToText(file, onProgress) {
    // Check if PDF.js is available
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library not loaded. Please refresh the page.');
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (onProgress) onProgress(20);
      
      const loadingTask = window.pdfjsLib.getDocument({
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true
      });
      
      const pdf = await loadingTask.promise;
      if (onProgress) onProgress(30);
      
      let fullText = '';
      const numPages = pdf.numPages;
      const pagesToProcess = Math.min(numPages, 25); // Limit for performance
      
      // Add header information
      fullText += `Text extracted from: ${file.name}\n`;
      fullText += `Pages: ${pagesToProcess} of ${numPages}\n`;
      fullText += `Extraction date: ${new Date().toLocaleString()}\n`;
      fullText += '='.repeat(50) + '\n\n';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        if (textContent.items && textContent.items.length > 0) {
          textContent.items.forEach(item => {
            if (item.str && item.str.trim()) {
              pageText += item.str + ' ';
            }
          });
        }
        
        if (pageText.trim()) {
          fullText += `--- Page ${pageNum} ---\n`;
          fullText += pageText.trim() + '\n\n';
        }
        
        // Update progress
        const progressValue = 30 + (pageNum / pagesToProcess) * 50;
        if (onProgress) onProgress(progressValue);
      }
      
      // Handle case where no text was extracted
      if (fullText.split('\n').length <= 4) { // Only header lines
        fullText += 'No extractable text found in this PDF.\n\n';
        fullText += 'This PDF may contain:\n';
        fullText += '- Only images or scanned content\n';
        fullText += '- Text in unsupported fonts\n';
        fullText += '- Password protection\n';
        fullText += '- Complex formatting that prevents text extraction\n';
      }
      
      if (onProgress) onProgress(90);
      
      const blob = new Blob([fullText], { type: 'text/plain; charset=utf-8' });
      
      return {
        blob,
        filename: this.getOutputFilename(file.name, 'txt'),
        type: 'text/plain'
      };
      
    } catch (error) {
      console.error('PDF text extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }
  
  getOutputFilename(originalName, targetFormat) {
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    return `${baseName}.${targetFormat}`;
  }
}
