import { BaseConverter } from './BaseConverter';

export class TextConverter extends BaseConverter {
  constructor() {
    super();
    this.supportedInputs = ['txt', 'csv', 'json', 'md'];
    this.supportedOutputs = ['pdf', 'txt', 'html', 'md'];
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
    
    // Read text content
    const textContent = await this.readTextFile(file);
    if (onProgress) onProgress(30);
    
    switch (targetFormat) {
      case 'pdf':
        return await this.convertToPDF(textContent, file.name, onProgress);
      case 'html':
        return await this.convertToHTML(textContent, file.name, inputFormat, onProgress);
      case 'md':
        return await this.convertToMarkdown(textContent, file.name, inputFormat, onProgress);
      case 'txt':
        return await this.convertToText(textContent, file.name, inputFormat, onProgress);
      default:
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }
  }
  
  async readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      
      // Try to read as UTF-8 text
      reader.readAsText(file, 'UTF-8');
    });
  }
  
  async convertToPDF(textContent, originalName, onProgress) {
    // Check if PDF-lib is available
    if (!window.PDFLib) {
      throw new Error('PDF-lib library not loaded. Please refresh the page.');
    }
    
    try {
      const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
      
      // Create new PDF document
      const pdfDoc = await PDFDocument.create();
      if (onProgress) onProgress(40);
      
      // Embed font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
      
      // Page settings
      const pageWidth = 595; // A4 width in points
      const pageHeight = 842; // A4 height in points
      const margin = 50;
      const textWidth = pageWidth - (margin * 2);
      const textHeight = pageHeight - (margin * 2);
      
      if (onProgress) onProgress(50);
      
      // Split text into lines that fit the page width
      const lines = this.wrapText(textContent, font, fontSize, textWidth);
      const linesPerPage = Math.floor(textHeight / lineHeight);
      
      if (onProgress) onProgress(60);
      
      // Create pages and add text
      let currentPage = null;
      let currentY = 0;
      
      for (let i = 0; i < lines.length; i++) {
        // Create new page if needed
        if (i % linesPerPage === 0) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        
        // Draw line
        currentPage.drawText(lines[i], {
          x: margin,
          y: currentY,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        currentY -= lineHeight;
        
        // Update progress
        if (i % 100 === 0) {
          const progress = 60 + ((i / lines.length) * 20);
          if (onProgress) onProgress(progress);
        }
      }
      
      if (onProgress) onProgress(85);
      
      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      if (onProgress) onProgress(95);
      
      return {
        blob,
        filename: this.getOutputFilename(originalName, 'pdf'),
        type: 'application/pdf'
      };
      
    } catch (error) {
      console.error('Text to PDF conversion error:', error);
      throw new Error(`Failed to convert text to PDF: ${error.message}`);
    }
  }
  
  async convertToHTML(textContent, originalName, inputFormat, onProgress) {
    let htmlContent = '';
    
    if (inputFormat === 'md') {
      // Simple markdown to HTML conversion
      htmlContent = this.markdownToHTML(textContent);
    } else if (inputFormat === 'csv') {
      // CSV to HTML table
      htmlContent = this.csvToHTML(textContent);
    } else if (inputFormat === 'json') {
      // JSON to formatted HTML
      htmlContent = this.jsonToHTML(textContent);
    } else {
      // Plain text to HTML
      htmlContent = this.textToHTML(textContent);
    }
    
    if (onProgress) onProgress(70);
    
    // Wrap in full HTML document
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${originalName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
    
    if (onProgress) onProgress(90);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    
    return {
      blob,
      filename: this.getOutputFilename(originalName, 'html'),
      type: 'text/html'
    };
  }
  
  async convertToMarkdown(textContent, originalName, inputFormat, onProgress) {
    let mdContent = '';
    
    if (inputFormat === 'html') {
      // Basic HTML to Markdown (simplified)
      mdContent = this.htmlToMarkdown(textContent);
    } else if (inputFormat === 'csv') {
      // CSV to Markdown table
      mdContent = this.csvToMarkdown(textContent);
    } else {
      // Plain text to Markdown (add title)
      mdContent = `# ${originalName}\n\n${textContent}`;
    }
    
    if (onProgress) onProgress(80);
    
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    
    return {
      blob,
      filename: this.getOutputFilename(originalName, 'md'),
      type: 'text/markdown'
    };
  }
  
  async convertToText(textContent, originalName, inputFormat, onProgress) {
    let textOutput = textContent;
    
    if (inputFormat === 'csv') {
      // Format CSV as readable text
      textOutput = this.csvToText(textContent);
    } else if (inputFormat === 'json') {
      // Format JSON as readable text
      textOutput = this.jsonToText(textContent);
    } else if (inputFormat === 'md') {
      // Strip markdown formatting
      textOutput = this.markdownToText(textContent);
    }
    
    if (onProgress) onProgress(80);
    
    const blob = new Blob([textOutput], { type: 'text/plain' });
    
    return {
      blob,
      filename: this.getOutputFilename(originalName, 'txt'),
      type: 'text/plain'
    };
  }
  
  // Utility methods for text processing
  wrapText(text, font, fontSize, maxWidth) {
    const lines = text.split('\n');
    const wrappedLines = [];
    
    lines.forEach(line => {
      if (line.trim() === '') {
        wrappedLines.push('');
        return;
      }
      
      const words = line.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            wrappedLines.push(currentLine);
          }
          currentLine = word;
        }
      });
      
      if (currentLine) {
        wrappedLines.push(currentLine);
      }
    });
    
    return wrappedLines;
  }
  
  markdownToHTML(markdown) {
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
  
  textToHTML(text) {
    return `<pre>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
  }
  
  csvToHTML(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return '<p>Empty CSV file</p>';
    
    let html = '<table>';
    
    lines.forEach((line, index) => {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      const tag = index === 0 ? 'th' : 'td';
      
      html += '<tr>';
      cells.forEach(cell => {
        html += `<${tag}>${cell}</${tag}>`;
      });
      html += '</tr>';
    });
    
    html += '</table>';
    return html;
  }
  
  csvToMarkdown(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return 'Empty CSV file';
    
    let md = '';
    
    lines.forEach((line, index) => {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      md += '| ' + cells.join(' | ') + ' |\n';
      
      if (index === 0) {
        md += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
      }
    });
    
    return md;
  }
  
  csvToText(csv) {
    const lines = csv.trim().split('\n');
    let text = '';
    
    lines.forEach((line, index) => {
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      text += cells.join('\t') + '\n';
    });
    
    return text;
  }
  
  jsonToHTML(jsonText) {
    try {
      const obj = JSON.parse(jsonText);
      const formatted = JSON.stringify(obj, null, 2);
      return `<pre><code>${formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    } catch (error) {
      return `<p>Invalid JSON format</p><pre>${jsonText}</pre>`;
    }
  }
  
  jsonToText(jsonText) {
    try {
      const obj = JSON.parse(jsonText);
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return jsonText;
    }
  }
  
  markdownToText(markdown) {
    return markdown
      .replace(/^#+\s/gm, '')  // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
      .replace(/\*(.*?)\*/g, '$1')  // Remove italic
      .replace(/`(.*?)`/g, '$1')  // Remove code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links, keep text
      .trim();
  }
  
  htmlToMarkdown(html) {
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<[^>]*>/g, '')  // Remove remaining HTML tags
      .trim();
  }
}
