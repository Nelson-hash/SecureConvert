export class ResultDisplay {
  constructor(options = {}) {
    this.onDownload = options.onDownload || (() => {});
    this.isVisible = false;
    this.currentResult = null;
  }
  
  render() {
    return `
      <div class="result" id="result" style="display: none;">
        <div class="result-header">
          <h3 class="result-title">✅ Conversion Complete!</h3>
          <div class="result-time" id="resultTime"></div>
        </div>
        
        <div class="result-content">
          <p class="result-message" id="resultMessage">Your file has been converted successfully.</p>
          
          <div class="result-details" id="resultDetails">
            <!-- File details will be populated here -->
          </div>
          
          <div class="result-preview" id="resultPreview" style="display: none;">
            <!-- Preview will be shown here if applicable -->
          </div>
        </div>
        
        <div class="result-actions">
          <button class="download-btn primary" id="downloadBtn">
            📥 Download Converted File
          </button>
          <button class="convert-another-btn secondary" id="convertAnotherBtn">
            🔄 Convert Another File
          </button>
        </div>
      </div>
    `;
  }
  
  show(data) {
    this.isVisible = true;
    this.currentResult = data;
    
    const element = document.getElementById('result');
    const messageEl = document.getElementById('resultMessage');
    const detailsEl = document.getElementById('resultDetails');
    const timeEl = document.getElementById('resultTime');
    const downloadBtn = document.getElementById('downloadBtn');
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    
    if (element) {
      element.style.display = 'block';
      
      // Set conversion time
      if (timeEl) {
        const now = new Date();
        timeEl.textContent = `Converted at ${now.toLocaleTimeString()}`;
      }
      
      // Set file details
      if (detailsEl && data) {
        detailsEl.innerHTML = `
          <div class="file-comparison">
            <div class="file-item original">
              <div class="file-label">📄 Original</div>
              <div class="file-name">${data.originalFile}</div>
            </div>
            
            <div class="conversion-arrow">→</div>
            
            <div class="file-item converted">
              <div class="file-label">✨ Converted</div>
              <div class="file-name">${data.convertedFile}</div>
              <div class="file-size">${data.fileSize}</div>
            </div>
          </div>
        `;
      }
      
      // Set up download button
      if (downloadBtn) {
        downloadBtn.onclick = () => {
          this.onDownload();
          this.showDownloadFeedback();
        };
      }
      
      // Set up convert another button
      if (convertAnotherBtn) {
        convertAnotherBtn.onclick = () => {
          this.hide();
          // Could emit an event or call a callback to reset the app
          window.location.reload(); // Simple solution for now
        };
      }
      
      // Add success animation
      element.classList.add('result-appear');
      setTimeout(() => {
        element.classList.remove('result-appear');
      }, 500);
      
      // Scroll to result
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  hide() {
    this.isVisible = false;
    this.currentResult = null;
    
    const element = document.getElementById('result');
    if (element) {
      element.style.display = 'none';
    }
  }
  
  showDownloadFeedback() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      const originalText = downloadBtn.textContent;
      downloadBtn.textContent = '✅ Downloaded!';
      downloadBtn.disabled = true;
      
      setTimeout(() => {
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
      }, 2000);
    }
  }
  
  showPreview(previewData) {
    const previewEl = document.getElementById('resultPreview');
    if (previewEl && previewData) {
      previewEl.style.display = 'block';
      
      if (previewData.type === 'image') {
        previewEl.innerHTML = `
          <div class="preview-container">
            <div class="preview-label">Preview:</div>
            <img src="${previewData.url}" alt="Converted image preview" class="preview-image" />
          </div>
        `;
      } else if (previewData.type === 'text') {
        previewEl.innerHTML = `
          <div class="preview-container">
            <div class="preview-label">Text Preview:</div>
            <div class="preview-text">${previewData.content.substring(0, 200)}...</div>
          </div>
        `;
      }
    }
  }
  
  getCurrentResult() {
    return this.currentResult;
  }
  
  isShowing() {
    return this.isVisible;
  }
}
